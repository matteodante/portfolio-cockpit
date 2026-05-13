import bundleAnalyzer from '@next/bundle-analyzer'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  poweredByHeader: false,
  typedRoutes: true,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
    reactRemoveProperties:
      process.env.NODE_ENV === 'production'
        ? { properties: ['^data-testid$'] }
        : false,
  },
  compress: true,
  experimental: {
    optimizePackageImports: ['three', 'zustand'],
  },
  outputFileTracingIncludes: {
    '/api/cv/**': ['./private/resume/**'],
    '/api/translations/**': ['./lib/i18n/translations/*.enc'],
    '/api/chat': ['./lib/ai/*.enc'],
  },
  devIndicators: false,
  images: {
    minimumCacheTTL: 60 * 60 * 24 * 30,
    qualities: [90],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
      ],
    },
  ],
}

const bundleAnalyzerPlugin = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default bundleAnalyzerPlugin(nextConfig)
