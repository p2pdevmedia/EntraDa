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
    <nav className="bg-white w-full flex relative justify-between items-center px-6 md:px-8 h-20 shadow-sm border-b">
      <div className="inline-flex items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-semibold tracking-tight text-gray-900 group-hover:text-blue-600 transition">
            EntraDa
          </span>
        </Link>
      </div>

      <div className="hidden md:flex flex-1 justify-center px-6">
        <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
          {renderNavLinks()}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 text-sm font-medium">
        {renderAuthLinks()}
      </div>
    </nav>
  );
}
