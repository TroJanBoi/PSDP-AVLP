/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'], // ✅ หรือ 'your-api-domain.com' ถ้า deploy แล้ว
  },
};

module.exports = nextConfig;
