# Arquitetura do Projeto - Marketplace Premium

## 1. Visão Geral
O sistema utiliza uma arquitetura moderna baseada em **Next.js 16** com **React Server Components (RSC)** e **App Router**. O objetivo é maximizar o uso de entrega estática e server-side rendering para performance e SEO, enquanto mantém uma experiência de usuário rica com interações no lado do cliente via Framer Motion.

## 2. Tecnologias Core
- **Framework:** Next.js 16 (React 19+)
- **Styling:** Tailwind CSS v4 (Baseado em variáveis CSS nativas)
- **State Management:** 
  - **Server State:** TanStack Query (Caching e sincronização com Supabase)
  - **Client State:** Zustand (Carrinho, Favoritos, UI states)
- **Database/Backend:** Supabase (PostgreSQL + PostgREST + Realtime)
- **Auth:** Supabase Auth (JWT + Row Level Security)
- **Uploads:** Supabase Storage
- **Validação:** Zod + React Hook Form

## 3. Estrutura de Pastas (Modular)
- `/src/app`: Rotas e layouts principais.
- `/src/components`: Componentes reutilizáveis (UI, Layout, Home, etc.).
- `/src/lib`: Configurações de bibliotecas (Supabase, Utils, Fetchers).
- `/src/store`: Stores do Zustand para estado global.
- `/src/hooks`: Custom hooks para abstrair lógica de negócios e fetching.
- `/src/types`: Definições de tipos TypeScript compartilhados.

## 4. Estratégia de Deploy
O projeto está configurado para **Static Export** (`output: 'export'`), permitindo o deploy em provedores de hospedagem estática como **GitHub Pages**. Toda a lógica dinâmica é tratada no client-side consumindo as APIs do Supabase e Stripe.

## 5. Performance
- **Image Optimization:** Uso extensivo de `next/image` com webp e blur placeholders.
- **Code Splitting:** Dynamic imports para componentes pesados como gráficos do dashboard.
- **Data Fetching:** Abordagem de "Stale-While-Revalidate" via TanStack Query para evitar loadings desnecessários.
