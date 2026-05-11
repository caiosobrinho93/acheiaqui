# AI_CONTEXT - Marketplace Premium

## Visão Geral do Projeto
Marketplace full-stack, escalável, performático, inspirado no Mercado Livre, Shopee, Amazon e Temu. 
Tema dark premium com neon verde-limão. Construído para operar com PWA e extrema performance.

## Arquitetura
Frontend:
- Next.js 16 (App Router)
- React Server Components
- Static Export para GitHub Pages
- Tailwind CSS v4 + shadcn/ui
- Zustand para estado global
- TanStack Query para server state e cache

Backend (Serverless):
- Supabase (PostgreSQL, Auth, Storage, Edge Functions)

Pagamentos:
- Stripe (Cartão) e Mercado Pago/Stripe (PIX)

## Componentes
- `Header`: Sticky com navegação principal e mega menu
- `ProductCard`: Com shimmer effect, hover de imagem
- `CartDrawer`: Sidebar com os itens e mini-checkout
- `NeonButton`: Componente base de ação com o glow verde-limão característico
- `DataTable`: Para o dashboard administrativo, com paginação e ordenação

## Regras de Negócio
- Preços variam de acordo com desconto PIX x Cartão.
- Cupons têm lógicas restritas (por valor, uso, validade, categoria).
- Permissão via Supabase RLS (Apenas administradores podem ver o dashboard e alterar inventário).

## Estrutura do Banco (Supabase)
Tabelas:
- `profiles`, `addresses`
- `categories`, `brands`, `products`, `product_images`, `product_variants`
- `inventory`
- `carts`, `cart_items`, `wishlists`
- `coupons`, `coupon_usages`
- `orders`, `order_items`, `payments`
- `reviews`, `banners`, `settings`, `notifications`, `support_tickets`, `audit_logs`

## Fluxos
- **Usuário**: Acessa -> Busca -> Adiciona ao Carrinho -> Login/Cadastro -> Checkout -> Sucesso -> Pedidos
- **Admin**: Dashboard -> Gerencia Produtos/Categorias/Pedidos/Cupons -> Exportações e Configurações

## Convenções
- Tipagem estrita com TypeScript e validação de schemas com Zod.
- Componentes modulares, preferindo composição à herança de props extensas.
- Animações via Framer Motion sem exageros (respeitando prefers-reduced-motion).

## Padrões Visuais
- Dark mode nativo com backgrounds `#050505`.
- Acentos Neon Lime (`#C6FF00`), Cyan (`#00F7FF`) e Purple (`#7C3AED`).
- Border com `rgba(255,255,255,0.06)`.
- Sombras com glow de neon (ex: `0 0 10px rgba(198,255,0,.35)`).

## Integrações
- Supabase Auth (Google, GitHub, Email)
- Stripe (Pagamento)
- PostHog / Google Analytics (Analytics)
- Resend (E-mail)

Esta arquitetura busca maximizar performance (LCP < 1.5s, Performance Lighthouse 100), SEO e a experiência premium mobile-first.
