<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { useTextAnimation } from "@/composables/useTextAnimation";

const sectionRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
let stopObserver: (() => void) | null = null;

// Apply GSAP text animation
useTextAnimation(".cta-heading");

onMounted(() => {
  const { stop } = useIntersectionObserver(
    sectionRef,
    ([entry]) => {
      if (entry?.isIntersecting) isVisible.value = true;
    },
    { threshold: 0.2 }
  );
  stopObserver = stop;
});

onUnmounted(() => {
  stopObserver?.();
});
</script>

<template>
  <section
    id="section-cta"
    ref="sectionRef"
    class="relative overflow-hidden bg-black text-white"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="absolute inset-0 flex items-center opacity-40">
      <div class="marquee-track">
        <div class="marquee-row">
          <span v-for="index in 12" :key="`cta-${index}`" class="marquee-item">
            STUDIO30MARKETING
          </span>
        </div>
      </div>
    </div>

    <div class="relative mx-auto max-w-[110rem] px-6 py-24 lg:px-16 lg:py-32">
      <div class="flex flex-col items-center gap-6 text-center">
        <h2 class="cta-heading cta-fade text-4xl font-semibold uppercase tracking-tight sm:text-5xl lg:text-6xl">
          Seen Enough?
        </h2>
        <p class="cta-fade max-w-3xl text-sm uppercase tracking-[0.2em] text-light-60 sm:text-base">
          You've seen the Sections. You've seen the Colors. Now Let's Finalize the theme and start developing.
        </p>
        <div class="flex gap-5 flex-wrap mt-10">
          <a
            href=""
            class="pointer-events-auto inline-flex items-center justify-center gap-1 sm:gap-2 border border-light/30 px-4 py-2 sm:px-8 sm:py-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.35em] transition-all duration-500 hover:text-black hover:bg-accent rounded-full whitespace-nowrap"
            target="_self"
          >
            Start Development <span>→</span>
          </a>
          <a
            href=""
            class="pointer-events-auto inline-flex items-center justify-center gap-1 sm:gap-2 border border-accent bg-accent px-4 py-2 sm:px-8 sm:py-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.35em] text-black transition-all duration-500 hover:border-light/30 hover:bg-transparent hover:text-white rounded-full whitespace-nowrap"
            target="_self"
          >
            Add a Suggestion <span>→</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marquee-track {
  overflow: hidden;
}

.marquee-row {
  display: flex;
  gap: 3rem;
  padding: 1.5rem 0;
  animation: marquee 22s linear infinite;
}

.marquee-item {
  font-size: clamp(5rem, 16vw, 13rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  white-space: nowrap;
  color: rgba(189, 189, 189, 0.523);
}

.cta-fade {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.is-visible .cta-fade {
  opacity: 1;
  transform: translateY(0);
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
