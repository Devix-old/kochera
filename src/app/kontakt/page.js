import KontaktClient from '@/components/kontakt/KontaktClient';

export const metadata = {
  title: 'Kontakt - kochira',
  description: 'Kontaktiere kochira für Fragen, Vorschläge oder einfach um Hallo zu sagen. Wir antworten normalerweise innerhalb von 24-48 Stunden.',
  keywords: 'kontakt kochira, Fragen Rezepte, Feedback, Support, Kontaktformular, E-Mail',
  openGraph: {
    title: 'Kontakt - kochira',
    description: 'Kontaktiere kochira für Fragen, Vorschläge oder einfach um Hallo zu sagen. Wir antworten normalerweise innerhalb von 24-48 Stunden.',
    type: 'website',
    images: [
      {
        url: '/images/fika-och-bakning-svensk-stil.webp',
        width: 1200,
        height: 630,
        alt: 'Kontakt kochira',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kontakt - kochira',
    description: 'Kontaktiere kochira für Fragen, Vorschläge oder einfach um Hallo zu sagen.',
    images: ['/images/fika-och-bakning-svensk-stil.webp'],
  },
};

export default function KontaktPage() {
  return <KontaktClient />;
}

