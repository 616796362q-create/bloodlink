import { Pool } from 'pg';

const DEFAULT_DB_URL = 'postgresql://neondb_owner:npg_aBDUodYO0J6t@ep-calm-pine-ax15nifa.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';
const connectionString = process.env.DATABASE_URL || DEFAULT_DB_URL;

let pool;
try {
  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
} catch (e) {
  console.error('Pool creation error:', e);
}

// In-memory fallback if DB is temporarily unreachable
const memoryDb = {
  users: [
    {
      id: 'usr-admin-1',
      fullName: 'Madahiye Administrator',
      email: 'Emre@gmail.com',
      phone: '+252 61 679 6362',
      password: '321',
      role: 'admin',
      isBlocked: false,
      createdAt: '2026-01-10'
    },
    {
      id: 'usr-1788855950147',
      fullName: 'qasim',
      email: 'qasim@gmail.com',
      phone: '616232323',
      password: '222222',
      role: 'donor',
      bloodType: 'AB+',
      region: 'Banaadir',
      district: 'hodan',
      isBlocked: false,
      createdAt: '2026-09-08'
    }
  ],
  donors: [
    {
      id: 'dnr-1788855950147',
      userId: 'usr-1788855950147',
      fullName: 'qasim',
      email: 'qasim@gmail.com',
      phone: '616232323',
      bloodType: 'AB+',
      region: 'Banaadir',
      district: 'hodan',
      availability: 'Available',
      donationsCount: 0,
      verified: true,
      avatar: null
    }
  ],
  receivers: [],
  requests: [],
  payments: [],
  notifications: []
};

let dbInitialized = false;

