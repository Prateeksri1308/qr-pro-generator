const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
require('dotenv').config();

const app = express();

// ---- Config ----
const PORT = process.env.PORT || 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '*';
const DATABASE_PATH = process.env.DATABASE_PATH || path.join(__dirname, 'qr.db');

// ---- Middleware ----
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || FRONTEND_ORIGIN === '*' || origin === FRONTEND_ORIGIN) return cb(null, true);
    return cb(new Error('CORS blocked by server'));
  },
  credentials: true,
}));

// ---- Database ----
fs.mkdirSync(path.dirname(DATABASE_PATH), { recursive: true });
const db = new Database(DATABASE_PATH);
db.pragma('journal_mode = WAL');
db.prepare(`CREATE TABLE IF NOT EXISTS signups (email TEXT PRIMARY KEY)`).run();

// ---- Routes ----
app.post('/api/signup', (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email required' });
  try {
    db.prepare('INSERT OR IGNORE INTO signups (email) VALUES (?)').run(email);
    return res.json({ ok: true, message: 'saved' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'db error' });
  }
});

// TODO: add your other API routes here
// app.post('/api/shorten', ...);
// app.post('/api/batch', ...);
// app.get('/api/analytics/:code', ...);

app.get('/healthz', (_req, res) => res.json({ ok: true }));
app.get('/', (_req, res) => res.type('text').send('Backend OK'));

// ---- Start ----
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
