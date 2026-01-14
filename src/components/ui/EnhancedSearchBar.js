'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Clock, Star, Utensils } from 'lucide-react';
import { searchContent } from '@/lib/utils/search';

const EMPTY_RECIPES = [];

export default function EnhancedSearchBar({ 
  recipes, 
  onSearch, 
  placeholder = "Rezepte, Zutaten oder Tags suchen..." 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const searchableRecipes = Array.isArray(recipes) ? recipes : EMPTY_RECIPES;
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowResults(false);
        setQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search functionality
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      setIsLoading(false);
      if (onSearchRef.current) {
        onSearchRef.current('');
      }
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      const searchResults = searchContent(searchableRecipes, query);
      setResults(searchResults.slice(0, 8)); // Limit to 8 results
      setShowResults(true);
      setIsLoading(false);
      
      // Call onSearch callback if provided
      if (onSearchRef.current) {
        onSearchRef.current(query);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchableRecipes]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/recept?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
      setShowResults(false);
    }
  };

  const handleResultClick = (recipe) => {
    router.push(`/recept/${recipe.slug}`);
    setIsOpen(false);
    setQuery('');
    setShowResults(false);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Lätt': return 'text-green-600';
      case 'Medel': return 'text-yellow-600';
      case 'Svår': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Search Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 text-lg bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                    setShowResults(false);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Search Results */}
            {showResults && (
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Suche...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="p-2">
                    {results.map((recipe) => (
                      <button
                        key={recipe.slug}
                        onClick={() => handleResultClick(recipe)}
                        className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                            {recipe.image?.src ? (
                              <img
                                src={recipe.image.src}
                                alt={recipe.recipeName || recipe.title}
                                width="48"
                                height="48"
                                className="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                              />
                            ) : (
                              <Utensils className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 dark:text-white truncate">
                              {recipe.recipeName || recipe.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {recipe.excerpt}
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className={`text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                                {recipe.difficulty}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTime(recipe.totalTimeMinutes)}
                              </span>
                              {recipe.ratingAverage && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                  <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
                                  {recipe.ratingAverage}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : query.length >= 2 ? (
                  <div className="p-8 text-center">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Inga recept hittades för &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      Prova att söka på ingredienser eller taggar
                    </p>
                  </div>
                ) : null}
              </div>
            )}

            {/* Search Suggestions */}
            {!showResults && query.length < 2 && (
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Beliebte Suchen
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Pasta', 'Vegetarisch', 'Schnell', 'Dessert', 'Frühstück', 'Fleisch', 'Fisch', 'Salat'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setQuery(suggestion)}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
