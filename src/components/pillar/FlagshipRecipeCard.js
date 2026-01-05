import Link from 'next/link';
import { ArrowRight, ChefHat } from 'lucide-react';
import { getContentBySlug } from '@/lib/mdx';

/**
 * Flagship Recipe Card
 * Shows the main/basic recipe if isFlagShip: true
 */
export default async function FlagshipRecipeCard({ flagshipSlug }) {
  if (!flagshipSlug) {
    return null;
  }

  try {
    const recipe = await getContentBySlug('recipes', flagshipSlug);
    
    if (!recipe) {
      return null;
    }

    const { frontmatter, slug } = recipe;
    const displayName = frontmatter.recipeName || frontmatter.title;

    return (
      <section className="py-12 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-10 shadow-xl border-2 border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-6">
              {frontmatter.image?.src && (
                <div className="hidden md:block flex-shrink-0">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden">
                    <img
                      src={frontmatter.image.src}
                      alt={frontmatter.image.alt || displayName}
                      width="160"
                      height="160"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm font-semibold text-purple-700 dark:text-purple-300 mb-4">
                  <ChefHat className="w-4 h-4" />
                  Master Recipe
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {displayName}
                </h3>
                
                {frontmatter.excerpt && (
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {frontmatter.excerpt}
                  </p>
                )}

                <Link
                  href={`/${slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Looking for the classic base recipe? Start here
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error loading flagship recipe:', error);
    return null;
  }
}

