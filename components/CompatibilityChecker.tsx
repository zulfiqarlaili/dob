import BirthDateFields from '@/components/BirthDateFields';
import { FormEvent, MouseEvent, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MdCompareArrows } from 'react-icons/md';
import { API_BASE_URL, CompatibilityResponse } from '@/lib/api';
import { DateParts, displayDob, parseDateParts } from '@/lib/dob';
import ElementBadge from './ElementBadge';

export default function CompatibilityChecker() {
  const [firstValue, setFirstValue] = useState<DateParts>({
    day: '',
    month: '',
    year: '',
  });
  const [secondValue, setSecondValue] = useState<DateParts>({
    day: '',
    month: '',
    year: '',
  });
  const [result, setResult] = useState<CompatibilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function getDatePartsFromForm(form: HTMLFormElement, prefix: string): DateParts {
    const data = new FormData(form);
    return {
      day: String(data.get(`${prefix}-day`) || '').replace(/\D/g, '').slice(0, 2),
      month: String(data.get(`${prefix}-month`) || '').replace(/\D/g, '').slice(0, 2),
      year: String(data.get(`${prefix}-year`) || '').replace(/\D/g, '').slice(0, 4),
    };
  }

  async function compare(
    nextFirstValue: DateParts = firstValue,
    nextSecondValue: DateParts = secondValue,
  ) {
    const first = parseDateParts(nextFirstValue);
    const second = parseDateParts(nextSecondValue);
    if (first.error || second.error) {
      setError(first.error || second.error);
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/compatibility/${first.dob}/${second.dob}`,
      );
      if (!response.ok) throw new Error('Unable to compare these readings.');
      setResult(await response.json());
    } catch (compareError) {
      setError(compareError instanceof Error ? compareError.message : 'Unable to compare.');
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextFirstValue = getDatePartsFromForm(event.currentTarget, 'first');
    const nextSecondValue = getDatePartsFromForm(event.currentTarget, 'second');
    setFirstValue(nextFirstValue);
    setSecondValue(nextSecondValue);
    compare(nextFirstValue, nextSecondValue);
  }

  function handleButtonClick(event: MouseEvent<HTMLButtonElement>) {
    const form = event.currentTarget.form;
    if (!form) return;
    const nextFirstValue = getDatePartsFromForm(form, 'first');
    const nextSecondValue = getDatePartsFromForm(form, 'second');
    setFirstValue(nextFirstValue);
    setSecondValue(nextSecondValue);
    compare(nextFirstValue, nextSecondValue);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className='glass-card'>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h3 className='heading-md'>Compare Two Birthdates</h3>
          <p className='text-secondary text-sm' style={{ marginTop: 4 }}>
            Check compatibility for partner, friend, family, or work relationships.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* First person */}
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 8 }}>
                First birthdate
              </p>
              <BirthDateFields
                namePrefix='first'
                prefix='First birth'
                value={firstValue}
                onChange={(nextValue) => {
                  setFirstValue(nextValue);
                  setError('');
                }}
              />
            </div>

            {/* VS divider */}
            <div style={{ textAlign: 'center' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--surface-glass)',
                  border: '1px solid var(--surface-card-border)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                VS
              </span>
            </div>

            {/* Second person */}
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 8 }}>
                Second birthdate
              </p>
              <BirthDateFields
                namePrefix='second'
                prefix='Second birth'
                value={secondValue}
                onChange={(nextValue) => {
                  setSecondValue(nextValue);
                  setError('');
                }}
              />
            </div>
          </div>

          <div className='spacer-lg' />

          <button
            className='primary-action-button'
            disabled={loading}
            type='button'
            onClick={handleButtonClick}
          >
            {loading ? (
              <span style={{ display: 'flex', gap: 6 }}>
                <span className='cosmic-loader-dot' style={{ width: 8, height: 8 }} />
                <span className='cosmic-loader-dot' style={{ width: 8, height: 8 }} />
                <span className='cosmic-loader-dot' style={{ width: 8, height: 8 }} />
              </span>
            ) : (
              <>
                <MdCompareArrows size={20} />
                <span>Compare</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <p className='error-text' style={{ textAlign: 'center', marginTop: 12 }}>{error}</p>
        )}

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ marginTop: 32 }}
            >
              {/* VS Cards */}
              <div className='compat-vs'>
                <div className='glass-card' style={{ textAlign: 'center', padding: 16 }}>
                  <p style={{ fontWeight: 600 }}>{displayDob(result.first.dob)}</p>
                  <div style={{ marginTop: 8 }}>
                    <ElementBadge
                      name={
                        result.first.dominant_elements[0]?.name ||
                        result.first.core_numbers.spirit.element
                      }
                    />
                  </div>
                </div>
                <div className='compat-vs-badge'>VS</div>
                <div className='glass-card' style={{ textAlign: 'center', padding: 16 }}>
                  <p style={{ fontWeight: 600 }}>{displayDob(result.second.dob)}</p>
                  <div style={{ marginTop: 8 }}>
                    <ElementBadge
                      name={
                        result.second.dominant_elements[0]?.name ||
                        result.second.core_numbers.spirit.element
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Compatibility Details */}
              <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>Summary</p>
                  <p className='text-secondary text-sm'>{result.compatibility.summary}</p>
                </div>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>Strengths</p>
                  <p className='text-secondary text-sm'>{result.compatibility.strengths}</p>
                </div>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>Tension points</p>
                  <p className='text-secondary text-sm'>{result.compatibility.tension}</p>
                </div>
                <div className='callout'>
                  <p style={{ fontWeight: 600, marginBottom: 4, fontSize: '0.875rem' }}>Advice</p>
                  <p className='text-secondary text-sm'>{result.compatibility.advice}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
