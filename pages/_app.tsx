import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import {
  Container,
  Divider,
  Grid,
  Link,
  Navbar,
  NextUIProvider,
  Spacer,
  Text,
  createTheme,
} from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import DarkModeSwitch from '@/components/DarkModeSwitch';
import { MdHome } from 'react-icons/md';
import Script from 'next/script';

export default function App({ Component, pageProps }: AppProps) {
  const lightTheme = createTheme({
    type: 'light',
    theme: {},
  });

  const darkTheme = createTheme({
    type: 'dark',
    theme: {},
  });

  const collapseItems = [
    'Element (coming soon)',
    'Physical (coming soon)',
    'Spiritual (coming soon)',
    'Combination (coming soon)',
  ];

  return (
    <>
      <Script
        async
        src="https://umami.07102020.xyz/script.js"
        data-website-id="f9863970-2bec-4d07-9f89-58f134ff8221"
        data-domains="borndate.web.app"
      />
      <NextThemesProvider
        defaultTheme='system'
        attribute='class'
        value={{
          light: lightTheme.className,
          dark: darkTheme.className,
        }}
      >
        <NextUIProvider>
          <Navbar
            variant='static'
            isCompact
            shouldHideOnScroll
            disableShadow
            disableScrollHandler
          >
            <Navbar.Brand>
              <Link
                color='inherit'
                href='/'
                css={{
                  fontWeight: '$bold',
                }}
              >
                <MdHome size={30} />
              </Link>
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
                      minWidth: '100%',
                      cursor: 'not-allowed',
                      color: 'Grey',
                    }}
                    href='#'
                  >
                    {item}
                  </Link>
                </Navbar.CollapseItem>
              ))}
            </Navbar.Collapse>
          </Navbar>
          <Component {...pageProps} />
          <Spacer y={3} />
          <Divider />
          <Spacer y={0.5} />
          <Container display='flex' justify='space-evenly' alignItems='center'>
            <Grid css={{ display: 'flex' }}>
              <Text size='$sm' weight='light'>
                Powered by
              </Text>
              <Spacer x={0.2} />
              <Text size='$sm' weight='extrabold'>
                OpenAI
              </Text>
            </Grid>
          </Container>
          <Spacer y={4} />
        </NextUIProvider>
      </NextThemesProvider>
    </>
  );
}
