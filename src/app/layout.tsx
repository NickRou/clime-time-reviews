import type { Metadata } from 'next'
import { Lato } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/app/_components/ThemeProvider'

const lato = Lato({
  weight: ['300', '400', '700'], // 300: secondary, 400: body, 700: heading
  display: 'swap',
  subsets: ['latin'],
  preload: true,
})

export const metadata: Metadata = {
  title: 'Clime Time Reviews',
  description:
    'Clime Time Reviews - A Next.js app for seeing reviews from your friends.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" className={lato.className} suppressHydrationWarning>
        <head>
          <link rel="icon" href="/clime-time-logo.png" />
        </head>
        <body>
          <ThemeProvider attribute="class" defaultTheme="dark">
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
