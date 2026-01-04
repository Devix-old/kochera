'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollToTop Component
 * Automatically scrolls to top of page when route changes
 * Uses instant scroll to prevent Next.js scroll position preservation
 * 
 * Features:
 * - Instant scroll (no animation) - happens immediately before user can interact
 * - Respects hash links (doesn't scroll if hash exists in URL)
 * - Prevents jarring UX by scrolling before page renders
 * - Works with Next.js App Router navigation
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    // Safety check: Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    // Don't scroll if there's a hash in the URL (anchor link)
    // This allows smooth scrolling to page sections
    if (window.location.hash) {
      previousPathnameRef.current = pathname;
      return;
    }

    // Only scroll if pathname actually changed (not on initial mount)
    if (previousPathnameRef.current !== pathname) {
      // INSTANT scroll to top - no delay, no animation
      // This happens immediately, before Next.js can preserve scroll position
      // and before user can interact with the page
      window.scrollTo(0, 0);
      
      // Also set scroll position on documentElement and body for cross-browser compatibility
      if (typeof document !== 'undefined') {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
      
      // Update ref for next comparison
      previousPathnameRef.current = pathname;
    }
  }, [pathname]);

  // This component doesn't render anything
  return null;
}
