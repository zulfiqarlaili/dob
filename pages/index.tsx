import Star from '@/components/Star';
import { Button, Card, Container, Grid, Input, Spacer, Text } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion"
import Element from '@/components/Element';

export default function Home() {

  const [value, setValue] = useState('');
  const [dob, setDob] = useState('');
  const [active, setActive] = useState(false)


  useEffect(() => {
    setActive(value ? true : false);
  }, [value])

  function handleClicked() {
    const [year, month, day] = value.split('-');
    const last_input = `${day}${month}${year}`;
    setDob(last_input)
    // router.push({
    //   pathname: '/result',
    //   query: { dob: last_input }
    // })
  }

  return (
    <>
      <Container xs display='flex' alignContent='center'
        css={{
        }}>
        <motion.div
          className="box"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Spacer y={8} />
          <Text h1 size={42} weight="bold"
            css={{
              textAlign: 'center',
            }}>
            Explore the Significance of Your
            <Text span
              css={{
                textGradient: "45deg, $purple600 -20%, $pink600 100%",
              }}
            > Numerology </Text>
            Numbers
          </Text>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <Text color='grey' size={17}
            css={{
              textAlign: 'center'
            }}>Discover the Fascinating Truths and Insights of Your Birthdate: Unveil the Hidden Meanings, Significance, and Impact on Your Life</Text>
        </motion.div>
        <Spacer y={4} />
        <Container wrap='wrap'>

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}>

            <Text size='$2xl' css={{ textAlign: 'center', fontWeight: '$bold' }} >Provide your birthdate</Text>

            <Spacer y={0.5} />
            <Input bordered type='date' color='secondary' value={value} id='bday' aria-label='bday'
              onChange={e => { setValue(e.currentTarget.value); }}
              css={{
                width: 'stretch',
                textAlign: 'center'
              }}
            />
            <Spacer y={0.6} />
            <Button disabled={!active} color="gradient" onPress={handleClicked}
              css={{
                width: 'stretch',
                linearGradient: "45deg, $purple600 -20%, $pink600 100%",
              }}>
              <Text color='white' b size={17}> Calculate Now </Text>
            </Button>
          </motion.div>
          <Spacer y={3} />


          {dob && (
            <>
              <div id="bottom" />
              <Star dob={dob} />
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
      {dob ? (<></>) : (<>
        <Spacer x={4} />
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}>
          <Text size='$2xl' css={{ textAlign: 'center', fontWeight: '$bold' }} >Product Features</Text>
          <Grid.Container gap={2} justify='center' css={{
            '@lg':{
              paddingLeft:'7rem',
              paddingRight:'7rem'
            },
            '@md':{
              paddingLeft:'5rem',
              paddingRight:'5rem'
            },
            '@sm':{
              paddingLeft:'5rem',
              paddingRight:'5rem'
            },
            '@xs':{
              paddingLeft:'5rem',
              paddingRight:'5rem'
            },
          }}>
            <Grid lg={3} md={3} sm={3}>
              <Card isHoverable >
                <Card.Body>
                  <Text weight='extrabold'>Antient Numerology</Text>
                  <Spacer />
                  <Text>Craft your personality, strengths, and challenges through a personalized numerology with Antient technology</Text>
                </Card.Body>
              </Card>
            </Grid>
            <Grid lg={3} md={3} sm={3}>
              <Card isHoverable >
                <Card.Body>
                  <Text weight='extrabold'>Personalize Chart</Text>
                  <Spacer />
                  <Text>Personalize a diagram to exhibit your physical, spiritual, numerological and dominant element characteristics</Text>
                </Card.Body>
              </Card>
            </Grid>
            <Grid lg={3} md={3} sm={3}>
              <Card isHoverable >
                <Card.Body>
                  <Text weight='extrabold'>Open AI</Text>
                  <Spacer />
                  <Text>Leverage the power of OpenAI library to generate a comprehensive depiction of yourself, incorporating factors such as your physical attributes and numerology, and utilizing a multitude of parameters to capture the intricacies of your individuality.</Text>
                </Card.Body>
              </Card>
            </Grid>
            <Grid lg={3} md={3} sm={3}>
              <Card isHoverable >
                <Card.Body>
                  <Text weight='extrabold'>Dominance Element</Text>
                  <Spacer />
                  <Text>Determine your dominant element beforehand to gain insight into your strengths and weaknesses, receive relationship advice, and identify the key steps necessary to become the best version of yourself.</Text>
                </Card.Body>
              </Card>
            </Grid>
          </Grid.Container>
        </motion.div>
      </>)}
    </>
  )
}
