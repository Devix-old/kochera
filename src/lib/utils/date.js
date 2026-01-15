import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

/**
 * Format date to German locale
 */
export function formatDate(date, formatStr = 'd MMMM yyyy') {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: de });
}

/**
 * Calculate reading time in minutes
 */
export function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

