import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    target: "es2020",
    outDir: "dist",
    rollupOptions: {
      input: getToolEntries()
    }
  },
  test: {
    environment: "jsdom"
  }
});

function getToolEntries() {
  const toolsDir = resolve(process.cwd(), "tools");
  const entries = {};
  for (const name of readdirSync(toolsDir, { withFileTypes: true })) {
    if (!name.isDirectory()) continue;
    entries[name.name] = resolve(toolsDir, name.name, "index.html");
  }
  return entries;
}
