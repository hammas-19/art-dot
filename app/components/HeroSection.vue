<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useTextAnimation } from "@/composables/useTextAnimation";

const sectionRef = ref<HTMLElement | null>(null);
const heroVisible = ref(false);
const parallaxY = ref(0);
let rafId: number | null = null;

// Apply GSAP text animations
useTextAnimation(".hero-heading");
useTextAnimation(".hero-subtitle");

const updateParallaxOnScroll = () => {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    parallaxY.value = window.scrollY * 0.12;
  });
};

const scrollToExplore = () => {
  const aboutSection = document.getElementById("section-about");
  aboutSection?.scrollIntoView({ behavior: "smooth" });
};

onMounted(() => {
  heroVisible.value = true;
  updateParallaxOnScroll();
  window.addEventListener("scroll", updateParallaxOnScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateParallaxOnScroll);
  if (rafId) cancelAnimationFrame(rafId);
});
</script>

<template>
  <section
    id="section-hero"
    ref="sectionRef"
    class="relative min-h-screen bg-linear-to-t from-[#000000] via-[#1a1a1a] to-[#2a2a2a] text-white overflow-hidden"
    :class="{ 'is-visible': heroVisible }"
  >
    <!-- Layer 0: interactive circle grid (sits at the very back) -->
    <InteractiveCircleGridBg class="absolute inset-0 z-0" />



    <!-- Layer 2: main content — pointer-events-none on wrapper, re-enabled on interactive children -->
    <div
      class="pointer-events-none relative z-20 mx-auto flex min-h-screen max-w-[110rem] flex-col px-6 py-16 lg:px-10 items-center justify-center"
      :style="{ transform: `translate3d(0, ${parallaxY * 0.2}px, 0)` }"
    >
      <div class="flex-1 flex flex-col items-center justify-center text-center space-y-8 w-full">
        <h1 class="hero-heading fade-in text-5xl  sm:text-6xl lg:text-7xl" style="transition-delay: 100ms">
          Culture moves faster <br> than your <span class="text-accent">strategy.</span>
        </h1>
        <p class="hero-subtitle fade-in max-w-3xl text-lg font-thin uppercase text-light-70 sm:text-xl lg:text-xl" style="transition-delay: 160ms">
          We bridge the gap between brands and the generation that drives them. No fluff. Just impact.
        </p>
        <div class="fade-in flex flex-wrap gap-4 justify-center" style="transition-delay: 220ms">
          <a
            href="#pricing"
            class="pointer-events-auto inline-flex items-center justify-center gap-1 sm:gap-2 border border-white/30 px-4 py-2 sm:px-8 sm:py-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.35em] transition-all duration-500 hover:text-black hover:bg-[#d0fc4d] rounded-full whitespace-nowrap"
          >
            Start a Project <span>→</span>
          </a>
        </div>
      </div>

      <div class="w-full flex flex-col items-center gap-8 sm:gap-12 pb-6 sm:pb-8">
        <button
          class="pointer-events-auto fade-in flex items-center gap-2 sm:gap-3 text-xs sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-light-60 transition hover:text-white px-3 py-2 sm:px-0 sm:py-0"
          style="transition-delay: 280ms"
          @click="scrollToExplore"
        >
          ( Scroll to Explore )
        </button>

        <nav class="fade-in flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-xs sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-light-60 w-full px-2 sm:px-0" style="transition-delay: 340ms">
          <button class="pointer-events-auto flex items-center gap-1 sm:gap-2 hover:text-white transition whitespace-nowrap w-full sm:w-auto justify-center">
            <span class="text-white">•</span>01 About Us
          </button>
          <button class="pointer-events-auto flex items-center gap-1 sm:gap-2 hover:text-white transition whitespace-nowrap w-full sm:w-auto justify-center">
            <span>•</span>02 Capabilities
          </button>
          <button class="pointer-events-auto flex items-center gap-1 sm:gap-2 hover:text-white transition whitespace-nowrap w-full sm:w-auto justify-center">
            <span>•</span>03 Reach & Impact
          </button>
          <button class="pointer-events-auto flex items-center gap-1 sm:gap-2 hover:text-white transition whitespace-nowrap w-full sm:w-auto justify-center">
            <span>•</span>04 Our Process
          </button>
        </nav>
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