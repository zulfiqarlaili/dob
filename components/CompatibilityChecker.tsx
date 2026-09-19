import BirthDateFields from '@/components/BirthDateFields';
import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  CompatibilityResponse,
  buildCompatibilityResponse,
} from '@/lib/metaphysic';
import {
  DateParts,
  displayDob,
  dobToDateParts,
  parseDateParts,
} from '@/lib/dob';
import ElementBadge from './ElementBadge';

export default function CompatibilityChecker({
  currentDob = '',
}: {
  currentDob?: string;
}) {
  const [firstValue, setFirstValue] = useState<DateParts>(() =>
    dobToDateParts(currentDob)
  );
  const [secondValue, setSecondValue] = useState<DateParts>({
    day: '',
    month: '',
    year: '',
  });
  const [result, setResult] = useState<CompatibilityResponse | null>(null);
  const [errors, setErrors] = useState({ first: '', second: '', general: '' });
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setFirstValue(dobToDateParts(currentDob));
    setSecondValue({ day: '', month: '', year: '' });
    setResult(null);
    setErrors({ first: '', second: '', general: '' });
  }, [currentDob]);

  useEffect(() => {
    if (result) headingRef.current?.focus();
  }, [result]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const read = (prefix: string) => ({
      day: String(data.get(`${prefix}-day`) || ''),
      month: String(data.get(`${prefix}-month`) || ''),
      year: String(data.get(`${prefix}-year`) || ''),
    });
    const nextFirst = read('first');
    const nextSecond = read('second');
    setFirstValue(nextFirst);
    setSecondValue(nextSecond);
    const first = parseDateParts(nextFirst);
    const second = parseDateParts(nextSecond);
    setErrors({ first: first.error, second: second.error, general: '' });
    setResult(null);
    if (first.error || second.error) {
      document
        .getElementById(first.error ? 'first-day' : 'second-day')
        ?.focus();
      return;
    }
    try {
      setResult(buildCompatibilityResponse(first.dob, second.dob));
    } catch {
      setErrors({
        first: '',
        second: '',
        general: 'We couldn’t compare those dates. Please try again.',
      });
    }
  }

  return (
    <div className='compatibility-checker'>
      <h2>Two birthdays. A new perspective.</h2>
      <p className='text-secondary'>
        Explore how your personalities might complement each other.
      </p>
      <form onSubmit={handleSubmit} noValidate>
        <div className='comparison-fields'>
          <fieldset>
            <legend>Your birthday</legend>
            <BirthDateFields
              namePrefix='first'
              prefix='Your birth'
              value={firstValue}
              hasError={!!errors.first}
              describedBy={errors.first ? 'first-error' : undefined}
              onChange={(next) => {
                setFirstValue(next);
                setResult(null);
                setErrors({ first: '', second: '', general: '' });
              }}
            />
            {errors.first && (
              <p id='first-error' className='error-text' role='alert'>
                {errors.first}
              </p>
            )}
          </fieldset>
          <fieldset>
            <legend>Their birthday</legend>
            <BirthDateFields
              namePrefix='second'
              prefix='Their birth'
              value={secondValue}
              hasError={!!errors.second}
              describedBy={errors.second ? 'second-error' : undefined}
              onChange={(next) => {
                setSecondValue(next);
                setResult(null);
                setErrors({ first: '', second: '', general: '' });
              }}
            />
            {errors.second && (
              <p id='second-error' className='error-text' role='alert'>
                {errors.second}
              </p>
            )}
          </fieldset>
        </div>
        {errors.general && (
          <p className='error-text' role='alert'>
            {errors.general}
          </p>
        )}
        <button className='primary-action-button' type='submit'>
          Discover your connection <span aria-hidden='true'>→</span>
        </button>
      </form>
      {result && (
        <section
          className='comparison-result fade-in'
          aria-labelledby='connection-title'
        >
          <p className='eyebrow'>Your connection</p>
          <h3 id='connection-title' ref={headingRef} tabIndex={-1}>
            A little insight into the two of you
          </h3>
          <div className='comparison-people'>
            {[result.first, result.second].map((person, index) => (
              <div key={index}>
                <span className='text-secondary'>
                  {index === 0 ? 'You' : 'Them'} · {displayDob(person.dob)}
                </span>
                <ElementBadge
                  name={
                    person.dominant_elements[0]?.name ||
                    person.core_numbers.spirit.element
                  }
                />
              </div>
            ))}
          </div>
          <p className='connection-summary'>{result.compatibility.summary}</p>
          <div className='details-stack'>
            <div>
              <h4>Where you shine together</h4>
              <p className='text-secondary'>{result.compatibility.strengths}</p>
            </div>
            <div>
              <h4>Where you may see things differently</h4>
              <p className='text-secondary'>{result.compatibility.tension}</p>
            </div>
            <div className='takeaway'>
              <div>
                <h4>Something to try together</h4>
                <p>{result.compatibility.advice}</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
