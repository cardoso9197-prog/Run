/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['localhost', 'runrun-backend.up.railway.app', 'run-production-3070.up.railway.app'],
  },
}

module.exports = nextConfig
