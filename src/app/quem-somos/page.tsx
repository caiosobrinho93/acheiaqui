"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Target, 
  Users, 
  ArrowLeft,
  Cpu,
  Fingerprint,
  Bot,
  Truck,
  ChevronRight,
  Sparkles
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { cn } from "@/lib/utils"

export default function QuemSomos() {
  const [activeStage, setActiveStage] = useState(0)

  const stages = [
    {
      title: "Garimpagem Core",
      icon: Search,
      description: "Nossos algoritmos vasculham o mercado global em busca de tendências e itens de alta performance.",
      details: ["Análise de Feedback Real", "Verificação de Lote", "Teste de Estresse de Hardware"]
    },
    {
      title: "Certificação Elite",
      icon: ShieldCheck,
      description: "Cada item é submetido a um protocolo de autenticidade e qualidade padrão AcheiAqui.",
      details: ["Selo de Autenticidade", "Garantia Estendida", "Inspeção Visual 4K"]
    },
    {
      title: "Logística Cyber",
      icon: Truck,
      description: "Sistema de distribuição automatizado que garante a integridade do item até a sua porta.",
      details: ["Embalagem Blindada", "Rastreamento Real-time", "Entrega Prioritária"]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-20 overflow-hidden">
        {/* Hero Section */}
        <section className="container mx-auto px-6 lg:px-12 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-primary" />
                <span className="text-xs font-black text-primary uppercase tracking-[0.5em]">O Manifesto</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8 italic uppercase">
                A Revolução do <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/50 to-primary/80">Marketplace.</span>
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed mb-10 max-w-xl">
                Não somos apenas uma loja. Somos um <span className="text-primary font-bold">filtro.</span> No ruído digital de hoje, encontrar o que realmente importa é um desafio. O AcheiAqui é a resposta técnica para quem busca excelência sem concessões.
              </p>
              <div className="flex flex-wrap gap-4">
                 <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-muted">
                    <Fingerprint className="h-3 w-3 text-primary" />
                    Autenticidade Garantida
                 </div>
                 <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-muted">
                    <Bot className="h-3 w-3 text-primary" />
                    IA-Powered Curation
                 </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-square"
            >
               <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full animate-pulse" />
               <div className="relative h-full w-full rounded-[60px] overflow-hidden border border-white/10 shadow-2xl">
                  <Image 
                    src="/images/headquarters.png" 
                    alt="Headquarters" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8">
                     <p className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-2">Base de Operações</p>
                     <p className="text-2xl font-black italic uppercase tracking-tighter">Cyber City Hub</p>
                  </div>
               </div>
            </motion.div>
          </div>
        </section>

        {/* Interactive "Our Process" Section */}
        <section className="py-32 bg-surface/30 relative border-y border-white/5">
          <div className="absolute inset-0 bg-grid-tech opacity-10" />
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center mb-24">
               <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic mb-4">Protocolo de <span className="text-primary">Excelência</span></h2>
               <p className="text-text-muted font-bold text-xs uppercase tracking-[0.3em]">Como transformamos garimpagem em segurança</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               {/* Stages Navigation */}
               <div className="lg:col-span-4 flex flex-col gap-4">
                  {stages.map((stage, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveStage(idx)}
                      className={cn(
                        "group flex items-center gap-6 p-8 rounded-3xl transition-all text-left border",
                        activeStage === idx 
                          ? "bg-primary text-background border-primary shadow-neon-soft translate-x-4" 
                          : "bg-white/5 border-white/5 text-text-muted hover:bg-white/10"
                      )}
                    >
                      <stage.icon className={cn("h-8 w-8 transition-transform group-hover:scale-110", activeStage === idx ? "text-background" : "text-primary")} />
                      <div>
                        <p className={cn("text-[10px] font-black uppercase tracking-widest mb-1", activeStage === idx ? "text-background/60" : "text-primary/60")}>Fase 0{idx + 1}</p>
                        <h4 className="text-xl font-black uppercase tracking-tighter italic leading-none">{stage.title}</h4>
                      </div>
                      <ChevronRight className={cn("ml-auto h-5 w-5 transition-transform", activeStage === idx ? "translate-x-0" : "opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0")} />
                    </button>
                  ))}
               </div>

               {/* Stage Content */}
               <div className="lg:col-span-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStage}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="h-full p-12 lg:p-16 rounded-[48px] bg-background border border-white/10 relative overflow-hidden flex flex-col justify-center"
                    >
                       <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                          <Cpu className="h-64 w-64" />
                       </div>
                       
                       <div className="relative z-10">
                          <h3 className="text-5xl font-black uppercase italic tracking-tighter mb-8 text-primary">
                            {stages[activeStage].title}
                          </h3>
                          <p className="text-2xl text-text-secondary leading-relaxed mb-12 font-medium max-w-2xl">
                            {stages[activeStage].description}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             {stages[activeStage].details.map((detail, i) => (
                               <div key={i} className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/5">
                                  <Sparkles className="h-4 w-4 text-primary" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">{detail}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                    </motion.div>
                  </AnimatePresence>
               </div>
            </div>
          </div>
        </section>

        {/* Vision Section with Logistics Image */}
        <section className="container mx-auto px-6 lg:px-12 py-32">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1 relative aspect-video lg:aspect-square"
              >
                 <div className="absolute -inset-10 bg-primary/10 blur-[100px] rounded-full" />
                 <div className="relative h-full w-full rounded-[60px] overflow-hidden border border-white/10 shadow-2xl">
                    <Image 
                      src="/images/logistics.png" 
                      alt="Logistics Center" 
                      fill 
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-background/40 via-transparent to-transparent" />
                 </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                 <h2 className="text-5xl font-black uppercase tracking-tighter italic mb-8">Nossa <span className="text-primary">Visão</span></h2>
                 <div className="space-y-8">
                    <div className="flex gap-6">
                       <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <Globe className="h-6 w-6 text-primary" />
                       </div>
                       <div>
                          <h4 className="text-xl font-black uppercase italic tracking-tighter mb-2">Escopo Global</h4>
                          <p className="text-text-secondary text-sm leading-relaxed font-medium">Conectamos centros de inovação em todo o mundo para trazer o futuro para sua casa hoje.</p>
                       </div>
                    </div>
                    <div className="flex gap-6">
                       <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <Target className="h-6 w-6 text-primary" />
                       </div>
                       <div>
                          <h4 className="text-xl font-black uppercase italic tracking-tighter mb-2">Precisão Cirúrgica</h4>
                          <p className="text-text-secondary text-sm leading-relaxed font-medium">Cada milímetro de nossa operação é otimizado para que sua experiência seja impecável.</p>
                       </div>
                    </div>
                 </div>
              </motion.div>
           </div>
        </section>

        {/* Stats Strip */}
        <section className="bg-primary py-12 relative overflow-hidden">
           <div className="absolute inset-0 bg-grid-tech opacity-10 pointer-events-none" />
           <div className="container mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                 {[
                   { label: "Checkpoints de Qualidade", value: "24/7" },
                   { label: "Clientes Elite", value: "50k+" },
                   { label: "Itens Curados", value: "1.2k" },
                   { label: "NPS de Satisfação", value: "98.5" }
                 ].map((stat, i) => (
                   <div key={i} className="text-center">
                      <p className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase text-background">{stat.value}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-background/60 mt-1">{stat.label}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Join CTA */}
        <section className="container mx-auto px-6 py-32">
           <div className="relative p-12 lg:p-24 rounded-[64px] bg-surface/50 border border-white/5 overflow-hidden text-center">
              <div className="absolute inset-0 bg-grid-tech opacity-5" />
              <div className="relative z-10">
                 <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic mb-8 leading-none">
                    Faça parte da <br/>
                    <span className="text-primary">AcheiAqui.</span>
                 </h2>
                 <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto font-medium">
                   O futuro do consumo não é sobre quantidade, é sobre curadoria técnica e confiança absoluta.
                 </p>
                 <Link href="/loja" className="inline-flex h-20 px-16 bg-primary text-background rounded-2xl items-center justify-center font-black uppercase tracking-widest italic hover:scale-105 transition-all shadow-neon-soft">
                   Começar Protocolo
                 </Link>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
