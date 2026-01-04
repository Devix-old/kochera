'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Clock, Star, Utensils } from 'lucide-react';
import { searchContent } from '@/lib/utils/search';

const EMPTY_RECIPES = [];

export default function HomePageSearchBar({ 
  recipes, 
  onSearch, 
  placeholder = "Was kochst du heute?" 
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
      router.push(`/rezepte?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
      setShowResults(false);
    }
  };

  const handleResultClick = (recipe) => {
    router.push(`/${recipe.slug}`);
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
    <div className="relative w-full" ref={searchRef}>
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full h-12 pl-12 pr-12 rounded-full shadow-sm border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
        {isOpen && (
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setQuery('');
              setShowResults(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </form>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col">
          {/* Search Results */}
          {showResults && (
            <div className="max-h-[500px] overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Suchen...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="p-2">
                  {results.map((recipe) => (
                    <button
                      key={recipe.slug}
                      onClick={() => handleResultClick(recipe)}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
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
                            <Utensils className="w-6 h-6 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {recipe.recipeName || recipe.title}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {recipe.excerpt}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className={`text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                              {recipe.difficulty}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTime(recipe.totalTimeMinutes)}
                            </span>
                            {recipe.ratingAverage && (
                              <span className="text-xs text-gray-500 flex items-center">
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
                  <p className="text-gray-600">
                    Keine Rezepte gefunden für &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Versuchen Sie es mit anderen Suchbegriffen
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {/* Search Suggestions */}
          {!showResults && query.length < 2 && (
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Beliebte Suchen
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Pasta', 'Vegetarisch', 'Schnell', 'Dessert', 'Frühstück', 'Hähnchen', 'Fisch', 'Salat'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

