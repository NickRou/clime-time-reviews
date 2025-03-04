import { AppSidebar } from '@/app/(protected)/_components/AppSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import Header from '@/app/(protected)/_components/Header'

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <Header />
        <div className="flex flex-1">
          <AppSidebar variant="floating" />
          <SidebarInset className="pt-[--header-height]">
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
