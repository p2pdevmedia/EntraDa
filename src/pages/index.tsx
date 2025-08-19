import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Bienvenido</h1>
      <nav>
        <ul>
          <li><Link href="/login">Login</Link></li>
          <li><Link href="/signup">Signup</Link></li>
          <li><Link href="/recover">Recover Password</Link></li>
        </ul>
      </nav>
    </div>
  );
}
