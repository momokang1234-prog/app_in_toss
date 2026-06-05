import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "toss-contract-app",
  brand: {
    displayName: "근로계약",
    primaryColor: "#3182F6",
    icon: "",
  },
  web: {
    host: "localhost",
    port: 5173,
    commands: {
      dev: "vite dev",
      build: "vite build",
    },
  },
  permissions: [],
  outdir: "dist",
});
