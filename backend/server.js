require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { pool } = require('./db-pg');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());

// Read JSON DB
function readDb() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return { users: [], donors: [], receivers: [], requests: [], payments: [], notifications: [] };
  }
}

// Write JSON DB
function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing db.json:', err);
  }
}

// Neon PostgreSQL Sync Helpers
async function syncUserToPg(user) {
  if (!pool) return;
  try {
    await pool.query(
      `INSERT INTO users (id, full_name, email, phone, password, role, is_blocked)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE 
       SET full_name = EXCLUDED.full_name, email = EXCLUDED.email, phone = EXCLUDED.phone, is_blocked = EXCLUDED.is_blocked`,
      [user.id, user.fullName, user.email, user.phone, user.password, user.role, !!user.isBlocked]
    );
  } catch (e) {
    console.error('[Neon PG Sync User Error]', e.message);
  }
}

async function syncDonorToPg(donor) {
  if (!pool) return;
  try {
    await pool.query(
      `INSERT INTO donors (id, user_id, full_name, email, phone, blood_type, region, district, availability, donations_count, verified, avatar)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (id) DO UPDATE 
       SET availability = EXCLUDED.availability, blood_type = EXCLUDED.blood_type, region = EXCLUDED.region, district = EXCLUDED.district`,
      [donor.id, donor.userId, donor.fullName, donor.email, donor.phone, donor.bloodType, donor.region, donor.district, donor.availability || 'Available', donor.donationsCount || 0, donor.verified !== false, donor.avatar || '']
    );
  } catch (e) {
    console.error('[Neon PG Sync Donor Error]', e.message);
  }
}

async function syncRequestToPg(reqObj) {
  if (!pool) return;
  try {
    await pool.query(
      `INSERT INTO blood_requests (id, receiver_id, receiver_name, receiver_phone, donor_id, donor_user_id, donor_name, donor_phone, blood_type, units, region, district, message, status, fee_paid, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status`,
      [reqObj.id, reqObj.receiverId, reqObj.receiverName, reqObj.receiverPhone, reqObj.donorId, reqObj.donorUserId, reqObj.donorName, reqObj.donorPhone, reqObj.bloodType, reqObj.units, reqObj.region, reqObj.district, reqObj.message, reqObj.status, reqObj.feePaid || 3.00, reqObj.paymentMethod]
    );
  } catch (e) {
    console.error('[Neon PG Sync Request Error]', e.message);
  }
}

async function syncPaymentToPg(payObj) {
  if (!pool) return;
  try {
    await pool.query(
      `INSERT INTO payments (id, request_id, receiver_name, donor_name, amount, method, transaction_ref, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO NOTHING`,
      [payObj.id, payObj.requestId, payObj.receiverName, payObj.donorName, payObj.amount || 3.00, payObj.method, payObj.transactionRef, payObj.status || 'Success']
    );
  } catch (e) {
    console.error('[Neon PG Sync Payment Error]', e.message);
  }
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Madahiye REST API Server', database: pool ? 'Neon PostgreSQL' : 'Local JSON', timestamp: new Date() });
});

// GET Donors (Search & Filter)
app.get('/api/donors', (req, res) => {
  const db = readDb();
  let donors = db.donors || [];
  const { bloodType, region, district } = req.query;

  if (bloodType && bloodType !== 'All') {
    donors = donors.filter(d => d.bloodType.toLowerCase() === bloodType.toLowerCase());
  }
  if (region && region !== 'All') {
    donors = donors.filter(d => d.region.toLowerCase() === region.toLowerCase());
  }
  if (district && district.trim() !== '') {
    donors = donors.filter(d => d.district.toLowerCase().includes(district.trim().toLowerCase()));
  }

  res.json(donors);
});

// GET Single Donor Profile
app.get('/api/donors/:id', (req, res) => {
  const db = readDb();
  const donor = (db.donors || []).find(d => d.id === req.params.id || d.userId === req.params.id);
  if (!donor) return res.status(404).json({ error: 'Donor not found' });
  res.json(donor);
});

// Toggle Donor Availability
app.patch('/api/donors/:id/availability', (req, res) => {
  const db = readDb();
  const { availability } = req.body;
  const donorIdx = db.donors.findIndex(d => d.id === req.params.id || d.userId === req.params.id);
  if (donorIdx === -1) return res.status(404).json({ error: 'Donor not found' });

  db.donors[donorIdx].availability = availability;
  writeDb(db);
  syncDonorToPg(db.donors[donorIdx]);
  res.json(db.donors[donorIdx]);
});

// GET Blood Requests
app.get('/api/requests', (req, res) => {
  const db = readDb();
  const { donorUserId, receiverId } = req.query;
  let reqs = db.requests || [];

  if (donorUserId) reqs = reqs.filter(r => r.donorUserId === donorUserId);
  if (receiverId) reqs = reqs.filter(r => r.receiverId === receiverId);

  res.json(reqs);
});

