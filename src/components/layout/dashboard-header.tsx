"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { LayoutDashboard, LogOut, ArrowLeft, Settings, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

export function DashboardHeader() {
  const [notificationsOpen, setNotificationsOpen] = React.useState(false)
  const [settingsOpen, setSettingsOpen] = React.useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-md border-b border-white/5 py-4">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center p-1.5 transition-all group-hover:scale-110 shadow-neon-soft">
               <ArrowLeft className="h-5 w-5 text-background" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-text-muted uppercase tracking-widest leading-none mb-1">Voltar ao Site</span>
              <span className="text-lg font-black tracking-tighter uppercase italic leading-none">PAINEL <span className="text-primary">ADMIN</span></span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4 relative">
          <div className="relative">
            <button 
              onClick={() => {
                setNotificationsOpen(!notificationsOpen)
                setSettingsOpen(false)
              }}
              className={cn(
                "h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all",
                notificationsOpen ? "text-primary border-primary/40 bg-primary/10" : "text-text-muted hover:text-primary"
              )}
            >
              <Bell className="h-5 w-5" />
              <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary shadow-neon-soft animate-pulse" />
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full mt-4 right-0 w-80 gaming-card p-6 z-[101]"
                >
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Notificações do Core</h4>
                  <div className="flex flex-col gap-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-primary/5 transition-all cursor-pointer">
                      <p className="text-[10px] font-bold uppercase mb-1">Novo Pedido #3928</p>
                      <p className="text-[9px] text-text-muted font-medium uppercase tracking-widest leading-tight">Um novo cliente acaba de realizar uma aquisição elite.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-primary/5 transition-all cursor-pointer">
                      <p className="text-[10px] font-bold uppercase mb-1">Stock Alerta: RTX 4090</p>
                      <p className="text-[9px] text-text-muted font-medium uppercase tracking-widest leading-tight">Nível de inventário crítico para o item selecionado.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button 
              onClick={() => {
                setSettingsOpen(!settingsOpen)
                setNotificationsOpen(false)
              }}
              className={cn(
                "h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all",
                settingsOpen ? "text-primary border-primary/40 bg-primary/10" : "text-text-muted hover:text-primary"
              )}
            >
              <Settings className="h-5 w-5" />
            </button>

            <AnimatePresence>
              {settingsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full mt-4 right-0 w-64 gaming-card p-6 z-[101]"
                >
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Configurações</h4>
                  <div className="flex flex-col gap-2">
                    <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/5 hover:bg-primary/5 transition-all text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-foreground">
                      Perfil Administrativo
                    </button>
                    <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/5 hover:bg-primary/5 transition-all text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-foreground">
                      Parâmetros do Sistema
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-10 w-px bg-white/5 mx-2" />
          <Link 
            href="/" 
            className="h-10 px-6 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-background transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Link>
        </div>
      </div>
    </header>
  )
}
