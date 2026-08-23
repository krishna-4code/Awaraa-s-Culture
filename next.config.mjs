const isDev = process.env.NODE_ENV === 'development';

// CSP is split: Studio routes get a permissive policy (Sanity needs eval + broad origins),
// everything else gets the strict policy.
// In development (HTTP localhost), upgrade-insecure-requests MUST be omitted to prevent browser hanging on HTTPS localhost.
const strictCsp = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https://images.unsplash.com https://picsum.photos https://cdn.sanity.io;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' ws://localhost:* http://localhost:* ws://127.0.0.1:* http://127.0.0.1:* https://*.supabase.co wss://*.supabase.co https://*.api.sanity.io https://api.sanity.io;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  ${isDev ? '' : 'upgrade-insecure-requests;'}
`;

// Sanity Studio requires broader permissions — it loads from CDN and uses eval for code splitting
const studioCsp = `
  default-src 'self' https://*.sanity.io https://api.sanity.io;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.sanity.io;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.sanity.io;
  img-src 'self' blob: data: https://cdn.sanity.io https://*.sanity.io https://images.unsplash.com;
  font-src 'self' https://fonts.gstatic.com https://*.sanity.io;
  connect-src 'self' ws://localhost:* http://localhost:* ws://127.0.0.1:* http://127.0.0.1:* https://*.sanity.io wss://*.sanity.io https://api.sanity.io https://registry.npmjs.org https://cdn.jsdelivr.net https://unpkg.com;
  frame-src 'self' https://*.sanity.io;
  object-src 'none';
  base-uri 'self';
`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640, 768, 1024],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        // Sanity image CDN — required for product images uploaded via Studio
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async headers() {
    // In local dev, relax headers so HMR and local HTTP are instant
    if (isDev) {
      return [];
    }

    return [
      {
        // Sanity Studio route — permissive policy
        source: '/studio/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: studioCsp.replace(/\n/g, ''),
          },
        ],
      },
      {
        // All other routes — strict policy
        source: '/((?!studio).*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: strictCsp.replace(/\n/g, ''),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
