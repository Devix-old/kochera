/**
 * Helper utilities for pillar pages
 * Provides helper functions for working with pillar content
 */

import { getContentBySlug, getAllContent } from '@/lib/mdx';

/**
 * Get pillar by slug
 * @param {string} slug - The slug of the pillar page
 * @returns {Promise<Object|null>} The pillar data or null if not found
 */
export async function getPillarBySlug(slug) {
  return await getContentBySlug('pillars', slug);
}

/**
 * Get all pillars
 * @returns {Promise<Array>} Array of all pillar pages
 */
export async function getAllPillars() {
  return await getAllContent('pillars');
}

/**
 * Get pillars by topic
 * @param {string} topic - The topic/category to filter by
 * @returns {Promise<Array>} Array of pillars matching the topic
 */
export async function getPillarsByTopic(topic) {
  const allPillars = await getAllPillars();
  return allPillars.filter(pillar => pillar.pillarTopic === topic);
}

/**
 * Get related pillars
 * @param {string} currentSlug - The slug of the current pillar
 * @param {number} limit - Maximum number of related pillars to return
 * @returns {Promise<Array>} Array of related pillar pages
 */
export async function getRelatedPillars(currentSlug, limit = 3) {
  const allPillars = await getAllPillars();
  const currentPillar = allPillars.find(p => p.slug === currentSlug);
  
  if (!currentPillar) {
    return [];
  }

  // Score pillars based on relevance
  const scoredPillars = allPillars
    .filter(pillar => pillar.slug !== currentSlug)
    .map(pillar => {
      let score = 0;
      
      // Same topic: +5 points
      if (pillar.pillarTopic && currentPillar.pillarTopic && 
          pillar.pillarTopic === currentPillar.pillarTopic) {
        score += 5;
      }
      
      // Shared tags: +2 points per shared tag
      const currentTags = currentPillar.tags || [];
      const pillarTags = pillar.tags || [];
      const sharedTags = pillarTags.filter(tag => currentTags.includes(tag));
      score += sharedTags.length * 2;
      
      // Shared keywords: +1 point per shared keyword
      const currentKeywords = currentPillar.relatedKeywords || [];
      const pillarKeywords = pillar.relatedKeywords || [];
      const sharedKeywords = pillarKeywords.filter(kw => currentKeywords.includes(kw));
      score += sharedKeywords.length;
      
      return { ...pillar, relevanceScore: score };
    })
    .filter(pillar => pillar.relevanceScore > 0)
    .sort((a, b) => {
      // Primary sort: by relevance score (descending)
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      // Secondary sort: by slug (ascending) for stability
      return a.slug.localeCompare(b.slug);
    })
    .slice(0, limit);

  return scoredPillars;
}

/**
 * Get pillar topics (unique list of all topics)
 * @returns {Promise<Array>} Array of unique topic names
 */
export async function getPillarTopics() {
  const allPillars = await getAllPillars();
  const topics = new Set();
  
  allPillars.forEach(pillar => {
    if (pillar.pillarTopic) {
      topics.add(pillar.pillarTopic);
    }
  });
  
  return Array.from(topics).sort();
}

/**
 * Get pillar by category name or filterTag
 * Tries to match recipe category to pillar filterTag or title
 * @param {string} categoryName - The category name from recipe
 * @returns {Promise<Object|null>} The pillar data with { frontmatter, content, slug } structure or null if not found
 */
export async function getPillarByCategory(categoryName) {
  if (!categoryName) return null;
  
  const allPillars = await getAllPillars();
  const categoryLower = categoryName.toLowerCase();
  
  // Try to find pillar by filterTag matching category
  // getAllPillars returns { slug, ...frontmatter } structure (frontmatter is spread)
  const matchedPillar = allPillars.find(pillar => {
    const filterTag = pillar.filterTag?.toLowerCase() || '';
    const title = pillar.title?.toLowerCase() || '';
    const slug = pillar.slug?.toLowerCase() || '';
    
    return filterTag === categoryLower || 
           filterTag.includes(categoryLower) ||
           categoryLower.includes(filterTag) ||
           title === categoryLower ||
           slug === categoryLower ||
           title.includes(categoryLower);
  });
  
  if (!matchedPillar) return null;
  
  // Return in same format as getPillarBySlug: { frontmatter, content, slug }
  const fullPillar = await getPillarBySlug(matchedPillar.slug);
  return fullPillar;
}
