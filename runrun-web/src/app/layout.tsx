import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Run Run - Ride-Hailing Guinea-Bissau',
  description: 'Guinea-Bissau\'s first and only ride-hailing platform. Download the app for Android or iOS. 24/7 Customer Support.',
  keywords: 'Run Run, taxi, ride-hailing, Guinea-Bissau, Bissau, transport, driver, passenger',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Run Run - Ride-Hailing Guinea-Bissau',
    description: 'Guinea-Bissau\'s first and only ride-hailing platform',
    images: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.className} bg-black`}>{children}</body>
    </html>
  )
}
