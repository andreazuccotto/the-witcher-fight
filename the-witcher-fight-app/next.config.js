/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      allowedDevOrigins: ['http://localhost:3000', 'http://192.168.1.102']
    }
  }
  
  module.exports = nextConfig
  