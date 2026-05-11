"use client"

import { Header } from "@/components/layout/header"
import { NeonButton } from "@/components/ui/neon-button"
import { ShieldCheck, MapPin, CreditCard, CheckCircle2, ChevronRight, Zap, Copy, QrCode, Plus, Phone } from "lucide-react"
import { useState, useEffect } from "react"
import { useCart } from "@/lib/store"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

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
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix')
  const [copied, setCopied] = useState(false)
  
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    nome: 'Casa',
    cep: '',
    cidade: '',
    rua: '',
    numero: '',
    bairro: '',
    complemento: ''
  })

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      loadAddresses(user.id)
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
      setIsAddingNew(true)
    }
  }

  const handleSaveNewAddress = async () => {
    if (!newAddress.cep || !newAddress.rua || !newAddress.numero || !user) return
    
    const { data, error } = await supabase
      .from('user_addresses')
      .insert([{
        ...newAddress,
        user_id: user.id
      }])
      .select()

    if (!error && data) {
      const addr = data[0]
      setAddresses([...addresses, addr])
      setSelectedAddressId(addr.id)
      setIsAddingNew(false)
      setNewAddress({ nome: 'Casa', cep: '', cidade: '', rua: '', numero: '', bairro: '', complemento: '' })
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
    if (!selectedAddressId) return
    setStep(2)
  }

  const handleFinishOrder = async () => {
    if (!user) return

    const selectedAddress = addresses.find(a => a.id === selectedAddressId)
    
    const { error } = await supabase
      .from('orders')
      .insert([{
        user_id: user.id,
        total_amount: finalTotal,
        payment_method: paymentMethod,
        items: items,
        address_id: selectedAddressId,
        address_snapshot: selectedAddress,
        status: 'pending'
      }])

    if (error) {
      console.error("Erro ao salvar pedido:", error)
    } else {
      // Reward Points: 1 point per R$ 10
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
        reason: `Pedido #${error ? 'FAIL' : 'SUCCESS'}`
      }])

      toast.success(`Você ganhou ${pointsEarned} pontos de fidelidade!`)
    }

    setStep(3)
    setTimeout(() => clearCart(), 2000)
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

  return (
    <main className="flex min-h-screen flex-col">
      <Header />

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

                  {!isAddingNew && addresses.length > 0 ? (
                    <div className="flex flex-col gap-6">
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
                      
                      <button 
                        onClick={() => setIsAddingNew(true)}
                        className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors w-fit"
                      >
                        <Plus className="h-4 w-4" /> Adicionar Novo Endereço
                      </button>

                      <NeonButton 
                        className="mt-6 w-full md:w-auto px-10" 
                        onClick={handleProceedToPayment}
                        disabled={!selectedAddressId}
                      >
                        Continuar para Pagamento
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </NeonButton>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                          placeholder="Nome do Local (Ex: Casa, Trabalho)" 
                          value={newAddress.nome}
                          onChange={(e) => setNewAddress({...newAddress, nome: e.target.value})}
                          className="bg-background border border-white/10 rounded-xl p-4 text-sm focus:border-primary/50 outline-none md:col-span-2 font-bold" 
                        />
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
                        <input 
                          placeholder="Rua" 
                          value={newAddress.rua}
                          onChange={(e) => setNewAddress({...newAddress, rua: e.target.value})}
                          className="bg-background border border-white/10 rounded-xl p-4 text-sm focus:border-primary/50 outline-none md:col-span-2" 
                        />
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
                        <input 
                          placeholder="Complemento (Opcional)" 
                          value={newAddress.complemento}
                          onChange={(e) => setNewAddress({...newAddress, complemento: e.target.value})}
                          className="bg-background border border-white/10 rounded-xl p-4 text-sm focus:border-primary/50 outline-none md:col-span-2" 
                        />
                      </div>
                      <div className="flex gap-4 mt-4">
                        {addresses.length > 0 && (
                          <NeonButton variant="secondary" onClick={() => setIsAddingNew(false)}>Cancelar</NeonButton>
                        )}
                        <NeonButton className="flex-1" onClick={handleSaveNewAddress}>Salvar Endereço</NeonButton>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Pagamento */}
              {step === 2 && (
                <div className="p-8 rounded-3xl bg-surface border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-xl font-bold flex items-center gap-3 mb-8">
                    <CreditCard className="h-6 w-6 text-primary" />
                    2. Método de Pagamento
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div 
                      onClick={() => setPaymentMethod('pix')}
                      className={`p-6 rounded-2xl cursor-pointer flex flex-col gap-2 transition-all ${
                        paymentMethod === 'pix' 
                          ? 'bg-background border-2 border-primary shadow-neon-soft' 
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
                          ? 'bg-background border-2 border-primary shadow-neon-soft' 
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
                          ? 'bg-background border-2 border-primary shadow-neon-soft' 
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
                    <NeonButton variant="secondary" onClick={() => setStep(1)} className="px-8">Voltar</NeonButton>
                    <NeonButton 
                      className="flex-1 px-8" 
                      onClick={paymentMethod === ('whatsapp' as any) ? handleWhatsAppCheckout : handleFinishOrder}
                    >
                      {paymentMethod === ('whatsapp' as any) ? "Abrir WhatsApp" : "Finalizar Pedido"}
                    </NeonButton>
                  </div>
                </div>
              )}

              {/* Step 3: Sucesso / Pagamento PIX */}
              {step === 3 && (
                <div className="p-8 md:p-12 rounded-3xl bg-surface border border-primary/20 flex flex-col items-center text-center animate-in zoom-in duration-500">
                  {paymentMethod === 'pix' ? (
                    <>
                      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                        <QrCode className="h-10 w-10" />
                      </div>
                      <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter">Pague com <span className="text-primary">PIX</span></h2>
                      <p className="text-text-secondary text-sm mb-8">Utilize o código abaixo no app do seu banco para finalizar.</p>
                      
                      <div className="w-full max-w-sm bg-background border border-white/10 rounded-2xl p-4 mb-8">
                        <p className="text-[10px] font-mono text-text-muted break-all mb-4 text-left p-2 bg-white/5 rounded-lg select-all">
                          {pixCode}
                        </p>
                        <NeonButton 
                          onClick={handleCopyPix}
                          className="w-full gap-2 h-12"
                          variant={copied ? "secondary" : "primary"}
                        >
                          {copied ? (
                            <>Código Copiado!</>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              Copiar Código PIX
                            </>
                          )}
                        </NeonButton>
                      </div>

                      <div className="flex flex-col gap-2 mb-8">
                        <p className="text-xs text-text-muted font-bold flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-success" />
                          Pagamento processado via Mercado Pago
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-background shadow-neon-strong mb-8">
                        <CheckCircle2 className="h-12 w-12" />
                      </div>
                      <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">Pedido Realizado!</h2>
                      <p className="text-text-secondary max-w-md mb-8">
                        Seu pedido foi confirmado. Em instantes você receberá um e-mail com os detalhes do rastreio para {addresses.find(a => a.id === selectedAddressId)?.rua || "seu endereço"}.
                      </p>
                    </>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
                    <NeonButton size="lg" asChild className="px-10">
                      <a href="/">Voltar para Home</a>
                    </NeonButton>
                    <NeonButton variant="glass" size="lg" asChild className="px-10">
                      <a href="/perfil/pedidos">Ver meus pedidos</a>
                    </NeonButton>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            {step < 4 && (
              <aside className="flex flex-col gap-6">
                <div className="p-8 rounded-3xl bg-surface border border-white/10 h-fit">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-8">Resumo do Pedido</h4>
                  <div className="flex flex-col gap-4 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Subtotal ({totalItems} itens)</span>
                      <span className="font-bold">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Frete</span>
                      <span className="font-bold text-success">{shipping === 0 ? "GRÁTIS" : `R$ ${shipping.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</span>
                    </div>
                    {pixDiscount > 0 && (
                      <div className="flex justify-between text-sm text-success">
                        <span>Desconto PIX (-10%)</span>
                        <span className="font-bold">- R$ {pixDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                  </div>
                  <div className="h-[1px] bg-white/5 mb-6" />
                  <div className="flex justify-between items-end mb-8">
                    <span className="text-lg font-bold">TOTAL</span>
                    <span className="text-3xl font-black text-primary">R$ {finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10 text-xs text-text-secondary leading-relaxed">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                    Ambiente seguro e criptografado com padrão bancário.
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
