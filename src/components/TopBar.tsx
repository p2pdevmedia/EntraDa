import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  role: 'ADMIN' | 'EVENT_MANAGER' | 'EVENT_RRPP' | 'CLIENT';
}

export default function TopBar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout');
    window.location.href = '/';
  };

  const renderLinks = () => {
    if (loading) return null;
    if (!user) {
      return [
        <Link key="login" href="/login" className="hover:underline">Login</Link>,
        <Link key="signup" href="/signup" className="hover:underline">Signup</Link>,
      ];
    }

    const links: ReactNode[] = [];
    if (user.role === 'ADMIN') {
      links.push(
        <Link key="events" href="/events" className="hover:underline">Eventos</Link>
      );
      links.push(
        <Link key="ticket-types" href="/ticket-types" className="hover:underline">Tipos de entradas</Link>
      );
      links.push(
        <Link key="users" href="/users" className="hover:underline">Usuarios</Link>
      );
    } else if (user.role === 'EVENT_MANAGER') {
      links.push(
        <Link key="events" href="/events" className="hover:underline">Eventos</Link>
      );
    }
    links.push(
      <button key="logout" onClick={logout} className="hover:underline">Logout</button>
    );
    return links;
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            EntraDa
          </Link>
          <nav className="space-x-4">
            {renderLinks()}
          </nav>
        </div>
      </div>
    </header>
  );
}
