import React from 'react';
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: React.Children.toArray([initialProps.styles]),
    };
  }

  render() {
    return (
      <Html lang='en'>
        <Head>
          <meta charSet='utf-8' />
          <meta name='theme-color' content='#0b1221' />
          <meta
            name='description'
            content='Get your free birthdate reading — see your numerology chart, dominant element, and practical insights. No signup required.'
          />
          <meta
            property='og:title'
            content='BornDate — Discover Your Birth Code'
          />
          <meta
            property='og:description'
            content='Free birthdate reading with numerology chart, element analysis, and personal insights.'
          />
          <meta property='og:type' content='website' />
          <meta property='og:url' content='https://borndate.web.app' />
          <meta name='twitter:card' content='summary_large_image' />
          <meta
            name='twitter:title'
            content='BornDate — Discover Your Birth Code'
          />
          <meta
            name='twitter:description'
            content='Free birthdate reading with numerology chart, element analysis, and personal insights.'
          />
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link
            rel='preconnect'
            href='https://fonts.gstatic.com'
            crossOrigin='anonymous'
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
