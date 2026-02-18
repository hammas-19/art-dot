<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

type ProcessStep = {
  id: number;
  number: string;
  title: string;
  description: string;
};

const steps: ProcessStep[] = [
  {
    id: 1,
    number: "01",
    title: "Market Analysis & Positioning",
    description:
      "In-depth research on UK consumer behaviour and retail trends to position YOYOSO's affordable lifestyle products effectively in the market."
  },
  {
    id: 2,
    number: "02",
    title: "Brand & Localisation Strategy Adaptation",
    description:
      "Refine YOYOSO's brand identity to resonate with UK consumers while maintaining its core values of trendy, quality products at accessible prices."
  },
  {
    id: 3,
    number: "03",
    title: "Omni-channel Marketing Campaign",
    description:
      "Develop and execute a comprehensive marketing strategy across digital, social, and traditional media to build brand awareness and drive foot traffic to new stores."
  },
  {
    id: 4,
    number: "04",
    title: "Influencer & Partnership Program",
    description:
      "Create a network of UK-based influencers and strategic partners to amplify YOYOSO's brand message and product range."
  },
  {
    id: 5,
    number: "05",
    title: "Localised Product Optimisation",
    description:
      "Continue adapting YOYOSO's product mix to suit UK tastes and trends, focusing on popular categories like digital accessories, beauty, and home décor to strengthen customer lifetime value."
  },
  {
    id: 6,
    number: "06",
    title: "Customer Experience Design",
    description:
      "Craft an engaging in-store and online experience that showcases YOYOSO's diverse product range and encourages repeat visits and purchases."
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
    id="section-process"
    ref="sectionRef"
    class="bg-black text-white"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="mx-auto max-w-[110rem] px-6 py-20 lg:px-10 lg:py-28">
      <div class="flex flex-col gap-10 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-4">
          <div class="flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-amber-300">
            <span class="inline-block h-px w-8 bg-amber-300/70" />
            05 — Methodology
          </div>
          <h2 class="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            <span class="text-white">Our</span>
            <span class="text-amber-300"> Process</span>
          </h2>
        </div>
        <p class="max-w-sm text-[0.75rem] uppercase tracking-[0.4em] text-white/50 lg:text-right">
          A strategic framework for scalable growth.
        </p>
      </div>

      <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(step, index) in steps"
          :key="step.id"
          class="process-card group relative overflow-hidden border border-white/10 bg-white/5 p-10 transition"
          :style="{ '--delay': `${index * 90}ms` }"
          @mousemove="handleCardMove"
          @mouseleave="handleCardLeave"
        >
          <div class="relative space-y-4">
            <div class="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300/80 transition-colors duration-300 group-hover:text-amber-300">
              {{ step.number }}
            </div>
            <h3 class="text-2xl font-semibold uppercase leading-tight tracking-tight transition-colors duration-300 group-hover:text-amber-300 lg:text-3xl">
              {{ step.title }}
            </h3>
            <p class="text-base leading-relaxed text-white/60 transition-colors duration-300 group-hover:text-white/80">
              {{ step.description }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.process-card {
  position: relative;
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: var(--delay, 0ms);
}

.process-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    700px circle at var(--glow-x, 30%) var(--glow-y, 30%),
    rgba(255, 196, 70, 0.22),
    rgba(255, 196, 70, 0.04) 45%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  filter: blur(18px);
  pointer-events: none;
}

.process-card:hover::before {
  opacity: 1;
}

.process-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(0, 0, 0, 0.2));
  pointer-events: none;
}

.is-visible .process-card {
  opacity: 1;
  transform: translateY(0);
}


</style>
