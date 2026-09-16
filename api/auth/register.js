import { getPool, initDb } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const pool = getPool();

  if (req.method === 'POST') {
    // REGISTER
    const { fullName, email, phone, password, role, bloodType, region, district } = req.body;
    const userEmail = String(email || `${(fullName||'').toLowerCase().replace(/\s+/g, '')}@gmail.com`).trim();

    if (!fullName || !password) return res.status(400).json({ error: 'Full name and password are required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    if (!['donor', 'receiver'].includes(role || 'donor')) return res.status(400).json({ error: 'Invalid account role' });

    const client = await pool.connect();
    try {
      await initDb(client);

      const existing = await client.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [userEmail]);
      if (existing.rows.length > 0) return res.status(409).json({ error: 'An account already uses this email address' });

      const userId = 'usr-' + Date.now();
      const userRole = role || 'donor';
      const userBloodType = bloodType || 'O+';
      const userRegion = region || 'Banaadir';
      const userDistrict = district || 'Hodan';

      await client.query(
        `INSERT INTO users (id, full_name, email, phone, password, role, blood_type, region, district, is_blocked)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,false)`,
        [userId, fullName, userEmail, phone || '', password, userRole, userBloodType, userRegion, userDistrict]
      );

      let donor = null, receiver = null;

      if (userRole === 'donor') {
        const donorId = 'dnr-' + Date.now();
        await client.query(
          `INSERT INTO donors (id, user_id, full_name, email, phone, blood_type, region, district, availability, donations_count, verified)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'Available',0,true)`,
          [donorId, userId, fullName, userEmail, phone || '', userBloodType, userRegion, userDistrict]
        );
        donor = { id: donorId, userId, fullName, email: userEmail, phone: phone || '', bloodType: userBloodType, region: userRegion, district: userDistrict, availability: 'Available', donationsCount: 0, verified: true };
      } else if (userRole === 'receiver') {
        const rcvId = 'rcv-' + Date.now();
        await client.query(
          `INSERT INTO receivers (id, user_id, full_name, email, phone, blood_type_needed, region, district)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [rcvId, userId, fullName, userEmail, phone || '', userBloodType, userRegion, userDistrict]
        );
        receiver = { id: rcvId, userId, fullName, email: userEmail, phone: phone || '', bloodTypeNeeded: userBloodType, region: userRegion, district: userDistrict };
      }

      return res.status(201).json({
        id: userId, fullName, email: userEmail, phone: phone || '',
        role: userRole, bloodType: userBloodType, region: userRegion, district: userDistrict,
        isBlocked: false, createdAt: new Date().toISOString().split('T')[0],
        donor, receiver
      });
    } finally {
      client.release();
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
