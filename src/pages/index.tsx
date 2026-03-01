import Link from 'next/link';

const sectors = [
  { id: 1, name: 'Cheto / Pared Este', type: 'Sport climbing', walls: 8, routes: 31, maxHeight: '18m' },
  { id: 2, name: 'Cañadón', type: 'Sport climbing', walls: 2, routes: 6, maxHeight: '15m' },
  { id: 3, name: 'El Tablero', type: 'Sport climbing', walls: 18, routes: 187, maxHeight: '18m' },
  { id: 4, name: 'El Derrumbe', type: 'Sport climbing', walls: 6, routes: 47, maxHeight: '26m' },
  { id: 5, name: 'La Chanchería', type: 'Sport climbing', walls: 9, routes: 51, maxHeight: '18m' },
  { id: 6, name: 'El Arco', type: 'Sport climbing', walls: 8, routes: 28, maxHeight: '15m' },
  { id: 7, name: 'Croto', type: 'Sport climbing', walls: 5, routes: 22, maxHeight: '20m' },
];

const highlights = [
  {
    title: 'Escalada deportiva para todos los niveles',
    description:
      'Desde placas técnicas hasta desplomes físicos, Potrero Alto ofrece líneas equipadas para progresar y disfrutar en roca real.',
  },
  {
    title: 'Accesos por áreas y subsectores',
    description:
      'Organizamos la zona por sectores para planificar mejor tus jornadas, evitar aglomeraciones y elegir pared según orientación solar.',
  },
  {
    title: 'Comunidad activa y actualizaciones',
    description:
      'Consulta novedades, nuevos encadenes y recomendaciones de seguridad para aprovechar cada visita al máximo.',
  },
];

const supporterBenefits = [
  'Acceso a topos y reseñas premium en toda el área de Potrero Alto.',
  'Historial de ascensos y tracking personal de proyectos.',
  'Navegación sin anuncios y herramientas avanzadas de planificación.',
  'Descuentos y beneficios exclusivos en servicios y marcas asociadas.',
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070f] text-zinc-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-20rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-cyan-500/25 blur-[140px]" />
        <div className="absolute bottom-[-18rem] right-[-10rem] h-[35rem] w-[35rem] rounded-full bg-fuchsia-500/20 blur-[130px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:42px_42px] opacity-[0.08]" />
      </div>

      <header className="relative mx-auto max-w-6xl px-6 pt-10 sm:pt-14">
        <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/[0.04] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
          <div
            className="relative"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1800&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#05070f]/90 via-[#090f20]/85 to-[#21112f]/80" />
            <div className="relative px-6 py-20 text-center sm:px-10 sm:py-24">
              <span className="inline-flex items-center rounded-full border border-cyan-300/40 bg-cyan-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-200">
                Guía de escalada · Argentina
              </span>
              <h1 className="mt-6 bg-gradient-to-r from-cyan-200 via-white to-fuchsia-200 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
                Potrero Alto
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-zinc-200 sm:text-lg">
                Un crag de escalada deportiva con sectores clásicos y modernas líneas equipadas. Explorá rutas por
                subsector, altura y cantidad de vías para preparar tu próxima salida.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center rounded-full border border-cyan-300/50 bg-gradient-to-r from-cyan-500 to-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-[0_0_40px_rgba(56,189,248,0.35)] transition hover:scale-[1.02]"
                >
                  Ver sectores
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/[0.06] px-8 py-3 text-base font-semibold text-white backdrop-blur transition hover:border-fuchsia-300/60 hover:bg-white/[0.12]"
                >
                  Crear cuenta de escalador
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="relative mx-auto mt-16 max-w-6xl px-6">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">¿Qué encontrás en Potrero Alto?</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {highlights.map(item => (
            <article
              key={item.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl"
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-400/20 blur-2xl transition duration-500 group-hover:scale-125" />
              <h3 className="relative text-xl font-semibold text-white">{item.title}</h3>
              <p className="relative mt-3 text-sm leading-relaxed text-zinc-300">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-6">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_10px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="border-b border-white/10 bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-fuchsia-500/10 px-6 py-5 sm:px-8">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">Subsectores y datos clave</h2>
            <p className="mt-2 text-sm text-zinc-300">Todos los sectores registrados como escalada deportiva.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/[0.03] text-zinc-200">
                <tr>
                  <th className="px-6 py-4 font-semibold sm:px-8">#</th>
                  <th className="px-6 py-4 font-semibold sm:px-8">Sector / Área</th>
                  <th className="px-6 py-4 font-semibold sm:px-8">Tipo</th>
                  <th className="px-6 py-4 font-semibold sm:px-8">Paredes</th>
                  <th className="px-6 py-4 font-semibold sm:px-8">Vías</th>
                  <th className="px-6 py-4 font-semibold sm:px-8">Altura máx.</th>
                </tr>
              </thead>
              <tbody>
                {sectors.map(sector => (
                  <tr key={sector.id} className="border-t border-white/10 text-zinc-100 transition hover:bg-cyan-400/[0.06]">
                    <td className="px-6 py-4 sm:px-8">{sector.id}</td>
                    <td className="px-6 py-4 sm:px-8 font-medium">{sector.name}</td>
                    <td className="px-6 py-4 sm:px-8">
                      <span className="rounded-full border border-cyan-300/40 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                        {sector.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 sm:px-8">{sector.walls}</td>
                    <td className="px-6 py-4 sm:px-8">{sector.routes}</td>
                    <td className="px-6 py-4 sm:px-8">{sector.maxHeight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="relative mx-auto mt-24 max-w-6xl px-6 pb-24">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-cyan-500/10 px-6 py-14 text-center shadow-[0_10px_70px_rgba(34,211,238,0.16)] backdrop-blur-2xl sm:px-10">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Supporting theCrag is not only good for your Karma
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm text-zinc-200 sm:text-base">
            It also gives you access to great benefits on theCrag and beyond.
          </p>
          <h3 className="mt-8 text-xl font-semibold text-cyan-300">Supporter Benefits</h3>
          <ul className="mx-auto mt-5 grid max-w-4xl grid-cols-1 gap-4 text-left text-sm text-zinc-100 sm:grid-cols-2">
            {supporterBenefits.map(benefit => (
              <li key={benefit} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur">
                {benefit}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-fuchsia-300/50 bg-gradient-to-r from-fuchsia-500 to-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-[0_0_40px_rgba(217,70,239,0.35)] transition hover:scale-[1.02]"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
