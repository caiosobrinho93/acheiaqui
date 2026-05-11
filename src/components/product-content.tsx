"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingCart,
  CreditCard,
  Star,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Plus,
  Minus,
  CheckCircle2,
  PlayCircle,
  Share2,
  Zap,
  Box,
  Cpu,
  Clock,
  ChevronRight,
  Maximize2,
  MapPin,
  MessageCircle,
  HelpCircle,
  ThumbsUp,
  Award,
  ChevronDown,
  Sparkles,
  Loader2,
  Camera
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { ProductDetailSkeleton } from "@/components/ui/skeleton"
import { useCart } from "@/lib/store"
import { toast } from "sonner"
import { supabase, type Product, type ProductReview } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { NeonButton } from "@/components/ui/neon-button"
import { ProductCard } from "@/components/ui/product-card"
import { fetchCEP } from "@/lib/viacep"

function VideoPlayer({ url }: { url: string }) {
  const isYoutube = url.includes("youtube.com") || url.includes("youtu.be")

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  if (isYoutube) {
    const id = getYoutubeId(url)
    return (
      <iframe
        className="w-full h-full rounded-3xl md:rounded-[4rem] border border-white/10"
        src={`https://www.youtube.com/embed/${id}?autoplay=0&controls=1&rel=0&mute=1`}
        title="Product Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }

  return (
    <video
      src={url}
      controls
      className="w-full h-full rounded-3xl md:rounded-[4rem] border border-white/10 object-cover"
    />
  )
}

export function ProductContent({ slug, initialProduct }: { slug: string, initialProduct?: Product }) {
  const [product, setProduct] = React.useState<Product | null>(initialProduct || null)
  const [loading, setLoading] = React.useState(!initialProduct)
  const [quantity, setQuantity] = React.useState(1)
  const [activeMedia, setActiveMedia] = React.useState<number | 'video'>(0)
  const [relatedProducts, setRelatedProducts] = React.useState<Product[]>([])
  const [cep, setCep] = React.useState("")
  const [shippingResult, setShippingResult] = React.useState<{ price: string, days: string, address?: string } | null>(null)
  const [isZoomOpen, setIsZoomOpen] = React.useState(false)
  const [imageLoading, setImageLoading] = React.useState(true)
  const [reviews, setReviews] = React.useState<any[]>([])
  const [reviewRating, setReviewRating] = React.useState(5)
  const [reviewComment, setReviewComment] = React.useState("")
  const [reviewImages, setReviewImages] = React.useState<File[]>([])
  const [isSubmittingReview, setIsSubmittingReview] = React.useState(false)
  const [currentUser, setCurrentUser] = React.useState<any>(null)
  const { addItem } = useCart()

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null)
    })
  }, [])

  React.useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .ilike('slug', slug)
        .maybeSingle()

      if (data) {
        setProduct(data)
        
        // AcheiAqui products
        const { data: related } = await supabase
          .from('products')
          .select('*')
          .eq('category', data.category)
          .neq('id', data.id)
          .limit(12)

        if (related && related.length > 0) {
          setRelatedProducts(related.filter(p => p.name && p.slug))
        } else {
          // Fallback: Trending products if no related category found
          const { data: trending } = await supabase
            .from('products')
            .select('*')
            .neq('id', data.id)
            .limit(12)
          if (trending) setRelatedProducts(trending.filter(p => p.name && p.slug))
        }
      }
      
      // Fetch reviews
      if (data?.id) {
        const { data: revs } = await supabase
          .from('reviews')
          .select(`
            *,
            profiles (
              full_name,
              avatar_url,
              email
            )
          `)
          .eq('product_id', data.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
        
        if (revs) setReviews(revs)
      }

      setLoading(false)
    }

    fetchProduct()
  }, [slug])

  const handleAddToCart = () => {
    if (!product) return
    const added = addItem(product, quantity)
    if (added) {
      toast.success("Adicionado ao Carrinho!", {
        description: `${quantity}x ${product.name} pronto para entrega.`
      })
    } else {
      toast.error("Item já está no carrinho!", {
        description: "Você pode alterar a quantidade diretamente no carrinho."
      })
    }
  }

  const calculateShipping = async () => {
    if (cep.replace(/\D/g, '').length < 8) return toast.error("CEP Inválido")

    setLoading(true)
    const address = await fetchCEP(cep)
    setLoading(false)

    if (address) {
      setShippingResult({
        price: "Consultar",
        days: "Sob Consulta",
        address: `${address.logradouro ? address.logradouro + ', ' : ''}${address.bairro} - ${address.localidade}/${address.uf}`
      })
    } else {
      setShippingResult(null)
      toast.error("CEP não encontrado.")
    }
  }

  if (loading) return <ProductDetailSkeleton />

  if (!product) return (
    <div className="py-60 text-center flex flex-col items-center gap-8">
      <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center text-primary border border-primary/20 animate-pulse">
        <Cpu className="h-12 w-12" />
      </div>
      <div>
        <h1 className="text-4xl md:text-6xl font-bold uppercase italic tracking-tighter mb-4">Produto <span className="text-primary not-italic">Inexistente.</span></h1>
        <p className="text-text-muted font-semibold uppercase tracking-widest text-xs">O sistema não localizou o produto solicitado em nosso banco de dados.</p>
      </div>
      <Link href="/loja" className="h-16 px-10 bg-surface border border-white/10 rounded-xl flex items-center justify-center font-bold uppercase tracking-widest text-xs hover:border-primary/40 transition-all">
        <ArrowLeft className="h-4 w-4 mr-3" /> Retornar à Loja
      </Link>
    </div>
  )

  const gallery = product.images && product.images.length > 0 ? product.images : [product.main_image]

  return (
    <div className="relative pb-40">
      {/* Zoom Lightbox */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
            onClick={() => setIsZoomOpen(false)}
          >
            <div className="relative w-full h-full">
              <Image
                src={gallery[activeMedia as number] || product.main_image}
                alt="Zoom"
                fill
                className="object-contain"
              />
            </div>
            <button className="absolute top-8 right-8 h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white">
              <Plus className="h-6 w-6 rotate-45" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Breadcrumbs */}
      <div className="hidden lg:flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-8 md:mb-12">
        <Link href="/" className="hover:text-primary transition-colors">Início</Link>
        <div className="h-1 w-1 rounded-full bg-white/20" />
        <Link href="/loja" className="hover:text-primary transition-colors">Loja</Link>
        <div className="h-1 w-1 rounded-full bg-white/20" />
        <span className="text-primary truncate max-w-[200px] italic">{product.name}</span>
      </div>

      {/* 2. Product Hero Highlight - Desktop Only */}
      <div className="hidden lg:flex relative w-full mb-16 rounded-[4rem] overflow-hidden gaming-card border border-white/5 p-16 md:p-24 flex-col items-center text-center group">
         <div className="absolute inset-0 z-0">
            <Image 
              src={product.main_image || ""} 
              alt="Hero Background" 
              fill 
              className="object-cover opacity-20 scale-105 blur-2xl group-hover:scale-110 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-[url('/images/bg/grid.png')] opacity-10" />
         </div>
         
         <div className="relative z-10 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center gap-8"
            >
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-12 bg-primary/30" />
                <div className="px-8 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.5em] backdrop-blur-md">
                  {product.category}
                </div>
                <div className="h-[1px] w-12 bg-primary/30" />
              </div>
              <h1 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.8] mb-4 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                {product.name}
              </h1>
              <div className="flex flex-col items-center gap-4">
                <div className="h-1.5 w-32 bg-primary shadow-neon-soft rounded-full" />
                <span className="text-xs font-black uppercase tracking-[0.6em] text-primary/60 italic">Engenharia de Elite</span>
              </div>
            </motion.div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        {/* MEDIA COLUMN */}
        <div className="lg:sticky lg:top-32 h-fit space-y-6 lg:col-span-7">
          {/* Gallery Main */}
          <div className="relative aspect-[4/3] max-h-[400px] md:max-h-[550px] w-full rounded-3xl md:rounded-[3rem] border border-white/10 overflow-hidden bg-surface group gaming-card">
            <div className="absolute inset-0 bg-grid-tech opacity-10 pointer-events-none" />
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMedia === 'video' ? 'video' : activeMedia}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full h-full relative"
              >
                {activeMedia === 'video' && product.video_url ? (
                  <VideoPlayer url={product.video_url} />
                ) : (
                  <>
                    {imageLoading && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                      </div>
                    )}
                    <Image
                      src={product.images?.[activeMedia as number] || product.main_image || ""}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                      onLoadingComplete={() => setImageLoading(false)}
                    />
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {activeMedia !== 'video' && (
              <button
                onClick={() => setIsZoomOpen(true)}
                className="absolute bottom-6 right-6 h-12 w-12 rounded-xl bg-background/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-primary transition-all z-20"
              >
                <Maximize2 className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 overflow-x-auto mt-4 py-2 scrollbar-hide px-1">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMedia(idx)}
                className={cn(
                  "relative h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-xl overflow-hidden border transition-all",
                  activeMedia === idx ? "border-primary scale-105 z-10" : "border-white/5 opacity-40 hover:opacity-100"
                )}
              >
                <Image src={img} alt="Thumbnail" fill className="object-cover" />
              </button>
            ))}
            {product.video_url && (
              <button
                onClick={() => setActiveMedia('video')}
                className={cn(
                  "relative h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-xl overflow-hidden border flex items-center justify-center bg-primary/10 text-primary transition-all",
                  activeMedia === 'video' ? "border-primary scale-105 z-10" : "border-white/5 opacity-40 hover:opacity-100"
                )}
              >
                <PlayCircle className="h-8 w-8" />
              </button>
            )}
          </div>
        </div>

        {/* INFO COLUMN */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              <span className="text-green-500 font-semibold tracking-wide text-sm">Pronto para Envio</span>
            </div>

            {/* Price & Title Card */}
            <div className="p-6 md:p-10 rounded-[2.5rem] bg-surface/20 border border-white/5 flex flex-col gap-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Zap className="h-32 w-32 text-primary" />
              </div>

              <div className="flex flex-col gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-bold">5.0</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-none uppercase">
                  {product.name}
                </h1>
              </div>

              <div className="flex flex-col gap-1 relative z-10">
                {product.promo_price ? (
                  <>
                    <span className="text-text-muted text-sm line-through font-medium opacity-40">R$ {product.price.toLocaleString('pt-BR')}</span>
                    <div className="flex items-baseline gap-4">
                      <span className="text-4xl md:text-5xl font-semibold text-foreground tracking-tighter">R$ {product.promo_price.toLocaleString('pt-BR')}</span>
                      <span className="text-sm font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-xl">-{Math.round((1 - product.promo_price / product.price) * 100)}% ACHEIAQUI</span>
                    </div>
                  </>
                ) : (
                  <span className="text-4xl md:text-5xl font-semibold text-foreground tracking-tighter">R$ {product.price.toLocaleString('pt-BR')}</span>
                )}
              </div>
              
              <div className="flex flex-col gap-4 pt-8 border-t border-white/5 relative z-10">
                {(product.allow_installments ?? true) && (
                  <div className="flex items-center gap-4 text-text-muted">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <p className="text-sm font-black uppercase tracking-widest italic">Parcelamento disponível</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="p-4 rounded-xl bg-surface/20 border border-white/5 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-text-muted group-hover:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="CEP"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs font-bold uppercase w-24"
                    maxLength={8}
                  />
                </div>
                <button onClick={calculateShipping} className="text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-70 transition-all">Calcular</button>
              </div>
              {shippingResult?.address && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 px-4 py-3 rounded-lg bg-primary/5 border border-primary/10"
                >
                  <CheckCircle2 className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Entrega Disponível</span>
                    <span className="text-[9px] font-bold text-text-muted uppercase leading-tight">{shippingResult.address}</span>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="h-14 flex items-center bg-surface border border-white/5 rounded-xl px-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-10 w-10 flex items-center justify-center text-text-muted"><Minus className="h-4 w-4" /></button>
                <span className="w-8 text-center font-bold text-lg italic">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="h-10 w-10 flex items-center justify-center text-text-muted"><Plus className="h-4 w-4" /></button>
              </div>
              <NeonButton
                onClick={handleAddToCart}
                className="flex-1 h-14 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(198,255,0,0.2)] hover:shadow-[0_0_30px_rgba(198,255,0,0.4)] transition-all"
              >
                <div className="flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap">
                  <Zap className="h-4 w-4 shrink-0 fill-current" />
                  <span>Adquirir Agora</span>
                </div>
              </NeonButton>
            </div>
          </div>

          {/* Trust Area - Elite Upgrade */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { icon: ShieldCheck, label: "Garantia VIP", color: "text-primary", sub: "Cobertura Total" },
              { icon: CheckCircle2, label: "Original", color: "text-accent-cyan", sub: "Selo de Elite" },
              { icon: Zap, label: "Envio Flash", color: "text-performance", sub: "Em 24 Horas" },
            ].map((trust, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 gap-2 group hover:bg-primary/5 hover:border-primary/20 transition-all">
                <trust.icon className={cn("h-5 w-5 mb-1", trust.color)} />
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white leading-none mb-1">{trust.label}</span>
                  <span className="text-[7px] font-bold uppercase tracking-widest text-text-muted leading-none">{trust.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DESCRIPTION & SPECS SECTION */}
      <div className="mt-16 md:mt-24 border-t border-white/5 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left: Manifesto & Features */}
          <div className="lg:col-span-7 flex flex-col gap-12">
            <div>
              <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter italic mb-8">DETALHES DO <span className="text-primary not-italic">SISTEMA.</span></h3>
              <div className="p-8 md:p-12 rounded-[3rem] bg-surface/10 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                  <Sparkles className="h-40 w-40 text-primary" />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" /> Manifesto do Produto
                </h4>
                <p className="text-text-secondary text-base md:text-xl leading-relaxed opacity-90 font-medium whitespace-pre-wrap relative z-10 italic tracking-tight">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Premium Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[
                 { icon: Zap, title: "Performance Extrema", desc: "Otimizado para entregar o máximo rendimento em qualquer cenário.", color: "text-primary" },
                 { icon: ShieldCheck, title: "Resistência Vitalícia", desc: "Construído com materiais de grau industrial para durar décadas.", color: "text-accent-cyan" },
                 { icon: Award, title: "Design Premiado", desc: "A estética Cyber-Gaming que redefine o conceito de estilo premium.", color: "text-accent-gold" },
                 { icon: Sparkles, title: "Inovação AcheiAqui", desc: "Tecnologia proprietária que você não encontra em nenhum outro lugar.", color: "text-performance" }
               ].map((feat, i) => (
                 <div key={i} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-primary/5 hover:border-primary/20 transition-all flex flex-col gap-4">
                    <feat.icon className={cn("h-8 w-8", feat.color)} />
                    <div className="flex flex-col gap-1">
                      <h5 className="text-sm font-black uppercase tracking-tighter italic">{feat.title}</h5>
                      <p className="text-[10px] font-medium text-text-muted uppercase tracking-widest leading-relaxed">{feat.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Right: Technical Specs */}
          <div className="lg:col-span-5">
            <div className="bg-surface/30 rounded-[3rem] p-8 md:p-12 border border-white/5 h-fit lg:sticky lg:top-32 gaming-card">
              <div className="flex items-center gap-3 mb-10">
                 <div className="h-2 w-2 rounded-full bg-primary shadow-neon-soft" />
                 <h4 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Especificações Técnicas</h4>
              </div>
              <ul className="flex flex-col gap-6">
                {[
                  { label: "Categoria", value: product.category, icon: Box },
                  product.voltage && { label: "Voltagem", value: product.voltage, icon: Zap },
                  product.power_source && { label: "Alimentação", value: product.power_source, icon: Zap },
                  product.weight && { label: "Peso", value: product.weight, icon: Box },
                  { label: "Garantia", value: product.warranty_months ? `${product.warranty_months} Meses` : "N/A", icon: ShieldCheck },
                ].filter(Boolean).map((spec: any, i) => (
                  <li key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 group">
                    <div className="flex items-center gap-4">
                      <spec.icon className="h-4 w-4 text-text-muted group-hover:text-primary transition-colors" />
                      <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-text-muted">{spec.label}</span>
                    </div>
                    <span className="text-xs md:text-sm font-bold uppercase text-foreground italic">{spec.value}</span>
                  </li>
                ))}
              </ul>

              {/* Warranty VIP Badge */}
              <div className="mt-12 p-8 rounded-3xl bg-primary/5 border border-primary/20 flex flex-col gap-6 group hover:bg-primary/10 transition-all">
                 <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-background shadow-neon-soft group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-7 w-7" />
                 </div>
                 <div className="flex flex-col gap-2">
                    <span className="text-sm font-black uppercase tracking-tighter">Selo de Elite AcheiAqui</span>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] leading-relaxed">Produto submetido a testes rigorosos de qualidade e performance.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <section className="mt-16 border-t border-white/5 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <div className="sticky top-32 p-8 rounded-3xl bg-surface/20 border border-white/5 flex flex-col gap-6">
            <h4 className="text-xl font-bold uppercase tracking-tighter italic">REVIEWS</h4>
            <div className="flex items-baseline gap-4">
              <span className="text-6xl font-bold text-foreground tracking-tighter italic">
                {reviews.length > 0 
                  ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                  : "5.0"}
              </span>
              <div className="flex flex-col">
                <div className="flex text-primary">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={cn("h-3 w-3", s <= Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)) ? "fill-current" : "opacity-20")} />
                  ))}
                </div>
                <span className="text-xs font-semibold text-text-muted uppercase mt-1">{reviews.length} classificações</span>
              </div>
            </div>

            {/* Review Form */}
            <div className="flex flex-col gap-4 mt-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Deixe sua Avaliação</span>
              
              {!currentUser ? (
                <div className="flex flex-col gap-4 items-center text-center py-4">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-relaxed">
                    Você precisa estar logado para avaliar este produto.
                  </p>
                  <Link 
                    href="/login" 
                    className="h-10 px-6 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-background transition-all"
                  >
                    Entrar na Conta
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} onClick={() => setReviewRating(s)} className="focus:outline-none">
                        <Star className={cn("h-5 w-5 transition-all", s <= reviewRating ? "text-primary fill-current" : "text-white/10")} />
                      </button>
                    ))}
                  </div>
                  <textarea 
                    placeholder="O que achou do produto?" 
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    className="bg-background/50 border border-white/5 rounded-lg px-4 py-2 text-xs font-medium outline-none focus:border-primary/40 transition-all resize-none"
                  />
                  <div className="flex flex-col gap-2">
                    <span className="text-[8px] font-bold text-text-muted uppercase tracking-widest">Anexar Fotos (Opcional)</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => document.getElementById('review-images')?.click()}
                        className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
                      >
                        <Camera className="h-4 w-4 text-text-muted" />
                      </button>
                      <input 
                        id="review-images" 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={async (e) => {
                          const files = e.target.files
                          if (!files) return
                          
                          setReviewImages(Array.from(files))
                          toast.info(`${files.length} fotos selecionadas`)
                        }}
                      />
                      {reviewImages.length > 0 && (
                        <div className="flex gap-1 items-center">
                          <span className="text-[10px] font-black text-primary">{reviewImages.length}</span>
                          <span className="text-[8px] font-bold text-text-muted uppercase">Fotos</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    disabled={isSubmittingReview || !reviewComment}
                    onClick={async () => {
                      if (!product || !currentUser) return
                      setIsSubmittingReview(true)
                      
                      let uploadedUrls: string[] = []
                      
                      // Upload images if any
                      if (reviewImages.length > 0) {
                        for (const file of reviewImages) {
                          try {
                            const fileExt = file.name.split('.').pop()
                            const fileName = `${Math.random()}.${fileExt}`
                            const filePath = `reviews/${fileName}`
                            
                            const { error: uploadError } = await supabase.storage
                              .from('products')
                              .upload(filePath, file)
                            
                            if (uploadError) {
                              console.error("Storage Error:", uploadError)
                              toast.error(`Erro ao subir imagem: ${file.name}`)
                              continue
                            }

                            const { data: { publicUrl } } = supabase.storage
                              .from('products')
                              .getPublicUrl(filePath)
                            uploadedUrls.push(publicUrl)
                          } catch (err) {
                            console.error("Upload Loop Error:", err)
                          }
                        }
                      }
                      
                      const { error } = await supabase.from('reviews').insert({
                        product_id: product.id,
                        user_id: currentUser.id,
                        rating: reviewRating,
                        comment: reviewComment,
                        image_urls: uploadedUrls,
                        is_active: true
                      })
                      
                      if (error) {
                        toast.error("Erro ao enviar avaliação")
                        console.error(error)
                      } else {
                        toast.success("Avaliação enviada!", { description: "Obrigado por seu feedback!" })
                        setReviewComment("")
                        setReviewImages([])
                        // Refresh reviews
                        const { data: revs } = await supabase.from('reviews').select('*, profiles(full_name, avatar_url, email)').eq('product_id', product.id).order('created_at', { ascending: false })
                        if (revs) setReviews(revs)
                      }
                      setIsSubmittingReview(false)
                    }}
                    className="h-10 bg-primary text-background text-[10px] font-black uppercase tracking-widest rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmittingReview ? "Enviando..." : "Enviar Avaliação"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="flex flex-col gap-4 p-8 rounded-2xl bg-surface/10 border border-white/5 group hover:border-primary/20 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs border border-primary/20">
                        {(review.profiles?.full_name || review.profiles?.email || 'U')[0].toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-widest">{review.profiles?.full_name || review.profiles?.email?.split('@')[0] || 'Usuário'}</span>
                        <div className="flex text-primary mt-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={cn("h-2.5 w-2.5", s <= review.rating ? "fill-current" : "opacity-20")} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      {new Date(review.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm font-medium italic opacity-70 leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-20 text-center flex flex-col items-center gap-4 opacity-40">
                <HelpCircle className="h-12 w-12" />
                <p className="text-xs font-black uppercase tracking-widest">Nenhuma avaliação ainda. Seja o primeiro!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 border-t border-white/5 pt-24">
          <div className="flex items-end justify-between mb-12 px-1">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Próximo Upgrade</span>
              </div>
              <h2 className="text-3xl md:text-6xl font-bold uppercase tracking-tighter italic">PARA SEU <span className="text-primary not-italic">SETUP.</span></h2>
            </div>
          </div>

          <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-[10px] overflow-x-auto pb-8 md:pb-0 scrollbar-hide snap-x px-1">
            {relatedProducts.map(p => (
              <div key={p.id} className="min-w-[220px] md:min-w-0 snap-center">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
