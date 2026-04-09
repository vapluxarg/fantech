/**
 * Next.js configuration optimized for Vercel's build/runtime pipeline.
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'http2.mlstatic.com' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: `${process.env.NEXT_PUBLIC_VAPLUX_URL}/admin?store=fantech`,
        permanent: false,
      },
    ]
  },
};

module.exports = nextConfig;
