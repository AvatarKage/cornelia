import { defineConfig } from "vite";

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  clearScreen: false,
  server: {
    port: 32312,
    strictPort: true,
    host: host || false,
    watch: {
      ignored: ["**/src-tauri/**", "**/dist/**"],
    },
  }
}));