import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import { MdAutoAwesome } from 'react-icons/md';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>BornDate — Discover Your Birth Code</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Script
        async
        src="https://umami.07102020.xyz/script.js"
        data-website-id="f9863970-2bec-4d07-9f89-58f134ff8221"
        data-domains="borndate.web.app"
      />

      {/* Cosmic background orbs */}
      <div className='cosmic-bg' aria-hidden='true'>
        <div className='cosmic-orb cosmic-orb--1' />
        <div className='cosmic-orb cosmic-orb--2' />
        <div className='cosmic-orb cosmic-orb--3' />
      </div>

      {/* Navbar */}
      <nav className='navbar'>
        <div className='navbar-inner'>
          <Link href='/' className='navbar-brand'>
            <MdAutoAwesome size={22} />
            <span>BornDate</span>
          </Link>
        </div>
      </nav>

      {/* Page content */}
      <main style={{ flex: 1 }}>
        <Component {...pageProps} />
      </main>

      {/* Footer */}
      <footer className='footer'>
        <p className='footer-text'>
          Powered by <strong>Structured Numerology</strong>
        </p>
      </footer>
    </>
  );
}
