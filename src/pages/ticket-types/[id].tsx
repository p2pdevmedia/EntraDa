import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface TicketType {
  id: number;
  name: string;
  price: number;
}

export default function EditTicketType() {
  const router = useRouter();
  const { id } = router.query;
  const [ticketType, setTicketType] = useState<TicketType | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetch(`/api/ticket-types?id=${id}`)
        .then(res => res.json())
        .then(setTicketType)
        .catch(() => setTicketType(null));
    }
  }, [id]);

  const handleChange = (field: keyof TicketType, value: string) => {
    if (!ticketType) return;
    setTicketType({ ...ticketType, [field]: field === 'price' ? Number(value) : value });
  };

  const saveType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketType) return;
    const res = await fetch('/api/ticket-types', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketType)
    });
    const data = await res.json();
    if (res.ok) {
      router.push('/ticket-types');
    } else {
      setMessage(data.message);
    }
  };

  if (!ticketType) {
    return <div className="pt-20 max-w-xl mx-auto">Loading...</div>;
  }

  return (
    <div className="pt-20 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar tipo de entrada</h1>
      {message && <p className="mb-4 text-blue-600">{message}</p>}
      <form onSubmit={saveType} className="space-y-2">
        <input
          className="border p-1 w-full"
          value={ticketType.name}
          onChange={e => handleChange('name', e.target.value)}
        />
        <input
          className="border p-1 w-full"
          type="number"
          value={ticketType.price}
          onChange={e => handleChange('price', e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">
          Guardar
        </button>
      </form>
    </div>
  );
}
