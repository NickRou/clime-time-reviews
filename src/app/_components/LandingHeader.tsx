'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { ThemeToggle } from './ThemeToggle'
import Image from 'next/image'

export default function LandingHeader() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const [logoSrc, setLogoSrc] = useState<string>('/logo-white-text.png')

  useEffect(() => {
    if (theme === 'dark') {
      setLogoSrc('/logo-white-text.png')
    } else {
      setLogoSrc('/logo-black-text.png')
    }
  }, [theme])

  useEffect(() => setMounted(true), [])

  return (
    <motion.header
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Flowers & Saints</span>
            <Image
              src={logoSrc}
              alt="Clime Time Reviews"
              width={112}
              height={50}
              priority
            />
          </Link>
        </div>
        <div className="flex flex-1 justify-end">
          {mounted && <ThemeToggle />}
        </div>
      </nav>
    </motion.header>
  )
}
