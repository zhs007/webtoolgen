# WebToolGen Template

Minimal example project for generating single-file browser tools.

## Requirements
- Node.js (for build step only)
- pnpm

## Scripts
- `pnpm dev` - local dev server
- `pnpm build` - output single HTML to `dist/`
- `pnpm preview` - preview the built HTML
- `pnpm test` - run Vitest

## Notes
- Runtime is browser-only (no Node APIs).
- Read input via `GET /files/data/<name>` and write output via `POST /upload/<name>`.
- UI uses Tailwind CDN + FontAwesome.

## Multi-Tool Structure
- Each tool lives in `tools/<tool-name>/index.html`.
- Tool logic lives in `src/tools/<tool-name>/main.ts`.
- Build output becomes `dist/<tool-name>/index.html`.
