"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { NeonButton } from "@/components/ui/neon-button"
import { toast } from "sonner"
import { Zap, Mail, Lock, Loader2, ArrowLeft, UserPlus } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [cpf, setCpf] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // CPF Mask
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 11) value = value.slice(0, 11)
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    setCpf(value)
  }

  // Basic CPF validation
  const isValidCpf = (cpfStr: string) => {
    const numbers = cpfStr.replace(/\D/g, '')
    return numbers.length === 11
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.includes('@')) {
      toast.error("E-mail Inválido", { description: "O e-mail precisa conter um '@'." })
      return
    }

    if (!isValidCpf(cpf)) {
      toast.error("CPF Inválido", { description: "Por favor, insira um CPF válido com 11 dígitos." })
      return
    }

    setLoading(true)

    // Generate a unique username to satisfy database constraints
    const generatedUsername = email.split('@')[0].toLowerCase() + Math.floor(Math.random() * 10000).toString()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username: generatedUsername,
          cpf: cpf.replace(/\D/g, '')
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      if (error.message.includes("already registered")) {
        toast.error("E-mail já cadastrado", {
          description: "O e-mail digitado já existe. Tente fazer login!"
        })
      } else {
        toast.error("Erro no Cadastro", {
          description: error.message
        })
      }
    } else {
      toast.success("Bem-vindo ao Arsenal AcheiAqui!", {
        description: "Conta criada e conectada com sucesso."
      })
      router.push("/perfil")
    }
    setLoading(false)
  }

  const handleSocialLogin = async (provider: 'google' | 'github' | 'apple') => {
    toast.loading(`Conectando com ${provider}...`, { duration: 2000 })
    // Ready for future integration:
    // await supabase.auth.signInWithOAuth({ provider })
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <Link href="/login" className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-12 group w-fit">
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-semibold uppercase tracking-widest">Já tenho uma conta</span>
        </Link>

        <div className="bg-surface border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-primary" />
          
          <div className="flex flex-col items-center text-center mb-12">
             <div className="h-20 w-20 rounded-3xl bg-primary flex items-center justify-center text-background mb-8 shadow-neon-soft rotate-3 hover:rotate-0 transition-transform">
                <UserPlus className="h-12 w-12" />
             </div>
             <h1 className="text-5xl font-semibold tracking-tight leading-none mb-4 uppercase">NOVA <span className="text-primary">CONTA</span></h1>
             <p className="text-text-secondary text-sm font-medium tracking-widest uppercase opacity-60">Junte-se ao arsenal AcheiAqui</p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-6">
             <div className="flex flex-col gap-4">
               <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-muted ml-1">Nome Completo *</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="João da Silva"
                    className="w-full h-14 bg-background border border-white/10 rounded-2xl px-6 text-sm font-semibold outline-none focus:border-primary/50 transition-all placeholder:opacity-30"
                  />
               </div>

               <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-muted ml-1">CPF *</label>
                  <input 
                    type="text" 
                    value={cpf}
                    onChange={handleCpfChange}
                    required
                    placeholder="000.000.000-00"
                    className="w-full h-14 bg-background border border-white/10 rounded-2xl px-6 text-sm font-semibold outline-none focus:border-primary/50 transition-all placeholder:opacity-30"
                  />
               </div>

               <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-muted ml-1">E-mail *</label>
                  <div className="relative">
                     <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                     <input 
                      type="text" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="seu@email.com"
                      className="w-full h-14 bg-background border border-white/10 rounded-2xl pl-14 pr-6 text-sm font-semibold outline-none focus:border-primary/50 transition-all placeholder:opacity-30"
                     />
                  </div>
               </div>

               <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-text-muted ml-1">Senha *</label>
                  <div className="relative">
                     <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                     <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      className="w-full h-14 bg-background border border-white/10 rounded-2xl pl-14 pr-6 text-sm font-semibold outline-none focus:border-primary/50 transition-all placeholder:opacity-30"
                     />
                  </div>
               </div>
             </div>

             <NeonButton 
               type="submit" 
               disabled={loading}
               className="h-14 w-full rounded-2xl mt-2"
             >
               {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Criar Minha Conta"}
             </NeonButton>
          </form>

          {/* Social Logins */}
          <div className="mt-8">
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink-0 mx-4 text-text-muted text-xs font-bold uppercase tracking-widest">Ou acesse com</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <button 
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="h-12 w-full rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition-all group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-sm font-bold">Google</span>
              </button>
              <button 
                type="button"
                onClick={() => handleSocialLogin('apple')}
                className="h-12 w-full rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition-all group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.702z"/>
                </svg>
                <span className="text-sm font-bold">Apple</span>
              </button>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-neon-soft" />
                <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest">Sistemas de Defesa Ativos</span>
             </div>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
