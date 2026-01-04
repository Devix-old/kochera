'use client';

import { useState } from 'react';
import { X, Filter, Search, Clock, Utensils, Heart, Users } from 'lucide-react';
import { 
  getAllCategories, 
  getAllMealTypes, 
  getAllCookingMethods,
  getAllDietaryTags,
  getAllLifestyleTags,
  getDifficultyLevels,
  getTimeCategories
} from '@/lib/categories';

export default function EnhancedRecipeFilter({ filters, onFilterChange, categories, tags }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('kategorier');

  const allCategories = getAllCategories();
  const allMealTypes = getAllMealTypes();
  const allCookingMethods = getAllCookingMethods();
  const allDietaryTags = getAllDietaryTags();
  const allLifestyleTags = getAllLifestyleTags();
  const difficultyLevels = getDifficultyLevels();
  const timeCategories = getTimeCategories();

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters };
    
    if (filterType === 'category' || filterType === 'subcategory' || 
        filterType === 'mealType' || filterType === 'cookingMethod' || 
        filterType === 'difficulty' || filterType === 'timeCategory') {
          
      newFilters[filterType] = value === 'alla' ? null : value;
    } else if (filterType === 'dietaryTags' || filterType === 'lifestyleTags') {
      const currentTags = newFilters[filterType] || [];
      const newTags = currentTags.includes(value)
        ? currentTags.filter(tag => tag !== value)
        : [...currentTags, value];
      newFilters[filterType] = newTags.length > 0 ? newTags : null;
    }
    
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange({});
    setIsOpen(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    Object.values(filters).forEach(value => {
      if (value && value !== 'alla') {
        if (Array.isArray(value)) {
          count += value.length;
        } else {
          count += 1;
        }
      }
    });
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const tabs = [
    { id: 'kategorier', label: 'Kategorier', icon: Utensils },
    { id: 'tid', label: 'Tid & Svårighet', icon: Clock },
    { id: 'kost', label: 'Kost & Livsstil', icon: Heart },
    { id: 'metod', label: 'Tillagningsmetod', icon: Search }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Filter Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filtrera recept
            </h3>
            {activeFiltersCount > 0 && (
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Rensa alla
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="p-4">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Filter Content */}
          <div className="space-y-6">
            {/* Kategorier Tab */}
            {activeTab === 'kategorier' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Huvudkategorier
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {allCategories.map(category => (
                      <button
                        key={category.slug}
                        onClick={() => handleFilterChange('category', category.slug)}
                        className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors ${
                          filters.category === category.slug
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span className="truncate">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Måltidstyp
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {allMealTypes.map(mealType => (
                      <button
                        key={mealType.key}
                        onClick={() => handleFilterChange('mealType', mealType.key)}
                        className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors ${
                          filters.mealType === mealType.key
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        <span className="text-lg">{mealType.icon}</span>
                        <span>{mealType.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}


            {/* Tid & Svårighet Tab */}
            {activeTab === 'tid' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Tid
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {timeCategories.map(timeCategory => (
                      <button
                        key={timeCategory.key}
                        onClick={() => handleFilterChange('timeCategory', timeCategory.key)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-lg text-sm font-medium transition-colors ${
                          filters.timeCategory === timeCategory.key
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        <span className="text-lg">⏱️</span>
                        <span className="text-center">{timeCategory.name}</span>
                        <span className="text-xs text-gray-500">{timeCategory.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Svårighetsgrad
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {difficultyLevels.map(difficulty => (
                      <button
                        key={difficulty.key}
                        onClick={() => handleFilterChange('difficulty', difficulty.key)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-lg text-sm font-medium transition-colors ${
                          filters.difficulty === difficulty.key
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        <span className={`text-lg ${
                          difficulty.color === 'green' ? 'text-green-500' :
                          difficulty.color === 'yellow' ? 'text-yellow-500' :
                          'text-red-500'
                        }`}>
                          {difficulty.key === 'lätt' ? '🟢' : difficulty.key === 'medel' ? '🟡' : '🔴'}
                        </span>
                        <span>{difficulty.name}</span>
                        <span className="text-xs text-gray-500 text-center">{difficulty.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Kost & Livsstil Tab */}
            {activeTab === 'kost' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Kostpreferenser
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {allDietaryTags.map(tag => (
                      <button
                        key={tag.key}
                        onClick={() => handleFilterChange('dietaryTags', tag.key)}
                        className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors ${
                          filters.dietaryTags?.includes(tag.key)
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        <span className="text-lg">{tag.icon}</span>
                        <span>{tag.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Livsstil
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {allLifestyleTags.map(tag => (
                      <button
                        key={tag.key}
                        onClick={() => handleFilterChange('lifestyleTags', tag.key)}
                        className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors ${
                          filters.lifestyleTags?.includes(tag.key)
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        <span className="text-lg">{tag.icon}</span>
                        <span>{tag.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tillagningsmetod Tab */}
            {activeTab === 'metod' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Tillagningsmetod
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {allCookingMethods.map(method => (
                      <button
                        key={method.key}
                        onClick={() => handleFilterChange('cookingMethod', method.key)}
                        className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors ${
                          filters.cookingMethod === method.key
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        <span className="text-lg">{method.icon}</span>
                        <span>{method.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
