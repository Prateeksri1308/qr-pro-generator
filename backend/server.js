const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const multer = require("multer");
const csvParser = require("csv-parser");
const archiver = require("archiver");
const QRCode = require("qrcode");
const { nanoid } = require("nanoid");
require("dotenv").config();

const app = express();

// ---- Config ----
const PORT = parseInt(process.env.PORT, 10) || 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "*";
const DATABASE_PATH = process.env.DATABASE_PATH || path.join(__dirname, "qr.db");

// ---- Middleware ----
app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || FRONTEND_ORIGIN === "*" || origin === FRONTEND_ORIGIN) {
        return cb(null, true);
      }
      return cb(new Error("CORS blocked by server"));
    },
    credentials: true,
  })
);

// ---- Database ----
fs.mkdirSync(path.dirname(DATABASE_PATH), { recursive: true });
const db = new Database(DATABASE_PATH);
db.pragma("journal_mode = WAL");

// Tables
db.prepare(
  `CREATE TABLE IF NOT EXISTS signups (email TEXT PRIMARY KEY)`
).run();

db.prepare(
  `CREATE TABLE IF NOT EXISTS links (
    code TEXT PRIMARY KEY,
    target_url TEXT NOT NULL
  )`
).run();

db.prepare(
  `CREATE TABLE IF NOT EXISTS analytics (
    code TEXT,
    scans INTEGER DEFAULT 0,
    lastScan TEXT,
    PRIMARY KEY(code)
  )`
).run();

// ---- Routes ----

// ✅ Signup
app.post("/api/signup", (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: "email required" });

  try {
    db.prepare("INSERT OR IGNORE INTO signups (email) VALUES (?)").run(email);
    return res.json({ ok: true, message: "saved" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "db error" });
  }
});

// ✅ Dynamic Link: Create short link
app.post("/api/shorten", (req, res) => {
  const { target_url } = req.body || {};
  if (!target_url) return res.status(400).json({ error: "target_url required" });

  const code = nanoid(8);
  try {
    db.prepare("INSERT INTO links (code, target_url) VALUES (?, ?)").run(
      code,
      target_url
    );
    db.prepare("INSERT INTO analytics (code, scans) VALUES (?, 0)").run(code);

    return res.json({ ok: true, code, short_url: `/r/${code}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "db error" });
  }
});

// ✅ Redirect (dynamic QR)
app.get("/r/:code", (req, res) => {
  const { code } = req.params;
  const row = db.prepare("SELECT target_url FROM links WHERE code=?").get(code);

  if (!row) return res.status(404).send("Not found");

  // Update analytics
  db.prepare(
    "UPDATE analytics SET scans=scans+1, lastScan=? WHERE code=?"
  ).run(new Date().toISOString(), code);

  return res.redirect(row.target_url);
});

// ✅ Analytics Lookup
app.get("/api/analytics/:code", (req, res) => {
  const { code } = req.params;
  const stats = db
    .prepare("SELECT scans, lastScan FROM analytics WHERE code=?")
    .get(code);

  if (!stats) return res.json({ scans: 0, lastScan: null });

  return res.json(stats);
});

// ✅ Batch Generation (CSV → ZIP)
const upload = multer({ dest: "uploads/" });
app.post("/api/batch", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "CSV file required" });

  const urls = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on("data", (row) => {
      if (row.url) urls.push(row.url.trim());
    })
    .on("end", async () => {
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=qrs.zip"
      );

      const archive = archiver("zip");
      archive.pipe(res);

      for (let i = 0; i < urls.length; i++) {
        const qrBuffer = await QRCode.toBuffer(urls[i], { type: "png" });
        archive.append(qrBuffer, { name: `qr_${i + 1}.png` });
      }

      archive.finalize();
      fs.unlinkSync(req.file.path);
    });
});

// ✅ Health check
app.get("/healthz", (_req, res) => res.json({ ok: true }));
app.get("/", (_req, res) => res.type("text").send("Backend OK"));

// ---- Start ----
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
