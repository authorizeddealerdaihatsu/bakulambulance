import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    tanstackStart({
      server: {
        preset: process.env.NITRO_PRESET ?? "vercel",
        entry: "server",
      },
    }),
    react(),
    tailwindcss(),
    tsConfigPaths(),
  ],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client'],
  },
});
