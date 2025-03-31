import React from 'react'; // Add this line
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css';

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>The Witcher Fight</title>
      </head>
      <body>{children}</body>
    </html>
  );
}