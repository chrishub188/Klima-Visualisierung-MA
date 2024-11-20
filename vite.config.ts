import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    watch: {
      // Don't watch image files to reduce file handles
      ignored: ['**/*.{png,svg}', '**/static/images/**'],
      usePolling: false,
      followSymlinks: false,
      interval: 1000,
    },
  }
});
