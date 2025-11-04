// vite.config.js
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'SoftLink PWA Demo',
        short_name: 'SoftPWA',
        description: 'Offline-first post sharing app',
        theme_color: '#ffffff',
        icons: [
          { src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        swDest: '/sw.js', // Ensure the sw.js file is correctly placed in the public folder
        swSrc: '/src/sw.js', // Path to your sw.js file in the source folder
        importScripts: ['/src/sw.js'],  // This tells Vite to treat it as a module
      }
    })
  ]
});
