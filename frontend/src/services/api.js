// src/services/api.js

const API_URL = import.meta.env.VITE_API_URL || "";

// Helper for fetch with better error messages
async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, options);
  if (!res.ok) {
    let msg;
    try {
      msg = await res.text();
    } catch {
      msg = res.statusText;
    }
    throw new Error(msg || `HTTP ${res.status}`);
  }
  // try json else blob/text
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  if (contentType.includes("application/zip") || contentType.includes("octet-stream")) {
    return res.blob();
  }
  return res.text();
}

// ✅ Signup
export async function signup(email) {
  return request("/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

// ✅ Dynamic Link / Shorten URL
export async function shortenUrl(target_url) {
  return request("/api/shorten", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target_url }),
  });
}

// ✅ Analytics lookup
export async function getAnalytics(code) {
  return request(`/api/analytics/${encodeURIComponent(code)}`);
}

// ✅ Batch CSV → ZIP download
export async function batchGenerate(file) {
  const fd = new FormData();
  fd.append("file", file);

  return request("/api/batch", {
    method: "POST",
    body: fd,
  });
}
