"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { NeonButton } from "@/components/ui/neon-button"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { 
  Settings, 
  Package, 
  Heart, 
  LogOut, 
  Zap, 
  Loader2,
  ChevronRight,
  ShoppingBag,
  Plus,
  MapPin,
  Trash2,
  Grid,
  Bookmark,
  User as UserIcon,
  Crown,
  Trophy,
  Star,
  Target,
  ArrowUpRight
} from "lucide-react"
import { cn, getLevelInfo } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useWishlist } from "@/lib/store"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [addresses, setAddresses] = useState<any[]>([])
  const [points, setPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { setWishlist, wishlist } = useWishlist()
  
  const [editForm, setEditForm] = useState({
    full_name: '',
    username: ''
  })
  const [settingsSection, setSettingsSection] = useState('profile') // 'profile' or 'account'
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTabState] = useState(searchParams.get("tab") || "posts")

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab)
    router.push(`/perfil?tab=${tab}`, { scroll: false })
  }

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push("/login")
      return
    }

    setUser(user)
    
    // Parallel fetches
    const [pResp, oResp, aResp, lResp] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('user_addresses').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('loyalty_points').select('points').eq('user_id', user.id).single()
    ])

    if (pResp.data) {
      setProfile(pResp.data)
      setEditForm({
        full_name: pResp.data.full_name || user.user_metadata?.full_name || '',
        username: pResp.data.username || user.email?.split('@')[0] || ''
      })
    }
    
    if (oResp.data) setOrders(oResp.data)
    if (aResp.data) setAddresses(aResp.data)
    if (lResp.data) setPoints(lResp.data.points || 0)

    // Sync Wishlist
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

    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success("Sessão encerrada")
    router.push("/")
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          username: editForm.username
        })
        .eq('id', user.id)

      if (error) throw error
      
      toast.success("Perfil atualizado!")
      setProfile({ ...profile, full_name: editForm.full_name, username: editForm.username })
      setActiveTab("posts")
    } catch (err: any) {
      toast.error("Erro ao atualizar", { description: err.message })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary animate-pulse" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary">Carregando Perfil Elite</p>
      </div>
    )
  }

  const levelInfo = getLevelInfo(points)
  const userInitial = (profile?.full_name || user?.email)?.[0].toUpperCase() || "U"
  const username = profile?.username || user?.email?.split('@')[0] || "usuario"
  const fullName = profile?.full_name || "Membro AcheiAqui"

  return (
    <main className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      <Header />
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-tech opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl pt-24 md:pt-36 pb-20 relative z-10">
        
        {/* explosive Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-8 md:mb-16">
          
          {/* Profile Card (Left) */}
          <div className="lg:col-span-4 flex flex-row md:flex-col items-center gap-6 md:gap-8 bg-surface/30 md:bg-transparent p-6 md:p-0 rounded-[32px] border border-white/5 md:border-none">
            <div className="relative group shrink-0">
              {/* Animated Rings */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary via-primary to-primary rounded-full opacity-20 group-hover:opacity-40 blur-xl transition-all duration-700 animate-pulse" />
              
              <div className="relative h-24 w-24 md:h-52 md:w-52 rounded-full p-[2px] md:p-[3px] bg-gradient-to-tr from-primary via-primary to-primary">
                <div className="h-full w-full rounded-full bg-background p-1 md:p-1.5">
                  <div className="relative h-full w-full rounded-full overflow-hidden bg-surface flex items-center justify-center text-3xl md:text-8xl font-bold text-primary italic">
                    {profile?.avatar_url ? (
                      <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
                    ) : (
                      <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>{userInitial}</motion.span>
                    )}
                  </div>
                </div>
              </div>

              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 -right-1 h-8 w-8 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-surface border border-white/10 flex items-center justify-center shadow-2xl"
              >
                <div className="h-6 w-6 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-primary flex items-center justify-center text-background">
                  <Trophy className="h-3 w-3 md:h-5 md:w-5" />
                </div>
              </motion.div>
            </div>

            <div className="text-left md:text-center flex flex-col items-start md:items-center flex-1">
              <div className="flex items-center gap-2 md:gap-3 mb-1">
                <h1 className="text-xl md:text-3xl font-bold tracking-tighter italic uppercase leading-none">@{username}</h1>
                {levelInfo.level > 10 && <Crown className="h-4 w-4 md:h-6 md:w-6 text-primary animate-bounce" />}
                <button 
                  onClick={() => setActiveTab("settings")}
                  className="h-8 w-8 md:h-10 md:w-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg md:rounded-xl flex items-center justify-center transition-all group"
                >
                  <Settings className="h-4 w-4 md:h-5 md:w-5 group-hover:rotate-90 transition-transform duration-500" />
                </button>
              </div>
              <p className="text-text-muted font-bold text-[8px] md:text-[10px] uppercase tracking-[0.3em]">{levelInfo.rank} • Membro</p>
            </div>
          </div>

          {/* XP & Stats Section (Right) */}
          <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
            <div className="grid grid-cols-3 gap-3 md:gap-4">
               {[
                 { label: 'Pedidos', value: orders.length, icon: Package, color: 'text-primary' },
                 { label: 'Level', value: levelInfo.level, icon: Zap, color: 'text-primary' },
                 { label: 'XP', value: points, icon: Star, color: 'text-white' },
               ].map((stat, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="bg-surface/30 backdrop-blur-md border border-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl group hover:border-primary/20 transition-all flex flex-col items-center md:items-start"
                 >
                    <stat.icon className={cn("h-4 w-4 md:h-6 md:w-6 mb-2 md:mb-4", stat.color)} />
                    <p className="text-[7px] md:text-[10px] font-bold text-text-muted uppercase tracking-widest mb-0.5 md:mb-1">{stat.label}</p>
                    <p className="text-lg md:text-3xl font-bold italic tracking-tighter">{stat.value}</p>
                 </motion.div>
               ))}
            </div>

            {/* Level Progress Card */}
            <div className="bg-surface/30 backdrop-blur-md border border-white/5 p-8 rounded-[32px] relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8">
                  <Target className="h-12 w-12 text-primary/10 group-hover:text-primary/20 transition-colors" />
               </div>
               
               <div className="relative z-10">
                 <div className="flex items-end justify-between mb-6">
                    <div>
                      <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Seu Progresso</h3>
                      <p className="text-3xl md:text-4xl font-bold tracking-tighter italic uppercase leading-none">
                        Faltam <span className="text-primary">{levelInfo.xpToNext} XP</span> <br />
                        para o <span className="text-primary">Level {levelInfo.level + 1}</span>
                      </p>
                    </div>
                    <div className="text-right hidden md:block">
                       <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Patente Atual</p>
                       <p className="text-xl font-bold italic text-primary">{levelInfo.rank}</p>
                    </div>
                 </div>

                 {/* Premium XP Bar */}
                 <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/10 p-[2px]">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${levelInfo.progress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-primary via-primary to-primary rounded-full relative"
                    >
                       <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-shimmer" />
                    </motion.div>
                 </div>
                 
                 <div className="flex justify-between mt-4">
                    <div className="flex gap-1 items-center">
                       <span className="text-xs font-bold italic text-primary">LVL {levelInfo.level}</span>
                       <div className="h-px w-8 bg-white/10" />
                    </div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                       {Math.floor(levelInfo.progress)}% concluído
                    </span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* content Tabs */}
        <div className="flex flex-col gap-10">
          <div className="flex items-center justify-center gap-1 bg-surface/50 backdrop-blur-xl p-1 rounded-2xl border border-white/5 w-fit mx-auto">
            {[
              { id: 'posts', label: 'PEDIDOS', icon: Grid },
              { id: 'wishlist', label: 'FAVORITOS', icon: Bookmark },
              { id: 'addresses', label: 'ENDEREÇOS', icon: MapPin },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest",
                  activeTab === tab.id 
                    ? "bg-primary text-background shadow-neon-soft" 
                    : "text-text-muted hover:text-foreground hover:bg-white/5"
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "posts" && (
                orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 bg-surface/10 rounded-[32px] border border-dashed border-white/5">
                    <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                      <ShoppingBag className="h-10 w-10 text-text-muted" />
                    </div>
                    <p className="text-lg font-bold italic uppercase tracking-tighter">Sua jornada começa aqui</p>
                    <p className="text-sm text-text-muted uppercase tracking-widest mt-2">Nenhum pedido realizado ainda.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map((order) => (
                      <div key={order.id} className="group bg-surface/30 border border-white/5 rounded-3xl overflow-hidden hover:border-primary/30 transition-all">
                        <div className="relative h-48 w-full">
                           <Image 
                             src={order.items?.[0]?.image || "https://images.unsplash.com/photo-1542393545-10f5cde2c810?q=80&w=400"} 
                             alt="Order" 
                             fill 
                             className="object-cover transition-transform group-hover:scale-105 duration-700"
                           />
                           <div className="absolute top-4 right-4 px-3 py-1 bg-background/60 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
                             ID: #{order.id.slice(0, 8)}
                           </div>
                        </div>
                        <div className="p-6">
                           <div className="flex justify-between items-start mb-4">
                              <div>
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">{new Date(order.created_at).toLocaleDateString()}</p>
                                <p className="text-lg font-bold italic tracking-tighter uppercase">Status: {order.status}</p>
                              </div>
                              <p className="text-xl font-bold text-primary italic pr-[5px]">R$ {order.total_amount?.toLocaleString()}</p>
                           </div>
                           <button className="w-full h-12 bg-white/5 hover:bg-primary hover:text-background border border-white/10 hover:border-primary rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                             Ver Detalhes <ArrowUpRight className="h-4 w-4" />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {activeTab === "wishlist" && (
                wishlist.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-40 opacity-40">
                    <Heart className="h-16 w-16 mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest">Seus itens favoritos aparecerão aqui</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlist.map((item) => (
                      <ProductCard key={item.id} product={item as any} />
                    ))}
                  </div>
                )
              )}

              {activeTab === "addresses" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="p-8 rounded-[32px] bg-surface/30 border border-white/5 flex flex-col gap-2 relative group hover:border-primary/20 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <button 
                          onClick={async () => {
                            await supabase.from('user_addresses').delete().eq('id', addr.id)
                            setAddresses(addresses.filter(a => a.id !== addr.id))
                            toast.success("Endereço removido")
                          }}
                          className="h-10 w-10 rounded-xl bg-red-500/5 text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="font-bold text-lg italic tracking-tighter uppercase">{addr.nome}</p>
                      <p className="text-sm text-text-secondary">{addr.rua}, {addr.numero}</p>
                      <p className="text-xs text-text-muted uppercase tracking-widest">{addr.cidade} - {addr.cep}</p>
                    </div>
                  ))}
                  <button 
                    onClick={() => toast.info("Funcionalidade em manutenção")}
                    className="p-8 rounded-[32px] border border-dashed border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-4 text-text-muted group"
                  >
                    <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      <Plus className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Adicionar Novo Endereço</span>
                  </button>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
                   {/* Settings Sidebar Menu */}
                   <div className="w-full md:w-64 flex flex-col gap-2">
                      <button 
                        onClick={() => setSettingsSection('profile')}
                        className={cn(
                          "w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all",
                          settingsSection === 'profile' ? "bg-primary text-background shadow-neon-soft" : "bg-surface/30 text-text-muted hover:bg-white/5"
                        )}
                      >
                        <UserIcon className="h-4 w-4" /> Editar Perfil
                      </button>
                      <button 
                        onClick={() => setSettingsSection('account')}
                        className={cn(
                          "w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all",
                          settingsSection === 'account' ? "bg-primary text-background shadow-neon-soft" : "bg-surface/30 text-text-muted hover:bg-white/5"
                        )}
                      >
                        <Settings className="h-4 w-4" /> Config Conta
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest text-red-500 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 transition-all mt-4"
                      >
                        <LogOut className="h-4 w-4" /> Sair da Conta
                      </button>
                   </div>

                   {/* Settings Content Area */}
                   <div className="flex-1 bg-surface/30 backdrop-blur-md border border-white/5 p-8 md:p-12 rounded-[40px]">
                      <AnimatePresence mode="wait">
                        {settingsSection === 'profile' ? (
                          <motion.div key="profile-edit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <h2 className="text-3xl font-bold mb-10 uppercase tracking-tighter italic">Editar <span className="text-primary">Perfil</span></h2>
                            
                            <div className="flex flex-col gap-8">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-3">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-2">Nome de Exibição</label>
                                  <input 
                                    type="text" 
                                    value={editForm.full_name}
                                    onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                                    className="h-14 bg-background/50 border border-white/10 rounded-2xl px-6 text-sm outline-none focus:border-primary/50 transition-all" 
                                  />
                                </div>
                                <div className="flex flex-col gap-3">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-2">Username</label>
                                  <input 
                                    type="text" 
                                    value={editForm.username}
                                    onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                                    className="h-14 bg-background/50 border border-white/10 rounded-2xl px-6 text-sm outline-none focus:border-primary/50 transition-all" 
                                  />
                                </div>
                              </div>

                              <NeonButton onClick={handleSaveProfile} disabled={isSaving} className="w-full h-14 rounded-2xl text-[10px] font-bold uppercase tracking-widest">
                                {isSaving ? "Sincronizando..." : "Salvar Alterações"}
                              </NeonButton>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div key="account-settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <h2 className="text-3xl font-bold mb-10 uppercase tracking-tighter italic">Configuração da <span className="text-primary">Conta</span></h2>
                            
                            <div className="flex flex-col gap-6">
                              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted block mb-2">E-mail Cadastrado</span>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-bold">{user?.email}</span>
                                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[8px] font-black text-primary uppercase tracking-widest italic">Verificado</span>
                                  </div>
                                </div>
                              </div>

                              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 opacity-50 cursor-not-allowed">
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Segurança</span>
                                    <span className="text-sm font-bold uppercase tracking-tighter">Alterar Senha</span>
                                  </div>
                                  <button disabled className="text-[10px] font-black text-primary uppercase tracking-widest">Em Breve</button>
                                </div>
                              </div>

                              <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 mt-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">Zona de Risco</h4>
                                <p className="text-[10px] text-text-muted uppercase leading-relaxed mb-4 font-semibold">Ao deletar sua conta, todos os seus pontos de fidelidade e histórico de pedidos serão permanentemente apagados.</p>
                                <button className="text-[10px] font-black text-red-500 hover:underline uppercase tracking-widest">Deletar Minha Conta</button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}
