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
const glowStates = new WeakMap<HTMLElement, { x: number; y: number; tx: number; ty: number; raf: number | null }>();

const animateGlow = (target: HTMLElement) => {
  const state = glowStates.get(target);
  if (!state) return;

  const dx = state.tx - state.x;
  const dy = state.ty - state.y;
  state.x += dx * 0.12;
  state.y += dy * 0.12;
  target.style.setProperty("--glow-x", `${state.x}px`);
  target.style.setProperty("--glow-y", `${state.y}px`);

  if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
    state.raf = null;
    return;
  }

  state.raf = requestAnimationFrame(() => animateGlow(target));
};

const handleCardMove = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement | null;
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  let state = glowStates.get(target);
  if (!state) {
    state = { x, y, tx: x, ty: y, raf: null };
    glowStates.set(target, state);
  }
  state.tx = x;
  state.ty = y;
  if (state.raf === null) {
    state.raf = requestAnimationFrame(() => animateGlow(target));
  }
};

const handleCardLeave = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement | null;
  if (!target) return;
  const state = glowStates.get(target);
  if (state?.raf) cancelAnimationFrame(state.raf);
  glowStates.delete(target);
  target.style.removeProperty("--glow-x");
  target.style.removeProperty("--glow-y");
};

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
    <div class="mx-auto max-w-[110rem] px-6 py-20 lg:px-10 lg:py-28">
      <div class="flex flex-col gap-6">
        <div class="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.36em] text-amber-300/80">
          <span class="h-px w-10 bg-amber-300/80" />
          <span>03 — REACH & IMPACT</span>
        </div>
      </div>

      <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(stat, index) in stats"
          :key="stat.label"
          class="stat-card group flex flex-col items-center justify-center border border-white/10 bg-white/5 px-8 py-10 text-center"
          :class="{ 'stat-animate': isVisible }"
          :style="{ '--delay': `${index * 90}ms` }"
          @mousemove="handleCardMove"
          @mouseleave="handleCardLeave"
        >
          <p class="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            <span class="transition-colors duration-300 group-hover:text-amber-300">{{ animatedValues[index] }}</span>
            <span class="text-amber-300 transition-colors duration-300 group-hover:text-white">{{ stat.suffix }}</span>
          </p>
          <p class="mt-4 text-xs uppercase tracking-[0.32em] text-white/50">
            {{ stat.label }}
          </p>
        </div>
      </div>

      <p class="mt-12 text-[11px] uppercase tracking-[0.35em] text-white/45">
        Delivering real impressive results through data led strategies
      </p>
    </div>
  </section>
</template>

<style scoped>
.stat-card {
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(22px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  will-change: opacity, transform;
}

.stat-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    700px circle at var(--glow-x, 30%) var(--glow-y, 30%),
    rgba(255, 196, 70, 0.2),
    rgba(255, 196, 70, 0.04) 45%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  filter: blur(18px);
  pointer-events: none;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(0, 0, 0, 0.25));
  pointer-events: none;
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
