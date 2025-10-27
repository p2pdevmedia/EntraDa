import { useState } from 'react';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CLIENT');
  const [message, setMessage] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [walletError, setWalletError] = useState('');
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const walletButtonClass = walletAddress
    ? 'bg-green-600 hover:bg-green-700'
    : 'bg-purple-600 hover:bg-purple-700';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role, walletAddress: walletAddress || undefined })
    });
    const data = await res.json();
    setMessage(res.ok ? 'Account created' : data.message);
  };

  const connectWallet = async () => {
    setWalletError('');
    const ethereum = typeof window !== 'undefined' ? (window as any).ethereum : undefined;
    if (!ethereum) {
      setWalletError('MetaMask no está disponible en este navegador.');
      return;
    }

    if (walletAddress) {
      setWalletAddress('');
      return;
    }

    try {
      setIsConnectingWallet(true);
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const account = Array.isArray(accounts) ? accounts[0] : null;
      if (!account) {
        setWalletError('No se detectó ninguna cuenta activa en MetaMask.');
        return;
      }
      setWalletAddress(String(account).toLowerCase());
    } catch (error: any) {
      if (error?.code === 4001) {
        setWalletError('Conexión con MetaMask cancelada.');
      } else {
        setWalletError(error?.message || 'Error al conectar con MetaMask.');
      }
    } finally {
      setIsConnectingWallet(false);
    }
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
      <div className="mt-4 space-y-2">
        <Button
          type="button"
          onClick={connectWallet}
          disabled={isConnectingWallet}
          className={walletButtonClass}
        >
          {walletAddress
            ? 'Wallet conectada - clic para desconectar'
            : isConnectingWallet
              ? 'Conectando a MetaMask...'
              : 'Conectar MetaMask'}
        </Button>
        {walletAddress && (
          <p className="text-sm text-gray-700 break-all">Wallet: {walletAddress}</p>
        )}
        {walletError && <p className="text-sm text-red-600">{walletError}</p>}
      </div>
      {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
    </div>
  );
}
