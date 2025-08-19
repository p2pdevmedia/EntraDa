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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Compra enviada');
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
