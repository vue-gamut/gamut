import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "test/", "dist/", "**/*.d.ts"],
    },
  },
  resolve: {
    alias: {
      "@vue-types/shared": path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "../@vue-types/shared/src/index.d.ts"
      ),
      "@vue-types/collections": path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "../@vue-types/collections/src/index.d.ts"
      ),
      "@vue-reactively/collections": path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "../@vue-reactively/collections/src"
      ),
    },
  },
});
