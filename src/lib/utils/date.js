import { format, parseISO } from 'date-fns';
import { sv } from 'date-fns/locale';

/**
 * Format date to Swedish locale
 */
export function formatDate(date, formatStr = 'd MMMM yyyy') {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: sv });
}

/**
 * Calculate reading time in minutes
 */
export function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

