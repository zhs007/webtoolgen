import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

export default defineConfig({
  base: "./",
  plugins: [viteSingleFile()],
  build: {
    target: "es2020",
    outDir: "dist",
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: {
      input: getToolEntries(),
      output: {
        manualChunks: undefined
      }
    }
  },
  test: {
    environment: "jsdom"
  }
});

function getToolEntries() {
  const toolsDir = resolve(__dirname, "tools");
  const entries: Record<string, string> = {};
  for (const name of readdirSync(toolsDir, { withFileTypes: true })) {
    if (!name.isDirectory()) continue;
    const htmlPath = resolve(toolsDir, name.name, "index.html");
    entries[name.name] = htmlPath;
  }
  return entries;
}
