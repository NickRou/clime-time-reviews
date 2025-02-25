import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'td1axthw5f.ufs.sh',
        pathname: '/f/*',
      },
    ],
  },
  // experimental: {
  //   serverComponentsHmrCache: false, // defaults to true
  // },
}

export default nextConfig
