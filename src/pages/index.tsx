import { useEffect, useState } from 'react';
import EventSlider, { Event } from '../components/EventSlider';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  return (
    <>
      <EventSlider events={events} />

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
