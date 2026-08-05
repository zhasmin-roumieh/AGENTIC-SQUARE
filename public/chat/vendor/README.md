# Vendored third-party assets

Copied here (not loaded from a CDN) so the app has no dependency on any
server other than the one it's deployed on — everything must still work
with wifi off.

- `model-viewer.min.js` — `@google/model-viewer@4.3.1`, `dist/model-viewer.min.js`
- `qrcode.min.js` — bundled from `qrcode@1.5.4`'s browser entry (`lib/browser.js`) with esbuild, since that version's npm package doesn't ship a prebuilt browser global like the old CDN path did. Regenerate with:
  `esbuild node_modules/qrcode/lib/browser.js --bundle --minify --format=iife --global-name=QRCode --outfile=qrcode.min.js`
- `tabler-icons/` — `@tabler/icons-webfont@2.47.0` (`tabler-icons.min.css` + `fonts/`)
- `fonts/` — Inter, latin subset only, weights 500/600/700 normal + 500 italic (what this app actually uses), from `@fontsource/inter`
- `draco/`, `basis/` — Draco mesh decoder and Basis/KTX2 texture transcoder, copied from `three`'s `examples/jsm/libs/{draco/gltf,basis}/`. model-viewer defaults to fetching these from `gstatic.com`/`jsdelivr.net` at runtime; `index.html` overrides `window.ModelViewerElement.dracoDecoderLocation`/`ktx2TranscoderLocation` before loading it to point here instead. Our `.glb` files use Draco compression (`KHR_draco_mesh_compression`) so this one is load-bearing, not precautionary — without it the 3D models fail to decode with no network access. KTX2 isn't used by any current model but is vendored anyway so it can't silently reach out to a CDN if that changes.
- `lottie-stub.js` — a no-op stand-in for model-viewer's Lottie-texture loader, which we never use (no `.json` Lottie assets in this app). model-viewer's real default for this — even three.js's own vendored `LottieLoader.js` — hardcodes an `import` straight from `cdn.jsdelivr.net` for the `lottie-web` package, with no local option shipped anywhere. Rather than vendor that whole extra animation library for a feature this app doesn't use, `index.html` points `window.ModelViewerElement.lottieLoaderLocation` at this stub so that code path can never dial out, even if triggered by mistake.
