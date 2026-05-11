# Fluxo do Usuário - Marketplace Premium

## 1. Jornada de Compra (Padrão)
1. **Landing:** O usuário chega na Home, visualiza banners e produtos em destaque.
2. **Descoberta:** Utiliza a busca global ou navega pelas categorias.
3. **Seleção:** Clica em um produto, visualiza detalhes, avaliações e escolhe variações.
4. **Conversão:** Adiciona ao carrinho. O carrinho é persistido localmente.
5. **Checkout:**
   - Se deslogado: Solicita Login/Cadastro.
   - Seleção de endereço de entrega.
   - Escolha de método de pagamento (PIX recebe desconto automático).
6. **Confirmação:** Página de sucesso com número do pedido e resumo.

## 2. Jornada do Administrador
1. **Login:** Acesso via rota `/dashboard` restrito a roles 'admin' no Supabase.
2. **Monitoramento:** Visualização de estatísticas em tempo real (Vendas, Pedidos, Clientes).
3. **Gestão:**
   - Cadastro e edição de produtos e estoques.
   - Alteração de status de pedidos (Processando -> Enviado).
   - Gestão de cupons e banners promocionais.
4. **Análise:** Visualização de logs de auditoria e métricas de conversão.

## 3. Gestão de Conta
- O usuário pode gerenciar seus endereços, formas de pagamento e visualizar histórico de pedidos.
- Sistema de favoritos (Desejos) estilo Instagram para salvar produtos para depois.
