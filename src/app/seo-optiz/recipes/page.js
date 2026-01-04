'use client';

import { useState, useEffect, useMemo } from 'react';
import { PRIMARY_CATEGORIES } from '@/lib/categories';
import { getKeywordsForCategory } from '@/data/keywords';
import { 
  Loader2, 
  FolderOpen,
  CheckCircle2,
  XCircle,
  Search,
  FileText,
  AlertCircle,
  ChevronRight,
  LayoutDashboard,
  RefreshCw
} from 'lucide-react';

// Normalize text for comparison (lowercase, remove accents, etc.)
function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .trim();
}

// Check if a keyword matches a recipe name - EXACT MATCH ONLY
function keywordMatchesRecipe(keyword, recipeName) {
  if (!recipeName || !keyword) return false;
  
  // Trim whitespace
  const trimmedKeyword = keyword.trim();
  const trimmedRecipeName = recipeName.trim();
  
  if (!trimmedKeyword || !trimmedRecipeName) return false;
  
  const normalizedKeyword = normalizeText(trimmedKeyword);
  const normalizedRecipe = normalizeText(trimmedRecipeName);
  
  // Only exact match - no fuzzy matching
  return normalizedRecipe === normalizedKeyword;
}

export default function RecipeContentAdminPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastRefresh, setLastRefresh] = useState(null);

  const categories = Object.entries(PRIMARY_CATEGORIES).map(([key, cat]) => ({
    ...cat,
    key,
  }));

  // Get keywords for selected category
  const targetKeywords = useMemo(() => {
    if (!selectedCategory) return [];
    return getKeywordsForCategory(selectedCategory.key);
  }, [selectedCategory]);

  // Analyze keyword coverage
  const keywordAnalysis = useMemo(() => {
    if (!selectedCategory || recipes.length === 0) {
      return { covered: [], missing: [], allKeywords: [] };
    }

    const allKeywords = targetKeywords;
    const covered = [];
    const missing = [];

    allKeywords.forEach(keyword => {
      const isCovered = recipes.some(recipe => 
        keywordMatchesRecipe(keyword, recipe.recipeName)
      );
      
      if (isCovered) {
        covered.push(keyword);
      } else {
        missing.push(keyword);
      }
    });

    return { covered, missing, allKeywords };
  }, [selectedCategory, recipes, targetKeywords]);

  // Filter recipes by search query
  const filteredRecipes = useMemo(() => {
    if (!searchQuery) return recipes;
    const query = normalizeText(searchQuery);
    return recipes.filter(r => 
      normalizeText(r.recipeName).includes(query) ||
      normalizeText(r.title).includes(query)
    );
  }, [recipes, searchQuery]);

  // Check for duplicate recipe names
  const duplicateRecipes = useMemo(() => {
    const nameCounts = {};
    recipes.forEach(recipe => {
      const name = normalizeText(recipe.recipeName);
      if (name) {
        nameCounts[name] = (nameCounts[name] || 0) + 1;
      }
    });
    
    const duplicates = [];
    Object.entries(nameCounts).forEach(([name, count]) => {
      if (count > 1) {
        duplicates.push({
          name,
          count,
          recipes: recipes.filter(r => normalizeText(r.recipeName) === name),
        });
      }
    });
    
    return duplicates;
  }, [recipes]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      const host = window.location.host;
      if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
        window.location.href = '/';
        return;
      }
    }
  }, []);

  const loadRecipes = async (categoryKey, forceRefresh = false) => {
    if (!categoryKey) {
      setRecipes([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Add cache busting timestamp to force fresh data
      const timestamp = forceRefresh ? `&_t=${Date.now()}` : '';
      const response = await fetch(`/api/seo-optiz/recipes?category=${categoryKey}${timestamp}`, {
        cache: 'no-store', // Always fetch fresh data
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      setRecipes(data.recipes || []);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err.message);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (selectedCategory) {
      loadRecipes(selectedCategory.key, true);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
    loadRecipes(category.key);
  };

  const coveragePercentage = keywordAnalysis.allKeywords.length > 0
    ? Math.round((keywordAnalysis.covered.length / keywordAnalysis.allKeywords.length) * 100)
    : 0;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* LEFT SIDEBAR - Categories */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-lg text-slate-800">Recipe Content</h1>
          </div>
          <p className="text-xs text-slate-500">
            Manage and analyze recipe content by category
          </p>
        </div>

        {/* Category List */}
        <div className="flex-1 overflow-y-auto">
          {categories.map((category) => {
            const isSelected = selectedCategory?.key === category.key;
            return (
              <button
                key={category.key}
                onClick={() => handleCategorySelect(category)}
                className={`w-full text-left px-4 py-3 border-b border-slate-100 transition-colors flex items-center justify-between group
                  ${isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-50'}
                `}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-xl flex-shrink-0">{category.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                      {category.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {category.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${isSelected ? 'text-blue-500 rotate-90' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-xs text-center text-slate-400">
          {categories.length} categories
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/50">
        
        {!selectedCategory ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <FolderOpen className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-lg font-medium text-slate-600">Select a category</p>
            <p className="text-sm">Choose a category from the sidebar to view recipes and keyword analysis.</p>
          </div>
        ) : loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg border border-red-100">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-800 mb-2">Error</h2>
              <p className="text-slate-600 mb-6">{error}</p>
              <button
                onClick={() => loadRecipes(selectedCategory.key)}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              
              {/* Header */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <span>{selectedCategory.icon}</span>
                      {selectedCategory.name}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">{selectedCategory.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-3xl font-bold text-slate-800">{recipes.length}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide">Recipes</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Refresh recipes"
                      >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                      </button>
                      {lastRefresh && (
                        <span className="text-xs text-slate-400">
                          Updated {lastRefresh.toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Duplicate Warning */}
                {duplicateRecipes.length > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-semibold text-amber-800">
                        {duplicateRecipes.length} Duplicate Recipe Name{duplicateRecipes.length > 1 ? 's' : ''} Found
                      </span>
                    </div>
                    <div className="text-xs text-amber-700 space-y-1">
                      {duplicateRecipes.map((dup, idx) => (
                        <div key={idx}>
                          &quot;{dup.name}&quot; appears {dup.count} times
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Keyword Coverage Section */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Keyword Coverage</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Checking {recipes.length} recipes against {targetKeywords.length} keywords
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Coverage:</span>
                    <span className={`text-lg font-bold ${
                      coveragePercentage >= 80 ? 'text-emerald-600' :
                      coveragePercentage >= 50 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {coveragePercentage}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Covered Keywords */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-semibold text-slate-700">
                        Covered ({keywordAnalysis.covered.length})
                      </span>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {keywordAnalysis.covered.length > 0 ? (
                        keywordAnalysis.covered.map((keyword, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800"
                          >
                            {keyword}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-400 italic">No keywords covered yet</p>
                      )}
                    </div>
                  </div>

                  {/* Missing Keywords */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-semibold text-slate-700">
                        Missing ({keywordAnalysis.missing.length})
                      </span>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {keywordAnalysis.missing.length > 0 ? (
                        keywordAnalysis.missing.map((keyword, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800"
                          >
                            {keyword}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-400 italic">All keywords covered!</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recipes List */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">Recipes</h3>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search recipes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {filteredRecipes.length > 0 ? (
                    filteredRecipes.map((recipe, idx) => {
                      const isDuplicate = duplicateRecipes.some(dup => 
                        normalizeText(dup.name) === normalizeText(recipe.recipeName)
                      );
                      
                      return (
                        <div
                          key={idx}
                          className={`px-4 py-3 border rounded-lg flex items-center justify-between transition-colors ${
                            isDuplicate
                              ? 'bg-amber-50 border-amber-200'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <FileText className={`w-4 h-4 flex-shrink-0 ${
                              isDuplicate ? 'text-amber-600' : 'text-slate-400'
                            }`} />
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm font-medium truncate ${
                                isDuplicate ? 'text-amber-800' : 'text-slate-700'
                              }`}>
                                {recipe.recipeName || recipe.title || 'Untitled Recipe'}
                              </p>
                              {recipe.title && recipe.title !== recipe.recipeName && (
                                <p className="text-xs text-slate-400 truncate mt-0.5">
                                  {recipe.title}
                                </p>
                              )}
                            </div>
                          </div>
                          {isDuplicate && (
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded flex-shrink-0">
                              Duplicate
                            </span>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        {searchQuery ? 'No recipes found matching your search.' : 'No recipes in this category.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
            <div className="h-10"></div> {/* Bottom spacer */}
          </div>
        )}
      </main>
    </div>
  );
}

