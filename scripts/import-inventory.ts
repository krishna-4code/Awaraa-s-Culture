/**
 * scripts/import-inventory.ts
 *
 * ONE-TIME inventory import from awaraas-culture-inventory-template.xlsx -> Sanity.
 *
 * Usage:
 *   npx tsx scripts/import-inventory.ts --dry-run   # preview, no writes
 *   npx tsx scripts/import-inventory.ts             # live write to Sanity
 *
 * Reads token from SANITY_WRITE_TOKEN in .env.local (NOT NEXT_PUBLIC_*).
 * Never call this from app code -- it is a standalone Node.js script only.
 *
 * Branch: explore/bright-genre
 */

import path from 'path'
import fs from 'fs'
import * as ExcelJS from 'exceljs'
import { createClient, type SanityClient } from '@sanity/client'
import * as dotenv from 'dotenv'

// -- 0. Bootstrap env --------------------------------------------------------

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const API_VER    = '2024-02-09'

// The write token is intentionally a different env var from the read-only
// SANITY_API_TOKEN used by the Next.js app -- keep them separate.
const WRITE_TOKEN = process.env.SANITY_WRITE_TOKEN

// -- 1. CLI flags ------------------------------------------------------------

const DRY_RUN = process.argv.includes('--dry-run')

// -- 2. Spreadsheet location -------------------------------------------------

// Drop the .xlsx file into the project root and it will be found automatically.
// Override with: INVENTORY_XLSX=/absolute/path/to/file.xlsx
const defaultXlsx = fs.existsSync(path.resolve(process.cwd(), 'awaraas-culture-inventory-filled.xlsx'))
  ? path.resolve(process.cwd(), 'awaraas-culture-inventory-filled.xlsx')
  : path.resolve(process.cwd(), 'awaraas-culture-inventory-template.xlsx');

const XLSX_PATH = process.env.INVENTORY_XLSX ?? defaultXlsx;

// -- 3. Schema-aware types ---------------------------------------------------
// These mirror src/sanity/schemaTypes/product.ts exactly.
// If the schema changes, update here too.

interface VariantPayload {
  _type: 'variant'
  _key: string
  size: string
  color: string
  colorHex?: string
  stock: number
  // NOTE: cost price is NEVER included -- internal margin tracking only.
  // NOTE: price lives on the product level (schema has no per-variant price).
}

interface ProductPayload {
  _type: 'product'
  _id: string
  name: string
  slug: { _type: 'slug'; current: string }
  collection: { _type: 'reference'; _ref: string }
  price: number
  description: string
  materials: string[]
  shippingPolicy: string
  returnPolicy: string
  careInstructions: string
  variants: VariantPayload[]
  images: never[]
  isPlaceholder: false
}

// -- 4. Spreadsheet row ------------------------------------------------------

interface SpreadsheetRow {
  sku:            string
  productName:    string
  category:       string
  color:          string
  size:           string
  costPrice:      number  // internal only -- never written to Sanity
  sellingPrice:   number
  stockQty:       number
  imageFilenames: string[]
  materialsNotes: string
}

// -- 5. Helpers --------------------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

function productId(slug: string): string {
  return `product-import-${slug}`
}

function variantKey(size: string, color: string): string {
  return slugify(`${size}-${color}`)
}

function cellText(cell: ExcelJS.Cell): string {
  const v = cell.value
  if (v === null || v === undefined) return ''
  if (typeof v === 'object' && v !== null && 'result' in v) {
    const fv = v as { result?: unknown }
    return String(fv.result ?? '').trim()
  }
  return String(v).trim()
}

function cellNumber(cell: ExcelJS.Cell): number {
  const v = cell.value
  if (v === null || v === undefined) return 0
  if (typeof v === 'object' && v !== null && 'result' in v) {
    const fv = v as { result?: unknown }
    const r = fv.result
    return typeof r === 'number' ? r : parseFloat(String(r)) || 0
  }
  return typeof v === 'number' ? v : parseFloat(String(v)) || 0
}

// -- 6. Read spreadsheet -----------------------------------------------------

