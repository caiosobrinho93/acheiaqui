"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

function AuthSliderForm() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/perfil'

  // Login State
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Register State
  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regCpf, setRegCpf] = useState("")

  useEffect(() => {
    checkSession()
    // Auto-switch to register if ?register=true
    if (searchParams.get('register') === 'true') {
      setIsRegistering(true)
    }
  }, [searchParams])

  async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      router.push(redirectUrl)
    }
  }

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 11) value = value.slice(0, 11)
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    setRegCpf(value)
  }

  const isValidCpf = (cpfStr: string) => {
    const numbers = cpfStr.replace(/\D/g, '')
    return numbers.length === 11
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    })

    if (error) {
      if (error.message.includes("Email not confirmed") || error.message.includes("invalid credentials")) {
        toast.error("Erro no Acesso", {
          description: "Credenciais inválidas ou e-mail ainda não confirmado. Verifique sua caixa de entrada se acabou de se cadastrar."
        })
      } else {
        toast.error("Erro no Acesso", {
          description: "Verifique suas credenciais e tente novamente."
        })
      }
    } else {
      toast.success("Login Realizado", {
        description: `Bem-vindo de volta, ${data.user?.email?.split('@')[0]}!`
      })
      router.push(redirectUrl)
    }
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!regEmail.includes('@')) {
      toast.error("E-mail Inválido", { description: "O e-mail precisa conter um '@'." })
      return
    }

    if (!isValidCpf(regCpf)) {
      toast.error("CPF Inválido", { description: "Por favor, insira um CPF válido com 11 dígitos." })
      return
    }

    setLoading(true)
    const generatedUsername = regEmail.split('@')[0].toLowerCase() + Math.floor(Math.random() * 10000).toString()

    const { data, error } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
      options: {
        data: {
          full_name: regName,
          username: generatedUsername,
          cpf: regCpf.replace(/\D/g, '')
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      if (error.message.includes("already registered") || error.message.includes("already exists")) {
        toast.error("E-mail já cadastrado", {
          description: "Este e-mail já está em uso. Tente fazer login!"
        })
        setIsRegistering(false) // Switch to login tab
      } else {
        toast.error("Erro no Cadastro", {
          description: error.message
        })
      }
    } else {
      if (data.session === null) {
        toast.warning("Quase lá!", {
          description: "Enviamos um link de confirmação para o seu e-mail. Confirme para acessar sua conta."
        })
        setIsRegistering(false) // Switch to login so they can log in after confirming
      } else {
        toast.success("Bem-vindo ao AcheiAqui!", {
          description: "Conta criada e conectada com sucesso."
        })
        router.push(redirectUrl)
      }
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10" />

      <Link href="/" className="absolute top-10 left-10 flex items-center gap-2 text-text-muted hover:text-primary transition-colors group z-20">
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-semibold uppercase tracking-widest hidden sm:inline">Retornar à Loja</span>
      </Link>

      <div className="uiverse-container shadow-2xl">
        <div 
          className={cn(
            "uiverse-slider",
            isRegistering ? "-translate-x-1/2" : "translate-x-0"
          )}
        >
          {/* LOGIN FORM */}
          <form className="uiverse-form" onSubmit={handleLogin}>
            <span className="text-4xl font-black uppercase tracking-tighter mb-4">Login</span>

            <div className="uiverse-input-wrapper">
              <input 
                type="email" 
                className="uiverse-input" 
                required 
                placeholder=" "
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <label className="uiverse-label">E-mail</label>
            </div>

            <div className="uiverse-input-wrapper">
              <input 
                type="password" 
                className="uiverse-input" 
                required 
                placeholder=" "
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <label className="uiverse-label">Password</label>
            </div>

            <button type="submit" disabled={loading} className="uiverse-btn mt-4">
              {loading && !isRegistering ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
            </button>

            <span className="text-[10px] text-text-muted uppercase tracking-widest mt-4">
              Não tem uma conta?{" "}
              <button type="button" onClick={() => setIsRegistering(true)} className="font-bold text-primary hover:underline underline-offset-4 cursor-pointer ml-1">
                Criar Conta
              </button>
            </span>
          </form>

          {/* REGISTER FORM */}
          <form className="uiverse-form" onSubmit={handleRegister}>
            <span className="text-4xl font-black uppercase tracking-tighter mb-2">Cadastro</span>

            <div className="uiverse-input-wrapper">
              <input 
                type="text" 
                className="uiverse-input" 
                required 
                placeholder=" "
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
              <label className="uiverse-label">Nome Completo</label>
            </div>

            <div className="uiverse-input-wrapper">
              <input 
                type="text" 
                className="uiverse-input" 
                required 
                placeholder=" "
                value={regCpf}
                onChange={handleCpfChange}
              />
              <label className="uiverse-label">CPF</label>
            </div>

            <div className="uiverse-input-wrapper">
              <input 
                type="email" 
                className="uiverse-input" 
                required 
                placeholder=" "
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
              <label className="uiverse-label">E-mail</label>
            </div>

            <div className="uiverse-input-wrapper">
              <input 
                type="password" 
                className="uiverse-input" 
                required 
                placeholder=" "
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
              <label className="uiverse-label">Password</label>
            </div>

            <button type="submit" disabled={loading} className="uiverse-btn mt-2">
              {loading && isRegistering ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar Conta"}
            </button>

            <span className="text-[10px] text-text-muted uppercase tracking-widest mt-2">
              Já tem uma conta?{" "}
              <button type="button" onClick={() => setIsRegistering(false)} className="font-bold text-primary hover:underline underline-offset-4 cursor-pointer ml-1">
                Fazer Login
              </button>
            </span>
          </form>

        </div>
      </div>
    </main>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A]" />}>
      <AuthSliderForm />
    </Suspense>
  )
}
