import '@/styles/globals.css';
import CelestialBackground from '@/components/CelestialBackground';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { MdAutoAwesome, MdPause, MdPlayArrow } from 'react-icons/md';

export default function App({ Component, pageProps }: AppProps) {
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    try {
      setPaused(localStorage.getItem('borndate:motion-paused') === 'true');
    } catch {
      /* Storage is optional. */
    }
    return () => preference.removeEventListener('change', update);
  }, []);

  function toggleMotion() {
    const next = !paused;
    setPaused(next);
    try {
      localStorage.setItem('borndate:motion-paused', String(next));
    } catch {
      /* Keep the session preference. */
    }
  }

  return (
    <div
      className='app-shell'
      data-motion={paused || reducedMotion ? 'paused' : 'on'}
    >
      <Head>
        <title>
          BornDate — A little self-discovery, written in your birthday
        </title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Script
        async
        src='https://umami.07102020.xyz/script.js'
        data-website-id='f9863970-2bec-4d07-9f89-58f134ff8221'
        data-domains='borndate.web.app'
      />
      <CelestialBackground />
      <a className='skip-link' href='#main-content'>
        Skip to content
      </a>
      <header className='navbar'>
        <nav className='navbar-inner' aria-label='Main navigation'>
          <Link href='/' className='navbar-brand'>
            <MdAutoAwesome aria-hidden='true' />
            <span>
              BornDate<span className='brand-dot'>.</span>
            </span>
          </Link>
          <div className='nav-actions'>
            <span className='nav-caption'>A little closer to yourself</span>
            <button
              className='motion-toggle'
              onClick={toggleMotion}
              aria-pressed={paused || reducedMotion}
              disabled={reducedMotion}
              title={
                reducedMotion
                  ? 'Motion is off to match your device settings'
                  : 'Pause or resume decorative motion'
              }
            >
              {paused || reducedMotion ? (
                <MdPlayArrow aria-hidden='true' />
              ) : (
                <MdPause aria-hidden='true' />
              )}
              <span>
                {paused || reducedMotion ? 'Motion off' : 'Motion on'}
              </span>
            </button>
          </div>
        </nav>
      </header>
      <main id='main-content'>
        <Component {...pageProps} />
      </main>
      <footer className='footer'>
        <Link href='/' className='footer-brand'>
          BornDate.
        </Link>
        <p>A little wonder. A little self-discovery.</p>
        <span>Inspired by numerology</span>
      </footer>
    </div>
  );
}
