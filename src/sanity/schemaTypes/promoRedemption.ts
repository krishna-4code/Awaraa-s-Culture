import { defineField, defineType } from 'sanity'

export const promoRedemptionType = defineType({
  name: 'promo_redemption',
  title: 'Promo Redemption',
  type: 'document',
  preview: {
    select: {
      title: 'email',
      subtitle: 'code',
      description: 'orderRef',
    },
    prepare({ title, subtitle, description }) {
      return {
        title: title || 'Unknown Customer',
        subtitle: `Code: ${subtitle || '—'} · Order: ${description || '—'}`,
      }
    },
  },
  fields: [
    defineField({
      name: 'code',
      title: 'Promo Code',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Customer Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'orderRef',
      title: 'Order Reference',
      type: 'string',
    }),
    defineField({
      name: 'redeemedAt',
      title: 'Redeemed At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
