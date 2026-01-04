'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  Clock,
  Users,
  Star,
  ChefHat,
  TrendingUp,
  Heart,
  BookOpen,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Search,
  Grid,
  List
} from 'lucide-react';
import RecipeCard from '@/components/recipe/RecipeCard';

export default function EnhancedCategoryClient({
  category,
  recipes,
  allCategories,
  categoryStats,
  // For "all categories" view
  totalRecipes,
  showAllCategories = false
}) {
  const [activeFilter, setActiveFilter] = useState('alla');
  const [displayCount, setDisplayCount] = useState(12);
  
  // For "all categories" view
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');

  // If showing all categories, render that view
  if (showAllCategories && allCategories) {
    // Sort function
    const sortCategories = (categories) => {
      return [...categories].sort((a, b) => {
        switch (sortBy) {
          case 'popular':
            return b.count - a.count;
          case 'alphabetical':
            return a.name.localeCompare(b.name);
          case 'newest':
            return b.count - a.count;
          default:
            return b.count - a.count;
        }
      });
    };

    // Filter and sort categories
    const filteredCategories = allCategories.filter(cat => 
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const displayedCategories = searchTerm 
      ? sortCategories(filteredCategories)
      : sortCategories(allCategories);

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8F3] to-white dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <section 
          className="relative py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white overflow-hidden"
          suppressHydrationWarning
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 
                className="text-4xl md:text-6xl font-bold mb-6 font-playfair"
                suppressHydrationWarning
              >
                Alla Receptkategorier
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                Upptäck över {totalRecipes} recept i {allCategories.length} kategorier. 
                Från klassiska svenska rätter till internationella favoriter.
              </p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-8">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6" />
                  <span className="text-lg font-semibold">{totalRecipes}+ recept</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChefHat className="w-6 h-6" />
                  <span className="text-lg font-semibold">{allCategories.length} kategorier</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">4.8/5 betyg</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Sök kategorier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Sort and View Controls */}
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="popular">Mest populära</option>
                  <option value="alphabetical">Alfabetisk</option>
                  <option value="newest">Nyaste</option>
                </select>

                <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All Categories Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Alla Kategorier
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Utforska alla våra {allCategories.length} receptkategorier
              </p>
            </motion.div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedCategories.map((cat, index) => (
                  <motion.div
                    key={cat.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={`/kategorier/${cat.slug}`}
                      className="block group"
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-700">
                        <div className="relative h-32 overflow-hidden">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            width="400"
                            height="300"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                          <div className="absolute top-3 right-3">
                            <span className="text-2xl">{cat.icon}</span>
                          </div>
                          <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="text-lg font-bold text-white">
                              {cat.name}
                            </h3>
                            <p className="text-xs text-white/90">
                              {cat.count} recept
                            </p>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                            {cat.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {displayedCategories.map((cat, index) => (
                  <motion.div
                    key={cat.slug}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={`/kategorier/${cat.slug}`}
                      className="block group"
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                          <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                            <img
                              src={cat.image}
                              alt={cat.name}
                              width="80"
                              height="80"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">{cat.icon}</span>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {cat.name}
                              </h3>
                              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                                {cat.count} recept
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                              {cat.description}
                            </p>
                          </div>
                          <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Vanliga Frågor om Kategorier
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Svar på de vanligaste frågorna om våra receptkategorier
              </p>
            </motion.div>

            <div className="space-y-4">
              {[
                {
                  question: 'Hur många receptkategorier finns det?',
                  answer: `Vi har ${allCategories.length} olika receptkategorier med över ${totalRecipes} recept totalt. Kategorierna inkluderar allt från kyckling och pasta till vegetariska rätter och klassiska svenska desserter.`
                },
                {
                  question: 'Vilka är de populäraste receptkategorierna?',
                  answer: `Våra mest populära kategorier är ${allCategories.slice(0, 3).map(cat => cat.name).join(', ')} och ${allCategories[3]?.name || ''}. Dessa kategorier innehåller de flesta recepten och är favoriter bland våra användare.`
                },
                {
                  question: 'Finns det vegetariska receptkategorier?',
                  answer: 'Ja, vi har en dedikerad vegetariska kategorier med många recept. Dessutom hittar du vegetariska alternativ i andra kategorier som pasta, sallader och tillbehör.'
                },
                {
                  question: 'Kan jag filtrera recept efter svårighetsgrad?',
                  answer: 'Ja, alla våra recept är märkta med svårighetsgrad (Lätt, Medel, Svår) så du enkelt kan hitta recept som passar din erfarenhetsnivå. Perfekt för både nybörjare och erfarna kockar!'
                },
                {
                  question: 'Uppdateras kategorierna regelbundet?',
                  answer: 'Ja, vi lägger till nya recept och kategorier kontinuerligt. Följ oss för att få de senaste uppdateringarna och nya receptinspirationer direkt i din feed.'
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">
                    {faq.question}
                  </h3>
                  <div className="text-gray-600 dark:text-gray-400 leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown
                      components={{
                        a: ({ node, ...props }) => (
                          <Link
                            {...props}
                            href={props.href || '#'}
                            className="text-purple-600 dark:text-purple-400 underline hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                          />
                        ),
                      }}
                    >
                      {faq.answer}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Heart className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Redo att Börja Matlaga?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Utforska våra {totalRecipes}+ recept och hitta din nästa favoriträtt!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/recept"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Utforska Alla Recept
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-600 transform hover:scale-105 transition-all duration-300"
                >
                  Tillbaka till Hem
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  // Single category view (original functionality)
  // Filter recipes based on difficulty
  const filteredRecipes = activeFilter === 'alla'
    ? recipes
    : recipes.filter(r => r.difficulty?.toLowerCase() === activeFilter);

  const displayedRecipes = filteredRecipes.slice(0, displayCount);
  const hasMore = displayedRecipes.length < filteredRecipes.length;

  // Related categories (exclude current category)
  const relatedCategories = allCategories
    ? allCategories.filter(cat => cat.slug !== category.slug).slice(0, 4)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F3] to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section 
        className="relative h-[400px] md:h-[500px] overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${category.image})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-4xl md:text-6xl mb-4">
              {category.icon}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-playfair">
              {category.name}
            </h1>
            <p className="text-xl md:text-2xl mb-6 max-w-2xl mx-auto">
              {category.description}
            </p>
            <div className="flex items-center justify-center gap-6 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>{recipes.length} recept</span>
              </div>
              {categoryStats.avgTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>~{Math.round(categoryStats.avgTime)} min</span>
                </div>
              )}
              {categoryStats.avgRating && (
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span>{categoryStats.avgRating.toFixed(1)}/5</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

      </section>

      {/* Quick Stats Section */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
            >
              <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {recipes.length}
              </div>
              <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                Totalt recept
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
            >
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {categoryStats.easyRecipes || 0}
              </div>
              <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                Enkla recept
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
            >
              <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {categoryStats.quickRecipes || 0}
              </div>
              <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                Under 30 min
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center p-4 rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20"
            >
              <div className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2">
                {categoryStats.popularRecipes || 0}
              </div>
              <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                Populära
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Subcategories Section */}
      {category.subcategories && category.subcategories.length > 0 && (
        <section className="py-12 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Utforska {category.name}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Välj din favorit underkategori
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {category.subcategories.map((sub, index) => (
                <motion.div
                  key={sub}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
                >
                  <ChefHat className="w-8 h-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                    {sub}
                  </h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recipes Grid with Filters */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Alla {category.name} Recept
            </h2>
            
            {/* Difficulty Filter */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-6">
              {['alla', 'lätt', 'medel', 'svår'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 md:px-6 py-2 rounded-full text-sm md:text-base font-medium transition-all ${
                    activeFilter === filter
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Recipes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {displayedRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <RecipeCard 
                  recipe={recipe}
                />
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-12">
              <button
                onClick={() => setDisplayCount(prev => prev + 12)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Visa fler recept
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/10 dark:via-pink-900/10 dark:to-orange-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-600 dark:text-purple-400" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Tips för Perfekt {category.name}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Expertråd för att lyckas med dina {category.name.toLowerCase()}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getCategoryTips(category.name).map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {tip.title}
                    </h3>
                    <div className="text-gray-600 dark:text-gray-400 text-sm prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown
                        components={{
                          a: ({ node, ...props }) => (
                            <Link
                              {...props}
                              href={props.href || '#'}
                              className="text-purple-600 dark:text-purple-400 underline hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                            />
                          ),
                        }}
                      >
                        {tip.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Utforska Fler Kategorier
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Upptäck andra spännande recept
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedCategories.map((cat, index) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/kategorier/${cat.slug}`}
                  className="block group relative aspect-square overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    width="400"
                    height="400"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-white">
                    <span className="text-2xl md:text-3xl mb-2">{cat.icon}</span>
                    <h3 className="font-bold text-sm md:text-lg text-center">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Matching Recipe Page Design */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-purple-600" />
              Vanliga frågor om {category.name}
            </h2>
            <div className="space-y-4">
              {getCategoryFAQs(category.name, category.slug).map((faq, index) => (
                <details key={index} className="group">
                  <summary className="flex items-center justify-between w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                    <span className="text-purple-600 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-b-lg">
                    <div className="text-gray-600 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown
                        components={{
                          a: ({ node, ...props }) => (
                            <Link
                              {...props}
                              href={props.href || '#'}
                              className="text-purple-600 dark:text-purple-400 underline hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                            />
                          ),
                        }}
                      >
                        {faq.answer}
                      </ReactMarkdown>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Heart className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Älskar du {category.name}?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Få inspiration direkt till din inkorg med våra bästa recept varje vecka!
            </p>
            <Link
              href="/recept"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Utforska Alla Recept
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Helper function to get category-specific tips
function getCategoryTips(categoryName) {
  const genericTips = [
    {
      title: 'Förbered i förväg',
      content: 'Mät upp alla ingredienser innan du börjar tillagningen för att spara tid och undvika misstag.'
    },
    {
      title: 'Rätt temperatur',
      content: 'Se till att alla ingredienser är i rumstemperatur för bästa resultat, speciellt ägg och smör.'
    },
    {
      title: 'Följ receptet första gången',
      content: 'Följ receptet noggrant första gången, sedan kan du experimentera och anpassa efter din smak.'
    }
  ];

  // Category-specific tips could be added here
  return genericTips;
}

// Helper function to get category-specific FAQs (SEO-optimized for each of 16 categories)
function getCategoryFAQs(categoryName, categorySlug) {
  const faqDatabase = {
    'pannkakor-recept': [
      {
        question: 'Hur får man pannkakor fluffiga?',
        answer: 'För fluffiga pannkakor, låt smeten vila i 10-15 minuter innan stekning. Använd också rumstemperatur på alla ingredienser och vispa inte för hårt – en klumpig smet ger fluffigare resultat än en helt slät smet.'
      },
      {
        question: 'Ska man låta pannkakssmet vila?',
        answer: 'Ja, att låta pannkakssmet vila i 10-30 minuter ger mjölet tid att svälla och resultatet blir jämnare pannkakor med bättre konsistens. Du kan även förvara smeten i kylskåp över natten.'
      },
      {
        question: 'Varför blir mina pannkakor inte gyllene?',
        answer: 'Pannkakor blir inte gyllene om pannan är för kall eller för varm. Använd medelvärme och vänta tills pannan är ordentligt uppvärmd innan du häller i smeten. Ett litet smörklick i pannan ger också fin färg.'
      },
      {
        question: 'Hur många pannkakor blir det av 3 dl mjöl?',
        answer: 'Av 3 dl mjöl blir det cirka 8-10 pannkakor beroende på storlek. Ett grundrecept med 3 dl mjöl räcker till 4 portioner när man räknar 2-3 pannkakor per person.'
      },
      {
        question: 'Kan man frysa pannkakor?',
        answer: 'Ja, stekta pannkakor går utmärkt att frysa! Lägg bakplåtspapper mellan pannkakorna och förvara i fryspåse i upp till 3 månader. Tina i mikrovågsugn eller på låg värme i stekpanna.'
      }
    ],
    'kladdkaka-recept': [
      {
        question: 'Hur får man kladdkaka kladdig i mitten?',
        answer: 'Hemligheten till en kladdig kladdkaka är att inte grädda den för länge. Grädda i 12-15 minuter vid 175°C. Kakan ska vara fast i kanterna men fortfarande skaka lite i mitten när du tar ut den.'
      },
      {
        question: 'Varför sjunker min kladdkaka ihop?',
        answer: 'Kladdkaka sjunker ihop om den är övergräddd eller om ugnen är för varm. Använd rätt temperatur (175°C) och ta ut kakan när den fortfarande är lite lös i mitten. Det är normalt att den sjunker något när den svalnar.'
      },
      {
        question: 'Hur länge håller kladdkaka?',
        answer: 'Kladdkaka håller sig i 3-4 dagar i rumstemperatur under plastfolie eller i lufttät burk. För längre förvaring kan du frysa kladdkakan i upp till 3 månader – den blir till och med kladdigare efter frysning!'
      },
      {
        question: 'Kan man göra kladdkaka dagen innan?',
        answer: 'Ja, kladdkaka är perfekt att göra dagen innan! Den blir faktiskt ännu kladdigare och godare efter att ha stått över natten. Förvara den övertäckt i rumstemperatur för bästa resultat.'
      },
      {
        question: 'Vilken form passar bäst till kladdkaka?',
        answer: 'En rund form (ca 24 cm diameter) eller en långpanna (ca 20x30 cm) fungerar bäst för kladdkaka. Smörj och mjöla formen noga, eller använd bakplåtspapper för att enkelt få loss kakan.'
      }
    ],
    'pasta-recept': [
      {
        question: 'Hur kokar man pasta al dente?',
        answer: 'För att koka pasta al dente, följ förpackningens tid men prova 1-2 minuter tidigare. Pastan ska vara mjuk men ha ett litet motstånd när du biter. Spara alltid lite pastavatten till såsen!'
      },
      {
        question: 'Hur mycket pasta per person?',
        answer: 'Räkna med 80-100 gram torr pasta per person som huvudrätt, eller 50-60 gram som förrätt. För barn räcker ofta 50-70 gram. Färsk pasta sväller mindre än torr, så öka mängden till 120-150 gram.'
      },
      {
        question: 'Varför blir pasta klibbig?',
        answer: 'Pasta blir klibbig om du inte använder tillräckligt med vatten (minst 1 liter per 100g pasta), om du inte rör om tillräckligt, eller om du sköljer pastan efter kokning. Skölj aldrig pasta – stjälk bara av vattnet!'
      },
      {
        question: 'Kan man göra pastasås i förväg?',
        answer: 'Ja, de flesta pastasåser kan göras 2-3 dagar i förväg och förvaras i kylskåp. Värm såsen medan du kokar pastan och blanda ihop precis innan servering för bästa resultat.'
      },
      {
        question: 'Vilken pasta passar till vilken sås?',
        answer: 'Tjocka, kraftiga såser passar till bred pasta som pappardelle eller rigatoni. Tunna, oljiga såser passar bäst till lång tunn pasta som spaghetti. Pastaformer med håligheter fångar upp köttfärssåser perfekt.'
      }
    ],
    'kyckling-recept': [
      {
        question: 'Hur länge ska man steka kycklingfilé?',
        answer: 'Stek kycklingfilé på medelhög värme i 5-7 minuter per sida tills innertemperaturen når 70°C. Låt filen vila 5 minuter efter stekning så blir den saftig och mör.'
      },
      {
        question: 'Hur får man kyckling saftig?',
        answer: 'För saftig kyckling, undvik att översteka och använd stektermometer (70°C är perfekt). Marinera gärna kycklingen i förväg och låt den vila efter stekning. Ett lock på pannan hjälper också att behålla saften.'
      },
      {
        question: 'Kan man frysa tillagad kyckling?',
        answer: 'Ja, tillagad kyckling kan frysas i 2-3 månader. Låt kycklingen svalna helt innan frysning och förvara i lufttäta behållare. Tina i kylskåp och värm till minst 70°C innan servering.'
      },
      {
        question: 'Hur länge håller rå kyckling i kylskåpet?',
        answer: 'Rå kyckling håller 1-2 dagar i kylskåp efter inköp. Förvara den i den kallaste delen (nederst) och använd inom "bäst före"-datum. Luktar den surt eller konstigt ska den inte användas.'
      },
      {
        question: 'Vilken temperatur ska kyckling ha när den är klar?',
        answer: 'Kyckling ska ha en innertemperatur på minst 70°C för att vara säker att äta. Använd en köttermometer i den tjockaste delen av köttet för att kontrollera. Vid 75°C är kycklingen genomstekt men fortfarande saftig.'
      }
    ],
    'vegetariska-recept': [
      {
        question: 'Hur får man vegetarisk mat mättande?',
        answer: 'För mättande vegetarisk mat, inkludera proteinrika ingredienser som bönor, linser, tofu, quinoa och nötter. Kombinera med fullkorn och grönsaker höga i fiber så håller du dig mätt längre.'
      },
      {
        question: 'Var får man protein i vegetarisk mat?',
        answer: 'Proteinkällor i vegetarisk mat inkluderar bönor, linser, kikärtor, tofu, tempeh, seitan, quinoa, nötter, frön, ägg och mejeriprodukter. Kombinera olika källor för komplett proteinintag.'
      },
      {
        question: 'Är vegetarisk mat billigare?',
        answer: 'Ja, vegetarisk mat är ofta billigare än kött. Baljväxter som bönor, linser och kikärtor kostar en bråkdel av kött men är lika mättande. Säsongens grönsaker och egna torkade bönor sparar ytterligare pengar.'
      },
      {
        question: 'Hur ersätter man kött i recept?',
        answer: 'Ersätt kött med bönor, linser, kikärtor, tofu, tempeh, svamp eller vegetarisk färs. Använd samma kryddning som originalet. För grillat kött funkar halloumi eller marinerad tofu utmärkt.'
      },
      {
        question: 'Kan barn äta vegetarisk mat?',
        answer: 'Ja, barn kan äta vegetarisk mat om den är välbalanserad med tillräckligt protein, järn, kalcium och B12. Inkludera varierad kost med bönor, linser, nötter, ägg, mejeri och berikad mat för att täcka alla näringsbehov.'
      }
    ],
    'vafflor-recept': [
      {
        question: 'Hur får man våfflor krispiga?',
        answer: 'För krispiga våfflor, grädda dem på hög värme tills de är gyllengula och låt dem stå på galler (inte tallrik) efter gräddning så torkar ytan. Lite extra smör i smeten ger också kris pigare resultat.'
      },
      {
        question: 'Varför blir våfflorna seg?',
        answer: 'Våfflor blir seg om våffeljärnet är för kallt, om det är för lite fett i smeten, eller om de staplas på varandra direkt efter gräddning. Använd högre värme och låt dem lufttorka på galler.'
      },
      {
        question: 'Kan man frysa våfflor?',
        answer: 'Ja, gräddade våfflor går utmärkt att frysa! Lägg bakplåtspapper mellan våfflorna och förvara i fryspåse i upp till 3 månader. Värm i brödrost eller ugn (inte mikro) för bästa resultat.'
      },
      {
        question: 'Hur många våfflor blir det per portion?',
        answer: 'Räkna med 2-3 våfflor per person som mellanmål eller fika, och 3-4 våfflor som huvudrätt vid brunch. Ett grundrecept med 3 dl mjöl ger cirka 8-10 våfflor.'
      },
      {
        question: 'Varför fastnar våfflorna i järnet?',
        answer: 'Våfflor fastnar om järnet inte är ordentligt förvärmt eller om det behöver mer fett. Pensla järnet med smör eller olja före varje våffla och vänta tills lampan visar att järnet är varmt nog.'
      }
    ],
    'appelpaj-recept': [
      {
        question: 'Vilka äpplen är bäst till äppelpaj?',
        answer: 'Syrlighet äpplen som Granny Smith, Ingrid Marie eller Cox Orange ger bäst smak till äppelpaj. Blanda gärna 2-3 sorter för komplex smak. Undvik för mjuka äpplen som blir mosiga.'
      },
      {
        question: 'Varför blir min äppelpaj blöt?',
        answer: 'Äppelpaj blir blöt om äpplena släpper för mycket vätska. Förbaka botten 10 minuter först, strö över ströbröd innan du lägger på äpplen, och grädda pajen tillräckligt länge så vätskan kokar bort.'
      },
      {
        question: 'Hur länge håller äppelpaj?',
        answer: 'Äppelpaj håller 2-3 dagar i rumstemperatur eller 4-5 dagar i kylskåp. Täck över med folie eller plastfolie. Värm i ugn vid 150°C för att få tillbaka det krispiga.'
      },
      {
        question: 'Kan man frysa äppelpaj?',
        answer: 'Ja, både obakad och bakad äppelpaj går att frysa i 2-3 månader. Frys obacken paj i formen och grädda direkt från frysen (tillsätt 15-20 min). Bakad paj tinas och värms i ugn.'
      },
      {
        question: 'Hur får man smuldeg sprött?',
        answer: 'För sprött smuldeg, använd kallt smör och arbeta snabbt så degen inte blir varm. Strö smuldegen jämnt över äpplena och grädda på rätt temperatur (175-200°C) tills den är gyllenbrun.'
      }
    ],
    'chokladbollar-recept': [
      {
        question: 'Varför blir chokladbollarna för mjuka?',
        answer: 'Chokladbollar blir för mjuka om det är för mycket smör eller för lite torrvaror. Tillsätt mer havregryn eller kakao tills konsistensen går att rulla. Förvaring i kylskåp hjälper också.'
      },
      {
        question: 'Hur länge håller chokladbollar?',
        answer: 'Chokladbollar håller cirka 1 vecka i kylskåp i lufttät burk, eller 2-3 månader i frysen. De smakar bäst efter att ha stått i kylskåp några timmar så konsistensen blir perfekt.'
      },
      {
        question: 'Kan man göra chokladbollar utan kaffe?',
        answer: 'Ja, ersätt kaffet med mjölk, vatten eller välling. Kaffe förstärker chokladsmaken men är inte nödvändigt. För barn passar mjölk eller sockerfri saft bättre än kaffe.'
      },
      {
        question: 'Vilken pärlsocker passar till chokladbollar?',
        answer: 'Både vanlig pärlsocker och pärlsocker i olika färger fungerar fint. Kokos, havregryn, hackade nötter eller kakaopulver är också goda alternativ att rulla chokladbollarna i.'
      },
      {
        question: 'Hur många chokladbollar blir det av ett grundrecept?',
        answer: 'Ett grundrecept med 100g smör ger cirka 20-25 chokladbollar beroende på storlek. Rulla dem lagom stora (3-4 cm i diameter) för perfekt tugga och bäst konsistens.'
      }
    ],
    'kycklingfars-recept': [
      {
        question: 'Hur länge ska man steka kycklingfärs?',
        answer: 'Stek kycklingfärs på medelhög värme i 7-10 minuter tills den är helt genomstekt utan rosa delar. Rör om regelbundet så färsen blir jämnt stekt och inte klumpig.'
      },
      {
        question: 'Är kycklingfärs nyttigare än nötfärs?',
        answer: 'Ja, kycklingfärs innehåller mindre fett och färre kalorier än nötfärs. Den är rikare på protein och lägre på mättat fett, vilket gör den till ett hälsosammare val för de flesta rätter.'
      },
      {
        question: 'Kan man frysa kycklingfärs?',
        answer: 'Ja, rå kycklingfärs kan frysas i 3-4 månader. Dela upp i portioner innan frysning och tina i kylskåp över natten. Tillagad kycklingfärs håller 2-3 månader i frysen.'
      },
      {
        question: 'Vad kan man göra av kycklingfärs?',
        answer: 'Kycklingfärs är mångsidig och passar till köttbullar, färsbiffar, tacos, pastasås, wok, fyllningar till pajer, kycklingkorv, nudelsoppa och mycket mer. Den tar upp smak väl och är snabb att tillaga.'
      },
      {
        question: 'Hur kryddar man kycklingfärs?',
        answer: 'Kycklingfärs har mild smak så krydda gärna ordentligt. Salt, peppar, vitlök och lök är bas. Tillsätt paprika, spiskummin, örter, chili eller soja beroende på rätt för mer smak.'
      }
    ],
    'lax-recept': [
      {
        question: 'Hur länge ska man steka lax?',
        answer: 'Stek lax på medelvärme i 3-4 minuter per sida för en 2-3 cm tjock fil é. Laxen är klar när köttet lättare delar sig i flisor och är ljusrosa i mitten. Överstekt lax blir torr.'
      },
      {
        question: 'Vilken temperatur ska lax ha i ugn?',
        answer: 'Grädda lax i ugn vid 175-200°C i 12-15 minuter för en normal filé (150-200g). Innertemperaturen ska vara 50-55°C för medium eller 60°C för genomstekt. Högre temperatur ger torrare lax.'
      },
      {
        question: 'Hur vet man om lax är färdig?',
        answer: 'Lax är färdig när köttet lätt delar sig i flisor längs fibrerna och färgen är ljusrosa genomgående. En köttermometer ska visa 50-55°C. Köttet ska vara ogenomskinligt, inte genomskinligt.'
      },
      {
        question: 'Kan man äta lax varje dag?',
        answer: 'Ja, lax är hälsosam och innehåller nyttiga omega-3-fettsyror, protein och D-vitamin. Dock rekommenderas variation i kosten. 2-3 gånger per vecka är en bra balans för de flesta.'
      },
      {
        question: 'Hur förvarar man lax i kylskåp?',
        answer: 'Förvara rå lax i den kallaste delen av kylskåpet (0-4°C) och använd inom 1-2 dagar efter inköp. Håll den täckt och separat från annan mat. Tillagad lax håller 3-4 dagar i kylskåp.'
      }
    ],
    'lasagne-recept': [
      {
        question: 'Hur många lager ska lasagne ha?',
        answer: 'En klassisk lasagne har 3-4 lager med pastaplåtar. Börja med köttfärssås i botten, följ med pastaplåtar, béchamelsås, repetera och avsluta med ost på toppen. För djupare form kan du göra fler lager.'
      },
      {
        question: 'Varför blir lasagne vattnig?',
        answer: 'Lasagne blir vattnig om köttfärssåsen är för tunn eller om det är för mycket sås. Låt köttfärssåsen koka in ordentligt innan montering. Använd också färre sås än du tror – pastan absorberar vätska.'
      },
      {
        question: 'Kan man göra lasagne dagen innan?',
        answer: 'Ja, lasagne blir faktigt bättre om den monteras dagen innan! Förvara övertäckt i kylskåp över natten så hinner smakerna utvecklas och pastan mjukna. Grädda direkt från kylen, tillsätt 10-15 min på tiden.'
      },
      {
        question: 'Hur länge ska lasagne vara i ugnen?',
        answer: 'Grädda lasagne i 35-45 minuter vid 180-200°C tills den är gyllenbrun på toppen och bubblar runt kanterna. Täck med folie första 20 minuterna om osten blir för mörk. Låt vila 10 min innan servering.'
      },
      {
        question: 'Kan man frysa lasagne?',
        answer: 'Ja, lasagne går utmärkt att frysa! Frys obakad i formen täckt med folie i 2-3 månader, eller portionera bakad lasagne. Tina i kylskåp över natten och grädda/värm i ugn för bästa resultat.'
      }
    ],
    'scones-recept': [
      {
        question: 'Varför blir scones hårda?',
        answer: 'Scones blir hårda om degen är överarbetad eller om de gräddas för länge. Arbeta degen minimalt, använd kallt smör och grädda bara tills de fått färg. Övergräddade scones blir torra och hårda.'
      },
      {
        question: 'Hur får man scones fluffiga?',
        answer: 'För fluffiga scones, använd kallt smör, arbeta degen lätt utan att knåda, och använd tillräckligt med bakpulver. Grädda på hög temperatur (220-230°C) i kort tid. Lägg sconesen tätt på plåten så de stiger uppåt.'
      },
      {
        question: 'Kan man göra sconesdeg i förväg?',
        answer: 'Ja, formad sconesdeg kan förvaras i kylskåp i 24 timmar innan gräddning, eller frysas i 1 månad. Grädda från kylen (tillsätt 2-3 min) eller direkt från frysen (tillsätt 5-7 min).'
      },
      {
        question: 'Vad serverar man till scones?',
        answer: 'Traditionellt serveras scones med clotted cream eller crème fraiche och sylt (jordgubbssylt är klassiskt). Smör, honung eller lemon curd är också goda alternativ. Servera med te för en klassisk afternoon tea.'
      },
      {
        question: 'Hur länge håller scones?',
        answer: 'Scones håller 1-2 dagar i lufttät burk i rumstemperatur. Värm dem i ugn vid 150°C i 5 minuter för att fräscha upp. Frysta scones håller 1 månad och värms direkt från frysen.'
      }
    ],
    'kycklinglarfile-recept': [
      {
        question: 'Hur länge ska kycklinglårfilé vara i ugnen?',
        answer: 'Grädda kycklinglårfilé i ugn vid 175-200°C i 25-30 minuter tills innertemperaturen når 75°C. Lårfilé tål längre tillagning än kycklingbröst och blir saftigare och mer smakrik.'
      },
      {
        question: 'Är kycklinglårfilé nyttigare än kycklingbröst?',
        answer: 'Kycklinglårfilé innehåller mer fett än kycklingbröst men också mer smak och järn. Den är saftigare och svårare att översteka. Skillnaden i kalorier är inte så stor – välj efter vad du föredrar.'
      },
      {
        question: 'Hur tar man bort skinn på kycklinglårfilé?',
        answer: 'Dra försiktigt bort skinnet från lårfilén med fingrarna. Börja från ena änden och dra längs köttet. Ett pappershushåll hjälper att få grepp om det hala skinnet. Skinnet går också att använda till annat.'
      },
      {
        question: 'Kan man marinera kycklinglårfilé?',
        answer: 'Ja, kycklinglårfilé är perfekt att marinera! Lårfilen tar upp marinaden väl och blir extra smakrik och saftig. Marinera i minst 30 minuter men gärna över natten för bäst resultat.'
      },
      {
        question: 'Vad kan man göra av kycklinglårfilé?',
        answer: 'Kycklinglårfilé passar till grillning, stekning, wok, curry, tacos, kycklingspett, ugnsbakad kyckling, kycklinggryta och mycket mer. Den är mer förlåtande än kycklingbröst och blir sällan torr.'
      }
    ],
    'appelmos-recept': [
      {
        question: 'Vilka äpplen är bäst till äppelmos?',
        answer: 'Mjuka, söta äpplen som Aroma, Gravensten eller Ingrid Marie ger god äppelmos. Blanda gärna 2-3 sorter för komplex smak. Syrliga äpplen behöver mer socker medan söta behöver mindre.'
      },
      {
        question: 'Hur länge kokar man äppelmos?',
        answer: 'Koka äppelmos i 15-20 minuter på låg värme tills äpplena är mjuka och lätt att mosa. Rör om då och då så det inte bränner vid. För slät mos, använd stavmixer eller passa genom sil.'
      },
      {
        question: 'Kan man göra äppelmos utan socker?',
        answer: 'Ja, om du använder söta äppelsorter behövs inget tillsatt socker. Smaka av och tillsätt socker, honung eller stevia bara om det behövs. Kanel förstärker sötman naturligt.'
      },
      {
        question: 'Hur länge håller äppelmos?',
        answer: 'Hemgjord äppelmos håller 5-7 dagar i kylskåp i lufttät burk, eller 6-8 månader i frysen. För längre förvaring kan du hetta på burkar och konservera moset – då håller det över 1 år.'
      },
      {
        question: 'Kan man frysa äppelmos?',
        answer: 'Ja, äppelmos fryser utmärkt! Frys i portioner i burkar eller fryspåsar i 6-8 månader. Tina i kylskåp över natten eller i rumstemperatur. Rör om efter upptining för jämn konsistens.'
      }
    ],
    'kaka-cookies-recept': [
      {
        question: 'Varför blir kakor hårda?',
        answer: 'Kakor blir hårda om de gräddas för länge, om det är för lite fett i smeten, eller om du använder för mycket mjöl. Ta ut kakorna när de fortfarande är lite mjuka i mitten – de stelnar när de svalnar.'
      },
      {
        question: 'Hur får man kakor mjuka i mitten?',
        answer: 'För mjuka kakor, grädda kortare tid (8-10 min) tills kanterna stelnat men mitten fortfarande ser lite rå ut. Använd mer smör och brunt socker. Förvara kakorna i lufttät burk med brödskiva för mjukhet.'
      },
      {
        question: 'Kan man frysa kakdeg?',
        answer: 'Ja, både rullad och formad kakdeg fryser perfekt! Frys rullad deg inplastad i 3 månader. Formade cookies kan frysas på plåt och gräddas direkt från frysen (tillsätt 2-3 min).'
      },
      {
        question: 'Varför rinner kakor ut?',
        answer: 'Kakor rinner ut om smöret är för varmt, om degen inte fått vila i kylen, eller om ugnen är för kall. Kyl degen i 30 min innan gräddning och se till att ugnen är ordentligt förvärmde.'
      },
      {
        question: 'Hur länge håller hemgjorda kakor?',
        answer: 'Hemgjorda kakor håller 1-2 veckor i lufttät burk i rumstemperatur, beroende på innehåll. Kakor med choklad eller nötter håller lite kortare. Frysta kakor håller 2-3 månader.'
      }
    ]
  };

  // Return category-specific FAQs or fallback to generic
  return faqDatabase[categorySlug] || [
    {
      question: `Hur lång tid tar det att laga ${categoryName.toLowerCase()}?`,
      answer: `Tiden varierar beroende på recept, men de flesta ${categoryName.toLowerCase()} recept tar mellan 20-45 minuter att tillaga.`
    },
    {
      question: `Kan man frysa ${categoryName.toLowerCase()}?`,
      answer: `Ja, de flesta ${categoryName.toLowerCase()} recept går bra att frysa. Låt dem svalna helt innan frysning och förvara i lufttäta behållare i upp till 3 månader.`
    },
    {
      question: `Är ${categoryName.toLowerCase()} recept lämpliga för nybörjare?`,
      answer: `Ja! Vi har många enkla ${categoryName.toLowerCase()} recept märkta som "Lätt" svårighetsgrad som är perfekta för nybörjare.`
    }
  ];
}

