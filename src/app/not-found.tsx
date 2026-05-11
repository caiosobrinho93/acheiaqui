import Link from "next/link"
import { NeonButton } from "@/components/ui/neon-button"
import { ArrowLeft, Ghost } from "lucide-react"

export default function NotFound() {
  return (
    <main className="flex min-h-screen bg-background items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-danger/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        <div className="h-24 w-24 rounded-3xl bg-surface border border-danger/20 flex items-center justify-center text-danger mb-12 animate-bounce">
          <Ghost className="h-12 w-12" />
        </div>
        
        <h1 className="text-8xl font-black tracking-tighter text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-black uppercase tracking-tight text-primary mb-6">Página não encontrada</h2>
        
        <p className="text-text-secondary mb-12 leading-relaxed">
          Parece que você se perdeu no ciberespaço. A página que você está procurando não existe ou foi movida.
        </p>

        <Link href="/">
          <NeonButton size="lg">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Voltar para a Home
          </NeonButton>
        </Link>
      </div>
    </main>
  )
}
