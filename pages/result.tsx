import ResultExperience from '@/components/ResultExperience';
import { decodeDob, displayDob, parseDisplayDob } from '@/lib/dob';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function SharedResult() {
  const router = useRouter();
  const encoded = router.query.d;
  const decoded = typeof encoded === 'string' ? decodeDob(encoded) : '';
  const dob = decoded && !parseDisplayDob(decoded).error ? decoded : '';
  return (
    <>
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        <title>
          {dob ? `BornDate Reading — ${displayDob(dob)}` : 'BornDate Reading'}
        </title>
      </Head>
      <div className='reading-container'>
        {!router.isReady ? (
          <p className='text-secondary' role='status'>
            Opening your reading…
          </p>
        ) : dob ? (
          <>
            <div className='reading-toolbar'>
              <span className='eyebrow'>A shared discovery</span>
              <Link className='text-button' href='/'>
                Your own reading →
              </Link>
            </div>
            <ResultExperience key={dob} dob={dob} />
            <section className='shared-cta'>
              <span aria-hidden='true'>✧</span>
              <h2>What’s written in your birthday?</h2>
              <p className='text-secondary'>
                Your own little moment of discovery is one date away.
              </p>
              <Link className='primary-action-button' href='/'>
                Reveal my reading <span aria-hidden='true'>→</span>
              </Link>
            </section>
          </>
        ) : (
          <div className='empty-state'>
            <span className='empty-symbol' aria-hidden='true'>
              ✧
            </span>
            <p className='eyebrow'>Let’s start fresh</p>
            <h1>This reading link isn’t valid.</h1>
            <p className='text-secondary'>
              The link may be incomplete. You can still discover your own
              reading with just your birthday.
            </p>
            <Link className='primary-action-button' href='/'>
              Create a new reading <span aria-hidden='true'>→</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
