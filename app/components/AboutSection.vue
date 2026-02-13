<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

const denseText = ref(
  "WE ARE A TEAM OF MIDLANDS BASED MARKETERS & ENTREPRENEURS WITH A COMBINED EXPERIENCE OF OVER 50 YEARS ELEVATING BRANDS FROM A CONCEPT TO A PROLIFIC NAME DELIVERING REAL IMPRESSIVE RESULTS."
);

const secondaryText = "Part of our art.quarter ecosystem";
const sectionRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const parallaxY = ref(0);
let rafId: number | null = null;
let stopObserver: (() => void) | null = null;

const updateParallaxOnScroll = () => {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    parallaxY.value = window.scrollY * 0.12;
  });
};

onMounted(() => {
  const { stop } = useIntersectionObserver(
    sectionRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting) isVisible.value = true;
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
    id="section-about"
    ref="sectionRef"
    class="bg-black text-white"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-32">
      <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start">
        <div class="space-y-4">
          <p class="fade-in text-xs font-semibold uppercase tracking-[0.35em] text-white/60" style="transition-delay: 80ms">
            01 — Who We Are
          </p>
          <p class="fade-in text-sm uppercase tracking-[0.3em] text-white/40" style="transition-delay: 140ms">
            ABOUT US
          </p>
        </div>

        <div
          class="space-y-6 lg:pl-12"
          :style="{ transform: `translate3d(0, ${-parallaxY * 0.2}px, 0)` }"
        >
          <p class="fade-in max-w-4xl break-all text-2xl font-semibold leading-snug text-white/90 sm:text-3xl lg:text-4xl" style="transition-delay: 200ms">
            {{ denseText }}
          </p>
          <p class="fade-in text-sm uppercase tracking-[0.3em] text-white/60" style="transition-delay: 260ms">
            {{ secondaryText }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-in {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.is-visible .fade-in {
  opacity: 1;
  transform: translateY(0);
}
</style>
