/**
 * Helpers for recipe yield / servings display
 * 
 * Rules:
 * - If yield is present in frontmatter, it takes precedence and we display quantity + unit
 *   e.g. yield: { amount: 12, unit: "Muffins" } -> "12 Muffins"
 * - If no yield but servings is present, we display servings as "X Portionen"
 * - If neither is present, return null and callers can skip display.
 */

/**
 * Normalize raw yield + servings into a structured object
 */
export function getYieldData(yieldField, servings) {
  // Prefer explicit yield object from MDX
  if (yieldField && typeof yieldField === 'object' && yieldField.amount) {
    const amount = Number(yieldField.amount);
    if (Number.isFinite(amount) && amount > 0) {
      const unit = (yieldField.unit || 'Portionen').trim();
      return {
        amount,
        unit,
        // Treat anything that is not "Portionen" as a quantity of units
        isQuantity: unit.toLowerCase() !== 'portionen',
      };
    }
  }

  // Fallback to servings if available
  if (servings) {
    const amount = Number(servings);
    if (Number.isFinite(amount) && amount > 0) {
      return {
        amount,
        unit: 'Portionen',
        isQuantity: false,
      };
    }
  }

  return null;
}

/**
 * Get human-readable label for UI, e.g. "4 Portionen" or "12 Muffins"
 */
export function formatYieldLabel(yieldField, servings) {
  const data = getYieldData(yieldField, servings);
  if (!data) return null;
  return `${data.amount} ${data.unit}`;
}

