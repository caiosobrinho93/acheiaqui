const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:caiosobrinho10@db.fbehwchisjdvoligseap.supabase.co:5432/postgres', ssl: { rejectUnauthorized: false } });

async function run() {
  await client.connect();
  const queries = [
    `CREATE POLICY "Admins can do everything on products" ON products FOR ALL USING (auth.jwt() ->> 'email' = 'caiojos@gmail.com');`,
    `CREATE POLICY "Admins can do everything on categories" ON categories FOR ALL USING (auth.jwt() ->> 'email' = 'caiojos@gmail.com');`,
    `CREATE POLICY "Admins can do everything on orders" ON orders FOR ALL USING (auth.jwt() ->> 'email' = 'caiojos@gmail.com');`,
    `CREATE POLICY "Admins can do everything on banners" ON banners FOR ALL USING (auth.jwt() ->> 'email' = 'caiojos@gmail.com');`,
    `CREATE POLICY "Admins can do everything on product_images" ON product_images FOR ALL USING (auth.jwt() ->> 'email' = 'caiojos@gmail.com');`,
    `CREATE POLICY "Admins can read newsletter" ON newsletter_subs FOR ALL USING (auth.jwt() ->> 'email' = 'caiojos@gmail.com');`
  ];
  
  for (const q of queries) {
    try {
      await client.query(q);
      console.log('Policy created.');
    } catch (e) {
      console.log('Skipping policy:', e.message);
    }
  }
  await client.end();
}
run().catch(console.error);
