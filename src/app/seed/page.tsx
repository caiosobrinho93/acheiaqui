"use client"

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const PRODUCTS_TO_SEED = [
  // Hardware
  { name: "Intel Core i9-14900K", slug: "intel-core-i9-14900k", price: 4200, category: "Hardware", main_image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=800", images: ["https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=800"], stock: 15, description: "Processador de última geração para performance extrema." },
  { name: "ASUS ROG RTX 4090", slug: "asus-rog-rtx-4090", price: 14500, category: "Hardware", main_image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800", images: ["https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800"], stock: 5, description: "A placa de vídeo mais potente do mundo." },
  { name: "Corsair Vengeance 32GB DDR5", slug: "corsair-vengeance-32gb-ddr5", price: 1100, category: "Hardware", main_image: "https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?q=80&w=800", images: ["https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?q=80&w=800"], stock: 30, description: "Memória RAM de alta velocidade com RGB." },
  { name: "Samsung 990 Pro 2TB", slug: "samsung-990-pro-2tb", price: 1400, category: "Hardware", main_image: "https://images.unsplash.com/photo-1597872200370-493dee249ad5?q=80&w=800", images: ["https://images.unsplash.com/photo-1597872200370-493dee249ad5?q=80&w=800"], stock: 25, description: "SSD NVMe Gen4 ultrarrápido." },
  { name: "AMD Ryzen 7 7800X3D", slug: "amd-ryzen-7-7800x3d", price: 2900, category: "Hardware", main_image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=800", images: ["https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=800"], stock: 20, description: "O melhor processador para games." },
  
  // Periféricos
  { name: "Logitech G Pro X Superlight 2", slug: "logitech-g-pro-x-superlight-2", price: 950, category: "Periféricos", main_image: "https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=800", images: ["https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=800"], stock: 40, description: "O mouse preferido dos pro-players." },
  { name: "Wooting 60HE", slug: "wooting-60he", price: 1800, category: "Periféricos", main_image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800", images: ["https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800"], stock: 10, description: "Teclado analógico com resposta instantânea." },
  { name: "SteelSeries Arctis Nova Pro", slug: "steelseries-arctis-nova-pro", price: 2400, category: "Periféricos", main_image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800", images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800"], stock: 15, description: "Áudio de alta fidelidade para gaming." },
  { name: "Shure SM7B", slug: "shure-sm7b", price: 3800, category: "Periféricos", main_image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800", images: ["https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800"], stock: 8, description: "O microfone padrão da indústria de podcast." },
  { name: "Elgato Facecam Pro", slug: "elgato-facecam-pro", price: 2100, category: "Periféricos", main_image: "https://images.unsplash.com/photo-1626014303757-6366116894c7?q=80&w=800", images: ["https://images.unsplash.com/photo-1626014303757-6366116894c7?q=80&w=800"], stock: 12, description: "Webcam 4K 60FPS para criadores de conteúdo." },

  // Monitores
  { name: "Samsung Odyssey OLED G9", slug: "samsung-odyssey-oled-g9", price: 10500, category: "Monitores", main_image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800", images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800"], stock: 5, description: "Monitor ultra-wide de 49 polegadas com tecnologia OLED." },
  { name: "Alienware 34 Curved QD-OLED", slug: "alienware-34-curved-qd-oled", price: 7800, category: "Monitores", main_image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800", images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800"], stock: 7, description: "Cores vibrantes e pretos perfeitos." },
  { name: "BenQ Zowie XL2566K 360Hz", slug: "benq-zowie-xl2566k", price: 5800, category: "Monitores", main_image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800", images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800"], stock: 10, description: "Desenvolvido para e-sports competitivos." },

  // Smartphones
  { name: "iPhone 15 Pro Max 256GB", slug: "iphone-15-pro-max-256gb", price: 8500, category: "Smartphones", main_image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800", images: ["https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800"], stock: 20, description: "O novo titânio da Apple." },
  { name: "Samsung Galaxy S24 Ultra", slug: "samsung-galaxy-s24-ultra", price: 7200, category: "Smartphones", main_image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800", images: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800"], stock: 15, description: "Poderosa IA integrada e câmera de 200MP." },
  { name: "Google Pixel 8 Pro", slug: "google-pixel-8-pro", price: 5800, category: "Smartphones", main_image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800", images: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800"], stock: 10, description: "A melhor experiência Android pura." },

  // Games
  { name: "PlayStation 5 Slim", slug: "playstation-5-slim", price: 3800, category: "Games", main_image: "https://images.unsplash.com/photo-1606813907291-d86ebb9b7427?q=80&w=800", images: ["https://images.unsplash.com/photo-1606813907291-d86ebb9b7427?q=80&w=800"], stock: 25, description: "O console da Sony agora mais compacto." },
  { name: "Xbox Series X", slug: "xbox-series-x", price: 4200, category: "Games", main_image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=800", images: ["https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=800"], stock: 20, description: "O Xbox mais potente de todos os tempos." },
  { name: "Nintendo Switch OLED", slug: "nintendo-switch-oled", price: 2200, category: "Games", main_image: "https://images.unsplash.com/photo-1578303512343-b1c869f79761?q=80&w=800", images: ["https://images.unsplash.com/photo-1578303512343-b1c869f79761?q=80&w=800"], stock: 15, description: "Leve seus jogos favoritos para qualquer lugar." },
  { name: "Steam Deck OLED 512GB", slug: "steam-deck-oled-512gb", price: 4800, category: "Games", main_image: "https://images.unsplash.com/photo-1606813907291-d86ebb9b7427?q=80&w=800", images: ["https://images.unsplash.com/photo-1606813907291-d86ebb9b7427?q=80&w=800"], stock: 10, description: "Sua biblioteca Steam na palma da mão." },

  // Cadeiras / Móveis
  { name: "Herman Miller Embody Gaming", slug: "herman-miller-embody-gaming", price: 12500, category: "Cadeiras", main_image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800", images: ["https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800"], stock: 5, description: "Ergonomia avançada para longas sessões." },
  { name: "Secretlab TITAN Evo", slug: "secretlab-titan-evo", price: 4500, category: "Cadeiras", main_image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800", images: ["https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800"], stock: 12, description: "A cadeira premium mais premiada do mundo." },

  // Setup / Deco
  { name: "Nanoleaf Lines", slug: "nanoleaf-lines", price: 1500, category: "Setup", main_image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800", images: ["https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800"], stock: 20, description: "Iluminação inteligente modular." },
  { name: "Philips Hue Play Bar", slug: "philips-hue-play-bar", price: 1200, category: "Setup", main_image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800", images: ["https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800"], stock: 25, description: "Imersão total com iluminação sincronizada." },

  // Mais itens para chegar a 40+
  { name: "RTX 4070 Ti Super", slug: "rtx-4070-ti-super", price: 6500, category: "Hardware", main_image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800", images: ["https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800"], stock: 15, description: "Alta performance para 1440p." },
  { name: "MSI MPG Z790 Edge", slug: "msi-mpg-z790-edge", price: 2800, category: "Hardware", main_image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800", images: ["https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800"], stock: 10, description: "Placa mãe robusta para Intel 14ª geração." },
  { name: "Fonte Corsair RM1000x", slug: "fonte-corsair-rm1000x", price: 1200, category: "Hardware", main_image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800", images: ["https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800"], stock: 20, description: "Energia estável e silenciosa." },
  { name: "NZXT Kraken Elite 360", slug: "nzxt-kraken-elite-360", price: 1800, category: "Hardware", main_image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800", images: ["https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800"], stock: 15, description: "Refrigeração líquida com display LCD." },
  { name: "Lian Li O11 Dynamic EVO", slug: "lian-li-o11-dynamic-evo", price: 1300, category: "Hardware", main_image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800", images: ["https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800"], stock: 18, description: "O gabinete preferido dos entusiastas." },
  { name: "Razer Viper V3 Pro", slug: "razer-viper-v3-pro", price: 1100, category: "Periféricos", main_image: "https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=800", images: ["https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=800"], stock: 25, description: "Leveza e precisão extrema." },
  { name: "Keychron Q1 Pro", slug: "keychron-q1-pro", price: 1600, category: "Periféricos", main_image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800", images: ["https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800"], stock: 10, description: "Teclado mecânico custom em metal." },
  { name: "LG UltraGear 27GP850", slug: "lg-ultragear-27gp850", price: 2800, category: "Monitores", main_image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800", images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800"], stock: 15, description: "Nano IPS com 1ms de resposta." },
  { name: "Xiaomi 14 Ultra", slug: "xiaomi-14-ultra", price: 6500, category: "Smartphones", main_image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800", images: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800"], stock: 10, description: "Câmera Leica em seu smartphone." },
  { name: "Nothing Phone (2)", slug: "nothing-phone-2", price: 4200, category: "Smartphones", main_image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800", images: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800"], stock: 12, description: "Design único e interface Glyph." },
  { name: "DualSense Edge", slug: "dualsense-edge", price: 1300, category: "Games", main_image: "https://images.unsplash.com/photo-1606813907291-d86ebb9b7427?q=80&w=800", images: ["https://images.unsplash.com/photo-1606813907291-d86ebb9b7427?q=80&w=800"], stock: 15, description: "Controle pro para PlayStation 5." },
  { name: "ROG Ally Z1 Extreme", slug: "rog-ally-z1-extreme", price: 4500, category: "Games", main_image: "https://images.unsplash.com/photo-1606813907291-d86ebb9b7427?q=80&w=800", images: ["https://images.unsplash.com/photo-1606813907291-d86ebb9b7427?q=80&w=800"], stock: 12, description: "O PC gamer portátil da ASUS." },
  { name: "Govee Glide Hexa Pro", slug: "govee-glide-hexa-pro", price: 1800, category: "Setup", main_image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800", images: ["https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800"], stock: 10, description: "Painéis LED 3D para seu setup." },
  { name: "Artisan Hien XL", slug: "artisan-hien-xl", price: 550, category: "Periféricos", main_image: "https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=800", images: ["https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=800"], stock: 20, description: "O mousepad definitivo do Japão." },
  { name: "Steam Deck Docking Station", slug: "steam-deck-docking-station", price: 600, category: "Games", main_image: "https://images.unsplash.com/photo-1606813907291-d86ebb9b7427?q=80&w=800", images: ["https://images.unsplash.com/photo-1606813907291-d86ebb9b7427?q=80&w=800"], stock: 30, description: "Conecte seu Steam Deck na TV." },
  { name: "WD Black SN850X 1TB", slug: "wd-black-sn850x-1tb", price: 750, category: "Hardware", main_image: "https://images.unsplash.com/photo-1597872200370-493dee249ad5?q=80&w=800", images: ["https://images.unsplash.com/photo-1597872200370-493dee249ad5?q=80&w=800"], stock: 30, description: "Performance superior para gaming." },
  { name: "Razer BlackShark V2 Pro", slug: "razer-blackshark-v2-pro", price: 1300, category: "Periféricos", main_image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800", images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800"], stock: 15, description: "O headset dos campeões." },
  { name: "iPhone 14 128GB", slug: "iphone-14-128gb", price: 4500, category: "Smartphones", main_image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800", images: ["https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800"], stock: 10, description: "Performance e estilo em um só lugar." },
  { name: "PlayStation Portal", slug: "playstation-portal", price: 1600, category: "Games", main_image: "https://images.unsplash.com/photo-1606813907291-d86ebb9b7427?q=80&w=800", images: ["https://images.unsplash.com/photo-1606813907291-d86ebb9b7427?q=80&w=800"], stock: 10, description: "Jogue PS5 via Remote Play." },
  { name: "Nanoleaf Shapes", slug: "nanoleaf-shapes", price: 1300, category: "Setup", main_image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800", images: ["https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800"], stock: 15, description: "Transforme sua parede em arte." }
];

export default function SeedPage() {
  const [status, setStatus] = useState<string>("Aguardando comando...");
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    setStatus("Semeando produtos...");

    try {
      // Inserir produtos
      const { error: prodError } = await supabase
        .from('products')
        .upsert(PRODUCTS_TO_SEED, { onConflict: 'slug' });

      if (prodError) throw prodError;

      setStatus("Produtos ok! Semeando depoimentos...");

      const TESTIMONIALS = [
        { user_name: "Gabriel Silva", user_role: "Pro Player", content: "A Flash Multimarcas é o único lugar onde encontro hardware de ponta com entrega garantida. Setup renovado!", rating: 5, avatar_char: "G", is_active: true },
        { user_name: "Marina Souza", user_role: "Designer UI/UX", content: "O monitor OLED G9 mudou minha produtividade. O atendimento foi excepcional do início ao fim.", rating: 5, avatar_char: "M", is_active: true },
        { user_name: "Ricardo Oliveira", user_role: "Software Engineer", content: "iPhone 15 Pro Max chegou impecável. Site extremamente rápido e intuitivo. Recomendo muito!", rating: 5, avatar_char: "R", is_active: true },
        { user_name: "Lucas Mendonça", user_role: "Streamer", content: "Tudo que um criador precisa está aqui. A curadoria de periféricos é a melhor do mercado nacional.", rating: 5, avatar_char: "L", is_active: true },
        { user_name: "Carla Ferreira", user_role: "Entusiasta Tech", content: "A estética do site já diz tudo. É elite pura. Meus Nanoleafs deixaram o quarto em outro nível.", rating: 5, avatar_char: "C", is_active: true }
      ];

      const { error: testError } = await supabase
        .from('testimonials')
        .upsert(TESTIMONIALS, { onConflict: 'user_name' });

      if (testError) throw testError;

      // 3. Seed Categories
      const categories = [
        { name: "Hardware", image_url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=800" },
        { name: "Periféricos", image_url: "https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=800" },
        { name: "Monitores", image_url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800" },
        { name: "Smartphones", image_url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800" },
        { name: "Games", image_url: "https://images.unsplash.com/photo-1606813907291-d86ebb9b7427?q=80&w=800" },
        { name: "Setup Master", image_url: "/images/wallpapers/setup_master.png" },
        { name: "Home Luxury", image_url: "/images/banners/cama-mesa-banho-banner.png" },
        { name: "Tech Home", image_url: "/images/banners/eletrodomesticos-banner.png" }
      ]
      
      await supabase.from('categories').upsert(categories, { onConflict: 'name' })

      // 4. Seed Banners
      const banners = [
        {
          title: "PRO <span class='text-primary'>GAMING</span>",
          description: "A engenharia definitiva para quem busca a supremacia digital.",
          image_url: "/images/banners/gamer-banner.png",
          link_url: "/loja?cat=Setup Master",
          display_order: 1,
          is_active: true
        },
        {
          title: "TECH <span class='text-primary'>HOME</span>",
          description: "O futuro da automação e eletrodomésticos de elite para sua casa.",
          image_url: "/images/banners/eletrodomesticos-banner.png",
          link_url: "/loja?cat=Tech Home",
          display_order: 2,
          is_active: true
        },
        {
          title: "HOME <span class='text-primary'>LUXURY</span>",
          description: "Conforto e sofisticação em cada detalhe da sua Cama, Mesa e Banho.",
          image_url: "/images/banners/cama-mesa-banho-banner.png",
          link_url: "/loja?cat=Home Luxury",
          display_order: 3,
          is_active: true
        }
      ]

      await supabase.from('banners').delete().neq('id', '00000000-0000-0000-0000-000000000000') // Clear banners
      const { error: bError } = await supabase.from('banners').insert(banners)
      if (bError) throw bError

      setStatus("Sucesso! Produtos, categorias, banners e depoimentos foram sincronizados com os novos segmentos.");
    } catch (err: any) {
      console.error(err);
      setStatus("Erro: " + (err.message || "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full bg-surface border border-white/5 rounded-3xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 uppercase tracking-tighter italic">
          Seed <span className="text-primary">Database</span>
        </h1>
        <p className="text-text-muted mb-8">
          Clique no botão abaixo para adicionar 40 novos produtos premium ao banco de dados Supabase.
        </p>
        
        <div className="p-4 bg-white/5 rounded-xl mb-8 font-mono text-xs text-left overflow-auto max-h-40">
          {status}
        </div>

        <button
          onClick={handleSeed}
          disabled={loading}
          className="w-full h-14 bg-primary text-background rounded-xl font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? "Processando..." : "Semaear Agora"}
        </button>
      </div>
    </div>
  );
}
