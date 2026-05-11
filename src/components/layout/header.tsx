"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, User, Menu, X, Zap, Search, ChevronRight, Plus, Minus, Trash2, Phone, ArrowRight } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { useState, useEffect, useLayoutEffect } from "react"
import { useCart } from "@/lib/store"
import { cn } from "@/lib/utils"
import { SearchSidebar } from "./search-sidebar"

const ADMIN_EMAIL = "caiojos@gmail.com"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { items, updateQuantity, removeItem } = useCart()
  const [user, setUser] = useState<any>(null)
  
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const isHomePage = pathname === "/"

  useLayoutEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    handleScroll() // Initialize on mount
    window.addEventListener("scroll", handleScroll)

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      subscription.unsubscribe()
    }
  }, [])

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/loja", label: "Loja" },
    { href: "/quem-somos", label: "Quem Somos" },
  ]

  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <SearchSidebar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 py-5",
          isScrolled
            ? "bg-black border-b border-white/5 shadow-2xl" 
            : "bg-transparent"
        )}
      >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 md:gap-4 group relative">
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-tr from-primary via-primary/50 to-primary p-[2px] shadow-neon-soft transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
              <div className="h-full w-full rounded-[14px] bg-background p-1 flex sm:p-1.5 flex items-center justify-center overflow-hidden">
                <Image 
                  src="/images/logo.png" 
                  alt="AcheiAqui Logo" 
                  width={36} 
                  height={36}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl md:text-2xl tracking-tighter uppercase leading-none italic bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-primary/80">
                ACHEI<span className="text-primary">AQUI</span>
              </span>
              <span className="text-[8px] sm:text-[10px] font-bold text-primary uppercase tracking-[0.3em] sm:tracking-[0.4em] leading-none mt-0.5 sm:mt-1.5 transition-all group-hover:tracking-[0.5em] italic">
                Encontrou, Levou.
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs font-bold uppercase tracking-[0.2em] transition-all relative group py-2",
                  pathname === link.href ? "text-primary" : "text-text-secondary hover:text-foreground"
                )}
              >
                {link.label}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300",
                  pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                )} />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-[10px]">

            <button 
              onClick={() => setIsSearchOpen(true)} 
              className="hidden sm:flex h-12 w-12 rounded-2xl bg-white/5 border border-white/10 items-center justify-center hover:bg-white/10 transition-all text-text-muted hover:text-primary"
            >
              <Search className="h-5 w-5" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button onClick={() => setIsCartSidebarOpen(true)} className="relative group">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-background"
              >
                <ShoppingCart className="h-5 w-5" />
              </motion.div>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    key="cart-badge"
                    className="absolute -top-2 -right-2 h-6 w-6 bg-primary text-background text-xs font-bold rounded-full flex items-center justify-center border-2 border-background shadow-lg"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <div className="flex items-center gap-2">
              {user?.email === ADMIN_EMAIL && (
                <Link 
                  href="/dashboard" 
                  className="hidden md:flex h-12 px-6 rounded-2xl bg-primary/10 border border-primary/20 text-primary items-center justify-center hover:bg-primary hover:text-background transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/10"
                >
                  Painel ADM
                </Link>
              )}
              <Link href={user ? "/perfil" : "/login"} className="hidden sm:flex h-12 w-12 rounded-2xl bg-white/5 border border-white/10 items-center justify-center hover:bg-white/10 transition-all text-text-muted hover:text-primary overflow-hidden relative group">
                {user ? (
                  user.user_metadata?.avatar_url ? (
                    <Image src={user.user_metadata.avatar_url} alt="User Avatar" fill className="object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-black text-xs italic group-hover:bg-primary group-hover:text-background transition-colors">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Link>
            </div>


            <button 
              className="md:hidden h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Shimmering Gold Divider (Only if scrolled) */}
        {isScrolled && (
          <motion.div 
            initial={{ scaleX: 0 }} 
            animate={{ scaleX: 1 }} 
            className="primary-line-h absolute bottom-0 left-0 opacity-20" 
          />
        )}
      </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Mobile Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-xl z-[190]"
            />
            
            {/* Sidebar Content */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 right-0 w-full sm:w-[450px] z-[200] bg-background/95 backdrop-blur-2xl border-l border-white/5 flex flex-col p-8 md:p-12 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] overflow-y-auto"
            >
              <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-surface flex items-center justify-center overflow-hidden p-1 border border-white/10">
                    <Image src="/images/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
                  </div>
                  <span className="font-bold text-xl tracking-tighter uppercase italic">ACHEI<span className="text-primary">AQUI</span></span>
                </div>
                <button 
                  className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-primary hover:text-background transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

             {/* User Profile Mini Session (Mobile Only) */}
             {user && (
               <Link 
                 href="/perfil"
                 onClick={() => setIsMobileMenuOpen(false)}
                 className="mb-10 p-6 rounded-[2.5rem] bg-gradient-to-br from-surface to-surface/40 border border-white/10 flex items-center gap-4 relative overflow-hidden group shadow-2xl"
               >
                 <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative shrink-0">
                    {user.user_metadata?.avatar_url ? (
                      <Image src={user.user_metadata.avatar_url} alt="Avatar" fill className="object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary text-background font-black text-xl italic">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                    )}
                 </div>
                 <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-xs font-black text-primary uppercase tracking-widest mb-1">Membro Flash</span>
                    <span className="text-xl font-black uppercase tracking-tighter truncate leading-none mb-2">{user.email?.split('@')[0]}</span>
                    
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                       <div className="h-full w-[65%] bg-primary shadow-[0_0_10px_rgba(198,255,0,0.5)]" />
                    </div>
                    <div className="flex justify-between items-center mt-1.5">
                       <span className="text-xs font-black uppercase tracking-widest text-text-muted">Nível 12</span>
                       <span className="text-xs font-black uppercase tracking-widest text-primary italic">650 / 1000 XP</span>
                    </div>
                 </div>
                 <ChevronRight className="h-6 w-6 text-white/20" />
               </Link>
             )}

             {!user && (
               <Link 
                 href="/login"
                 onClick={() => setIsMobileMenuOpen(false)}
                 className="mb-10 p-6 rounded-[2.5rem] bg-surface border border-white/10 flex items-center gap-4 group"
               >
                 <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all">
                    <User className="h-6 w-6" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-lg font-black uppercase tracking-tight">Entrar na Conta</span>
                    <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Acesse seu painel exclusivo</span>
                 </div>
               </Link>
             )}

            <nav className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className="text-4xl font-bold uppercase tracking-tighter flex items-center justify-between group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className={pathname === link.href ? "text-primary" : "text-foreground"}>
                    {link.label}
                  </span>
                  <ChevronRight className="h-8 w-8 text-white/10 group-hover:text-primary group-hover:translate-x-2 transition-all" />
                </Link>
              ))}
            </nav>

             <div className="mt-auto flex flex-col gap-4">
                <div className="primary-line-h opacity-20 mb-8" />
                <div className="flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-widest text-text-muted">AcheiAqui Marketplace</span>
                      <span className="text-xs font-black uppercase tracking-widest text-primary italic">v2.4.0</span>
                   </div>
                   <Link href="/politica-de-privacidade" className="text-xs font-black uppercase tracking-widest text-text-muted hover:text-white underline">Privacidade</Link>
                </div>
             </div>
          </motion.div>
        </>
      )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartSidebarOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-surface border-l border-white/10 shadow-2xl z-[110] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold uppercase tracking-tighter">Seu Carrinho</h3>
                </div>
                <button
                  onClick={() => setIsCartSidebarOpen(false)}
                  className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-destructive/20 hover:text-destructive transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                    <ShoppingCart className="h-16 w-16 mb-4" />
                    <p className="font-bold uppercase tracking-widest text-sm">Seu carrinho está vazio</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 relative group">
                      <div className="h-20 w-20 relative rounded-xl overflow-hidden shrink-0 bg-background">
                        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col flex-1">
                        <h4 className="text-sm font-bold uppercase tracking-tight line-clamp-1">{item.name}</h4>
                        <span className="text-xs font-semibold text-primary mb-2">R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        
                        <div className="flex items-center gap-3 mt-auto">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="h-6 w-6 rounded-md bg-white/10 flex items-center justify-center hover:bg-primary hover:text-background transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 rounded-md bg-white/10 flex items-center justify-center hover:bg-primary hover:text-background transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          {/* Remove Button - Always visible on mobile/desktop now */}
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:bg-destructive/20 hover:text-destructive hover:border-destructive/30 transition-all ml-4"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="p-6 border-t border-white/5 bg-background/50">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-bold uppercase tracking-widest text-text-muted">Subtotal</span>
                    <span className="text-xl font-bold tracking-tighter">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartSidebarOpen(false)}
                    className="w-full h-14 bg-primary text-background rounded-xl font-bold uppercase tracking-widest flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Finalizar Pedido
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Drawer */}
      <AnimatePresence>
        {isSearchDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchDrawerOpen(false)}
              className="fixed inset-0 bg-background/90 backdrop-blur-md z-[200]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full sm:w-[500px] z-[210] bg-[#0A0A0A] border-l border-white/10 flex flex-col p-8 md:p-16"
            >
              <div className="flex items-center justify-between mb-20">
                 <h2 className="text-3xl font-black uppercase tracking-tighter italic">Busca <span className="text-primary">Inteligente</span></h2>
                 <button 
                  onClick={() => setIsSearchDrawerOpen(false)}
                  className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                 >
                   <X className="h-6 w-6" />
                 </button>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  if (searchQuery.trim()) {
                    router.push(`/loja?q=${encodeURIComponent(searchQuery.trim())}`)
                    setIsSearchDrawerOpen(false)
                  }
                }}
                className="relative group"
              >
                 <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent-cyan/20 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition-opacity" />
                 <input 
                   autoFocus
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Ex: calça jeans, iphone, etc..."
                   className="relative w-full h-20 bg-surface border border-white/10 rounded-2xl px-8 text-2xl font-bold placeholder:text-text-muted outline-none focus:border-primary/50 transition-all"
                 />
                 <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform">
                   <ArrowRight className="h-8 w-8" />
                 </button>
              </form>

              <div className="mt-12">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-6">Sugestões de Busca</p>
                 <div className="flex flex-wrap gap-3">
                    {["RTX 4090", "Monitor OLED", "Setup Gamer", "Moda Cyber", "Teclado Mecânico"].map((tip) => (
                      <button 
                        key={tip}
                        onClick={() => setSearchQuery(tip)}
                        className="px-6 py-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all text-sm font-bold uppercase tracking-tight"
                      >
                        {tip}
                      </button>
                    ))}
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
