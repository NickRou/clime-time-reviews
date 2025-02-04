'use client'

import { ThemeToggle } from '@/components/ThemeToggle'
import { AppSidebar } from '@/components/AppSidebar'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import { dark } from '@clerk/themes'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { theme } = useTheme()
  const clerkTheme = theme === 'dark' ? dark : undefined
  const pathname = usePathname()
  const splitPathname = pathname.split('/').filter((path) => path)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {splitPathname.map((path, index) => (
                  <React.Fragment key={`breadcrumb-${path}-${index}`}>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink
                        href={`/${splitPathname.slice(0, index + 1).join('/')}`}
                      >
                        {path.charAt(0).toUpperCase() + path.slice(1)}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index < splitPathname.length - 1 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-4 px-4">
            <ThemeToggle />
            <UserButton
              appearance={{ baseTheme: clerkTheme }}
              userProfileMode="navigation"
              userProfileUrl="/profile/manage"
            />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
