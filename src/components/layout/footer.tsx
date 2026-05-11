import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-16 mb-24">
          {/* Brand */}
          <div className="flex flex-col gap-8">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center p-1.5 overflow-hidden transition-all group-hover:scale-110 shadow-neon-soft">
                <Image src="/images/logo.png" alt="AcheiAqui" width={48} height={48} className="object-contain" />
              </div>
              <span className="text-3xl font-black tracking-tighter uppercase italic">ACHEI<span className="text-primary">AQUI</span></span>
            </Link>
            <p className="text-text-secondary text-lg font-medium leading-relaxed max-w-xs">
              Sua curadoria premium. Encontrou o melhor, levou com segurança.
            </p>
            <div className="flex items-center gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <Link key={i} href="#" className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary/50 transition-all">
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            <div className="flex flex-col gap-8">
              <h4 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Navegação</h4>
              <ul className="flex flex-col gap-4">
                <li><Link href="/loja" className="text-text-secondary font-black text-xs uppercase tracking-widest hover:text-primary transition-colors italic">Produtos</Link></li>
                <li><Link href="/quem-somos" className="text-text-secondary font-black text-xs uppercase tracking-widest hover:text-primary transition-colors italic">Quem Somos</Link></li>
              </ul>
            </div>
            <div className="flex flex-col gap-8">
              <h4 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Suporte Direto</h4>
              <ul className="flex flex-col gap-4">
                <li>
                  <Link 
                    href="https://wa.me/5511999999999" 
                    target="_blank" 
                    className="flex items-center gap-3 text-white font-black text-xs uppercase tracking-widest hover:text-primary transition-all group italic"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all shadow-neon-soft">
                       <Phone className="h-4 w-4" />
                    </div>
                    Suporte WhatsApp
                  </Link>
                </li>
                {['Minha Conta', 'Meus Pedidos', 'Privacidade'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-text-secondary font-black text-xs uppercase tracking-widest hover:text-primary transition-colors italic">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-8">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">Escritório</h4>
            <ul className="flex flex-col gap-6">
              <li className="flex items-start gap-4 text-text-secondary font-medium">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>Rua do Futuro, 2026, <br />Cyber City - SP</span>
              </li>
              <li className="flex items-center gap-4 text-text-secondary font-medium">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>contato@acheiaqui.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-text-muted text-xs font-bold uppercase tracking-[0.2em] text-center md:text-left">
            © 2026 ACHEIAQUI. ENCONTROU, LEVOU.
          </p>
          <div className="flex items-center gap-6 opacity-30 grayscale">
            <div className="h-6 w-10 border border-white/20 rounded flex items-center justify-center text-[10px] font-bold uppercase">PIX</div>
            <div className="h-6 w-10 border border-white/20 rounded flex items-center justify-center text-[10px] font-bold uppercase">VISA</div>
            <div className="h-6 w-10 border border-white/20 rounded flex items-center justify-center text-[10px] font-bold uppercase">MC</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
