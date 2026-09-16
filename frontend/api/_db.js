import { Pool } from 'pg';

let pool = null;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 1,
    });
  }
  return pool;
}

async function initDb(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(100) PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(50),
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'donor',
      blood_type VARCHAR(10) DEFAULT 'O+',
      region VARCHAR(100) DEFAULT 'Banaadir',
      district VARCHAR(100) DEFAULT 'Hodan',
      is_blocked BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS donors (
      id VARCHAR(100) PRIMARY KEY,
      user_id VARCHAR(100),
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
      user_id VARCHAR(100),
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(50),
      blood_type_needed VARCHAR(10),
      region VARCHAR(100),
      district VARCHAR(100)
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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    INSERT INTO users (id, full_name, email, phone, password, role, is_blocked)
    VALUES ('usr-admin-1', 'BloodLink Administrator', 'admin@gmail.com', '+252 61 000 0000', 'Admin@2026', 'admin', false)
    ON CONFLICT (id) DO NOTHING;
  `);
}

export { getPool, initDb };
