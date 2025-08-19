import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface TicketType {
  id: number;
  name: string;
  price: number;
}

export default function TicketTypesPage() {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [message, setMessage] = useState('');
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const router = useRouter();

  const fetchTypes = async () => {
    const res = await fetch('/api/ticket-types');
    if (res.ok) {
      setTicketTypes(await res.json());
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const createType = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/ticket-types', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, price: Number(newPrice) })
    });
    const data = await res.json().catch(() => null);
    if (res.ok) {
      setNewName('');
      setNewPrice('');
      fetchTypes();
    } else if (data) {
      setMessage(data.message);
    }
  };

  const deleteType = async (id: number) => {
    if (!confirm('¿Borrar tipo de entrada?')) return;
    const res = await fetch(`/api/ticket-types?id=${id}`, { method: 'DELETE' });
    const data = res.status === 204 ? null : await res.json();
    if (res.ok) {
      setMessage('Ticket type deleted');
      fetchTypes();
    } else if (data) {
      setMessage(data.message);
    }
  };

  return (
    <div className="pt-20 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tipos de entradas</h1>
      {message && <p className="mb-4 text-blue-600">{message}</p>}
      <form onSubmit={createType} className="mb-4 space-x-2">
        <input
          className="border p-1"
          placeholder="Nombre"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <input
          className="border p-1"
          placeholder="Precio"
          type="number"
          value={newPrice}
          onChange={e => setNewPrice(e.target.value)}
        />
        <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded">
          Crear
        </button>
      </form>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left p-2">Nombre</th>
            <th className="text-left p-2">Precio</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ticketTypes.map(tt => (
            <tr key={tt.id}>
              <td className="p-2">{tt.name}</td>
              <td className="p-2">{tt.price}</td>
              <td className="p-2 space-x-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => router.push(`/ticket-types/${tt.id}`)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => deleteType(tt.id)}
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
