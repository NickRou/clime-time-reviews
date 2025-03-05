'use client'

import { ThemeToggle } from '../../_components/ThemeToggle'
import { SidebarTrigger } from '../../../components/ui/sidebar'
import HeaderUserButton from './HeaderUserButton'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function Header() {
  const { theme } = useTheme()
  const [logoSrc, setLogoSrc] = useState<string>('/logo-white-text.png')

  useEffect(() => {
    if (theme === 'dark') {
      setLogoSrc('/logo-white-text.png')
    } else {
      setLogoSrc('/logo-black-text.png')
    }
  }, [theme])

  return (
    <header className="flex fixed top-0 z-50 w-full items-center border-b bg-background">
      <div className="flex h-[--header-height] w-full items-center gap-2 px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <Image
            src={logoSrc}
            alt="Clime Time Reviews"
            width={112}
            height={50}
            priority
          />
        </div>
        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
          <HeaderUserButton />
        </div>
      </div>
    </header>
  )
}
