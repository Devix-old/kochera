"use client";

import { useEffect, useRef } from "react";

const AD = {
  key: "3cd68f3a7b164d8dcd6398187f396100",
  width: 468,
  height: 60,
};

export default function AdsterraRecipeAd({ ad = AD, media, className = "" }) {
  const slotRef = useRef(null);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot || slot.dataset.loaded === "true") {
      return;
    }

    if (media && !window.matchMedia(media).matches) {
      return;
    }

    slot.dataset.loaded = "true";
    slot.textContent = "";

    const optionsScript = document.createElement("script");
    optionsScript.text = `
      atOptions = {
        'key' : '${ad.key}',
        'format' : 'iframe',
        'height' : ${ad.height},
        'width' : ${ad.width},
        'params' : {}
      };
    `;

    const invokeScript = document.createElement("script");
    invokeScript.src = `https://www.highperformanceformat.com/${ad.key}/invoke.js`;
    invokeScript.async = false;

    slot.appendChild(optionsScript);
    slot.appendChild(invokeScript);
  }, [ad, media]);

  return (
    <div
      className={`flex justify-center ${className}`}
      style={{ minHeight: ad.height }}
      aria-label="Advertisement"
    >
      <div
        ref={slotRef}
        style={{
          width: ad.width,
          minHeight: ad.height,
          maxWidth: "100%",
        }}
      />
    </div>
  );
}
