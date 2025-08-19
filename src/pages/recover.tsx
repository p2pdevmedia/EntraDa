import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';

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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Recover Password</h1>
      <form onSubmit={requestToken} className="mb-6">
        <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <Button type="submit">Send Token</Button>
      </form>
      <form onSubmit={resetPassword}>
        <Input value={token} onChange={e => setToken(e.target.value)} placeholder="Token" />
        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New Password" />
        <Button type="submit">Reset Password</Button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
    </div>
  );
}
