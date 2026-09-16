import { Pool } from 'pg';

const DEFAULT_DB_URL = 'postgresql://neondb_owner:npg_aBDUodYO0J6t@ep-calm-pine-ax15nifa.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';
const connectionString = process.env.DATABASE_URL || DEFAULT_DB_URL;

let pool = null;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 8000,
    });
  }
  return pool;
}

async function initDb(client) {
  try {
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

      -- Admin User
      INSERT INTO users (id, full_name, email, phone, password, role, is_blocked)
      VALUES ('usr-admin-1', 'Madahiye Administrator', 'Emre@gmail.com', '+252 61 679 6362', '321', 'admin', false)
      ON CONFLICT (id) DO UPDATE SET password='321', email='Emre@gmail.com', full_name='Madahiye Administrator';

      -- Seed 4 Verified Donors into Users and Donors Tables
      INSERT INTO users (id, full_name, email, phone, password, role, blood_type, region, district, is_blocked)
      VALUES 
        ('usr-dnr-1', 'Qasim Cali', 'qasim@gmail.com', '+252 61 623 2323', '222222', 'donor', 'AB+', 'Banaadir', 'Hodan', false),
        ('usr-dnr-2', 'Dr. Farhiya Axmed', 'farhiya@gmail.com', '+252 61 555 1234', 'password123', 'donor', 'O+', 'Banaadir', 'Wadajir', false),
        ('usr-dnr-3', 'Maxamed Xasan', 'maxamed@gmail.com', '+252 61 777 8899', 'password123', 'donor', 'A+', 'Banaadir', 'Yaaqshiid', false),
        ('usr-dnr-4', 'Sahra Cumar', 'sahra@gmail.com', '+252 61 888 4433', 'password123', 'donor', 'B+', 'Banaadir', 'Howlwadaag', false)
      ON CONFLICT (id) DO NOTHING;

      INSERT INTO donors (id, user_id, full_name, email, phone, blood_type, region, district, availability, donations_count, verified)
      VALUES 
        ('dnr-1', 'usr-dnr-1', 'Qasim Cali', 'qasim@gmail.com', '+252 61 623 2323', 'AB+', 'Banaadir', 'Hodan', 'Available', 3, true),
        ('dnr-2', 'usr-dnr-2', 'Dr. Farhiya Axmed', 'farhiya@gmail.com', '+252 61 555 1234', 'O+', 'Banaadir', 'Wadajir', 'Available', 5, true),
        ('dnr-3', 'usr-dnr-3', 'Maxamed Xasan', 'maxamed@gmail.com', '+252 61 777 8899', 'A+', 'Banaadir', 'Yaaqshiid', 'Available', 2, true),
        ('dnr-4', 'usr-dnr-4', 'Sahra Cumar', 'sahra@gmail.com', '+252 61 888 4433', 'B+', 'Banaadir', 'Howlwadaag', 'Available', 4, true)
      ON CONFLICT (id) DO NOTHING;
    `);
  } catch (e) {
    console.error('initDb error:', e.message);
  }
}

export { getPool, initDb };
