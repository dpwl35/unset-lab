// app/layout.tsx
import type { Metadata } from 'next';
import '@/styles/style.scss';
import PageTransition from '@/components/PageTransition';
import { Azeret_Mono, Inter, JetBrains_Mono } from 'next/font/google';
import Header from '@/components/Header';
import SmoothScroll from '@/components/SmoothScroll';
import LoadHandler from '@/components/LoadHandler';
import Loader from '@/components/Loader';
import Splash from '@/components/Splash';
const azeretMono = Azeret_Mono({
  subsets: ['latin'],
  variable: '--font-azeret-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'Unset Lab',
    template: '%s | Unset Lab',
  },
  description: 'Unset Lab — Creative Web Agency',
};

const inter = Inter({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='ko'
      className={`${azeretMono.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <Splash />
        <SmoothScroll />
        <Header />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
