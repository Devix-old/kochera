/**
 * Custom hook for admin comment management with optimistic updates
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Comment, CommentCounts, CommentStatus } from '@/types/comments';

interface UseAdminCommentsOptions {
  filter?: 'all' | CommentStatus;
  searchSlug?: string;
}

interface UseAdminCommentsReturn {
  comments: Comment[];
  counts: CommentCounts;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateCommentStatus: (commentId: string, newStatus: CommentStatus) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
}

export function useAdminComments({ 
  filter = 'all', 
  searchSlug = '' 
}: UseAdminCommentsOptions = {}): UseAdminCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [counts, setCounts] = useState<CommentCounts>({
    total: 0,
    pending: 0,
    approved: 0,
    spam: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchComments = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('status', filter);
      }
      if (searchSlug) {
        params.append('page_slug', searchSlug);
      }

      const response = await fetch(`/api/comments/admin/all?${params.toString()}`, {
        signal: abortControllerRef.current.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Kunde inte ladda kommentarer');
      }

      setComments(data.comments || []);
      setCounts(data.counts || {
        total: 0,
        pending: 0,
        approved: 0,
        spam: 0,
      });
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Kunde inte ladda kommentarer');
      }
    } finally {
      setIsLoading(false);
    }
  }, [filter, searchSlug]);

  // Optimistic update for status change
  const updateCommentStatus = useCallback(async (commentId: string, newStatus: CommentStatus) => {
    const originalComments = [...comments];
    const originalCounts = { ...counts };
    const comment = comments.find(c => c.id === commentId);

    try {
      // Optimistic update - update UI immediately
      if (comment) {
        setComments(prev => prev.map(c => 
          c.id === commentId ? { ...c, status: newStatus } : c
        ));

        // Update counts optimistically
        setCounts(prev => ({
          ...prev,
          [comment.status]: Math.max(0, prev[comment.status as keyof CommentCounts] - 1),
          [newStatus]: (prev[newStatus as keyof CommentCounts] as number) + 1,
        }));
      }

      // Make API call
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Kunde inte uppdatera kommentaren');
      }
      
      // Refetch in background to ensure sync (don't show loading)
      setTimeout(() => {
        fetchComments();
      }, 500);
    } catch (err) {
      // Rollback on error
      setComments(originalComments);
      setCounts(originalCounts);
      throw err;
    }
  }, [comments, counts, fetchComments]);

  // Optimistic delete
  const deleteComment = useCallback(async (commentId: string) => {
    const originalComments = [...comments];
    const originalCounts = { ...counts };
    const comment = comments.find(c => c.id === commentId);

    try {
      // Optimistic remove - remove from UI immediately
      setComments(prev => prev.filter(c => c.id !== commentId));

      // Update counts immediately
      if (comment) {
        setCounts(prev => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
          [comment.status]: Math.max(0, (prev[comment.status as keyof CommentCounts] as number) - 1),
        }));
      }

      // Make API call
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Kunde inte radera kommentaren');
      }

      // Refetch in background to ensure sync (don't show loading)
      setTimeout(() => {
        fetchComments();
      }, 500);
    } catch (err) {
      // Rollback on error
      setComments(originalComments);
      setCounts(originalCounts);
      throw err;
    }
  }, [comments, counts, fetchComments]);

  const refetch = useCallback(async () => {
    await fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    fetchComments();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchComments]);

  return {
    comments,
    counts,
    isLoading,
    error,
    refetch,
    updateCommentStatus,
    deleteComment,
  };
}

