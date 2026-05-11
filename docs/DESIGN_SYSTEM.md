# DESIGN SYSTEM - Marketplace Premium

## 1. Visão Geral
Estética baseada em plataformas de alta performance e dark mode premium, com uma paleta agressiva de verde-limão e fundos profundos para causar impacto e clareza visual.

## 2. Tipografia
- **Títulos e Headings:** `Space Grotesk` - Para passar um ar tech, moderno e geométrico.
- **Corpo do Texto e UI:** `Inter` - Limpa, excelente legibilidade em tamanhos menores e alta densidade de dados.

## 3. Cores
### Background
- **Background Principal:** `#050505`
- **Surface 1:** `#0B0B0B` (cards, containers secundários)
- **Surface 2:** `#121212` (hover states, dropdowns)

### Primárias e Acentos
- **Neon Lime (Primary):** `#C6FF00` (CTAs primários, badges de destaque)
- **Primary Hover:** `#D4FF33`
- **Cyan (Accent):** `#00F7FF`
- **Purple (Accent):** `#7C3AED`

### Textos
- **Text Primary:** `#FFFFFF` (100% branco para contraste)
- **Text Secondary:** `#A1A1AA` (zinc-400)
- **Text Muted:** `#71717A` (zinc-500)

### Feedback
- **Danger:** `#EF4444`
- **Success:** `#22C55E`
- **Warning:** `#F59E0B`

### Bordas e Divisores
- **Padrão:** `rgba(255, 255, 255, 0.06)`

## 4. Efeitos e Glow
- **Glow Suave:** `0 0 10px rgba(198,255,0,.35)`
- **Glow Forte:** `0 0 20px rgba(198,255,0,.20)`
- **Sombra Glass:** Soft shadows para simular elevação sutil sem sujar o fundo.

## 5. Geometria e Formas
- **Cards e Containers:** Border-radius `24px`
- **Botões e Inputs:** Border-radius `16px`

## 6. Animações e Micro-interações
- Usar Transições CSS e Framer Motion.
- Elementos não devem piscar agressivamente; o glow surge na interação (`focus`, `hover` no desktop, `active` no mobile).
- Carregamentos feitos via skeleton screens (shimmer animation com cores do `Surface 2`).
