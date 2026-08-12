// CSP is split: Studio routes get a permissive policy (Sanity needs eval + broad origins),
// everything else gets the strict policy.
const strictCsp = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https://images.unsplash.com https://picsum.photos https://cdn.sanity.io;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.api.sanity.io https://api.sanity.io;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

// Sanity Studio requires broader permissions — it loads from CDN and uses eval for code splitting
const studioCsp = `
  default-src 'self' https://*.sanity.io https://api.sanity.io;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.sanity.io;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.sanity.io;
  img-src 'self' blob: data: https://cdn.sanity.io https://*.sanity.io https://images.unsplash.com;
  font-src 'self' https://fonts.gstatic.com https://*.sanity.io;
  connect-src 'self' https://*.sanity.io wss://*.sanity.io https://api.sanity.io;
  frame-src 'self' https://*.sanity.io;
  object-src 'none';
  base-uri 'self';
`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
