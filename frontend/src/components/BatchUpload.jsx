
// src/components/BatchUpload.jsx
import React, { useState } from 'react';
import { batchUpload } from '../services/api';

const BatchUpload = () => {
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState(null);

  async function submit(e) {
    e.preventDefault();
    if (!file) return alert('Select a CSV');
    try {
      setBusy(true); setStatus('Generating...');
      const blob = await batchUpload(file);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'qrs.zip'; a.click();
      URL.revokeObjectURL(url);
      setStatus('ZIP downloaded!');
    } catch (e) {
      setStatus('Batch failed: ' + (e && e.message ? e.message : e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold">Batch generation (CSV)</h3>
      <form className="mt-2" onSubmit={submit}>
        <input type="file" accept=".csv" onChange={e=>setFile((e.target.files && e.target.files[0]) || null)} />
        <div className="mt-3">
          <button disabled={busy} className="px-3 py-2 bg-blue-600 text-white rounded">{busy ? 'Generating...' : 'Generate ZIP'}</button>
        </div>
        <div className="text-xs text-gray-500 mt-2">CSV columns: url,name (name optional)</div>
      </form>
      <div className="text-sm text-gray-600 mt-2">{status}</div>
    </div>
  );
};

export default BatchUpload;
