// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import {nodePolyfills} from 'vite-plugin-node-polyfills'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        signup: resolve(__dirname, "src/pages/signup.html"),
        login: resolve(__dirname, "src/pages/login.html"),
      },
    },
    plugins: [
      nodePolyfills({
        // To exclude specific polyfills, add them to this list.
        exclude: [
          "fs", // Excludes the polyfill for `fs` and `node:fs`.
        ],
        // Whether to polyfill specific globals.
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
          global: true,
          process: true,
        },
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true,
      }),
    ],
    outDir: "dist",
  },
});
