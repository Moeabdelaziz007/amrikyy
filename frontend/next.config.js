/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  images: {
    domains: ['localhost', 'images.unsplash.com', 'example.com'],
    unoptimized: true,
  },
  // GitHub Pages configuration
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  basePath: process.env.NODE_ENV === 'production' ? '/amrikyy' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/amrikyy/' : '',
  // Optimization for static export
  swcMinify: true,
  // Disable server features for static export
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Static export optimization
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig
