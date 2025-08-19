import Link from 'next/link';
import { useState } from 'react';

interface NavbarProps {
  isAuthenticated?: boolean;
  isAdmin?: boolean;
  onLogout?: () => void;
}

export default function Navbar({
  isAuthenticated = false,
  isAdmin = false,
  onLogout,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  type NavItem = {
    label: string;
    href?: string;
    type?: 'link' | 'button';
    onClick?: () => void;
  };

  const guestItems: NavItem[] = [
    { href: '/login', label: 'Login' },
    { href: '/register', label: 'Register' },
  ];

  const authenticatedItems: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/events', label: 'Eventos' },
    ...(isAdmin ? [{ href: '/users', label: 'Usuarios' }] : []),
    { href: '/ticket-types', label: 'Tipos de Entradas' },
    { label: 'Logout', type: 'button', onClick: onLogout },
  ];

  const navItems = isAuthenticated ? authenticatedItems : guestItems;

  const renderItems = (itemClass: string) =>
    navItems.map((item) =>
      item.type === 'button' ? (
        <button
          key={item.label}
          onClick={item.onClick}
          className={`bg-red-500 text-white ${itemClass} hover:bg-red-600`}
        >
          {item.label}
        </button>
      ) : (
        <Link
          key={item.label}
          href={item.href!}
          className={`hover:bg-gray-200 ${itemClass}`}
        >
          {item.label}
        </Link>
      )
    );

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold">
              EntraDa
            </Link>
          </div>
          <div className="flex items-center">
            <div className="hidden md:flex md:space-x-4">
              {renderItems('px-3 py-2 rounded block')}
            </div>
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:bg-gray-200"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
          {renderItems('block px-3 py-2 rounded')}
        </div>
      )}
    </nav>
  );
}

