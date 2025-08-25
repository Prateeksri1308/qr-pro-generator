import React, { useEffect, useRef, useState } from 'react';
import { shortenUrl } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QRCustomizer = () => {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [gradientStart, setGradientStart] = useState('#0a66c2');
  const [gradientEnd, setGradientEnd] = useState('#00395a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logoDataUrl, setLogoDataUrl] = useState(null);
  const [logoSize, setLogoSize] = useState(25);
  const canvasRef = useRef(null);

  const qrReadyRef = useRef(false);
  async function ensureQrLib() {
    if (qrReadyRef.current) return;
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js';
      s.onload = () => { qrReadyRef.current = true; resolve(null); };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function renderPreview() {
    const url = linkedinUrl.trim();
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!url) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0,0,canvas.width, canvas.height);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0,0,canvas.width, canvas.height);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.fillText('Enter LinkedIn URL to preview', 16, 24);
      return;
    }
    await ensureQrLib();
    const q = window.qrcode(0, 'H');
    q.addData(url); q.make();
    const modules = q.getModuleCount();
    const size = 360;
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = bgColor || '#fff';
    ctx.fillRect(0,0,size,size);

    const grad = ctx.createLinearGradient(0,0,size,size);
    grad.addColorStop(0, gradientStart);
    grad.addColorStop(1, gradientEnd);
    ctx.fillStyle = grad;

    const cell = size / modules;
    for (let r=0; r<modules; r++) {
      for (let c=0; c<modules; c++) {
        if (q.isDark(r,c)) {
          ctx.fillRect(Math.round(c*cell), Math.round(r*cell), Math.ceil(cell), Math.ceil(cell));
        }
      }
    }

    // Only clear + draw logo if uploaded
    if (logoDataUrl) {
      const clearBox = Math.round(size * 0.28);
      const x = Math.round((size - clearBox)/2);
      ctx.fillStyle = bgColor || '#fff';
      ctx.fillRect(x, x, clearBox, clearBox);

      await new Promise(res => {
        const img = new Image();
        img.onload = () => {
          const sideDesired = Math.round(size * (logoSize/100));
          const side = Math.min(clearBox, sideDesired);
          const scale = Math.max(side / img.width, side / img.height);
          const dw = img.width*scale, dh = img.height*scale;
          const dx = x + (clearBox - dw)/2;
          const dy = x + (clearBox - dh)/2;
          ctx.fillStyle = bgColor || '#fff';
          ctx.fillRect(x, x, side, side);
          ctx.drawImage(img, dx, dy, dw, dh);
          res(null);
        };
        img.src = logoDataUrl;
      });
    }
  }

  useEffect(() => { renderPreview(); }, [linkedinUrl, gradientStart, gradientEnd, bgColor, logoDataUrl, logoSize]);

  function onDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!f) return;
    const fr = new FileReader();
    fr.onload = ev => setLogoDataUrl(ev.target.result);
    fr.readAsDataURL(f);
  }

  async function createShort() {
    if (!linkedinUrl.trim()) return;
    try {
      const data = await shortenUrl(linkedinUrl.trim());
      if (data && data.short_url) setLinkedinUrl(data.short_url);
      toast.success('Short link created: ' + (data.short_url || 'OK'));
    } catch (e) {
      toast.error('Failed: ' + (e && e.message ? e.message : e));
    }
  }

  function pdfComingSoon() {
    toast.info('📄 PDF export is not available yet. Coming soon!');
  }

  // ✅ New: Export as SVG
  async function downloadSVG() {
    const url = linkedinUrl.trim();
    if (!url) {
      toast.error("Enter a URL first");
      return;
    }
    await ensureQrLib();
    const q = window.qrcode(0, 'H');
    q.addData(url); q.make();
    const svgTag = q.createSvgTag({
      scalable: true,
      margin: 0
    });

    // If no logo → use plain QR
    let finalSvg = svgTag;

    // If logo → inject <image> in the middle
    if (logoDataUrl) {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgTag, "image/svg+xml");
      const svgElem = svgDoc.documentElement;
      const size = parseInt(svgElem.getAttribute("width"));
      const clearBox = Math.round(size * 0.28);
      const x = Math.round((size - clearBox)/2);
      const y = x;

      const imgTag = svgDoc.createElementNS("http://www.w3.org/2000/svg", "image");
      imgTag.setAttribute("href", logoDataUrl);
      imgTag.setAttribute("x", x);
      imgTag.setAttribute("y", y);
      imgTag.setAttribute("width", clearBox);
      imgTag.setAttribute("height", clearBox);
      svgElem.appendChild(imgTag);

      finalSvg = new XMLSerializer().serializeToString(svgDoc);
    }

    const blob = new Blob([finalSvg], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "linkedin_qr.svg";
    a.click();
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <ToastContainer position="bottom-right" />
      <h2 className="font-semibold mb-2">Customize QR</h2>

      <label className="block mb-2">
        <span className="text-sm text-gray-600">LinkedIn URL</span>
        <input value={linkedinUrl} onChange={e=>setLinkedinUrl(e.target.value)} placeholder="https://www.linkedin.com/in/yourname" className="w-full border px-3 py-2 rounded" />
      </label>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => {
            if (!canvasRef.current) return;
            const a=document.createElement('a');
            a.href=canvasRef.current.toDataURL('image/png');
            a.download='linkedin_qr.png';
            a.click();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded transition transform hover:scale-105"
        >
          Download PNG
        </button>
        <button
          onClick={downloadSVG}
          className="px-4 py-2 bg-gray-200 rounded transition hover:bg-gray-300"
        >
          Download SVG
        </button>
        <button onClick={pdfComingSoon} className="px-4 py-2 bg-gray-200 rounded transition hover:bg-gray-300">
          Download PDF
        </button>
      </div>

      <div className="mt-4">
        <h2 className="font-semibold mb-2">Live Preview</h2>
        <div className="w-full h-96 flex items-center justify-center border border-gray-100 rounded bg-white">
          <canvas ref={canvasRef} className="rounded shadow" width={360} height={360} />
        </div>

        {/* Animated social buttons */}
        <div className="mt-4 flex gap-3 justify-center">
          <a
            href="https://www.linkedin.com/in/prateek-srivastava-backend/"
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:bg-blue-700 animate-bounce"
          >
            Connect with me on LinkedIn
          </a>
          <a
            href="https://github.com/Prateek1308"
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-black text-white font-semibold px-5 py-2 rounded-lg shadow-md transform transition duration-300 hover:scale-105"
          >
            ⭐ Check my GitHub
          </a>
        </div>
      </div>

      {/* Footer credit */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Made with ❤️ by <strong>Prateek Srivastava</strong></p>
        <p>
          <a href="https://www.linkedin.com/in/prateek-srivastava-backend/" target="_blank" rel="noreferrer" className="text-blue-600">LinkedIn</a> |{" "}
          <a href="https://github.com/Prateek1308" target="_blank" rel="noreferrer" className="text-gray-800">GitHub</a>
        </p>
      </div>
    </div>
  );
};

export default QRCustomizer;
