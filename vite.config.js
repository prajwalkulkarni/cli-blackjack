import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: "index.js",
      },
      output: {
        dir: ".",
        entryFileNames: "bin.js",
        format: "cjs",
      },
    },
  },
});
