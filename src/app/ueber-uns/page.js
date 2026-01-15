import { generateMetadata as generateSiteMetadata } from '@/lib/seo';
import OmClient from '@/components/om/OmClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de';

export const metadata = {
  ...generateSiteMetadata({
    title: 'Über uns - Kochera',
    description: 'Erfahren Sie mehr über Kochera, Deutschlands beste Rezeptsammlung. Entdecken Sie unsere Mission, unsere Werte und unser Team.',
    url: '/ueber-uns',
    keywords: 'Über Kochera, über uns, Rezeptsammlung, deutsche Rezepte, Kochen, Kochblog, Team Kochera, Mission Kochera',
    openGraph: {
      images: [
        {
          url: '/images/fika-och-bakning-svensk-stil.webp',
          width: 1200,
          height: 630,
          alt: 'Über Kochera - Deutschlands beste Rezeptsammlung',
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
