import { BuildOptions } from "vite";
import { defineConfig, UserConfigExport } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  plugins: [vue(), vueJsx()],
  build: {
    lib: {
      entry: "package/index.ts",
      fileName: () => "index.js",
      name: "quick-tour",
      formats: ["cjs"],
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
    outDir: "release/lib",
  },
});
