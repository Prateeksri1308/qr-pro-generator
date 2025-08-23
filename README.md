# 🎯 QR Pro — Modern QR Code Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> Generate professional QR codes effortlessly — gradient backgrounds, logos, multi-type support, live previews, batch generation, analytics, and more.

---

## 🔗 Live Demo
> [Insert your live demo link here]

---

## 🚀 Key Features

### Customization & Design
- 🎨 **Gradient & Backgrounds** – Fully customizable colors and gradients  
- 🖼️ **Logo Embedding** – Upload or drag & drop your logo  
- 🖌️ **Live Preview** – Instant updates as you type or change settings  

### QR Types Supported
- 🌐 **URL** – LinkedIn, Instagram, websites  
- 💬 **WhatsApp** – Pre-filled message links  
- 📶 **WiFi** – Share SSID & password easily  
- 👤 **vCard** – Contact cards  
- 📄 **Plain Text** – Any text you want  

### Export & Pro Features
- 📂 **Download Options** – PNG ✅, SVG ✅, PDF ❌ (coming soon)  
- ⚡ **Batch Generation** – Upload CSV and generate multiple codes as ZIP  
- 🔗 **Dynamic Short Links** – Update QR destination anytime (`/api/shorten`)  
- 📊 **Analytics** – Lookup scans and performance (`/api/analytics/:code`)  
- 🏷️ **Verified Badge (Future Pro)** – Highlight professional QR codes  

### UX & Simplicity
- ❌ **No Email Signup** – Instant usage, simplified workflow

---

## 🏗️ Project Structure

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
-----

## Available APIs

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
