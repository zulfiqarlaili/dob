import BirthDateFields from '@/components/BirthDateFields';
import { Card, Grid, Loading, Spacer, Text } from '@nextui-org/react';
import { FormEvent, MouseEvent, useState } from 'react';
import { MdCompareArrows } from 'react-icons/md';
import { API_BASE_URL, CompatibilityResponse } from '@/lib/api';
import { DateParts, displayDob, parseDateParts } from '@/lib/dob';

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
    <Card variant='bordered'>
      <Card.Body>
        <Text h3 size={26}>
          Compare Two Birthdates
        </Text>
        <Text color='gray'>
          Optional tool for partner, friend, family, or work relationships.
        </Text>
        <Spacer y={1} />
        <form onSubmit={handleSubmit} noValidate>
          <Grid.Container gap={1}>
            <Grid xs={12}>
              <Text b>First birth date</Text>
              <BirthDateFields
                namePrefix='first'
                prefix='First birth'
                value={firstValue}
                onChange={(nextValue) => {
                  setFirstValue(nextValue);
                  setError('');
                }}
              />
            </Grid>
            <Grid xs={12}>
              <Text b>Second birth date</Text>
              <BirthDateFields
                namePrefix='second'
                prefix='Second birth'
                value={secondValue}
                onChange={(nextValue) => {
                  setSecondValue(nextValue);
                  setError('');
                }}
              />
            </Grid>
          </Grid.Container>
          <Spacer y={0.8} />
          <button
            className='primary-action-button'
            disabled={loading}
            type='button'
            onClick={handleButtonClick}
          >
            {loading ? <Loading type='points' color='currentColor' size='sm' /> : <MdCompareArrows />}
            Compare
          </button>
        </form>
        {error && (
          <>
            <Spacer y={0.7} />
            <Text color='error'>{error}</Text>
          </>
        )}

        {result && (
          <>
            <Spacer y={1.5} />
            <Grid.Container gap={1}>
              <Grid xs={12} sm={6}>
                <Card variant='flat'>
                  <Card.Body>
                    <Text b>{displayDob(result.first.dob)}</Text>
                    <Text color='gray'>
                      {result.first.dominant_elements[0]?.name ||
                        result.first.core_numbers.spirit.element}{' '}
                      energy
                    </Text>
                  </Card.Body>
                </Card>
              </Grid>
              <Grid xs={12} sm={6}>
                <Card variant='flat'>
                  <Card.Body>
                    <Text b>{displayDob(result.second.dob)}</Text>
                    <Text color='gray'>
                      {result.second.dominant_elements[0]?.name ||
                        result.second.core_numbers.spirit.element}{' '}
                      energy
                    </Text>
                  </Card.Body>
                </Card>
              </Grid>
            </Grid.Container>
            <Spacer y={1} />
            <Text b>Summary</Text>
            <Text>{result.compatibility.summary}</Text>
            <Spacer y={0.7} />
            <Text b>Strengths</Text>
            <Text>{result.compatibility.strengths}</Text>
            <Spacer y={0.7} />
            <Text b>Tension points</Text>
            <Text>{result.compatibility.tension}</Text>
            <Spacer y={0.7} />
            <Text b>Advice</Text>
            <Text>{result.compatibility.advice}</Text>
          </>
        )}
      </Card.Body>
    </Card>
  );
}
