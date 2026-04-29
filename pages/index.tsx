import BirthDateFields from '@/components/BirthDateFields';
import CompatibilityChecker from '@/components/CompatibilityChecker';
import ResultExperience from '@/components/ResultExperience';
import { DateParts, displayDob, dobToDateParts, parseDateParts } from '@/lib/dob';
import { SavedReading, getSavedReadings } from '@/lib/storage';
import {
  Button,
  Card,
  Collapse,
  Container,
  Grid,
  Spacer,
  Text,
} from '@nextui-org/react';
import { FormEvent, MouseEvent, useEffect, useState } from 'react';
import { MdCompareArrows, MdHistory, MdStars } from 'react-icons/md';

export default function Home() {
  const [value, setValue] = useState<DateParts>({ day: '', month: '', year: '' });
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [readings, setReadings] = useState<SavedReading[]>([]);
  const [showCompatibility, setShowCompatibility] = useState(false);

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
    const parsed = parseDateParts(nextValue);
    if (parsed.error) {
      setError(parsed.error);
      setDob('');
      return;
    }

    setError('');
    setDob(parsed.dob);
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
  }

  return (
    <>
      <Container css={{ minHeight: dob ? 'auto' : '100vh', paddingLeft: '$0', paddingRight: '$0' }}>
        <Container xs display='flex' alignContent='center' css={{}}>
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            <Spacer css={{ '@xs': { paddingTop: '6rem' } }} />
            <Text
              h1
              size={42}
              weight='bold'
              css={{ textAlign: 'center', maxW: '780px' }}
            >
              Get Your
              <Text
                span
                css={{ textGradient: '45deg, $purple600 -20%, $pink600 100%' }}
              >
                {' '}
                Birthdate Reading
              </Text>
            </Text>
            <Text color='gray' size={17} css={{ textAlign: 'center', maxW: '620px' }}>
              Pick your date. See your chart, element, and one practical step.
            </Text>
          </div>

          <Spacer y={3} />
          <Container wrap='wrap'>
            <div>
              <Card variant='bordered'>
                <Card.Body>
                  <Text
                    size='$2xl'
                    css={{ textAlign: 'center', fontWeight: '$bold' }}
                  >
                    Start with your birth date
                  </Text>
                  <Text color='gray' css={{ textAlign: 'center' }}>
                    No signup. Your reading is saved only on this device.
                  </Text>
                  <Spacer y={1} />
                  <form onSubmit={handleSubmit} noValidate>
                    <BirthDateFields
                      namePrefix='birth'
                      value={value}
                      onChange={(nextValue) => {
                        setValue(nextValue);
                        setError('');
                      }}
                    />
                    {error && (
                      <>
                        <Spacer y={0.5} />
                        <Text color='error' size='$sm'>
                          {error}
                        </Text>
                      </>
                    )}
                    <Spacer y={0.8} />
                    <button
                      className='primary-action-button'
                      type='button'
                      onClick={handleButtonClick}
                    >
                      <MdStars />
                      Get My Reading
                    </button>
                  </form>
                </Card.Body>
              </Card>
            </div>

            {!dob && readings.length > 0 && (
              <>
                <Spacer y={1} />
                <Grid.Container gap={1} justify='center'>
                  <Grid>
                    <Button
                      auto
                      light
                      color='secondary'
                      icon={<MdHistory />}
                      onPress={() => openReading(readings[0].dob)}
                    >
                      Continue {displayDob(readings[0].dob)}
                    </Button>
                  </Grid>
                </Grid.Container>
              </>
            )}

            {dob && (
              <>
                <ResultExperience dob={dob} onSaved={setReadings} />
                <Spacer y={2} />
              </>
            )}

            <Spacer y={1} />
            <Grid.Container gap={1} justify='center'>
              <Grid>
                <Button
                  auto
                  light={!showCompatibility}
                  color='secondary'
                  icon={<MdCompareArrows />}
                  onPress={() => setShowCompatibility(!showCompatibility)}
                >
                  Compare Two Birthdates
                </Button>
              </Grid>
            </Grid.Container>
            {showCompatibility && (
              <>
                <Spacer y={1} />
                <CompatibilityChecker />
              </>
            )}
          </Container>
        </Container>
      </Container>

      {!dob && (
        <Container xs>
          <Spacer y={2} />
          <Text size='$2xl' css={{ textAlign: 'center', fontWeight: '$bold' }}>
            What You Get
          </Text>
          <Text color='gray' css={{ textAlign: 'center' }}>
            Simple result first. Details are available when you want them.
          </Text>
          <Spacer y={1} />
          <Collapse.Group splitted>
            <Collapse title='Your chart and element' subtitle='A visual numerology chart with your dominant element.'>
              <Text>
                Your reading starts with the chart image, then explains your strongest
                element in plain language.
              </Text>
            </Collapse>
            <Collapse title='Personal reading' subtitle='Spirit, physical, and ending numbers summarized.'>
              <Text>
                The reading turns your core numbers into a short profile, practical
                strengths, and a useful next step.
              </Text>
            </Collapse>
            <Collapse title='Save, share, and compare' subtitle='Optional tools after the main reading.'>
              <Text>
                Save recent readings on this device, copy a private result link, download
                a result card, or compare two birthdates.
              </Text>
            </Collapse>
          </Collapse.Group>
          <Spacer y={2} />
        </Container>
      )}
    </>
  );
}
