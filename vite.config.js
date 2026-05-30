import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/operator-svobody/",
  plugins: [react()],
});