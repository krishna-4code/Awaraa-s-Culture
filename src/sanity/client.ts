import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion } from './env'

export const sanityClient = createClient({
  projectId: projectId || 'placeholder',
  dataset: dataset || 'production',
  apiVersion: apiVersion || '2024-02-09',
  useCdn: process.env.NODE_ENV === 'production',
})
