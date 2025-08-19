import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <>
      <nav className="navbar">
        <div className="logo">EntraDa</div>
        <ul className="nav-links">
          <li><Link href="/login">Login</Link></li>
          <li><Link href="/signup">Signup</Link></li>
          <li><Link href="/recover">Recover</Link></li>
        </ul>
        <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? 'Light' : 'Dark'}
        </button>
      </nav>

      <header className="hero">
        <h1>Bienvenido a EntraDa</h1>
        <p>Soluciones innovadoras de autenticación y gestión de usuarios.</p>
      </header>

      <section className="info">
        <h2>Sobre la empresa</h2>
        <p>
          EntraDa es una empresa dedicada a proporcionar plataformas seguras y eficientes
          para el manejo de accesos digitales. Nuestro objetivo es ayudarte a proteger la
          información de tu organización con tecnologías modernas y fáciles de usar.
        </p>
      </section>
    </>
  );
}
