"use client";

import { useEffect, useRef } from "react";
import { ADS_ENABLED } from "@/lib/ads";

const AD = {
  key: "3cd68f3a7b164d8dcd6398187f396100",
  width: 468,
  height: 60,
};

let adsterraLoadQueue = Promise.resolve();

export function AdsterraBanner({ ad = AD, media, delay = 0, className = "" }) {
  const slotRef = useRef(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!ADS_ENABLED) {
      return;
    }

    const slot = slotRef.current;
    if (!slot || loadedRef.current) {
      return;
    }

    if (media && !window.matchMedia(media).matches) {
      return;
    }

    loadedRef.current = true;
    let cancelled = false;
    let observer = null;
    let checkTimeout = null;

    const loadAd = () =>
      new Promise((resolve) => {
        if (cancelled || !slot.isConnected) {
          loadedRef.current = false;
          resolve();
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

        let finished = false;
        const finish = () => {
          if (finished) {
            return;
          }
          finished = true;
          if (!markLoadedIfIframeExists()) {
            loadedRef.current = false;
          }
          observer?.disconnect();
          resolve();
        };

        observer = new MutationObserver(() => {
          if (markLoadedIfIframeExists()) {
            finish();
          }
        });
        observer.observe(slot, {
          childList: true,
          subtree: true,
        });

        invokeScript.addEventListener("error", finish, { once: true });
        slot.appendChild(invokeScript);

        checkTimeout = window.setTimeout(finish, 5000);
      });

    const delayTimeout = window.setTimeout(() => {
      adsterraLoadQueue = adsterraLoadQueue.then(loadAd, loadAd);
    }, delay);

    return () => {
      cancelled = true;
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

  if (!ADS_ENABLED) {
    return null;
  }

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
