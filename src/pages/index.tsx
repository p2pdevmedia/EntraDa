import type { GetServerSideProps } from 'next';
import EventSlider from '../components/EventSlider';
import { prisma } from '../lib/prisma';

interface HomeProps {
  sliderImages: string[];
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const events = await prisma.event.findMany({
    select: { sliderUrl: true },
    where: { sliderUrl: { not: null } },
  });
  return { props: { sliderImages: events.map((e) => e.sliderUrl as string) } };
};

export default function Home({ sliderImages }: HomeProps) {
  return (
    <>
      <EventSlider images={sliderImages} />
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
