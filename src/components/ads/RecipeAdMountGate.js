"use client";

import { useEffect, useState } from "react";

export default function RecipeAdMountGate({ step, children }) {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const t1 = window.setTimeout(() => setCurrentStep(2), 3000);
    const t2 = window.setTimeout(() => setCurrentStep(3), 6000);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (currentStep < step) {
    return null;
  }

  return children;
}
