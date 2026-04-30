import BirthDateFields from '@/components/BirthDateFields';
import CompatibilityChecker from '@/components/CompatibilityChecker';
import RecentReadings from '@/components/RecentReadings';
import ResultExperience from '@/components/ResultExperience';
import { DateParts, displayDob, dobToDateParts, parseDateParts } from '@/lib/dob';
import { SavedReading, getSavedReadings } from '@/lib/storage';
import { FormEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MdAutoAwesome, MdCompareArrows, MdHistory } from 'react-icons/md';

export default function Home() {
  const [value, setValue] = useState<DateParts>({ day: '', month: '', year: '' });
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [hasAttempted, setHasAttempted] = useState(false);
  const [readings, setReadings] = useState<SavedReading[]>([]);
  const [showCompatibility, setShowCompatibility] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReadings(getSavedReadings());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const queryValue = {
      day: String(params.get('birth-day') || '').replace(/\D/g, '').slice(0, 2),
      month: String(params.get('birth-month') || '').replace(/\D/g, '').slice(0, 2),
      year: String(params.get('birth-year') || '').replace(/\D/g, '').slice(0, 4),
    };

    if (!queryValue.day && !queryValue.month && !queryValue.year) return;

    setValue(queryValue);
    const parsed = parseDateParts(queryValue);
    if (parsed.error) {
      setError(parsed.error);
      setDob('');
    } else {
      setError('');
      setDob(parsed.dob);
    }
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  function getDatePartsFromForm(form: HTMLFormElement): DateParts {
    const data = new FormData(form);
    return {
      day: String(data.get('birth-day') || '').replace(/\D/g, '').slice(0, 2),
      month: String(data.get('birth-month') || '').replace(/\D/g, '').slice(0, 2),
      year: String(data.get('birth-year') || '').replace(/\D/g, '').slice(0, 4),
    };
  }

  function handleCalculate(nextValue: DateParts = value) {
    setHasAttempted(true);
    const parsed = parseDateParts(nextValue);
    if (parsed.error) {
      setError(parsed.error);
      setDob('');
      return;
    }

    setError('');
    setDob(parsed.dob);

    // Scroll to results after a brief delay
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextValue = getDatePartsFromForm(event.currentTarget);
    setValue(nextValue);
    handleCalculate(nextValue);
  }

  function handleButtonClick(event: MouseEvent<HTMLButtonElement>) {
    const form = event.currentTarget.form;
    if (!form) return;
    const nextValue = getDatePartsFromForm(form);
    setValue(nextValue);
    handleCalculate(nextValue);
  }

  function openReading(savedDob: string) {
    setValue(dobToDateParts(savedDob));
    setDob(savedDob);
    setError('');
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }

  return (
    <>
      {/* Hero Section */}
      <section
        style={{
          minHeight: dob ? 'auto' : '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: dob ? 'flex-start' : 'center',
          padding: dob ? '32px 0 0' : '0',
          transition: 'all 0.5s ease',
        }}
      >
        <div className='container'>
          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 32 }}
          >
            {!dob ? (
              <>
                <h1 className='heading-xl'>
                  Discover Your{' '}
                  <span className='text-gradient'>Birth Code</span>
                </h1>
                <p className='text-secondary' style={{ marginTop: 12, maxWidth: 460, margin: '12px auto 0' }}>
                  Pick your date. See your chart, element, and one practical step.
                </p>
              </>
            ) : (
              <p className='text-secondary text-sm'>
                Reading for <strong style={{ color: 'var(--text-primary)' }}>{displayDob(dob)}</strong>
                {' · '}
                <button
                  onClick={() => { setDob(''); setShowCompatibility(false); }}
                  style={{
                    color: 'var(--primary-purple)',
                    fontWeight: 500,
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    font: 'inherit',
                    fontSize: 'inherit',
                  }}
                >
                  New reading
                </button>
              </p>
            )}
          </motion.div>

          {/* Input Card */}
          {!dob && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className='glass-card glass-card--glow' style={{ maxWidth: 440, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <p style={{ fontWeight: 600, fontSize: '1.05rem' }}>
                    Enter your birth date
                  </p>
                  <p className='text-secondary text-sm' style={{ marginTop: 4 }}>
                    No signup. Saved only on your device.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  <BirthDateFields
                    namePrefix='birth'
                    value={value}
                    hasError={hasAttempted && !!error}
                    onChange={(nextValue) => {
                      setValue(nextValue);
                      setError('');
                      setHasAttempted(false);
                    }}
                  />

                  {error && hasAttempted && (
                    <p className='error-text' style={{ textAlign: 'center' }}>{error}</p>
                  )}

                  <div className='spacer-lg' />

                  <button
                    className='primary-action-button'
                    type='button'
                    onClick={handleButtonClick}
                  >
                    <MdAutoAwesome size={18} />
                    <span>Reveal My Reading</span>
                  </button>
                </form>
              </div>

              {/* Continue last reading */}
              {readings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  style={{ textAlign: 'center', marginTop: 20 }}
                >
                  <button
                    className='secondary-button'
                    onClick={() => openReading(readings[0].dob)}
                  >
                    <MdHistory size={16} />
                    Continue {displayDob(readings[0].dob)}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Result */}
          {dob && (
            <div ref={resultRef}>
              <ResultExperience dob={dob} onSaved={setReadings} />

              {/* Compatibility Hint */}
              {!showCompatibility && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div
                    className='compat-hint'
                    onClick={() => setShowCompatibility(true)}
                    role='button'
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setShowCompatibility(true)}
                  >
                    <MdCompareArrows size={22} style={{ color: 'var(--primary-purple)' }} />
                    <span className='compat-hint-text'>
                      Now check your compatibility with someone
                    </span>
                    <span className='compat-hint-arrow'>→</span>
                  </div>
                </motion.div>
              )}

              {/* Compatibility Checker */}
              <AnimatePresence>
                {showCompatibility && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ overflow: 'hidden', marginTop: 24 }}
                  >
                    <CompatibilityChecker />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className='spacer-2xl' />
            </div>
          )}

          {/* Recent Readings (shown when no active result) */}
          {!dob && readings.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ marginTop: 40 }}
            >
              <RecentReadings
                readings={readings}
                onOpen={openReading}
                onChange={setReadings}
              />
            </motion.div>
          )}

          {/* "What You Get" section (shown when no result) */}
          {!dob && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{ marginTop: 48 }}
            >
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h2 className='heading-lg'>What You Get</h2>
                <p className='text-secondary' style={{ marginTop: 4 }}>
                  Simple result first. Details when you want them.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 440, margin: '0 auto' }}>
                <FeatureCard
                  emoji='🌟'
                  title='Your chart & element'
                  description='A visual numerology chart with your dominant element explained in plain language.'
                />
                <FeatureCard
                  emoji='🔮'
                  title='Personal reading'
                  description='Spirit, physical, and ending numbers turned into a short profile with practical strengths.'
                />
                <FeatureCard
                  emoji='📤'
                  title='Share & compare'
                  description='Share your result on social media, download a card, or compare with someone else.'
                />
              </div>
              <div className='spacer-3xl' />
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}

/* --- Feature Card --- */
function FeatureCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className='glass-card' style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <span style={{ fontSize: '1.5rem', flexShrink: 0, marginTop: 2 }}>{emoji}</span>
      <div>
        <p style={{ fontWeight: 600, marginBottom: 2 }}>{title}</p>
        <p className='text-secondary text-sm'>{description}</p>
      </div>
    </div>
  );
}
