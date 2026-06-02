"use client"

import { Header } from "@/components/layout/header"
import { NeonButton } from "@/components/ui/neon-button"
import { ShieldCheck, MapPin, CreditCard, CheckCircle2, ChevronRight, Zap, Copy, QrCode, Plus, Phone, Loader2, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useCart } from "@/lib/store"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type Address = {
  id: string,
  nome: string,
  cep: string,
  cidade: string,
  rua: string,
  numero: string,
  bairro: string,
  complemento: string
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix')
  const [copied, setCopied] = useState(false)
  
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  
  // States for Address Modal
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    nome: '',
    cep: '',
    cidade: '',
    rua: '',
    numero: '',
    bairro: '',
    complemento: ''
  })

  // States for Payment Processing & Result
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [redirectCountdown, setRedirectCountdown] = useState(5)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    checkUser()
  }, [])

  // 5s Auto-Redirect Effect on Step 3
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 3) {
      timer = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            router.push('/')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [step, router])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      loadAddresses(user.id)
    } else {
      toast.error("Faça login para continuar", { description: "Você precisa estar logado para finalizar a compra." })
      router.push('/login?redirect=/checkout')
    }
  }

  async function loadAddresses(userId: string) {
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
    
    if (!error && data && data.length > 0) {
      setAddresses(data)
      setSelectedAddressId(data[0].id)
    } else {
      setIsAddressModalOpen(true)
    }
  }

  const handleSaveNewAddress = async () => {
    if (!user) {
      toast.error("Sessão Expirada", { description: "Por favor, faça login novamente." })
      router.push('/login?redirect=/checkout')
      return
    }

    if (!newAddress.cep || !newAddress.rua || !newAddress.numero) {
      toast.error("Dados Incompletos", { description: "Preencha pelo menos o CEP, Rua e Número." })
      return
    }
    
    const { data, error } = await supabase
      .from('user_addresses')
      .upsert([{
        ...newAddress,
        nome: newAddress.nome || 'Meu Endereço',
        user_id: user.id
      }], { onConflict: 'user_id' })
      .select()

    if (!error && data) {
      const addr = data[0]
      setAddresses([...addresses, addr])
      setSelectedAddressId(addr.id)
      setIsAddressModalOpen(false)
      setNewAddress({ nome: '', cep: '', cidade: '', rua: '', numero: '', bairro: '', complemento: '' })
      
      toast.success("Endereço Adicionado!", {
        description: "Frete recalculado e adicionado ao resumo da compra."
      })
    } else {
      toast.error("Erro ao salvar endereço")
    }
  }

  const handleWhatsAppCheckout = () => {
    if (!user) return
    const selectedAddress = addresses.find(a => a.id === selectedAddressId)
    
    const itemsList = items.map(item => `- ${item.quantity}x ${item.name} (R$ ${item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`).join('%0A')
    
    const message = `*NOVO PEDIDO - ACHEIAQUI*%0A%0A` +
      `*Cliente:* ${user.email}%0A` +
      `*Itens:*%0A${itemsList}%0A%0A` +
      `*Total:* R$ ${finalTotal.toLocaleString('pt-BR')}%0A%0A` +
      `*Endereço:* ${selectedAddress?.rua}, ${selectedAddress?.numero}%0A` +
      `${selectedAddress?.cidade} - ${selectedAddress?.cep}%0A%0A` +
      `Gostaria de finalizar meu pagamento.`

    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank')
    setStep(3)
    setTimeout(() => clearCart(), 2000)
  }

  const handleProceedToPayment = () => {
    if (!selectedAddressId) {
      toast.error("Selecione um endereço para entrega")
      return
    }
    setStep(2)
  }

  const handleFinishOrder = async () => {
    if (!user) return

    setIsProcessingPayment(true)
    
    // Simulate real-world payment API latency (2.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 2500))

    const selectedAddress = addresses.find(a => a.id === selectedAddressId)
    
    // Push real order to Admin Dashboard via Supabase
    const { error } = await supabase
      .from('orders')
      .insert([{
        user_id: user.id,
        total_amount: finalTotal,
        payment_method: paymentMethod,
        items: items,
        address_id: selectedAddressId,
        address_snapshot: selectedAddress,
        status: 'paid' // Changed to paid to reflect immediate approval on sim
      }])

    if (error) {
      console.error("Erro ao salvar pedido:", error)
      toast.error("Erro ao processar pagamento")
      setIsProcessingPayment(false)
    } else {
      // Reward Points
      const pointsEarned = Math.floor(finalTotal / 10)
      const { data: currentPoints } = await supabase.from('loyalty_points').select('points').eq('user_id', user.id).single()
      
      if (currentPoints) {
        await supabase.from('loyalty_points').update({ points: currentPoints.points + pointsEarned }).eq('user_id', user.id)
      } else {
        await supabase.from('loyalty_points').insert([{ user_id: user.id, points: pointsEarned }])
      }

      await supabase.from('loyalty_logs').insert([{
        user_id: user.id,
        points_changed: pointsEarned,
        reason: `Pedido Cashback`
      }])

      toast.success(`Pagamento Aprovado! Você ganhou ${pointsEarned} pontos!`)
      setIsProcessingPayment(false)
      setStep(3)
      setTimeout(() => clearCart(), 1000)
    }
  }

  const pixCode = "00020126580014br.gov.bcb.pix0136hqvarjjvsigqkokrumje.supabase.co5204000053039865406989.915802BR5925ACHEIAQUI MARKETPLACE6009SAO PAULO62070503***6304ABCD"

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const subtotal = totalPrice()
  const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 25.00
  const pixDiscount = paymentMethod === 'pix' && step >= 2 ? subtotal * 0.1 : 0
  const finalTotal = subtotal + shipping - pixDiscount
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)

  if (!isMounted) {
    return (
      <main className="flex min-h-screen flex-col relative bg-[#0A0A0A]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col relative">
      <Header />

      {/* Address Popup Modal */}
      {isAddressModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={() => setIsAddressModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface border border-white/10 rounded-3xl p-8 z-[110] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black uppercase tracking-tight">Novo Endereço</h3>
              <button onClick={() => setIsAddressModalOpen(false)} className="text-text-muted hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              <input 
                placeholder="Nome do Local (Ex: Casa, Trabalho)" 
                value={newAddress.nome}
                onChange={(e) => setNewAddress({...newAddress, nome: e.target.value})}
                className="bg-background border border-white/10 rounded-xl p-4 text-sm focus:border-primary/50 outline-none font-bold" 
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="CEP" 
                  value={newAddress.cep}
                  onChange={(e) => setNewAddress({...newAddress, cep: e.target.value})}
                  className="bg-background border border-white/10 rounded-xl p-4 text-sm focus:border-primary/50 outline-none" 
                />
                <input 
                  placeholder="Cidade" 
                  value={newAddress.cidade}
                  onChange={(e) => setNewAddress({...newAddress, cidade: e.target.value})}
                  className="bg-background border border-white/10 rounded-xl p-4 text-sm focus:border-primary/50 outline-none" 
                />
              </div>
              <input 
                placeholder="Rua" 
                value={newAddress.rua}
                onChange={(e) => setNewAddress({...newAddress, rua: e.target.value})}
                className="bg-background border border-white/10 rounded-xl p-4 text-sm focus:border-primary/50 outline-none" 
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="Número" 
                  value={newAddress.numero}
                  onChange={(e) => setNewAddress({...newAddress, numero: e.target.value})}
                  className="bg-background border border-white/10 rounded-xl p-4 text-sm focus:border-primary/50 outline-none" 
                />
                <input 
                  placeholder="Bairro" 
                  value={newAddress.bairro}
                  onChange={(e) => setNewAddress({...newAddress, bairro: e.target.value})}
                  className="bg-background border border-white/10 rounded-xl p-4 text-sm focus:border-primary/50 outline-none" 
                />
              </div>
              <input 
                placeholder="Complemento (Opcional)" 
                value={newAddress.complemento}
                onChange={(e) => setNewAddress({...newAddress, complemento: e.target.value})}
                className="bg-background border border-white/10 rounded-xl p-4 text-sm focus:border-primary/50 outline-none" 
              />
            </div>
            
            <NeonButton className="w-full mt-6" onClick={handleSaveNewAddress}>
              Salvar e Calcular Frete
            </NeonButton>
          </div>
        </>
      )}

      <section className="py-12 md:py-20 mt-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col items-center mb-12">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8">
              CHECKOUT <span className="text-primary">SEGURO</span>
            </h1>
            
            {/* Steps Indicator */}
            <div className="flex items-center gap-4 w-full max-w-xl">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                    step >= s ? 'bg-primary text-background shadow-neon-soft' : 'bg-surface border border-white/10 text-text-muted'
                  }`}>
                    {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
                  </div>
                  {s < 3 && <div className={`flex-1 h-[2px] rounded-full ${step > s ? 'bg-primary' : 'bg-white/10'}`} />}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Main Form */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* Step 1: Identificação & Endereço */}
              {step === 1 && (
                <div className="p-8 rounded-3xl bg-surface border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-xl font-bold flex items-center gap-3 mb-8">
                    <MapPin className="h-6 w-6 text-primary" />
                    1. Informações de Entrega
                  </h3>

                  <div className="flex flex-col gap-6">
                    {addresses.length === 0 ? (
                      <div className="p-8 border border-dashed border-white/20 rounded-2xl flex flex-col items-center text-center opacity-70">
                        <MapPin className="h-10 w-10 text-text-muted mb-4" />
                        <p className="text-sm uppercase tracking-widest font-bold mb-4">Nenhum endereço salvo</p>
                        <NeonButton onClick={() => setIsAddressModalOpen(true)} size="sm">
                          Cadastrar Endereço
                        </NeonButton>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                          <div 
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`p-6 rounded-2xl cursor-pointer flex flex-col gap-2 transition-all ${
                              selectedAddressId === addr.id 
                                ? 'bg-background border-2 border-primary shadow-neon-soft' 
                                : 'bg-surface border border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-lg uppercase tracking-widest">{addr.nome}</span>
                              {selectedAddressId === addr.id && <CheckCircle2 className="h-5 w-5 text-primary" />}
                            </div>
                            <p className="text-sm text-text-secondary">{addr.rua}, {addr.numero} {addr.complemento && `- ${addr.complemento}`}</p>
                            <p className="text-sm text-text-secondary">{addr.bairro}, {addr.cidade} - {addr.cep}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {addresses.length > 0 && (
                      <button 
                        onClick={() => setIsAddressModalOpen(true)}
                        className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors w-fit"
                      >
                        <Plus className="h-4 w-4" /> Adicionar Novo Endereço
                      </button>
                    )}

                    <NeonButton 
                      className="mt-6 w-full md:w-auto px-10 h-14" 
                      onClick={handleProceedToPayment}
                      disabled={!selectedAddressId}
                    >
                      Continuar para Pagamento
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </NeonButton>
                  </div>
                </div>
              )}

              {/* Step 2: Pagamento */}
              {step === 2 && (
                <div className="p-8 rounded-3xl bg-surface border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-hidden">
                  
                  {isProcessingPayment && (
                    <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
                      <div className="h-20 w-20 rounded-3xl bg-primary/20 border border-primary/50 flex items-center justify-center mb-6 shadow-neon-strong">
                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">Processando</h3>
                      <p className="text-primary font-bold uppercase tracking-widest text-xs animate-pulse">Conectando com o banco emissor...</p>
                    </div>
                  )}

                  <h3 className="text-xl font-bold flex items-center gap-3 mb-8">
                    <CreditCard className="h-6 w-6 text-primary" />
                    2. Método de Pagamento
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div 
                      onClick={() => setPaymentMethod('pix')}
                      className={`p-6 rounded-2xl cursor-pointer flex flex-col gap-2 transition-all ${
                        paymentMethod === 'pix' 
                          ? 'bg-background border-2 border-primary shadow-neon-soft scale-[1.02]' 
                          : 'bg-surface border border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">PIX Instantâneo</span>
                        <Zap className={`h-5 w-5 ${paymentMethod === 'pix' ? 'text-primary fill-primary' : 'text-text-muted'}`} />
                      </div>
                      <span className="text-xs text-success font-bold uppercase tracking-widest">-10% DE DESCONTO</span>
                      <p className="text-xs text-text-secondary mt-2">Pagamento aprovado em segundos.</p>
                    </div>
                    <div 
                      onClick={() => setPaymentMethod('card')}
                      className={`p-6 rounded-2xl cursor-pointer flex flex-col gap-2 transition-all ${
                        paymentMethod === 'card' 
                          ? 'bg-background border-2 border-primary shadow-neon-soft scale-[1.02]' 
                          : 'bg-surface border border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">Cartão de Crédito</span>
                        <CreditCard className={`h-5 w-5 ${paymentMethod === 'card' ? 'text-primary' : 'text-text-muted'}`} />
                      </div>
                      <span className="text-xs text-text-muted font-bold uppercase tracking-widest">ATÉ 10X SEM JUROS</span>
                      <p className="text-xs text-text-secondary mt-2">Aceitamos Visa, Mastercard, Elo.</p>
                    </div>

                    <div 
                      onClick={() => setPaymentMethod('whatsapp' as any)}
                      className={`p-6 rounded-2xl cursor-pointer flex flex-col gap-2 transition-all md:col-span-2 ${
                        paymentMethod === ('whatsapp' as any)
                          ? 'bg-background border-2 border-primary shadow-neon-soft scale-[1.02]' 
                          : 'bg-surface border border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">Finalizar via WhatsApp</span>
                        <Phone className={`h-5 w-5 ${paymentMethod === ('whatsapp' as any) ? 'text-primary' : 'text-text-muted'}`} />
                      </div>
                      <span className="text-xs text-success font-bold uppercase tracking-widest">FALE COM UM VENDEDOR</span>
                      <p className="text-xs text-text-secondary mt-2">Ideal para dúvidas rápidas e pagamento personalizado.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <NeonButton variant="secondary" onClick={() => setStep(1)} className="px-8 h-14">Voltar</NeonButton>
                    <NeonButton 
                      className="flex-1 px-8 h-14" 
                      onClick={paymentMethod === ('whatsapp' as any) ? handleWhatsAppCheckout : handleFinishOrder}
                    >
                      {paymentMethod === ('whatsapp' as any) ? "Abrir WhatsApp" : "Efetuar Pagamento"}
                    </NeonButton>
                  </div>
                </div>
              )}

              {/* Step 3: Sucesso */}
              {step === 3 && (
                <div className="p-8 md:p-16 rounded-3xl bg-surface border border-primary/20 flex flex-col items-center text-center animate-in zoom-in duration-500 shadow-[0_0_50px_rgba(232,220,194,0.05)] relative overflow-hidden">
                  
                  {/* Decorative Glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-success/20 blur-[100px] rounded-full pointer-events-none" />

                  <div className="h-28 w-28 rounded-full bg-success flex items-center justify-center text-background shadow-[0_0_30px_rgba(34,197,94,0.4)] mb-8 animate-bounce">
                    <CheckCircle2 className="h-14 w-14" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">
                    Tudo <span className="text-success">Certo!</span>
                  </h2>
                  <p className="text-text-secondary max-w-md mb-8 text-lg">
                    Pagamento aprovado. Seu pedido já foi registrado no sistema e será preparado para o endereço: <br/>
                    <strong className="text-white mt-2 block">{addresses.find(a => a.id === selectedAddressId)?.rua || "seu endereço selecionado"}</strong>
                  </p>

                  <div className="w-full h-px bg-white/10 mb-8" />

                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Redirecionando em {redirectCountdown}s...</p>

                  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <NeonButton size="lg" asChild className="px-10 h-14">
                      <a href="/">Voltar para Home</a>
                    </NeonButton>
                    <NeonButton variant="glass" size="lg" asChild className="px-10 h-14">
                      <a href="/perfil/pedidos">Meus Pedidos</a>
                    </NeonButton>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            {step < 3 && (
              <aside className="flex flex-col gap-6">
                <div className="p-8 rounded-3xl bg-surface border border-white/10 h-fit sticky top-24">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-8">Resumo da Compra</h4>
                  <div className="flex flex-col gap-4 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Subtotal ({totalItems} itens)</span>
                      <span className="font-bold">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Frete</span>
                      <span className="font-bold text-success">{shipping === 0 ? "GRÁTIS" : `+ R$ ${shipping.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</span>
                    </div>
                    {pixDiscount > 0 && (
                      <div className="flex justify-between text-sm text-success">
                        <span>Desconto PIX (-10%)</span>
                        <span className="font-bold">- R$ {pixDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-6 border-t border-white/5">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-bold uppercase tracking-widest text-text-muted">Total</span>
                      <span className="text-3xl font-black tracking-tighter">
                        R$ {finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    {step === 2 && paymentMethod === 'card' && (
                      <p className="text-right text-xs text-text-secondary">ou em até 10x de R$ {(finalTotal / 10).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    )}
                  </div>

                  <div className="mt-8 flex flex-col gap-3">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-text-muted">
                      <ShieldCheck className="h-8 w-8 text-primary" />
                      <p>Compra 100% segura. Seus dados estão protegidos.</p>
                    </div>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
