// model-viewer only ever imports this if something asks it to load a Lottie
// (animated .json) texture — this app has no such assets, so the real loader
// (which itself hardcodes an `import` from cdn.jsdelivr.net, even vendored
// locally — see vendor/README.md) is never needed. This empty stand-in just
// keeps that code path from ever reaching out to a CDN if it's ever
// accidentally triggered.
export class LottieLoader {}
