import { Button, Container, Input, Spacer, Text } from '@nextui-org/react';
import { useEffect, useState } from 'react';

export default function Home() {

  const [value, setValue] = useState('');
  const [active, setActive] = useState(false)

  useEffect(() => {
    setActive(value ? true : false);
  }, [value])

  function handleClicked() {
    console.log(value)
  }

  return (
    <Container xs display='flex' alignContent='center'
      css={{
        height: '100vh',
      }}>

      <Text h1 size={50} weight="bold"
        css={{
          textAlign: 'center',
        }}>
        Explore the Significance of Your  <Text span
          css={{
            textGradient: "45deg, $purple600 -20%, $pink600 100%",
          }}
        >Numerology Numbers</Text>
      </Text>

      <Text color='grey' size={17}
        css={{
          textAlign: 'center'
        }}
      >Discover the Fascinating Truths and Insights of Your Birthdate: Unveil the Hidden Meanings, Significance, and Impact on Your Life</Text>

      <Spacer y={4} />

      <Container wrap='wrap'>
        <Text size={25} css={{ textAlign: 'center',fontWeight:'$bold' }} >Provide your birthdate</Text>

        <Spacer y={0.5} />
        <Input
          bordered
          type='date'
          color='secondary'
          value={value}
          onChange={e => { setValue(e.currentTarget.value); }}
          id='bday'
          aria-label='bday'
          css={{
            width: 'stretch',
            textAlign:'center'
          }}
        />

        <Spacer y={0.6} />
        <Button
          disabled={!active}
          color="gradient"
          css={{
            width: 'stretch',
            linearGradient: "45deg, $purple600 -20%, $pink600 100%",
          }}
          onPress={handleClicked}>
          Calculate Now
        </Button>

      </Container>
    </Container>
  )
}
