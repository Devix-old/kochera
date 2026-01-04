'use client';

import { useEffect } from 'react';

export default function MobileBanner320x100() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <>
      {/* mobile_banner_320_100 */}
      <ins
        className="adsbygoogle"
        style={{ display: 'inline-block', width: 320, height: 100 }}
        data-ad-client="ca-pub-7907405885837592"
        data-ad-slot="9876589005"
      />
    </>
  );
}
