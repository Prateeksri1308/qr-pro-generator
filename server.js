const express = require('express');
const path = require('path');
const cors = require('cors');
const Database = require('better-sqlite3');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// --- Database ---
const db = new Database(path.join(__dirname, 'qr.db'));
db.prepare(`CREATE TABLE IF NOT EXISTS signups (email TEXT PRIMARY KEY)`).run();

// --- Signup endpoint (just save, no email) ---
app.post('/api/signup', async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email required' });

  try {
    db.prepare('INSERT OR IGNORE INTO signups (email) VALUES (?)').run(email);
    return res.json({ ok: true, message: "Signup saved. Thank you!" });
  } catch (e) {
    console.error("Signup error", e);
    return res.status(500).json({ error: 'server error' });
  }
});

// --- Future PDF endpoint placeholder ---
app.post('/api/pdf', (req, res) => {
  return res.status(501).json({ error: "📄 PDF export is not available yet. Coming soon!" });
});

// --- Serve React build if exists ---
try {
  const buildDir = path.join(__dirname, 'build');
  app.use(express.static(buildDir));
  app.get('*', (req, res) => {
    const indexPath = path.join(buildDir, 'index.html');
    if (require('fs').existsSync(indexPath)) res.sendFile(indexPath);
    else res.status(404).send('Not Found');
  });
} catch (_) {}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
