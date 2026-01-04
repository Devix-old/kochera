'use client';

import { useState, useRef, useEffect } from 'react';

const TURNSTILE_SITE_KEY = '0x4AAAAAACIEGTFQQ-_qYxVW';

export default function CommentForm({ pageSlug, parentId = null, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState(null);
  const turnstileWidgetIdRef = useRef(null);
  const turnstileRef = useRef(null);

  // Initialize Turnstile widget
  useEffect(() => {
    // Wait for Turnstile script to load
    const initTurnstile = () => {
      if (typeof window !== 'undefined' && window.turnstile && turnstileRef.current) {
        try {
          const widgetId = window.turnstile.render(turnstileRef.current, {
            sitekey: TURNSTILE_SITE_KEY,
            theme: 'light',
            size: 'normal',
            callback: (token) => {
              setTurnstileToken(token);
            },
            'error-callback': () => {
              setTurnstileToken(null);
              setError('Verifieringen misslyckades. Försök igen.');
            },
            'expired-callback': () => {
              setTurnstileToken(null);
            },
            'timeout-callback': () => {
              setTurnstileToken(null);
            },
          });
          turnstileWidgetIdRef.current = widgetId;
        } catch (err) {
          // Silently handle widget initialization errors
          if (process.env.NODE_ENV === 'development') {
            console.error('Failed to render Turnstile widget:', err);
          }
        }
      }
    };

    // Check if Turnstile is already loaded
    if (typeof window !== 'undefined' && window.turnstile) {
      initTurnstile();
    } else {
      // Wait for script to load
      const checkInterval = setInterval(() => {
        if (typeof window !== 'undefined' && window.turnstile) {
          clearInterval(checkInterval);
          initTurnstile();
        }
      }, 100);

      // Cleanup after 10 seconds if still not loaded
      setTimeout(() => clearInterval(checkInterval), 10000);
    }

    return () => {
      if (turnstileWidgetIdRef.current && typeof window !== 'undefined' && window.turnstile) {
        try {
          window.turnstile.remove(turnstileWidgetIdRef.current);
        } catch (err) {
          // Silently handle cleanup errors
        }
      }
    };
  }, []);

  const resetTurnstile = () => {
    if (turnstileWidgetIdRef.current && typeof window !== 'undefined' && window.turnstile) {
      try {
        window.turnstile.reset(turnstileWidgetIdRef.current);
        setTurnstileToken(null);
      } catch (err) {
        // Silently handle reset errors
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate Turnstile token
    if (!turnstileToken) {
      setError('Vänligen slutför verifieringen innan du skickar kommentaren.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page_slug: pageSlug,
          author_name: formData.author_name,
          author_email: formData.author_email || null,
          content: formData.content,
          parent_id: parentId,
          'cf-turnstile-response': turnstileToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Kunde inte skicka kommentaren');
      }

      // Reset form and Turnstile
      setFormData({ author_name: '', author_email: '', content: '' });
      resetTurnstile();
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err?.message || 'Något gick fel. Försök igen senare.');
      resetTurnstile();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="author_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Namn <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="author_name"
            required
            value={formData.author_name}
            onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Ditt namn"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="author_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            E-post (valfritt)
          </label>
          <input
            type="email"
            id="author_email"
            value={formData.author_email}
            onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="din@epost.se"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Kommentar <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          required
          rows={4}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y transition-all"
          placeholder="Skriv din kommentar här..."
          disabled={isSubmitting}
        />
      </div>

      {/* Turnstile Widget */}
      <div className="flex justify-center">
        <div ref={turnstileRef} />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting || !turnstileToken}
          className="relative px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
              Skickar...
            </span>
          ) : (
            parentId ? 'Skicka svar' : 'Skicka kommentar'
          )}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Avbryt
          </button>
        )}
      </div>
    </form>
  );
}
