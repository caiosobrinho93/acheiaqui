-- Site Content Tables
-- Tabelas para controle total do conteúdo estático via banco de dados

-- Tabelas de Informações (Info Cards)
CREATE TABLE IF NOT EXISTS public.info_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    icon TEXT NOT NULL, -- Nome do ícone Lucide
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    color_class TEXT, -- Ex: text-primary
    bg_image TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Depoimentos (Testimonials)
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_name TEXT NOT NULL,
    user_role TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    avatar_char TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir dados iniciais (Seed)
INSERT INTO public.info_cards (icon, title, description, color_class, bg_image, display_order) VALUES
('Zap', 'ENVIO SEGURO', 'Logística otimizada para garantir que seu pedido chegue intacto.', 'text-primary', '/images/bg/entrega_flash.png', 0),
('ShieldCheck', 'COMPRA PROTEGIDA', 'Sua transação e seus dados estão seguros com criptografia de ponta.', 'text-accent-gold', '/images/bg/garantia_vip.png', 1),
('Trophy', 'QUALIDADE CURADA', 'Produtos selecionados criteriosamente para oferecer o melhor custo-benefício.', 'text-accent-cyan', '/images/bg/qualidade_elite.png', 2);

INSERT INTO public.testimonials (user_name, user_role, content, rating, avatar_char) VALUES
('Caio Silva', 'Hardcore Gamer', 'O Cyber-Sneak é de outro planeta. Conforto e estilo imbatíveis.', 5, 'C'),
('Lucas Melo', 'Cliente Verificado', 'Entrega em 24h real. O produto chegou impecável.', 5, 'L'),
('Ana Júlia', 'Designer', 'O monitor Cyber-View mudou meu workflow. Qualidade de cor elite.', 5, 'A'),
('Roberto F.', 'Pro Streamer', 'AcheiAqui é minha única escolha para periféricos agora.', 5, 'R'),
('Marcos Vinicius', 'Developer', 'Teclado mecânico com resposta instantânea. Produtividade subiu 200%.', 5, 'M'),
('Beatriz Lima', 'Influencer', 'O setup todo branco ficou perfeito. Iluminação e design de primeira.', 5, 'B');

-- RLS
ALTER TABLE public.info_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read info_cards" ON public.info_cards FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (true);
