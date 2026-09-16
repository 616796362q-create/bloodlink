import { getPool, initDb } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const pool = getPool();
  const client = await pool.connect();
  try {
    await initDb(client);

    const usersRes = await client.query('SELECT id, full_name, email, phone, role, blood_type, region, district, is_blocked, created_at FROM users ORDER BY created_at DESC');
    const donorsRes = await client.query('SELECT * FROM donors ORDER BY full_name ASC');
    const receiversRes = await client.query('SELECT * FROM receivers ORDER BY id DESC');
    const reqsRes = await client.query('SELECT * FROM blood_requests ORDER BY created_at DESC');

    const users = usersRes.rows.map(u => ({
      id: u.id,
      fullName: u.full_name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      bloodType: u.blood_type,
      region: u.region,
      district: u.district,
      isBlocked: u.is_blocked,
      createdAt: u.created_at
    }));

    const donors = donorsRes.rows.map(d => ({
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
    }));

    const receivers = receiversRes.rows.map(r => ({
      id: r.id,
      userId: r.user_id,
      fullName: r.full_name,
      email: r.email,
      phone: r.phone,
      bloodTypeNeeded: r.blood_type_needed,
      region: r.region,
      district: r.district
    }));

    const requests = reqsRes.rows.map(r => ({
      id: r.id,
      receiverId: r.receiver_id,
      receiverName: r.receiver_name,
      donorName: r.donor_name,
      donorPhone: r.donor_phone,
      bloodType: r.blood_type,
      units: r.units,
      region: r.region,
      district: r.district,
      message: r.message,
      status: r.status,
      createdAt: r.created_at
    }));

    return res.json({
      totalUsers: users.length,
      totalDonors: donors.length,
      totalReceivers: receivers.length,
      activeRequests: requests.filter(r => r.status === 'Pending' || r.status === 'Accepted').length,
      completedRequests: requests.filter(r => r.status === 'Completed').length,
      totalRevenue: 0,
      users,
      donors,
      receivers,
      requests,
      payments: []
    });
  } catch (err) {
    console.error('Admin Stats API Error:', err);
    return res.status(500).json({ error: 'Database admin stats error: ' + err.message });
  } finally {
    client.release();
  }
}
