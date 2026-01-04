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
                  Se receptet
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
              Mest sökta recept
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Populära recept som andra älskar
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
                        <span>Utforska recept</span>
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
              Utvalda recept
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Våra mest populära och älskade recept
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
              Se alla recept
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
              Populära kategorier
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Upptäck recept baserat på dina preferenser
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
              Välkommen till Bakstunden – Sveriges bästa receptsamling för alla tillfällen
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 text-left space-y-4">
              <p>
                Bakstunden är din ultimata källa för <Link href="/recept" className="text-purple-600 hover:text-purple-700 font-semibold">svenska matrecept</Link>, <strong>bakning</strong> och matlagningsguider. 
                Vi erbjuder över {totalRecipes} testade recept som passar alla smakar och tillfällen – från 
                snabba vardagsmiddagar till lyxiga festmenyer och klassisk svensk bakning.
              </p>
              <p>
                Oavsett om du söker efter <Link href="/kategorier/kyckling-recept" className="text-purple-600 hover:text-purple-700 font-semibold">enkla kycklingrecept</Link>, <Link href="/kategorier/vegetariska-recept" className="text-purple-600 hover:text-purple-700 font-semibold">vegetarisk mat</Link>, 
                glutenfria alternativ eller traditionella svenska rätter som 
                <Link href="/kategorier/pannkakor-recept" className="text-purple-600 hover:text-purple-700 font-semibold"> pannkakor</Link>, <Link href="/kategorier/kladdkaka-recept" className="text-purple-600 hover:text-purple-700 font-semibold">kladdkaka</Link> och köttbullar, hittar du allt 
                här på Bakstunden. Våra <Link href="/recept" className="text-purple-600 hover:text-purple-700 font-semibold">recept</Link> är noggrant utvalda och testade för att garantera att du lyckas varje gång du lagar mat.
              </p>
              <p>
                Vi tror på att matlagning ska vara både roligt och enkelt. Därför innehåller varje <Link href="/recept" className="text-purple-600 hover:text-purple-700 font-semibold">recept</Link> 
                steg-för-steg instruktioner, tydliga ingredienslistor, näringsvärden och praktiska tips 
                som hjälper dig att bli en bättre kock. Från frukost och lunch till 
                middag och dessert – vi har <Link href="/kategorier" className="text-purple-600 hover:text-purple-700 font-semibold">recepten</Link> som gör din matlagning enklare och godare.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Bakstunden Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Varför välja Bakstunden för dina matrecept?
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
                Testade recept
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Alla våra matrecept är noggrant testade i vårt kök. Vi garanterar att du får perfekta resultat 
                varje gång du följer våra steg-för-steg instruktioner för matlagning och bakning.
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
                Snabba vardagsrecept
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Behöver du <strong>snabba middagar</strong> under 30 minuter? Vi har massor av enkla recept 
                för vardagen som är perfekta när tiden är knapp men du ändå vill servera hemlagad, god mat.
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
                Hälsosamma alternativ
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Upptäck våra <strong>vegetariska recept</strong>, veganska alternativ och 
                glutenfria maträtter. Vi visar att hälsosam mat kan vara både god och enkel att laga.
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
                Svenska favoriter
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Älskar du klassisk svensk mat? Vi har de bästa recepten på svenska pannkakor, 
                köttbullar, kladdkaka och andra traditionella svenska rätter.
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
              Matlagnings tips och råd för bättre resultat
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Lär dig våra bästa tips för att lyckas med matlagning och bakning. 
              Här delar vi med oss av kunskap som gör dig till en bättre kock.
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
                Se alla recept <ArrowRight className="w-4 h-4 ml-1" />
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
                Bakningstips för perfekta resultat
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Mät alltid ingredienserna noggrant när du bakar. Använd rumstempererade ingredienser 
                för bästa resultat i kakor, tårtor och bröd. 
                Förvärm ugnen i god tid innan du börjar baka.
              </p>
              <Link href="/kategorier/kladdkaka-recept" className="text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center">
                Se bakningsrecept <ArrowRight className="w-4 h-4 ml-1" />
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
                Portionsanpassning
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Behöver du justera recept för fler eller färre personer? Multiplicera eller dividera 
                ingredienserna proportionellt. Tänk på att tillagningstider kan behöva justeras vid större portioner.
              </p>
              <Link href="/recept" className="text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center">
                Utforska alla recept <ArrowRight className="w-4 h-4 ml-1" />
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
              <div className="text-purple-200">Testade recept för alla tillfällen</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">15+</div>
              <div className="text-purple-200">Kategorier från frukost till dessert</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-purple-200">Svenska recept med steg-för-steg guide</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - SEO Rich */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Vanliga frågor om matlagning och bakning
          </h2>
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Vilka typer av recept finns på Bakstunden?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                På Bakstunden hittar du över {totalRecipes} <Link href="/recept" className="text-purple-600 hover:text-purple-700 underline">matrecept</Link> inom kategorier som 
                frukost, lunch, middag, 
                bakning och dessert. Vi har allt från <Link href="/kategorier/pannkakor-recept" className="text-purple-600 hover:text-purple-700 underline">pannkakor</Link> och 
                <Link href="/kategorier/vafflor-recept" className="text-purple-600 hover:text-purple-700 underline">våfflor</Link> till <Link href="/kategorier/kyckling-recept" className="text-purple-600 hover:text-purple-700 underline">kycklingrecept</Link>, <Link href="/kategorier/pasta-recept" className="text-purple-600 hover:text-purple-700 underline">pasta</Link>, 
                <Link href="/kategorier/vegetariska-recept" className="text-purple-600 hover:text-purple-700 underline">vegetariska rätter</Link> och klassisk svensk bakning som 
                <Link href="/kategorier/kladdkaka-recept" className="text-purple-600 hover:text-purple-700 underline">kladdkaka</Link> och <Link href="/kategorier/chokladbollar-recept" className="text-purple-600 hover:text-purple-700 underline">choklad bollar</Link>.
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
                Hur hittar jag enkla recept för vardagen?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Du kan filtrera recept på tid och svårighetsgrad för att hitta snabba middagar under 30 minuter. 
                Du kan också filtrera <Link href="/recept" className="text-purple-600 hover:text-purple-700 underline">recept</Link> på svårighetsgrad &quot;Lätt&quot; för att hitta enkla recept som passar 
                nybörjare. Alla våra <Link href="/recept" className="text-purple-600 hover:text-purple-700 underline">vardagsrecept</Link> är enkla att följa med tydliga instruktioner och 
                tillgängliga ingredienser från din lokala mataffär.
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
                Finns det vegetariska och veganska recept?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Ja! Vi har ett stort urval av <Link href="/kategorier/vegetariska-recept" className="text-purple-600 hover:text-purple-700 underline">vegetariska recept</Link> och veganska alternativ. 
                Använd våra filter för att hitta <Link href="/kategorier/vegetariska-recept" className="text-purple-600 hover:text-purple-700 underline">vegetarisk mat</Link>, vegansk mat eller 
                glutenfria recept. Vi visar hur du kan laga näringsrik och god mat utan animaliska produkter, 
                perfekt för dig som vill äta mer hälsosam mat och plantbaserad kost.
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
                Vad gör Bakstundens recept speciella?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Alla våra <strong>svenska matrecept</strong> är noggrant testade och innehåller detaljerade 
                steg-för-steg instruktioner, tydliga ingredienslistor, näringsinformation och 
                praktiska tips. Vi fokuserar på hemlagad mat med ingredienser du hittar i svenska 
                mataffärer. Våra recept passar alla nivåer – från nybörjare till erfarna kockar som letar efter nya 
                matlagningsidéer och bakningsrecept.
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
                Hur kan jag planera min veckomeny?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Använd våra olika <Link href="/kategorier" className="text-purple-600 hover:text-purple-700 underline">kategorier</Link> för att skapa en varierad veckomeny. Blanda 
                <Link href="/kategorier/kyckling-recept" className="text-purple-600 hover:text-purple-700 underline">kycklingrecept</Link>, <Link href="/kategorier/lax-recept" className="text-purple-600 hover:text-purple-700 underline">fiskrätter</Link>, <Link href="/kategorier/pasta-recept" className="text-purple-600 hover:text-purple-700 underline">pasta</Link> och 
                <Link href="/kategorier/vegetariska-recept" className="text-purple-600 hover:text-purple-700 underline">vegetariska middagar</Link> för en balanserad kost. Välj några snabba vardagsrätter 
                för stressiga dagar och planera en mer avancerad helgmiddag när du har mer tid. 
                Spara dina <Link href="/recept" className="text-purple-600 hover:text-purple-700 underline">favoritrecept</Link> för att enkelt hitta dem igen när du planerar din matlagning.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Börja din matlagningsresa idag
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Upptäck över {totalRecipes} testade svenska recept för alla smaker och tillfällen. 
            Från snabb vardagsmat till lyxig festmat – vi har recepten som 
            gör din matlagning enklare och godare.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/recept"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              Utforska alla recept
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/kategorier"
              className="bg-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-800 transition-colors inline-flex items-center justify-center border-2 border-white"
            >
              Bläddra kategorier
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
