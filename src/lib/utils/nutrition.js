/**
 * Nutrition normalization utilities for Schema.org compliance
 * Maps MDX nutrition data to Schema.org NutritionInformation format
 */

/**
 * Schema.org NutritionInformation property map
 * Maps German/Swedish/English nutrition names to Schema.org property names
 */
const SCHEMA_PROPERTY_MAP = {
  // Calories / Energy
  'kalorien': 'calories',
  'kalorier': 'calories',
  'calories': 'calories',
  'energi': 'calories',
  'energy': 'calories',
  
  // Carbohydrates
  'kohlenhydrate': 'carbohydrateContent',
  'kolhydrater': 'carbohydrateContent',
  'carbohydrate': 'carbohydrateContent',
  'kolhydrat': 'carbohydrateContent',
  
  // Protein
  'protein': 'proteinContent',
  'eiweiß': 'proteinContent',
  'eiweiss': 'proteinContent',
  
  // Fat
  'fett': 'fatContent',
  'fat': 'fatContent',
  
  // Saturated Fat
  'gesättigte fettsäuren': 'saturatedFatContent',
  'gesättigte fettsäure': 'saturatedFatContent',
  'saturated fat': 'saturatedFatContent',
  'saturatedfat': 'saturatedFatContent',
  
  // Fiber
  'ballaststoffe': 'fiberContent',
  'fiber': 'fiberContent',
  'fiber': 'fiberContent',
  
  // Sugar
  'zucker': 'sugarContent',
  'socker': 'sugarContent',
  'sugar': 'sugarContent',
  
  // Sodium
  'natrium': 'sodiumContent',
  'sodium': 'sodiumContent',
  'salt': 'sodiumContent',
  'salz': 'sodiumContent',
};

/**
 * Schema.org valid property names
 */
const VALID_SCHEMA_PROPERTIES = new Set([
  'calories',
  'carbohydrateContent',
  'proteinContent',
  'fatContent',
  'saturatedFatContent',
  'fiberContent',
  'sugarContent',
  'sodiumContent',
  'servingSize',
]);

/**
 * Normalize unit value
 * Accepts numbers or strings and returns properly formatted string with unit
 * 
 * @param {number|string} value - The numeric value or string with unit
 * @param {string} fieldType - The Schema.org property name
 * @param {string} existingUnit - The unit from MDX (if any)
 * @returns {string|null} Formatted string like "245 kcal", "32 g", or "420 mg"
 */
export function normalizeUnit(value, fieldType, existingUnit = null) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  // If value is already a string with unit, parse it
  let numValue = value;
  if (typeof value === 'string') {
    // Try to extract number from string
    const match = value.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
    if (match) {
      numValue = parseFloat(match[1]);
      if (match[2]) {
        existingUnit = match[2].trim();
      }
    } else {
      // If no number found, try parsing the whole string
      numValue = parseFloat(value);
      if (isNaN(numValue)) {
        return null;
      }
    }
  }

  if (isNaN(numValue)) {
    return null;
  }

  // Determine unit based on field type
  let unit = existingUnit;
  if (!unit) {
    if (fieldType === 'calories') {
      unit = 'kcal';
    } else if (fieldType === 'sodiumContent') {
      unit = 'mg';
    } else {
      unit = 'g';
    }
  }

  // Format with space: "245 kcal", "32 g", "420 mg"
  return `${numValue} ${unit}`;
}

/**
 * Normalize nutrition data from MDX format to Schema.org-compliant format
 * Only includes valid Schema.org properties with proper units
 * 
 * @param {Array} nutrition - MDX nutrition array with {name, value, unit} objects
 * @param {number|string} caloriesPerServing - Optional calories per serving
 * @param {number} servings - Number of servings for servingSize
 * @returns {Object|null} Schema.org NutritionInformation object or null
 */
export function normalizeNutritionData(nutrition = [], caloriesPerServing = null, servings = null) {
  const normalized = {};

  // Add servingSize if servings is provided
  if (servings !== null && servings !== undefined) {
    normalized.servingSize = '1 Portion';
  }

  // Handle caloriesPerServing if provided
  if (caloriesPerServing !== null && caloriesPerServing !== undefined) {
    const caloriesValue = normalizeUnit(caloriesPerServing, 'calories');
    if (caloriesValue) {
      normalized.calories = caloriesValue;
    }
  }

  // Process nutrition array
  if (Array.isArray(nutrition) && nutrition.length > 0) {
    for (const item of nutrition) {
      if (!item || !item.name) continue;

      const nameLower = item.name.toLowerCase().trim();
      const schemaProperty = SCHEMA_PROPERTY_MAP[nameLower];

      // Only process if we have a valid Schema.org property
      if (!schemaProperty || !VALID_SCHEMA_PROPERTIES.has(schemaProperty)) {
        continue; // Skip invalid properties
      }

      // Skip if value is missing
      if (item.value === null || item.value === undefined || item.value === '') {
        continue;
      }

      // Normalize the value with unit
      const normalizedValue = normalizeUnit(item.value, schemaProperty, item.unit);
      if (normalizedValue) {
        normalized[schemaProperty] = normalizedValue;
      }
    }
  }

  // Remove servingSize if it's the only property (must have at least calories or another property)
  if (Object.keys(normalized).length === 1 && normalized.servingSize) {
    return null;
  }

  // Return null if no nutrition data
  if (Object.keys(normalized).length === 0) {
    return null;
  }

  return normalized;
}

/**
 * Get German label for Schema.org property name
 * Used by UI components for display
 * 
 * @param {string} propertyName - Schema.org property name (e.g., "carbohydrateContent")
 * @returns {string} German label (e.g., "Kohlenhydrate")
 */
export function getGermanLabel(propertyName) {
  const labelMap = {
    'calories': 'Kalorien',
    'carbohydrateContent': 'Kohlenhydrate',
    'proteinContent': 'Eiweiß',
    'fatContent': 'Fett',
    'saturatedFatContent': 'Gesättigte Fettsäuren',
    'fiberContent': 'Ballaststoffe',
    'sugarContent': 'Zucker',
    'sodiumContent': 'Salz',
    'servingSize': 'Portionsgröße',
  };

  return labelMap[propertyName] || propertyName;
}

/**
 * Get display order for nutrition properties
 * Used by UI components to display in consistent order
 * 
 * @returns {Array} Array of property names in display order
 */
export function getDisplayOrder() {
  return [
    'calories',
    'carbohydrateContent',
    'proteinContent',
    'fatContent',
    'sugarContent',
    'fiberContent',
    'saturatedFatContent',
    'sodiumContent',
  ];
}
