import { useState } from 'react';

export default function Recover() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const requestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/recover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    setMessage(data.message + (data.token ? ` Token: ${data.token}` : ''));
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/recover', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div>
      <h1>Recover Password</h1>
      <form onSubmit={requestToken}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <button type="submit">Send Token</button>
      </form>
      <form onSubmit={resetPassword}>
        <input value={token} onChange={e => setToken(e.target.value)} placeholder="Token" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New Password" />
        <button type="submit">Reset Password</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
