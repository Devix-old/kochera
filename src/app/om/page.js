import OmClient from '@/components/om/OmClient';

export const metadata = {
  title: 'Über uns - Kochera',
  description: 'Lernen Sie das Team hinter Kochera kennen. Wir sind leidenschaftliche Köche, die ihre besten Rezepte und Kochtipps mit dir teilen, um dich in der Küche zu inspirieren.',
  keywords: 'über kochera, unsere Geschichte, Rezepte, Kochen, deutsche Küche, Team kochera, Rezept Inspiration, Kochbuch',
  openGraph: {
    title: 'Über uns - Kochera',
    description: 'Lernen Sie das Team hinter Kochera kennen. Wir sind leidenschaftliche Köche, die ihre besten Rezepte und Kochtipps mit dir teilen, um dich in der Küche zu inspirieren.',
    type: 'website',
    images: [
      {
        url: '/images/fika-och-bakning-svensk-stil.webp',
        width: 1200,
        height: 630,
        alt: 'Über Kochera - Unser Team und unsere Vision',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Über uns - Kochera',
    description: 'Lernen Sie das Team hinter Kochera kennen. Wir sind leidenschaftliche Köche, die ihre besten Rezepte und Kochtipps mit dir teilen.',
    images: ['/images/fika-och-bakning-svensk-stil.webp'],
  },
};

export default function OmPage() {
  return <OmClient />;
}


