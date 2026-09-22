import { getPool, initDb } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const pool = getPool();

  if (req.method === 'GET') {
    const client = await pool.connect();
    try {
      await initDb(client);
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
    } catch (err) {
      console.error('Fetch Requests API Error:', err);
      return res.status(500).json({ error: 'Database fetch requests error: ' + err.message });
    } finally {
      client.release();
    }
  }

  if (req.method === 'POST') {
    const { receiverId, receiverName, receiverPhone, donorId, donorName, donorPhone, donorUserId, bloodType, units, region, district, message } = req.body || {};
    const reqId = 'req-' + Math.floor(100 + Math.random() * 900);
    const client = await pool.connect();
    try {
      await initDb(client);
      await client.query(
        `INSERT INTO blood_requests (id, receiver_id, receiver_name, receiver_phone, donor_id, donor_user_id, donor_name, donor_phone, blood_type, units, region, district, message, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'Pending')`,
        [reqId, receiverId || 'usr-1', receiverName || 'Anonymous', receiverPhone || '', donorId || '', donorUserId || '', donorName || '', donorPhone || '', bloodType || 'O+', parseInt(units) || 1, region || 'Banaadir', district || 'Hodan', message || 'Urgent request']
      );
      return res.status(201).json({
        request: {
          id: reqId,
          receiverId, receiverName, receiverPhone,
          donorId, donorName, donorPhone,
          bloodType, units, region, district, message,
          status: 'Pending',
          createdAt: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error('Create Request API Error:', err);
      return res.status(500).json({ error: 'Database create request error: ' + err.message });
    } finally {
      client.release();
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
