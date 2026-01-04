'use client';

import { useIsMobile } from '@/hooks/useIsMobile';

/**
 * Conditionally rendered Mobile Leaderboard ad component
 * Only renders on mobile (prevents hidden DOM nodes and duplicate ad loads)
 */
export default function MobileLearderboard() {
  const isMobile = useIsMobile();

  // Prevent hydration mismatch by returning null during SSR
  if (isMobile === null) {
    return null;
  }

  // Only render on mobile
  if (!isMobile) {
    return null;
  }

  return (
    <div className="w-full flex justify-center py-4">
      <div className="hb-ad-static hb-ad-a320x100">
        <div className="hb-ad-inner">
          <div className="hbagency_cls_static" id="hbagency_space_261751"></div>
        </div>
      </div>
    </div>
  );
}

