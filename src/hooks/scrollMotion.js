// Shared parallax-reveal curve driven by useScrollProgress's 0-1 value:
// title slides up + fades in as a section enters, holds while filling the
// viewport, then continues sliding up + fading out as it exits.
export function titleMotion(progress, distance = 70) {
  const translateY = (0.5 - progress) * distance
  const opacity =
    progress < 0.15 ? progress / 0.15
    : progress > 0.85 ? (1 - progress) / 0.15
    : 1
  return { transform: `translateY(${translateY}px)`, opacity }
}
