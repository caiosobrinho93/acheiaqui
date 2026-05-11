import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { NeonButton } from "@/components/ui/neon-button"
import { Header } from "@/components/layout/header"
import { ShieldCheck, User as UserIcon, LogOut } from "lucide-react"

import { cookies } from "next/headers"

export default async function RealDashboardPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <div className="container mx-auto px-4 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">MINHA <span className="text-primary">CONTA</span></h1>
              <p className="text-text-secondary">Informações de perfil sincronizadas com Supabase Realtime.</p>
            </div>
            <form action="/auth/signout" method="post">
              <NeonButton variant="glass" type="submit">
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </NeonButton>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* User Profile Card */}
            <div className="md:col-span-1 p-8 rounded-3xl bg-surface border border-white/5 flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mb-6">
                <UserIcon className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-1">{user.user_metadata?.full_name || 'Membro VIP'}</h3>
              <p className="text-sm text-text-muted mb-6">{user.email}</p>
              
              <div className="w-full flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-text-muted p-3 bg-background rounded-xl">
                  <span>Status</span>
                  <span className="text-success">Ativo</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-text-muted p-3 bg-background rounded-xl">
                  <span>Nível</span>
                  <span className="text-primary">Premium</span>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="md:col-span-2 p-8 rounded-3xl bg-surface border border-white/5">
              <div className="flex items-center gap-3 mb-8">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">Segurança e Dados</h3>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-2">ID do Usuário (Supabase)</label>
                  <code className="block p-4 bg-background border border-white/10 rounded-xl text-xs font-mono text-primary break-all">
                    {user.id}
                  </code>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-2">Último Acesso</label>
                  <p className="text-foreground font-medium">
                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('pt-BR') : 'N/A'}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <NeonButton className="w-full sm:w-auto">Editar Perfil</NeonButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
