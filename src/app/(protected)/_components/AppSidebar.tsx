'use client'

import * as React from 'react'
import { Home, Search, User, Map } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'

const navItems = [
  { name: 'Home', icon: Home, href: '/home' },
  { name: 'Map', icon: Map, href: '/map' },
  { name: 'Find Users', icon: Search, href: '/explore' },
  {
    name: 'Profile',
    icon: User,
    href: '/profile',
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
    <Sidebar
      className="top-[--header-height] !h-[calc(100svh-var(--header-height))]"
      {...props}
    >
      <SidebarHeader className="flex flex-row items-center justify-between md:hidden">
        <Image src={logoSrc} alt="Clime Time Reviews" width={112} height={50} />
        <SidebarTrigger />
      </SidebarHeader>
      <Separator className="pl-3 pr-3" />
      <SidebarContent className="p-3">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild className="h-10 text-base">
                <a href={item.href}>
                  <item.icon />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
