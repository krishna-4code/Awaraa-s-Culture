import { defineField, defineType } from 'sanity'

// Controlled vocabulary for sizes — prevents "S" vs "Small" data inconsistency
const SIZE_OPTIONS = [
  { title: 'UK 6', value: 'UK 6' },
  { title: 'UK 7', value: 'UK 7' },
  { title: 'UK 8', value: 'UK 8' },
  { title: 'UK 9', value: 'UK 9' },
  { title: 'UK 10', value: 'UK 10' },
  { title: 'UK 11', value: 'UK 11' },
  { title: 'UK 12', value: 'UK 12' },
]

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',

  // Studio preview: show the first image and name in the document list
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
      media: 'images.0',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || '[[PLACEHOLDER]]',
        subtitle: subtitle ? `₹${subtitle}` : 'No price set',
        media,
      }
    },
  },

  fields: [
    // ── Core identity ──────────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      description: 'The display name shown on the storefront.',
      validation: (Rule) => Rule.required().min(2).max(120),
    }),

    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'Auto-generated from the name. Used in the product URL.',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'collection',
      title: 'Collection',
      type: 'reference',
      to: [{ type: 'collection' }],
      description: 'Which collection does this product belong to?',
      validation: (Rule) => Rule.required(),
    }),

    // ── Pricing ────────────────────────────────────────────────────────────
    defineField({
      name: 'price',
      title: 'Price (₹)',
      type: 'number',
      description: 'Base price in Indian Rupees. Variants can override this in future.',
      validation: (Rule) => Rule.required().min(0),
    }),

    // ── Media ──────────────────────────────────────────────────────────────
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      description: 'Upload at least one image. First image is used as the thumbnail.',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Describe the image for screen readers and SEO.',
              validation: (Rule) => Rule.required().warning('Alt text is required for accessibility.'),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1).error('At least one image is required.'),
    }),

    // ── Description ────────────────────────────────────────────────────────
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
      description: 'The main product description shown on the product page.',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'materials',
      title: 'Materials',
      type: 'array',
      description: 'List of materials used (e.g. "Full-grain leather upper"). One per line.',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),

    // ── Policies (editable per-product, not hardcoded) ─────────────────────
    defineField({
      name: 'shippingPolicy',
      title: 'Shipping Policy',
      type: 'string',
      initialValue: 'Delhi: ₹100 delivery • Outside Delhi: Book Porter (own charges)',
    }),

    defineField({
      name: 'returnPolicy',
      title: 'Return Policy',
      type: 'string',
      initialValue: '14-day returns for unworn products.',
    }),

    defineField({
      name: 'careInstructions',
      title: 'Care Instructions',
      type: 'string',
      initialValue: 'Wipe clean with a damp cloth. Avoid direct heat.',
    }),

    // ── Inventory Variants ─────────────────────────────────────────────────
    // Each variant is a specific size+color pairing with its own stock count.
    // A product with 3 sizes × 2 colors = 6 independent variant records.
    // A variant at stock: 0 is out of stock independently of all others.
    defineField({
      name: 'variants',
      title: 'Inventory Variants',
      type: 'array',
      description:
        'Add one entry per size + color combination. Each has its own stock level. ' +
        'Setting stock to 0 marks that specific combination as out of stock.',
      of: [
        {
          type: 'object',
          name: 'variant',
          fields: [
            defineField({
              name: 'size',
              title: 'Size',
              type: 'string',
              options: {
                list: SIZE_OPTIONS,
                layout: 'radio',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'color',
              title: 'Color',
              type: 'string',
              description: 'E.g. "Midnight Black", "Tan", "Natural White".',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'colorHex',
              title: 'Color Swatch (hex)',
              type: 'string',
              description: 'Optional hex code for the colour swatch in the UI (e.g. #1A1A1A).',
              validation: (Rule) =>
                Rule.regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/).warning(
                  'Must be a valid hex code like #1A1A1A'
                ),
            }),
            defineField({
              name: 'stock',
              title: 'Stock Quantity',
              type: 'number',
              description: '0 = this specific size+color is out of stock.',
              initialValue: 0,
              validation: (Rule) => Rule.required().min(0).integer(),
            }),
          ],
          preview: {
            select: {
              size: 'size',
              color: 'color',
              stock: 'stock',
            },
            prepare({ size, color, stock }) {
              const inStock = typeof stock === 'number' && stock > 0
              return {
                title: `${size || '?'} — ${color || '?'}`,
                subtitle: inStock ? `${stock} in stock` : '⚠ Out of stock',
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).error('At least one variant is required.'),
    }),

    // ── Test entry marker ──────────────────────────────────────────────────
    // During Phase 2 development, all real-looking product data must be tagged.
    // Remove this field (or set to false) when publishing real products.
    defineField({
      name: 'isPlaceholder',
      title: '[[PLACEHOLDER]] — Test Entry',
      type: 'boolean',
      description:
        'Mark this document as a placeholder test entry. ' +
        'Placeholder products are excluded from the live storefront query. ' +
        'Do not publish realistic-looking product data without this flag during development.',
      initialValue: true,
    }),
  ],
})