async function readSpreadsheet(filePath: string): Promise<SpreadsheetRow[]> {
  if (!fs.existsSync(filePath)) {
    console.error(`\nSpreadsheet not found: ${filePath}`)
    console.error('Drop the .xlsx file into the project root, or set INVENTORY_XLSX=/path/to/file.xlsx\n')
    process.exit(1)
  }

  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(filePath)

  const sheet = workbook.getWorksheet('Inventory')
  if (!sheet) {
    console.error('\nNo worksheet named "Inventory" found in the spreadsheet.')
    console.error('Check the sheet tab name -- it must be exactly "Inventory".\n')
    process.exit(1)
  }

  // Row 1 is the header. Data starts at row 2.
  // Columns: SKU(1) | Product Name(2) | Category(3) | Color(4) | Size UK(5)
  //   Cost Price(6) | Selling Price(7) | Margin%(8 skip) | Stock Qty(9)
  //   Status(10 skip) | Image Filename(s)(11) | Materials/Notes(12)

  const rows: SpreadsheetRow[] = []

  sheet.eachRow({ includeEmpty: false }, (row, rowIndex) => {
    if (rowIndex === 1) return

    const productName = cellText(row.getCell(2)).trim()
    if (!productName) return

    const imageRaw = cellText(row.getCell(11)).trim()
    const imageFilenames = imageRaw
      ? imageRaw.split(/[,;|\n]+/).map(f => f.trim()).filter(Boolean)
      : []

    rows.push({
      sku:            cellText(row.getCell(1)),
      productName,
      category:       cellText(row.getCell(3)),
      color:          cellText(row.getCell(4)),
      size:           cellText(row.getCell(5)),
      costPrice:      cellNumber(row.getCell(6)),
      sellingPrice:   cellNumber(row.getCell(7)),
      stockQty:       Math.round(cellNumber(row.getCell(9))),
      imageFilenames,
      materialsNotes: cellText(row.getCell(12)),
    })
  })

  return rows
}

// -- 7. Group rows into product documents ------------------------------------

interface ProductGroup {
  name:           string
  slug:           string
  category:       string
  price:          number
  materialsNotes: string
  variants: Array<{
    sku:            string
    size:           string
    color:          string
    stock:          number
    costPrice:      number
    imageFilenames: string[]
  }>
}

function groupRows(rows: SpreadsheetRow[]): ProductGroup[] {
  const map = new Map<string, ProductGroup>()

  for (const row of rows) {
    const slug = slugify(row.productName)
    if (!map.has(slug)) {
      map.set(slug, {
        name:           row.productName,
        slug,
        category:       row.category,
        price:          row.sellingPrice,
        materialsNotes: row.materialsNotes,
        variants:       [],
      })
    }

    const group = map.get(slug)!
    if (row.sellingPrice > group.price) group.price = row.sellingPrice

    if (row.materialsNotes && !group.materialsNotes.includes(row.materialsNotes)) {
      group.materialsNotes = group.materialsNotes
        ? `${group.materialsNotes}; ${row.materialsNotes}`
        : row.materialsNotes
    }

    group.variants.push({
      sku:            row.sku,
      size:           row.size,
      color:          row.color,
      stock:          row.stockQty,
      costPrice:      row.costPrice,
      imageFilenames: row.imageFilenames,
    })
  }

  return Array.from(map.values())
}

// -- 8. Build Sanity payloads ------------------------------------------------

