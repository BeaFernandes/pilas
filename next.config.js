/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}
const withPWA = require('next-pwa')({
  dest: 'public'
})

module.exports = nextConfig 

module.exports = withPWA({
  // next.js config
})
