import { Inter, Playfair_Display, Lora, Crimson_Text } from "next/font/google";
import "./globals.css";
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { generateMetadata as generateSiteMetadata } from '@/lib/seo';
import { Analytics } from "@vercel/analytics/next"
// Modern sans-serif for body text (excellent readability)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'], 
});

// Elegant serif for headings (classic, editorial feel)
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
  fallback: ['Georgia', 'serif'],
});

// Sophisticated serif for blog content (warm, inviting)
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
  fallback: ['Georgia', 'serif'],
});

// Alternative elegant serif for recipe titles
const crimson = Crimson_Text({
  variable: "--font-crimson",
  weight: ['400', '600', '700'],
  subsets: ["latin"],
  display: 'swap',
  preload: false,
  fallback: ['Georgia', 'serif'],
});

export const metadata = {
  ...generateSiteMetadata({
    title: 'kochira – Deutschlands beste Rezepte | Kochen & Backen für jeden Anlass',
    description: 'Entdecke tausende einfache, leckere Rezepte – von klassischen Pfannkuchen bis zu saftigen Hähnchenhack-Gerichten. Schnelle Alltagsgerichte und deutsche Favoriten für die ganze Familie!',
    url: '/',
    keywords: 'Rezepte, Kochrezepte, Kochen, deutsche Rezepte, Backen, Backrezepte, vegetarisch, vegan, glutenfrei, Frühstück, Mittagessen, Abendessen, Dessert, Schnellgericht, Alltagsessen, Kochbuch, deutsche Küche, Familienrezepte, hausgemachtes Essen, Hähnchenhack Rezepte, Pfannkuchen Rezepte, Hähnchenschenkel Rezepte, Brownie Rezepte, Lasagne Rezepte, Scones Rezepte, Schokobällchen Rezepte, Waffeln Rezepte, Zimtschnecken Rezepte, Frikadellen Rezepte, Carbonara Rezepte, Jägerschnitzel Rezepte, Hähnchen Rezepte, Rührkuchen Rezepte, Lachs Rezepte, Muffins Rezepte, Apfelmus Rezepte, Apfelkuchen Rezepte, Pasta Rezepte, vegetarische Rezepte, gesundes Essen, italienische Küche, asiatische Küche, Salate, Suppen, Schritt-für-Schritt Rezepte, einfache Rezepte, schnelle Rezepte, Alltagsrezepte, Festessen, Partyessen',
  }),
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kochira.de'),
  title: {
    default: 'kochira – Deutschlands beste Rezepte für jeden Anlass',
  },
  applicationName: 'kochira',
  generator: 'Next.js',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://kochira.de',
    siteName: 'kochira',
    title: 'kochira – Deutschlands beste Rezepte für jeden Anlass',
    description: 'Entdecke tausende einfache, leckere Rezepte – von klassischen Pfannkuchen bis zu saftigen Hähnchenhack-Gerichten. Schnelle Alltagsgerichte und deutsche Favoriten für die ganze Familie!',
    images: [
      {
        url: '/kochira.png',
        width: 1200,
        height: 630,
        alt: 'kochira - Deutschlands beste Rezepte für jeden Anlass',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'kochira – Deutschlands beste Rezepte für jeden Anlass',
    description: 'Entdecke tausende einfache, leckere Rezepte – von klassischen Pfannkuchen bis zu saftigen Hähnchenhack-Gerichten. Schnelle Alltagsgerichte und deutsche Favoriten für die ganze Familie!',
    images: ['/kochira.png'],
  },
  manifest: '/manifest.json',
  other: {
    'msapplication-TileColor': '#9333EA',
    'theme-color': '#9333EA',
  },
};

// Separate viewport export for Next.js 15 best practices
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="de" dir="ltr">
      <head>
      <script src="https://analytics.ahrefs.com/analytics.js" data-key="P0GZ5rI9GtpEbgJx8oURkQ" async></script>
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${lora.variable} ${crimson.variable} antialiased min-h-screen flex flex-col font-inter`}
      >
        <HeaderWrapper />
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-primary)] focus:text-white focus:rounded-lg"
        >
          Zum Hauptinhalt springen
        </a>
        
        {/* Scroll to top on route change - professional scroll restoration */}
        <ScrollToTop />
        
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics /> 
      </body>
    </html>
  );
}