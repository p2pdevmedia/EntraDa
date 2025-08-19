import { useEffect, useState } from 'react';

interface Event {
  id: number;
  name: string;
  mercadoPagoAccount: string;
  posterUrl?: string;
  sliderUrl?: string;
  miniUrl?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [message, setMessage] = useState('');

  const fetchEvents = async () => {
    const res = await fetch('/api/events');
    if (res.ok) {
      setEvents(await res.json());
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (id: number, field: keyof Event, value: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const saveEvent = async (ev: Event) => {
    const res = await fetch('/api/events', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ev)
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Event updated');
      fetchEvents();
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div className="pt-20 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Eventos</h1>
      {message && <p className="mb-4 text-blue-600">{message}</p>}
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left p-2">Nombre</th>
            <th className="text-left p-2">Cuenta MP</th>
            <th className="text-left p-2">Poster URL</th>
            <th className="text-left p-2">Slider URL</th>
            <th className="text-left p-2">Mini URL</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {events.map(ev => (
            <tr key={ev.id}>
              <td className="p-2">
                <input
                  className="border p-1"
                  value={ev.name}
                  onChange={e => handleChange(ev.id, 'name', e.target.value)}
                />
              </td>
              <td className="p-2">
                <input
                  className="border p-1"
                  value={ev.mercadoPagoAccount}
                  onChange={e => handleChange(ev.id, 'mercadoPagoAccount', e.target.value)}
                />
              </td>
              <td className="p-2">
                <input
                  className="border p-1"
                  value={ev.posterUrl || ''}
                  onChange={e => handleChange(ev.id, 'posterUrl', e.target.value)}
                />
              </td>
              <td className="p-2">
                <input
                  className="border p-1"
                  value={ev.sliderUrl || ''}
                  onChange={e => handleChange(ev.id, 'sliderUrl', e.target.value)}
                />
              </td>
              <td className="p-2">
                <input
                  className="border p-1"
                  value={ev.miniUrl || ''}
                  onChange={e => handleChange(ev.id, 'miniUrl', e.target.value)}
                />
              </td>
              <td className="p-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => saveEvent(ev)}
                >
                  Guardar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
