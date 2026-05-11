"use client"

import * as React from "react"
import { useState, useEffect, useRef, useLayoutEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { NeonButton } from "@/components/ui/neon-button"
import { supabase } from "@/lib/supabase"
import { 
  Package, 
  ShoppingBag, 
  Users, 
  Plus, 
  Trash2, 
  Edit, 
  TrendingUp, 
  Activity,
  LogOut,
  X,
  Loader2,
  PlayCircle,
  Layout
} from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const ADMIN_EMAIL = "caiojos@gmail.com"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [emails, setEmails] = useState<any[]>([])
  const [banners, setBanners] = useState<any[]>([])
  const [stats, setStats] = useState({
    revenue: 0,
    sales: 0,
    products: 0,
    customers: 0
  })
  const [dbCategories, setDbCategories] = useState<any[]>([])
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [editingBanner, setEditingBanner] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [gallery, setGallery] = useState<string[]>([]);
  const [marketingGallery, setMarketingGallery] = useState<string[]>([]);
  const [bannerImage, setBannerImage] = useState("")
  const [allowInstallments, setAllowInstallments] = useState(true)
  const [isBannerActive, setIsBannerActive] = useState(true)
  const [generatedSlug, setGeneratedSlug] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const marketingFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    checkAdmin()
    fetchData()
  }, [])

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== ADMIN_EMAIL) {
      window.location.href = "/"
    }
  }

  async function fetchData() {
    setLoading(true)
    try {
      const [pResp, oResp, eResp, bResp, cResp] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*, profiles(full_name)').order('created_at', { ascending: false }),
        supabase.from('newsletter_subs').select('*').order('created_at', { ascending: false }),
        supabase.from('banners').select('*').order('display_order', { ascending: true }),
        supabase.from('categories').select('*').order('name', { ascending: true })
      ])

      if (pResp.data) setProducts(pResp.data)
      if (oResp.data) setOrders(oResp.data)
      if (eResp.data) setEmails(eResp.data)
      if (bResp.data) setBanners(bResp.data)
      if (cResp.data) setDbCategories(cResp.data)
      
      // Fetch Marketing Gallery
      fetchMarketingGallery()

      const rev = oResp.data?.reduce((acc, o) => acc + (o.total_amount || 0), 0) || 0
      setStats({
        revenue: rev,
        sales: oResp.data?.length || 0,
        products: pResp.data?.length || 0,
        customers: new Set(oResp.data?.map(o => o.user_id)).size
      })
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast.error("Falha na sincronização do Core")
    }
    setLoading(false)
  }

  async function fetchMarketingGallery() {
    const { data, error } = await supabase.storage.from('products').list('banners/')
    if (data) {
      const urls = data.map(file => {
        const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(`banners/${file.name}`)
        return publicUrl
      })
      setMarketingGallery(urls)
    }
  }

  async function handleMarketingUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return
    setUploading(true)
    
    try {
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `banners/${fileName}`

      const { error: uploadError } = await supabase.storage.from('products').upload(filePath, file)
      if (uploadError) throw uploadError

      fetchMarketingGallery()
      toast.success("Mídia enviada para a Galeria")
    } catch (error: any) {
      toast.error("Erro no upload: " + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return
    const { data, error } = await supabase.from('categories').insert({ name: newCategoryName.trim() }).select()
    if (error) {
      toast.error("Erro ao adicionar categoria")
      console.error(error)
    } else if (data && data.length > 0) {
      setDbCategories([...dbCategories, data[0]])
      setNewCategoryName("")
      setShowAddCategory(false)
      toast.success("Categoria adicionada")
    } else {
      toast.error("Resposta inesperada do servidor")
    }
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploading(true)
    const newImages = [...gallery]

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from('products')
        .upload(filePath, file)

      if (data) {
        const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(data.path)
        newImages.push(publicUrl)
      }
    }

    setGallery(newImages)
    setUploading(false)
  }

  const removeImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index))
  }

  const openModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product)
      setGallery(product.images || [])
      setAllowInstallments(product.allow_installments ?? true)
      setGeneratedSlug(product.slug)
    } else {
      setEditingProduct(null)
      setGallery([])
      setAllowInstallments(true)
      setGeneratedSlug("")
    }
    setIsModalOpen(true)
  }

  const openBannerModal = (banner: any = null) => {
    if (banner) {
      setEditingBanner(banner)
      setBannerImage(banner.image_url)
      setIsBannerActive(banner.is_active ?? true)
    } else {
      setEditingBanner(null)
      setBannerImage("")
      setIsBannerActive(true)
    }
    setIsBannerModalOpen(true)
  }

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      slug: generatedSlug,
      price: parseFloat(formData.get('price') as string),
      stock: parseInt(formData.get('stock') as string),
      category: formData.get('category'),
      description: formData.get('description'),
      main_image: gallery[0] || "",
      images: gallery,
      allow_installments: allowInstallments,
      voltage: formData.get('voltage'),
      power_source: formData.get('power_source'),
      weight: formData.get('weight'),
      warranty_months: parseInt(formData.get('warranty_months') as string || "0"),
    }

    if (editingProduct?.id) {
      const { error } = await supabase.from('products').update(data).eq('id', editingProduct.id)
      if (error) toast.error(error.message)
      else toast.success("Produto atualizado")
    } else {
      const { error } = await supabase.from('products').insert(data)
      if (error) toast.error(error.message)
      else toast.success("Produto cadastrado")
    }

    setIsModalOpen(false)
    fetchData()
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Confirmar desintegração permanente?")) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) toast.error(error.message)
    else {
      toast.success("Item removido")
      fetchData()
    }
  }

  const handleSaveBanner = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      image_url: bannerImage,
      link_url: formData.get('link_url'),
      display_order: parseInt(formData.get('display_order') as string || "0"),
      is_active: isBannerActive
    }

    if (editingBanner?.id) {
      const { error } = await supabase.from('banners').update(data).eq('id', editingBanner.id)
      if (error) toast.error(error.message)
      else toast.success("Banner atualizado")
    } else {
      const { error } = await supabase.from('banners').insert(data)
      if (error) toast.error(error.message)
      else toast.success("Banner cadastrado")
    }

    setIsBannerModalOpen(false)
    fetchData()
  }

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Remover banner?")) return
    await supabase.from('banners').delete().eq('id', id)
    fetchData()
  }

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: 'Receita Total', value: `R$ ${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-primary' },
        { label: 'Vendas Core', value: stats.sales, icon: ShoppingBag, color: 'bg-white' },
        { label: 'Produtos Ativos', value: stats.products, icon: Package, color: 'bg-primary' },
        { label: 'Clientes Elite', value: stats.customers, icon: Users, color: 'bg-white' },
      ].map((stat, i) => (
        <div key={i} className="gaming-card p-6 relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-all">
            <stat.icon className="h-12 w-12" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-2">{stat.label}</p>
          <p className="text-3xl font-black italic tracking-tighter">{stat.value}</p>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <div className={cn("h-full w-[70%]", stat.color)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic">Gestão de <span className="text-primary">Inventário</span></h2>
        <button 
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 px-6 h-12 bg-primary text-background rounded-xl font-black text-[10px] uppercase tracking-widest hover:shadow-neon-soft transition-all group"
        >
          <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
          Novo Item
        </button>
      </div>

      <div className="gaming-card overflow-hidden">
        <div className="divide-y divide-white/5">
          {products.map((prod) => (
            <div key={prod.id} className="h-[70px] px-6 flex items-center justify-between gap-4 hover:bg-primary/5 transition-colors group">
              <div className="flex items-center gap-6 flex-1 min-w-0">
                <div className="h-10 w-10 rounded-full border border-white/10 overflow-hidden bg-surface flex-shrink-0 relative">
                  <Image src={prod.main_image || ""} alt={prod.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col min-w-0 justify-center">
                  <span className="text-xs font-black uppercase tracking-tighter leading-tight line-clamp-2">{prod.name}</span>
                  <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest">R$ {prod.price.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <button onClick={() => openModal(prod)} className="h-10 px-6 rounded-lg bg-primary text-background text-[9px] font-black uppercase tracking-widest hover:shadow-neon-soft transition-all">
                  Editar
                </button>
                <button onClick={() => handleDeleteProduct(prod.id)} className="p-2 text-text-muted hover:text-destructive transition-all">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderOrders = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-black uppercase tracking-tighter italic">Gestão de <span className="text-primary">Pedidos</span></h2>
      <div className="gaming-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-6 text-[10px] font-black text-text-muted uppercase tracking-widest">ID / Data</th>
                <th className="p-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Cliente</th>
                <th className="p-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Total</th>
                <th className="p-6 text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-primary/5 transition-colors">
                  <td className="p-6">
                    <p className="text-xs font-black uppercase">#{order.id.slice(0, 8)}</p>
                    <p className="text-[10px] text-text-muted">{new Date(order.created_at).toLocaleDateString()}</p>
                  </td>
                  <td className="p-6">
                    <p className="text-xs font-bold">{order.profiles?.full_name || "N/A"}</p>
                  </td>
                  <td className="p-6">
                    <p className="text-xs font-black text-primary">R$ {order.total_amount.toLocaleString()}</p>
                  </td>
                  <td className="p-6">
                    <span className="text-[10px] font-black uppercase px-2 py-1 rounded bg-primary/20 text-primary border border-primary/20">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderEmails = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-black uppercase tracking-tighter italic">Lista de <span className="text-primary">Newsletter</span></h2>
      <div className="gaming-card overflow-hidden max-w-2xl">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
           <span className="text-xs font-black uppercase text-text-muted">{emails.length} Inscritos</span>
           <button 
             onClick={() => {
               const csv = "email,data\n" + emails.map(e => `${e.email},${e.created_at}`).join("\n")
               const blob = new Blob([csv], { type: 'text/csv' })
               const url = window.URL.createObjectURL(blob)
               const a = document.createElement('a')
               a.setAttribute('hidden', '')
               a.setAttribute('href', url)
               a.setAttribute('download', 'newsletter.csv')
               document.body.appendChild(a)
               a.click()
               document.body.removeChild(a)
             }}
             className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
           >
             Exportar CSV
           </button>
        </div>
        <div className="divide-y divide-white/5">
          {emails.map((e, i) => (
            <div key={i} className="p-6 flex justify-between items-center hover:bg-white/[0.02] transition-colors">
               <span className="text-sm font-bold">{e.email}</span>
               <span className="text-[10px] font-black uppercase text-text-muted">{new Date(e.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderBanners = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black uppercase tracking-tighter italic">Canais de <span className="text-primary">Marketing</span></h2>
        <button 
          onClick={() => openBannerModal()}
          className="flex items-center gap-3 px-6 py-3 bg-primary text-background rounded-xl font-black text-[10px] uppercase tracking-widest hover:shadow-neon-soft transition-all group"
        >
          <Layout className="h-4 w-4" />
          Novo Canal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="gaming-card overflow-hidden group border border-white/5 hover:border-primary/20 transition-all">
            <div className="relative aspect-video">
              <Image src={banner.image_url} alt={banner.title || ""} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
              <div className="absolute top-3 right-3">
                 <span className={cn(
                   "text-[9px] font-black uppercase px-2 py-1 rounded-md border backdrop-blur-md",
                   banner.is_active ? "bg-primary/20 text-primary border-primary/20" : "bg-red-500/20 text-red-500 border-red-500/20"
                 )}>
                   {banner.is_active ? 'Ativo' : 'Inativo'}
                 </span>
              </div>
              <div className="absolute bottom-4 left-4 pr-[10px]">
                <p className="text-xl font-black italic tracking-tighter uppercase leading-none mb-1">{banner.title}</p>
                <p className="text-[10px] font-medium text-text-muted uppercase tracking-widest line-clamp-1">{banner.description}</p>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center bg-surface/30">
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase text-text-muted">Prioridade</span>
                <span className="text-xs font-black text-primary">{banner.display_order}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openBannerModal(banner)} className="p-2.5 rounded-xl bg-white/5 hover:bg-primary/20 text-text-muted hover:text-primary transition-all"><Edit className="h-4 w-4" /></button>
                <button onClick={() => handleDeleteBanner(banner.id)} className="p-2.5 rounded-xl bg-white/5 hover:bg-destructive/20 text-text-muted hover:text-destructive transition-all"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-12 border-t border-white/5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black uppercase tracking-tighter italic">Galeria de <span className="text-primary">Mídia Marketing</span></h2>
          <button 
            onClick={() => marketingFileInputRef.current?.click()}
            className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2"
          >
            {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
            Upload para Galeria
          </button>
          <input type="file" ref={marketingFileInputRef} onChange={handleMarketingUpload} className="hidden" accept="image/*" />
        </div>
        
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {marketingGallery.map((url, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden border border-white/5 bg-surface group relative cursor-pointer" onClick={() => {
              setBannerImage(url)
              if (!isBannerModalOpen) openBannerModal()
            }}>
              <Image src={url} alt="Gallery" fill className="object-cover group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 container mx-auto px-6 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <aside className="lg:col-span-3 space-y-10">
            <div className="flex items-center gap-4 mb-10">
               <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-background shadow-neon-soft">
                  <Activity className="h-8 w-8" />
               </div>
               <div className="flex flex-col">
                  <span className="text-xl font-black italic tracking-tighter uppercase leading-none">Terminal</span>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] leading-none mt-1">Admin Core</span>
               </div>
            </div>

            <nav className="space-y-2">
              {[
                { id: 'stats', label: 'Overview Operacional', icon: TrendingUp },
                { id: 'products', label: 'Gestão de Inventário', icon: Package },
                { id: 'orders', label: 'Controle de Pedidos', icon: ShoppingBag },
                { id: 'newsletter', label: 'Lista de Newsletter', icon: Users },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-xs uppercase tracking-widest",
                    activeTab === tab.id 
                      ? "bg-primary text-background shadow-neon-soft translate-x-2" 
                      : "text-text-muted hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="pt-10 border-t border-white/5">
               <button onClick={() => window.location.href = '/'} className="w-full flex items-center gap-4 px-6 py-4 text-text-muted hover:text-red-500 transition-colors font-bold text-xs uppercase tracking-widest">
                  <LogOut className="h-5 w-5" /> Encerrar Core
               </button>
            </div>
          </aside>

          <div className="lg:col-span-9">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40 gap-6">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">Sincronizando Core Systems...</p>
              </div>
            ) : (
              <div>
                {activeTab === 'stats' && renderStats()}
                {activeTab === 'products' && renderProducts()}
                {activeTab === 'orders' && renderOrders()}
                {activeTab === 'newsletter' && renderEmails()}
              </div>
            )}
          </div>
        </div>

        {/* Global Modal Container for Product */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-background/95 backdrop-blur-xl" />
              
              <div 
                className="relative w-full max-w-4xl gaming-card overflow-hidden z-10 flex flex-col max-h-[90vh]"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-primary shadow-neon-soft" />
                
                {/* Modal Header */}
                <div className="p-6 lg:p-8 border-b border-white/5 flex items-center justify-between bg-surface/50 backdrop-blur-md">
                   <h3 className="text-2xl font-black uppercase tracking-tighter italic">{editingProduct?.id ? 'Configurar' : 'Cadastrar'} <span className="text-primary">Recurso</span></h3>
                   <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 rounded-xl bg-white/5 hover:bg-destructive/20 hover:text-destructive transition-all flex items-center justify-center"><X className="h-5 w-5" /></button>
                </div>

                {/* Modal Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-hide">
                  <form id="productForm" onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Mídia de Inventário ({gallery.length}/10)</label>
                        <div className="grid grid-cols-4 gap-2">
                           {gallery.map((url, i) => (
                             <div key={i} className="aspect-square rounded-xl relative overflow-hidden border border-white/10 group bg-surface">
                                <Image src={url} alt="Gallery" fill className="object-cover" />
                                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 h-5 w-5 bg-destructive rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="h-3 w-3 text-white" /></button>
                             </div>
                           ))}
                           {gallery.length < 10 && (
                             <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all group">
                                {uploading ? <Loader2 className="h-5 w-5 text-primary animate-spin" /> : <Plus className="h-5 w-5 text-text-muted group-hover:text-primary" />}
                             </button>
                           )}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} multiple className="hidden" accept="image/*" />
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Transmissão de Vídeo (Opcional)</label>
                        <div className="relative">
                          <PlayCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                          <input name="video_url" defaultValue={editingProduct?.video_url || ""} placeholder="URL do produto em ação..." className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-xs font-bold outline-none focus:border-primary/50 transition-all" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Designação do Produto</label>
                        <input name="name" defaultValue={editingProduct?.name} required onChange={(e) => setGeneratedSlug(generateSlug(e.target.value))} className="h-12 bg-white/5 border border-white/10 rounded-xl px-5 text-sm font-black outline-none focus:border-primary/50 transition-all" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Valor Unitário (R$)</label>
                          <input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required className="h-12 bg-white/5 border border-white/10 rounded-xl px-5 text-sm font-black outline-none focus:border-primary/50 transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Unidades em Stock</label>
                          <input name="stock" type="number" defaultValue={editingProduct?.stock} required className="h-12 bg-white/5 border border-white/10 rounded-xl px-5 text-sm font-black outline-none focus:border-primary/50 transition-all" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Protocolo Financeiro</span>
                          <span className="text-xs font-black uppercase tracking-tighter">Oferecer 12x Sem Juros</span>
                        </div>
                        <button type="button" onClick={() => setAllowInstallments(!allowInstallments)} className={cn("w-12 h-6 rounded-full transition-all relative", allowInstallments ? "bg-primary shadow-neon-soft" : "bg-white/10")}>
                          <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", allowInstallments ? "right-1" : "left-1")} />
                        </button>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between ml-1">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Categoria do Sistema</label>
                          <button type="button" onClick={() => setShowAddCategory(!showAddCategory)} className="text-[9px] font-black uppercase text-primary hover:underline">
                            {showAddCategory ? "Cancelar" : "+ Nova Categoria"}
                          </button>
                        </div>
                        {showAddCategory ? (
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              placeholder="Nome da categoria..."
                              className="flex-1 h-12 bg-primary/5 border border-primary/20 rounded-xl px-5 text-xs font-black outline-none focus:border-primary/50 transition-all"
                            />
                            <button 
                              type="button"
                              onClick={handleAddCategory}
                              className="px-4 bg-primary text-background rounded-xl text-[10px] font-black uppercase shadow-neon-soft"
                            >
                              Add
                            </button>
                          </div>
                        ) : (
                          <select name="category" defaultValue={editingProduct?.category} required className="h-12 bg-white/5 border border-white/10 rounded-xl px-5 text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer focus:border-primary/50 transition-all">
                            {dbCategories.map(cat => <option key={cat.id} value={cat.name} className="bg-surface">{cat.name}</option>)}
                          </select>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Descrição do Produto</label>
                        <textarea name="description" defaultValue={editingProduct?.description} className="h-24 bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-medium outline-none focus:border-primary/50 resize-none transition-all" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Voltagem</label>
                          <input name="voltage" defaultValue={editingProduct?.voltage || ""} placeholder="Ex: 110V/220V, Bivolt" className="h-12 bg-white/5 border border-white/10 rounded-xl px-5 text-sm font-black outline-none focus:border-primary/50 transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Alimentação</label>
                          <input name="power_source" defaultValue={editingProduct?.power_source || ""} placeholder="Ex: Elétrico, Gás" className="h-12 bg-white/5 border border-white/10 rounded-xl px-5 text-sm font-black outline-none focus:border-primary/50 transition-all" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Peso</label>
                          <input name="weight" defaultValue={editingProduct?.weight || ""} placeholder="Ex: 2kg" className="h-12 bg-white/5 border border-white/10 rounded-xl px-5 text-sm font-black outline-none focus:border-primary/50 transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Garantia (Meses)</label>
                          <input name="warranty_months" type="number" defaultValue={editingProduct?.warranty_months || ""} placeholder="Ex: 12" className="h-12 bg-white/5 border border-white/10 rounded-xl px-5 text-sm font-black outline-none focus:border-primary/50 transition-all" />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Modal Footer */}
                <div className="p-6 lg:p-8 border-t border-white/5 flex justify-end gap-4 bg-surface/50">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-foreground transition-colors">Abortar</button>
                  <NeonButton form="productForm" type="submit" className="px-10 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    {editingProduct?.id ? 'Atualizar Core' : 'Sincronizar Item'}
                  </NeonButton>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Banner Modal Container */}
        <AnimatePresence>
          {isBannerModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div onClick={() => setIsBannerModalOpen(false)} className="fixed inset-0 bg-background/95 backdrop-blur-xl" />
              
              <div 
                className="relative w-full max-w-2xl gaming-card overflow-hidden z-10 flex flex-col max-h-[90vh]"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-primary shadow-neon-soft" />
                
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                   <h3 className="text-2xl font-black uppercase tracking-tighter italic">{editingBanner?.id ? 'Editar' : 'Novo'} <span className="text-primary">Canal</span></h3>
                   <button onClick={() => setIsBannerModalOpen(false)} className="h-10 w-10 rounded-xl bg-white/5 hover:bg-destructive/20 hover:text-destructive transition-all flex items-center justify-center"><X className="h-5 w-5" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                  <form id="bannerForm" onSubmit={handleSaveBanner} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                        {bannerImage ? (
                          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group bg-surface">
                            <Image src={bannerImage} alt="Banner Preview" fill className="object-cover" />
                            <button type="button" onClick={() => setBannerImage("")} className="absolute top-2 right-2 h-8 w-8 bg-destructive rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"><X className="h-4 w-4 text-white" /></button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-video rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all group">
                            {uploading ? <Loader2 className="h-10 w-10 text-primary animate-spin" /> : <><Plus className="h-10 w-10 text-text-muted mb-3 group-hover:text-primary" /><span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted group-hover:text-foreground">Sincronizar Mídia Visual</span></>}
                          </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Título da Transmissão</label>
                          <input name="title" defaultValue={editingBanner?.title || ""} className="h-12 bg-white/5 border border-white/10 rounded-xl px-5 text-sm font-black outline-none focus:border-primary/50 transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Direcionamento (Link)</label>
                          <select name="link_url" defaultValue={editingBanner?.link_url || "/"} className="h-12 bg-white/5 border border-white/10 rounded-xl px-5 text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer focus:border-primary/50 transition-all">
                            <option value="/" className="bg-surface">Página Inicial</option>
                            <option value="/loja" className="bg-surface">Loja Completa</option>
                            <option value="/quem-somos" className="bg-surface">Quem Somos</option>
                            <optgroup label="Categorias" className="bg-surface font-black italic">
                              {dbCategories.map(cat => (
                                <option key={cat.id} value={`/loja?cat=${cat.name}`} className="bg-surface">{cat.name}</option>
                              ))}
                            </optgroup>
                          </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Resumo de Conteúdo</label>
                        <input name="description" defaultValue={editingBanner?.description || ""} className="h-12 bg-white/5 border border-white/10 rounded-xl px-5 text-sm font-black outline-none focus:border-primary/50 transition-all" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-end">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Prioridade de Exibição</label>
                          <input name="display_order" type="number" defaultValue={editingBanner?.display_order || 0} className="h-12 bg-white/5 border border-white/10 rounded-xl px-5 text-sm font-black outline-none focus:border-primary/50 transition-all" />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Visibilidade</span>
                          <button type="button" onClick={() => setIsBannerActive(!isBannerActive)} className={cn("w-10 h-5 rounded-full transition-all relative", isBannerActive ? "bg-primary" : "bg-white/10")}>
                            <div className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all", isBannerActive ? "right-0.5" : "left-0.5")} />
                          </button>
                        </div>
                    </div>
                  </form>
                </div>

                <div className="p-6 border-t border-white/5 flex justify-end gap-4">
                   <button type="button" onClick={() => setIsBannerModalOpen(false)} className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-foreground transition-colors">Cancelar</button>
                   <NeonButton form="bannerForm" type="submit" className="px-10 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest">
                     Salvar Canal
                   </NeonButton>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
