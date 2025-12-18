import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "b0f3713b-8529-405f-9355-6dcc12b6e7fd-00-263pxhsc8m6nb.pike.replit.dev"
    ]
  }
});