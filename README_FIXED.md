# QR Web (Fixed Build)

This is a cleaned and ready-to-run version of your project.

## How to run

```bash
cd "/mnt/data/qr-web_fix/qr-web - Copy"
npm install
npm start   # runs node server.js
```

Then open http://localhost:3000

## What I changed

- Ensured `public/` folder exists with `index.html`, `style.css`, `app.js`.
- Serving static frontend from `public/` via Express.
- Fixed duplicate Express app code in `server.js` (causing conflicts).
- Added a `start` script in `package.json` (if missing).
- Renamed any `menifest.json` → `manifest.json`.
- Backed up originals in `_backup_originals/`.
