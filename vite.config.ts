import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
  },
  server: { port: '3000' },
  css: {
    modules: {
      localsConvention: 'camelCase', // Ensures class names are camelCase in JS
    },
  },
});
