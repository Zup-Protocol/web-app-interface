/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**"],
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 95,
        statements: 95,
      },
      exclude: [
        "node_modules/**",
        "dist/**",
        "src/env.d.ts",
        "**/*.test.tsx",
        "**/*.test.ts",
        "src/setupTests.ts",
        "**/*.config.*",
        "**/*.astro",
        "src/providers/**",
        "tests/**",
        "**/*.d.ts",
        ".agent/**",
      ],
    },
  },
});
