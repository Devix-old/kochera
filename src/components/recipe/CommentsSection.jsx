'use client';

import { useState, useEffect, useCallback } from 'react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import SuccessModal from '@/components/ui/SuccessModal';

export default function CommentsSection({ pageSlug }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/comments/by-slug/${pageSlug}`, {
        cache: 'no-store',
      });
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Kunde inte ladda kommentarer');
      }
      
      setComments(result.comments || []);
    } catch (err) {
      setError(err.message || 'Kunde inte ladda kommentarer');
    } finally {
      setLoading(false);
    }
  }, [pageSlug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentSubmitted = () => {
    setShowSuccessModal(true);
    fetchComments();
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-2 text-gray-600 dark:text-gray-400">Laddar kommentarer...</p>
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200 dark:border-gray-800">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Kommentarer
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Har du frågor eller tips om detta recept? Dela gärna dina tankar!
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg animate-in fade-in duration-300">
          {error}
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="mb-8 space-y-6">
          {comments.map((comment, index) => (
            <div key={comment.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CommentItem comment={comment} colorIndex={index} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-8 text-center py-12 bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-gray-900/50 dark:to-purple-950/20 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-5xl mb-4">💬</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Inga kommentarer än. Var den första att kommentera!
          </p>
        </div>
      )}

      {/* Comment Form */}
      <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-gray-900 dark:to-purple-950/20 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Skriv en kommentar
        </h3>
        <CommentForm 
          pageSlug={pageSlug} 
          onSuccess={handleCommentSubmitted}
        />
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Din kommentar har skickats och väntar på godkännande. Den kommer att visas så snart den har granskats."
      />
    </section>
  );
}
