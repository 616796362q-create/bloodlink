import { getPool, initDb } from '../../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const pool = getPool();
  const { id } = req.query;

  if (req.method === 'GET') {
    const client = await pool.connect();
    try {
      await initDb(client);
      const result = await client.query('SELECT * FROM donors WHERE id = $1 OR user_id = $1', [id]);
      if (!result.rows[0]) return res.status(404).json({ error: 'Donor not found' });
      const d = result.rows[0];
      return res.json({
        id: d.id, userId: d.user_id, fullName: d.full_name, email: d.email,
        phone: d.phone, bloodType: d.blood_type, region: d.region, district: d.district,
        availability: d.availability, donationsCount: d.donations_count, verified: d.verified, avatar: d.avatar
      });
    } finally { client.release(); }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
