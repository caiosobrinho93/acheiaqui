import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fbehwchisjdvoligseap.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_jC_vBeHBRpmIqS_Fmqxf2A_3O0SMps1'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  promo_price: number | null
  main_image: string
  images: string[]
  video_url: string | null
  category: string
  stock: number
  rating: number
  allow_installments: boolean
  voltage?: string | null
  power_source?: string | null
  weight?: string | null
  warranty_months?: number | null
  has_flash_warranty?: boolean
  created_at: string
}

export type Order = {
  id: string
  customer_email: string
  total_amount: number
  status: 'pending' | 'completed' | 'cancelled'
  items: any[]
  created_at: string
}

export type Banner = {
  id: string
  image_url: string
  link_url: string
  title: string | null
  description: string | null
  is_active: boolean
  display_order: number
  created_at: string
}

export type Category = {
  id: string
  name: string
  image_url: string
  created_at: string
}

export type ProductReview = {
  id: string
  product_id: string
  user_id: string | null
  user_name: string
  rating: number
  comment: string
  image_urls?: string[]
  created_at: string
}

// Wishlist Logic
export async function toggleWishlist(userId: string, productId: string) {
  const { data: existing } = await supabase
    .from('wishlist')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single()

  if (existing) {
    return supabase.from('wishlist').delete().eq('id', existing.id)
  } else {
    return supabase.from('wishlist').insert([{ user_id: userId, product_id: productId }])
  }
}

export async function getWishlist(userId: string) {
  return supabase
    .from('wishlist')
    .select('product_id, products(*)')
    .eq('user_id', userId)
}
