'use client';

import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

// Memoized markdown components config to prevent recreation on each render
const markdownComponents = {
  a: ({ node, ...props }) => (
    <Link
      {...props}
      href={props.href || '#'}
      className="text-purple-600 dark:text-purple-400 underline hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
    />
  ),
};

/**
 * Truncates text at sentence boundaries within 140-220 character range
 * Shows 1-2 full sentences, never cuts mid-word or mid-sentence
 */
function truncateAtSentence(text, targetLength = 200, minLength = 140, maxLength = 220) {
  // Handle undefined/null/empty content
  if (!text || typeof text !== 'string') {
    return { truncated: '', isTruncated: false };
  }

  // If text is shorter than min length, return as is (no truncation needed)
  if (text.length <= minLength) {
    return { truncated: text, isTruncated: false };
  }

  // If text is shorter than max length, return as is
  if (text.length <= maxLength) {
    return { truncated: text, isTruncated: false };
  }

  // Find all sentence endings (., !, ? followed by space, newline, or end of string)
  const sentencePattern = /([.!?])(\s+|$)/g;
  const sentences = [];
  let match;
  
  while ((match = sentencePattern.exec(text)) !== null) {
    sentences.push({
      index: match.index,
      end: match.index + match[0].length
    });
  }

  // If no sentences found (unlikely but handle it), fallback to word boundary
  if (sentences.length === 0) {
    const lastSpaceIndex = text.lastIndexOf(' ', maxLength);
    if (lastSpaceIndex >= minLength) {
      return { truncated: text.substring(0, lastSpaceIndex).trim(), isTruncated: true };
    }
    return { truncated: text.substring(0, maxLength).trim(), isTruncated: true };
  }

  // Try to find 1-2 sentences that fit within the range
  // Prefer taking 2 sentences if they fit, otherwise take 1 sentence
  
  // First, try 1 sentence
  const firstSentenceEnd = sentences[0].end;
  if (firstSentenceEnd >= minLength && firstSentenceEnd <= maxLength) {
    // Check if we can fit 2 sentences
    if (sentences.length > 1 && sentences[1].end <= maxLength) {
      // Two sentences fit within maxLength - use them
      return { truncated: text.substring(0, sentences[1].end).trim(), isTruncated: true };
    } else {
      // Only 1 sentence fits, use it
      return { truncated: text.substring(0, firstSentenceEnd).trim(), isTruncated: true };
    }
  }

  // First sentence is too short (< minLength), try to add a second sentence
  if (sentences.length > 1) {
    const secondSentenceEnd = sentences[1].end;
    if (secondSentenceEnd >= minLength && secondSentenceEnd <= maxLength) {
      return { truncated: text.substring(0, secondSentenceEnd).trim(), isTruncated: true };
    }
  }

  // No ideal match found - find the best sentence boundary within range
  // Prefer sentences close to targetLength (200)
  let bestCutIndex = -1;
  let bestDistance = Infinity;
  
  for (const sentence of sentences) {
    if (sentence.end >= minLength && sentence.end <= maxLength) {
      const distance = Math.abs(sentence.end - targetLength);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestCutIndex = sentence.end;
      }
    }
  }

  if (bestCutIndex !== -1) {
    return { truncated: text.substring(0, bestCutIndex).trim(), isTruncated: true };
  }

  // Fallback: use the first sentence that exceeds minLength, even if it exceeds maxLength slightly
  // This ensures we always show at least 1 complete sentence
  for (const sentence of sentences) {
    if (sentence.end >= minLength) {
      return { truncated: text.substring(0, sentence.end).trim(), isTruncated: true };
    }
  }

  // Last resort: cut at word boundary within range
  const lastSpaceIndex = text.lastIndexOf(' ', maxLength);
  if (lastSpaceIndex >= minLength) {
    return { truncated: text.substring(0, lastSpaceIndex).trim(), isTruncated: true };
  }

  // Absolute fallback
  return { truncated: text.substring(0, maxLength).trim(), isTruncated: true };
}

export default function ExpandableTipText({ content }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle undefined/null content gracefully
  const safeContent = content || '';

  const { truncated, isTruncated } = useMemo(() => {
    return truncateAtSentence(safeContent, 200, 140, 220);
  }, [safeContent]);

  const displayText = isExpanded || !isTruncated ? safeContent : truncated;

  // Return empty div if no content
  if (!safeContent) {
    return null;
  }

  if (!isTruncated) {
    // No need for expand/collapse if text is short enough
    return (
      <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown components={markdownComponents}>
          {safeContent}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div>
      <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert">
        {isExpanded ? (
          <ReactMarkdown components={markdownComponents}>
            {safeContent}
          </ReactMarkdown>
        ) : (
          <>
            <ReactMarkdown components={markdownComponents}>
              {truncated}
            </ReactMarkdown>
            <span className="inline"> …</span>
          </>
        )}
      </div>
      <div className="mt-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium transition-colors"
        >
          {isExpanded ? 'Visa mindre' : 'Visa mer'}
        </button>
      </div>
    </div>
  );
}

