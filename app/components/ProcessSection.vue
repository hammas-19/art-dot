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
    <div class="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-32">
      <div class="flex flex-col gap-10 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-4">
          <div class="flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-amber-300">
            <span class="inline-block h-px w-8 bg-amber-300/70" />
            05 — Methodology
          </div>
          <h2 class="text-4xl font-semibold tracking-tight sm:text-5xl">
            <span class="text-white">Our</span>
            <span class="text-amber-300"> Process</span>
          </h2>
        </div>
        <p class="max-w-sm text-xs uppercase tracking-[0.4em] text-white/50 lg:text-right">
          A strategic framework for scalable growth.
        </p>
      </div>

      <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(step, index) in steps"
          :key="step.id"
          class="process-card group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 transition-all duration-500 hover:border-amber-300/40 hover:bg-gradient-to-br hover:from-amber-300/10 hover:to-transparent"
          :style="{ '--delay': `${index * 90}ms` }"
        >
          <div class="absolute right-6 top-6 text-6xl font-bold text-amber-300/5 transition-all duration-500 group-hover:text-amber-300/10">
            {{ step.number }}
          </div>

          <div class="hover-indicator">
            <span class="indicator-dot" />
          </div>

          <div class="relative space-y-4">
            <div class="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300/80 transition-colors duration-300 group-hover:text-amber-300">
              {{ step.number }}
            </div>
            <h3 class="text-xl font-semibold uppercase leading-tight tracking-tight transition-colors duration-300 group-hover:text-amber-300">
              {{ step.title }}
            </h3>
            <p class="text-sm leading-relaxed text-white/60 transition-colors duration-300 group-hover:text-white/80">
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
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease, border-color 0.5s ease, background 0.5s ease;
  transition-delay: var(--delay, 0ms);
}

.is-visible .process-card {
  opacity: 1;
  transform: translateY(0);
}

.hover-indicator {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 2px solid rgba(251, 191, 36, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.process-card:hover .hover-indicator {
  opacity: 1;
  transform: scale(1);
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgb(251, 191, 36);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
