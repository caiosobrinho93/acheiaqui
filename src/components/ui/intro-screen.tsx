"use client"

import Image from "next/image"
import { Zap } from "lucide-react"

interface IntroScreenProps {
  isLoading: boolean
}

export function IntroScreen({ isLoading }: IntroScreenProps) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-primary via-primary/50 to-primary p-[2px] shadow-[0_0_40px_rgba(198,255,0,0.4)]">
            <div className="h-full w-full rounded-[18px] bg-background p-4 flex items-center justify-center overflow-hidden">
              <Image 
                src="/images/logo.png" 
                alt="AcheiAqui Logo" 
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary flex items-center justify-center animate-pulse">
            <Zap className="h-4 w-4 text-background fill-current" />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-black uppercase tracking-widest text-foreground">
            Achei<span className="text-primary">Aqui</span>
          </h1>
          <p className="text-xs font-bold uppercase tracking-[0.5em] text-text-muted">
            Preparando a experiência...
          </p>
        </div>

        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '150ms' }} />
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}