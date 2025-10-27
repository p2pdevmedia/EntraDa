import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isMetaMaskLoading, setIsMetaMaskLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      window.location.href = '/dashboard';
    } else {
      setMessage(data.message);
    }
  };

  const loginWithMetaMask = async () => {
    setMessage('');
    const ethereum = typeof window !== 'undefined' ? (window as any).ethereum : undefined;
    if (!ethereum) {
      setMessage('MetaMask no está disponible en este navegador.');
      return;
    }

    try {
      setIsMetaMaskLoading(true);
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const account = Array.isArray(accounts) ? accounts[0] : null;
      if (!account) {
        setMessage('No se detectó ninguna cuenta activa en MetaMask.');
        return;
      }

      const walletAddress = String(account).toLowerCase();
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        window.location.href = '/dashboard';
      } else {
        setMessage(data.message || 'No se pudo iniciar sesión con MetaMask.');
      }
    } catch (error: any) {
      if (error?.code === 4001) {
        setMessage('Conexión con MetaMask cancelada.');
      } else {
        setMessage(error?.message || 'Error al conectar con MetaMask.');
      }
    } finally {
      setIsMetaMaskLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={submit}>
        <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <Button type="submit">Login</Button>
      </form>
      <div className="mt-4">
        <Button
          type="button"
          onClick={loginWithMetaMask}
          disabled={isMetaMaskLoading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isMetaMaskLoading ? 'Conectando a MetaMask...' : 'Login con MetaMask'}
        </Button>
      </div>
      {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
    </div>
  );
}
