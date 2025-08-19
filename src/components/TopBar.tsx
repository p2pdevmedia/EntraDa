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

  const handleLogout = async () => {
    await fetch('/api/auth/logout');
    window.location.href = '/';
  };

  const renderNavLinks = (): ReactNode => {
    if (loading || !user) return null;
    const links: ReactNode[] = [];
    if (user.role === 'ADMIN') {
      links.push(
        <Link
          key="events"
          href="/events"
          className="hover:text-blue-400 transition"
        >
          Eventos
        </Link>,
        <Link
          key="ticket-types"
          href="/ticket-types"
          className="hover:text-blue-400 transition"
        >
          Tipos de entradas
        </Link>,
        <Link
          key="users"
          href="/users"
          className="hover:text-blue-400 transition"
        >
          Usuarios
        </Link>
      );
    } else if (user.role === 'EVENT_MANAGER') {
      links.push(
        <Link
          key="events"
          href="/events"
          className="hover:text-blue-400 transition"
        >
          Eventos
        </Link>
      );
    }
    return links;
  };

  const renderAuthLinks = (): ReactNode => {
    if (loading) return null;
    if (user) {
      return (
        <button
          onClick={handleLogout}
          className="px-3 py-1 border border-red-500 rounded-full hover:bg-red-500 hover:text-white transition"
        >
          Logout
        </button>
      );
    }
    return (
      <>
        <Link
          href="/login"
          className="px-3 py-1 border border-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="px-3 py-1 border border-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition"
        >
          Signup
        </Link>
      </>
    );
  };

  return (
    <nav className="fixed top-4 inset-x-0 z-50 flex justify-center pointer-events-none">
      <div
        className="flex items-center justify-between gap-6 px-6 py-2 bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-full pointer-events-auto shadow-lg max-w-5xl w-full mx-auto"
      >
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight hover:opacity-80 transition"
        >
          EntraDa
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          {renderNavLinks()}
        </div>
        <div className="flex items-center gap-3 text-sm">
          {renderAuthLinks()}
        </div>
      </div>
    </nav>
  );
}
