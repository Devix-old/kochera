'use client';

import { motion } from 'framer-motion';

export default function CategoryHero({ category, image, description, recipeCount }) {
  // Map categories to beautiful images
  const categoryImages = {
    'Pannkakor': '/images/recipes/pannkakor-recept-2-personer.webp',
    'Våfflor': '/images/recipes/Belgiska-våfflor.png',
    'Kladdkaka': '/images/recipes/filips-basta-kladdkaka.webp',
    'Chokladbollar': '/images/recipes/Chokladbolla.png',
    'Cookies': '/images/nygräddade-kakor-med-strössel-hero-banner.webp',
    'Äppelpaj': '/images/recipes/appelpaj-klassisk-svensk.webp',
    'Vegetariskt': '/images/nygräddade-kakor-med-strössel-hero-banner.webp',
    'Vardagsmat': '/images/nygräddade-kakor-med-strössel-hero-banner.webp',
    'Bakning': '/images/nygräddade-kakor-med-strössel-hero-banner.webp',
    'Pasta': '/images/nygräddade-kakor-med-strössel-hero-banner.webp',
    'Grillmat': '/images/nygräddade-kakor-med-strössel-hero-banner.webp',
    'Desserter': '/images/nygräddade-kakor-med-strössel-hero-banner.webp',
    'Soppor': '/images/nygräddade-kakor-med-strössel-hero-banner.webp',
    'Sallader': '/images/nygräddade-kakor-med-strössel-hero-banner.webp',
    'Kyckling': '/images/nygräddade-kakor-med-strössel-hero-banner.webp',
    'Fisk': '/images/nygräddade-kakor-med-strössel-hero-banner.webp',
    'Snabb middag': '/images/nygräddade-kakor-med-strössel-hero-banner.webp',
    'Glutenfritt': '/images/nygräddade-kakor-med-strössel-hero-banner.webp',
    'default': '/images/nygräddade-kakor-med-strössel-hero-banner.webp',
  };

  const imageSrc = image || categoryImages[category] || categoryImages.default;

  return (
    <section className="relative bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Image Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full aspect-[21/9] md:aspect-[16/7] rounded-3xl overflow-hidden mb-8 shadow-2xl"
        >
          <img
            src={imageSrc}
            alt={category}
            width="1200"
            height="675"
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
          {/* Subtle overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </motion.div>

        {/* Title and Description Below Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 dark:text-white"
            style={{ 
              fontFamily: "'Playfair Display', 'Georgia', serif",
              letterSpacing: '-0.02em'
            }}
          >
            {category}
          </h1>
          
          {description && (
            <p 
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-6"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {description}
            </p>
          )}

          {recipeCount > 0 && (
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full font-semibold">
              <span className="text-2xl font-bold">{recipeCount}</span>
              <span>fantastiska recept</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

