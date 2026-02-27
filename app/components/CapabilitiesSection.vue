<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { useTextAnimation } from "@/composables/useTextAnimation";

type Capability = {
  number: string;
  title: string;
  services: string[];
};

const capabilities: Capability[] = [
  {
    number: "01",
    title: "STRATEGY",
    services: [
      "Strategy Data",
      "Analytics",
      "Discovery & Research",
      "User Experience",
      "Brand Strategy",
      "Marketing Campaigns"
    ]
  },
  {
    number: "02",
    title: "CONTENT",
    services: [
      "Content Production",
      "Creative Direction",
      "Photography",
      "Video & Motion",
      "Copywriting",
      "Social Strategy"
    ]
  },
  {
    number: "03",
    title: "PROMOTION",
    services: [
      "Influencer Partnerships",
      "Paid Social",
      "Community Activation",
      "Event Marketing",
      "PR & Media",
      "Campaign Reporting"
    ]
  }
];

const sectionRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
let stopObserver: (() => void) | null = null;
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

// Apply GSAP animation to services
useTextAnimation(".capability-service");

onMounted(() => {
  const { stop } = useIntersectionObserver(
    sectionRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting) isVisible.value = true;
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
    id="section-capabilities"
    ref="sectionRef"
    class="bg-black text-white"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="mx-auto max-w-[110rem] px-6 py-20 lg:px-10 lg:py-28">
      <div class="flex flex-col gap-6">
        <div class="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.36em] text-accent/80">
          <span class="h-px w-10 bg-accent/80" />
          <span>02 — CAPABILITIES</span>
        </div>
      </div>

      <div class="mt-12 grid gap-10 lg:grid-cols-3">
        <article
          v-for="(capability, index) in capabilities"
          :key="capability.number"
          class="cap-card group min-h-[28rem] border border-light/10 bg-light/5 p-10 transition"
          :style="{ '--delay': `${index * 120}ms` }"
          @mousemove="handleCardMove"
          @mouseleave="handleCardLeave"
        >
          <span class="opacity-15 pointer-events-none absolute right-2 top-2 sm:right-6 sm:top-4 text-4xl sm:text-[5rem] font-semibold tracking-[0.08em] text-light/10">
            {{ capability.number }}
          </span>
          <div class="space-y-4">
            <div class="space-y-3">
              <p class="text-3xl font-semibold uppercase tracking-tight text-white">{{ capability.title }}</p>
              <span class="block h-0.5 w-12 origin-left scale-x-[0.4] bg-accent/85 transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </div>
          </div>

          <ul class="mt-6 space-y-3 text-base uppercase tracking-[0.08em] text-light-70">
            <li v-for="service in capability.services" :key="service" class="flex gap-2">
              <span class="mt-2 h-1.5 w-1.5 rounded-sm bg-accent/90 transition-transform transition-shadow duration-300 group-hover:scale-[1.1] group-hover:shadow-[0_0_12px_rgba(255,196,70,0.75)]" />
              <span class="capability-service">{{ service }}</span>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cap-card {
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: var(--delay, 0ms);
}

.cap-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    700px circle at var(--glow-x, 30%) var(--glow-y, 30%),
    rgba(var(--color-accent-glow-rgb), 0.22),
    rgba(var(--color-accent-glow-rgb), 0.04) 45%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  filter: blur(18px);
  pointer-events: none;
}

.cap-card:hover::before {
  opacity: 1;
}

.cap-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(0, 0, 0, 0.2));
  pointer-events: none;
}


.is-visible .cap-card {
  opacity: 1;
  transform: translateY(0);
}
</style>
