import { GetServerSideProps } from 'next';
import { getSessionUser } from '../lib/session';
import { useEffect, useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import DatePicker from '../components/DatePicker';

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
  type TicketInput = { name: string; price: string; quantity: string; saleStart: string };
  const [tickets, setTickets] = useState<TicketInput[]>([
    { name: '', price: '', quantity: '', saleStart: '' },
  ]);
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
        tickets: tickets.map(t => ({
          name: t.name,
          price: Number(t.price),
          quantity: Number(t.quantity),
          saleStart: t.saleStart,
        })),
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
            <DatePicker value={date} onChange={e => setDate(e.target.value)} placeholder="Event date" />
            <Input value={mpAccount} onChange={e => setMpAccount(e.target.value)} placeholder="MercadoPago account" />
            <Input value={posterUrl} onChange={e => setPosterUrl(e.target.value)} placeholder="Poster URL" />
            <Input value={sliderUrl} onChange={e => setSliderUrl(e.target.value)} placeholder="Slider URL" />
            <Input value={miniUrl} onChange={e => setMiniUrl(e.target.value)} placeholder="Mini URL" />
            {tickets.map((ticket, index) => (
              <div key={index} className="mt-4">
                <h3 className="font-semibold mb-2">Ticket Type {index + 1}</h3>
                <Input
                  value={ticket.name}
                  onChange={e => {
                    const updated = [...tickets];
                    updated[index].name = e.target.value;
                    setTickets(updated);
                  }}
                  placeholder="Ticket name"
                />
                <Input
                  type="number"
                  value={ticket.price}
                  onChange={e => {
                    const updated = [...tickets];
                    updated[index].price = e.target.value;
                    setTickets(updated);
                  }}
                  placeholder="Price"
                />
                <Input
                  type="number"
                  value={ticket.quantity}
                  onChange={e => {
                    const updated = [...tickets];
                    updated[index].quantity = e.target.value;
                    setTickets(updated);
                  }}
                  placeholder="Quantity"
                />
                <DatePicker
                  value={ticket.saleStart}
                  onChange={e => {
                    const updated = [...tickets];
                    updated[index].saleStart = e.target.value;
                    setTickets(updated);
                  }}
                  placeholder="Sale start"
                />
                {tickets.length > 1 && (
                  <button
                    type="button"
                    className="text-sm text-red-500 mb-4"
                    onClick={() => setTickets(tickets.filter((_, i) => i !== index))}
                  >
                    Remove ticket type
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="text-sm text-blue-500 mb-4"
              onClick={() => setTickets([...tickets, { name: '', price: '', quantity: '', saleStart: '' }])}
            >
              Add ticket type
            </button>
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
