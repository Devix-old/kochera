import OmClient from '@/components/om/OmClient';

export const metadata = {
  title: 'Om Bakstunden - Vår historia och vision',
  description: 'Lär känna teamet bakom Bakstunden. Vi är passionerade matälskare som delar med oss av våra bästa matrecept och kockknep för att inspirera dig i köket.',
  keywords: 'om bakstunden, vår historia, matrecept, matlagning, svenska mat, team bakstunden, recept inspiration, kokbok',
  openGraph: {
    title: 'Om Bakstunden - Vår historia och vision | Bakstunden',
    description: 'Lär känna teamet bakom Bakstunden. Vi är passionerade matälskare som delar med oss av våra bästa matrecept och kockknep för att inspirera dig i köket.',
    type: 'website',
    images: [
      {
        url: '/images/fika-och-bakning-svensk-stil.webp',
        width: 1200,
        height: 630,
        alt: 'Om Bakstunden - Vårt team och vår vision',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Om Bakstunden - Vår historia och vision | Bakstunden',
    description: 'Lär känna teamet bakom Bakstunden. Vi är passionerade matälskare som delar med oss av våra bästa matrecept och kockknep för att inspirera dig i köket.',
    images: ['/images/fika-och-bakning-svensk-stil.webp'],
  },
};

export default function OmPage() {
  return <OmClient />;
}


