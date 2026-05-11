import { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import { Header } from "@/components/layout/header"
import { ProductContent } from "@/components/product-content"

interface Props {
  params: Promise<{ slug: string }>
}

// 🎯 Static params for GitHub Pages export
export async function generateStaticParams() {
  const { data: products } = await supabase
    .from('products')
    .select('slug')

  return products?.map((p) => ({
    slug: p.slug,
  })) || []
}

// 🎯 Dynamic SEO for AcheiAqui
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const { slug } = resolvedParams

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .ilike('slug', slug)
    .maybeSingle()

  if (!product) {
    return { title: "AcheiAqui | Produto Não Encontrado" }
  }

  return {
    title: `${product.name} | AcheiAqui Marketplace`,
    description: product.description?.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description?.substring(0, 160),
      images: [{ url: product.main_image || product.images?.[0] || "" }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description?.substring(0, 160),
      images: [product.main_image || product.images?.[0] || ""],
    }
  }
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params
  const { slug } = resolvedParams

  // SSR fetch for initial data
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .ilike('slug', slug)
    .maybeSingle()

  return (
    <main className="min-h-screen bg-background pb-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full -z-10" />
      
      <Header />

      <div className="container mx-auto px-6 pt-24 lg:pt-32 relative">
        <ProductContent slug={slug} initialProduct={product || undefined} />
      </div>
    </main>
  )
}
