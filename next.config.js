/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_INSEE_API_KEY: process.env.INSEE_API_KEY,
  },

  // Optimisations de performance
  experimental: {
    // Optimiser le cache des modules
    optimizeCss: true,
    // Améliorer les performances de compilation
    swcMinify: true,
  },

  // Configuration webpack optimisée
  webpack: (config, { dev, isServer }) => {
    // Exclure jsPDF du bundle serveur
    if (isServer) {
      config.externals = config.externals || []
      if (Array.isArray(config.externals)) {
        config.externals.push({
          'jspdf': 'commonjs jspdf',
          'jspdf-autotable': 'commonjs jspdf-autotable',
        })
      } else {
        // Si config.externals est un objet, le convertir en array
        config.externals = [
          config.externals,
          {
            'jspdf': 'commonjs jspdf',
            'jspdf-autotable': 'commonjs jspdf-autotable',
          }
        ]
      }
    }

    // Résoudre l'erreur 'self is not defined' en production
    if (!dev && isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        canvas: false,
      }
    }

    // Optimiser le watch en développement
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300,
        ignored: [
          '**/node_modules/**',
          '**/.next/**',
          '**/coverage/**',
          '**/dist/**',
          '**/build/**',
        ],
      }
    }

    // Optimiser le cache webpack
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    }

    // Optimiser les chunks
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      }
    }

    return config
  },

  // Optimiser les images
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Optimiser les headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
