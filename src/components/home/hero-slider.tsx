"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { NeonButton } from "../ui/neon-button"

const STATIC_BANNERS = [
  {
    title: "PRO <span class='text-primary'>GAMING</span>",
    description: "A engenharia definitiva para quem busca a supremacia digital.",
    image_url: "/images/banners/gamer-banner.png",
    link_url: "/loja?cat=Setup Master",
    id: "1"
  },
  {
    title: "TECH <span class='text-primary'>HOME</span>",
    description: "O futuro da automação e eletrodomésticos de elite para sua casa.",
    image_url: "/images/banners/eletrodomesticos-banner.png",
    link_url: "/loja?cat=Tech Home",
    id: "2"
  },
  {
    title: "HOME <span class='text-primary'>LUXURY</span>",
    description: "Conforto e sofisticação em cada detalhe da sua Cama, Mesa e Banho.",
    image_url: "/images/banners/cama-mesa-banho-banner.png",
    link_url: "/loja?cat=Home Luxury",
    id: "3"
  }
]

export function HeroSlider() {
  const [banners] = useState(STATIC_BANNERS)
  const [currentIndex, setCurrentIndex] = useState(0)

  const paginate = useCallback((dir: number) => {
    setCurrentIndex(i => (i + dir + banners.length) % banners.length)
  }, [banners.length])

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 7000)
    return () => clearInterval(timer)
  }, [paginate])

  const currentBanner = banners[currentIndex]

  return (
    <section className="relative w-full h-[300px] md:h-[500px] bg-background overflow-hidden">
      {/* Slide background — CSS transition only, no framer-motion */}
      <div className="absolute inset-0">
        {banners.map((banner, i) => (
          <div
            key={banner.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === currentIndex ? 1 : 0, zIndex: i === currentIndex ? 1 : 0 }}
          >
            <Image
              src={banner.image_url}
              alt="Banner"
              fill
              className="object-cover brightness-[0.4]"
              priority={i === 0}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent flex flex-col justify-end md:justify-center px-6 lg:px-24 pb-20 md:pb-0 z-10">
        <div className="max-w-4xl">
          <h1
            className="text-4xl md:text-7xl font-bold text-white uppercase tracking-tighter italic leading-none mb-4"
            dangerouslySetInnerHTML={{ __html: currentBanner.title }}
          />
          <p className="text-sm md:text-lg text-text-secondary font-bold mb-8 max-w-xl opacity-90">
            {currentBanner.description}
          </p>
          <Link href={currentBanner.link_url || "/"}>
            <NeonButton
              size="sm"
              className="h-11 px-8 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg"
            >
              Ver Segmento
            </NeonButton>
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-6 right-6 md:left-24 md:right-24 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-4 md:gap-6 pointer-events-auto">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className="group py-2"
            >
              <div className={`h-[2px] transition-all duration-500 ${
                i === currentIndex ? "w-12 md:w-16 bg-primary" : "w-6 md:w-8 bg-white/10 group-hover:bg-white/30"
              }`} />
              <span className={`block text-xs font-bold mt-1 transition-opacity duration-300 ${i === currentIndex ? "opacity-100 text-primary" : "opacity-0"}`}>
                0{i + 1}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => paginate(-1)}
            className="h-10 w-10 md:h-14 md:w-14 rounded-xl bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-background transition-colors shadow-xl active:scale-95"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="h-10 w-10 md:h-14 md:w-14 rounded-xl bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-background transition-colors shadow-xl active:scale-95"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>
      </div>

      {/* Overlay decoration */}
      <div className="absolute inset-0 pointer-events-none z-20">
         <div className="absolute inset-4 md:inset-8 border border-white/10 rounded-3xl" />
         <div className="absolute inset-0 bg-grid-tech opacity-10" />
      </div>
    </section>
  )
}
