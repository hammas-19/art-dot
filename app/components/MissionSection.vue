<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

const denseText = ref(
  "WE CRAFT STRATEGIC, CREATIVE SOLUTIONS THAT COMBINE SMART IDEAS WITH STUNNING, FUNCTIONAL DESIGN. BY OBSESSING OVER THE DETAILS, WE INSPIRE ACTION AND DELIVER MEASURABLE RESULTS, EMPOWERING BRANDS TO THRIVE IN A DYNAMIC, EVER-EVOLVING MARKETPLACE."
);

const sectionRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const parallaxY = ref(0);
let rafId: number | null = null;
let stopObserver: (() => void) | null = null;

const updateParallaxOnScroll = () => {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    parallaxY.value = window.scrollY * 0.1;
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
    id="section-mission"
    ref="sectionRef"
    class="bg-black text-white"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="mx-auto max-w-[110rem] px-8 py-20 lg:px-16 lg:py-28">
      <div class="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start">
        <div
          class="space-y-6 lg:pr-12"
          :style="{ transform: `translate3d(0, ${-parallaxY * 0.18}px, 0)` }"
        >
          <p class="fade-in max-w-3xl text-lg font-light uppercase leading-[1.8] tracking-[0.12em] text-light-85 sm:text-xl lg:text-2xl" style="transition-delay: 200ms">
            {{ denseText }}
          </p>
        </div>

        <div class="space-y-4 text-right">
          <div class="fade-in flex items-center justify-end gap-4 text-[11px] font-medium uppercase tracking-[0.36em] text-light-50" style="transition-delay: 120ms">
            <span>02 — OUR MISSION</span>
            <span class="hidden h-px w-12 bg-white/25 lg:block" />
          </div>
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
