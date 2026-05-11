-- SQL Schema for Newsletter and Wishlist
-- Run this in your Supabase SQL Editor

-- Newsletter Table
CREATE TABLE IF NOT EXISTS public.newsletter_subs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wishlist Table
CREATE TABLE IF NOT EXISTS public.wishlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Banners Table (if not exists)
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    link_url TEXT DEFAULT '/',
    title TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.newsletter_subs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert newsletter" ON public.newsletter_subs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read newsletter" ON public.newsletter_subs FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage their own wishlist" ON public.wishlist 
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public read banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Admin manage banners" ON public.banners FOR ALL USING (auth.role() = 'authenticated');
