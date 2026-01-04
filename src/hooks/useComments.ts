/**
 * Custom hook for managing comments with cache and optimistic updates
 * Professional data fetching pattern without external dependencies
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Comment } from '@/types/comments';

interface UseCommentsOptions {
  pageSlug: string;
  enabled?: boolean;
}

interface UseCommentsReturn {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  mutate: (updater: (comments: Comment[]) => Comment[]) => void;
}

// Simple in-memory cache
const cache = new Map<string, { data: Comment[]; timestamp: number }>();
const CACHE_TTL = 30000; // 30 seconds

export function useComments({ pageSlug, enabled = true }: UseCommentsOptions): UseCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheKey = `comments-${pageSlug}`;

  const fetchComments = useCallback(async () => {
    if (!enabled) return;

    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setComments(cached.data);
      setIsLoading(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setError(null);
      
      const response = await fetch(`/api/comments/by-slug/${pageSlug}`, {
        signal: abortControllerRef.current.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Kunde inte ladda kommentarer');
      }

      const fetchedComments = data.comments || [];
      setComments(fetchedComments);
      
      // Update cache
      cache.set(cacheKey, { data: fetchedComments, timestamp: Date.now() });
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Kunde inte ladda kommentarer');
      }
    } finally {
      setIsLoading(false);
    }
  }, [pageSlug, enabled, cacheKey]);

  // Optimistic update function
  const mutate = useCallback((updater: (comments: Comment[]) => Comment[]) => {
    setComments(updater);
    // Invalidate cache
    cache.delete(cacheKey);
  }, [cacheKey]);

  // Refetch function
  const refetch = useCallback(async () => {
    cache.delete(cacheKey); // Invalidate cache
    setIsLoading(true);
    await fetchComments();
  }, [fetchComments, cacheKey]);

  useEffect(() => {
    fetchComments();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchComments]);

  return { comments, isLoading, error, refetch, mutate };
}

