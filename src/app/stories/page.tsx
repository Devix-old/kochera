import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Web Stories - kochera | Interaktive Rezepte & Kochenspiration',
  description: 'Entdecke unsere interaktiven Web Stories mit Schritt-für-Schritt Rezepten, Kochenspiration und Backtipps. Perfekt für Mobil und Desktop!',
  keywords: 'web stories, rezept stories, interaktive rezepte, kochenspiration, backen, pfannkuchen, brunch',
  openGraph: {
    title: 'Web Stories - kochera | Interaktive Rezepte',
    description: 'Entdecke unsere interaktiven Web Stories mit Schritt-für-Schritt Rezepten und Kochenspiration.',
    url: 'https://kochera.de/stories',
    siteName: 'kochera',
    images: [
      {
        url: 'https://kochera.de/images/stories/amerikanska-pannkakor-cover-1.webp',
        width: 720,
        height: 1280,
        alt: 'Amerikanska Pannkakor Web Story',
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Stories - kochera | Interaktive Rezepte',
    description: 'Entdecke unsere interaktiven Web Stories mit Schritt-für-Schritt Rezepten und Kochenspiration.',
    images: ['https://kochera.de/images/stories/amerikanska-pannkakor-cover-1.webp'],
  },
  alternates: {
    canonical: 'https://kochera.de/stories',
  },
}

const stories = [
  {
    id: 'amerikanska-pannkakor',
    title: 'Amerikanische Pfannkuchen – Fluffig zum Brunch',
    description: 'Klassisches Rezept für die ganze Familie mit Ahornsirup und Blaubeeren',
    image: '/images/stories/amerikanska-pannkakor-cover-1.webp',
    duration: '20 min',
    difficulty: 'Enkel',
    category: 'Brunch',
    slug: 'amerikanska-pannkakor',
    featured: true,
  },
  // Placeholder for future stories
  {
    id: 'coming-soon-1',
    title: 'Schokokuchen – Der Beste',
    description: 'Dunkler Schokokuchen mit perfekt klebriger Konsistenz',
    image: '/images/recipes/kladdkaka-godaste-och-harligaste.webp',
    duration: '45 min',
    difficulty: 'Enkel',
    category: 'Dessert',
    slug: 'coming-soon',
    featured: false,
  },
  {
    id: 'coming-soon-2',
    title: 'Klassische Pfannkuchen',
    description: 'Dünne Pfannkuchen mit Marmelade und Sahne',
    image: '/images/recipes/svenska-pannkakor-klassisk.webp',
    duration: '30 min',
    difficulty: 'Enkel',
    category: 'Brunch',
    slug: 'coming-soon',
    featured: false,
  },
]

export default function StoriesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Web Stories - kochera",
            "description": "Interaktiva Web Stories med steg-för-steg recept och matinspiration",
            "url": "https://kochera.de/stories",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": stories.map((story, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "CreativeWork",
                  "name": story.title,
                  "description": story.description,
                  "url": `https://kochera.de/stories/${story.slug}`,
                  "image": `https://kochera.de${story.image}`,
                }
              }))
            }
          })
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-red-50">
        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              📱 Web Stories
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Entdecke unsere interaktiven Rezepte in Form von ansprechenden Web Stories. 
              Perfekt für Mobil und Desktop mit Schritt-für-Schritt Anleitungen.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                ⚡ AMP-optimerat
              </span>
              <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                📱 Mobilvänligt
              </span>
              <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                🎯 Interaktivt
              </span>
            </div>
          </div>
        </section>

        {/* Stories Grid */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Våra Web Stories
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className={`group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                    story.featured ? 'ring-2 ring-orange-400' : ''
                  }`}
                >
                  {story.featured && (
                    <div className="absolute top-4 left-4 z-10 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ⭐ Beliebt
                    </div>
                  )}
                  
                  <div className="relative aspect-[9/16] overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.title}
                      width="400"
                      height="711"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Story Icon */}
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <span className="text-2xl">📱</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                        {story.category}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 text-sm">{story.duration}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 text-sm">{story.difficulty}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                      {story.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {story.description}
                    </p>
                    
                    {story.slug !== 'coming-soon' ? (
                      <Link
                        href={`/stories/${story.slug}`}
                        className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors group-hover:shadow-lg"
                      >
                        Story öffnen
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-500 px-6 py-3 rounded-full font-semibold cursor-not-allowed">
                        Kommt Bald
                        <span>⏳</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-white/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Möchten Sie mehr Web Stories sehen?
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Wir arbeiten ständig daran, neue interaktive Rezepte zu erstellen. 
              Folgen Sie uns, um als Erster die neuesten Web Stories zu sehen!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/rezepte"
                className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl"
              >
                Alle Rezepte ansehen
                <span>🍳</span>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-white text-orange-500 border-2 border-orange-500 px-8 py-4 rounded-full font-semibold hover:bg-orange-50 transition-colors"
              >
                Zurück zur Startseite
                <span>🏠</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}




