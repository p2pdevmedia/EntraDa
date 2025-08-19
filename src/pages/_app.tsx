import type { AppProps } from 'next/app';
import '../styles/globals.css';
import TopBar from '../components/TopBar';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <TopBar />
      <div className="pt-16">
        <Component {...pageProps} />
      </div>
      <SpeedInsights />
    </>
  );
}
