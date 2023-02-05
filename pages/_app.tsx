import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Link, Navbar, NextUIProvider, createTheme, Container, Grid, Divider, Text, Spacer } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import DarkModeSwitch from '@/components/DarkModeSwitch';
import { MdHome } from 'react-icons/md'
import { ImTwitter } from 'react-icons/im'
import { motion } from 'framer-motion';



export default function App({ Component, pageProps }: AppProps) {


  const lightTheme = createTheme({
    type: 'light',
    theme: {
    }
  })

  const darkTheme = createTheme({
    type: 'dark',
    theme: {
    }
  })

  const collapseItems = [
    "Element (coming soon)",
    "Physical (coming soon)",
    "Spiritual (coming soon)",
    "Combination (coming soon)",
  ];

  return (
    <NextThemesProvider
      defaultTheme="system"
      attribute="class"
      value={{
        light: lightTheme.className,
        dark: darkTheme.className
      }}
    >
      <NextUIProvider>
        <Navbar variant='static' isCompact shouldHideOnScroll disableShadow disableScrollHandler>
          <Navbar.Brand>
            <Link color='inherit' href='/'
              css={{
                fontWeight: '$bold'
              }} ><MdHome size={30} /></Link>
          </Navbar.Brand>
          <Grid.Container justify='flex-end' alignItems='flex-end'>
            <DarkModeSwitch />
            <Navbar.Toggle />
          </Grid.Container>
          <Navbar.Collapse>
            {collapseItems.map((item, index) => (
              <Navbar.CollapseItem key={item}>
                <Link
                  css={{
                    display: 'flex',
                    justifyContent: 'end',
                    minWidth: "100%",
                    cursor: 'not-allowed',
                    color: 'Grey'
                  }}
                  href="#">
                  {item}
                </Link>
              </Navbar.CollapseItem>
            ))}
          </Navbar.Collapse>
        </Navbar>
        <Component {...pageProps} />
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}>

          <Divider />
          <Spacer y={0.5}/>
          <Container display='flex' justify='space-evenly' alignItems='center'>
            <Grid css={{ display: 'flex' }}>
              <Text size='$sm' weight='light'>Powered by</Text>
              <Spacer x={0.2} />
              <Text size='$sm' weight='extrabold'>OpenAI</Text>
            </Grid>
            {/* <Link href='https://twitter.com/SalemTheCats'>
              <Grid css={{ display: 'flex', alignItems: 'center' }}>
                <ImTwitter size={18} />
                <Spacer x={0.2} />
                <Text size='$sm'>@SalemTheCats</Text>
              </Grid>
            </Link> */}
          </Container>
          <Spacer y={4}/>
        </motion.div>
      </NextUIProvider>
    </NextThemesProvider>
  )
}
