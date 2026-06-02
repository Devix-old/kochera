// Keep script-src strict in CSP; do not allow arbitrary external JavaScript.
// Ads are relaxed only at render time for the real production deployment.
const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV;

export const ADS_ENABLED =
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PUBLIC_ENABLE_ADSTERRA === "true" &&
  vercelEnv === "production";