async function ensureDbInit() {
  if (dbInitialized || !pool) return;
  try {
    const client = await pool.connect();
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
        INSERT INTO users (id, full_name, email, phone, password, role, is_blocked)
        VALUES ('usr-admin-1', 'Madahiye Administrator', 'Emre@gmail.com', '+252 61 679 6362', '321', 'admin', false)
        ON CONFLICT (id) DO UPDATE SET password='321', email='Emre@gmail.com', full_name='Madahiye Administrator';

        INSERT INTO users (id, full_name, email, phone, password, role, blood_type, region, district, is_blocked)
        VALUES ('usr-1788855950147', 'qasim', 'qasim@gmail.com', '616232323', '222222', 'donor', 'AB+', 'Banaadir', 'hodan', false)
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO donors (id, user_id, full_name, email, phone, blood_type, region, district, availability, donations_count, verified)
        VALUES ('dnr-1788855950147', 'usr-1788855950147', 'qasim', 'qasim@gmail.com', '616232323', 'AB+', 'Banaadir', 'hodan', 'Available', 0, true)
        ON CONFLICT (id) DO NOTHING;
      `);
      dbInitialized = true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn('Neon DB init error (using memory fallback):', err.message);
  }
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await ensureDbInit();

  // Normalize path from URL
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = parsedUrl.pathname.replace(/^\/api/, '');
  if (!pathname.startsWith('/')) pathname = '/' + pathname;

  const method = req.method;
  const body = req.body || {};
  const query = Object.fromEntries(parsedUrl.searchParams.entries());

  try {
    // 1. HEALTH CHECK
    if (pathname === '/health' || pathname === '' || pathname === '/') {
      return res.json({
        status: 'ok',
        app: 'Madahiye BloodLink API (Vercel Serverless + Neon PostgreSQL)',
        database: pool ? 'Neon PostgreSQL' : 'Memory DB',
        timestamp: new Date()
      });
    }

    // 2. AUTH: REGISTER
    if (pathname === '/auth/register' && method === 'POST') {
      const { fullName, email, phone, password, role, bloodType, region, district } = body;
      const userEmail = String(email || `${(fullName || '').toLowerCase().replace(/\s+/g, '')}@gmail.com`).trim();

      if (!fullName || !password) {
        return res.status(400).json({ error: 'Full name and password are required' });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const userRole = role || 'donor';
      const userBloodType = bloodType || 'O+';
      const userRegion = region || 'Banaadir';
      const userDistrict = district || 'Hodan';
      const userId = 'usr-' + Date.now();
      const userPhone = phone || '';

      if (pool) {
        try {
          const client = await pool.connect();
          try {
            const check = await client.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [userEmail]);
            if (check.rows.length > 0) {
              return res.status(409).json({ error: 'An account already uses this email address' });
            }

            await client.query(
              `INSERT INTO users (id, full_name, email, phone, password, role, blood_type, region, district, is_blocked)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,false)`,
              [userId, fullName, userEmail, userPhone, password, userRole, userBloodType, userRegion, userDistrict]
            );

            let createdDonor = null;
            let createdReceiver = null;

            if (userRole === 'donor') {
              const donorId = 'dnr-' + Date.now();
              await client.query(
                `INSERT INTO donors (id, user_id, full_name, email, phone, blood_type, region, district, availability, donations_count, verified)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'Available',0,true)`,
                [donorId, userId, fullName, userEmail, userPhone, userBloodType, userRegion, userDistrict]
              );
              createdDonor = {
                id: donorId, userId, fullName, email: userEmail, phone: userPhone,
                bloodType: userBloodType, region: userRegion, district: userDistrict,
                availability: 'Available', donationsCount: 0, verified: true
              };
            } else {
              const rcvId = 'rcv-' + Date.now();
              await client.query(
                `INSERT INTO receivers (id, user_id, full_name, email, phone, blood_type_needed, region, district)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
                [rcvId, userId, fullName, userEmail, userPhone, userBloodType, userRegion, userDistrict]
              );
              createdReceiver = {
                id: rcvId, userId, fullName, email: userEmail, phone: userPhone,
                bloodTypeNeeded: userBloodType, region: userRegion, district: userDistrict
              };
            }

            return res.status(201).json({
              id: userId,
              fullName,
              email: userEmail,
              phone: userPhone,
              role: userRole,
              bloodType: userBloodType,
              region: userRegion,
              district: userDistrict,
              isBlocked: false,
              createdAt: new Date().toISOString().split('T')[0],
              donor: createdDonor,
              receiver: createdReceiver
            });
          } finally {
            client.release();
          }
        } catch (dbErr) {
          console.error('Register DB Error:', dbErr);
        }
      }

      // Fallback in-memory
      const newUser = {
        id: userId,
        fullName,
        email: userEmail,
        phone: userPhone,
        password,
        role: userRole,
        bloodType: userBloodType,
        region: userRegion,
        district: userDistrict,
        isBlocked: false,
        createdAt: new Date().toISOString().split('T')[0]
      };
      memoryDb.users.push(newUser);
      if (userRole === 'donor') {
        memoryDb.donors.push({
          id: 'dnr-' + Date.now(),
          userId,
          fullName,
          email: userEmail,
          phone: userPhone,
          bloodType: userBloodType,
          region: userRegion,
          district: userDistrict,
          availability: 'Available',
          donationsCount: 0,
          verified: true
        });
      }
      return res.status(201).json(newUser);
    }

    // 3. AUTH: LOGIN
    if (pathname === '/auth/login' && method === 'POST') {
      const { email, phone, password } = body;
      const identifier = String(email || phone || '').trim().toLowerCase();

      if (!identifier || !password) {
        return res.status(400).json({ error: 'Email/phone and password are required' });
      }

      if (pool) {
        try {
          const client = await pool.connect();
          try {
            const result = await client.query(
              `SELECT * FROM users WHERE LOWER(email) = $1 OR LOWER(phone) = $1`,
              [identifier]
            );
            const user = result.rows[0];
            if (user) {
              if (user.password !== password) {
                return res.status(401).json({ error: 'Invalid email/phone or password' });
              }
              if (user.is_blocked) {
                return res.status(403).json({ error: 'This account has been blocked. Contact BloodLink support.' });
              }
              return res.json({
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                bloodType: user.blood_type,
                region: user.region,
                district: user.district,
                isBlocked: user.is_blocked,
                createdAt: user.created_at
              });
            }
          } finally {
            client.release();
          }
        } catch (dbErr) {
          console.error('Login DB Error:', dbErr);
        }
      }

      // In-memory fallback check
      const memUser = memoryDb.users.find(u =>
        (u.email && u.email.toLowerCase() === identifier) ||
        (u.phone && u.phone.trim() === identifier)
      );
      if (!memUser || memUser.password !== password) {
        return res.status(401).json({ error: 'Invalid email/phone or password' });
      }
      const { password: _, ...safe } = memUser;
      return res.json(safe);
    }

    // 4. DONORS: LIST & SEARCH
    if (pathname === '/donors' && method === 'GET') {
      const { bloodType, region, district } = query;

      if (pool) {
        try {
          const client = await pool.connect();
          try {
            let q = 'SELECT * FROM donors WHERE 1=1';
            const params = [];
            if (bloodType && bloodType !== 'All') {
              params.push(bloodType);
              q += ` AND LOWER(blood_type) = LOWER($${params.length})`;
            }
            if (region && region !== 'All') {
              params.push(region);
              q += ` AND LOWER(region) = LOWER($${params.length})`;
            }
            if (district && district.trim() !== '') {
              params.push(`%${district.trim().toLowerCase()}%`);
              q += ` AND LOWER(district) LIKE $${params.length}`;
            }
            q += ' ORDER BY full_name ASC';
            const result = await client.query(q, params);
            return res.json(result.rows.map(d => ({
              id: d.id,
              userId: d.user_id,
              fullName: d.full_name,
              email: d.email,
              phone: d.phone,
              bloodType: d.blood_type,
              region: d.region,
              district: d.district,
              availability: d.availability || 'Available',
              donationsCount: d.donations_count || 0,
              verified: d.verified !== false,
              avatar: d.avatar || null
            })));
          } finally {
            client.release();
          }
        } catch (dbErr) {
          console.error('Donors DB Error:', dbErr);
        }
      }

      // Memory fallback
      let donors = memoryDb.donors;
      if (bloodType && bloodType !== 'All') donors = donors.filter(d => d.bloodType.toLowerCase() === bloodType.toLowerCase());
      if (region && region !== 'All') donors = donors.filter(d => d.region.toLowerCase() === region.toLowerCase());
      if (district && district.trim() !== '') donors = donors.filter(d => d.district.toLowerCase().includes(district.trim().toLowerCase()));
      return res.json(donors);
    }

    // 5. DONORS: SINGLE PROFILE
    const donorMatch = pathname.match(/^\/donors\/([^\/]+)$/);
    if (donorMatch && method === 'GET') {
      const donorId = donorMatch[1];
      if (pool) {
        try {
          const client = await pool.connect();
          try {
            const result = await client.query('SELECT * FROM donors WHERE id = $1 OR user_id = $1', [donorId]);
            if (result.rows.length > 0) {
              const d = result.rows[0];
              return res.json({
                id: d.id,
                userId: d.user_id,
                fullName: d.full_name,
                email: d.email,
                phone: d.phone,
                bloodType: d.blood_type,
                region: d.region,
                district: d.district,
                availability: d.availability || 'Available',
                donationsCount: d.donations_count || 0,
                verified: d.verified !== false,
                avatar: d.avatar || null
              });
            }
          } finally {
            client.release();
          }
        } catch (dbErr) {
          console.error('Donor Single Error:', dbErr);
        }
      }
      const donor = memoryDb.donors.find(d => d.id === donorId || d.userId === donorId);
      if (!donor) return res.status(404).json({ error: 'Donor not found' });
      return res.json(donor);
    }

    // 6. DONORS: AVAILABILITY TOGGLE
    const availMatch = pathname.match(/^\/donors\/([^\/]+)\/availability$/);
    if (availMatch && method === 'PATCH') {
      const donorId = availMatch[1];
      const { availability } = body;
      if (pool) {
        try {
          const client = await pool.connect();
          try {
            const result = await client.query(
              'UPDATE donors SET availability = $1 WHERE id = $2 OR user_id = $2 RETURNING *',
              [availability, donorId]
            );
            if (result.rows.length > 0) {
              const d = result.rows[0];
              return res.json({
                id: d.id, userId: d.user_id, fullName: d.full_name, availability: d.availability
              });
            }
          } finally {
            client.release();
          }
        } catch (e) {
          console.error('Availability Error:', e);
        }
      }
      return res.json({ id: donorId, availability });
    }

    // 7. REQUESTS: GET & CREATE
    if (pathname === '/requests' && method === 'GET') {
      if (pool) {
        try {
          const client = await pool.connect();
          try {
            const result = await client.query('SELECT * FROM blood_requests ORDER BY created_at DESC');
            return res.json(result.rows.map(r => ({
              id: r.id,
              receiverId: r.receiver_id,
              receiverName: r.receiver_name,
              receiverPhone: r.receiver_phone,
              donorId: r.donor_id,
              donorUserId: r.donor_user_id,
              donorName: r.donor_name,
              donorPhone: r.donor_phone,
              bloodType: r.blood_type,
              units: r.units,
              region: r.region,
              district: r.district,
              message: r.message,
              status: r.status,
              createdAt: r.created_at
            })));
          } finally {
            client.release();
          }
        } catch (e) {
          console.error('Requests GET error:', e);
        }
      }
      return res.json(memoryDb.requests);
    }

    if (pathname === '/requests' && method === 'POST') {
      const { receiverId, receiverName, receiverPhone, donorId, donorName, donorPhone, donorUserId, bloodType, units, region, district, message } = body;
      const reqId = 'req-' + Math.floor(100 + Math.random() * 900);
      const newReq = {
        id: reqId,
        receiverId: receiverId || 'usr-receiver-1',
        receiverName: receiverName || 'Anonymous',
        receiverPhone: receiverPhone || '',
        donorId: donorId || '',
        donorUserId: donorUserId || '',
        donorName: donorName || '',
        donorPhone: donorPhone || '',
        bloodType: bloodType || 'O+',
        units: parseInt(units) || 1,
        region: region || 'Banaadir',
        district: district || 'Hodan',
        message: message || 'Urgent blood request',
        status: 'Pending',
        createdAt: new Date().toISOString()
      };

      if (pool) {
        try {
          const client = await pool.connect();
          try {
            await client.query(
              `INSERT INTO blood_requests (id, receiver_id, receiver_name, receiver_phone, donor_id, donor_user_id, donor_name, donor_phone, blood_type, units, region, district, message, status)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'Pending')`,
              [newReq.id, newReq.receiverId, newReq.receiverName, newReq.receiverPhone, newReq.donorId, newReq.donorUserId, newReq.donorName, newReq.donorPhone, newReq.bloodType, newReq.units, newReq.region, newReq.district, newReq.message]
            );
          } finally {
            client.release();
          }
        } catch (e) {
          console.error('Requests POST DB error:', e);
        }
      }

      memoryDb.requests.unshift(newReq);
      return res.status(201).json({ request: newReq });
    }

    // 8. ADMIN STATS
    if (pathname === '/admin/stats' && method === 'GET') {
      if (pool) {
        try {
          const client = await pool.connect();
          try {
            const usersRes = await client.query('SELECT id, full_name, email, phone, role, blood_type, region, district, is_blocked, created_at FROM users ORDER BY created_at DESC');
            const donorsRes = await client.query('SELECT * FROM donors ORDER BY full_name ASC');
            const reqsRes = await client.query('SELECT * FROM blood_requests ORDER BY created_at DESC');

            const users = usersRes.rows.map(u => ({
              id: u.id, fullName: u.full_name, email: u.email, phone: u.phone, role: u.role,
              bloodType: u.blood_type, region: u.region, district: u.district, isBlocked: u.is_blocked, createdAt: u.created_at
            }));

            const donors = donorsRes.rows.map(d => ({
              id: d.id, userId: d.user_id, fullName: d.full_name, email: d.email, phone: d.phone,
              bloodType: d.blood_type, region: d.region, district: d.district, availability: d.availability, donationsCount: d.donations_count, verified: d.verified
            }));

            const requests = reqsRes.rows.map(r => ({
              id: r.id, receiverName: r.receiver_name, donorName: r.donor_name, bloodType: r.blood_type,
              units: r.units, region: r.region, district: r.district, status: r.status, createdAt: r.created_at
            }));

            return res.json({
              totalUsers: users.length,
              totalDonors: donors.length,
              totalReceivers: users.filter(u => u.role === 'receiver').length,
              activeRequests: requests.filter(r => r.status === 'Pending' || r.status === 'Accepted').length,
              completedRequests: requests.filter(r => r.status === 'Completed').length,
              totalRevenue: 0,
              users,
              donors,
              receivers: users.filter(u => u.role === 'receiver'),
              requests,
              payments: []
            });
          } finally {
            client.release();
          }
        } catch (e) {
          console.error('Admin Stats DB Error:', e);
        }
      }

      return res.json({
        totalUsers: memoryDb.users.length,
        totalDonors: memoryDb.donors.length,
        totalReceivers: memoryDb.receivers.length,
        activeRequests: memoryDb.requests.length,
        completedRequests: 0,
        totalRevenue: 0,
        users: memoryDb.users,
        donors: memoryDb.donors,
        receivers: memoryDb.receivers,
        requests: memoryDb.requests,
        payments: []
      });
    }

    // 9. ADMIN USER BLOCK / EDIT / DELETE
    const blockMatch = pathname.match(/^\/admin\/users\/([^\/]+)\/block$/);
    if (blockMatch && method === 'PATCH') {
      const uId = blockMatch[1];
      if (pool) {
        try {
          const client = await pool.connect();
          try {
            const result = await client.query('UPDATE users SET is_blocked = NOT is_blocked WHERE id = $1 RETURNING *', [uId]);
            if (result.rows[0]) return res.json({ id: uId, isBlocked: result.rows[0].is_blocked });
          } finally {
            client.release();
          }
        } catch (e) { console.error('Block DB Error:', e); }
      }
      return res.json({ success: true });
    }

    const userMatch = pathname.match(/^\/admin\/users\/([^\/]+)$/);
    if (userMatch && method === 'DELETE') {
      const uId = userMatch[1];
      if (pool) {
        try {
          const client = await pool.connect();
          try {
            await client.query('DELETE FROM donors WHERE user_id = $1', [uId]);
            await client.query('DELETE FROM users WHERE id = $1', [uId]);
          } finally {
            client.release();
          }
        } catch (e) { console.error('Delete DB Error:', e); }
      }
      return res.json({ success: true, deletedUserId: uId });
    }

    return res.status(404).json({ error: `Route ${pathname} not found` });
  } catch (globalErr) {
    console.error('Global API Handler Error:', globalErr);
    return res.status(500).json({ error: 'Internal server error: ' + globalErr.message });
  }
}
