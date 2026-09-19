import BirthDateFields from '@/components/BirthDateFields';
import RecentReadings from '@/components/RecentReadings';
import ResultExperience from '@/components/ResultExperience';
import { DateParts, dobToDateParts, parseDateParts } from '@/lib/dob';
import { SavedReading, getSavedReadings } from '@/lib/storage';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { MdArrowForward, MdAutoAwesome, MdLockOutline } from 'react-icons/md';

export default function Home() {
  const router = useRouter();
  const [value, setValue] = useState<DateParts>({
    day: '',
    month: '',
    year: '',
  });
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [readings, setReadings] = useState<SavedReading[]>([]);

  useEffect(() => {
    if (!router.isReady) return;
    setReadings(getSavedReadings());
    const params = new URLSearchParams(window.location.search);
    const queryValue = {
      day: String(params.get('birth-day') || '')
        .replace(/\D/g, '')
        .slice(0, 2),
      month: String(params.get('birth-month') || '')
        .replace(/\D/g, '')
        .slice(0, 2),
      year: String(params.get('birth-year') || '')
        .replace(/\D/g, '')
        .slice(0, 4),
    };
    if (!queryValue.day && !queryValue.month && !queryValue.year) return;
    setValue(queryValue);
    const parsed = parseDateParts(queryValue);
    setError(parsed.error);
    setDob(parsed.dob);
    window.history.replaceState(null, '', window.location.pathname);
  }, [router.isReady]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = {
      day: String(data.get('birth-day') || ''),
      month: String(data.get('birth-month') || ''),
      year: String(data.get('birth-year') || ''),
    };
    setValue(next);
    const parsed = parseDateParts(next);
    setError(parsed.error);
    setDob(parsed.dob);
    if (parsed.error)
      event.currentTarget.querySelector<HTMLInputElement>('input')?.focus();
  }

  function openReading(savedDob: string) {
    setValue(dobToDateParts(savedDob));
    const parsed = parseDateParts(dobToDateParts(savedDob));
    setError(parsed.error);
    setDob(parsed.dob);
  }

  function restart() {
    setDob('');
    setError('');
    requestAnimationFrame(() => document.getElementById('birth-day')?.focus());
  }

  if (dob)
    return (
      <div className='reading-container'>
        <div className='reading-toolbar'>
          <span className='eyebrow'>Your moment of discovery</span>
          <button className='text-button' onClick={restart}>
            ← New reading
          </button>
        </div>
        <ResultExperience
          key={dob}
          dob={dob}
          onSaved={setReadings}
          focusOnMount
        />
      </div>
    );

  return (
    <div className='container home-page'>
      <section className='hero' aria-labelledby='home-title'>
        <div className='hero-copy fade-in'>
          <p className='eyebrow'>
            <span className='tiny-star' aria-hidden='true'>
              ✧
            </span>{' '}
            A birthday. A little insight. You.
          </p>
          <h1 id='home-title'>
            Discover what your <em>birth date</em> says about you.
          </h1>
          <p className='hero-description'>
            Numerology connects your birthday with your personality, strengths,
            and natural energy.
          </p>
          <div className='journey' role='group' aria-label='How it works'>
            <span>
              <b>01</b> Your birthday
            </span>
            <i aria-hidden='true'>—</i>
            <span>
              <b>02</b> Your reading
            </span>
            <i aria-hidden='true'>—</i>
            <span>
              <b>03</b> Your discovery
            </span>
          </div>
          <div className='celestial-seal' aria-hidden='true'>
            <div className='seal-orbit' />
            <div className='seal-orbit seal-orbit--inner' />
            <span className='seal-star'>✧</span>
            <span className='seal-caption'>A LITTLE WONDER WITHIN</span>
            <span className='seal-spark seal-spark--one'>✦</span>
            <span className='seal-spark seal-spark--two'>✧</span>
          </div>
        </div>
        <div className='birth-card fade-in'>
          <div className='card-symbol' aria-hidden='true'>
            <MdAutoAwesome />
          </div>
          <p className='eyebrow'>Your story starts here</p>
          <h2>When were you born?</h2>
          <p className='text-secondary'>One date. A new perspective on you.</p>
          <form onSubmit={handleSubmit} noValidate>
            <BirthDateFields
              namePrefix='birth'
              value={value}
              hasError={!!error}
              describedBy={error ? 'birth-error' : 'birth-hint'}
              onChange={(next) => {
                setValue(next);
                setError('');
              }}
            />
            <p id='birth-hint' className='field-hint'>
              Day / month / year · e.g. 07 / 10 / 1995
            </p>
            {error && (
              <p id='birth-error' className='error-text' role='alert'>
                {error}
              </p>
            )}
            <button className='primary-action-button' type='submit'>
              <span>Reveal my reading</span>
              <MdArrowForward aria-hidden='true' />
            </button>
          </form>
          <p className='privacy-note'>
            <MdLockOutline aria-hidden='true' /> No signup. Readings saved on
            this device.
          </p>
          <div className='card-bottom-note'>
            <span aria-hidden='true'>✧</span> A small pause to discover
            something about yourself.
          </div>
        </div>
      </section>
      {readings.length > 0 && (
        <RecentReadings
          readings={readings}
          onOpen={openReading}
          onChange={setReadings}
        />
      )}
      <section className='discovery-section' aria-labelledby='discovery-title'>
        <div className='section-intro'>
          <p className='eyebrow'>More than just a number</p>
          <h2 id='discovery-title'>A little insight goes a long way.</h2>
          <p className='text-secondary'>
            Your reading, made simple. Go deeper whenever you like.
          </p>
        </div>
        <div className='feature-grid'>
          <Feature
            number='01'
            symbol='✧'
            title='Meet your element'
            description='Discover the energy at the heart of your reading, and what it means in everyday life.'
          />
          <Feature
            number='02'
            symbol='☼'
            title='See yourself a little clearer'
            description='Explore your natural strengths and leave with one small, practical step to try.'
          />
          <Feature
            number='03'
            symbol='⌘'
            title='Make a connection'
            description='Share a little of yourself, or compare birthdays with a friend, partner, or someone close.'
          />
        </div>
      </section>
    </div>
  );
}

function Feature({
  number,
  symbol,
  title,
  description,
}: {
  number: string;
  symbol: string;
  title: string;
  description: string;
}) {
  return (
    <article className='feature'>
      <div className='feature-top'>
        <span aria-hidden='true'>{symbol}</span>
        <span>{number}</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
