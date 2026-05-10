import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/projeto-one-piece-react/',
  plugins: [react()],
});

