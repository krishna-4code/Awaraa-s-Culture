import { defineField, defineType } from 'sanity'

export const collectionType = defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',

  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },

  fields: [
    defineField({
      name: 'title',
      title: 'Collection Title',
      type: 'string',
      description: 'E.g. "Everyday", "Formal", "Weekend".',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'One-liner shown on the collection card on the homepage.',
    }),

    defineField({
      name: 'image',
      title: 'Collection Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required().warning('Alt text required for accessibility.'),
        }),
      ],
    }),

    // ── Test entry marker ──────────────────────────────────────────────────
    defineField({
      name: 'isPlaceholder',
      title: '[[PLACEHOLDER]] — Test Entry',
      type: 'boolean',
      description: 'Mark as test entry. Placeholder collections are excluded from live storefront queries.',
      initialValue: true,
    }),
  ],
})
