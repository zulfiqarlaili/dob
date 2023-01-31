import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Link, Navbar, NextUIProvider, createTheme, Container, Grid } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import DarkModeSwitch from '@/components/DarkModeSwitch';
import {MdHome} from 'react-icons/md'


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
              }} ><MdHome size={30}/></Link>
          </Navbar.Brand>
          <Grid.Container justify='flex-end' alignItems='flex-start'>
            <DarkModeSwitch />
            <Navbar.Toggle/>
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
      </NextUIProvider>
    </NextThemesProvider>
  )
}
