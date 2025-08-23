
// src/components/Signup.jsx
import React, { useState } from 'react';
import { signup } from '../services/api';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  async function submit() {
    if (!email.trim()) return;
    const data = await signup(email.trim());
    setMsg(data && data.ok ? 'Thanks — you are signed up!' : 'Signup failed');
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold">Email signup</h3>
      <div className="mt-2 flex gap-2">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" className="flex-1 border px-3 py-2 rounded" />
        <button onClick={submit} className="px-3 py-2 bg-purple-600 text-white rounded">Signup</button>
      </div>
      <div className="text-sm text-gray-600 mt-2">{msg}</div>
    </div>
  );
};

export default Signup;
