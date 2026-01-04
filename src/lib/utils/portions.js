/**
 * Utilities for scaling recipe portions
 */

/**
 * Parse ingredient amount and scale it
 */
export function scaleIngredient(ingredient, originalServings, newServings) {
  const multiplier = newServings / originalServings;
  
  // Extract numbers from ingredient string (supports decimals, fractions)
  const numberPattern = /(\d+(?:[.,]\d+)?(?:\/\d+)?)/g;
  
  return ingredient.replace(numberPattern, (match) => {
    // Handle fractions like 1/2
    if (match.includes('/')) {
      const [num, denom] = match.split('/').map(Number);
      const scaled = (num / denom) * multiplier;
      return formatNumber(scaled);
    }
    
    // Handle decimals (both . and , as decimal separator)
    const number = parseFloat(match.replace(',', '.'));
    const scaled = number * multiplier;
    return formatNumber(scaled);
  });
}

/**
 * Format scaled number to readable format
 */
function formatNumber(num) {
  // Round to 2 decimal places
  const rounded = Math.round(num * 100) / 100;
  
  // Convert to fraction if it makes sense
  if (rounded === 0.25) return '¼';
  if (rounded === 0.33 || rounded === 0.333) return '⅓';
  if (rounded === 0.5) return '½';
  if (rounded === 0.66 || rounded === 0.666) return '⅔';
  if (rounded === 0.75) return '¾';
  
  // Return integer if whole number
  if (Number.isInteger(rounded)) return rounded.toString();
  
  // Return with one decimal place
  return rounded.toFixed(1).replace('.', ',');
}

/**
 * Scale all ingredients in a recipe
 */
export function scaleIngredients(ingredientSections, originalServings, newServings) {
  return ingredientSections.map(section => ({
    ...section,
    items: section.items.map(item => 
      scaleIngredient(item, originalServings, newServings)
    ),
  }));
}

