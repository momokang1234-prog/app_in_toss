import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://cert.toss.im",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api/v2"),
      },
    },
  },
});
