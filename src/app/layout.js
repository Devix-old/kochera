import { Inter, Playfair_Display, Lora, Crimson_Text } from "next/font/google";
import "./globals.css";
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { generateMetadata as generateSiteMetadata } from '@/lib/seo';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script";
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
    title: 'Bakstunden – Sveriges bästa matrecept | Matlagning & Bakning för alla tillfällen',
    description: 'Upptäck tusentals enkla, goda recept – från klassiska pannkakor till saftiga kycklingfärsrätter. Snabba vardagsrätter och svenska favoriter för hela familjen!',
    url: '/',
    keywords: 'recept, matrecept, matlagning, svenska recept, bakning, bakningsrecept, vegetariskt, veganskt, glutenfritt, frukost, lunch, middag, dessert, snabbmat, vardagsmat, kokbok, svensk mat, familjerecept, hemlagad mat, kycklingfärs recept, pannkakor recept, kycklinglårfile recept, kladdkaka recept, lasagne recept, scones recept, chokladbollar recept, våfflor recept, kanelbullar recept, köttbullar recept, carbonara recept, korvstroganoff recept, kyckling recept, sockerkaka recept, lax recept, muffins recept, äppelmos recept, äppelpaj recept, pasta recept, vegetariska recept, hälsosam mat, italiensk mat, asiatisk mat, sallader, soppor, steg-för-steg recept, enkla recept, snabba recept, vardagsrecept, helgmat, festmat',
  }),
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://bakstunden.se'),
  title: {
    default: 'Bakstunden – Sveriges bästa matrecept för alla tillfällen',
  },
  applicationName: 'Bakstunden',
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
    locale: 'sv_SE',
    url: 'https://bakstunden.se',
    siteName: 'Bakstunden',
    title: 'Bakstunden – Sveriges bästa matrecept för alla tillfällen',
    description: 'Upptäck tusentals enkla, goda recept – från klassiska pannkakor till saftiga kycklingfärsrätter. Snabba vardagsrätter och svenska favoriter för hela familjen!',
    images: [
      {
        url: '/bak-stunden.png',
        width: 1200,
        height: 630,
        alt: 'Bakstunden - Sveriges bästa matrecept för alla tillfällen',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bakstunden – Sveriges bästa matrecept för alla tillfällen',
    description: 'Upptäck tusentals enkla, goda recept – från klassiska pannkakor till saftiga kycklingfärsrätter. Snabba vardagsrätter och svenska favoriter för hela familjen!',
    images: ['/bak-stunden.png'],
  },
  manifest: '/manifest.json',
  other: {
    'msapplication-TileColor': '#FF7A7A',
    'theme-color': '#FF7A7A',
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
    <html lang="sv" dir="ltr">
      <head>
        <meta name="google-site-verification" content="73a51c1ce7036450" />
        <meta name="ahrefs-site-verification" content="22d922fdf84d019c19ae72220da6b8c4acf4889a83938c151cdbc09ee00d5aa2" />
        <meta name="google-adsense-account" content="ca-pub-7907405885837592" />
        <link rel="preconnect" href="https://challenges.cloudflare.com" />
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7907405885837592"
          crossOrigin="anonymous"
        />
        <Script
          src="https://d3u598arehftfk.cloudfront.net/prebid_hb_37238_28732.js"
          strategy="afterInteractive"
        />
        <script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          async
          defer
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${lora.variable} ${crimson.variable} antialiased min-h-screen flex flex-col font-inter`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-5B3M9L45"
            height="0" 
            width="0" 
            className="noscript-hidden"
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
        <HeaderWrapper />
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-lg"
        >
          Hoppa till huvudinnehåll
        </a>
        
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5B3M9L45');`,
          }}
        />
        {/* End Google Tag Manager */}
        
        
        {/* Scroll to top on route change - professional scroll restoration */}
        <ScrollToTop />
        
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        {/* Vercel Analytics and Speed Insights - Only works in production on Vercel */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}