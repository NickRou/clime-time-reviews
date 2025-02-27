'use client'

import { ThemeToggle } from './ThemeToggle'
import { SidebarTrigger } from '../../../components/ui/sidebar'
import HeaderUserButton from './HeaderUserButton'

export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
      <div className="flex items-center gap-2 px-3">
        <SidebarTrigger />
      </div>
      <div className="ml-auto flex items-center gap-4 px-4">
        <ThemeToggle />
        <HeaderUserButton />
      </div>
    </header>
  )
}
