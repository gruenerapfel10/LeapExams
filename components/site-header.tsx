"use client"

import { SidebarTrigger } from "@/components/sidebar-trigger"

interface SiteHeaderProps {
  children?: React.ReactNode
}

export function SiteHeader({ children }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {children}
        </div>
      </div>
    </header>
  )
}
