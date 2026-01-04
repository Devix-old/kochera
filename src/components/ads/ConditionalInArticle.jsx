'use client';

import { useIsMobile } from '@/hooks/useIsMobile';

/**
 * Conditionally rendered InArticle ad component
 * Only renders when viewport matches (prevents hidden DOM nodes and duplicate ad loads)
 */
export default function ConditionalInArticle({ 
  showOnMobile = false, 
  showOnDesktop = false 
}) {
  const isMobile = useIsMobile();

  // Prevent hydration mismatch by returning null during SSR
  if (isMobile === null) {
    return null;
  }

  // Only render if viewport matches requirement
  if (isMobile && !showOnMobile) return null;
  if (!isMobile && !showOnDesktop) return null;

  return (
    <div className="w-full flex justify-center py-4">
      <div className="hb-ad-inpage">
        <div className="hb-ad-inner"> 
          <div className="hbagency_cls hbagency_space_241545"></div>
        </div> 
      </div>
    </div>
  );
}

