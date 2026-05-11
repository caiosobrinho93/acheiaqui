"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Zap, Package, ChevronRight, Loader2, Sparkles, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabase, type Product } from "@/lib/supabase"

interface SearchSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchSidebar({ isOpen, onClose }: SearchSidebarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery("")
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    const handleSearch = async () => {
      if (query.trim().length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      const { data } = await supabase
        .from("products")
        .select("id, name, slug, price, promo_price, main_image, category")
        .ilike("name", `%${query}%`)
        .limit(8)
      
      setResults((data as any) || [])
      setLoading(false)
    }

    const timer = setTimeout(handleSearch, 300)
    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = (slug: string) => {
    router.push(`/produto/${slug}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
      />
      <div className="absolute top-0 right-0 h-full w-full max-w-[450px] bg-surface border-l border-white/5 shadow-2xl flex flex-col">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(198,255,0,0.15)]">
              <Search className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter italic">Busca <span className="text-primary">Avançada</span></h2>
          </div>
          <button onClick={onClose} className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-text-muted hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-8 pb-4">
          <div className="relative group">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: calça jeans, iphone..."
              className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 pr-12 text-lg font-bold outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all placeholder:text-text-muted"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {query && (
                <button onClick={() => setQuery("")} className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-text-muted hover:text-foreground mr-1">
                  <X className="h-4 w-4" />
                </button>
              )}
              <Search className="h-5 w-5 text-text-muted opacity-40" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-0 scrollbar-hide">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-text-muted">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-xs font-black uppercase tracking-[0.3em] animate-pulse">Sincronizando Banco...</span>
            </div>
          ) : query.trim().length > 0 ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-text-muted">{results.length} Itens Encontrados</span>
                <div className="h-px flex-1 ml-4 bg-white/5" />
              </div>
              {results.map((product) => (
                <button key={product.id} onClick={() => handleSelect(product.slug)} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group text-left">
                  <div className="h-16 w-16 relative rounded-xl overflow-hidden bg-background shrink-0 border border-white/5">
                    <Image src={product.main_image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-base uppercase tracking-tight truncate group-hover:text-primary transition-colors italic">{product.name}</h4>
                    <p className="text-xs text-text-muted uppercase font-black tracking-widest mt-0.5">{product.category}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm font-black text-white">R$ {(product.promo_price || product.price).toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </button>
              ))}
              {results.length === 0 && (
                <div className="py-20 flex flex-col items-center gap-6 text-center">
                  <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center opacity-20">
                    <Package className="h-10 w-10" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-text-muted italic">Protocolo não encontrado.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-10 py-6">
              <div>
                <div className="flex items-center gap-3 mb-6 text-primary">
                  <Sparkles className="h-4 w-4" />
                  <h3 className="text-xs font-black uppercase tracking-[0.3em]">Dicas de Busca</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {["Tente buscar por marcas", "Busque por categorias", "Palavras-chave como Gamer"].map((tip, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 text-sm font-bold text-text-secondary italic">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-6 text-primary">
                  <TrendingUp className="h-4 w-4" />
                  <h3 className="text-xs font-black uppercase tracking-[0.3em]">Tendências</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Black Friday', 'Eletrodomésticos', 'Setup Gamer'].map((tag) => (
                    <button key={tag} onClick={() => setQuery(tag)} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-all text-xs font-black uppercase tracking-widest">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-black uppercase tracking-widest">Encontrou, Levou.</span>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-xs font-black uppercase tracking-widest text-primary">AcheiAqui Core v2.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}