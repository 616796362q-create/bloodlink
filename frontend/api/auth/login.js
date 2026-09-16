import { getPool, initDb } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, phone, password } = req.body;
  const identifier = String(email || phone || '').trim().toLowerCase();

  if (!identifier || !password) return res.status(400).json({ error: 'Email/phone and password are required' });

  const pool = getPool();
  const client = await pool.connect();
  try {
    await initDb(client);

    const result = await client.query(
      `SELECT * FROM users WHERE LOWER(email) = $1 OR LOWER(phone) = $1`,
      [identifier]
    );

    const user = result.rows[0];
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email/phone or password' });
    }
    if (user.is_blocked) {
      return res.status(403).json({ error: 'This account has been blocked. Contact BloodLink support.' });
    }

    const { password: _p, ...safeUser } = user;
    return res.json({
      id: safeUser.id,
      fullName: safeUser.full_name,
      email: safeUser.email,
      phone: safeUser.phone,
      role: safeUser.role,
      bloodType: safeUser.blood_type,
      region: safeUser.region,
      district: safeUser.district,
      isBlocked: safeUser.is_blocked,
      createdAt: safeUser.created_at
    });
  } finally {
    client.release();
  }
}
