import React from 'react';
import ClientWrapper from '@/components/ClientWrapper';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';

export const metadata = {
  title: 'The Witcher Fight',
  description: 'An awesome app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" data-bs-theme="dark">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>The Witcher Fight</title>
      </head>
      <body>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}