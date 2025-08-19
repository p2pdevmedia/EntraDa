import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(document.cookie.includes('session='));
    };
    checkLogin();
    router.events.on('routeChangeComplete', checkLogin);
    return () => {
      router.events.off('routeChangeComplete', checkLogin);
    };
  }, [router.events]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout');
    setIsLoggedIn(false);
    setMenuOpen(false);
    router.push('/');
  };

  const renderLinks = () => {
    if (isLoggedIn) {
      return (
        <>
          <Link
            href="/dashboard"
            className="text-white px-3 py-2 rounded hover:bg-white/20"
          >
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
          >
            Logout
          </button>
        </>
      );
    }
    return (
      <>
        <Link
          href="/login"
          className="text-white px-3 py-2 rounded hover:bg-white/20"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="text-white px-3 py-2 rounded hover:bg-white/20"
        >
          Register
        </Link>
      </>
    );
  };

  return (
    <nav className="bg-primary-gradient fixed top-0 left-0 w-full z-50 shadow">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-white font-bold text-xl">
              EntraDa
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {renderLinks()}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="flex flex-col space-y-2">
            {renderLinks()}
          </div>
        </div>
      )}
    </nav>
  );
}
