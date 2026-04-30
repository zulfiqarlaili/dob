import ResultExperience from '@/components/ResultExperience';
import { decodeDob, displayDob } from '@/lib/dob';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MdAutoAwesome } from 'react-icons/md';

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
        <title>{dob ? `BornDate Reading — ${displayDob(dob)}` : 'BornDate Reading'}</title>
      </Head>
      <div className='container' style={{ paddingTop: 32, paddingBottom: 48 }}>
        {!router.isReady ? null : dob ? (
          <>
            <ResultExperience dob={dob} />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              style={{ marginTop: 48, textAlign: 'center' }}
            >
              <Link href='/'>
                <button className='primary-action-button' style={{ maxWidth: 320, margin: '0 auto' }}>
                  <MdAutoAwesome size={18} />
                  <span>Get Your Own Reading</span>
                </button>
              </Link>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', padding: '80px 0' }}
          >
            <h1 className='heading-lg'>This result link is not valid.</h1>
            <p className='text-secondary' style={{ marginTop: 12 }}>
              <Link href='/' style={{ color: 'var(--primary-purple)', fontWeight: 500 }}>
                Create a new reading →
              </Link>
            </p>
          </motion.div>
        )}
      </div>
    </>
  );
}
