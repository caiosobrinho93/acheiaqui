"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Star, Plus, Eye, Zap, ImageOff, Heart } from "lucide-react"
import { type Product, toggleWishlist as syncWishlist } from "@/lib/supabase"
import { useCart, useWishlist } from "@/lib/store"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [userId, setUserId] = useState<string | null>(null)
  const isList = className?.includes('flex-row') || className?.includes('list-view')
  
  const isWishlisted = isInWishlist(product.id)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserId(session.user.id)
      }
    })
  }, [])

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    toggleWishlist(product)
    toast.success(isWishlisted ? "Removido dos favoritos" : "Salvo nos favoritos")

    if (userId) {
      await syncWishlist(userId, product.id)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const added = addItem(product)
    if (added) {
      toast.success("Adicionado!", {
        description: `${product.name} agora no carrinho.`
      })
    } else {
      toast.error("Item já está no carrinho!", {
        description: "Confira seu carrinho para finalizar."
      })
    }
  }

  const imageUrl = product.main_image || product.images?.[0] || ""

  return (
    <Link href={`/produto/${product.slug}`} className="block w-full h-full group/card-wrapper">
      <div 
        className={cn(
          "relative flex flex-col premium-card w-full h-full rounded-2xl overflow-hidden transition-colors duration-200 bg-surface/30 border border-white/5",
          isList 
            ? "flex-row min-h-[120px] md:min-h-[160px] items-center hover:bg-surface/50 hover:border-primary/30" 
            : "hover:border-primary/20",
          className
        )}
      >
        {/* Image Container */}
        <div 
          className={cn(
            "relative overflow-hidden shrink-0 z-10",
            isList 
              ? "h-full w-[130px] sm:w-[160px] md:w-[220px]" 
              : "h-[220px] md:h-[280px] w-full"
          )}
          style={isList ? { clipPath: 'polygon(0 0, 100% 0, 82% 100%, 0% 100%)' } : undefined}
        >
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={product.name} 
              fill 
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="h-full w-full bg-white/5 flex flex-col items-center justify-center text-white/10 gap-2">
               <ImageOff className="h-8 w-8" />
               <span className="text-xs font-semibold uppercase tracking-widest text-center px-2">Sem Imagem</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 pointer-events-none" />
          
          {/* Wishlist Button */}
          <div className={cn(
            "absolute top-3 z-30 lg:opacity-0 lg:group-hover/card-wrapper:opacity-100 transition-opacity duration-200",
            isList ? "left-3" : "right-3"
          )}>
            <button 
              onClick={handleToggleWishlist}
              className={cn(
                "h-9 w-9 rounded-xl flex items-center justify-center transition-colors backdrop-blur-md border",
                isWishlisted 
                  ? "bg-primary border-primary text-background" 
                  : "bg-background/40 border-white/10 text-white hover:bg-white/20"
              )}
            >
              <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
            </button>
          </div>
        </div>

        {/* Info Container */}
        <div className={cn(
          "flex flex-col relative z-20 w-full flex-1",
          isList 
            ? "justify-center p-[15px]" 
            : "p-[15px] justify-between bg-gradient-to-b from-surface/60 to-surface border-t border-white/5"
        )}>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-primary/80 uppercase tracking-widest">{product.category}</span>
              <div className="flex items-center gap-1 text-primary">
                <Star className="h-3 w-3 fill-current" />
                <span className="text-xs font-black italic">5.0</span>
              </div>
            </div>

            <h3 className={cn(
              "font-black tracking-tight uppercase italic transition-colors",
              "text-lg",
              isList ? "line-clamp-1" : "line-clamp-2",
              "group-hover/card-wrapper:text-primary"
            )}
            style={{ lineHeight: 'calc(1 / 1.125)' }}
            >
              {product.name}
            </h3>
          </div>

          <div className="flex items-end justify-between mt-6">
            <div className="flex flex-col">
              {product.promo_price ? (
                <div className="flex flex-col">
                  <span className="text-[10px] text-text-muted line-through font-semibold mb-0.5">R$ {product.price.toLocaleString('pt-BR')}</span>
                  <span className="font-black text-xl sm:text-2xl text-white tracking-tighter leading-none italic pr-[5px]">
                    R$ {product.promo_price.toLocaleString('pt-BR')}
                  </span>
                </div>
              ) : (
                <span className="font-black text-xl sm:text-2xl text-white tracking-tighter leading-none italic pr-[5px]">
                  R$ {product.price.toLocaleString('pt-BR')}
                </span>
              )}
            </div>
            
            <div className="flex items-center shrink-0 ml-4">
               <button 
                 onClick={handleAddToCart}
                 className={cn(
                   "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors duration-200 shadow-xl",
                   "bg-white/5 border border-white/10 text-text-muted hover:bg-primary hover:text-background hover:border-primary"
                 )}
               >
                 <Plus className="h-6 w-6" />
               </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
