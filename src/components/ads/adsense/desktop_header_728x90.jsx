'use client';

import { useEffect } from 'react';

export default function DesktopHeader728x90() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <>
      {/* desktop_header_728_90 */}
      <ins
        className="adsbygoogle"
        style={{ display: 'inline-block', width: 728, height: 90 }}
        data-ad-client="ca-pub-7907405885837592"
        data-ad-slot="5825663357"
      />
    </>
  );
}
