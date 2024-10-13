import Star from '@/components/Star';
import {
  Button,
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
    setActive(value ? true : false);
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
                bordered
                label="Date"
                type='date'
                color='secondary'
                id='bday'
                aria-label='bday'
                onChange={(e) => {
                  setValue(e.currentTarget.value);
                }}
                css={{
                  width: 'stretch',
                  textAlign: 'center',
                }}
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
