"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useWishlist } from "@/lib/store"

export function WishlistInitializer() {
  const { setWishlist } = useWishlist()

  useEffect(() => {
    async function sync() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: wData } = await supabase
        .from('wishlist')
        .select('products(*)')
        .eq('user_id', user.id)
      
      if (wData) {
        const formattedWishlist = wData
          .map((w: any) => w.products)
          .filter(Boolean)
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.promo_price || p.price,
            image_url: p.main_image || p.images?.[0] || ""
          }))
        setWishlist(formattedWishlist)
      }
    }

    sync()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') sync()
      if (event === 'SIGNED_OUT') setWishlist([])
    })

    return () => subscription.unsubscribe()
  }, [setWishlist])

  return null
}
