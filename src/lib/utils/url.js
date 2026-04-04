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
  if (path === undefined || path === null || path === '') {
    return baseUrl && typeof baseUrl === 'string' ? baseUrl.replace(/\/+$/, '') : '';
  }

  const cleanBase =
    baseUrl && typeof baseUrl === 'string' ? baseUrl.replace(/\/+$/, '') : '';

  const cleanPath = String(path).replace(/^\/+/, '');

  if (!cleanPath) return cleanBase;

  return cleanBase ? `${cleanBase}/${cleanPath}` : `/${cleanPath}`;
}

