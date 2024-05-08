import { Metadata } from 'next';
import { BIZ_UDPGothic } from 'next/font/google';

import '@/app/globals.css';
import { Providers } from '@/app/providers';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const fontSans = BIZ_UDPGothic({
  weight: '700',
  preload: false,
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'csv2xlsx',
  description: 'データからプロット作成してxlsxに出力',
};

const App = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='ja' suppressHydrationWarning>
      <body className={cn(fontSans.variable, 'font-sans')}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
};

export default App;
