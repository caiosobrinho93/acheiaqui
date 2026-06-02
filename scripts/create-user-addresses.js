const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:caiosobrinho10@db.fbehwchisjdvoligseap.supabase.co:5432/postgres', ssl: { rejectUnauthorized: false } });

async function run() {
  await client.connect();
  const queries = [
    `CREATE TABLE IF NOT EXISTS user_addresses (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
      nome TEXT,
      cep TEXT,
      cidade TEXT,
      rua TEXT,
      numero TEXT,
      bairro TEXT,
      complemento TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );`,
    `ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;`,
    `DROP POLICY IF EXISTS "Users can view own addresses" ON user_addresses;`,
    `DROP POLICY IF EXISTS "Users can insert own addresses" ON user_addresses;`,
    `CREATE POLICY "Users can view own addresses" ON user_addresses FOR SELECT USING (auth.uid() = user_id);`,
    `CREATE POLICY "Users can insert own addresses" ON user_addresses FOR INSERT WITH CHECK (auth.uid() = user_id);`
  ];
  
  for (const q of queries) {
    try {
      await client.query(q);
      console.log('Query OK');
    } catch (e) {
      console.error('Error:', e.message);
    }
  }
  await client.end();
}
run().catch(console.error);
