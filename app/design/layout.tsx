import Header from '@/components/layout/Header'

export default function DesignLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <main className="flex-1 pt-20 sm:pt-24">
        {children}
      </main>
    </div>
  )
}
