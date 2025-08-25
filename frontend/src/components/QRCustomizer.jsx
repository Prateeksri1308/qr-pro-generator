// src/components/QRCustomizer.jsx
import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "react-toastify";

export default function QRCustomizer() {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [gradientStart, setGradientStart] = useState("#000000");
  const [gradientEnd, setGradientEnd] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logoDataUrl, setLogoDataUrl] = useState(null);
  const [logoSize, setLogoSize] = useState(40);
  const qrRef = useRef(null);

  // Upload logo
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoDataUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  // Download PNG
  const downloadPNG = () => {
    if (!linkedinUrl.trim()) {
      toast.error("Please enter a LinkedIn URL first.");
      return;
    }
    const canvas = qrRef.current.querySelector("canvas");
    const pngUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = "linkedin_qr.png";
    a.click();
  };

  // Download SVG
  const downloadSVG = () => {
    if (!linkedinUrl.trim()) {
      toast.error("Please enter a LinkedIn URL first.");
      return;
    }
    const size = 360;

    // Create QR matrix using qrcode-generator lib (via window)
    const qr = window.qrcode(0, "H");
    qr.addData(linkedinUrl.trim());
    qr.make();
    const count = qr.getModuleCount();
    const cell = size / count;

    // Build SVG string
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;

    // Background
    svg += `<rect width="100%" height="100%" fill="${bgColor}" />`;

    // Gradient
    svg += `
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${gradientStart}" />
          <stop offset="100%" stop-color="${gradientEnd}" />
        </linearGradient>
      </defs>
    `;

    // QR modules
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (qr.isDark(r, c)) {
          const x = Math.round(c * cell);
          const y = Math.round(r * cell);
          svg += `<rect x="${x}" y="${y}" width="${Math.ceil(cell)}" height="${Math.ceil(cell)}" fill="url(#grad)" />`;
        }
      }
    }

    // White clear box in middle
    const clearBox = Math.round(size * 0.28);
    const x = Math.round((size - clearBox) / 2);
    svg += `<rect x="${x}" y="${x}" width="${clearBox}" height="${clearBox}" fill="${bgColor}" />`;

    // Logo (if uploaded)
    if (logoDataUrl) {
      const sideDesired = Math.round(size * (logoSize / 100));
      const side = Math.min(clearBox, sideDesired);
      const dx = x + (clearBox - side) / 2;
      const dy = x + (clearBox - side) / 2;
      svg += `<image href="${logoDataUrl}" x="${dx}" y="${dy}" width="${side}" height="${side}" />`;
    }

    svg += `</svg>`;

    // Download
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "linkedin_qr.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 p-4 border rounded-xl shadow">
      <h2 className="text-xl font-bold">LinkedIn QR Generator</h2>

      {/* Input */}
      <input
        type="text"
        value={linkedinUrl}
        onChange={(e) => setLinkedinUrl(e.target.value)}
        placeholder="Enter LinkedIn profile URL"
        className="w-full border p-2 rounded"
      />

      {/* Customization */}
      <div className="flex gap-4">
        <div>
          <label className="block text-sm">Gradient Start</label>
          <input
            type="color"
            value={gradientStart}
            onChange={(e) => setGradientStart(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">Gradient End</label>
          <input
            type="color"
            value={gradientEnd}
            onChange={(e) => setGradientEnd(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">Background</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
        </div>
      </div>

      {/* Logo upload */}
      <div>
        <label className="block text-sm">Upload Logo</label>
        <input type="file" accept="image/*" onChange={handleLogoUpload} />
        {logoDataUrl && (
          <div className="mt-2">
            <label className="text-sm">Logo Size (%)</label>
            <input
              type="range"
              min="20"
              max="60"
              value={logoSize}
              onChange={(e) => setLogoSize(Number(e.target.value))}
            />
          </div>
        )}
      </div>

      {/* Preview */}
      <div ref={qrRef} className="p-4 bg-white inline-block rounded">
        <QRCodeCanvas
          value={linkedinUrl || "https://linkedin.com"}
          size={360}
          bgColor={bgColor}
          fgColor={gradientStart}
          level="H"
          includeMargin={false}
          imageSettings={
            logoDataUrl
              ? {
                  src: logoDataUrl,
                  height: (logoSize / 100) * 360,
                  width: (logoSize / 100) * 360,
                  excavate: true,
                }
              : null
          }
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={downloadPNG}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Download PNG
        </button>
        <button
          onClick={downloadSVG}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Download SVG
        </button>
      </div>
    </div>
  );
}
