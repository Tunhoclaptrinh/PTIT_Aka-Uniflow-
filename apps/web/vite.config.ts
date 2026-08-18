import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@uniflow/shared-types': path.resolve(__dirname, '../../packages/shared-types/src'),
      '@uniflow/udm-schema': path.resolve(__dirname, '../../packages/udm-schema/src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `@import "${path.resolve(__dirname, 'src/styles/variables.less')}";`,
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
