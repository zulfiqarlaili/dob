import Star from '@/components/Star';
import {
  Button,
  Card,
  Container,
  Grid,
  Input,
  Loading,
  Spacer,
  Text,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Element from '@/components/Element';

export default function Home() {
  const [value, setValue] = useState('');
  const [dob, setDob] = useState('');
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //setActive(value ? true : false);
    if (value.length === 10) {
      setActive(true);
    } else {
      setDob('');
      setActive(false);
    }
  }, [value]);

  function handleClicked() {
    const [year, month, day] = value.split('-');
    const last_input = `${day}${month}${year}`;
    setDob(last_input);
    // router.push({
    //   pathname: '/result',
    //   query: { dob: last_input }
    // })
  }

  const handleLoading = (loadingState: boolean) => {
    setLoading(loadingState);
  };

  const handleChange = (e: any) => {
    let inputValue = e.currentTarget.value.replace(/\D/g, ""); // Remove non-numeric characters first

    // Only add dashes if typing (not if deleting)
    if (inputValue.length >= 2 ) {
      inputValue = inputValue.slice(0, 2) + "-" + inputValue.slice(2);
    }
    if (inputValue.length >= 5 ) {
      inputValue = inputValue.slice(0, 5) + "-" + inputValue.slice(5, 9);
    }

    // Validate month part (mm must be between 01 and 12)
    if (inputValue.length >= 5) {
      const month = parseInt(inputValue.slice(3, 5), 10); // Extract the month
      if (month < 1 || month > 12) {
        // If the month is invalid, remove the month and dash (revert to only `dd-`)
        inputValue = inputValue.slice(0, 2) + "-"; // Keep `dd-` format, remove month
      }
    }

    // Validate day part (dd must be between 01 and 31)
    if (inputValue.length >= 2) {
      const day = parseInt(inputValue.slice(0, 2), 10); // Extract the day
      if (day < 1 || day > 31) {
        // If the day is invalid, remove the day and dash (revert to only `-mm-`)
        inputValue = inputValue.slice(2); // Remove `dd-` part, keep `mm-` format
      }
    }

    // Validate year part (yyyy must be between 1900 and 2100)
    if (inputValue.length >= 10) {
      const year = parseInt(inputValue.slice(6, 10), 10); // Extract the year
      if (year < 1900 || year > 2100) {
        // If the year is invalid, remove the year and dash (revert to only `dd-mm-`)
        inputValue = inputValue.slice(0, 5); // Keep `dd-mm-` format, remove year
      }
    }

    // imit to 10 characters (dd-mm-yyyy format)
    if (inputValue.length > 10) {
      inputValue = inputValue.slice(0, 10);
    }

    setValue(inputValue);
  };

  return (
    <>
      <Container
        css={{
          height: dob ? '' : '100vh',
          paddingLeft: '$0',
          paddingRight: '$0',
        }}
      >
        <Container xs display='flex' alignContent='center' css={{}}>
          <motion.div
            className='box'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Spacer
              css={{
                '@xs': {
                  paddingTop: '8rem',
                },
              }}
            />
            <Text
              h1
              size={42}
              weight='bold'
              css={{
                textAlign: 'center',
              }}
            >
              Explore the Significance of Your
              <Text
                span
                css={{
                  textGradient: '45deg, $purple600 -20%, $pink600 100%',
                }}
              >
                {' '}
                Numerology{' '}
              </Text>
              Numbers
            </Text>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Text
              color='grey'
              size={17}
              css={{
                textAlign: 'center',
              }}
            >
              Discover the Fascinating Truths and Insights of Your Birthdate:
              Unveil the Hidden Meanings, Significance, and Impact on Your Life
            </Text>
          </motion.div>
          <Spacer y={4} />
          <Container wrap='wrap'>
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Text
                size='$2xl'
                css={{
                  textAlign: 'center',
                  fontWeight: '$bold',
                }}
              >
                Provide your birthdate
              </Text>

              <Spacer y={0.5} />
              <Input
                clearable
                bordered
                color="secondary"
                id="bday"
                aria-label="bday"
                value={value} // Use the existing value
                onChange={handleChange} // Automatically format dashes
                css={{
                  width: "stretch",
                  textAlign: "center",
                }}
                placeholder="dd-mm-yyyy"
                maxLength={10} // Ensure only 10 characters can be entered
                inputMode="numeric"  // Brings up the numeric keyboard on mobile
                pattern="\d*" // Allows only digits (optional, but helps ensure numeric input)
              />
              <Spacer y={0.6} />
              <Button
                disabled={!active || loading}
                color='gradient'
                onPress={handleClicked}
                css={{
                  width: 'stretch',
                  linearGradient: '45deg, $purple600 -20%, $pink600 100%',
                }}
              >
                {loading ? (
                  <Loading type='points' color='currentColor' size='sm' />
                ) : (
                  <Text color='white' b size={17}>
                    {' '}
                    Calculate Now{' '}
                  </Text>
                )}
              </Button>
            </motion.div>
            <Spacer y={3} />

            {dob && (
              <>
                <div id='bottom' />
                <Star dob={dob} handleLoading={handleLoading} />
                <Spacer y={1} />
              </>
            )}
          </Container>
          {dob && (
            <>
              <Element dob={dob} />
              <Spacer y={3} />
            </>
          )}
        </Container>
      </Container>
      {dob ? (
        <></>
      ) : (
        <>
          <Spacer x={4} />
          <motion.div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Text
              size='$2xl'
              css={{ textAlign: 'center', fontWeight: '$bold' }}
            >
              Product Features
            </Text>
            <Spacer y={2} />
            <Grid.Container
              gap={2}
              justify='center'
              css={{
                maxW: '70rem',
                '@lg': {
                  paddingLeft: '7rem',
                  paddingRight: '7rem',
                },
                '@md': {
                  paddingLeft: '5rem',
                  paddingRight: '5rem',
                },
                '@sm': {
                  paddingLeft: '5rem',
                  paddingRight: '5rem',
                },
                '@xs': {
                  paddingLeft: '5rem',
                  paddingRight: '5rem',
                },
              }}
            >
              <Grid lg={3} md={3} sm={3}>
                <Container>
                  <Text weight='extrabold'>Antient Numerology</Text>
                  <Spacer />
                  <Text>
                    Craft your personality, strengths, and challenges through a
                    personalized numerology with <b>Antient</b> technology
                  </Text>
                </Container>
              </Grid>
              <Grid lg={3} md={3} sm={3}>
                <Container>
                  <Text weight='extrabold'>Personalize Chart</Text>
                  <Spacer />
                  <Text>
                    Personalize a diagram to exhibit your <b>physical</b>,{' '}
                    <b>spiritual</b>, <b>numerological</b> and dominant element
                    characteristics
                  </Text>
                </Container>
              </Grid>
              <Grid lg={3} md={3} sm={3}>
                <Container>
                  <Text weight='extrabold'>Open AI</Text>
                  <Spacer />
                  <Text>
                    Create a detailed representation of yourself using{' '}
                    <b>OpenAI</b>, including physical attributes, numerology,
                    and unique parameters..
                  </Text>
                </Container>
              </Grid>
              <Grid lg={3} md={3} sm={3}>
                <Container>
                  <Text weight='extrabold'>Dominance Element</Text>
                  <Spacer />
                  <Text>
                    Uncover your <b></b> for valuable insights on strengths,
                    weaknesses, relationships, and self-improvement steps.
                  </Text>
                </Container>
              </Grid>
            </Grid.Container>
          </motion.div>
        </>
      )}
    </>
  );
}
