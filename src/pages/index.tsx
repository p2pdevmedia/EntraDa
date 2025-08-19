import { useEffect, useState } from 'react';
import Link from 'next/link';
import EventSlider, { Event } from '../components/EventSlider';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  const filteredEvents = events.filter(ev =>
    ev.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
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

      <EventSlider events={events} />

      <section className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Eventos</h2>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre"
          className="border p-2 w-full mb-4"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredEvents.map(ev => (
            <Link
              key={ev.id}
              href={`/buy/${ev.id}`}
              className="border rounded p-4 hover:shadow cursor-pointer"
            >
              {ev.posterUrl && (
                <img
                  src={ev.posterUrl}
                  alt={ev.name}
                  className="w-full h-48 object-cover mb-2"
                />
              )}
              <h3 className="text-lg font-semibold">{ev.name}</h3>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
