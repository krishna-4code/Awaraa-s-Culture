import { BRAND_NAME } from '@/lib/constants'

export const metadata = {
  title: 'Sanity Studio',
  description: `Sanity Studio for ${BRAND_NAME}`,
  robots: {
    index: false,
    follow: false,
  },
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-[9999] bg-white overflow-auto">
      {children}
    </div>
  )
}
