import PrivacyPolicyClient from '@/components/privacy/PrivacyPolicyClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de';

export const metadata = {
  title: 'Datenschutzerklärung - Kochera',
  description: 'Lesen Sie unsere Datenschutzerklärung und wie wir Ihre personenbezogenen Daten auf kochera.de verarbeiten',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${siteUrl}/datenschutz`,
  },
  openGraph: {
    title: 'Datenschutzerklärung - Kochera',
    description: 'Lesen Sie unsere Datenschutzerklärung und wie wir Ihre personenbezogenen Daten verarbeiten',
    type: 'website',
    url: `${siteUrl}/datenschutz`,
  },
};

export default function DatenschutzPage() {
  return <PrivacyPolicyClient />;
}
