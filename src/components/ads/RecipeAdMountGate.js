"use client";

import { useEffect, useState } from "react";

export default function RecipeAdMountGate({ step = 1, delay, children }) {
  const waitTime = delay ?? Math.max(0, (step - 1) * 1500);
  const [isReady, setIsReady] = useState(waitTime === 0);

  useEffect(() => {
    if (waitTime === 0) {
      setIsReady(true);
      return undefined;
    }

    setIsReady(false);
    const timer = window.setTimeout(() => setIsReady(true), waitTime);

    return () => {
      window.clearTimeout(timer);
    };
  }, [waitTime]);

  if (!isReady) {
    return null;
  }

  return children;
}
