import React, { useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import qrcode from "qrcode-generator"; // 👈 important import
import { toast } from "react-toastify";

export default function QRCustomizer() {
  const qrRef = useRef(null);
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    type: "canvas",
    data: linkedinUrl,
    dotsOptions: { color: "#000", type: "rounded" },
    backgroundOptions: { color: "#fff" },
  });

  // Attach QR to ref
  React.useEffect(() => {
    if (qrRef.current) {
      qrCode.append(qrRef.current);
    }
  }, []);

  React.useEffect(() => {
    qrCode.update({ data: linkedinUrl });
  }, [linkedinUrl]);

  // Download PNG
  const downloadPNG = () => {
    if (!linkedinUrl.trim()) {
      toast.error("Please enter a LinkedIn URL first.");
      return;
    }
    qrCode.download({ extension: "png", name: "linkedin_qr" });
  };

  // Download SVG
  const downloadSVG = () => {
    if (!linkedinUrl.trim()) {
      toast.error("Please enter a LinkedIn URL first.");
      return;
    }

    const qr = qrcode(0, "H");
    qr.addData(linkedinUrl);
    qr.make();

    const count = qr.getModuleCount();
    const cellSize = 10;
    const size = count * cellSize;

    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;

    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (qr.isDark(row, col)) {
          svgContent += `<rect x="${col * cellSize}" y="${row * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
        }
      }
    }

    svgContent += "</svg>";

    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "linkedin_qr.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-white rounded shadow flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">QR Code Generator</h2>

      <input
        type="text"
        placeholder="Enter LinkedIn URL"
        value={linkedinUrl}
        onChange={(e) => setLinkedinUrl(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <div ref={qrRef} className="my-4" />

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
