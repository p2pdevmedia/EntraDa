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
    <>
      <header className="hero bg-gradient-to-r from-sky-900 via-slate-900 to-slate-800 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">SeguraPool</h1>
        <p className="max-w-2xl mx-auto text-lg">
          La plataforma de seguros de autos y hogares donde tus pagos mensuales alimentan un pool gestionado con
          contratos inteligentes. Transparencia, seguridad y liquidez para responder a cada siniestro.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-white text-slate-900 px-6 py-3 rounded font-semibold shadow hover:bg-slate-100"
          >
            Crear cuenta
          </Link>
          <Link
            href="/dashboard"
            className="border border-white px-6 py-3 rounded font-semibold hover:bg-white hover:text-slate-900"
          >
            Ver dashboard
          </Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">¿Cómo funciona el pool inteligente?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map(item => (
            <article key={item.title} className="border rounded-lg p-6 shadow-sm bg-white">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-100 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Planes de cobertura</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coverages.map(plan => (
              <article key={plan.title} className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
                <p className="text-slate-600">{plan.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Gobernanza del pool</h2>
        <p className="text-center text-slate-600 mb-10">
          Los retiros para pagar siniestros requieren la aprobación conjunta de tres owners que representan las áreas
          críticas del negocio. Cada operación queda registrada en la cadena para auditorías continuas.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {owners.map(owner => (
            <article key={owner.name} className="border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold">{owner.name}</h3>
              <p className="text-sm text-slate-500 mb-2">{owner.role}</p>
              <p className="text-slate-600">{owner.focus}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Protege hoy tu patrimonio</h2>
          <p className="text-slate-200 mb-8">
            Integra tus pólizas de auto y hogar en una plataforma descentralizada que da visibilidad total a tus fondos.
            Configura aportaciones automáticas, monitorea reservas en tiempo real y responde a siniestros sin fricción.
          </p>
          <Link
            href="/login"
            className="bg-white text-slate-900 px-6 py-3 rounded font-semibold shadow hover:bg-slate-100"
          >
            Iniciar sesión
          </Link>
        </div>
      </section>
    </>
  );
}
