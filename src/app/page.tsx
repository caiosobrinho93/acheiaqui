"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSlider } from "@/components/home/hero-slider";
import { ProductCard } from "@/components/ui/product-card";
import { NeonButton } from "@/components/ui/neon-button";
import { toast } from "sonner";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { MotionContainer, MotionItem } from "@/components/ui/motion-container";
import { supabase, type Product, type Category } from "@/lib/supabase";
import { 
  ArrowRight, 
  Trophy, 
  ShoppingBag, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Star, 
  Cpu, 
  Monitor, 
  MousePointer2, 
  Keyboard, 
  Smartphone,
  Flame,
  Clock,
  Loader2,
  Search,
  Quote
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/lib/constants";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [infoCards, setInfoCards] = useState<any[]>([]);
  const [homeTestimonials, setHomeTestimonials] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchFeatured() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) {
        setProducts(data.filter(p => p.name && p.slug));
      } else {
        setProducts([]);
      }

      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });
      if (catData) setCategories(catData);

      // Fetch Info Cards
      const { data: infoData } = await supabase.from('info_cards').select('*').order('display_order', { ascending: true });
      if (infoData) setInfoCards(infoData);

      // Fetch Testimonials
      const { data: testData } = await supabase.from('testimonials').select('*').eq('is_active', true).order('created_at', { ascending: false });
      if (testData) setHomeTestimonials(testData);

      setLoading(false);
    }
    fetchFeatured();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error("E-mail inválido");
      return;
    }

    setNewsletterLoading(true);
    const { error } = await supabase
      .from('newsletter_subs')
      .insert([{ email: newsletterEmail }]);

    if (error) {
      if (error.code === '23505') {
        toast.info("Você já está inscrito!");
      } else {
        toast.error("Erro ao inscrever");
      }
    } else {
      toast.success("Inscrição confirmada!", {
        description: "Você receberá nossos próximos drops."
      });
      setNewsletterEmail("");
    }
    setNewsletterLoading(false);
  };

  // Split products for sections
  const newlyArrived = products.slice(0, 10);
  const mostWanted = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10);
  const bigDiscounts = products
    .filter(p => p.promo_price && p.promo_price < p.price * 0.8) // More than 20% off
    .slice(0, 10);

  const displayCategories = categories;

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <HeroSlider />

      <section className="py-12 overflow-hidden bg-background relative border-y border-white/5">
        <div className="absolute inset-0 bg-grid-tech opacity-10 pointer-events-none" />
        
        <div className="container mx-auto px-6 mb-10 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="h-8 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(198,255,0,0.5)]" />
              <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-foreground italic">Categorias <span className="text-primary">Premium</span></h3>
           </div>
           <div className="h-px flex-1 mx-8 bg-gradient-to-r from-primary/30 via-primary/5 to-transparent" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-6 animate-marquee whitespace-nowrap px-6">
            {[...displayCategories, ...displayCategories].map((cat, idx) => (
              <Link 
                key={idx} 
                href={`/loja?cat=${cat.name}`} 
                className="group relative flex items-center w-[280px] h-24 bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl transition-all duration-500 hover:border-primary/40 hover:bg-surface/60 hover:shadow-[0_0_40px_rgba(198,255,0,0.1)] shrink-0 overflow-hidden"
              >
                {/* Diagonal Image Container - Full Cover Style */}
                <div className="absolute left-0 top-0 h-full w-[42%] overflow-hidden z-0" style={{ clipPath: 'polygon(0 0, 85% 0, 100% 100%, 0% 100%)' }}>
                   <Image 
                     src={cat.image_url} 
                     alt={cat.name} 
                     fill 
                     className="object-cover group-hover:scale-110 transition-transform duration-[1.5s]" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent mix-blend-overlay" />
                   <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-500" />
                </div>

                {/* Text Section */}
                <div className="relative z-10 ml-[45%] pr-6 flex flex-col justify-center h-full">
                  <span className="text-[11px] font-black tracking-[0.15em] uppercase text-text-secondary group-hover:text-primary transition-colors whitespace-normal break-words leading-[1.1] max-w-[130px]">
                    {cat.name}
                  </span>
                  <div className="h-0.5 w-0 bg-primary mt-2 group-hover:w-12 transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(198,255,0,0.5)]" />
                </div>

                {/* Technical Corner Decoration */}
                <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-100 transition-opacity">
                   <div className="w-2 h-2 border-t border-r border-primary" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <style jsx global>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-reverse {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-marquee {
            display: flex;
            width: fit-content;
            animation: marquee 40s linear infinite;
          }
          .animate-marquee-reverse {
            display: flex;
            width: fit-content;
            animation: marquee-reverse 50s linear infinite;
          }
          .animate-marquee:hover, .animate-marquee-reverse:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>

      {/* SECTION 1: ACABARAM DE CHEGAR */}
      <section className="py-16 relative overflow-hidden bg-surface/2 bg-grid-tech">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                 <Flame className="h-5 w-5 text-primary fill-current" />
                 <span className="text-sm font-medium tracking-widest text-primary uppercase">Novidades AcheiAqui</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-semibold tracking-tight leading-none">
                ACABARAM DE <span className="text-primary">CHEGAR.</span>
              </h2>
            </div>
            <Link href="/loja?sort=recent" className="hidden md:flex items-center gap-3 text-sm font-medium tracking-wide text-text-muted hover:text-primary transition-all">
              Ver Todos <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <MotionContainer 
          key={loading ? 'loading' : `loaded-${products.length}`}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-[10px] overflow-x-auto px-6 lg:px-12 pb-8 md:pb-0 scrollbar-hide snap-x"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <MotionItem key={i} className="min-w-[220px] md:min-w-0 snap-center">
                <ProductCardSkeleton />
              </MotionItem>
            ))
          ) : (
            newlyArrived.map((product) => (
              <MotionItem key={product.id} className="min-w-[220px] md:min-w-0 snap-center">
                 <ProductCard product={product} />
              </MotionItem>
            ))
          )}
        </MotionContainer>
      </section>

      {/* BANNER 1: SETUP MASTER */}
      <section className="px-6 lg:px-12 mb-24 relative">
        <div className="container mx-auto">
           <div className="relative h-[350px] md:h-[600px] rounded-[2.5rem] overflow-hidden group border border-primary/20 shadow-[0_0_50px_rgba(198,255,0,0.1)]">
              <Image 
                src="/images/wallpapers/setup_master.png" 
                alt="Setup Master Banner" 
                fill 
                className="object-cover transition-transform duration-[3000ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent p-8 md:p-24 flex flex-col justify-center">
                 <motion.div
                   initial={{ opacity: 0, x: -30 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                 >
                   <span className="text-primary font-black uppercase tracking-[0.5em] text-xs mb-4 block">Linha de Elite</span>
                   <h3 className="text-6xl md:text-[9rem] font-black text-white tracking-tighter leading-[0.8] mb-8 uppercase italic">
                     SETUP <br /> 
                     <span className="text-primary not-italic">MASTER.</span>
                   </h3>
                   <p className="text-sm md:text-xl text-text-muted font-bold uppercase tracking-widest mb-10 max-w-xl leading-relaxed italic">
                     A engenharia definitiva para quem busca a <span className="text-white">supremacia digital.</span> Prepare o terreno para a vitória.
                   </p>
                   <Link href="/loja?cat=Setup Master">
                    <NeonButton size="sm" className="h-11 px-8 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                      Ver Segmento
                    </NeonButton>
                   </Link>
                 </motion.div>
              </div>
              
              {/* Technical HUD Overlay */}
              <div className="absolute top-8 right-8 text-primary/40 hidden md:block">
                 <div className="text-[10px] font-mono flex flex-col items-end gap-1">
                    <span>SYSTEM_STATUS: OPTIMAL</span>
                    <span>HARDWARE_SYNC: 100%</span>
                    <span>FRAME_GEN: ACTIVE</span>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* SECTION 2: MAIS PROCURADOS */}
      <section className="py-24 relative overflow-hidden bg-surface/5">
        <div className="absolute inset-0 bg-grid-tech opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                 <Star className="h-5 w-5 text-primary fill-current" />
                 <span className="text-sm font-medium tracking-widest text-primary uppercase">Tendências</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-semibold tracking-tight leading-none">
                MAIS <span className="text-primary">PROCURADOS.</span>
              </h2>
            </div>
            <Link href="/loja?sort=recent" className="hidden md:flex items-center gap-3 text-sm font-medium tracking-wide text-text-muted hover:text-primary transition-all">
              Ver Todos <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <MotionContainer 
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-[10px] overflow-x-auto px-6 lg:px-12 pb-8 md:pb-0 scrollbar-hide snap-x"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <MotionItem key={i} className="min-w-[220px] md:min-w-0 snap-center">
                <ProductCardSkeleton />
              </MotionItem>
            ))
          ) : (
            mostWanted.map((product) => (
              <MotionItem key={product.id} className="min-w-[220px] md:min-w-0 snap-center">
                 <ProductCard product={product} />
              </MotionItem>
            ))
          )}
        </MotionContainer>
      </section>

      {/* SECTION 3: DESCONTÃO ACHEIAQUI - Aggressive Fire Redesign */}
      <section className="py-32 relative overflow-hidden">
        {/* Aggressive Fire Background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-red-950 via-primary/20 to-orange-950/40 opacity-50 transition-opacity duration-1000" />
        <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-30" />
        
        {/* Animated Fire Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
        
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
          <div className="scanline opacity-20" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
                    <Zap className="h-6 w-6 text-primary fill-current" />
                 </div>
                 <span className="text-sm font-medium tracking-widest text-primary/80 uppercase">Drops Exclusivos</span>
              </div>
              <h2 className="text-7xl md:text-[10rem] font-semibold tracking-tighter leading-[0.85] mb-4 drop-shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">
                DESCONTÃO <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-red-600">ACHEIAQUI.</span>
              </h2>
            </motion.div>
            
            <div className="flex items-center gap-4 bg-surface/80 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-xl shadow-xl">
               <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
               <div className="flex flex-col">
                  <span className="text-xs font-medium tracking-wider text-text-muted uppercase">Oferta por Tempo Limitado</span>
                  <span className="text-2xl font-mono font-bold">12:45:00</span>
               </div>
            </div>
          </div>
        </div>

        <MotionContainer 
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-[10px] overflow-x-auto px-6 lg:px-12 pb-8 md:pb-0 scrollbar-hide snap-x"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <MotionItem key={i} className="min-w-[220px] md:min-w-0 snap-center">
                <ProductCardSkeleton />
              </MotionItem>
            ))
          ) : (
            bigDiscounts.map((product) => (
              <MotionItem key={product.id} className="min-w-[220px] md:min-w-0 snap-center">
                 <ProductCard product={product} />
              </MotionItem>
            ))
          )}
        </MotionContainer>
      </section>

      {/* INFO CARDS - Premium Refinement */}
      <section className="py-24 px-6 lg:px-12 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="container mx-auto">
           <div className="relative p-8 md:p-20 rounded-[3rem] md:rounded-[5rem] bg-surface/30 backdrop-blur-xl border border-white/5 overflow-hidden group mb-12">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               
               <div className="relative z-10 flex flex-col items-center text-center">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-10"
                  >
                    <Sparkles className="h-3 w-3" />
                    Engenharia de Performance
                  </motion.div>
                  
                  <h2 className="text-5xl md:text-9xl font-black text-white uppercase tracking-tighter italic leading-none mb-10">
                    SETUP <span className="text-primary">MASTER</span>
                  </h2>
                  
                  <p className="text-lg md:text-2xl text-text-secondary font-bold max-w-3xl mb-12 leading-relaxed px-4 md:px-0">
                    Não é apenas hardware. É a materialização da sua supremacia digital. Curadoria de elite para quem não aceita o comum.
                  </p>
               </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {infoCards.map((card, idx) => {
                const icons: Record<string, any> = { Zap, ShieldCheck, Trophy };
                const IconComponent = icons[card.icon] || Zap;
                return (
                  <div 
                    key={idx} 
                    className={cn(
                      "relative p-8 rounded-[2rem] bg-surface/40 border border-white/5 group hover:border-white/10 transition-all duration-500 shadow-2xl overflow-hidden h-[180px] md:h-[250px] flex flex-col justify-center",
                      "group-hover:shadow-[0_0_50px_rgba(198,255,0,0.1)]"
                    )}
                  >
                    {/* Animated Background Image */}
                    <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                        {card.bg_image && (
                          <Image 
                            src={card.bg_image} 
                            alt={card.title} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-surface/80 via-transparent to-surface" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className={cn(
                          "h-10 w-10 md:h-14 md:w-14 rounded-2xl bg-background/60 backdrop-blur-md border border-white/5 flex items-center justify-center mb-4 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl", 
                          card.color_class
                        )}>
                          <IconComponent className="h-5 w-5 md:h-7 md:w-7" />
                        </div>
                        
                        <h4 className="text-xl md:text-3xl font-semibold tracking-tight mb-2 md:mb-4 group-hover:translate-x-1 transition-transform duration-500 uppercase">
                          {card.title}
                        </h4>
                        
                        <p className="text-sm md:text-base font-normal leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2 md:line-clamp-none">
                          {card.description}
                        </p>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>
      </section>

      {/* TESTIMONIALS / SOCIAL PROOF */}
      <section className="py-16 px-6 lg:px-12 bg-background relative overflow-hidden">
        <div className="container mx-auto">
           <div className="flex flex-col items-center text-center mb-16">
              <div className="inline-flex items-center gap-6 px-6 py-3 rounded-full bg-white/5 border border-white/10 mb-6">
                 <Star className="h-5 w-5 text-primary fill-current" />
                 <span className="text-sm font-medium tracking-widest text-primary uppercase">Depoimentos</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-semibold tracking-tight leading-none">REVIEWS DE <span className="text-primary">ELITE.</span></h2>
           </div>

            <div className="relative overflow-hidden group py-12">
              <div className="flex animate-marquee-reverse hover:[animation-play-state:paused] gap-8">
                {[...homeTestimonials, ...homeTestimonials, ...homeTestimonials].length > 0 ? (
                  [...homeTestimonials, ...homeTestimonials, ...homeTestimonials].map((review, i) => (
                    <div key={i} className="min-w-[320px] md:min-w-[480px] p-10 rounded-[3rem] bg-surface/30 backdrop-blur-md border border-white/5 relative group/card hover:border-primary/40 transition-all duration-500 shadow-2xl flex flex-col gap-6">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1.5 text-primary">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={cn("h-4 w-4", i < (review.rating || 5) ? "fill-current" : "opacity-20")} />
                          ))}
                        </div>
                        <Quote className="h-10 w-10 text-primary/10 group-hover/card:text-primary/20 transition-colors" />
                      </div>
                      
                      <p className="text-text-secondary text-lg md:text-xl font-medium italic leading-relaxed line-clamp-4">
                        "{review.content || review.comment || "Sem comentário."}"
                      </p>

                      <div className="flex items-center gap-4 pt-6 border-t border-white/5 mt-auto">
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xl italic">
                          {(review.name || review.user_name || review.profiles?.full_name || 'U')[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-black uppercase tracking-widest text-white">{review.name || review.user_name || review.profiles?.full_name || 'Membro Elite'}</span>
                           <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60 italic">{review.user_role || 'Cliente Verificado'}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback Testimonials if DB is empty
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="min-w-[320px] md:min-w-[480px] p-10 rounded-[3rem] bg-surface/30 border border-white/5 flex flex-col gap-6 opacity-40">
                      <div className="flex gap-1.5 text-primary">
                        {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                      </div>
                      <p className="text-text-secondary text-lg italic">"O melhor marketplace de tecnologia que já utilizei. Entrega rápida e produtos de elite."</p>
                      <div className="flex items-center gap-4 pt-6 border-t border-white/5 mt-auto">
                        <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10" />
                        <div className="flex flex-col gap-1">
                           <div className="h-3 w-24 bg-white/10 rounded" />
                           <div className="h-2 w-16 bg-white/5 rounded" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
        </div>
      </section>

      {/* NEWSLETTER - Premium High-Impact */}
      <section className="py-32 px-6 lg:px-12 relative overflow-hidden group">
        <div className="absolute inset-0 z-0">
           <Image 
             src="/images/wallpapers/setup_master.png" 
             alt="Setup Master Background" 
             fill 
             className="object-cover opacity-10 group-hover:opacity-20 group-hover:scale-105 transition-all duration-[3s]" 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-6xl mx-auto rounded-[4rem] bg-surface/30 backdrop-blur-2xl border border-white/10 p-12 md:p-24 flex flex-col items-center text-center gaming-card relative">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
               <Zap className="h-64 w-64 text-primary" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="h-16 w-16 rounded-3xl bg-primary flex items-center justify-center text-background shadow-neon-soft rotate-12 group-hover:rotate-0 transition-transform duration-500">
                 <Zap className="h-8 w-8 fill-current" />
              </div>
              
              <div className="flex flex-col gap-4">
                <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">FAÇA PARTE DO <br /> <span className="text-primary not-italic">INNER CIRCLE.</span></h2>
                <p className="text-text-muted text-sm md:text-lg font-bold uppercase tracking-[0.4em] max-w-2xl mx-auto italic">Receba drops exclusivos e descontos de elite antes de todo mundo.</p>
              </div>

              <form 
                onSubmit={async (e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget as HTMLFormElement)
                  const email = formData.get('email') as string
                  if (!email) return
                  
                  setNewsletterLoading(true)
                  const { error } = await supabase.from('newsletter_subs').insert({ email })
                  if (error) {
                    if (error.code === '23505') {
                      toast.info("Você já está inscrito!", { description: "Já temos seu radar ativado." })
                    } else {
                      toast.error("Erro ao inscrever-se", { description: "Tente novamente em instantes." })
                    }
                  } else {
                    toast.success("Bem-vindo ao Elite!", { description: "Você receberá nossas atualizações." })
                    ;(e.target as HTMLFormElement).reset()
                  }
                  setNewsletterLoading(false)
                }}
                className="w-full max-w-2xl flex flex-col md:flex-row gap-4 mt-8"
              >
                <div className="relative flex-1">
                   <div className="absolute inset-y-0 left-6 flex items-center text-text-muted">
                      <Search className="h-5 w-5" />
                   </div>
                   <input 
                    name="email"
                    type="email" 
                    placeholder="DIGITE SEU MELHOR E-MAIL" 
                    required
                    className="w-full h-20 bg-background/50 border border-white/10 rounded-2xl pl-16 pr-6 text-sm font-black uppercase tracking-widest outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/30"
                   />
                </div>
                <button 
                  type="submit" 
                  disabled={newsletterLoading}
                  className="h-20 px-12 rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-neon-soft bg-primary text-background hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {newsletterLoading ? "Sincronizando..." : "Inscrever Agora"}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
