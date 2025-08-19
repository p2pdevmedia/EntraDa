import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <nav className="bg-primary-gradient fixed top-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-4xl mx-auto rounded-full shadow-lg backdrop-blur-md flex items-center justify-between px-6 py-3 text-white z-50">
      <div className="font-bold">EntraDa</div>
      <ul className="flex space-x-4">
        <li><Link href="/">Inicio</Link></li>
        <li><Link href="/login">Login</Link></li>
        <li><Link href="/signup">Signup</Link></li>
        <li><Link href="/recover">Recover</Link></li>
      </ul>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="border-2 border-white rounded-full px-3 py-1"
      >
        {darkMode ? 'Light' : 'Dark'}
      </button>
    </nav>
  );
}
