'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import BlogCard from '@/components/blog/BlogCard';
import SmartSearchBar from '@/components/ui/SmartSearchBar';
import Pagination from '@/components/ui/Pagination';
import Tag from '@/components/ui/Tag';
import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { filterRecipes, sortRecipes, getUniqueFilterValues } from '@/lib/utils/search';
import { smartSearch } from '@/lib/utils/smartSearch';

export default function BlogListingClient({ initialBlogs }) {
  const searchParams = useSearchParams();
  // De-duplicate any incoming blogs by slug to prevent React key collisions
  const [blogs] = useState(() => {
    const seen = new Set();
    return (initialBlogs || []).filter(b => {
      if (!b?.slug) return false;
      if (seen.has(b.slug)) return false;
      seen.add(b.slug);
      return true;
    });
  });
  const [filteredBlogs, setFilteredBlogs] = useState(initialBlogs);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 12;

  // Handle URL search params
  useEffect(() => {
    const q = searchParams.get('q');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');

    if (q) setSearchQuery(q);
    if (category) setFilters(prev => ({ ...prev, category }));
    if (tag) setFilters(prev => ({ ...prev, tags: [tag] }));
  }, [searchParams]);

  // Apply filters and search
  useEffect(() => {
    let result = [...blogs];

    // Apply smart search
    if (searchQuery) {
      const searchResults = smartSearch(result, searchQuery);
      result = searchResults.map(b => {
        // Remove relevanceScore before passing to filters
        const { relevanceScore, ...blog } = b;
        return blog;
      });
    }

    // Apply filters
    result = filterRecipes(result, filters);

    // Apply sorting
    result = sortRecipes(result, sortBy);

    setFilteredBlogs(result);
    setCurrentPage(1);
  }, [blogs, filters, searchQuery, sortBy]);

  const categories = getUniqueFilterValues(blogs, 'category');
  const tags = getUniqueFilterValues(blogs, 'tags');

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const paginatedBlogs = filteredBlogs.slice(startIndex, startIndex + blogsPerPage);

  // Get popular tags for suggestions
  const allTags = getUniqueFilterValues(blogs, 'tags').slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F3] to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-16 lg:px-20 xl:px-24 py-20 md:py-24">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-6">
            <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 
            className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white font-playfair"
          >
            Blogg
          </h1>
          <p 
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-inter"
          >
            Utforska våra matguider, tips och inspiration för bättre matlagning
          </p>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 lg:p-8 mb-12 border border-gray-100 dark:border-gray-700 rounded-xl">
          <div className="mb-4">
            <SmartSearchBar
              recipes={blogs}
              onSearch={setSearchQuery}
              placeholder="Sök artiklar, ämnen eller taggar..."
              className="w-full"
            />
          </div>

          {/* Active filters */}
          {(searchQuery || Object.keys(filters).length > 0) && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Aktiva filter:</span>
                {searchQuery && (
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                    Sökning: &ldquo;{searchQuery}&rdquo;
                  </span>
                )}
                {filters.category && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                    {filters.category}
                  </span>
                )}
                <button
                  onClick={() => {
                    setFilters({});
                    setSearchQuery('');
                  }}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                >
                  Rensa alla
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-8">
          <p 
            className="text-gray-600 dark:text-gray-400 font-medium"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Visar <span className="font-bold text-purple-600">{filteredBlogs.length}</span> artiklar
          </p>
        </div>

        {/* Blog Grid */}
        {paginatedBlogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
              {paginatedBlogs.map((blog, index) => (
                <BlogCard 
                  key={`${blog.slug}-${index}`} 
                  blog={blog} 
                  index={index} 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🔍</div>
            <h3 
              className="text-2xl font-bold mb-4 text-gray-900 dark:text-white"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Inga artiklar hittades
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Prova att justera dina filter eller sök efter något annat
            </p>
            <button
              onClick={() => {
                setFilters({});
                setSearchQuery('');
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 font-semibold transition-colors"
            >
              Återställ alla filter
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 pt-16 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
            >
              Hittade du inte vad du sökte?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Vi lägger till nya artiklar regelbundet. Prenumerera på vårt nyhetsbrev så missar du inget!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors shadow-lg"
              >
                Till startsidan
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/recept"
                className="inline-flex items-center px-8 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Utforska recept
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}













