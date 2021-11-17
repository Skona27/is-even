import Document, { Html, Head, Main, NextScript } from 'next/document';
import { Analytics } from '@components/Analytics';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="shortcut icon" href="/images/favicon.ico" />
          <meta
            name="description"
            content="Awesome Software as a Service platform for checking the parity of a number. Blazing fast and lightweight! Start now with free tier!"
          />
          <meta
            name="keywords"
            content="is-even, iseven, is, even, saas, number, parity"
          />
          <meta name="author" content="Jakub Skoneczny" />
        </Head>

        <body>
          <Main />
          <NextScript />
          <Analytics />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
