const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:caiosobrinho10@db.fbehwchisjdvoligseap.supabase.co:5432/postgres', ssl: { rejectUnauthorized: false } });
async function run() {
  await client.connect();
  const res = await client.query('SELECT p.id, p.name, i.id as img_id FROM products p JOIN product_images i ON p.id = i.product_id');
  for (const row of res.rows) {
    const prompt = encodeURIComponent('Product photography of ' + row.name + ', clean studio lighting, white background, high quality, 4k');
    const url = 'https://image.pollinations.ai/prompt/' + prompt + '?width=800&height=800&nologo=true';
    await client.query('UPDATE product_images SET url = $1 WHERE id = $2', [url, row.img_id]);
    console.log('Updated:', row.name);
  }
  await client.end();
}
run().catch(console.error);
