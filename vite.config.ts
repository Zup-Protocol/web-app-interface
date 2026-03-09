/// <reference types="vitest" />
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackRouter({
      target: "react",
      routeFileIgnorePattern: ".*\\.(test|spec)\\.(js|ts|jsx|tsx)$",
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  envPrefix: ["VITE_", "PUBLIC_"],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**"],
      exclude: [
        "node_modules/**",
        "src/core/types/**",
        "src/components/ui/icons/**",
        "src/**/*.dto.ts",
        "src/**/*.interface.ts",
        "src/main.tsx",
        "src/vite-env.d.ts",
        "src/setupTests.ts",
        "src/routeTree.gen.ts",
        "src/providers/**",
      ],
      thresholds: {
        lines: 95,
        functions: 95,
        statements: 95,
        branches: 95,
      },
    },
  },
});
