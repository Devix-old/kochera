'use client';

import { Activity, Zap, Wheat, Droplet, Leaf, Info } from 'lucide-react';

// Simplified helper to categorize nutrients
const getNutrientType = (name) => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('kalori') || nameLower.includes('energi')) return 'energy';
  if (nameLower.includes('protein')) return 'protein';
  if (nameLower.includes('kolhydrat')) return 'carbs';
  if (nameLower.includes('fett')) return 'fat';
  if (nameLower.includes('fiber')) return 'fiber';
  return 'other';
};

export default function NutritionInfo({ nutrition, servings = 1 }) {
  if (!nutrition || nutrition.length === 0) {
    return null;
  }

  // Find the energy (calories) item
  const energyItem = nutrition.find(item => getNutrientType(item.name) === 'energy');
  // Filter out energy to show macros separately
  const macroItems = nutrition.filter(item => getNutrientType(item.name) !== 'energy');

  return (
    <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header with Title and Disclaimer */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Näringsvärde</h3>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">
            per portion
          </span>
        </div>
        <div className="group relative">
           <Info className="w-4 h-4 text-gray-400 cursor-help" />
           <div className="absolute right-0 top-6 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
             Värdena är ungefärliga beräkningar.
           </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          
          {/* Energy (Calories) - Prominent Display */}
          {energyItem && (
            <div className="flex items-center gap-4 min-w-[140px]">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-full border border-orange-100 dark:border-orange-800/30">
                <Zap className="w-6 h-6 text-orange-500 dark:text-orange-400" />
              </div>
              <div>
                <span className="block text-3xl font-bold text-gray-900 dark:text-white leading-none tracking-tight">
                  {energyItem.value}
                </span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 block">
                  {energyItem.unit}
                </span>
              </div>
            </div>
          )}

          {/* Divider for desktop */}
          <div className="hidden md:block w-px h-16 bg-gray-100 dark:bg-gray-800"></div>

          {/* Macros Grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4">
            {macroItems.map((item, index) => {
              const type = getNutrientType(item.name);
              
              // Define minimal styling based on type
              let colorClass = "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
              let Icon = Activity;
              
              switch(type) {
                case 'protein':
                  colorClass = "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
                  Icon = Activity;
                  break;
                case 'carbs':
                  colorClass = "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400";
                  Icon = Wheat;
                  break;
                case 'fat':
                  colorClass = "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400";
                  Icon = Droplet;
                  break;
                case 'fiber':
                  colorClass = "bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400";
                  Icon = Leaf;
                  break;
              }

              return (
                <div key={index} className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                      {item.name}
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {item.value} <span className="text-xs font-normal text-gray-500">{item.unit}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
