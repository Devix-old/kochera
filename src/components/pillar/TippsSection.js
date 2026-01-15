'use client';

import { Lightbulb, Clock, FlaskConical, Utensils, Heart, CheckCircle } from 'lucide-react';
import ExpandableTipText from '@/components/recipe/ExpandableTipText';

/**
 * Tipps Section - Matching Recipe Page Design
 * Displays tips in the same style as RecipeTipsSection
 */
export default function TippsSection({ pillar, tips = [] }) {
  // Convert masterClassGuide sections to tips format
  const convertSectionsToTips = (sections = []) => {
    if (!sections || sections.length === 0) return [];

    return sections.map((section) => {
      let icon = Lightbulb;
      if (section.type === 'science') {
        icon = FlaskConical;
      } else if (section.type === 'equipment') {
        icon = Utensils;
      } else if (section.type === 'tips') {
        icon = Lightbulb;
      }

      // Extract text from MDX content (first paragraph)
      let content = '';
      if (typeof section.content === 'string') {
        // Remove markdown headers and get first paragraph
        content = section.content
          .replace(/^#+\s+/gm, '')
          .split('\n\n')
          .filter(p => p.trim().length > 0)
          .slice(0, 2)
          .join(' ')
          .trim();
      }

      return {
        title: section.label || section.title,
        content: content || section.title,
        icon: icon
      };
    });
  };

  const displayTips = tips.length > 0 ? tips : convertSectionsToTips(pillar?.tipps?.sections || []);

  if (displayTips.length === 0) {
    return null;
  }

  return (
    <section
      id="section-0"
      className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 mb-12"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <Lightbulb className="w-6 h-6 mr-3 text-purple-600" />
          Tips för Perfekt {pillar?.title || 'Kochen'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayTips.map((tip, index) => {
            const IconComponent = tip.icon || CheckCircle;
            const tipKey = tip.title || `tip-${index}`;
            
            return (
              <div
                key={tipKey}
                id={`section-${index}`}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 scroll-mt-24"
              >
                <div className="flex items-center mb-4">
                  <IconComponent className="w-6 h-6 text-purple-600 mr-3" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {tip.title}
                  </h3>
                </div>

                <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {tip.content}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

