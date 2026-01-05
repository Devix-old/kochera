'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, ChefHat } from 'lucide-react';

/**
 * Call-to-action section for pillar pages
 * Encourages user engagement and navigation
 */
export default function PillarCTASection({ 
  title = "Ready to Get Started?",
  description = "Explore our recipes and guides to become a better cook.",
  primaryAction = { text: "Browse Recipes", href: "/rezepte" },
  secondaryAction = { text: "View All Guides", href: "/guides" },
  className = ""
}) {
  return (
    <section className={`py-16 bg-gradient-to-br from-purple-600 to-blue-600 dark:from-purple-800 dark:to-blue-800 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title}
        </h2>
        
        {description && (
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryAction && primaryAction.href && (
            <Link
              href={primaryAction.href}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              {primaryAction.text}
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
          
          {secondaryAction && secondaryAction.href && (
            <Link
              href={secondaryAction.href}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white border-2 border-white/30 rounded-lg font-semibold hover:bg-white/20 transition-colors"
            >
              {secondaryAction.text}
              <ChefHat className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