async function resolveOrCreateCollection(
  client: SanityClient,
  categoryName: string,
  dryRun: boolean
): Promise<string> {
  const slug = slugify(categoryName)
  const id   = `collection-import-${slug}`

  if (!dryRun) {
    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "collection" && _id == $id][0]{ _id }`,
      { id }
    )
    if (!existing) {
      await client.createOrReplace({
        _type: 'collection', _id: id,
        title: categoryName,
        slug:  { _type: 'slug', current: slug },
        description:   '',
        isPlaceholder: false,
      })
      console.log(`  Created collection: ${categoryName}`)
    }
  }

  return id
}

function buildProductPayload(group: ProductGroup, collectionRef: string): ProductPayload {
  const slug = slugify(group.name)

  const materials = group.materialsNotes
    ? group.materialsNotes.split(/[;,\n]+/).map(m => m.trim()).filter(Boolean)
    : []

  const variants: VariantPayload[] = group.variants.map(v => ({
    _type: 'variant' as const,
    _key:  variantKey(v.size, v.color),
    size:  v.size,
    color: v.color,
    stock: v.stock,
    // costPrice intentionally omitted
  }))

  return {
    _type: 'product',
    _id:   productId(slug),
    name:  group.name,
    slug:  { _type: 'slug', current: slug },
    collection: { _type: 'reference', _ref: collectionRef },
    price: group.price,
    description: '',
    materials,
    shippingPolicy:   'Free shipping across India on prepaid orders.',
    returnPolicy:     '14-day returns for unworn products.',
    careInstructions: 'Wipe clean with a damp cloth. Avoid direct heat.',
    variants,
    images: [],
    isPlaceholder: false,
  }
}

// -- 9. Image manifest -------------------------------------------------------

interface ManifestEntry {
  product:       string
  slug:          string
  sku:           string
  size:          string
  color:         string
  images:        string[]
  missingImages: boolean
}

function buildManifest(groups: ProductGroup[]): ManifestEntry[] {
  return groups.flatMap(g =>
    g.variants.map(v => ({
      product:       g.name,
      slug:          g.slug,
      sku:           v.sku,
      size:          v.size,
      color:         v.color,
      images:        v.imageFilenames,
      missingImages: v.imageFilenames.length === 0,
    }))
  )
}

// -- 10. Main ----------------------------------------------------------------

async function main() {
  console.log('\n=======================================================')
  console.log("  Awaraa's Culture -- Inventory Import Script")
  console.log(`  Mode:    ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE (writing to Sanity)'}`)
  console.log(`  Dataset: ${PROJECT_ID} / ${DATASET}`)
  console.log(`  File:    ${XLSX_PATH}`)
  console.log('=======================================================\n')

  if (!DRY_RUN) {
    if (!WRITE_TOKEN) {
      console.error('SANITY_WRITE_TOKEN is not set in .env.local.')
      console.error('Add your Editor/Developer-level Sanity API token:')
      console.error('  SANITY_WRITE_TOKEN="skXXXXX..."')
      console.error('Get it from: https://sanity.io/manage -> your project -> API -> Tokens\n')
      process.exit(1)
    }
    if (!PROJECT_ID) {
      console.error('NEXT_PUBLIC_SANITY_PROJECT_ID is not set in .env.local.\n')
      process.exit(1)
    }
  }

  const client = createClient({
    projectId:  PROJECT_ID ?? 'unknown',
    dataset:    DATASET,
    apiVersion: API_VER,
    token:      WRITE_TOKEN,
    useCdn:     false,
  })

  console.log('Reading spreadsheet...')
  const rows = await readSpreadsheet(XLSX_PATH)
  console.log(`  Found ${rows.length} data rows.\n`)

  if (rows.length === 0) {
    console.warn('No data rows found. Check the sheet name is "Inventory" and row 1 is the header.\n')
    process.exit(0)
  }

  const groups = groupRows(rows)
  console.log(`Grouped into ${groups.length} product(s) with ${rows.length} total variant(s).\n`)

  const categorySet = new Set(groups.map(g => g.category).filter(Boolean))
  const collectionRefMap = new Map<string, string>()

  console.log(`Resolving ${categorySet.size} collection(s)...`)
  for (const cat of categorySet) {
    const ref = await resolveOrCreateCollection(client, cat, DRY_RUN)
    collectionRefMap.set(cat, ref)
    if (DRY_RUN) console.log(`  [DRY] Would ensure collection: ${cat} (id: ${ref})`)
  }
  console.log()

  let created = 0, updated = 0, skipped = 0

  for (const group of groups) {
    const collectionRef = collectionRefMap.get(group.category) ?? `collection-import-${slugify(group.category)}`
    const payload = buildProductPayload(group, collectionRef)

    if (DRY_RUN) {
      console.log(`  [DRY] Would createOrReplace: ${group.name}`)
      console.log(`        _id:      ${payload._id}`)
      console.log(`        variants: ${payload.variants.length}`)
      console.log(`        price:    Rs.${payload.price}`)
      console.log(`        images:   (empty -- upload manually via Studio)`)
      console.log()
      created++
      continue
    }

    try {
      const existing = await client.fetch<{ _id: string } | null>(
        `*[_type == "product" && _id == $id][0]{ _id }`,
        { id: payload._id }
      )

      if (existing) {
        // ── EXISTING PRODUCT: Patch non-inventory fields only ──────────────
        // NEVER overwrite stock values on an existing product — doing so
        // would erase real sales data with stale spreadsheet numbers.
        // Only update: name, slug, price, description, materials, and policies.
        // To restock, use the admin dashboard or adjustStock() directly.
        await client
          .patch(payload._id)
          .set({
            name: payload.name,
            slug: payload.slug,
            collection: payload.collection,
            price: payload.price,
            description: payload.description,
            materials: payload.materials,
            shippingPolicy: payload.shippingPolicy,
            returnPolicy: payload.returnPolicy,
            careInstructions: payload.careInstructions,
            isPlaceholder: false,
          })
          // Only add NEW variants (by _key) that don't exist yet
          // This does NOT touch existing variants and their live stock values
          .commit()

        // Now add any variant _keys from the spreadsheet that are not yet in Sanity
        const existingDoc = await client.fetch<{ variants: Array<{_key: string}> } | null>(
          `*[_type == "product" && _id == $id][0]{ variants[]{_key} }`,
          { id: payload._id }
        )
        const existingKeys = new Set((existingDoc?.variants || []).map(v => v._key))
        const newVariants = payload.variants.filter(v => !existingKeys.has(v._key))
        if (newVariants.length > 0) {
          await client
            .patch(payload._id)
            .append('variants', newVariants)
            .commit()
          console.log(`  Updated:  ${group.name}  (patched metadata + ${newVariants.length} new variant(s) added; existing stock PRESERVED)`)
        } else {
          console.log(`  Updated:  ${group.name}  (patched metadata only; all variants existed — stock PRESERVED)`)
        }
        updated++
      } else {
        // ── NEW PRODUCT: Full createOrReplace is safe ──────────────────────
        // First import — no live sales data to protect.
        await client.createOrReplace(payload)
        console.log(`  Created:  ${group.name}  (${payload.variants.length} variants)`)
        created++
      }
    } catch (err) {
      skipped++
      console.error(`  Failed:   ${group.name} -- ${(err as Error).message}`)
    }
  }

  const manifest = buildManifest(groups)
  const manifestPath = path.resolve(process.cwd(), 'scripts', 'image-upload-manifest.json')
  const missingCount = manifest.filter(e => e.missingImages).length
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true })
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8')

  console.log('\n=======================================================')
  console.log('  IMPORT SUMMARY')
  console.log('=======================================================')

  if (DRY_RUN) {
    console.log(`  Products that WOULD be created/replaced: ${created}`)
    console.log(`  Total variants:                          ${rows.length}`)
  } else {
    console.log(`  Products created: ${created}`)
    console.log(`  Products updated: ${updated}`)
    console.log(`  Products failed:  ${skipped}`)
    console.log(`  Total variants:   ${rows.length}`)
  }

  console.log()
  console.log(`  Image manifest: ${manifestPath}`)
  console.log()

  if (missingCount > 0) {
    console.log(`  WARNING: ${missingCount} variant(s) have no image filenames.`)
    console.log('  They are flagged with "missingImages": true in the manifest.')
  }

  const allFilenames = [...new Set(manifest.flatMap(e => e.images))]
  if (allFilenames.length > 0) {
    console.log()
    console.log(`  ${allFilenames.length} unique image filename(s) need upload via Sanity Studio:`)
    allFilenames.forEach(f => console.log(`    - ${f}`))
  }

  console.log()
  if (DRY_RUN) {
    console.log('  This was a DRY RUN. Re-run without --dry-run to write for real.')
  } else {
    console.log('  Done. Open Sanity Studio to upload images and fill in descriptions.')
  }
  console.log('=======================================================\n')
}

main().catch(err => {
  console.error('\nUnhandled error:', err)
  process.exit(1)
})
