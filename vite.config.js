import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: "./src/webpage",
  test: {
    globals: true, // allows using describe(), it(), expect() globally
    environment: 'jsdom', // simulates a browser environment for React tests
    setupFiles: './webpage/setupTests.js', // this file runs before all tests
    css: true, // allows CSS imports during tests
  }
})
