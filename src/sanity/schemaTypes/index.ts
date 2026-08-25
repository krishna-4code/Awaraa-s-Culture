import { type SchemaTypeDefinition } from 'sanity'
import { productType } from './product'
import { collectionType } from './collection'
import { orderType } from './order'
import { inventoryLogType } from './inventoryLog'
import { promoRedemptionType } from './promoRedemption'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [collectionType, productType, orderType, inventoryLogType, promoRedemptionType],
}
