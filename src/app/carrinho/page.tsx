"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  CreditCard,
  Tag
} from "lucide-react"
import { NeonButton } from "@/components/ui/neon-button"
import { Header } from "@/components/layout/header"
import { useCart } from "@/lib/store"
import { toast } from "sonner"

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart()
  const [coupon, setCoupon] = React.useState("")
  const [discount, setDiscount] = React.useState(0)

  const subtotal = totalPrice()
  const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 25.00
  const total = subtotal + shipping - discount

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === "ACHEIAQUI10") {
      setDiscount(subtotal * 0.1)
      toast.success("Cupom ACHEIAQUI10 aplicado! 10% de desconto garantido.")
    } else {
      toast.error("Cupom inválido ou expirado.")
    }
  }

  const handleRemove = (id: string, name: string) => {
    removeItem(id)
    toast.error(`${name} removido do carrinho.`)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 lg:px-8 py-20 flex flex-col items-center justify-center text-center">
          <div 
            className="h-32 w-32 rounded-full bg-surface border border-white/5 flex items-center justify-center text-text-muted mb-8"
          >
            <ShoppingBag className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-bold uppercase tracking-tighter mb-4">Seu carrinho está <span className="text-primary">vazio</span></h1>
          <p className="text-text-secondary mb-10 max-w-md text-lg font-medium">Parece que você ainda não escolheu nenhum dos nossos produtos de elite.</p>
          <Link href="/loja">
            <NeonButton size="lg">Explorar Loja</NeonButton>
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">Seu <span className="text-primary">Carrinho</span></h1>
          <span className="w-fit px-4 py-1 rounded-full bg-surface border border-white/5 text-[10px] font-black uppercase tracking-widest text-text-muted">
            {items.length} {items.length === 1 ? 'item' : 'itens'}
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="xl:col-span-2 flex flex-col gap-4 md:gap-6">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 md:p-6 rounded-3xl bg-surface border border-white/5 flex items-center gap-4 md:gap-8 group hover:border-primary/20 transition-all shadow-xl relative"
                >
                  <div className="relative h-20 w-20 md:h-32 md:w-32 rounded-2xl overflow-hidden flex-shrink-0 bg-background border border-white/5 shadow-inner">
                    <Image 
                      src={item.image_url || (item as any).main_image || (item as any).images?.[0] || ""} 
                      alt={item.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>

                  <div className="flex-1 flex flex-col gap-0.5 md:gap-1 min-w-0">
                    <Link href={`/produto/${item.slug}`} className="text-sm md:text-xl font-bold hover:text-primary transition-colors truncate">{item.name}</Link>
                    <p className="text-[10px] md:text-sm text-text-muted font-bold uppercase tracking-widest opacity-60">Garantia AcheiAqui</p>
                    
                    <div className="flex items-center justify-between mt-2 md:mt-4">
                      <div className="h-8 md:h-10 bg-background border border-white/5 rounded-lg md:rounded-xl flex items-center p-0.5 md:p-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-7 w-7 md:h-8 md:w-8 flex items-center justify-center hover:text-primary transition-colors"><Minus className="h-3 w-3" /></button>
                        <span className="w-6 md:w-8 text-center font-bold text-xs md:text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-7 w-7 md:h-8 md:w-8 flex items-center justify-center hover:text-primary transition-colors"><Plus className="h-3 w-3" /></button>
                      </div>
                      <span className="text-base md:text-xl font-black text-foreground italic tracking-tighter">
                        R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleRemove(item.id, item.name)}
                    className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-90 flex items-center justify-center shrink-0"
                  >
                    <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                  </button>
                </div>
              ))}


            {/* Coupons & Extra */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="p-8 rounded-3xl bg-surface border border-white/5 flex flex-col gap-4 shadow-lg">
                <h4 className="font-bold flex items-center gap-2 text-sm uppercase tracking-widest"><Tag className="h-4 w-4 text-primary" /> Cupom de Desconto</h4>
                <div className="flex gap-2">
                  <input 
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="ACHEIAQUI10"
                    className="flex-1 bg-background border border-white/5 rounded-xl px-4 text-sm outline-none focus:border-primary/50 transition-all font-bold"
                  />
                  <NeonButton size="sm" onClick={handleApplyCoupon}>Aplicar</NeonButton>
                </div>
              </div>
              <div className="p-8 rounded-3xl bg-surface border border-white/5 flex flex-col items-center justify-center text-center gap-2 shadow-lg">
                <Truck className="h-6 w-6 text-primary" />
                <p className="font-bold text-sm uppercase tracking-widest">Frete AcheiAqui</p>
                <p className="text-xs text-text-muted font-medium">Entrega ultra-rápida via drone para capitais.</p>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] bg-surface border border-white/5 flex flex-col gap-6 md:gap-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full blur-3xl" />
              
              <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tighter">Resumo da <span className="text-primary">Compra</span></h3>
              
              <div className="flex flex-col gap-4 border-b border-white/5 pb-6 md:pb-8">
                <div className="flex justify-between text-xs md:text-sm text-text-secondary">
                   <span className="font-medium">Subtotal</span>
                   <span className="font-bold text-foreground">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm text-text-secondary">
                   <span className="font-medium">Frete</span>
                   <span className="font-bold text-success">{shipping === 0 ? "GRÁTIS" : `R$ ${shipping.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs md:text-sm text-primary">
                    <span className="font-medium">Desconto</span>
                    <span className="font-bold">- R$ {discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
              </div>
 
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Total</span>
                <span className="text-3xl md:text-4xl font-black text-primary shadow-neon-soft italic tracking-tighter">
                  R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <Link href="/checkout">
                <NeonButton size="lg" className="w-full h-16 text-lg font-bold uppercase tracking-widest group">
                  Finalizar Pedido <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </NeonButton>
              </Link>

              <div className="flex flex-col gap-4 pt-4">
                <div className="flex items-center gap-3 text-[10px] text-text-muted font-bold uppercase tracking-widest">
                  <ShieldCheck className="h-4 w-4 text-success" /> Pagamento 100% seguro
                </div>
                <div className="flex items-center gap-3 text-[10px] text-text-muted font-bold uppercase tracking-widest">
                  <CreditCard className="h-4 w-4 text-primary" /> Aceitamos PIX e Cartão
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
