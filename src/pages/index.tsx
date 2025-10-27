import Link from 'next/link';

const coverages = [
  {
    title: 'Cobertura Automotriz Integral',
    description:
      'Protección contra accidentes, robo y daños a terceros para tu vehículo con asistencia en carretera 24/7.',
  },
  {
    title: 'Cobertura para Hogares',
    description:
      'Respaldo para tu vivienda ante incendios, inundaciones, responsabilidad civil y asistencia de emergencias domésticas.',
  },
  {
    title: 'Planes Combinados',
    description:
      'Unifica la protección de tu auto y hogar en un solo plan inteligente con descuentos por buen historial.',
  },
];

const highlights = [
  {
    title: 'Pagos Mensuales al Pool',
    description:
      'Cada asegurado aporta su prima mensual a un fondo común auto gestionado por contratos inteligentes auditables.',
  },
  {
    title: 'Smart Contract Transparente',
    description:
      'El contrato administra aportaciones, registra siniestros y distribuye pagos automáticamente bajo reglas verificables.',
  },
  {
    title: 'Retiro Multicontrolado',
    description:
      'Tres propietarios autorizados deben aprobar cualquier retiro del pool para cubrir siniestros, garantizando gobernanza compartida.',
  },
];

const owners = [
  { name: 'Ana Morales', role: 'Gestora de Riesgos', focus: 'Evalúa siniestros y autoriza pagos proporcionales.' },
  { name: 'Luis Cabrera', role: 'Director Financiero', focus: 'Supervisa reservas y liquidez del pool.' },
  { name: 'María Chen', role: 'Especialista en Smart Contracts', focus: 'Audita el contrato y ejecuta las solicitudes en cadena.' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header
        className="relative overflow-hidden text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1800&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/85 to-emerald-900/70" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center sm:py-28">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
            Pool asegurador descentralizado
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Protege autos y hogares con contratos inteligentes transparentes
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-200">
            Tus aportes mensuales se integran en un fondo común auditable que maximiza liquidez, minimiza fraude y
            asegura la gobernanza mediante la aprobación de tres owners para liberar pagos ante siniestros.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 via-sky-500 to-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:scale-[1.02] focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
            >
              <span>Crear cuenta</span>
              <svg
                className="ml-3 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 10h10m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-white/60 px-8 py-3 text-base font-semibold text-white transition hover:border-emerald-300 hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/60"
            >
              Ver dashboard en vivo
            </Link>
          </div>
        </div>
      </header>

      <section className="relative mx-auto mt-16 max-w-6xl px-6">
        <div className="absolute -inset-x-10 top-1/2 -z-10 h-72 -translate-y-1/2 rounded-3xl bg-gradient-to-r from-slate-800/60 via-slate-900/50 to-sky-900/60 blur-3xl" />
        <h2 className="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          ¿Cómo funciona el pool inteligente?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-slate-300 sm:text-base">
          Cada aporte queda registrado en la cadena, permitiendo auditorías en tiempo real y liberaciones controladas de
          capital en caso de siniestros.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {highlights.map(item => (
            <article
              key={item.title}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/70 p-8 shadow-lg shadow-sky-900/40 backdrop-blur"
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-400/20 via-sky-500/10 to-blue-600/5 blur-2xl transition duration-300 group-hover:scale-125" />
              <div className="relative">
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-slate-300">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative mt-24 bg-gradient-to-br from-emerald-500/15 via-sky-500/10 to-blue-600/10 py-20">
        <div className="absolute inset-x-0 -top-10 -z-10 h-20 bg-gradient-to-b from-black/40 to-transparent" />
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Planes de cobertura
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-slate-200 sm:text-base">
            Diseñados para proteger cada aspecto de tu patrimonio con condiciones transparentes y liquidaciones ágiles.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {coverages.map(plan => (
              <article
                key={plan.title}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 text-white shadow-xl backdrop-blur"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-emerald-300/10 to-sky-400/10 opacity-80" />
                <div className="relative">
                  <h3 className="text-xl font-semibold">{plan.title}</h3>
                  <p className="mt-3 text-sm text-slate-100/80">{plan.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto mt-24 max-w-6xl px-6 pb-24">
        <div className="absolute inset-x-0 top-0 -z-10 h-full rounded-3xl border border-white/5 bg-slate-900/60 shadow-2xl shadow-emerald-900/40" />
        <div className="relative rounded-3xl px-6 py-16 sm:px-10 md:px-16">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">Gobernanza del pool</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm text-slate-300 sm:text-base">
            Los retiros requieren la aprobación conjunta de tres owners que vigilan riesgos, liquidez y ejecución técnica
            del contrato. Cada movimiento queda registrado en la cadena para auditorías continuas y transparencia total.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {owners.map(owner => (
              <article
                key={owner.name}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 text-white shadow-lg shadow-emerald-900/30 backdrop-blur"
              >
                <h3 className="text-xl font-semibold">{owner.name}</h3>
                <p className="mt-2 text-xs uppercase tracking-[0.35em] text-emerald-300/80">{owner.role}</p>
                <p className="mt-4 text-sm text-slate-100/80">{owner.focus}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden bg-slate-950"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1529429617124-aee711a67bb1?auto=format&fit=crop&w=1800&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/85 to-sky-900/75" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-20 text-center text-white">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Protege hoy tu patrimonio</h2>
          <p className="mt-4 max-w-3xl text-sm text-slate-200 sm:text-base">
            Integra tus pólizas de auto y hogar en una plataforma descentralizada que da visibilidad total a tus fondos.
            Configura aportaciones automáticas, monitorea reservas en tiempo real y responde a siniestros sin fricción.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:scale-[1.02] focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center rounded-full border border-white/60 px-8 py-3 text-base font-semibold text-white transition hover:border-emerald-300 hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/60"
            >
              Ver whitepaper
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
