-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "Admin insert categories" ON public.product_categories FOR INSERT WITH CHECK (true); -- Permitindo anon para o seed inicial, mas idealmente seria admin only

-- Inserir categorias iniciais
INSERT INTO public.product_categories (name) VALUES
('Hardware'), ('Air Fryer'), ('Eletrodomésticos'), ('Moda'), ('Lifestyle')
ON CONFLICT (name) DO NOTHING;
