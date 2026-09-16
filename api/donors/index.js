import { getPool, initDb } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const pool = getPool();

  if (req.method === 'GET') {
    const { bloodType, region, district } = req.query;
    const client = await pool.connect();
    try {
      await initDb(client);
      let query = 'SELECT * FROM donors WHERE 1=1';
      const params = [];
      if (bloodType && bloodType !== 'All') { params.push(bloodType); query += ` AND LOWER(blood_type) = LOWER($${params.length})`; }
      if (region && region !== 'All') { params.push(region); query += ` AND LOWER(region) = LOWER($${params.length})`; }
      if (district && district.trim() !== '') { params.push(`%${district.trim().toLowerCase()}%`); query += ` AND LOWER(district) LIKE $${params.length}`; }
      query += ' ORDER BY full_name ASC';
      const result = await client.query(query, params);
      return res.json(result.rows.map(d => ({
        id: d.id, userId: d.user_id, fullName: d.full_name, email: d.email,
        phone: d.phone, bloodType: d.blood_type, region: d.region, district: d.district,
        availability: d.availability, donationsCount: d.donations_count, verified: d.verified, avatar: d.avatar
      })));
    } finally { client.release(); }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
