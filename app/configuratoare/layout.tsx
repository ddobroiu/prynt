import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Configuratoare Online | Toate Produsele | Prynt.ro',
  description: 'Configurează online bannere, afișe, autocolante, tapet, canvas, materiale rigide și multe altele. 18 configuratoare disponibile cu preview instant și calculare automată a prețului.',
  keywords: [
    'configuratoare online',
    'configurator bannere',
    'configurator afise',
    'configurator autocolante',
    'configurator tapet',
    'print online',
    'tipografie online',
    'configurator print',
    'calcul pret instant',
    'materiale rigide',
    'fonduri europene'
  ],
  alternates: { canonical: '/configuratoare' },
  openGraph: {
    title: 'Configuratoare Online | Toate Produsele | Prynt.ro',
    description: 'Configurează online bannere, afișe, autocolante, tapet, canvas, materiale rigide. 18 configuratoare cu preview instant și calculare automată.',
    images: [{
      url: '/products/banner/banner-1.webp',
      width: 1200,
      height: 630,
      alt: 'Configuratoare online tipografie'
    }],
    type: 'website'
  }
};

export default function ConfiguratoareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
