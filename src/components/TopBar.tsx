import Link from 'next/link';

export default function TopBar() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center">
          <Link href="/" className="text-xl font-bold">
            EntraDa
          </Link>
        </div>
      </div>
    </header>
  );
}
