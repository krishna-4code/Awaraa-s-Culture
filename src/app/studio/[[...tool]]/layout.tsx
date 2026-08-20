export const metadata = {
  title: 'Sanity Studio',
  description: "Sanity Studio for Awaraa's Culture",
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
