import { useState } from 'react';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CLIENT');
  const [message, setMessage] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    const data = await res.json();
    setMessage(res.ok ? 'Account created' : data.message);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Signup</h1>
      <form onSubmit={submit}>
        <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <Select value={role} onChange={e => setRole(e.target.value)}>
          <option value="CLIENT">Client</option>
          <option value="EVENT_MANAGER">Event Manager</option>
          <option value="EVENT_RRPP">Event RRPP</option>
          <option value="ADMIN">Admin</option>
        </Select>
        <Button type="submit">Signup</Button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
    </div>
  );
}
