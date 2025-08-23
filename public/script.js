// public/script.js
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const qrType = document.getElementById('qrType');
  const formFields = document.getElementById('formFields');
  const gradientStart = document.getElementById('gradientStart');
  const gradientEnd = document.getElementById('gradientEnd');
  const bgColor = document.getElementById('bgColor');
  const dropzone = document.getElementById('dropzone');
  const logoInput = document.getElementById('logoInput');
  const logoSize = document.getElementById('logoSize');
  const qrPreview = document.getElementById('qrPreview');
  const downloadPng = document.getElementById('downloadPng');
  const downloadSvg = document.getElementById('downloadSvg');
  const downloadPdf = document.getElementById('downloadPdf');
  const dynamicTarget = document.getElementById('dynamicTarget');
  const createShort = document.getElementById('createShort');
  const analyticsLookup = document.getElementById('analyticsLookup');
  const lookupBtn = document.getElementById('lookupBtn');
  const analyticsResult = document.getElementById('analyticsResult');

  // Toast system (lightweight, Tailwind-based)
  function showToast(msg, type = 'info') {
    const colors = {
      success: 'bg-green-600',
      error: 'bg-red-600',
      info: 'bg-blue-600',
    };
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-4 py-2 text-white rounded shadow ${colors[type] || colors.info}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0', 'transition');
      setTimeout(() => toast.remove(), 500);
    }, 2500);
  }

  // State
  let logoDataUrl = null;
  let lastCanvas = null;

  // Modify download handlers
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

  // center clear area
  const clear = Math.round(size * 0.26);
  const cx = Math.round((size - clear) / 2);
  svg += `<rect x="${cx}" y="${cx}" width="${clear}" height="${clear}" fill="${bg}"/>`;
  svg += `</svg>`;

  // --- FIXED download ---
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


  // Dynamic form fields by QR type
  const forms = {
    url: () => `<input id="field_url" class="w-full border px-3 py-2 rounded" placeholder="https://example.com" />`,
    whatsapp: () => `
      <input id="field_phone" class="w-full border px-3 py-2 rounded" placeholder="+91XXXXXXXXXX" />
      <input id="field_msg" class="w-full border px-3 py-2 rounded" placeholder="Preset message (optional)" />
    `,
    wifi: () => `
      <input id="field_ssid" class="w-full border px-3 py-2 rounded" placeholder="WiFi SSID" />
      <input id="field_password" class="w-full border px-3 py-2 rounded" placeholder="Password" />
      <select id="field_auth" class="w-full border px-3 py-2 rounded">
        <option value="WPA">WPA/WPA2</option>
        <option value="WEP">WEP</option>
        <option value="nopass">Open (no password)</option>
      </select>
      <label class="inline-flex items-center gap-2 text-sm text-gray-600">
        <input id="field_hidden" type="checkbox" /> Hidden network
      </label>
    `,
    vcard: () => `
      <input id="field_name" class="w-full border px-3 py-2 rounded" placeholder="Full Name" />
      <input id="field_org" class="w-full border px-3 py-2 rounded" placeholder="Organization" />
      <input id="field_title" class="w-full border px-3 py-2 rounded" placeholder="Job Title" />
      <input id="field_phone" class="w-full border px-3 py-2 rounded" placeholder="Phone" />
      <input id="field_email" class="w-full border px-3 py-2 rounded" placeholder="Email" />
      <input id="field_url" class="w-full border px-3 py-2 rounded" placeholder="Website" />
    `,
    text: () => `<textarea id="field_text" class="w-full border px-3 py-2 rounded" rows="4" placeholder="Your text here"></textarea>`,
  };

  function renderForm() {
    formFields.innerHTML = forms[qrType.value]();
    formFields.querySelectorAll('input,textarea,select').forEach(el =>
      el.addEventListener('input', () => debounce(renderPreview, 100)())
    );
    renderPreview();
  }

  // Build QR payload
  function buildPayload() {
    const type = qrType.value;
    if (type === 'url') return document.getElementById('field_url')?.value.trim() || '';
    if (type === 'whatsapp') {
      const phone = (document.getElementById('field_phone')?.value || '').trim().replace(/\s+/g, '');
      const msg = encodeURIComponent(document.getElementById('field_msg')?.value || '');
      if (!phone) return '';
      const base = phone.startsWith('+') ? phone : `+91${phone}`;
      return `https://wa.me/${base.replace('+', '')}${msg ? `?text=${msg}` : ''}`;
    }
    if (type === 'wifi') {
      const ssid = document.getElementById('field_ssid')?.value || '';
      const pass = document.getElementById('field_password')?.value || '';
      const auth = document.getElementById('field_auth')?.value || 'WPA';
      const hidden = document.getElementById('field_hidden')?.checked ? 'H:true;' : '';
      return `WIFI:T:${auth};S:${ssid};P:${pass};${hidden};`;
    }
    if (type === 'vcard') {
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${document.getElementById('field_name')?.value || ''}`,
        `ORG:${document.getElementById('field_org')?.value || ''}`,
        `TITLE:${document.getElementById('field_title')?.value || ''}`,
        `TEL:${document.getElementById('field_phone')?.value || ''}`,
        `EMAIL:${document.getElementById('field_email')?.value || ''}`,
        `URL:${document.getElementById('field_url')?.value || ''}`,
        'END:VCARD',
      ].join('\n');
    }
    if (type === 'text') return document.getElementById('field_text')?.value || '';
    return '';
  }

  // QR render
  function renderPreview() {
    const payload = buildPayload();
    if (!payload) {
      qrPreview.innerHTML = '<div class="text-gray-400">Fill the fields to preview</div>';
      downloadPng.disabled = true;
      downloadSvg.disabled = true;
      downloadPdf.disabled = true;
      return;
    }

    const q = window.qrcode(0, 'H');
    q.addData(payload);
    q.make();

    const modules = q.getModuleCount();
    const size = 360;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = bgColor.value;
    ctx.fillRect(0, 0, size, size);

    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, gradientStart.value);
    grad.addColorStop(1, gradientEnd.value);
    ctx.fillStyle = grad;

    const cell = size / modules;
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        if (q.isDark(r, c)) ctx.fillRect(Math.round(c * cell), Math.round(r * cell), Math.ceil(cell), Math.ceil(cell));
      }
    }

    if (logoDataUrl) {
      const img = new Image();
      img.onload = () => {
        const side = Math.round(size * (logoSize.value / 100));
        ctx.drawImage(img, (size - side) / 2, (size - side) / 2, side, side);
        mount(canvas);
      };
      img.src = logoDataUrl;
    } else {
      mount(canvas);
    }
  }

  function mount(canvas) {
    qrPreview.innerHTML = '';
    canvas.className = 'rounded shadow';
    qrPreview.appendChild(canvas);
    lastCanvas = canvas;
    downloadPng.disabled = false;
    downloadSvg.disabled = false;
    downloadPdf.disabled = false;
  }

  // Logo upload + clear
  dropzone.addEventListener('click', () => logoInput.click());
  logoInput.addEventListener('change', () => {
    if (logoInput.files[0]) {
      const fr = new FileReader();
      fr.onload = ev => {
        logoDataUrl = ev.target.result;
        dropzone.textContent = logoInput.files[0].name + ' (Click to change)';
        addClearLogo();
        renderPreview();
      };
      fr.readAsDataURL(logoInput.files[0]);
    }
  });

  function addClearLogo() {
    if (!document.getElementById('clearLogo')) {
      const btn = document.createElement('button');
      btn.id = 'clearLogo';
      btn.className = 'ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded';
      btn.textContent = 'Clear';
      btn.onclick = () => {
        logoDataUrl = null;
        dropzone.textContent = 'Drop logo or click';
        document.getElementById('clearLogo').remove();
        renderPreview();
      };
      dropzone.parentNode.appendChild(btn);
    }
  }

  // Downloads
  downloadPng.addEventListener('click', () => {
    if (!lastCanvas) return;
    const a = document.createElement('a');
    a.href = lastCanvas.toDataURL('image/png');
    a.download = 'qr_pro.png';
    a.click();
    showToast('PNG downloaded!', 'success');
  });

  downloadPdf.addEventListener('click', () => {
    showToast('📄 PDF export available in Pro version soon!', 'info');
  });

  // Short link
  createShort.addEventListener('click', async () => {
    const target = dynamicTarget.value.trim();
    if (!target) return showToast('Enter target URL', 'error');
    const res = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_url: target }),
    });
    const data = await res.json();
    if (data.code) {
      showToast('Short link created!', 'success');
      qrType.value = 'url';
      renderForm();
      document.getElementById('field_url').value = data.short_url;
      renderPreview();
    } else {
      showToast('Failed: ' + (data.error || 'unknown'), 'error');
    }
  });

  // Analytics lookup
  lookupBtn.addEventListener('click', async () => {
    const code = analyticsLookup.value.trim();
    if (!code) return;
    const res = await fetch('/api/analytics/' + encodeURIComponent(code));
    const data = await res.json();
    analyticsResult.textContent = JSON.stringify(data, null, 2);
  });

  // Init
  qrType.addEventListener('change', renderForm);
  [gradientStart, gradientEnd, bgColor, logoSize].forEach(el => el.addEventListener('input', () => debounce(renderPreview, 100)()));
  renderForm();

  // Debounce helper
  function debounce(fn, t) {
    let id;
    return function () {
      clearTimeout(id);
      id = setTimeout(() => fn.apply(this, arguments), t);
    };
  }
});
// Toast function
function showToast(message, type="info") {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  const colors = {
    info: "bg-blue-600",
    success: "bg-green-600",
    error: "bg-red-600",
    warn: "bg-yellow-600"
  };
  toast.className = `${colors[type] || colors.info} text-white px-4 py-2 rounded shadow animate-fade-in`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("opacity-0", "transition-opacity", "duration-500");
    setTimeout(() => toast.remove(), 500);
  }, 2500);
}

