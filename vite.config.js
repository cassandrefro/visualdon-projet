import { resolve } from "path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  root: "src",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        general: resolve(__dirname, "src/genreDeJeux.html"),
      },
    },
    outDir: "../dist",
    emptyOutDir: true,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          // copie fichiers csv
          src: "data/",
          dest: "../dist/",
        },
        {
          // copie fichiers csv
          src: "img/",
          dest: "../dist/",
        },
      ],
    }),
  ],
});
