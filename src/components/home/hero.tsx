"use client"

import { NeonButton } from "../ui/neon-button"
import { Sparkles } from "lucide-react"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative pt-20 pb-12 px-6 lg:px-12 bg-background overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 min-h-[600px]">
          
          {/* Main Title Section - "Sem Fronteiras" Style */}
          <div 
            className="flex-1 flex flex-col justify-center text-center lg:text-left z-10"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/5 border border-primary/10 mb-8 w-fit mx-auto lg:mx-0">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-xs font-black uppercase tracking-[0.4em] text-primary">AcheiAqui 2026</span>
            </div>
            
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-8 italic">
              ESTILO <br />
              <span className="text-primary not-italic font-medium">SEM</span> <br /> 
              FRONTEIRAS.
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary mb-12 font-medium max-w-xl leading-relaxed">
              O marketplace definitivo para quem respira tecnologia e design de alta performance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
               <NeonButton size="lg" className="h-20 px-12 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-neon-strong">
                 Explorar Coleção
               </NeonButton>
            </div>
          </div>

          {/* Featured Image - Sneaker Style (Clean, Borderless background) */}
          <div 
            className="flex-1 relative aspect-square w-full max-w-[600px] group"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full scale-125 animate-pulse" />
            
            <div className="relative h-full w-full flex items-center justify-center">
              <Image 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000" 
                alt="Cyber Sneaker" 
                width={800}
                height={800}
                className="object-contain drop-shadow-[0_20px_50px_rgba(198,255,0,0.3)] transition-transform duration-1000 group-hover:scale-105 group-hover:-rotate-3"
                priority
              />
              
              {/* Floating Badge */}
              <div className="absolute top-1/4 right-0 bg-surface/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl animate-bounce-slow">
                 <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">New Drop</p>
                 <p className="text-2xl font-black text-foreground italic uppercase tracking-tighter">Cyber-Sneak</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Lines */}
      <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden xl:block" />
    </section>
  )
}
