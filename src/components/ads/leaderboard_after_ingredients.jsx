'use client';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function Leaderboard_after_ingredients() {
  const isMobile = useIsMobile();
  if (!isMobile) {
    return null;
  }
  
  return (
    <div className="w-full flex justify-center py-2">
        <div className="hb-ad-static hb-ad-leaderbord">
            <div className="hb-ad-inner">
                <div className="hbagency_cls_static" id="hbagency_space_274053" ></div>
            </div>
        </div>
    </div>
  );
}