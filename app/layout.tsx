import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { FunnelProvider } from './funnel-context';

import { GtmHeadScript, GtmNoscript } from './analytics/tracking-scripts';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Destrava Leve 28D — tu plan de liberación corporal',
  description: 'Una rutina guiada de 7 minutos al día para volver a sentir el cuerpo liviano.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function shouldSuppress(msg) {
                  return typeof msg === 'string' && (
                    msg.indexOf('ResizeObserver') !== -1 ||
                    msg.indexOf('undelivered notifications') !== -1
                  );
                }
                window.addEventListener('error', function(e) {
                  if (e && (shouldSuppress(e.message) || (e.error && shouldSuppress(e.error.message)))) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);
                var origError = window.onerror;
                window.onerror = function(msg, url, line, col, err) {
                  if (shouldSuppress(msg) || (err && shouldSuppress(err.message))) {
                    return true;
                  }
                  if (origError) return origError.apply(this, arguments);
                };
              })();
            `,
          }}
        />
        <GtmHeadScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GtmNoscript />
        <FunnelProvider>{children}</FunnelProvider>
      </body>
    </html>
  );
}
