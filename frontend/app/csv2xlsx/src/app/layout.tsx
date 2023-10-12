import { Metadata } from 'next';
import { BIZ_UDPGothic } from 'next/font/google';
import { PrimeReactProvider } from 'primereact/api';
import './globals.css';
import './styles/page.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';

type Props = {
  children?: React.ReactNode;
};

const bizGothic = BIZ_UDPGothic({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'csv2xlsx',
  description: 'データからプロット作成してxlsxに出力',
};

const App = ({ children }: Props) => {
  return (
    <html lang='ja'>
      <body className={bizGothic.className}>
        <PrimeReactProvider>{children}</PrimeReactProvider>
      </body>
    </html>
  );
};

export default App;
