'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Users, Star, ArrowRight, Utensils, Heart, Globe, Zap } from 'lucide-react';
import RecipeCard from '@/components/recipe/RecipeCard';
import { getAllCategories } from '@/lib/categories';
import LeaderboardAd from '@/components/ads/LeaderboardAd';
import ConditionalBillboard from '@/components/ads/ConditionalBillboard';
import MobileLearderboard from '@/components/ads/MobileLearderboard';

export default function EnhancedHomeClient({
  popularCategories,
  totalRecipes,
  featuredRecipes,
  allRecipes,
  articles,
  authors
}) {
  // Auto-sliding hero images - defined before useState to ensure consistent reference
  const images = [
    {
        src: '/images/godaste-lasagne-hero.webp',
        mobileSrc: '/images/godaste-lasagne-mobile-hero.webp',
        alt: 'Godaste lasagne recept',
        title: 'Godaste lasagne recept',
        subtitle: 'Krämig, lyxig och helt oemotståndlig. Vårt bästa lasagnerecept med perfekt balans mellan köttfärs, sås och ost.',
        href: '/recept/godaste-lasagne-recept',
        positionClass: 'object-center'
      },
      {
        src: '/images/amerikanska-pannkakor-hero.webp',
        mobileSrc: '/images/amerikanska-pannkakor-mobile-hero.webp',
        alt: 'Amerikanska pannkakor recept',
        title: 'Amerikanska pannkakor',
        subtitle: 'Fluffiga, gyllenbruna pannkakor perfekta till helgfrukosten. Enkelt recept som hela familjen älskar.',
        href: '/recept/amerikanska-pannkakor',
        positionClass: 'object-center'
      },
      {
        src: '/images/kyckling-i-ugn-hero.webp',
        mobileSrc: '/images/kyckling-i-ugn-mobile-hero.webp',
        alt: 'Världens godaste kyckling i ugn',
        title: 'Världens godaste kyckling i ugn',
        subtitle: 'Saftig, krispig och full av smak. Detta recept ger dig den perfekta kycklingen varje gång.',
        href: '/recept/varldens-godaste-kyckling-i-ugn',
        positionClass: 'object-center'
      }
  ];

  // Initialize with 0 to match server-side render
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const allCategories = getAllCategories();

  // Helper function to convert Tailwind position classes to CSS object-position
  const getObjectPosition = (positionClass) => {
    if (!positionClass) return 'center';
    
    // Handle responsive classes - use the base class or md: class based on screen size
    // For simplicity, we'll use the md: value which is more common for hero images
    if (positionClass.includes('center_80%')) return 'center 80%';
    if (positionClass.includes('object-right object-bottom')) return 'right bottom';
    if (positionClass.includes('object-right object-center')) return 'right center';
    if (positionClass.includes('object-center')) return 'center';
    if (positionClass.includes('object-right')) return 'right center';
    
    return 'center';
  };

  // Only start auto-sliding after component mounts to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [images.length]);

  const quickAccessItems = [
    {
      title: 'Pannkakor recept',
      description: 'Fluffiga och goda',
      href: '/kategorier/pannkakor-recept',
      color: 'from-yellow-400 to-orange-500',
      image: '/images/pannkakor-recept.webp'
    },
    {
      title: 'Kycklingfärs recept',
      description: 'Enkla och mätta',
      href: '/kategorier/kycklingfars-recept',
      color: 'from-orange-400 to-red-500',
      image: '/images/kycklingfarsbiffar-med-potatis-och-lingon.webp'
    },
    {
      title: 'Kyckling recept',
      description: 'Hälsosam och god',
      href: '/kategorier/kyckling-recept',
      color: 'from-amber-400 to-yellow-500',
      image: '/images/kyckling-recept.webp'
    },
    {
      title: 'Pasta recept',
      description: 'Italienska favoriter',
      href: '/kategorier/pasta-recept',
      color: 'from-red-400 to-pink-500',
      image: '/images/pasta-recept-kyckling-svampsas.webp'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          {/* Desktop image - hidden on mobile, visible on md and up */}
          <div className="hidden md:block absolute inset-0">
            <img
              src={images[currentSlide].src}
              alt={images[currentSlide].alt}
              width="1920"
              height="1080"
              className="w-full h-full object-cover transition-opacity duration-1000"
              style={{
                objectPosition: getObjectPosition(images[currentSlide].positionClass)
              }}
              loading="eager"
              decoding="async"
            />
          </div>
          {/* Mobile image - visible on mobile, hidden on md and up */}
          <div className="block md:hidden absolute inset-0">
            <img
              src={images[currentSlide].mobileSrc || images[currentSlide].src}
              alt={images[currentSlide].alt}
              width="768"
              height="1024"
              className="w-full h-full object-cover transition-opacity duration-1000"
              style={{
                objectPosition: getObjectPosition(images[currentSlide].positionClass)
              }}
              loading="eager"
              decoding="async"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  w-full">
            <motion.div
              key={currentSlide}
              initial={isMounted ? { opacity: 0, y: 20 } : false}
              animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                {images[currentSlide].title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8">
                {images[currentSlide].subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={images[currentSlide].href}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
                >
                  Rezept ansehen
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Meistgesuchte Rezepte
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Beliebte Rezepte, die andere lieben
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickAccessItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="block group"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700 group">
                    {/* Image with elegant title overlay */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        width="400"
                        height="300"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                      {/* Elegant gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Professional title at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-2xl">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Minimal action section */}
                    <div className="bg-white dark:bg-gray-800 p-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        <span>Rezepte entdecken</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <LeaderboardAd />
      </div>

      {/* Featured Recipes */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ausgewählte Rezepte
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Unsere beliebtesten und beliebtesten Rezepte
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRecipes.slice(0, 8).map((recipe, index) => (
              <motion.div
                key={recipe.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <RecipeCard 
                  recipe={recipe} 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/recept"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
            >
              Alle Rezepte ansehen
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Mobile Leaderboard Ad - After Featured Recipes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:hidden">
        <MobileLearderboard />
      </div>

      {/* Popular Categories */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Beliebte Kategorien
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Entdecke Rezepte basierend auf deinen Vorlieben
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularCategories.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Link
                  href={`/kategorier/${category.slug}`}
                  className="block group"
                >
                  <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        width="400"
                        height="300"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {category.count}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Billboard Ad - After Popular Categories (Desktop only) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ConditionalBillboard />
      </div>

      {/* Welcome/About Section - SEO Rich Content */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Willkommen bei Kochera – Deutschlands beste Rezeptsammlung für jeden Anlass
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 text-left space-y-4">
              <p>
                Kochera ist deine ultimative Quelle für <Link href="/recept" className="text-purple-600 hover:text-purple-700 font-semibold">deutsche Rezepte</Link>, <strong>Backen</strong> und Kochtipps. 
                Wir bieten über {totalRecipes} getestete Rezepte, die zu allen Geschmäckern und Anlässen passen – von 
                schnellen Alltagsgerichten bis hin zu luxuriösen Festmenüs und klassischem deutschen Backen.
              </p>
              <p>
                Egal ob du nach <Link href="/kategorier/kyckling-recept" className="text-purple-600 hover:text-purple-700 font-semibold">einfachen Hähnchenrezepten</Link>, <Link href="/kategorier/vegetariska-recept" className="text-purple-600 hover:text-purple-700 font-semibold">vegetarischem Essen</Link>, 
                glutenfreien Alternativen oder traditionellen deutschen Gerichten suchst, findest du alles 
                hier bei Kochera. Unsere <Link href="/recept" className="text-purple-600 hover:text-purple-700 font-semibold">Rezepte</Link> sind sorgfältig ausgewählt und getestet, um sicherzustellen, dass du jedes Mal Erfolg beim Kochen hast.
              </p>
              <p>
                Wir glauben, dass Kochen sowohl Spaß machen als auch einfach sein sollte. Daher enthält jedes <Link href="/recept" className="text-purple-600 hover:text-purple-700 font-semibold">Rezept</Link> 
                Schritt-für-Schritt-Anleitungen, klare Zutatenlisten, Nährwertangaben und praktische Tipps 
                die dir helfen, ein besserer Koch zu werden. Von Frühstück und Mittagessen bis 
                Abendessen und Dessert – wir haben die <Link href="/kategorier" className="text-purple-600 hover:text-purple-700 font-semibold">Rezepte</Link>, die dein Kochen einfacher und leckerer machen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Kochera Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Warum Kochera für deine Rezepte wählen?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md"
            >
              <Utensils className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Getestete Rezepte
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Alle unsere Rezepte sind sorgfältig in unserer Küche getestet. Wir garantieren, dass du perfekte Ergebnisse 
                erzielst, wenn du unseren Schritt-für-Schritt-Anleitungen zum Kochen und Backen folgst.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md"
            >
              <Clock className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Schnelle Alltagsrezepte
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Brauchst du <strong>schnelle Abendessen</strong> unter 30 Minuten? Wir haben viele einfache Rezepte 
                für den Alltag, die perfekt sind, wenn die Zeit knapp ist, aber du trotzdem hausgemachtes, leckeres Essen servieren möchtest.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md"
            >
              <Heart className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Gesunde Alternativen
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Entdecke unsere <strong>vegetarischen Rezepte</strong>, veganen Alternativen und 
                glutenfreien Gerichte. Wir zeigen, dass gesundes Essen sowohl lecker als auch einfach zuzubereiten sein kann.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md"
            >
              <Globe className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Deutsche Klassiker
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Liebst du klassische deutsche Küche? Wir haben die besten Rezepte für deutsche Pfannkuchen, 
                Frikadellen, Brownies und andere traditionelle deutsche Gerichte.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cooking Tips Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Kochtipps und Ratschläge für bessere Ergebnisse
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Lerne unsere besten Tipps, um beim Kochen und Backen erfolgreich zu sein. 
              Hier teilen wir Wissen, das dich zu einem besseren Koch macht.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                <Zap className="w-6 h-6 text-yellow-500 mr-2" />
                Snabba måltidstips
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Förbered ingredienser i förväg för att spara tid. Hacka grönsaker, marinera kött och mät upp kryddor 
                innan du börjar laga mat. Detta gör matlagningen mycket snabbare och smidigare.
              </p>
              <Link href="/recept" className="text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center">
                Alle Rezepte ansehen <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                <Star className="w-6 h-6 text-yellow-500 mr-2" />
                Backtipps für perfekte Ergebnisse
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Miss immer die Zutaten genau ab, wenn du backst. Verwende Zutaten auf Zimmertemperatur 
                für die besten Ergebnisse bei Kuchen, Torten und Brot. 
                Heize den Ofen rechtzeitig vor, bevor du mit dem Backen beginnst.
              </p>
              <Link href="/kategorier/kladdkaka-recept" className="text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center">
                Backrezepte ansehen <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                <Users className="w-6 h-6 text-yellow-500 mr-2" />
                Portionsanpassung
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Musst du Rezepte für mehr oder weniger Personen anpassen? Multipliziere oder dividiere 
                die Zutaten proportional. Denke daran, dass die Zubereitungszeiten bei größeren Portionen angepasst werden müssen.
              </p>
              <Link href="/recept" className="text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center">
                Alle Rezepte entdecken <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">{totalRecipes}+</div>
              <div className="text-purple-200">Getestete Rezepte für jeden Anlass</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">15+</div>
              <div className="text-purple-200">Kategorien von Frühstück bis Dessert</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-purple-200">Deutsche Rezepte mit Schritt-für-Schritt-Anleitung</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - SEO Rich */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Häufige Fragen zum Kochen und Backen
          </h2>
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Welche Arten von Rezepten gibt es bei Kochera?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Bei Kochera findest du über {totalRecipes} <Link href="/recept" className="text-purple-600 hover:text-purple-700 underline">Rezepte</Link> in Kategorien wie 
                Frühstück, Mittagessen, Abendessen, 
                Backen und Dessert. Wir haben alles von <Link href="/kategorier/pannkakor-recept" className="text-purple-600 hover:text-purple-700 underline">Pfannkuchen</Link> und 
                <Link href="/kategorier/vafflor-recept" className="text-purple-600 hover:text-purple-700 underline">Waffeln</Link> bis hin zu <Link href="/kategorier/kyckling-recept" className="text-purple-600 hover:text-purple-700 underline">Hähnchenrezepten</Link>, <Link href="/kategorier/pasta-recept" className="text-purple-600 hover:text-purple-700 underline">Pasta</Link>, 
                <Link href="/kategorier/vegetariska-recept" className="text-purple-600 hover:text-purple-700 underline">vegetarischen Gerichten</Link> und klassischem deutschem Backen wie 
                <Link href="/kategorier/kladdkaka-recept" className="text-purple-600 hover:text-purple-700 underline">Brownies</Link> und <Link href="/kategorier/chokladbollar-recept" className="text-purple-600 hover:text-purple-700 underline">Schokobällchen</Link>.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Wie finde ich einfache Rezepte für den Alltag?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Du kannst Rezepte nach Zeit und Schwierigkeitsgrad filtern, um schnelle Abendessen unter 30 Minuten zu finden. 
                Du kannst auch <Link href="/recept" className="text-purple-600 hover:text-purple-700 underline">Rezepte</Link> nach Schwierigkeitsgrad &quot;Einfach&quot; filtern, um einfache Rezepte zu finden, die für 
                Anfänger geeignet sind. Alle unsere <Link href="/recept" className="text-purple-600 hover:text-purple-700 underline">Alltagsrezepte</Link> sind einfach zu befolgen mit klaren Anleitungen und 
                verfügbaren Zutaten aus deinem lokalen Supermarkt.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Gibt es vegetarische und vegane Rezepte?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Ja! Wir haben eine große Auswahl an <Link href="/kategorier/vegetariska-recept" className="text-purple-600 hover:text-purple-700 underline">vegetarischen Rezepten</Link> und veganen Alternativen. 
                Nutze unsere Filter, um <Link href="/kategorier/vegetariska-recept" className="text-purple-600 hover:text-purple-700 underline">vegetarisches Essen</Link>, veganes Essen oder 
                glutenfreie Rezepte zu finden. Wir zeigen dir, wie du nährstoffreiche und leckere Gerichte ohne tierische Produkte zubereiten kannst, 
                perfekt für dich, wenn du gesünder essen und dich pflanzenbasiert ernähren möchtest.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Was macht Kocheras Rezepte besonders?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Alle unsere <strong>deutschen Rezepte</strong> sind sorgfältig getestet und enthalten detaillierte 
                Schritt-für-Schritt-Anleitungen, klare Zutatenlisten, Nährwertangaben und 
                praktische Tipps. Wir konzentrieren uns auf hausgemachtes Essen mit Zutaten, die du in deutschen 
                Supermärkten findest. Unsere Rezepte passen für alle Levels – von Anfängern bis zu erfahrenen Köchen, die nach neuen 
                Kochideen und Backrezepten suchen.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Wie kann ich meine Wochenmenü planen?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Nutze unsere verschiedenen <Link href="/kategorier" className="text-purple-600 hover:text-purple-700 underline">Kategorien</Link>, um eine abwechslungsreiche Wochenmenü zu erstellen. Mische 
                <Link href="/kategorier/kyckling-recept" className="text-purple-600 hover:text-purple-700 underline">Hähnchenrezepte</Link>, <Link href="/kategorier/lax-recept" className="text-purple-600 hover:text-purple-700 underline">Fischgerichte</Link>, <Link href="/kategorier/pasta-recept" className="text-purple-600 hover:text-purple-700 underline">Pasta</Link> und 
                <Link href="/kategorier/vegetariska-recept" className="text-purple-600 hover:text-purple-700 underline">vegetarische Abendessen</Link> für eine ausgewogene Ernährung. Wähle einige schnelle Alltagsgerichte 
                für stressige Tage und plane ein anspruchsvolleres Wochenendessen, wenn du mehr Zeit hast. 
                Speichere deine <Link href="/recept" className="text-purple-600 hover:text-purple-700 underline">Lieblingsrezepte</Link>, um sie beim Planen deiner Mahlzeiten einfach wiederzufinden.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Beginne heute deine Kochreise
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Entdecke über {totalRecipes} getestete deutsche Rezepte für alle Geschmäcker und Anlässe. 
            Von schnellem Alltagsessen bis hin zu luxuriösem Festessen – wir haben die Rezepte, die 
            dein Kochen einfacher und leckerer machen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/recept"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              Alle Rezepte entdecken
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/kategorier"
              className="bg-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-800 transition-colors inline-flex items-center justify-center border-2 border-white"
            >
              Kategorien durchsuchen
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
