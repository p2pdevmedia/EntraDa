import { useState } from 'react';

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
    <div>
      <h1>Signup</h1>
      <form onSubmit={submit}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="CLIENT">Client</option>
          <option value="EVENT_MANAGER">Event Manager</option>
          <option value="EVENT_RRPP">Event RRPP</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit">Signup</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
