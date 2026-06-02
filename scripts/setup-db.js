const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres:caiosobrinho10@db.fbehwchisjdvoligseap.supabase.co:5432/postgres';

async function runSQL(client, filename) {
  const filepath = path.join(__dirname, '..', filename);
  if (!fs.existsSync(filepath)) {
    console.log(`[SKIP] Arquivo não encontrado: ${filename}`);
    return;
  }
  const sql = fs.readFileSync(filepath, 'utf8');
  console.log(`[RUN] Executando ${filename}...`);
  try {
    await client.query(sql);
    console.log(`[SUCCESS] ${filename} executado.`);
  } catch (err) {
    console.error(`[ERROR] Erro ao executar ${filename}:`, err.message);
  }
}

async function seedProducts(client) {
  console.log(`[SEED] Preparando para inserir 40 produtos fictícios...`);
  
  // 1. Inserir Categorias Base
  const categoriesData = [
    { name: 'Eletrônicos', slug: 'eletronicos', description: 'Smartphones, TVs e Gadgets' },
    { name: 'Hardware & PC', slug: 'hardware', description: 'Peças e periféricos' },
    { name: 'Eletrodomésticos', slug: 'eletrodomesticos', description: 'Casa e Cozinha' },
    { name: 'Alimentos Fechados', slug: 'alimentos', description: 'Itens não-perecíveis e empacotados' }
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const res = await client.query(
      `INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
      [cat.name, cat.slug, cat.description]
    );
    categories[cat.slug] = res.rows[0].id;
  }

  // 2. Definir 40 produtos
  const productsData = [
    // Eletrônicos (10)
    { name: 'Smartphone Z-Fold Ultra', slug: 'z-fold-ultra', category_slug: 'eletronicos', price: 9999.90, promo_price: 8999.90, image: 'https://images.unsplash.com/photo-1598327105666-5b89351cb315' },
    { name: 'Fone Noise Cancelling Max', slug: 'fone-nc-max', category_slug: 'eletronicos', price: 1599.90, promo_price: 1299.90, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb' },
    { name: 'Smart TV 65" 4K OLED', slug: 'tv-65-oled', category_slug: 'eletronicos', price: 5499.00, promo_price: 4999.00, image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6' },
    { name: 'Caixa de Som Portátil Pro', slug: 'caixa-som-pro', category_slug: 'eletronicos', price: 899.00, promo_price: null, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1' },
    { name: 'Tablet Drawing Tab 11"', slug: 'tablet-draw-11', category_slug: 'eletronicos', price: 3499.00, promo_price: 3199.00, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0' },
    { name: 'Relógio Smart Sport', slug: 'smartwatch-sport', category_slug: 'eletronicos', price: 1299.90, promo_price: 1099.90, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a' },
    { name: 'Drone 4K Pro X', slug: 'drone-4k', category_slug: 'eletronicos', price: 4500.00, promo_price: null, image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f' },
    { name: 'Câmera Mirrorless 24MP', slug: 'camera-mirrorless', category_slug: 'eletronicos', price: 7999.00, promo_price: 7500.00, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32' },
    { name: 'Controle Universal Smart', slug: 'controle-smart', category_slug: 'eletronicos', price: 299.00, promo_price: 199.00, image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086' },
    { name: 'Microfone Condensador Studio', slug: 'mic-condensador', category_slug: 'eletronicos', price: 699.90, promo_price: null, image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc' },

    // Hardware & PC (10)
    { name: 'Placa de Vídeo RTX 4090', slug: 'rtx-4090', category_slug: 'hardware', price: 14999.90, promo_price: 13999.90, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704' },
    { name: 'Processador i9 14900K', slug: 'i9-14900k', category_slug: 'hardware', price: 3999.00, promo_price: 3799.00, image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea' },
    { name: 'Monitor Gamer Ultrawide 34"', slug: 'monitor-ultrawide-34', category_slug: 'hardware', price: 2899.90, promo_price: 2599.90, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf' },
    { name: 'Teclado Mecânico RGB Switch Red', slug: 'teclado-mecanico', category_slug: 'hardware', price: 549.90, promo_price: 499.90, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212' },
    { name: 'Mouse Gamer 25K DPI', slug: 'mouse-gamer-25k', category_slug: 'hardware', price: 399.90, promo_price: 299.90, image: 'https://images.unsplash.com/photo-1527814050087-379381547330' },
    { name: 'Memória RAM 32GB DDR5 6000MHz', slug: 'ram-32gb-ddr5', category_slug: 'hardware', price: 1299.00, promo_price: null, image: 'https://images.unsplash.com/photo-1562976540-1502f714426d' },
    { name: 'SSD NVMe 2TB Gen4', slug: 'ssd-2tb-nvme', category_slug: 'hardware', price: 999.90, promo_price: 849.90, image: 'https://images.unsplash.com/photo-1628557044797-f21a177c37ec' },
    { name: 'Gabinete Aquário Vidro Temperado', slug: 'gabinete-aquario', category_slug: 'hardware', price: 799.00, promo_price: 699.00, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7' },
    { name: 'Water Cooler 360mm Display LCD', slug: 'water-cooler-360', category_slug: 'hardware', price: 1199.90, promo_price: 999.90, image: 'https://images.unsplash.com/photo-1555617781-a987114b76db' },
    { name: 'Fonte 850W 80 Plus Gold Modular', slug: 'fonte-850w-gold', category_slug: 'hardware', price: 899.90, promo_price: null, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704' },

    // Eletrodomésticos (10)
    { name: 'Geladeira Inverse Inox 400L', slug: 'geladeira-inverse', category_slug: 'eletrodomesticos', price: 3499.00, promo_price: 3199.00, image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7' },
    { name: 'Máquina de Lavar 12kg Frontal', slug: 'maquina-lavar-12kg', category_slug: 'eletrodomesticos', price: 2899.00, promo_price: 2599.00, image: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c' },
    { name: 'Micro-ondas 32L Espelhado', slug: 'micro-ondas-32l', category_slug: 'eletrodomesticos', price: 799.00, promo_price: 699.00, image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078' },
    { name: 'Air Fryer Digital 5L', slug: 'air-fryer-5l', category_slug: 'eletrodomesticos', price: 549.90, promo_price: 499.90, image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1' },
    { name: 'Aspirador Robô Inteligente Wi-Fi', slug: 'aspirador-robo', category_slug: 'eletrodomesticos', price: 1499.00, promo_price: 1299.00, image: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73' },
    { name: 'Cafeteira Expresso Automática', slug: 'cafeteira-expresso', category_slug: 'eletrodomesticos', price: 1999.00, promo_price: null, image: 'https://images.unsplash.com/photo-1517502474163-fdf46797cc24' },
    { name: 'Ar Condicionado Split Inverter 12000 BTUs', slug: 'ar-condicionado-12k', category_slug: 'eletrodomesticos', price: 2199.00, promo_price: 1999.00, image: 'https://images.unsplash.com/photo-1616422285623-1100f91bc9db' },
    { name: 'Purificador de Água Refrigerado', slug: 'purificador-agua', category_slug: 'eletrodomesticos', price: 899.90, promo_price: 799.90, image: 'https://images.unsplash.com/photo-1549468057-5b7fa1a41d7a' },
    { name: 'Liquidificador Turbo 1000W', slug: 'liquidificador-turbo', category_slug: 'eletrodomesticos', price: 199.90, promo_price: 149.90, image: 'https://images.unsplash.com/photo-1585237989396-7bb2377b213c' },
    { name: 'Fogão 4 Bocas Mesa de Vidro', slug: 'fogao-4-bocas', category_slug: 'eletrodomesticos', price: 1299.00, promo_price: 1099.00, image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d' },

    // Alimentos Fechados (10)
    { name: 'Ketchup Hellmann\'s Pote 1Kg', slug: 'ketchup-hellmanns-1kg', category_slug: 'alimentos', price: 34.90, promo_price: 29.90, image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a' },
    { name: 'Café Especial Torrado em Grãos 1Kg', slug: 'cafe-graos-1kg', category_slug: 'alimentos', price: 89.90, promo_price: 79.90, image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7' },
    { name: 'Nutella Pote Grande 650g', slug: 'nutella-650g', category_slug: 'alimentos', price: 54.90, promo_price: 45.90, image: 'https://images.unsplash.com/photo-1601002360497-2bb65c404df3' },
    { name: 'Caixa de Energético Red Bull (24 latas)', slug: 'energetico-redbull-24', category_slug: 'alimentos', price: 189.90, promo_price: 159.90, image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e' },
    { name: 'Whey Protein Isolado 900g', slug: 'whey-protein-900g', category_slug: 'alimentos', price: 169.90, promo_price: null, image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9' },
    { name: 'Pasta de Amendoim Integral 1Kg', slug: 'pasta-amendoim-1kg', category_slug: 'alimentos', price: 39.90, promo_price: 34.90, image: 'https://images.unsplash.com/photo-1558288599-e60dffafc6c2' },
    { name: 'Chocolate Importado Lindt 100g', slug: 'chocolate-lindt', category_slug: 'alimentos', price: 29.90, promo_price: 24.90, image: 'https://images.unsplash.com/photo-1511381939415-e440c9c4f529' },
    { name: 'Azeite Extra Virgem Importado 500ml', slug: 'azeite-importado-500ml', category_slug: 'alimentos', price: 45.90, promo_price: 39.90, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5' },
    { name: 'Mel Puro de Abelha 1Kg', slug: 'mel-puro-1kg', category_slug: 'alimentos', price: 49.90, promo_price: 44.90, image: 'https://images.unsplash.com/photo-1587049352847-4d4b1ed74dd7' },
    { name: 'Biscoito Importado Amanteigado Lata 454g', slug: 'biscoito-amanteigado', category_slug: 'alimentos', price: 79.90, promo_price: null, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35' }
  ];

  for (let i = 0; i < productsData.length; i++) {
    const p = productsData[i];
    const catId = categories[p.category_slug];
    if (!catId) continue;

    const sku = `SKU-${p.slug.toUpperCase()}`;
    
    const productQuery = `
      INSERT INTO products (name, slug, sku, price, promo_price, category_id, stock_quantity, short_description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (slug) DO UPDATE SET 
        name = EXCLUDED.name, price = EXCLUDED.price, promo_price = EXCLUDED.promo_price
      RETURNING id
    `;
    const res = await client.query(productQuery, [
      p.name, p.slug, sku, p.price, p.promo_price, catId, 50, `Explore o melhor em ${p.name}`
    ]);
    
    const productId = res.rows[0].id;

    // Inserir na tabela product_images
    await client.query(`INSERT INTO product_images (product_id, url, is_main) VALUES ($1, $2, true)`, [productId, p.image]);

    console.log(`[+] Produto inserido: ${p.name}`);
  }
}

async function main() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  console.log('[INFO] Conectado ao banco de dados Supabase');

  // Rodar Schemas em Ordem
  await runSQL(client, 'supabase/schema.sql');
  await runSQL(client, 'supabase_categories.sql');
  await runSQL(client, 'supabase_missing_tables.sql');
  await runSQL(client, 'loyalty_schema.sql');
  await runSQL(client, 'product_reviews_schema.sql');
  await runSQL(client, 'supabase_site_content.sql');

  // Popular Produtos
  await seedProducts(client);

  await client.end();
  console.log('[INFO] Banco de dados inicializado e populado com sucesso!');
}

main().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
