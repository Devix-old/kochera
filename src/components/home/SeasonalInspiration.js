'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Snowflake, Gift, ArrowRight, Clock, Users } from 'lucide-react';

export default function SeasonalInspiration({ recipes }) {
  // Ensure unique recipes by slug
  const uniqueBySlug = (list) => {
    const seenSlugs = new Set();
    return (list || []).filter(item => {
      if (!item?.slug) return false;
      if (seenSlugs.has(item.slug)) return false;
      seenSlugs.add(item.slug);
      return true;
    });
  };

  // Filter for seasonal recipes (baking, holiday-related, comfort foods)
  const baseSeasonal = (recipes || []).filter(r =>
    r?.tags?.some(tag => ['Höst', 'Bakning', 'Comfort food', 'Fest', 'Jul'].includes(tag)) ||
    ['Bakning', 'Desserter', 'Grytor & Soppor'].includes(r?.category)
  );

  // Start with up to 4 unique seasonal picks
  let seasonalRecipes = uniqueBySlug(baseSeasonal).slice(0, 4);

  // Fallback: fill remaining slots with latest unique recipes not already selected
  if (seasonalRecipes.length < 4) {
    const remainingCount = 4 - seasonalRecipes.length;
    const selectedSlugs = new Set(seasonalRecipes.map(r => r.slug));
    const fallback = uniqueBySlug((recipes || [])
      .filter(r => r?.slug && !selectedSlugs.has(r.slug))
      .sort((a, b) => new Date(b?.publishedAt || 0) - new Date(a?.publishedAt || 0)))
      .slice(0, remainingCount);
    seasonalRecipes = [...seasonalRecipes, ...fallback];
  }

  if (seasonalRecipes.length === 0) return null;

  // Get current month for dynamic title
  const currentMonth = new Date().toLocaleDateString('sv-SE', { month: 'long' });
  const season = currentMonth.includes('dec') || currentMonth.includes('jan') || currentMonth.includes('feb') 
    ? '❄️ Vinter'
    : currentMonth.includes('mar') || currentMonth.includes('apr') || currentMonth.includes('maj')
    ? '🌸 Vår'
    : currentMonth.includes('jun') || currentMonth.includes('jul') || currentMonth.includes('aug')
    ? '☀️ Sommar'
    : '🍂 Höst';

  return (
    <section className="py-32 px-12 md:px-16 lg:px-20 xl:px-24 relative overflow-hidden bg-gradient-to-br from-[#FFF8F3] to-white dark:from-gray-900 dark:to-gray-800">

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF7A7A]/10 text-[#FF7A7A] text-sm font-semibold">
              Säsongens recept
            </span>
          </div>
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF7A7A] to-[#FFA07A] bg-clip-text text-transparent"
            style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
          >
            Perfekt för {season}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Mysiga och värmande rätter som passar årstiden perfekt
          </p>
        </motion.div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-4 md:gap-y-8">
          {seasonalRecipes.map((recipe, index) => (
            <motion.div
              key={`${recipe.slug}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/recept/${recipe.slug}`}
                className="group block h-full"
              >
                {/* Card with hover effect */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 h-full">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-full">
                    {recipe.image?.src ? (
                      <img
                        src={recipe.image.src}
                        alt={recipe.image.alt || recipe.recipeName || recipe.title}
                        width="400"
                        height="400"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 rounded-full"
                        loading="lazy"
                        decoding="async"
                        data-related-recipe="true"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FFB4B4] to-[#FFA07A]">
                        <span className="text-white text-4xl">❄️</span>
                      </div>
                    )}
                    
                    {/* Seasonal Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-white/95 backdrop-blur-sm text-[#FF7A7A] text-xs font-bold shadow-md">
                        {season}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-2 text-center">
                    <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#FF7A7A] transition-colors line-clamp-2">
                      {recipe.recipeName || recipe.title}
                    </h3>
                    
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{recipe.totalTimeMinutes || recipe.cookTimeMinutes || 30} min</span>
                      </div>
                      {recipe.servings && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{recipe.servings} port</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/kuchen"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF7A7A] to-[#FFA07A] text-white font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Utforska säsongsrecept
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

