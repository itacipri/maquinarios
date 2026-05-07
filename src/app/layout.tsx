import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/layout/WhatsAppFloat';

export const metadata: Metadata = {
  title: {
    default: 'Maquinários | Portal de Máquinas e Equipamentos Industriais',
    template: '%s | Maquinários',
  },
  description: 'O maior portal de compra e venda de máquinas e equipamentos industriais do Brasil. Encontre tornos, fresadoras, tratores, compressores e muito mais com a segurança da intermediação profissional.',
  keywords: ['máquinas industriais', 'equipamentos industriais', 'torno cnc', 'fresadora', 'compressor', 'gerador', 'trator', 'compra venda máquinas'],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://www.maquinarios.com.br',
    siteName: 'Maquinários',
    title: 'Maquinários | Portal de Máquinas e Equipamentos Industriais',
    description: 'Encontre máquinas e equipamentos industriais com segurança e intermediação profissional.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