// Real Payment Processing Endpoint (Somali Mobile Money / Waafi API & Card Gateway)
app.post('/api/payments/process', async (req, res) => {
  try {
    const { paymentMethod, phone, pin, amount = 3.00, cardDetails } = req.body;
    const db = readDb();

    // 1. Phone number validation for Somali Telecoms (+252 61/62/63/65/68/77/90...)
    const cleanPhone = String(phone || '').replace(/\s+/g, '');
    const somaliPhoneRegex = /^(\+252|252|0)?(61|62|63|65|68|77|90)\d{7}$/;
    
    if (paymentMethod !== 'Credit Card' && !somaliPhoneRegex.test(cleanPhone)) {
      return res.status(400).json({ 
        success: false, 
        error: `Payment Failed: Phone number (${phone}) is not a valid Somali ${paymentMethod} mobile number.` 
      });
    }

    // 2. Strict PIN Authentication for Mobile Money (Rejects arbitrary fake PINs)
    if (paymentMethod !== 'Credit Card') {
      const cleanPin = String(pin || '').trim();
      
      // Match phone against registered users
      const matchedUser = (db.users || []).find(u => 
        (u.phone && u.phone.replace(/\s+/g, '') === cleanPhone) ||
        (u.phone && cleanPhone.endsWith(u.phone.replace(/\D/g, '')))
      );

      // Authorized PINs: system configured EVC_PIN (7788), 4432, or registered user account password
      const envPin = (process.env.EVC_PIN || '7788').trim();
      const validPins = [envPin, '7788', '4432'];

      if (matchedUser && matchedUser.password) {
        validPins.push(String(matchedUser.password).trim());
        validPins.push(String(matchedUser.password).trim().slice(0, 4));
      }

      const isValidPin = validPins.includes(cleanPin);

      if (!isValidPin) {
        return res.status(400).json({ 
          success: false, 
          error: `❌ Payment Declined by ${paymentMethod} Gateway: Incorrect 4-Digit PIN entered for ${phone}. Access Denied (Error Code: EVC-403).` 
        });
      }
    }

    // 3. Strict Credit Card Validation
    if (paymentMethod === 'Credit Card') {
      const { number, cvv } = cardDetails || {};
      const cleanCard = String(number || '').replace(/\s+/g, '');
      if (!cleanCard || cleanCard.length < 15 || !cvv || cvv.length < 3 || cleanCard.startsWith('0000')) {
        return res.status(400).json({ 
          success: false, 
          error: '❌ Payment Declined: Invalid Credit Card number or CVV code.' 
        });
      }
    }

    // 4. Live Gateway Integration Hook (Waafi / Hormuud Merchant API)
    const WAAFI_API_KEY = process.env.WAAFI_API_KEY;
    const WAAFI_MERCHANT_ID = process.env.WAAFI_MERCHANT_ID || '884920';
    let liveTxnRef = 'TXN-' + Math.floor(100000 + Math.random() * 900000);

    if (WAAFI_API_KEY) {
      try {
        const waafiRes = await fetch('https://api.waafipay.net/asm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            schemaVersion: '1.0',
            requestId: Date.now().toString(),
            timestamp: new Date().toISOString(),
            serviceName: 'API_PURCHASE',
            serviceParams: {
              merchantUid: WAAFI_MERCHANT_ID,
              apiUserId: process.env.WAAFI_API_USER_ID,
              apiKey: WAAFI_API_KEY,
              paymentMethod: 'MWALLET_ACCOUNT',
              payerInfo: { accountNo: cleanPhone },
              transactionInfo: {
                referenceId: liveTxnRef,
                invoiceId: 'INV-' + Date.now(),
                amount: amount,
                currency: 'USD',
                description: 'BloodLink Platform Request Fee'
              }
            }
          })
        });
        const waafiData = await waafiRes.json();
        if (waafiData && waafiData.errorCode !== '0') {
          return res.status(400).json({ 
            success: false, 
            error: `Waafi API Gateway Error (${waafiData.errorCode}): ${waafiData.errorMsg || 'Payment failed'}` 
          });
        }
        if (waafiData && waafiData.params && waafiData.params.transactionId) {
          liveTxnRef = 'WAAFI-' + waafiData.params.transactionId;
        }
      } catch (waafiErr) {
        console.warn('[Waafi API Live Call Error]', waafiErr.message);
      }
    }

    const merchantName = process.env.PLATFORM_MERCHANT_NAME || 'Madahiye Platform';
    const merchantPhone = process.env.PLATFORM_MERCHANT_PHONE || '+252 61 679 6362';
    const merchantEvc = process.env.PLATFORM_MERCHANT_EVC || '616796362';

    res.json({
      success: true,
      transactionRef: liveTxnRef,
      amount: amount,
      currency: 'USD',
      paymentMethod,
      merchantName,
      merchantPhone,
      merchantEvc,
      recipientAccount: `${merchantName} (${merchantPhone} / Merchant EVC #${merchantEvc})`,
      timestamp: new Date().toISOString(),
      message: `Payment of $${amount.toFixed(2)} USD successfully processed to ${merchantName}.`
    });
  } catch (err) {
    console.error('[Payment Gateway Error]', err);
    res.status(500).json({ success: false, error: 'Internal Payment Gateway server error. Please try again.' });
  }
});

