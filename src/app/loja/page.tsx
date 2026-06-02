"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { ProductCard } from "@/components/ui/product-card"
import { ProductCardSkeleton } from "@/components/ui/skeleton"
import { supabase, type Product } from "@/lib/supabase"
import { 
  Filter, 
  SlidersHorizontal, 
  ChevronDown, 
  Search as SearchIcon, 
  X,
  Zap,
  LayoutGrid,
  List,
  SortAsc,
  Check,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PRODUCT_CATEGORIES } from "@/lib/constants"

function SearchResults() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const initialCat = searchParams.get("cat") || "Todos"
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [inputValue, setInputValue] = useState(initialQuery)
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeCategory, setActiveCategory] = useState(initialCat)
  const [sortBy, setSortBy] = useState("recent")
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid')
  const [isSortOpen, setIsSortOpen] = useState(false)
  // Pagination
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const ITEMS_PER_PAGE = 20
  const [isCatOpen, setIsCatOpen] = useState(false)

  // Advanced Filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000])
  const [brand, setBrand] = useState("")

  const categories = ["Todos", ...PRODUCT_CATEGORIES]
  
  const sortOptions = [
    { id: "recent", label: "Mais Recentes" },
    { id: "price_asc", label: "Menor Preço" },
    { id: "price_desc", label: "Maior Preço" },
    { id: "name", label: "A-Z" },
  ]
  
  // Reset pagination on filter change
  useEffect(() => {
    setPage(0)
    setProducts([])
    setHasMore(true)
  }, [searchQuery, activeCategory, sortBy, priceRange, brand])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue)
    }, 500)
    return () => clearTimeout(timer)
  }, [inputValue])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase.from('products').select('*')

      if (activeCategory !== "Todos") {
        query = query.ilike('category', `%${activeCategory}%`)
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      // Filter by Price
      query = query.gte('price', priceRange[0]).lte('price', priceRange[1])

      // Filter by Brand
      if (brand) {
        query = query.or(`name.ilike.%${brand}%,description.ilike.%${brand}%`)
      }

      // Sorting
      if (sortBy === "recent") {
        query = query.order('created_at', { ascending: false })
      } else if (sortBy === "price_asc") {
        query = query.order('price', { ascending: true })
      } else if (sortBy === "price_desc") {
        query = query.order('price', { ascending: false })
      } else if (sortBy === "name") {
        query = query.order('name', { ascending: true })
      }

      // Pagination
      const from = page * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE - 1
      query = query.range(from, to)

      const { data, error } = await query
      
      if (error) throw error

      if (data) {
        const filtered = data.filter(p => p.name && p.slug)
        if (page === 0) {
          setProducts(filtered)
        } else {
          setProducts(prev => [...prev, ...filtered])
        }
        
        if (data.length < ITEMS_PER_PAGE) {
          setHasMore(false)
        }
      }
    } catch (err: any) {
      console.error("Erro ao buscar produtos:", err?.message || err)
    } finally {
      setLoading(false)
    }
  }, [activeCategory, searchQuery, sortBy, priceRange, brand, page])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <div className="flex flex-col lg:flex-row gap-12 pt-8">
      {/* Sidebar Filters */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 gap-6">
        <div className="flex items-center justify-between p-6 rounded-3xl bg-surface border border-white/5">
          <h3 className="text-lg font-bold uppercase tracking-tight flex items-center gap-3">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            Filtros
          </h3>
          <button 
            onClick={() => {
              setActiveCategory("Todos")
              setInputValue("")
              setSortBy("recent")
              setPriceRange([0, 10000])
              setBrand("")
            }}
            className="text-xs font-bold text-primary hover:underline uppercase tracking-widest"
          >
            Limpar
          </button>
        </div>

        {/* Categorias Dropdown */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-text-muted ml-2">Categoria Principal</h4>
          <div className="relative">
            <button 
              onClick={() => setIsCatOpen(!isCatOpen)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-surface border border-white/5 text-sm font-bold hover:border-primary/30 transition-all"
            >
              {activeCategory}
              <ChevronDown className={cn("h-4 w-4 transition-transform", isCatOpen && "rotate-180")} />
            </button>
            
            {isCatOpen && (
                <div 
                  className="absolute top-full left-0 right-0 mt-2 p-2 bg-surface border border-white/10 rounded-2xl shadow-2xl z-40 max-h-60 overflow-y-auto scrollbar-hide"
                >
                  {categories.map((cat) => (
                    <button 
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat)
                        setIsCatOpen(false)
                      }}
                      className={cn(
                        "w-full p-3 rounded-xl text-left text-xs font-bold uppercase tracking-widest transition-all",
                        activeCategory === cat ? "bg-primary text-background" : "hover:bg-white/5"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
          </div>
        </div>

        {/* Filtro de Marca */}
        <div className="flex flex-col gap-2">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted ml-2 opacity-50">Marca</h4>
          <div className="relative">
             <input 
               type="text" 
               value={brand}
               onChange={(e) => setBrand(e.target.value)}
               placeholder="Ex: Nike, Apple..." 
               className="w-full h-12 bg-surface/50 border border-white/5 rounded-2xl px-6 outline-none focus:border-primary/30 transition-all text-xs font-bold placeholder:text-text-muted/30"
             />
             <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
          </div>
        </div>

        {/* Slider de Preço */}
        <div className="flex flex-col gap-6 p-6 rounded-3xl bg-surface border border-white/5">
          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Faixa de Preço</h4>
          <div className="flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">R$ {priceRange[0]}</span>
                <span className="text-xs font-black text-white">R$ {priceRange[1]}</span>
             </div>
             <input 
               type="range" 
               min="0" 
               max="10000" 
               step="100"
               value={priceRange[1]}
               onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
               className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
             />
             <p className="text-[10px] text-white font-black uppercase text-center italic tracking-widest">Até R$ {priceRange[1].toLocaleString('pt-BR')}</p>
          </div>
        </div>

        {/* Info Box */}
      </aside>

      {/* Main Results */}
      <div className="flex-1 flex flex-col gap-8">
        {/* Header Results */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-6">
             <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter italic leading-none">
                  {activeCategory !== "Todos" ? activeCategory : "Loja"}
                </h1>
                <span className="text-text-muted text-xs font-bold uppercase tracking-[0.2em]">
                  {products.length} PRODUTOS ENCONTRADOS
                </span>
             </div>

             {/* Search Input for Desktop Content area */}
             <div className="relative hidden lg:block">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ex: calça jeans, iphone, etc..." 
                  className="w-[300px] xl:w-[400px] h-14 bg-surface border border-white/5 rounded-2xl px-6 outline-none focus:border-primary/50 transition-all text-sm font-bold"
                />
                <SearchIcon className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Sorting Dropdown */}
            <div className="relative">
                <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-3 px-6 py-3 bg-surface border border-white/5 rounded-full text-xs font-bold uppercase tracking-widest hover:border-primary/30 transition-all"
                >
                  {sortOptions.find(o => o.id === sortBy)?.label} <ChevronDown className={cn("h-4 w-4 transition-transform", isSortOpen && "rotate-180")} />
                </button>
               
               {isSortOpen && (
                 <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-30">
                    {sortOptions.map(option => (
                      <button 
                        key={option.id}
                        onClick={() => {
                          setSortBy(option.id)
                          setIsSortOpen(false)
                        }}
                        className={cn(
                          "w-full px-6 py-4 flex items-center justify-between text-xs font-bold uppercase tracking-widest transition-all",
                          sortBy === option.id ? "bg-primary text-background" : "hover:bg-white/5"
                        )}
                      >
                        {option.label}
                        {sortBy === option.id && <Check className="h-4 w-4" />}
                      </button>
                    ))}
                 </div>
               )}
            </div>

            <div className="h-12 w-px bg-white/5 hidden md:block" />
            
            <div className="flex items-center bg-surface p-1 rounded-xl border border-white/5">
               <button 
                 onClick={() => setViewType('grid')}
                 className={cn(
                   "h-10 w-10 flex items-center justify-center rounded-lg transition-all",
                   viewType === 'grid' ? "bg-primary text-background shadow-neon-soft" : "text-text-muted hover:text-foreground"
                 )}
               >
                  <LayoutGrid className="h-5 w-5" />
               </button>
               <button 
                 onClick={() => setViewType('list')}
                 className={cn(
                   "h-10 w-10 flex items-center justify-center rounded-lg transition-all",
                   viewType === 'list' ? "bg-primary text-background shadow-neon-soft" : "text-text-muted hover:text-foreground"
                 )}
               >
                  <List className="h-5 w-5" />
               </button>
            </div>
          </div>
        </div>

        {/* Mobile Search/Filter Bar */}
        <div className="lg:hidden flex flex-col gap-4">
          <div className="flex gap-2 relative">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ex: calça jeans, iphone, etc..."
                className="w-full h-14 bg-surface border border-white/5 rounded-2xl px-6 outline-none text-sm font-bold"
              />
              <SearchIcon className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            </div>
            <button 
              onClick={() => setIsCatOpen(!isCatOpen)}
              className={cn(
                "h-14 px-6 bg-surface border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest",
                activeCategory !== "Todos" && "text-primary border-primary/30"
              )}
            >
               {activeCategory === "Todos" ? <Filter className="h-5 w-5" /> : activeCategory}
               <ChevronDown className={cn("h-4 w-4 transition-transform", isCatOpen && "rotate-180")} />
            </button>
          </div>
          
          {/* Mobile Cat Dropdown */}
          {isCatOpen && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 z-40 bg-surface/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-2 p-4">
                   {categories.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat)
                          setIsCatOpen(false)
                        }}
                        className={cn(
                          "px-4 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all text-center",
                          activeCategory === cat ? "bg-primary text-background" : "bg-white/5 text-text-muted hover:bg-white/10"
                        )}
                      >
                        {cat}
                      </button>
                   ))}
                </div>
              </div>
            )}

          {/* Quick Stats / Feedback */}
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Até R$ {priceRange[1].toLocaleString()}</span>
             </div>
             {brand && (
                <button onClick={() => setBrand("")} className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-1">
                   <X className="h-3 w-3" /> {brand}
                </button>
             )}
          </div>
        </div>

        {/* Grid / List Results */}
        <div className={cn(
          "transition-all duration-500",
          viewType === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-[10px]" 
            : "flex flex-col gap-[10px]"
        )}>
          {loading && products.length === 0 ? (
            Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                className={cn(viewType === 'list' && "flex-row list-view h-32 md:h-40")} 
              />
            ))
          ) : (
            <div className="col-span-full py-40 text-center flex flex-col items-center gap-6">
               <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center text-text-muted border border-white/5">
                  <SearchIcon className="h-10 w-10" />
               </div>
               <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-bold uppercase tracking-tight italic">Nenhum Produto Encontrado</h3>
                  <p className="text-text-muted text-xs font-bold uppercase tracking-widest">A busca por "{searchQuery}" não retornou resultados.</p>
               </div>
                <button 
                  onClick={() => {
                    setInputValue("")
                    setActiveCategory("Todos")
                  }}
                  className="mt-4 px-8 py-4 bg-primary text-background rounded-xl font-bold uppercase tracking-widest text-xs shadow-neon-soft"
                >
                  Reiniciar Loja
                </button>
            </div>
          )}
          {/* Load More Section */}
          {hasMore && products.length > 0 && (
            <div className="col-span-full mt-16 flex justify-center">
              <button
                onClick={() => setPage(prev => prev + 1)}
                disabled={loading}
                className="group relative h-14 px-12 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative z-10 text-sm font-black uppercase tracking-widest flex items-center gap-3">
                  {loading ? (
                    <>Carregando... <Loader2 className="h-4 w-4 animate-spin text-primary" /></>
                  ) : (
                    <>Ver Mais Produtos <ChevronDown className="h-4 w-4" /></>
                  )}
                </span>
              </button>
            </div>
          )}

          {!hasMore && products.length > 0 && (
            <div className="col-span-full mt-16 text-center">
              <span className="text-xs font-black uppercase tracking-[0.4em] text-text-muted opacity-50 italic">
                Você chegou ao fim do estoque.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background pb-20">
      <Header />
      
      <section className="pt-24 lg:pt-32 pb-12 px-6 lg:px-12">
        <div className="container mx-auto">
          <Suspense fallback={<div className="py-20 text-center uppercase font-black animate-pulse text-primary tracking-[0.5em]">Sincronizando Banco de Dados...</div>}>
            <SearchResults />
          </Suspense>
        </div>
      </section>

      <div className="fixed top-0 left-1/4 w-[1000px] h-[1000px] bg-primary/5 blur-[150px] rounded-full pointer-events-none -z-10" />
    </main>
  )
}
