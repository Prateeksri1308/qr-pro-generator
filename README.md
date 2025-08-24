# 🎯 QR Pro — Modern QR Code Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/Prateek1308/qr-pro?style=social)](https://github.com/Prateek1308/qr-pro/stargazers)

> Generate professional QR codes effortlessly — gradient backgrounds, logos, multi-type support, live previews, batch generation, analytics, and more.

---

## 🔗 Live Demo
> [[Insert your live demo link here](https://linkqr-pro.netlify.app/)]

---

## 📝 About QR Pro
QR Pro is a **modern, professional QR Code generator** built for developers, creators, and businesses. Generate and customize QR codes with ease, live previews, batch processing, dynamic short links, and analytics. Built with **HTML, Tailwind CSS, JavaScript**, and optionally **Node.js backend** for Pro features.

---

## 🚀 Key Features

### 🎨 Customization & Design
- Gradient & background customization  
- Logo embedding (upload or drag & drop)  
- Live preview with instant updates

### 📱 QR Types Supported
- URL (LinkedIn, Instagram, websites)  
- WhatsApp with pre-filled messages  
- WiFi credentials (SSID + password)  
- vCard (contact cards)  
- Plain text

### 🖥️ Export & Pro Features
- Download: **PNG ✅**, **SVG ✅**, **PDF ❌ (planned)**  
- Batch QR generation from CSV (download as ZIP)  
- Dynamic short links (`POST /api/shorten`)  
- Analytics lookup (`GET /api/analytics/:code`)  
- Future Pro “Verified Badge”  

### ⚡ UX & Simplicity
- No email signup — instant access  
- Clean, modern interface

---

## 🏗️ Project Structure

```text
qr-pro/
├─ frontend/
│  ├─ index.html
│  ├─ css/
│  │  └─ tailwind.css
│  ├─ js/
│  │  └─ main.js
│  └─ assets/
├─ backend/  (optional)
│  ├─ server.js
│  ├─ routes/
│  │  └─ api.js
│  ├─ controllers/
│  └─ models/
├─ .gitignore
├─ package.json
└─ README.md
---

## ⚙️ Setup Instructions

### Frontend (Static)

**Clone the repository:**
```bash
git clone https://github.com/Prateek1308/qr-pro.git
cd qr-pro/frontend
```

**Install Tailwind CSS (if modifying styles):**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

**Open `index.html` in your browser or run a local server:**
```bash
npx live-server
```

### Backend (Optional Pro Features)

**Navigate to backend folder:**
```bash
cd backend
```

**Install dependencies:**
```bash
npm install
```

**Start server:**
```bash
node server.js
```

**Available APIs:**
- `POST /api/shorten` – Create a dynamic short link  
- `GET /api/analytics/:code` – Retrieve QR scan analytics

---

## 🚀 Deployment Guide

### Frontend (Netlify)
1. Push frontend to GitHub  
2. Connect GitHub repo to Netlify  
3. Deploy site

### Backend Options (Google Cloud Run / Railway / Render)
1. Push backend code to GitHub  
2. Connect repository to your preferred service  
3. Configure environment variables (if any)  
4. Deploy

---

## 🤝 Contributing
We welcome contributions!  

1. Fork the repository  
2. Create a feature branch (`git checkout -b feature/my-feature`)  
3. Commit your changes (`git commit -am 'Add feature'`)  
4. Push to branch (`git push origin feature/my-feature`)  
5. Open a Pull Request  

> Please ensure your code follows existing style and passes any linting/tests.

---

## 👨‍💻 Author

**Prateek Srivastava**  
- LinkedIn: [https://www.linkedin.com/in/prateek-srivastava-backend/](https://www.linkedin.com/in/prateek-srivastava-backend/)  
- GitHub: [https://github.com/Prateek1308](https://github.com/Prateek1308)

---

## 📄 License
This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.
