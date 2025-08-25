// public/script.js

const qrCanvas = document.getElementById('qrCanvas');
const qrRef = qrCanvas.getContext('2d');
const textInput = document.getElementById('textInput');
const gradientStart = document.getElementById('gradientStart');
const gradientEnd = document.getElementById('gradientEnd');
const bgColor = document.getElementById('bgColor');
const logoUpload = document.getElementById('logoUpload');
const logoSize = document.getElementById('logoSize');
const downloadPng = document.getElementById('downloadPng');
const downloadSvg = document.getElementById('downloadSvg');
const toast = document.getElementById('toast');

let logoDataUrl = null;

// ✅ Show toast notification
function showToast(message, type = "info") {
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), 3000);
}

// ✅ Build QR payload
function buildPayload() {
  const text = textInput.value.trim();
  return text || null;
}

// ✅ Render QR to canvas
function renderQr() {
  const payload = buildPayload();
  if (!payload) return;

  const q = window.qrcode(0, 'H');
  q.addData(payload);
  q.make();

  const modules = q.getModuleCount();
  const size = 360;
  const cell = size / modules;

  qrCanvas.width = qrCanvas.height = size;
  const ctx = qrRef;

  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, gradientStart.value);
  grad.addColorStop(1, gradientEnd.value);

  ctx.fillStyle = bgColor.value;
  ctx.fillRect(0, 0, size, size);

  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (q.isDark(r, c)) {
        ctx.fillStyle = grad;
        ctx.fillRect(Math.round(c * cell), Math.round(r * cell), Math.ceil(cell), Math.ceil(cell));
      }
    }
  }

  // ✅ If logo uploaded, draw it in center
  if (logoDataUrl) {
    const img = new Image();
    img.src = logoDataUrl;
    img.onload = () => {
      const clear = Math.round(size * (logoSize.value / 100));
      const cx = (size - clear) / 2;
      ctx.fillStyle = bgColor.value;
      ctx.fillRect(cx, cx, clear, clear);
      ctx.drawImage(img, cx, cx, clear, clear);
    };
  }
}

// ✅ Download as PNG
downloadPng.addEventListener('click', () => {
  const payload = buildPayload();
  if (!payload) return showToast("⚠️ No data to export", "warn");

  renderQr();
  const url = qrCanvas.toDataURL("image/png");
  const a = document.createElement('a');
  a.href = url;
  a.download = 'qr.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  showToast("✅ PNG downloaded", "success");
});

// ✅ Download as SVG (fix: only clear gap if logo exists)
downloadSvg.addEventListener('click', () => {
  const payload = buildPayload();
  if (!payload) return showToast("⚠️ No data to export", "warn");

  const q = window.qrcode(0, 'H');
  q.addData(payload);
  q.make();
  const modules = q.getModuleCount();
  const size = 360, cell = size / modules;
  const gs = gradientStart.value, ge = gradientEnd.value, bg = bgColor.value;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
  svg += `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${gs}"/><stop offset="100%" stop-color="${ge}"/></linearGradient></defs>`;
  svg += `<rect width="100%" height="100%" fill="${bg}"/>`;

  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (q.isDark(r, c)) {
        const x = Math.floor(c * cell), y = Math.floor(r * cell), s = Math.ceil(cell);
        svg += `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="url(#g)"/>`;
      }
    }
  }

  // ✅ Only add center gap if logo uploaded
  if (logoDataUrl) {
    const clear = Math.round(size * (logoSize.value / 100));
    const cx = Math.round((size - clear) / 2);
    svg += `<rect x="${cx}" y="${cx}" width="${clear}" height="${clear}" fill="${bg}"/>`;
    // (Optional) embed logo directly here with <image> if needed
  }

  svg += `</svg>`;

  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'qr.svg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast("✅ SVG downloaded", "success");
});

// ✅ Logo upload
logoUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    logoDataUrl = reader.result;
    renderQr();
  };
  reader.readAsDataURL(file);
});

// ✅ Live updates
[textInput, gradientStart, gradientEnd, bgColor, logoSize].forEach(el =>
  el.addEventListener('input', renderQr)
);

// Initial render
renderQr();
