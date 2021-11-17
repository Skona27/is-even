import React from 'react';
import { Head } from 'next/document';
import getConfig from 'next/config';

export function Analytics() {
  const { publicRuntimeConfig } = getConfig();

  if (publicRuntimeConfig.ENVIRONMENT !== 'PROD') {
    return null;
  }

  return (
    <Head>
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-QLG55FF81P"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-QLG55FF81P');
          `,
        }}
      />
    </Head>
  );
}
