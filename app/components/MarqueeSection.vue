<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

const brands = [
  "AXEL ARIGATO",
  "SIEMATIC",
  "CARSICKO",
  "SOUTHWEST",
  "SIX",
  "YOYOSO"
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

const updateMarqueeOnScroll = () => {
  if (!rowPrimaryRef.value || !rowSecondaryRef.value) return;

  const base = window.scrollY * 0.35;
  const primaryWidth = rowPrimaryRef.value.scrollWidth / 2;
  const secondaryWidth = rowSecondaryRef.value.scrollWidth / 2;

  const primaryOffset = -wrapOffset(base, primaryWidth);
  const secondaryOffset = -wrapOffset(-base * 0.8, secondaryWidth);

  primaryX.value = primaryOffset;
  secondaryX.value = secondaryOffset;
};

const handleScroll = () => {
  if (!isVisible.value) return;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(updateMarqueeOnScroll);
};

onMounted(() => {
  const { stop } = useIntersectionObserver(
    sectionRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
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
  if (rafId) cancelAnimationFrame(rafId);
});
</script>

<template>
  <section
    id="section-marquee"
    ref="sectionRef"
    class="bg-black text-white"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <div class="max-w-3xl space-y-4">
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
          Our Marketing Experience
        </p>
        <h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">
          We have extensive experience growing brands.
        </h2>
      </div>

      <div class="mt-10 space-y-6">
        <div class="marquee-track">
          <div
            ref="rowPrimaryRef"
            class="marquee-row"
            :style="{ transform: `translate3d(${primaryX}px, 0, 0)` }"
          >
            <span v-for="brand in brands" :key="brand" class="marquee-item">
              {{ brand }}
            </span>
            <span v-for="brand in brands" :key="`${brand}-dup`" class="marquee-item">
              {{ brand }}
            </span>
          </div>
        </div>
        <div class="marquee-track">
          <div
            ref="rowSecondaryRef"
            class="marquee-row reverse"
            :style="{ transform: `translate3d(${secondaryX}px, 0, 0)` }"
          >
            <span v-for="brand in brands" :key="`${brand}-row2`" class="marquee-item">
              {{ brand }}
            </span>
            <span v-for="brand in brands" :key="`${brand}-row2-dup`" class="marquee-item">
              {{ brand }}
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
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
}

</style>
