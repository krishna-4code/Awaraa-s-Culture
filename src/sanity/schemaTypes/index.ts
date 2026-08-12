import { type SchemaTypeDefinition } from 'sanity'
import { productType } from './product'
import { collectionType } from './collection'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [collectionType, productType],
}
