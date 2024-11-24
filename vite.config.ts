import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    // Disable fast refresh in production
    fastRefresh: process.env.NODE_ENV !== 'production',
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    strictPort: false,
    hmr: {
      overlay: true,
      timeout: 30000
    }
  },
  build: {
    // Improve build performance
    target: 'esnext',
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('react')) return 'react-vendor';
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'firebase/app', 'firebase/auth', 'firebase/firestore'],
    exclude: []
  }
})
