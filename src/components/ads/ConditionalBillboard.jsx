'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import Billboard_970x250 from './Billboard_970x250';

/**
 * Conditionally rendered Billboard ad component
 * Only renders on desktop (prevents hidden DOM nodes and duplicate ad loads)
 */
export default function ConditionalBillboard() {
  const isMobile = useIsMobile();

  // Prevent hydration mismatch by returning null during SSR
  if (isMobile === null) {
    return null;
  }

  // Only render on desktop
  if (isMobile) {
    return null;
  }

  return <Billboard_970x250 />;
}

