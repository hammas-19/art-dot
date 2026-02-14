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
    <div class="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-32">
      <div class="flex flex-col items-start gap-6">
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
          07 — Value Proposition
        </p>
        <h2 class="text-4xl font-semibold tracking-tight sm:text-5xl">
          <span class="text-white">Why Partner</span>
          <span class="text-amber-300"> With Us?</span>
        </h2>
      </div>

      <div class="mt-12 grid gap-6 lg:grid-cols-3">
        <article
          v-for="(item, index) in values"
          :key="item.id"
          class="value-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6"
          :style="{ '--delay': `${index * 90}ms` }"
        >
          <div class="icon-box">
            <span class="text-lg">{{ item.icon }}</span>
          </div>
          <h3 class="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
            {{ item.title }}
          </h3>
          <p class="mt-3 text-sm text-white/60">
            {{ item.description }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.value-card {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease, border-color 0.4s ease, background 0.4s ease;
  transition-delay: var(--delay, 0ms);
}

.is-visible .value-card {
  opacity: 1;
  transform: translateY(0);
}

.value-card:hover {
  border-color: rgba(251, 191, 36, 0.5);
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.16), rgba(0, 0, 0, 0.2));
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
