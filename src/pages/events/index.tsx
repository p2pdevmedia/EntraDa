import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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
  const router = useRouter();

  const fetchEvents = async () => {
    const res = await fetch('/api/events');
    if (res.ok) {
      setEvents(await res.json());
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const deleteEvent = async (id: number) => {
    if (!confirm('¿Borrar evento?')) return;
    const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
    const data = res.status === 204 ? null : await res.json();
    if (res.ok) {
      setMessage('Event deleted');
      fetchEvents();
    } else if (data) {
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
            <th className="text-left p-2">Poster</th>
            <th className="text-left p-2">Slider</th>
            <th className="text-left p-2">Mini</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {events.map(ev => (
            <tr key={ev.id}>
              <td className="p-2">{ev.name}</td>
              <td className="p-2">{ev.mercadoPagoAccount}</td>
              <td className="p-2">
                {ev.posterUrl && (
                  <img
                    src={ev.posterUrl}
                    alt={`${ev.name} poster`}
                    className="h-20 object-cover"
                  />
                )}
              </td>
              <td className="p-2">
                {ev.sliderUrl && (
                  <img
                    src={ev.sliderUrl}
                    alt={`${ev.name} slider`}
                    className="h-20 object-cover"
                  />
                )}
              </td>
              <td className="p-2">
                {ev.miniUrl && (
                  <img
                    src={ev.miniUrl}
                    alt={`${ev.name} thumbnail`}
                    className="h-20 object-cover"
                  />
                )}
              </td>
              <td className="p-2 space-x-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => router.push(`/events/${ev.id}`)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => deleteEvent(ev.id)}
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
