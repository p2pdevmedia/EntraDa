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
    title: 'Escuela y salidas guiadas',
    description:
      'Inspirado en el estilo de sitios de escalada modernos, con foco en comunidad, progresión técnica y seguridad en roca.',
  },
  {
    title: 'Información clara por sectores',
    description:
      'Topos, cantidad de vías y altura máxima para que armes tu día según nivel y objetivos.',
  },
  {
    title: 'Experiencia outdoor completa',
    description:
      'Entrenamiento, escalada, ambiente de montaña y soporte para quienes quieren empezar o mejorar.',
  },
];

const supporterBenefits = [
  'Acceso a topos y reseñas premium en toda el área de Potrero Alto.',
  'Historial de ascensos y tracking personal de proyectos.',
  'Navegación sin anuncios y herramientas avanzadas de planificación.',
  'Beneficios exclusivos con aliados de la comunidad escaladora.',
];

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-100 text-stone-800">
      <header className="relative overflow-hidden bg-stone-900 text-white">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=2000&q=80')",
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/75 to-emerald-900/50" />

        <nav className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">Escalada · Argentina</p>
            <p className="text-xl font-semibold">Potrero Alto</p>
          </div>
          <div className="hidden items-center gap-5 text-sm font-medium md:flex">
            <a href="#sectores" className="transition hover:text-emerald-300">Sectores</a>
            <a href="#beneficios" className="transition hover:text-emerald-300">Beneficios</a>
            <Link href="/login" className="rounded-full border border-white/60 px-4 py-2 transition hover:bg-white/10">
              Ingresar
            </Link>
          </div>
        </nav>

        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-8 sm:pb-28 sm:pt-12">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-emerald-300/60 bg-emerald-400/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
              Crag Guide
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              Descubrí Potrero Alto, una experiencia de escalada auténtica
            </h1>
            <p className="mt-5 max-w-2xl text-base text-stone-200 sm:text-lg">
              Web renovada en formato escuela/guía, con estilo limpio y outdoor: sectores, datos clave y beneficios
              para la comunidad escaladora.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/events"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
              >
                Ver sectores
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Sumarme a la comunidad
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {highlights.map(item => (
            <article key={item.title} className="rounded-2xl border border-stone-200 bg-white p-7 shadow-sm">
              <h2 className="text-xl font-semibold text-stone-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="sectores" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 bg-stone-50 px-6 py-5 sm:px-8">
            <h2 className="text-2xl font-semibold text-stone-900 sm:text-3xl">Subsectores de Potrero Alto</h2>
            <p className="mt-2 text-sm text-stone-600">
              Todos los sectores registrados como <strong>Sport climbing</strong>.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-stone-900 text-stone-100">
                <tr>
                  <th className="px-6 py-4 sm:px-8">#</th>
                  <th className="px-6 py-4 sm:px-8">Sector / Área</th>
                  <th className="px-6 py-4 sm:px-8">Tipo</th>
                  <th className="px-6 py-4 sm:px-8">Paredes</th>
                  <th className="px-6 py-4 sm:px-8">Vías</th>
                  <th className="px-6 py-4 sm:px-8">Altura máx.</th>
                </tr>
              </thead>
              <tbody>
                {sectors.map(sector => (
                  <tr key={sector.id} className="border-t border-stone-100 hover:bg-emerald-50/60">
                    <td className="px-6 py-4 sm:px-8">{sector.id}</td>
                    <td className="px-6 py-4 font-medium sm:px-8">{sector.name}</td>
                    <td className="px-6 py-4 sm:px-8">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
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

      <section id="beneficios" className="bg-stone-900 py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold sm:text-4xl">Supporting theCrag is not only good for your Karma</h2>
              <p className="mt-4 text-sm text-stone-300 sm:text-base">
                It also gives you access to great benefits on theCrag and beyond.
              </p>
              <h3 className="mt-8 text-lg font-semibold text-emerald-300">Supporter Benefits</h3>
            </div>
            <ul className="grid gap-3 text-sm">
              {supporterBenefits.map(benefit => (
                <li key={benefit} className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-stone-100">
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-7 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full border border-white/60 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
