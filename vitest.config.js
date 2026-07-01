import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./frontend/tests/setup.js'],
    include: ['frontend/tests/**/*.test.{js,jsx}', 'backend/tests/**/*.test.js'],
  },
});
