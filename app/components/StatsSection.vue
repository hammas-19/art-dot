<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

const stats = [
  { value: 15, suffix: "+", label: "Cultural Events" },
  { value: 10, suffix: "k", label: "Avg Influencer Reach" },
  { value: 82, suffix: "%", label: "Attendees Ages 18-30" },
  { value: 120, suffix: "+", label: "Influencer Engagements" },
  { value: 5, suffix: "k+", label: "Interactions / Event" },
  { value: 320, suffix: "k", label: "Total Footfall" },
  { value: 45, suffix: "M+", label: "Social Video Views" },
  { value: 18, suffix: "+", label: "National Features" },
  { value: 92, suffix: "%", label: "Sponsor Retention" }
];

const animatedValues = ref<number[]>(stats.map(() => 0));
const sectionRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
let stopObserver: (() => void) | null = null;
let rafId: number | null = null;

const animateValues = () => {
  const start = performance.now();
  const duration = 1400;

  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    animatedValues.value = stats.map((stat) => Math.round(stat.value * progress));
    if (progress < 1) rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);
};

onMounted(() => {
  const { stop } = useIntersectionObserver(
    sectionRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting && !isVisible.value) {
        isVisible.value = true;
        animateValues();
      }
    },
    { threshold: 0.2 }
  );
  stopObserver = stop;
});

onUnmounted(() => {
  stopObserver?.();
  if (rafId) cancelAnimationFrame(rafId);
});
</script>

<template>
  <section
    id="section-stats"
    ref="sectionRef"
    class="bg-black text-white"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-32">
      <div class="flex flex-col gap-6">
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
          03 — Reach & Impact
        </p>
        <h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">Reach & Impact</h2>
      </div>

      <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="(stat, index) in stats"
          :key="stat.label"
          class="stat-card rounded-2xl border border-white/10 bg-white/5 p-6"
          :class="{ 'stat-animate': isVisible }"
          :style="{ '--delay': `${index * 90}ms` }"
        >
          <p class="text-3xl font-semibold tracking-tight sm:text-4xl">
            {{ animatedValues[index] }}{{ stat.suffix }}
          </p>
          <p class="mt-2 text-xs uppercase tracking-[0.3em] text-white/60">
            {{ stat.label }}
          </p>
        </div>
      </div>

      <p class="mt-12 text-sm uppercase tracking-[0.35em] text-white/50">
        Delivering real impressive results through data led strategies
      </p>
    </div>
  </section>
</template>

<style scoped>
.stat-card {
  opacity: 0;
  transform: translateY(22px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  will-change: opacity, transform;
}

.stat-card.stat-animate {
  animation: statFadeUp 0.65s ease forwards;
  animation-delay: var(--delay, 0ms);
}

@keyframes statFadeUp {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
