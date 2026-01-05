import { MDXRemote } from 'next-mdx-remote/rsc';
import { BookOpen, Lightbulb, FlaskConical, Utensils } from 'lucide-react';

/**
 * Master Class Guide - Authority Content Section
 * Text-heavy section with The Science, Equipment, Pro Tips
 */
export default function MasterClassGuide({ content, sections = [] }) {
  // Prioritize sections over content - if sections exist, use them
  // If sections are provided, render structured sections
  if (sections && sections.length > 0) {
    return (
      <section id="section-0" className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Master Class Guide
          </h2>
          
          {sections.map((section, index) => {
            const sectionId = `section-${index}`;
            let icon = BookOpen;
            let bgColor = 'bg-blue-100 dark:bg-blue-900/30';
            let textColor = 'text-blue-600 dark:text-blue-400';

            // Determine icon and colors based on section type
            if (section.type === 'science') {
              icon = FlaskConical;
              bgColor = 'bg-purple-100 dark:bg-purple-900/30';
              textColor = 'text-purple-600 dark:text-purple-400';
            } else if (section.type === 'equipment') {
              icon = Utensils;
              bgColor = 'bg-green-100 dark:bg-green-900/30';
              textColor = 'text-green-600 dark:text-green-400';
            } else if (section.type === 'tips') {
              icon = Lightbulb;
              bgColor = 'bg-yellow-100 dark:bg-yellow-900/30';
              textColor = 'text-yellow-600 dark:text-yellow-400';
            }

            const IconComponent = icon;

            return (
              <div key={sectionId} id={sectionId} className="mb-12 last:mb-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`${bgColor} p-3 rounded-lg`}>
                    <IconComponent className={`w-6 h-6 ${textColor}`} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {section.title}
                  </h3>
                </div>
                
                {section.content && (
                  <div className="prose prose-lg dark:prose-invert max-w-none ml-0 md:ml-14">
                    {typeof section.content === 'string' ? (
                      <MDXRemote source={section.content} />
                    ) : (
                      <div>{section.content}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // Fallback: If content is provided as MDX (but no sections), render it directly
  if (content && typeof content === 'string' && content.trim()) {
    return (
      <section id="section-0" className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MDXRemote source={content} />
          </div>
        </div>
      </section>
    );
  }

  return null;
}
