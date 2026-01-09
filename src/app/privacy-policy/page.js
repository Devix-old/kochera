import PrivacyPolicyClient from '@/components/privacy/PrivacyPolicyClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de';

export const metadata = {
  title: 'Datenschutzerklärung - Kochera',
  description: 'Lesen Sie unsere Datenschutzerklärung und wie wir Ihre personenbezogenen Daten auf kochera.de verarbeiten',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
  openGraph: {
    title: 'Datenschutzerklärung - Kochera',
    description: 'Lesen Sie unsere Datenschutzerklärung und wie wir Ihre personenbezogenen Daten verarbeiten',
    type: 'website',
    url: `${siteUrl}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}