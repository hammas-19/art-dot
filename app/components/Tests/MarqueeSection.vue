<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { useTextAnimation } from "@/composables/useTextAnimation";

const countries = [
  "UNITED KINGDOM",
  "UNITED STATES",
  "CANADA",
  "GERMANY",
  "FRANCE",
  "ITALY",
  "SPAIN",
  "NIGERIA",
  "JAPAN",
  "SOUTH KOREA",
  "UNITED ARAB EMIRATES",
  "AUSTRALIA"
];

const sectionRef = ref<HTMLElement | null>(null);
const rowPrimaryRef = ref<HTMLElement | null>(null);
const rowSecondaryRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const primaryX = ref(0);
const secondaryX = ref(0);
let stopObserver: (() => void) | null = null;
let rafId: number | null = null;

const wrapOffset = (value: number, width: number) => {
  if (width <= 0) return 0;
  const mod = value % width;
  return mod < 0 ? mod + width : mod;
};

const getCycleWidth = (row: HTMLElement) => {
  const gap = Number.parseFloat(getComputedStyle(row).columnGap || "0");
  return row.scrollWidth / 2 + gap / 2;
};

const updateMarqueeOnScroll = () => {
  if (!rowPrimaryRef.value || !rowSecondaryRef.value) return;

  const base = window.scrollY * 0.35;
  const primaryWidth = getCycleWidth(rowPrimaryRef.value);
  const secondaryWidth = getCycleWidth(rowSecondaryRef.value);

  const primaryOffset = -wrapOffset(base, primaryWidth);
  const secondaryOffset = -wrapOffset(-base * 0.8, secondaryWidth);

  primaryX.value = primaryOffset;
  secondaryX.value = secondaryOffset;
};

const handleScroll = () => {
  if (!isVisible.value) return;
  if (rafId !== null) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(updateMarqueeOnScroll);
};

// Apply GSAP text animation
useTextAnimation(".marquee-heading");

onMounted(() => {
  const { stop } = useIntersectionObserver(
    sectionRef,
    ([entry]) => {
      if (entry?.isIntersecting) {
        isVisible.value = true;
        updateMarqueeOnScroll();
      }
    },
    { threshold: 0.2 }
  );
  stopObserver = stop;

  updateMarqueeOnScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", updateMarqueeOnScroll);
});

onUnmounted(() => {
  stopObserver?.();
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", updateMarqueeOnScroll);
  if (rafId !== null) cancelAnimationFrame(rafId);
});
</script>

<template>
  <section
    id="section-marquee"
    ref="sectionRef"
    class="bg-black text-white"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="px-0 py-20 lg:py-28">
      <div class="mx-auto max-w-[110rem] px-6 lg:px-16 space-y-4">
         <p class="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-accent">
          Our Business Experience
        </p>
        <h2 class="marquee-heading text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          We turn local businesses into <span class="text-accent">brands people follow</span>.
        </h2>
      </div>

      <div class="mt-10 space-y-6">
        <div class="marquee-track">
          <div
            ref="rowPrimaryRef"
            class="marquee-row"
            :style="{ transform: `translate3d(${primaryX}px, 0, 0)` }"
          >
            <span v-for="country in countries" :key="country" class="marquee-item">
              {{ country }}
            </span>
            <span v-for="country in countries" :key="`${country}-dup`" class="marquee-item">
              {{ country }}
            </span>
          </div>
        </div>
        <div class="marquee-track">
          <div
            ref="rowSecondaryRef"
            class="marquee-row reverse"
            :style="{ transform: `translate3d(${secondaryX}px, 0, 0)` }"
          >
            <span v-for="country in countries" :key="`${country}-row2`" class="marquee-item">
              {{ country }}
            </span>
            <span v-for="country in countries" :key="`${country}-row2-dup`" class="marquee-item">
              {{ country }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marquee-track {
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.marquee-row {
  display: flex;
  gap: 3rem;
  padding: 1.5rem 0;
  will-change: transform;
}

.marquee-row.reverse {
  animation-direction: reverse;
}

.marquee-item {
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
}

</style>
