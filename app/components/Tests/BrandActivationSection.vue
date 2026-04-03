<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { useTextAnimation } from "@/composables/useTextAnimation";

const sectionRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const eventsCount = ref("0+");
const attendeesCount = ref("0k+");
let stopObserver: (() => void) | null = null;
let hasAnimatedCounters = false;
const counterCancels: Array<() => void> = [];
const glowStates = new WeakMap<HTMLElement, { x: number; y: number; tx: number; ty: number; raf: number | null }>();

const animateCounter = (
  start: number,
  end: number,
  duration: number,
  onUpdate: (value: number) => void
) => {
  const startTime = performance.now();
  let rafId: number | null = null;

  const tick = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(start + (end - start) * eased);
    onUpdate(value);

    if (progress < 1) {
      rafId = requestAnimationFrame(tick);
    }
  };

  rafId = requestAnimationFrame(tick);

  return () => {
    if (rafId !== null) cancelAnimationFrame(rafId);
  };
};

const startCounterAnimations = () => {
  if (hasAnimatedCounters) return;
  hasAnimatedCounters = true;

  counterCancels.push(
    animateCounter(0, 15, 1400, (value) => {
      eventsCount.value = `${value}+`;
    })
  );

  counterCancels.push(
    animateCounter(0, 10, 1600, (value) => {
      attendeesCount.value = `${value}k+`;
    })
  );
};

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

// Apply GSAP text animation
useTextAnimation(".brand-activation-heading");

onMounted(() => {
  const { stop } = useIntersectionObserver(
    sectionRef,
    ([entry]) => {
      if (entry?.isIntersecting) {
        isVisible.value = true;
        startCounterAnimations();
      }
    },
    { threshold: 0.2 }
  );
  stopObserver = stop;
});

onUnmounted(() => {
  counterCancels.forEach((cancel) => cancel());
  counterCancels.length = 0;
  stopObserver?.();
});
</script>

<template>
  <section
    id="section-brand-activation"
    ref="sectionRef"
    class="bg-black text-white"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="mx-auto max-w-[120rem] px-6 py-20 lg:px-16 lg:py-28">
      <div class="grid border border-light/10 bg-light/5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)]">
        <div
          class="stat-card glow-card flex flex-col justify-center border-b border-light/10 px-8 py-12 lg:border-b-0 lg:border-r"
          @mousemove="handleCardMove"
          @mouseleave="handleCardLeave"
        >
          <p class="text-[11px] font-medium uppercase tracking-[0.36em] text-accent/80">
            Live Experiences
          </p>
          <h2 class="brand-activation-heading mt-6 text-4xl font-semibold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
            Brand
            <br />
            Creation
          </h2>
        </div>

        <div
          class="stat-card glow-card flex items-center border-b border-light/10 px-8 py-12 lg:border-b-0 lg:border-r"
          @mousemove="handleCardMove"
          @mouseleave="handleCardLeave"
        >
          <p class="text-lg font-light uppercase leading-relaxed tracking-[0.2em] text-light-70 sm:text-xl">
            This is a description of the brand activation services offered, highlighting the unique approach and successful outcomes achieved for clients.
          </p>
        </div>

        <div
          class="stat-card glow-card flex flex-col justify-center gap-10 px-8 py-12"
          @mousemove="handleCardMove"
          @mouseleave="handleCardLeave"
        >
          <div>
            <p class="text-5xl font-semibold text-accent sm:text-6xl">{{ eventsCount }}</p>
            <p class="mt-2 text-xs uppercase tracking-[0.3em] text-light-50">
              Projects Completed
            </p>
          </div>
          <div>
            <p class="text-5xl font-semibold text-accent sm:text-6xl">{{ attendeesCount }}</p>
            <p class="mt-2 text-xs uppercase tracking-[0.3em] text-light-50">
              Daily Revenue Generated
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stat-card {
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.glow-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    700px circle at var(--glow-x, 30%) var(--glow-y, 30%),
    rgba(var(--color-accent-glow-rgb), 0.2),
    rgba(var(--color-accent-glow-rgb), 0.04) 45%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  filter: blur(18px);
  pointer-events: none;
}

.glow-card:hover::before {
  opacity: 1;
}

.is-visible .stat-card {
  opacity: 1;
  transform: translateY(0);
}
</style>
