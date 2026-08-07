# Agentic Square

An interactive web presentation for the Agentic Square studio project, featuring a walkable 3D model.

## Live site

Deployed automatically by GitHub Actions every time changes are pushed to `main`, at whatever GitHub Pages URL is configured for this repo (Settings → Pages).

## Tech stack

- [Vite](https://vitejs.dev/) — dev server & build tool
- [React](https://react.dev/) — UI
- [Three.js](https://threejs.org/) / react-three-fiber — 3D model viewer

## Getting started (running it on your own computer)

1. Install [Node.js](https://nodejs.org/) (v20 or newer).
2. Install the project's dependencies:
   ```bash
   npm install
   ```
3. Start the local dev server:
   ```bash
   npm run dev
   ```
4. Open the URL it prints in your terminal (usually `http://localhost:5173/AGENTIC-SQUARE/`).

## Building for production

```bash
npm run build
```

This creates a `dist/` folder with the finished site — this is what GitHub Actions builds and publishes automatically, so you normally don't need to run it yourself.

## Project structure

- `src/` — React components and app logic
- `public/images/` — images, GIFs, and the 3D model (`.glb`) used by the site
- `public/fonts/` — the custom typeface used across the site