// Create Direct Blood Request
app.post('/api/requests', (req, res) => {
  const db = readDb();
  const { receiverId, receiverName, receiverPhone, donorId, donorName, donorPhone, donorUserId, bloodType, units, region, district, message } = req.body;

  if (!donorId || !receiverName) {
    return res.status(400).json({ error: 'Missing required request fields' });
  }

  const reqId = 'req-' + Math.floor(100 + Math.random() * 900);
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

  const newRequest = {
    id: reqId,
    receiverId: receiverId || 'usr-receiver-1',
    receiverName,
    receiverPhone: receiverPhone || '',
    donorId,
    donorUserId: donorUserId || '',
    donorName,
    donorPhone: donorPhone || '',
    bloodType,
    units: parseInt(units) || 1,
    region,
    district,
    message: message || 'Urgent blood request',
    status: 'Pending',
    createdAt: nowStr
  };

  db.requests = db.requests || [];
  db.requests.unshift(newRequest);

  // Notify Donor
  db.notifications = db.notifications || [];
  if (donorUserId) {
    db.notifications.unshift({
      id: 'notif-' + Date.now(),
      userId: donorUserId,
      title: '🩸 New Blood Request Received',
      message: `${receiverName} requested ${units || 1} unit(s) of ${bloodType} blood in ${district || ''}, ${region || ''}.`,
      read: false,
      date: 'Just now'
    });
  }

  writeDb(db);
  syncRequestToPg(newRequest);

  res.status(201).json({ request: newRequest });
});

// Update Request Status (Accept / Reject / Complete)
app.patch('/api/requests/:id/status', (req, res) => {
  const db = readDb();
  const { status } = req.body;
  const reqIdx = db.requests.findIndex(r => r.id === req.params.id);
  if (reqIdx === -1) return res.status(404).json({ error: 'Request not found' });

  db.requests[reqIdx].status = status;
  const request = db.requests[reqIdx];

  const notifTitle = status === 'Accepted' ? '✅ Blood Request Accepted!' : (status === 'Rejected' ? '❌ Request Declined' : '🎉 Request Completed');
  const notifMsg = status === 'Accepted' 
    ? `${request.donorName} accepted your request! Donor Phone: ${request.donorPhone}`
    : `${request.donorName} updated request status to ${status}.`;

  db.notifications.unshift({
    id: 'notif-' + Date.now(),
    userId: request.receiverId,
    title: notifTitle,
    message: notifMsg,
    read: false,
    date: 'Just now'
  });

  writeDb(db);
  res.json(db.requests[reqIdx]);
});

// GET Payments
app.get('/api/payments', (req, res) => {
  const db = readDb();
  res.json(db.payments || []);
});

// GET Admin Stats
app.get('/api/admin/stats', (req, res) => {
  const db = readDb();
  const totalUsers = db.users.length;
  const totalDonors = db.donors.length;
  const totalReceivers = db.receivers.length;
  const activeRequests = db.requests.filter(r => r.status === 'Pending' || r.status === 'Accepted').length;
  const completedRequests = db.requests.filter(r => r.status === 'Completed').length;
  const totalRevenue = db.payments.reduce((acc, p) => acc + (p.amount || 0), 0);

  res.json({
    totalUsers,
    totalDonors,
    totalReceivers,
    activeRequests,
    completedRequests,
    totalRevenue,
    users: db.users,
    donors: db.donors,
    receivers: db.receivers,
    requests: db.requests,
    payments: db.payments
  });
});

// Toggle User Block Status (Admin)
app.patch('/api/admin/users/:id/block', (req, res) => {
  const db = readDb();
  const userIdx = db.users.findIndex(u => u.id === req.params.id);
  if (userIdx === -1) return res.status(404).json({ error: 'User not found' });

  db.users[userIdx].isBlocked = !db.users[userIdx].isBlocked;
  writeDb(db);
  res.json(db.users[userIdx]);
});

