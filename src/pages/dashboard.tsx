import { GetServerSideProps } from 'next';
import { getSessionUser } from '../lib/session';
import { useEffect, useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';

interface DashboardProps {
  user: { id: number; email: string; role: string };
}

export default function Dashboard({ user }: DashboardProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [mpAccount, setMpAccount] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [sliderUrl, setSliderUrl] = useState('');
  const [miniUrl, setMiniUrl] = useState('');
  const [ticketName, setTicketName] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState('');
  const [ticketSaleStart, setTicketSaleStart] = useState('');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState<any[]>([]);

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        date,
        mercadoPagoAccount: mpAccount,
        posterUrl,
        sliderUrl,
        miniUrl,
        tickets: [
          {
            name: ticketName,
            price: Number(ticketPrice),
            quantity: Number(ticketQuantity),
            saleStart: ticketSaleStart,
          },
        ],
      }),
    });
    const data = await res.json();
    setMessage(res.ok ? 'Event created' : data.message);
  };

  useEffect(() => {
    if (user.role === 'ADMIN') {
      fetch('/api/users')
        .then(res => res.json())
        .then(setUsers)
        .catch(() => setUsers([]));
    }
  }, [user.role]);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Logged in as {user.email}</p>

      {(user.role === 'EVENT_MANAGER' || user.role === 'ADMIN') && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Create Event</h2>
          <form onSubmit={createEvent}>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Event name" />
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} placeholder="Event date" />
            <Input value={mpAccount} onChange={e => setMpAccount(e.target.value)} placeholder="MercadoPago account" />
            <Input value={posterUrl} onChange={e => setPosterUrl(e.target.value)} placeholder="Poster URL" />
            <Input value={sliderUrl} onChange={e => setSliderUrl(e.target.value)} placeholder="Slider URL" />
            <Input value={miniUrl} onChange={e => setMiniUrl(e.target.value)} placeholder="Mini URL" />
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Ticket Type</h3>
              <Input value={ticketName} onChange={e => setTicketName(e.target.value)} placeholder="Ticket name" />
              <Input type="number" value={ticketPrice} onChange={e => setTicketPrice(e.target.value)} placeholder="Price" />
              <Input type="number" value={ticketQuantity} onChange={e => setTicketQuantity(e.target.value)} placeholder="Quantity" />
              <Input type="date" value={ticketSaleStart} onChange={e => setTicketSaleStart(e.target.value)} placeholder="Sale start" />
            </div>
            <Button type="submit">Create</Button>
          </form>
          {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
        </div>
      )}

      {user.role === 'ADMIN' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <ul>
            {users.map(u => (
              <li key={u.id} className="border-b py-1">
                {u.email} - {u.role}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getSessionUser(ctx.req as any);
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return {
    props: {
      user: { id: user.id, email: user.email, role: user.role }
    },
  };
};
