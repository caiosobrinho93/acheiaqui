"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { NeonButton } from "@/components/ui/neon-button"
import { toast } from "sonner"
import { Zap, Mail, Lock, Loader2, ArrowLeft, ShieldCheck } from "lucide-react"
import Link from "next/link"

const ADMIN_EMAIL = "caiojos@gmail.com"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkSession()
  }, [])

  async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      router.push("/perfil")
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error("Erro no Acesso", {
        description: "Verifique suas credenciais e tente novamente."
      })
    } else {
      toast.success("Login Realizado", {
        description: `Bem-vindo, ${data.user?.email?.split('@')[0]}.`
      })
      
      router.push("/perfil")
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <Link href="/" className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-12 group w-fit">
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-semibold uppercase tracking-widest">Retornar à Loja</span>
        </Link>

        <div className="bg-surface border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-primary" />
          
          <div className="flex flex-col items-center text-center mb-12">
             <div className="h-20 w-20 rounded-3xl bg-primary flex items-center justify-center text-background mb-8 shadow-neon-soft rotate-3 hover:rotate-0 transition-transform">
                <Zap className="h-12 w-12 fill-current" />
             </div>
             <h1 className="text-5xl font-semibold tracking-tight leading-none mb-4 uppercase">ACESSO <span className="text-primary">MEMBRO</span></h1>
             <p className="text-text-secondary text-sm font-medium tracking-widest uppercase opacity-60">Sincronize sua estação de compras</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
             <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold uppercase tracking-widest text-text-muted ml-1">E-mail</label>
                <div className="relative">
                   <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                   <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                    className="w-full h-16 bg-background border border-white/10 rounded-2xl pl-14 pr-6 text-base font-semibold outline-none focus:border-primary/50 transition-all placeholder:opacity-30"
                   />
                </div>
             </div>

             <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold uppercase tracking-widest text-text-muted ml-1">Senha</label>
                <div className="relative">
                   <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                   <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full h-16 bg-background border border-white/10 rounded-2xl pl-14 pr-6 text-base font-semibold outline-none focus:border-primary/50 transition-all placeholder:opacity-30"
                   />
                </div>
             </div>

             <NeonButton 
               type="submit" 
               disabled={loading}
               className="h-16 w-full rounded-2xl mt-4"
             >
               {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Entrar na Estação"}
             </NeonButton>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
              <p className="text-sm font-semibold text-text-muted uppercase tracking-widest text-center">
                Não tem uma conta?{" "}
                <Link href="/cadastro" className="text-primary hover:text-accent-gold transition-colors underline underline-offset-4 decoration-primary/30">
                  Crie a sua aqui
                </Link>
              </p>
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/5">
                 <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-neon-soft" />
                 <span className="text-xs text-text-muted font-medium uppercase tracking-widest">Sistemas de Defesa Ativos</span>
              </div>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
