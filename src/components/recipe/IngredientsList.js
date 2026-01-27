'use client';

import { useState } from 'react';
import { Users, Minus, Plus } from 'lucide-react';
import { scaleIngredients } from '@/lib/utils/portions';

export default function IngredientsList({ ingredients, defaultServings, yieldLabel }) {
  const [servings, setServings] = useState(defaultServings);
  const [checkedItems, setCheckedItems] = useState({});

  const scaledIngredients = scaleIngredients(ingredients, defaultServings, servings);

  const toggleCheck = (sectionIndex, itemIndex) => {
    const key = `${sectionIndex}-${itemIndex}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const increaseServings = () => setServings(prev => prev + 1);
  const decreaseServings = () => setServings(prev => Math.max(1, prev - 1));

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        
        <div className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-gray-800 rounded-lg p-1.5 sm:p-2 shrink-0">
          <button
            onClick={decreaseServings}
            className="p-1.5 sm:p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50 flex-shrink-0"
            disabled={servings <= 1}
            aria-label="Minska portioner"
          >
            <Minus className="w-4 h-4 sm:w-4 sm:h-4" />
          </button>
          
          <div className="flex items-center gap-1.5 sm:gap-2 px-1 sm:px-2 min-w-[3ch] sm:min-w-[2ch]">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
            <span className="font-semibold text-center text-sm sm:text-base">
              {yieldLabel || servings}
            </span>
          </div>
          
          <button
            onClick={increaseServings}
            className="p-1.5 sm:p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0"
            aria-label="Öka portioner"
          >
            <Plus className="w-4 h-4 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {scaledIngredients.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.title && (
              <h3 className="font-semibold text-lg mb-3">{section.title}</h3>
            )}
            <ul className="space-y-2">
              {section.items.map((item, itemIndex) => {
                const key = `${sectionIndex}-${itemIndex}`;
                const isChecked = checkedItems[key];

                return (
                  <li key={itemIndex}>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={isChecked || false}
                        onChange={() => toggleCheck(sectionIndex, itemIndex)}
                        className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span
                        className={`flex-1 transition-all ${
                          isChecked
                            ? 'line-through text-gray-500 dark:text-gray-600'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {item}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

