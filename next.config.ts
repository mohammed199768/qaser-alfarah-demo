import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // 3840 (4K) is dropped — this is a marketing site, not a photo gallery
    // app; nothing renders anywhere near 4K wide, so that breakpoint only
    // ever added extra, unused srcset candidates to every <Image>.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [64, 128, 256, 384],
    formats: ["image/webp"],
    qualities: [75],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  allowedDevOrigins: [
    "172.30.48.1",
    "10.33.153.21",
    "10.33.153.*",
    "10.83.224.21",
    "10.83.224.*",
  ],
  async headers() {
    const cspReportOnly = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline' https:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
      "connect-src 'self' http://localhost:* ws://localhost:* https:",
      "frame-src 'self' https:",
      "media-src 'self' blob: data:",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "report-uri /api/security/csp-report",
    ].join('; ');

    const baseHeaders = [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
      // camera=(self) required for admin camera scanner (M6B). fullscreen=(self) for photo viewer.
      { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=(), payment=(), usb=(), fullscreen=(self)' },
      // Report-Only: observation phase only — not enforced. Enforcement deferred to SEC-05-M3
      // after CSP violations are monitored in production and unsafe-* directives are tightened.
      { key: 'Content-Security-Policy-Report-Only', value: cspReportOnly },
    ];

    if (isProduction) {
      baseHeaders.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains',
      });
    }

    return [
      {
        source: '/:path*',
        headers: baseHeaders,
      },
    ];
  },
};

export default nextConfig;
