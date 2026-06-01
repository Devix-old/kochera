"use client";

import { useEffect, useRef } from "react";

const DEFAULT_CONTAINER_AD = {
  id: "container-7e3012fe0a2401dad93783050b1c02a3",
  src: "https://pl29603519.effectivecpmnetwork.com/7e3012fe0a2401dad93783050b1c02a3/invoke.js",
};

export default function AdsterraContainerAd({
  ad = DEFAULT_CONTAINER_AD,
  className = "",
}) {
  const slotRef = useRef(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot || loadedRef.current) {
      return;
    }

    loadedRef.current = true;
    slot.innerHTML = "";
    slot.removeAttribute("data-loaded");

    const container = document.createElement("div");
    container.id = ad.id;

    const script = document.createElement("script");
    script.src = ad.src;
    script.async = true;
    script.setAttribute("data-cfasync", "false");

    script.addEventListener(
      "load",
      () => {
        slot.setAttribute("data-loaded", "true");
      },
      { once: true }
    );

    slot.appendChild(container);
    slot.appendChild(script);

    return () => {
      slot.innerHTML = "";
      slot.removeAttribute("data-loaded");
      loadedRef.current = false;
    };
  }, [ad.id, ad.src]);

  return (
    <div
      className={`flex justify-center ${className}`}
      aria-label="Advertisement"
    >
      <div ref={slotRef} className="w-full min-h-[120px]" />
    </div>
  );
}
