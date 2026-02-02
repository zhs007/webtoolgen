# WebToolGen Template

This is a minimal, multi-tool template for building **single-page browser tools**.
It is designed so an agent can clone this repo and build new tools by following this README only.

## What this project is
- **Build-time** uses Node (Vite) to bundle TypeScript into a single HTML file per tool.
- **Run-time** is **browser-only** (no Node, no fs, no process).
- Each tool is a **single HTML file** that runs in a browser sandbox.

## Core runtime constraints (must follow)
- **No Node.js APIs at runtime**: no `require`, no `fs`, no `path`, no `process`.
- **File I/O via Host API only**:
  - Read: `GET /files/data/<filename>`
  - Write: `POST /upload/<filename>`
- **External libraries**: use **ES Modules** via `https://esm.sh/<pkg>@<version>`.
- **Single HTML output**: each tool must build to one standalone HTML file.

## UI rules (Tailwind edition)
Follow these UI rules in every tool HTML:
- Use **Tailwind CDN** and **FontAwesome** in `<head>`.
- No custom `<style>`; use Tailwind utility classes for everything.
- No `alert()`/`confirm()`; always show messages in a dedicated status area.
- Provide a primary button and show loading state during processing.

Minimal required head:
```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
</head>
```

## Repo structure (multi-tool)
Each tool has its own HTML + TypeScript + tests:
```
tools/
  example001/
    index.html
  example002/
    index.html
src/
  tools/
    example001/
      main.ts
      main.test.ts
    example002/
      main.ts
      main.test.ts
```
Build outputs:
```
dist/
  example001/
    index.html
  example002/
    index.html
```

## How to add a new tool
1) Create folders:
```
mkdir -p tools/<tool-name> src/tools/<tool-name>
```
2) Add `tools/<tool-name>/index.html`
   - Use the Tailwind + FontAwesome head.
   - Include a `#workspace`, a `#status`, and a `#btn-run`.
   - Load the TS module:
     ```html
     <script type="module" src="/src/tools/<tool-name>/main.ts"></script>
     ```
3) Add `src/tools/<tool-name>/main.ts`
   - Implement logic using browser APIs and the Host API.
4) (Optional) Add tests:
   - `src/tools/<tool-name>/main.test.ts`

Vite auto-detects `tools/*/index.html` and builds one HTML per tool.

## Runtime I/O contract (Host API)
Use `fetch` to read/write files:
```ts
// Read input file
const resp = await fetch("/files/data/input.csv");
if (!resp.ok) throw new Error("Input file not found");
const text = await resp.text();

// Write output file
const blob = new Blob([text.toUpperCase()], { type: "text/plain" });
const uploadResp = await fetch("/upload/output.txt", {
  method: "POST",
  body: blob
});
if (!uploadResp.ok) throw new Error("Upload failed");
```

## Library usage (ESM via esm.sh)
Use pinned versions:
```ts
import * as XLSX from "https://esm.sh/xlsx@0.18.5";
import JSZip from "https://esm.sh/jszip@3.10.1";
import { PDFDocument } from "https://esm.sh/pdf-lib@1.17.1";
```

## Interaction pattern
- For pure data processing: run automatically on load or on button click.
- For user choices: render data, wait for click, then upload result.
- Always update a visible status area (success/error/loading).

Example status helper:
```ts
function showStatus(el: HTMLElement, msg: string, type: "info" | "success" | "error") {
  const cls =
    type === "error"
      ? "bg-red-50 text-red-700"
      : type === "success"
      ? "bg-green-50 text-green-700"
      : "bg-blue-50 text-blue-700";
  el.className = `block p-4 rounded-lg ${cls}`;
  el.innerHTML = msg;
}
```

## Scripts
- `pnpm dev` - local dev server
- `pnpm build` - output single HTML per tool to `dist/`
- `pnpm preview` - preview built HTML
- `pnpm test` - run Vitest

## Notes for agents
- Runtime = browser sandbox only; do not use Node APIs in tool logic.
- Each tool is a single HTML output that must be self-contained.
- Use `tools/<tool-name>/index.html` + `src/tools/<tool-name>/main.ts` as the pattern.

## Build details (single-file per tool)
The build uses `vite-plugin-singlefile` and runs **one tool at a time** to avoid
Rollup's multi-input limitation with `inlineDynamicImports`.
Outputs are placed in `dist/<tool-name>/index.html`.
