/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression and optimization
  compress: true,
  
  // Optimize bundle size
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Exclude SEO dashboard from production builds
  ...(process.env.NODE_ENV === 'production' && {
    async rewrites() {
      return {
        beforeFiles: [
          {
            source: '/seo-optiz/:path*',
            destination: '/404',
          },
        ],
      };
    },
  }),
  
  // SWC minification is enabled by default in Next.js 15
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Optimize images for better performance and SEO
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable image optimization with longer cache for better performance
    minimumCacheTTL: 31536000, // 1 year for images (optimized)
    dangerouslyAllowSVG: true,
  },
  
  // SEO: 301 Redirects for www/non-www canonical domain
  async redirects() {
    return [
      {
        source: '/(.*)',
        has: [
          {
            type: 'host',
            value: 'www.bakstunden.se',
          },
        ],
        destination: 'https://bakstunden.se/:path*',
        permanent: true, // 301 redirect
      },
      // Redirect /categories/* to /kategorier/* (Swedish)
      {
        source: '/categories/:path*',
        destination: '/kategorier/:path*',
        permanent: true, // 301 redirect
      },
    ];
  },

  // SEO: Performance and security headers
  async headers() {
    return [
      // Sitemap-specific headers - always fresh for SEO
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      // General headers for all routes (excluding sitemap which has its own rule above)
      {
        source: '/(.*)',
        headers: [
          // Performance headers
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // TODO: Temporarily removed CSP for testing - uncomment when ready
          // {
          //   key: 'Content-Security-Policy',
          //   value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://www.google.com https://www.gstatic.com https://fundingchoicesmessages.google.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://adservice.google.com https://adservice.google.se https://www.google.com https://fundingchoicesmessages.google.com; frame-src 'self' https://www.googletagmanager.com https://www.google.com https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://fundingchoicesmessages.google.com https://adservice.google.com https://adservice.google.se https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google;",
          // },
        ],
      },
      // Cache control for HTML pages (excludes sitemap.xml which is handled above)
      {
        source: '/((?!sitemap\\.xml).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate',
          },
        ],
      },
      // Cache static assets
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache images
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
