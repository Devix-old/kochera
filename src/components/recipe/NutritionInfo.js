'use client';

import { Activity, Zap, Wheat, Droplet, Leaf, Info, Beef, CircleDot } from 'lucide-react';
import { getGermanLabel, getDisplayOrder } from '@/lib/utils/nutrition';

/**
 * Get icon and color styling for Schema.org property
 */
function getPropertyStyle(propertyName) {
  const styles = {
    'calories': {
      colorClass: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
      Icon: Zap,
    },
    'carbohydrateContent': {
      colorClass: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      Icon: Wheat,
    },
    'proteinContent': {
      colorClass: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      Icon: Beef,
    },
    'fatContent': {
      colorClass: "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
      Icon: Droplet,
    },
    'saturatedFatContent': {
      colorClass: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
      Icon: CircleDot,
    },
    'fiberContent': {
      colorClass: "bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400",
      Icon: Leaf,
    },
    'sugarContent': {
      colorClass: "bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400",
      Icon: CircleDot,
    },
    'sodiumContent': {
      colorClass: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
      Icon: CircleDot,
    },
  };

  return styles[propertyName] || {
    colorClass: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    Icon: Activity,
  };
}

/**
 * Parse value and unit from normalized string like "245 kcal" or "32 g"
 */
function parseValueUnit(valueString) {
  if (!valueString) return { value: null, unit: '' };
  const match = valueString.match(/^(\d+(?:\.\d+)?)\s*(.+)$/);
  if (match) {
    return { value: match[1], unit: match[2] };
  }
  return { value: valueString, unit: '' };
}

/**
 * NutritionInfo component - displays Schema.org-compliant nutrition data
 * Accepts normalized Schema.org format (object with property names as keys)
 */
export default function NutritionInfo({ nutrition, servings = 1 }) {
  if (!nutrition || typeof nutrition !== 'object') {
    return null;
  }

  // Extract calories separately (prominent display)
  const calories = nutrition.calories;
  const caloriesData = calories ? parseValueUnit(calories) : null;

  // Get display order for properties (excluding calories and servingSize)
  const displayOrder = getDisplayOrder().filter(prop => 
    prop !== 'calories' && prop !== 'servingSize' && nutrition[prop]
  );

  // Get always-visible properties (Calories, Carbs, Protein, Fat)
  const alwaysVisible = displayOrder.filter(prop => 
    ['carbohydrateContent', 'proteinContent', 'fatContent'].includes(prop)
  );

  // Get optional properties (Sugar, Fiber, Sodium, Saturated Fat)
  const optionalVisible = displayOrder.filter(prop => 
    ['sugarContent', 'fiberContent', 'sodiumContent', 'saturatedFatContent'].includes(prop)
  );

  // Combine: always visible first, then optional
  const macroProperties = [...alwaysVisible, ...optionalVisible];

  // Don't render if no nutrition data (except servingSize)
  if (!caloriesData && macroProperties.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header with Title and Disclaimer */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Nährwerte</h3>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">
            pro Portion
          </span>
        </div>
        <div className="group relative">
          <Info className="w-4 h-4 text-gray-400 cursor-help" />
          <div className="absolute right-0 top-6 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            Die Werte sind ungefähre Berechnungen.
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          
          {/* Energy (Calories) - Prominent Display */}
          {caloriesData && (
            <div className="flex items-center gap-4 min-w-[140px]">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-full border border-orange-100 dark:border-orange-800/30">
                <Zap className="w-6 h-6 text-orange-500 dark:text-orange-400" />
              </div>
              <div>
                <span className="block text-3xl font-bold text-gray-900 dark:text-white leading-none tracking-tight">
                  {caloriesData.value}
                </span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 block">
                  {caloriesData.unit}
                </span>
              </div>
            </div>
          )}

          {/* Divider for desktop */}
          {macroProperties.length > 0 && (
            <div className="hidden md:block w-px h-16 bg-gray-100 dark:bg-gray-800"></div>
          )}

          {/* Macros Grid */}
          {macroProperties.length > 0 && (
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4">
              {macroProperties.map((propertyName) => {
                const valueString = nutrition[propertyName];
                if (!valueString) return null;

                const { value, unit } = parseValueUnit(valueString);
                const { colorClass, Icon } = getPropertyStyle(propertyName);
                const label = getGermanLabel(propertyName);

                return (
                  <div key={propertyName} className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                        {label}
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {value} <span className="text-xs font-normal text-gray-500">{unit}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
