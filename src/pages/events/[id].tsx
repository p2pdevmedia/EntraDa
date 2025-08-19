import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DatePicker from '../../components/DatePicker';

interface Event {
  id: number;
  name: string;
  date: string;
  mercadoPagoAccount: string;
  posterUrl?: string;
  sliderUrl?: string;
  miniUrl?: string;
}

type TicketInput = { name: string; price: string; quantity: string; saleStart: string };

export default function EditEvent() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<Event | null>(null);
  const [tickets, setTickets] = useState<TicketInput[]>([
    { name: '', price: '', quantity: '', saleStart: '' },
  ]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetch(`/api/events?id=${id}`)
        .then(res => res.json())
        .then(data => {
          setEvent(data);
          if (data.ticketTypes && data.ticketTypes.length > 0) {
            setTickets(
              data.ticketTypes.map((t: any) => ({
                name: t.name,
                price: String(t.price),
                quantity: String(t.quantity),
                saleStart: t.saleStart ? t.saleStart.split('T')[0] : '',
              }))
            );
          }
        })
        .catch(() => {
          setEvent(null);
          setTickets([{ name: '', price: '', quantity: '', saleStart: '' }]);
        });
    }
  }, [id]);

  const handleChange = (field: keyof Event, value: string) => {
    if (!event) return;
    setEvent({ ...event, [field]: value });
  };

  const saveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    const res = await fetch('/api/events', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...event,
        tickets: tickets.map(t => ({
          name: t.name,
          price: Number(t.price),
          quantity: Number(t.quantity),
          saleStart: t.saleStart,
        })),
      }),
    });
    const data = await res.json();
    if (res.ok) {
      router.push('/events');
    } else {
      setMessage(data.message);
    }
  };

  if (!event) {
    return <div className="pt-20 max-w-4xl mx-auto">Loading...</div>;
  }

  return (
    <div className="pt-20 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar evento</h1>
      {message && <p className="mb-4 text-blue-600">{message}</p>}
      <form onSubmit={saveEvent} className="space-y-2">
        <input
          className="border p-1 w-full"
          value={event.name}
          onChange={e => handleChange('name', e.target.value)}
        />
        <DatePicker
          value={event.date ? event.date.split('T')[0] : ''}
          onChange={e => handleChange('date', e.target.value)}
        />
        <input
          className="border p-1 w-full"
          value={event.mercadoPagoAccount}
          onChange={e => handleChange('mercadoPagoAccount', e.target.value)}
        />
        <input
          className="border p-1 w-full"
          value={event.posterUrl || ''}
          onChange={e => handleChange('posterUrl', e.target.value)}
        />
        <input
          className="border p-1 w-full"
          value={event.sliderUrl || ''}
          onChange={e => handleChange('sliderUrl', e.target.value)}
        />
        <input
          className="border p-1 w-full"
          value={event.miniUrl || ''}
          onChange={e => handleChange('miniUrl', e.target.value)}
        />
        {tickets.map((ticket, index) => (
          <div key={index} className="mt-4">
            <h3 className="font-semibold mb-2">Ticket Type {index + 1}</h3>
            <input
              className="border p-1 w-full mb-1"
              value={ticket.name}
              onChange={e => {
                const updated = [...tickets];
                updated[index].name = e.target.value;
                setTickets(updated);
              }}
              placeholder="Ticket name"
            />
            <input
              type="number"
              className="border p-1 w-full mb-1"
              value={ticket.price}
              onChange={e => {
                const updated = [...tickets];
                updated[index].price = e.target.value;
                setTickets(updated);
              }}
              placeholder="Price"
            />
            <input
              type="number"
              className="border p-1 w-full mb-1"
              value={ticket.quantity}
              onChange={e => {
                const updated = [...tickets];
                updated[index].quantity = e.target.value;
                setTickets(updated);
              }}
              placeholder="Quantity"
            />
            <input
              type="date"
              className="border p-1 w-full mb-1"
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
          onClick={() =>
            setTickets([
              ...tickets,
              { name: '', price: '', quantity: '', saleStart: '' },
            ])
          }
        >
          Add ticket type
        </button>
        <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">
          Guardar
        </button>
      </form>
    </div>
  );
}
