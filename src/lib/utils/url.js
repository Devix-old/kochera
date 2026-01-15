/**
 * Normalize URL by removing double slashes
 * Handles cases where base URL and path are concatenated
 * 
 * @param {string} baseUrl - The base URL (e.g., "https://kochira.de")
 * @param {string} path - The path to append (e.g., "/recipe-slug" or "recipe-slug")
 * @returns {string} - Normalized URL with single slashes
 * 
 * @example
 * normalizeUrl("https://kochira.de", "/recipe") // "https://kochira.de/recipe"
 * normalizeUrl("https://kochira.de/", "/recipe") // "https://kochira.de/recipe"
 * normalizeUrl("https://kochira.de", "recipe") // "https://kochira.de/recipe"
 */
export function normalizeUrl(baseUrl, path) {
  if (!path) return baseUrl;
  
  // Remove trailing slash from base URL
  const cleanBase = baseUrl.replace(/\/+$/, '');
  
  // Remove leading slashes from path
  const cleanPath = path.replace(/^\/+/, '');
  
  // Join with single slash
  return cleanPath ? `${cleanBase}/${cleanPath}` : cleanBase;
}

