<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

type ValuePoint = {
  id: number;
  title: string;
  description: string;
  icon: string;
};

const values: ValuePoint[] = [
  {
    id: 1,
    title: "Hard-to-Reach Audience",
    description: "Access to a hard-to-reach youth / Gen Z / BAME audience.",
    icon: "✦"
  },
  {
    id: 2,
    title: "Guaranteed Visibility",
    description: "Guaranteed on-site footfall and high-impact visibility.",
    icon: "◎"
  },
  {
    id: 3,
    title: "Co-created Activations",
    description: "Co-created brand activations across streetwear, salon, music, and food.",
    icon: "▢"
  },
  {
    id: 4,
    title: "Media Attention",
    description: "Hyper-local + national media attention for your brand.",
    icon: "◐"
  },
  {
    id: 5,
    title: "Influencer Coverage",
    description: "Real-time influencer-led coverage during events.",
    icon: "◈"
  },
  {
    id: 6,
    title: "Viral Social Moments",
    description: "Viral social moments crafted specifically for Instagram & TikTok.",
    icon: "◇"
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
    id="section-value"
    ref="sectionRef"
    class="bg-black text-white"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="mx-auto max-w-[110rem] px-6 py-20 lg:px-10 lg:py-28">
      <div class="flex flex-col items-start gap-6">
        <p class="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-amber-300">
          07 — Value Proposition
        </p>
        <h2 class="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          <span class="text-white">Why Partner</span>
          <span class="text-amber-300"> With Us?</span>
        </h2>
      </div>

      <div class="mt-12 grid gap-6 lg:grid-cols-3">
        <article
          v-for="(item, index) in values"
          :key="item.id"
          class="value-card group relative overflow-hidden border border-white/10 bg-white/5 p-10 transition"
          :style="{ '--delay': `${index * 90}ms` }"
          @mousemove="handleCardMove"
          @mouseleave="handleCardLeave"
        >
          <div class="icon-box">
            <span class="text-lg">{{ item.icon }}</span>
          </div>
          <h3 class="mt-6 text-lg font-semibold uppercase tracking-[0.3em] text-white/80 lg:text-xl">
            {{ item.title }}
          </h3>
          <p class="mt-3 text-base text-white/60">
            {{ item.description }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.value-card {
  position: relative;
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: var(--delay, 0ms);
}

.value-card::before {
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

.value-card:hover::before {
  opacity: 1;
}

.value-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(0, 0, 0, 0.2));
  pointer-events: none;
}

.is-visible .value-card {
  opacity: 1;
  transform: translateY(0);
}

.icon-box {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(251, 191, 36, 0.9);
  background: rgba(255, 255, 255, 0.04);
}
</style>
