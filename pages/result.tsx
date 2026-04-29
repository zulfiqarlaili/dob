import ResultExperience from '@/components/ResultExperience';
import { decodeDob, displayDob } from '@/lib/dob';
import { Container, Link, Spacer, Text } from '@nextui-org/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export default function SharedResult() {
  const router = useRouter();
  const dob = useMemo(() => {
    const encoded = router.query.d;
    return typeof encoded === 'string' ? decodeDob(encoded) : '';
  }, [router.query.d]);

  return (
    <>
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        <title>{dob ? `Borndate Reading ${displayDob(dob)}` : 'Borndate Reading'}</title>
      </Head>
      <Container xs css={{ paddingLeft: '$0', paddingRight: '$0' }}>
        <Spacer y={2} />
        {!router.isReady ? null : dob ? (
          <ResultExperience dob={dob} />
        ) : (
          <>
            <Text h1 size={34} css={{ textAlign: 'center' }}>
              This result link is not valid.
            </Text>
            <Text css={{ textAlign: 'center' }}>
              <Link href='/'>Create a new reading</Link>
            </Text>
          </>
        )}
      </Container>
    </>
  );
}
