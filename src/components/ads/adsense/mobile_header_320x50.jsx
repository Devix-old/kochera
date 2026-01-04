'use client';

import { useEffect } from 'react';

export default function MobileHeader320x50() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <>


      {/* mobile_header_320_50 */}
      <ins
        className="adsbygoogle"
        style={{ display: 'inline-block', width: 320, height: 50 }}
        data-ad-client="ca-pub-7907405885837592"
        data-ad-slot="1625390434"
      />
    </>
  );
}
