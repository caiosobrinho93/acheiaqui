-- AcheiAqui Reviews & Ratings Logic
-- Rodar este script no SQL Editor do Supabase

-- 1. Garantir que a tabela de reviews tenha as políticas corretas
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública
DROP POLICY IF EXISTS "Allow public read reviews" ON public.reviews;
CREATE POLICY "Allow public read reviews" ON public.reviews
    FOR SELECT USING (true);

-- Permitir inserção apenas para usuários logados
DROP POLICY IF EXISTS "Allow authenticated to insert reviews" ON public.reviews;
CREATE POLICY "Allow authenticated to insert reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. Função para recalcular a nota média do produto automaticamente
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM reviews
        WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) AND is_active = true
    )
    WHERE id = COALESCE(NEW.product_id, OLD.product_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Trigger para disparar a função em qualquer mudança na tabela reviews
DROP TRIGGER IF EXISTS tr_update_product_rating ON reviews;
CREATE TRIGGER tr_update_product_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating();
