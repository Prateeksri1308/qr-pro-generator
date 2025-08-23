
// src/components/DynamicLinks.jsx
import React, { useState } from 'react';
import { shortenUrl, getAnalytics } from '../services/api';

const DynamicLinks = () => {
  const [target, setTarget] = useState('');
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);

  async function create() {
    if (!target.trim()) return;
    const data = await shortenUrl(target.trim());
    setResult(data);
  }

  async function lookup() {
    if (!code.trim()) return;
    const data = await getAnalytics(code.trim());
    setResult(data);
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold">Dynamic Links</h3>
      <div className="mt-2 flex gap-2">
        <input value={target} onChange={e=>setTarget(e.target.value)} placeholder="https://www.linkedin.com/in/yourname" className="flex-1 border px-3 py-2 rounded" />
        <button onClick={create} className="px-3 py-2 bg-green-600 text-white rounded">Create</button>
      </div>
      <div className="mt-4">
        <label className="block text-sm text-gray-500">Analytics / Lookup</label>
        <div className="flex gap-2 mt-2">
          <input value={code} onChange={e=>setCode(e.target.value)} placeholder="short code (e.g. abc123)" className="flex-1 border px-3 py-2 rounded" />
          <button onClick={lookup} className="px-3 py-2 bg-indigo-600 text-white rounded">Lookup</button>
        </div>
      </div>
      <pre className="text-xs text-gray-600 mt-2 bg-gray-100 p-2 rounded">{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
};

export default DynamicLinks;
