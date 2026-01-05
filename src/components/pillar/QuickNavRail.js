'use client';

import { useEffect, useRef } from 'react';

/**
 * Quick Navigation Rail - Dynamic section navigation
 * Wiki-style links that auto-scroll to sections
 * Horizontal scrollable carousel (no arrows)
 */
export default function QuickNavRail({ sections = [] }) {
  const containerRef = useRef(null);

  // Extract section titles from content structure
  const navItems = sections.map((section, index) => {
    if (typeof section === 'object' && section.title) {
      return {
        id: `section-${index}`,
        title: section.title,
        label: section.label || section.title
      };
    }
    return null;
  }).filter(Boolean);

  // Auto-scroll to section on click
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Offset for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (navItems.length === 0) {
    return null;
  }

  return (
    <section className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div 
          ref={containerRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitScrollbar: { display: 'none' }
          }}
        >
          {navItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="flex-shrink-0 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

