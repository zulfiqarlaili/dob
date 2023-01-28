import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Link, Navbar, NextUIProvider, Text } from '@nextui-org/react';
import { HomeLogo } from '@/components/HomeLogo';

export default function App({ Component, pageProps }: AppProps) {

  const collapseItems = [
    "Element",
    "Physical",
    "Spiritual",
    "Combination",
  ];

  return (
    <NextUIProvider>
      <Navbar variant='static' isCompact shouldHideOnScroll disableShadow disableScrollHandler>
        <Navbar.Brand>
          <Link color='inherit' href='/'
            css={{
              fontWeight:'$bold'
            }} >Home</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          {collapseItems.map((item, index) => (
            <Navbar.CollapseItem key={item}>
              <Link
                color="inherit"
                css={{
                  display: 'flex',
                  justifyContent: 'end',
                  minWidth: "100%",
                }}
                href="#"
              >
                {item}
              </Link>
            </Navbar.CollapseItem>
          ))}
        </Navbar.Collapse>
      </Navbar>
      <Component {...pageProps} />
    </NextUIProvider>
  )
}
