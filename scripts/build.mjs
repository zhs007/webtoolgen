import { readdirSync } from "node:fs";
import { mkdir, rename, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { build } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const root = process.cwd();
const toolsDir = resolve(root, "tools");
const distDir = resolve(root, "dist");
const toolNames = readdirSync(toolsDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

if (toolNames.length === 0) {
  throw new Error("No tools found in /tools");
}

await rm(distDir, { recursive: true, force: true });

let first = true;
for (const tool of toolNames) {
  const input = resolve(toolsDir, tool, "index.html");
  await build({
    root,
    configFile: false,
    base: "./",
    plugins: [viteSingleFile()],
    build: {
      target: "es2020",
      outDir: resolve(root, "dist", tool),
      emptyOutDir: first,
      assetsInlineLimit: 100000000,
      cssCodeSplit: false,
      rollupOptions: {
        input,
        output: {
          manualChunks: undefined
        }
      }
    }
  });
  await normalizeOutput(tool);
  first = false;
}

async function normalizeOutput(tool) {
  const toolDir = resolve(root, "dist", tool);
  const nested = resolve(toolDir, "tools", tool, "index.html");
  const target = resolve(toolDir, "index.html");
  await mkdir(toolDir, { recursive: true });
  await rename(nested, target);
  await rm(resolve(toolDir, "tools"), { recursive: true, force: true });
}
