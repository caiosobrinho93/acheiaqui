"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function ContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith('/dashboard')

  return (
    <div className={cn(
      "flex-1 flex flex-col",
      !isDashboard && "pt-24 md:pt-32"
    )}>
      {children}
    </div>
  )
}
