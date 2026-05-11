import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const banners = [
  {
    title: "SETUP <span class='text-primary'>MASTER</span>",
    description: "A engenharia definitiva para quem busca a supremacia digital.",
    image_url: "/images/banners/gamer-banner.png",
    link_url: "/loja?cat=Hardware",
    display_order: 1,
    is_active: true
  },
  {
    title: "ELETRO <span class='text-primary'>ELITE</span>",
    description: "Tecnologia de ponta para transformar seu lar.",
    image_url: "/images/banners/eletrodomesticos-banner.png",
    link_url: "/loja?cat=Eletrodomésticos",
    display_order: 2,
    is_active: true
  },
  {
    title: "CONFORTO <span class='text-primary'>ABSURDO</span>",
    description: "Cama, mesa e banho com o toque de luxo que você merece.",
    image_url: "/images/banners/cama-mesa-banho-banner.png",
    link_url: "/loja?cat=Lifestyle",
    display_order: 3,
    is_active: true
  }
]

async function seedBanners() {
  console.log("Semeando novos banners...")
  
  // Clear existing banners
  const { error: delError } = await supabase.from('banners').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (delError) {
    console.error("Erro ao limpar banners:", delError)
    return
  }

  const { error: insError } = await supabase.from('banners').insert(banners)
  if (insError) {
    console.error("Erro ao inserir banners:", insError)
    return
  }

  console.log("Banners semeados com sucesso!")
}

seedBanners()
