import { generateMetadata as generateSiteMetadata } from '@/lib/seo';
import OmClient from '@/components/om/OmClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kochira.de';

export const metadata = {
  ...generateSiteMetadata({
    title: 'Über uns - kochira',
    description: 'Erfahren Sie mehr über kochira, Deutschlands beste Rezeptsammlung. Entdecken Sie unsere Mission, unsere Werte und unser Team.',
    url: '/ueber-uns',
    keywords: 'Über kochira, über uns, Rezeptsammlung, deutsche Rezepte, Kochen, Kochblog, Team kochira, Mission kochira',
    openGraph: {
      images: [
        {
          url: '/images/fika-och-bakning-svensk-stil.webp',
          width: 1200,
          height: 630,
          alt: 'Über kochira - Deutschlands beste Rezeptsammlung',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['/images/fika-och-bakning-svensk-stil.webp'],
    },
  }),
  robots: {
    index: true,
    follow: true,
  },
};

export default function UeberUnsPage() {
  return <OmClient />;
}
