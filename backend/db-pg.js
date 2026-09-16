require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

let pool = null;

if (connectionString && connectionString.startsWith('postgres')) {
  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  pool.on('error', (err) => {
    console.warn('⚠️ [Neon PG Connection Reset Handled]', err.message);
  });

  // Auto-initialize Neon PostgreSQL tables
  const initDb = async () => {
    try {
      const client = await pool.connect();
      console.log('⚡ Connected successfully to Neon PostgreSQL database!');
      
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(100) PRIMARY KEY,
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(50),
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'donor',
          is_blocked BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS donors (
          id VARCHAR(100) PRIMARY KEY,
          user_id VARCHAR(100) REFERENCES users(id) ON DELETE CASCADE,
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          phone VARCHAR(50),
          blood_type VARCHAR(10) NOT NULL,
          region VARCHAR(100) NOT NULL,
          district VARCHAR(100) NOT NULL,
          availability VARCHAR(50) DEFAULT 'Available',
          donations_count INT DEFAULT 0,
          verified BOOLEAN DEFAULT true,
          avatar TEXT
        );

        CREATE TABLE IF NOT EXISTS receivers (
          id VARCHAR(100) PRIMARY KEY,
          user_id VARCHAR(100) REFERENCES users(id) ON DELETE CASCADE,
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          phone VARCHAR(50),
          blood_type_needed VARCHAR(10) NOT NULL,
          region VARCHAR(100) NOT NULL,
          district VARCHAR(100) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS blood_requests (
          id VARCHAR(100) PRIMARY KEY,
          receiver_id VARCHAR(100),
          receiver_name VARCHAR(255),
          receiver_phone VARCHAR(50),
          donor_id VARCHAR(100),
          donor_user_id VARCHAR(100),
          donor_name VARCHAR(255),
          donor_phone VARCHAR(50),
          blood_type VARCHAR(10),
          units INT DEFAULT 1,
          region VARCHAR(100),
          district VARCHAR(100),
          message TEXT,
          status VARCHAR(50) DEFAULT 'Pending',
          fee_paid NUMERIC(10,2) DEFAULT 3.00,
          payment_method VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS payments (
          id VARCHAR(100) PRIMARY KEY,
          request_id VARCHAR(100),
          receiver_name VARCHAR(255),
          donor_name VARCHAR(255),
          amount NUMERIC(10,2) DEFAULT 3.00,
          method VARCHAR(100),
          transaction_ref VARCHAR(100),
          status VARCHAR(50) DEFAULT 'Success',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Ensure Admin user exists in Neon Postgres
      await client.query(`
        INSERT INTO users (id, full_name, email, phone, password, role, is_blocked)
        VALUES ('usr-admin-1', 'BloodLink Administrator', 'admin@gmail.com', '+252 61 000 0000', 'Admin@2026', 'admin', false)
        ON CONFLICT (id) DO NOTHING;
      `);

      client.release();
      console.log('✅ Neon PostgreSQL tables initialized successfully.');
    } catch (err) {
      console.error('❌ Failed to connect to Neon PostgreSQL:', err.message);
    }
  };

  initDb();
} else {
  console.log('ℹ️ DATABASE_URL not set in backend/.env. Falling back to local JSON db.json.');
}

module.exports = {
  pool,
  isPgConnected: () => !!pool
};
