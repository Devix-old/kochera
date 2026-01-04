'use client';

import { useEffect } from 'react';

export default function TopBannerAd() {
  useEffect(() => {
    try {
      // Push ad only if adsbygoogle is available
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Fail silently (recommended by Google)
    }
  }, []);

  return (
    <>
      {/* top_banner_annonce */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7907405885837592"
        data-ad-slot="3255340334"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </>
  );
}
