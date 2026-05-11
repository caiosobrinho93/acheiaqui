"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as React from 'react'

import { WishlistInitializer } from './wishlist-initializer'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <WishlistInitializer />
      <div className="font-sans min-h-screen flex flex-col">
        {children}
      </div>
    </QueryClientProvider>
  )
}
