import { useEffect, useState } from 'react';

type Role = 'ADMIN' | 'EVENT_MANAGER' | 'EVENT_RRPP' | 'CLIENT';
interface User { id: number; email: string; role: Role; }
const roles: Role[] = ['ADMIN', 'EVENT_MANAGER', 'EVENT_RRPP', 'CLIENT'];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    if (res.ok) {
      setUsers(await res.json());
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (id: number, role: Role) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
  };

  const saveUser = async (user: User) => {
    const res = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id, role: user.role })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('User updated');
      fetchUsers();
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div className="pt-20 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
      {message && <p className="mb-4 text-blue-600">{message}</p>}
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Rol</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td className="p-2">{u.email}</td>
              <td className="p-2">
                <select
                  className="border p-1"
                  value={u.role}
                  onChange={e => handleChange(u.id, e.target.value as Role)}
                >
                  {roles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </td>
              <td className="p-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => saveUser(u)}
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
