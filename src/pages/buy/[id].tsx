import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Event {
  id: number;
  name: string;
  posterUrl?: string;
  date?: string;
}

export default function BuyEvent() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<Event | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (typeof id === 'string') {
      fetch(`/api/events?id=${id}`)
        .then(res => res.json())
        .then(setEvent)
        .catch(() => setEvent(null));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof id !== 'string') return;

    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: Number(id),
        name,
        email,
        quantity,
      }),
    });

    if (res.ok) {
      alert('Compra enviada');
      setName('');
      setEmail('');
      setQuantity(1);
    } else {
      const data = await res.json().catch(() => null);
      alert(data?.message || 'Error al procesar la compra');
    }
  };

  if (!event) {
    return <div className="pt-20 max-w-md mx-auto">Cargando...</div>;
  }

  return (
    <div className="pt-20 max-w-md mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Compra de {event.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="email"
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="number"
          min={1}
          className="border p-2 w-full"
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Comprar
        </button>
      </form>
    </div>
  );
}
