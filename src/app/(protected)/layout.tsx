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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
