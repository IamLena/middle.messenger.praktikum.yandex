import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: 'src/index.html',
        login: 'src/pages/login/index.html',
        register: 'src/pages/register/index.html',
        profile: 'src/pages/profile/index.html',
        chats: 'src/pages/chats/index.html',
        notFound: 'src/pages/notFound/index.html',
        fatal: 'src/pages/fatal/index.html',
      },
    },
  },
  server: { port: 3000 },
  preview: { port: 3000 },
  css: {
    modules: {
      localsConvention: 'camelCase', // Ensures class names are camelCase in JS
    },
  },
});
