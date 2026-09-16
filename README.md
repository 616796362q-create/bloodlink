# 🩸 Madahiye — Voluntary Blood Donation Platform

Madahiye is a community-driven emergency voluntary blood donation platform designed to connect blood seekers with verified voluntary blood donors across Somalia.

## 🚀 Tech Stack
- **Frontend**: React.js 18, Vite, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express.js, CORS, Dotenv
- **Database**: Neon Serverless PostgreSQL & Local JSON fallback
- **Messaging**: Direct WhatsApp Gateway (`+252 61 679 6362`)

## 🛠️ Project Structure
```
bloodlink/
├── frontend/          # React + Vite Client Application
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
├── backend/           # Node.js Express REST API
│   ├── data/db.json
│   ├── server.js
│   ├── db-pg.js
│   └── package.json
├── start-system.bat   # Windows one-click start script
└── README.md
```

## ⚡ Quick Start Locally

### 1. Backend Setup
```bash
cd backend
npm install
node server.js
```
Backend runs on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`.

---
© 2026 Madahiye Community Platform. All rights reserved.
