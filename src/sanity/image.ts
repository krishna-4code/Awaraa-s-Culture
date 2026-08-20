import createImageUrlBuilder from '@sanity/image-url'
import { projectId, dataset } from './env'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || 'placeholder',
  dataset: dataset || 'production',
})

export const urlForImage = (source: any) => {
  return imageBuilder.image(source).auto('format').fit('max')
}
