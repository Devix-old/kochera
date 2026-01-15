'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  X, 
  Clock, 
  Star, 
  Utensils, 
  TrendingUp,
  History,
  Sparkles,
  ArrowRight,
  ChefHat
} from 'lucide-react';
import { smartSearch, generateSearchSuggestions, getPopularSearchTerms } from '@/lib/utils/smartSearch';
import { motion, AnimatePresence } from 'framer-motion';

const EMPTY_RECIPES = [];

export default function SmartSearchBar({ 
  recipes, 
  onSearch, 
  placeholder = "Sök recept, ingredienser eller taggar...",
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [popularTerms, setPopularTerms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const router = useRouter();
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const searchableRecipes = Array.isArray(recipes) ? recipes : EMPTY_RECIPES;
  const onSearchRef = useRef(onSearch);

  // Load search history from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const history = localStorage.getItem('recipeSearchHistory');
      if (history) {
        try {
          setSearchHistory(JSON.parse(history).slice(0, 5));
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }, []);

  // Load popular terms
  useEffect(() => {
    if (searchableRecipes.length > 0) {
      setPopularTerms(getPopularSearchTerms(searchableRecipes, 8));
    }
  }, [searchableRecipes]);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Keyboard shortcuts (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyboardShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
        setTimeout(() => {
          inputRef.current?.focus();
          if (window.innerWidth < 768) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
      }
    };

    document.addEventListener('keydown', handleKeyboardShortcut);
    return () => document.removeEventListener('keydown', handleKeyboardShortcut);
  }, []);

  // Close search when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowResults(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setShowResults(false);
        setQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when search is open (mobile)
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Smart search with debounce
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      setIsLoading(false);
      
      // Show suggestions for short queries
      if (query.length > 0) {
        setSuggestions(generateSearchSuggestions(searchableRecipes, query, 6));
      } else {
        setSuggestions([]);
      }
      
      if (onSearchRef.current) {
        onSearchRef.current('');
      }
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      const searchResults = smartSearch(searchableRecipes, query);
      setResults(searchResults.slice(0, 10)); // Top 10 results
      setShowResults(true);
      setIsLoading(false);
      
      // Generate suggestions
      setSuggestions(generateSearchSuggestions(searchableRecipes, query, 6));
      
      // Call onSearch callback if provided
      if (onSearchRef.current) {
        onSearchRef.current(query);
      }
    }, 200); // Reduced debounce for better responsiveness

    return () => clearTimeout(timeoutId);
  }, [query, searchableRecipes]);

  const saveToHistory = useCallback((searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') return;
    
    const term = searchTerm.trim();
    setSearchHistory(prev => {
      const newHistory = [term, ...prev.filter(h => h !== term)].slice(0, 5);
      if (typeof window !== 'undefined') {
        localStorage.setItem('recipeSearchHistory', JSON.stringify(newHistory));
      }
      return newHistory;
    });
  }, []);

  const handleSearch = (e, searchTerm = null) => {
    e?.preventDefault();
    const term = searchTerm || query.trim();
    
    if (term) {
      saveToHistory(term);
      router.push(`/rezepte?q=${encodeURIComponent(term)}`);
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

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(null, suggestion);
  };

  const handleHistoryClick = (term) => {
    setQuery(term);
    handleSearch(null, term);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Lätt': return 'text-green-600 dark:text-green-400';
      case 'Medel': return 'text-yellow-600 dark:text-yellow-400';
      case 'Svår': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const clearHistory = () => {
    setSearchHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recipeSearchHistory');
    }
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Search Button - Mobile Optimized */}
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => {
            inputRef.current?.focus();
            // Scroll to top on mobile
            if (window.innerWidth < 768) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }, 100);
        }}
        className="w-full flex items-center gap-3 px-4 py-3 md:py-3.5 lg:py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-left text-gray-500 dark:text-gray-400 hover:border-purple-300 dark:hover:border-purple-600 transition-all"
        aria-label="Sök recept"
      >
        <Search className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-gray-400 dark:text-gray-500" />
        <span className="flex-1 text-sm md:text-base lg:text-lg font-medium text-gray-400 dark:text-gray-500">
          Sök recept, ingredienser eller taggar...
        </span>
        <kbd className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Full-Screen Search Overlay - Mobile Optimized */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-start justify-center pt-0 md:pt-20"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsOpen(false);
                setShowResults(false);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-t-3xl md:rounded-2xl shadow-2xl w-full h-full md:h-auto md:max-h-[85vh] md:max-w-3xl md:mx-4 flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input - Mobile Optimized */}
              <form onSubmit={handleSearch} className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Search className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 text-lg md:text-xl bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    autoFocus
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('');
                        setShowResults(false);
                        inputRef.current?.focus();
                      }}
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      aria-label="Rensa sökning"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </form>

              {/* Search Content - Scrollable */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {/* Loading State */}
                {isLoading && (
                  <div className="p-12 text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full mx-auto mb-4"
                    />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Söker...</p>
                  </div>
                )}

                {/* Search Results */}
                {!isLoading && showResults && results.length > 0 && (
                  <div className="p-2 md:p-4">
                    <div className="flex items-center gap-2 mb-3 px-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {results.length} resultat
                      </span>
                    </div>
                    {results.map((recipe, index) => (
                      <motion.button
                        key={recipe.slug}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => handleResultClick(recipe)}
                        className="w-full text-left p-3 md:p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors group mb-2"
                      >
                        <div className="flex items-start gap-3 md:gap-4">
                          <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                            {recipe.image?.src ? (
                              <img
                                src={recipe.image.src}
                                alt={recipe.recipeName || recipe.title}
                                width="80"
                                height="80"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                loading="lazy"
                                decoding="async"
                              />
                            ) : (
                              <Utensils className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base md:text-lg text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {recipe.recipeName || recipe.title}
                            </h3>
                            {recipe.excerpt && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                                {recipe.excerpt}
                              </p>
                            )}
                            <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                              {recipe.difficulty && (
                                <span className={`text-xs md:text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                                  {recipe.difficulty}
                                </span>
                              )}
                              {recipe.totalTimeMinutes && (
                                <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {formatTime(recipe.totalTimeMinutes)}
                                </span>
                              )}
                              {recipe.ratingAverage && (
                                <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                  {recipe.ratingAverage}
                                </span>
                              )}
                              {recipe.category && (
                                <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                                  {recipe.category}
                                </span>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {!isLoading && showResults && query.length >= 2 && results.length === 0 && (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Inga recept hittades
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                      Versuchen Sie nach Zutaten, Tags oder Kategorien zu suchen
                    </p>
                    {suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center">
                        {suggestions.slice(0, 4).map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Suggestions & History - When no query or short query */}
                {!isLoading && !showResults && (
                  <div className="p-4 md:p-6 space-y-6">
                    {/* Search History */}
                    {searchHistory.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <History className="w-4 h-4 text-gray-500" />
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                              Senaste sökningar
                            </h3>
                          </div>
                          <button
                            onClick={clearHistory}
                            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            Rensa
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {searchHistory.map((term) => (
                            <button
                              key={term}
                              onClick={() => handleHistoryClick(term)}
                              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                            >
                              <History className="w-3 h-3" />
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggestions for current query */}
                    {query.length > 0 && suggestions.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          Förslag
                        </h3>
                        <div className="space-y-2">
                          {suggestions.map((suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-3 group"
                            >
                              <Search className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                              <span className="flex-1 text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                                {suggestion}
                              </span>
                              <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular Searches */}
                    {query.length === 0 && popularTerms.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Populära sökningar
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {popularTerms.map((term) => (
                            <button
                              key={term}
                              onClick={() => handleSuggestionClick(term)}
                              className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-700 dark:text-purple-300 rounded-xl text-sm font-medium hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all flex items-center gap-2 shadow-sm"
                            >
                              <ChefHat className="w-4 h-4" />
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

