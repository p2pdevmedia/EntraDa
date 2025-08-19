import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Event {
  id: number;
  name: string;
  mercadoPagoAccount: string;
}

export default function EditEventPage() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<Event | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetch(`/api/events?id=${id}`).then(async res => {
        if (res.ok) {
          setEvent(await res.json());
        }
      });
    }
  }, [id]);

  const save = async () => {
    if (!event) return;
    const res = await fetch('/api/events', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Event updated');
    } else {
      setMessage(data.message);
    }
  };

  if (!event) {
    return <div className="pt-20 max-w-md mx-auto">Loading...</div>;
  }

  return (
    <div className="pt-20 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar Evento</h1>
      {message && <p className="mb-4 text-blue-600">{message}</p>}
      <div className="mb-4">
        <label className="block mb-1">Nombre</label>
        <input
          className="border p-2 w-full"
          value={event.name}
          onChange={e => setEvent({ ...event, name: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Cuenta MP</label>
        <input
          className="border p-2 w-full"
          value={event.mercadoPagoAccount}
          onChange={e =>
            setEvent({ ...event, mercadoPagoAccount: e.target.value })
          }
        />
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={save}
      >
        Guardar
      </button>
    </div>
  );
}
