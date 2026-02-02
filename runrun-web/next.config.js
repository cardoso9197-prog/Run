/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  generateBuildId: async () => {
    // Force new build ID to bust cache
    return `build-${Date.now()}`
  },
  images: {
    unoptimized: true,
    domains: ['localhost', 'runrun-backend.up.railway.app', 'run-production-3070.up.railway.app', 'zippy-healing-production-24e4.up.railway.app'],
  },
}

module.exports = nextConfig
