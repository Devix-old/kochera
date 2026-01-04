import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Clock, Users, Star, ChefHat, Lightbulb, Heart, Share2, BookOpen, ArrowRight } from 'lucide-react';
import RecipeSocialSharing from './RecipeSocialSharing';
import ExpandableTipText from './ExpandableTipText';
import ConditionalInArticle from '@/components/ads/ConditionalInArticle';

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
      title: 'Proffstips',
      content: `För bästa resultat med ${recipe.title}, se till att alla ingredienser är i rumstemperatur.`,
      icon: Lightbulb
    },
    {
      title: 'Tidssparande',
      content: 'Förbered alla ingredienser innan du börjar för att spara tid under tillagningen.',
      icon: Clock
    },
    {
      title: 'Lagring',
      content: `${recipe.title} kan förvaras i kylskåp i upp till 3 dagar eller frysas i 2 månader.`,
      icon: Heart
    }
  ];

  const displayTips = tips.length > 0 ? tips : defaultTips;

  // Create mixed list: [tip, tip, ad, tip] for mobile, [tip, tip, tip, ad] for desktop
  const createMixedList = () => {
    const items = [];
    
    displayTips.forEach((tip, index) => {
      // Add tip
      items.push({ type: 'tip', data: tip, index });
      
      // Insert ad after 2nd tip (index 1) for mobile
      // This will create: [tip0, tip1, ad-mobile, tip2, ...]
      if (index === 1) {
        items.push({ type: 'ad-mobile', key: 'ad-tips-mobile' });
      }
      
      // Insert ad after 3rd tip (index 2) for desktop
      // This will create: [tip0, tip1, tip2, ad-desktop, ...]
      if (index === 2) {
        items.push({ type: 'ad-desktop', key: 'ad-tips-desktop' });
      }
    });
    
    return items;
  };

  const mixedItems = createMixedList();

  return (
    <section className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 mb-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <Lightbulb className="w-6 h-6 mr-3 text-purple-600" />
          Tips för {recipe.recipeName}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mixedItems.map((item, index) => {
            if (item.type === 'tip') {
              const tip = item.data;
              const IconComponent = tip.icon || Lightbulb;
              const tipKey = tip.title || `tip-${item.index}`;
              
              return (
                <div 
                  key={tipKey}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center mb-4">
                    <IconComponent className="w-5 h-5 text-purple-600 mr-3" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">{tip.title}</h3>
                  </div>
                  <ExpandableTipText content={tip.content} />
                </div>
              );
            }
            
            if (item.type === 'ad-mobile') {
              return (
                <div key={item.key} className="col-span-1 md:hidden">
                  <ConditionalInArticle showOnMobile={true} />
                </div>
              );
            }
            
            if (item.type === 'ad-desktop') {
              return (
                <div key={item.key} className="hidden md:block col-span-3">
                  <ConditionalInArticle showOnDesktop={true} />
                </div>
              );
            }
            
            return null;
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
  const defaultFAQs = [
    {
      question: `Hur lång tid tar det att laga ${recipe.title}?`,
      answer: `Det tar cirka ${recipe.totalTimeMinutes} minuter att laga ${recipe.title}.${recipe.prepTimeMinutes ? ` Förberedelse: ${recipe.prepTimeMinutes} minuter.` : ''}${recipe.cookTimeMinutes ? ` Tillagning: ${recipe.cookTimeMinutes} minuter.` : ''}`
    },
    {
      question: `Hur många portioner ger ${recipe.title}?`,
      answer: `Detta recept ger ${recipe.servings} portioner.`
    },
    {
      question: `Vilken svårighetsgrad har ${recipe.title}?`,
      answer: `Detta recept har svårighetsgrad ${recipe.difficulty || 'medel'}. ${getDifficultyDescription(recipe.difficulty)}`
    },
    {
      question: `Kan jag förvara ${recipe.title}?`,
      answer: `${recipe.title} kan förvaras i kylskåp i upp till 3 dagar eller frysas i 2 månader.`
    }
  ];

  const displayFAQs = faqs.length > 0 ? faqs : defaultFAQs;

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-12 border border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <BookOpen className="w-6 h-6 mr-3 text-purple-600" />
          Vanliga frågor om {recipe.recipeName}
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
  return (
    <Link
      href={`/recept/${recipe.slug}`}
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
            <div className="flex items-center">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="truncate">{recipe.servings}</span>
            </div>
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
          Fler {category} recept du kanske gillar
        </h2>
        
        {/* Mobile: 2 columns, Desktop: 3 columns, Large: 4 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {/* Recipe 0 */}
          {recipes[0] && <RelatedRecipeCard key={recipes[0].slug} recipe={recipes[0]} />}
          
          {/* Recipe 1 */}
          {recipes[1] && <RelatedRecipeCard key={recipes[1].slug} recipe={recipes[1]} />}
          
          {/* First InArticle ad: after 2 recipes on mobile */}
          <div key="ad-related-1-mobile" className="col-span-2 md:hidden">
            <ConditionalInArticle showOnMobile={true} />
          </div>
          
          {/* Recipe 2 */}
          {recipes[2] && <RelatedRecipeCard key={recipes[2].slug} recipe={recipes[2]} />}
          
          {/* First InArticle ad: after 3 recipes on desktop (hidden on mobile) */}
          <div key="ad-related-1-desktop" className="hidden md:block lg:hidden col-span-3">
            <ConditionalInArticle showOnDesktop={true} />
          </div>
          
          {/* Recipe 3 */}
          {recipes[3] && <RelatedRecipeCard key={recipes[3].slug} recipe={recipes[3]} />}
          
          {/* First InArticle ad: after 4 recipes on large */}
          <div key="ad-related-1-large" className="hidden lg:block col-span-4">
            <ConditionalInArticle showOnDesktop={true} />
          </div>
          
          {/* Second InArticle ad: after 4 recipes on mobile */}
          <div key="ad-related-2-mobile" className="col-span-2 md:hidden">
            <ConditionalInArticle showOnMobile={true} />
          </div>
          
          {/* Recipe 4 */}
          {recipes[4] && <RelatedRecipeCard key={recipes[4].slug} recipe={recipes[4]} />}
          
          {/* Recipe 5 */}
          {recipes[5] && <RelatedRecipeCard key={recipes[5].slug} recipe={recipes[5]} />}
          
          {/* Second InArticle ad: after 6 recipes on desktop/large */}
          <div key="ad-related-2-desktop" className="hidden md:block col-span-3 lg:col-span-4">
            <ConditionalInArticle showOnDesktop={true} />
          </div>
          
          {/* Recipe 6 */}
          {recipes[6] && <RelatedRecipeCard key={recipes[6].slug} recipe={recipes[6]} />}
          
          {/* Recipe 7 */}
          {recipes[7] && <RelatedRecipeCard key={recipes[7].slug} recipe={recipes[7]} />}
        </div>
        
        {/* Show more button */}
        {relatedRecipes.length > 8 && categoryUrl && (
          <div className="mt-4 sm:mt-6 text-center">
            <Link
              href={categoryUrl}
              className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm font-medium"
            >
              Se alla {category} recept
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
          Utforska fler kategorier
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/kategorier/${category.slug}`}
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
    'Lätt': 'Perfekt för nybörjare med enkla tekniker och få ingredienser.',
    'Medel': 'Kräver lite erfarenhet och några grundläggande matlagningsfärdigheter.',
    'Svår': 'Avancerat recept som kräver erfarenhet och precision.'
  };
  return descriptions[difficulty] || descriptions['Medel'];
}
