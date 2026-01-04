import KontaktClient from '@/components/kontakt/KontaktClient';

export const metadata = {
  title: 'Kontakta oss - Bakstunden',
  description: 'Kontakta Bakstunden för frågor, förslag eller bara för att säga hej. Vi svarar vanligtvis inom 24-48 timmar.',
  keywords: 'kontakt bakstunden, frågor recept, feedback, support, kontaktformulär, e-post',
  openGraph: {
    title: 'Kontakta oss - Bakstunden',
    description: 'Kontakta Bakstunden för frågor, förslag eller bara för att säga hej. Vi svarar vanligtvis inom 24-48 timmar.',
    type: 'website',
    images: [
      {
        url: '/images/fika-och-bakning-svensk-stil.webp',
        width: 1200,
        height: 630,
        alt: 'Kontakta Bakstunden',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kontakta oss - Bakstunden',
    description: 'Kontakta Bakstunden för frågor, förslag eller bara för att säga hej.',
    images: ['/images/fika-och-bakning-svensk-stil.webp'],
  },
};

export default function KontaktPage() {
  return <KontaktClient />;
}