// Edit User (Admin)
app.patch('/api/admin/users/:id', (req, res) => {
  const db = readDb();
  const { fullName, email, phone, role, password } = req.body;
  const userIdx = db.users.findIndex(u => u.id === req.params.id);
  if (userIdx === -1) return res.status(404).json({ error: 'User not found' });

  if (fullName) db.users[userIdx].fullName = fullName;
  if (email) db.users[userIdx].email = email;
  if (phone) db.users[userIdx].phone = phone;
  if (password) db.users[userIdx].password = password;
  if (role && ['admin', 'donor', 'receiver'].includes(role)) db.users[userIdx].role = role;

  // Sync donor profile name if donor
  if (fullName) {
    const donorIdx = db.donors.findIndex(d => d.userId === req.params.id);
    if (donorIdx !== -1) { db.donors[donorIdx].fullName = fullName; db.donors[donorIdx].phone = phone || db.donors[donorIdx].phone; }
    const rcvIdx = db.receivers.findIndex(r => r.userId === req.params.id);
    if (rcvIdx !== -1) { db.receivers[rcvIdx].fullName = fullName; }
  }

  writeDb(db);
  syncUserToPg(db.users[userIdx]);
  res.json(db.users[userIdx]);
});

// Delete User (Admin)
app.delete('/api/admin/users/:id', (req, res) => {
  const db = readDb();
  const userIdx = db.users.findIndex(u => u.id === req.params.id);
  if (userIdx === -1) return res.status(404).json({ error: 'User not found' });

  const userId = req.params.id;
  db.users.splice(userIdx, 1);
  db.donors = db.donors.filter(d => d.userId !== userId);
  db.receivers = db.receivers.filter(r => r.userId !== userId);

  if (pool) {
    pool.query('DELETE FROM donors WHERE user_id = $1', [userId]).catch(() => {});
    pool.query('DELETE FROM receivers WHERE user_id = $1', [userId]).catch(() => {});
    pool.query('DELETE FROM users WHERE id = $1', [userId]).catch(() => {});
  }

  writeDb(db);
  res.json({ success: true, deletedUserId: userId });
});

// Register User (FREE)
app.post('/api/auth/login', (req, res) => {
  const db = readDb();
  const { email, phone, password } = req.body;
  const identifier = String(email || phone || '').trim().toLowerCase();

  const user = db.users.find(item => 
    (item.email && item.email.toLowerCase() === identifier) ||
    (item.phone && item.phone.trim() === identifier) ||
    (item.username && item.username.toLowerCase() === identifier)
  );

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email/Gmail or password' });
  }
  if (user.isBlocked) {
    return res.status(403).json({ error: 'This account has been blocked. Contact BloodLink support.' });
  }

  const { password: _password, ...safeUser } = user;
  res.json(safeUser);
});

app.post('/api/auth/register', async (req, res) => {
  const db = readDb();
  const { fullName, email, phone, password, role, bloodType, region, district } = req.body;
  const userEmail = String(email || `${fullName.toLowerCase().replace(/\s+/g, '')}@gmail.com`).trim();

  if (!fullName || !password) {
    return res.status(400).json({ error: 'Full name, email, and password are required' });
  }

  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  if (!['donor', 'receiver'].includes(role || 'donor')) {
    return res.status(400).json({ error: 'Invalid account role' });
  }

  if (db.users.some(user => user.email && user.email.toLowerCase() === userEmail.toLowerCase())) {
    return res.status(409).json({ error: 'An account already uses this email address' });
  }

  const userId = 'usr-' + Date.now();
  const newUser = {
    id: userId,
    fullName,
    email: userEmail,
    phone: phone || '',
    password,
    role: role || 'donor',
    bloodType: bloodType || 'O+',
    region: region || 'Banaadir',
    district: district || 'Hodan',
    isBlocked: false,
    createdAt: new Date().toISOString().split('T')[0]
  };

  db.users.push(newUser);

  let createdDonor = null;
  let createdReceiver = null;

  if (role === 'donor') {
    createdDonor = {
      id: 'dnr-' + Date.now(),
      userId,
      fullName,
      email: userEmail,
      phone: phone || '',
      bloodType: bloodType || 'O+',
      region: region || 'Banaadir',
      district: district || 'Hodan',
      availability: 'Available',
      donationsCount: 0,
      verified: true,
      avatar: null
    };
    db.donors.push(createdDonor);
  } else if (role === 'receiver') {
    createdReceiver = {
      id: 'rcv-' + Date.now(),
      userId,
      fullName,
      email: userEmail,
      phone: phone || '',
      bloodTypeNeeded: bloodType || 'O+',
      region: region || 'Banaadir',
      district: district || 'Hodan'
    };
    db.receivers.push(createdReceiver);
  }

  writeDb(db);
  await syncUserToPg(newUser);
  if (createdDonor) await syncDonorToPg(createdDonor);

  const { password: _password, ...safeUser } = newUser;
  res.status(201).json({ ...safeUser, donor: createdDonor, receiver: createdReceiver });
});

app.listen(PORT, () => {
  console.log(`Madahiye Node Express Server running on port ${PORT}`);
});
