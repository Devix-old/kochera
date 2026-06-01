"use client";

import { useEffect, useRef } from "react";

const AD = {
  key: "3cd68f3a7b164d8dcd6398187f396100",
  width: 468,
  height: 60,
};

export function AdsterraBanner({ ad = AD, media, delay = 0, className = "" }) {
  const slotRef = useRef(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot || loadedRef.current) {
      return;
    }

    if (media && !window.matchMedia(media).matches) {
      return;
    }

    loadedRef.current = true;
    let observer = null;
    let checkTimeout = null;

    const loadAd = () => {
      if (!slot.isConnected) {
        loadedRef.current = false;
        return;
      }

      slot.innerHTML = "";
      slot.removeAttribute("data-loaded");

      window.atOptions = {
        key: ad.key,
        format: "iframe",
        height: ad.height,
        width: ad.width,
        params: {},
      };

      const invokeScript = document.createElement("script");
      invokeScript.src = `https://www.highperformanceformat.com/${ad.key}/invoke.js`;
      invokeScript.async = true;

      const markLoadedIfIframeExists = () => {
        const iframe = slot.querySelector("iframe");
        if (iframe) {
          slot.setAttribute("data-loaded", "true");
          return true;
        }
        slot.removeAttribute("data-loaded");
        return false;
      };

      observer = new MutationObserver(markLoadedIfIframeExists);
      observer.observe(slot, {
        childList: true,
        subtree: true,
      });

      slot.appendChild(invokeScript);

      checkTimeout = window.setTimeout(() => {
        if (!markLoadedIfIframeExists()) {
          loadedRef.current = false;
        }
        observer?.disconnect();
      }, 4000);
    };

    const delayTimeout = window.setTimeout(loadAd, delay);

    return () => {
      window.clearTimeout(delayTimeout);
      if (checkTimeout) {
        window.clearTimeout(checkTimeout);
      }
      observer?.disconnect();
      slot.innerHTML = "";
      slot.removeAttribute("data-loaded");
      loadedRef.current = false;
    };
  }, [ad.key, ad.width, ad.height, media, delay]);

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

export default AdsterraBanner;
