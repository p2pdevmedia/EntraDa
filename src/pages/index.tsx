import { useEffect, useState } from 'react';

interface Event {
  id: number;
  name: string;
  posterUrl?: string;
  sliderUrl?: string;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  useEffect(() => {
    if (events.length > 1) {
      const id = setInterval(() => {
        setCurrent(c => (c + 1) % events.length);
      }, 3000);
      return () => clearInterval(id);
    }
  }, [events.length]);

  const next = () => setCurrent((current + 1) % events.length);
  const prev = () => setCurrent((current - 1 + events.length) % events.length);

  return (
    <>
      {events.length > 0 && (
        <div className="relative w-full h-64 overflow-hidden mb-8">
          {events.map((ev, idx) => (
            ev.sliderUrl || ev.posterUrl ? (
              <img
                key={ev.id}
                src={ev.sliderUrl || ev.posterUrl || ''}
                alt={ev.name}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  idx === current ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ) : null
          ))}
          {events.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 px-2"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 px-2"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}

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
