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
    <div className="flex h-screen flex-col [--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar variant="inset" />
          <SidebarInset className="overflow-y-auto">{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
