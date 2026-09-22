const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_aBDUodYO0J6t@ep-calm-pine-ax15nifa.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    const users = await pool.query('SELECT id, full_name, email, phone, role FROM users');
    const donors = await pool.query('SELECT id, full_name, blood_type, phone FROM donors');
    console.log('--- NEON USERS ---');
    console.log(users.rows);
    console.log('--- NEON DONORS ---');
    console.log(donors.rows);
  } catch (e) {
    console.error('DB Check error:', e.message);
  } finally {
    await pool.end();
  }
}
main();
