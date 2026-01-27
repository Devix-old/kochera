import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Clock, Users, Star, ChefHat, Lightbulb, Heart, Share2, BookOpen, ArrowRight } from 'lucide-react';
import { formatYieldLabel } from '@/lib/utils/yield';
import RecipeSocialSharing from './RecipeSocialSharing';
import ExpandableTipText from './ExpandableTipText';

// Memoized markdown components config for FAQ section
const faqMarkdownComponents = {
  a: ({ node, ...props }) => (
    <Link
      {...props}
      href={props.href || '#'}
      className="text-purple-600 dark:text-purple-400 underline hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
    />
  ),
};

export function RecipeTipsSection({ recipe, tips = [] }) {
  const defaultTips = [
    {
      title: 'Profi-Tipps',
      content: `Für beste Ergebnisse mit ${recipe.title}, achten Sie darauf, dass alle Zutaten Zimmertemperatur haben.`,
      icon: Lightbulb
    },
    {
      title: 'Zeitsparend',
      content: 'Bereiten Sie alle Zutaten vor, bevor Sie beginnen, um Zeit während des Kochens zu sparen.',
      icon: Clock
    },
    {
      title: 'Aufbewahrung',
      content: `${recipe.title} kann im Kühlschrank bis zu 3 Tage aufbewahrt oder 2 Monate eingefroren werden.`,
      icon: Heart
    }
  ];

  const displayTips = tips.length > 0 ? tips : defaultTips;

  return (
    <section className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 mb-12">
      <div className="px-2 lg:px-8 py-4 mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <Lightbulb className="w-6 h-6 mr-3 text-purple-600" />
          Tipps für {recipe.recipeName}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayTips.map((tip, index) => {
            const IconComponent = tip.icon || Lightbulb;
            const tipKey = tip.title || `tip-${index}`;
            
            return (
              <div
                key={tipKey}
                className="relative rounded-2xl bg-white border border-gray-200 shadow-sm p-6 dark:bg-gray-900 dark:border-gray-800"
              >
                {/* Circle BG + centered icon */}
                <div className="absolute top-[-8px] right-[-8px] w-12 h-12 rounded-full bg-purple-100/70 dark:bg-purple-900/25 flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-purple-700/80 dark:text-purple-200/80" />
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {tip.title}
                </h3>
                <ExpandableTipText content={tip.content} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Recipe FAQ Section
 */
export function RecipeFAQSection({ recipe, faqs = [] }) {
  const yieldLabel = formatYieldLabel(recipe.yield, recipe.servings);
  const defaultFAQs = [
    {
      question: `Wie lange dauert es, ${recipe.title} zuzubereiten?`,
      answer: `Es dauert etwa ${recipe.totalTimeMinutes} Minuten, ${recipe.title} zuzubereiten.${recipe.prepTimeMinutes ? ` Vorbereitung: ${recipe.prepTimeMinutes} Minuten.` : ''}${recipe.cookTimeMinutes ? ` Zubereitung: ${recipe.cookTimeMinutes} Minuten.` : ''}`
    },
    yieldLabel && {
      question: `Wie viele Portionen / Stück ergibt ${recipe.title}?`,
      answer: `Dieses Rezept ergibt ${yieldLabel}.`
    },
    {
      question: `Welchen Schwierigkeitsgrad hat ${recipe.title}?`,
      answer: `Dieses Rezept hat den Schwierigkeitsgrad ${recipe.difficulty || 'Mittel'}. ${getDifficultyDescription(recipe.difficulty)}`
    },
    {
      question: `Kann ich ${recipe.title} aufbewahren?`,
      answer: `${recipe.title} kann im Kühlschrank bis zu 3 Tage aufbewahrt oder 2 Monate eingefroren werden.`
    }
  ];

  const displayFAQs = faqs.length > 0 ? faqs : defaultFAQs;

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-12 border border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <BookOpen className="w-6 h-6 mr-3 text-purple-600" />
          Häufige Fragen zu {recipe.recipeName}
        </h2>
        <div className="space-y-4">
          {displayFAQs.map((faq) => {
            // Use question as stable key
            const faqKey = faq.question || `faq-${faq.question?.slice(0, 20)}`;
            return (
            <details key={faqKey} className="group">
              <summary className="flex items-center justify-between w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                <span className="text-purple-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-b-lg">
                <div className="text-gray-600 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown components={faqMarkdownComponents}>
                    {faq.answer}
                  </ReactMarkdown>
                </div>
              </div>
            </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Recipe card component for related recipes
 */
function RelatedRecipeCard({ recipe }) {
  const yieldLabel = formatYieldLabel(recipe.yield, recipe.servings);
  return (
    <Link
      href={`/${recipe.slug}`}
      className="group bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] border border-gray-100 dark:border-gray-700"
    >
      {recipe.image?.src && (
        <div className="relative h-24 sm:h-32 md:h-36 overflow-hidden">
          <img
            src={recipe.image.src}
            alt={recipe.image.alt || recipe.recipeName || recipe.title}
            width="300"
            height="225"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
            data-related-recipe="true"
          />
        </div>
      )}
      <div className="p-2 sm:p-3">
        <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white mb-1 sm:mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 leading-tight">
          {recipe.recipeName || recipe.title}
        </h3>
        <div className="space-y-1 sm:space-y-0">
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="truncate">{recipe.totalTimeMinutes} min</span>
            </div>
            {yieldLabel && (
              <div className="flex items-center">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="truncate">{yieldLabel}</span>
              </div>
            )}
          </div>
          {recipe.ratingAverage && (
            <div className="flex items-center justify-center sm:justify-start">
              <div className="flex items-center text-xs sm:text-sm text-yellow-600 dark:text-yellow-400">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 fill-current" />
                <span>{recipe.ratingAverage}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

/**
 * Related Recipes Section with SEO optimization - Optimized for mobile & desktop
 */
export function RelatedRecipesSection({ relatedRecipes, category, categoryUrl, currentRecipe }) {
  if (!relatedRecipes || relatedRecipes.length === 0) return null;

  const recipes = relatedRecipes.slice(0, 8);

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 sm:p-6 lg:p-8 mb-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
          <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-600" />
          Weitere {category} Rezepte, die Sie mögen könnten
        </h2>
        
        {/* Mobile: 2 columns, Desktop: 3 columns, Large: 4 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {recipes.map((recipe) => (
            <RelatedRecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>
        
        {/* Show more button */}
        {relatedRecipes.length > 8 && categoryUrl && (
          <div className="mt-4 sm:mt-6 text-center">
            <Link
              href={categoryUrl}
              className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm font-medium"
            >
              Alle {category} Rezepte ansehen
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Recipe Categories Navigation
 */
export function RecipeCategoriesSection({ categories, currentCategory }) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-12 border border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Weitere Kategorien entdecken
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className={`p-4 rounded-lg text-center transition-all duration-300 ${
                currentCategory === category.slug
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'bg-gray-50 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="font-medium text-sm">{category.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Recipe Social Sharing Section
 */
export function RecipeSocialSection({ recipe }) {
  return <RecipeSocialSharing recipe={recipe} />;
}

/**
 * Helper function for difficulty description
 */
function getDifficultyDescription(difficulty) {
  const descriptions = {
    'Lätt': 'Perfekt für Anfänger mit einfachen Techniken und wenigen Zutaten.',
    'Einfach': 'Perfekt für Anfänger mit einfachen Techniken und wenigen Zutaten.',
    'Medel': 'Erfordert etwas Erfahrung und grundlegende Kochkenntnisse.',
    'Mittel': 'Erfordert etwas Erfahrung und grundlegende Kochkenntnisse.',
    'Svår': 'Fortgeschrittenes Rezept, das Erfahrung und Präzision erfordert.',
    'Schwer': 'Fortgeschrittenes Rezept, das Erfahrung und Präzision erfordert.'
  };
  return descriptions[difficulty] || descriptions['Mittel'] || 'Mittlerer Schwierigkeitsgrad.';
}
