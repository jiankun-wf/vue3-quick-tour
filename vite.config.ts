import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  build: {
    lib: {
      entry: "package/index.ts",
      fileName(format) {
        return `index.${format}.js`;
      },
      name: "quick-tour",
      formats: ["cjs", "es", "umd"],
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
    outDir: "dist",
  },
});
