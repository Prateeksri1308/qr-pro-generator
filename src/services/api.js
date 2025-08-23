
// src/services/api.js
export async function shortenUrl(target_url) {
  const res = await fetch('/api/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target_url })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function batchUpload(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/batch', { method: 'POST', body: fd });
  if (!res.ok) throw new Error(await res.text());
  return res.blob();
}

export async function getAnalytics(code) {
  const res = await fetch(`/api/analytics/${encodeURIComponent(code)}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function signup(email) {
  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
