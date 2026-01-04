'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import MobileBanner320x100 from './mobile_banner_320x100';
import DesktopHeader728x90 from './desktop_header_728x90';

export default function HeaderAd() {
  const isMobile = useIsMobile();

  // Prevent hydration / double render
  if (isMobile === null) return null;

  return (
    <div className="w-full flex justify-center bg-gray-50">
      {isMobile ? <MobileBanner320x100 /> : <DesktopHeader728x90 />}
    </div>
  );
}
