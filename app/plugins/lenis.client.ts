import Lenis from "lenis";

export default defineNuxtPlugin(() => {
  if (typeof window === "undefined") return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const lenis = new Lenis({
    duration: 1.5,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    smoothWheel: true,
    smoothTouch: true,
    wheelMultiplier: 1.1,
    touchMultiplier: 1.25,
    lerp: 0.08
  });

  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };

  requestAnimationFrame(raf);

  return {
    provide: {
      lenis
    }
  };
});
