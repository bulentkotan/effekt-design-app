import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Effekt Design — Design Your Dream Outdoor Space',
  description:
    'Answer a few questions and receive personalised landscape concepts for your home — designed for Dubai\'s unique climate and lifestyle by Effekt Design.',
  openGraph: {
    title: 'Effekt Design — Design Your Dream Outdoor Space',
    description:
      'Get personalised landscape design concepts tailored to Dubai\'s climate. Free, takes 5 minutes.',
    type: 'website',
    locale: 'en_AE',
    siteName: 'Effekt Design',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-bg font-sans text-text-dark antialiased">
        {children}
      </body>
    </html>
  )
}
