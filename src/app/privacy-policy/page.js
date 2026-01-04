import PrivacyPolicyClient from '@/components/privacy/PrivacyPolicyClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bakstunden.se';

export const metadata = {
  title: 'Integritetspolicy - Bakstunden',
  description: 'Läs vår integritetspolicy och hur vi hanterar dina personuppgifter på Bakstunden.se',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
  openGraph: {
    title: 'Integritetspolicy - Bakstunden',
    description: 'Läs vår integritetspolicy och hur vi hanterar dina personuppgifter',
    type: 'website',
    url: `${siteUrl}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}