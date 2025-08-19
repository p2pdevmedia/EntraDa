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

export default function EditEvent() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<Event | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetch(`/api/events?id=${id}`)
        .then(res => res.json())
        .then(setEvent)
        .catch(() => setEvent(null));
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
      body: JSON.stringify(event),
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
        <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">
          Guardar
        </button>
      </form>
    </div>
  );
}
