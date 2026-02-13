<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

const counter = ref(0);
const counterTarget = 7;
const counterDurationMs = 900;
const sectionRef = ref<HTMLElement | null>(null);
const heroVisible = ref(false);
const parallaxY = ref(0);
let rafId: number | null = null;
let stopObserver: (() => void) | null = null;

const updateParallaxOnScroll = () => {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    parallaxY.value = window.scrollY * 0.18;
  });
};

const animateCounter = () => {
  const start = performance.now();

  const tick = (now: number) => {
    const progress = Math.min((now - start) / counterDurationMs, 1);
    counter.value = Math.round(progress * counterTarget);
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const scrollToExplore = () => {
  const next = document.getElementById("section-about");
  if (next) {
    next.scrollIntoView({ behavior: "smooth" });
  } else {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  }
};

onMounted(() => {
  animateCounter();
  const { stop } = useIntersectionObserver(
    sectionRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting) heroVisible.value = true;
    },
    { threshold: 0.2 }
  );
  stopObserver = stop;

  updateParallaxOnScroll();
  window.addEventListener("scroll", updateParallaxOnScroll, { passive: true });
});

onUnmounted(() => {
  stopObserver?.();
  window.removeEventListener("scroll", updateParallaxOnScroll);
  if (rafId) cancelAnimationFrame(rafId);
});
</script>

<template>
  <section
    id="section-hero"
    ref="sectionRef"
    class="relative min-h-screen bg-black text-white overflow-hidden"
    :class="{ 'is-visible': heroVisible }"
  >
    <div class="pointer-events-none absolute inset-0">
      <div
        class="absolute -top-24 left-1/2 h-[38rem] w-[38rem] rounded-full bg-white/5 blur-3xl"
        :style="{
          transform: `translate3d(-50%, ${parallaxY * 0.6}px, 0)`
        }"
      />
      <div
        class="absolute -bottom-28 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-white/5 blur-3xl"
        :style="{
          transform: `translate3d(0, ${-parallaxY * 0.4}px, 0)`
        }"
      />
    </div>

    <div class="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-16 lg:px-10">
      <div class="flex items-start justify-between">
        <div class="space-y-3">
          <p class="hero-fade text-5xl font-semibold tracking-tight" style="transition-delay: 80ms">
            {{ counter }}
          </p>
          <p class="hero-fade text-lg font-semibold uppercase tracking-widest" style="transition-delay: 140ms">
            art.
          </p>
        </div>

        <div class="hero-fade hidden lg:flex flex-col gap-3 text-xs uppercase tracking-[0.3em] text-white/60" style="transition-delay: 180ms">
          <button class="group flex items-center gap-2 text-left">
            <span class="text-white">•</span>01 About Us
          </button>
          <button class="group flex items-center gap-2 text-left">
            <span>•</span>02 Capabilities
          </button>
          <button class="group flex items-center gap-2 text-left">
            <span>•</span>03 Reach & Impact
          </button>
          <button class="group flex items-center gap-2 text-left">
            <span>•</span>04 Our Process
          </button>
        </div>
      </div>

      <div class="mt-auto grid gap-10 pt-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div class="max-w-3xl space-y-6">
          <h1 class="hero-fade text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl" style="transition-delay: 220ms">
            Culture moves faster than your strategy.
          </h1>
          <p class="hero-fade max-w-2xl text-base text-white/70 sm:text-lg" style="transition-delay: 280ms">
            We bridge the gap between brands and the generation that drives
            them. No fluff. Just impact.
          </p>
          <div class="hero-fade flex flex-wrap gap-4" style="transition-delay: 340ms">
            <a
              href="#pricing"
              class="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-widest transition hover:border-white"
            >
              Start a Project
            </a>
          </div>
        </div>

        <button
          class="hero-fade flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/60 transition hover:text-white"
          style="transition-delay: 380ms"
          @click="scrollToExplore"
        >
          ( Scroll to Explore )
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  background-image: radial-gradient(circle at top, rgba(255, 255, 255, 0.08), transparent 55%);
}

.hero-fade {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.is-visible .hero-fade {
  opacity: 1;
  transform: translateY(0);
}
</style>
