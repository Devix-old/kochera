'use client';

import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

// Memoized markdown components config for FAQ section (same as recipe page)
const faqMarkdownComponents = {
  a: ({ node, ...props }) => (
    <Link
      {...props}
      href={props.href || '#'}
      className="text-purple-600 dark:text-purple-400 underline hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
    />
  ),
};

/**
 * FAQ section for pillar pages
 * Same design as recipe page FAQ section
 */
export default function PillarFAQ({ faqs = [], title = "Frequently Asked Questions", pillarTitle = "" }) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-12 border border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <BookOpen className="w-6 h-6 mr-3 text-purple-600" />
          {pillarTitle ? `${title} om ${pillarTitle}` : title}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            // Use question as stable key
            const faqKey = faq.question || `faq-${index}`;
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
