/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression and optimization
  compress: true,
  
  // Optimize bundle size
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Legacy Swedish paths from the original project port — kept as 301s to preserve any
  // indexed URLs. Swedish: "kategorier" = German: "Kategorien". Do not remove.
  async redirects() {
    return [
      {
        source: '/kategorier',
        destination: '/rezepte',
        permanent: true,
      },
      {
        source: '/kategorier/:slug',
        destination: '/:slug',
        permanent: true,
      },
      // German alias in case /kategorien was ever linked internally
      {
        source: '/kategorien',
        destination: '/rezepte',
        permanent: true,
      },
      {
        source: '/kategorien/:slug',
        destination: '/:slug',
        permanent: true,
      },
    ];
  },

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
      // Cache images + prevent raw image URLs from being indexed as pages
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
