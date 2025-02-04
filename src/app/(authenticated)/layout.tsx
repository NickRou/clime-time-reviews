'use client'

import { ThemeToggle } from '@/components/ThemeToggle'
import { AppSidebar } from '@/components/AppSidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { UserButton, useUser } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import { dark } from '@clerk/themes'
import React from 'react'

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { theme } = useTheme()
  const clerkTheme = theme === 'dark' ? dark : undefined
  const { user } = useUser()

  if (!user) {
    return null
  }

  const { username } = user

  return (
    <SidebarProvider>
      <AppSidebar username={username} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
          </div>
          <div className="ml-auto flex items-center gap-4 px-4">
            <ThemeToggle />
            <UserButton
              appearance={{ baseTheme: clerkTheme }}
              userProfileMode="navigation"
              userProfileUrl={`/profile/${username}/manage`}
            />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
