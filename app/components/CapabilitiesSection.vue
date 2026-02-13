<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

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
    <div class="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-32">
      <div class="flex flex-col gap-6">
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
          02 — Capabilities
        </p>
        <h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">Capabilities</h2>
      </div>

      <div class="mt-12 grid gap-6 lg:grid-cols-3">
        <article
          v-for="(capability, index) in capabilities"
          :key="capability.number"
          class="cap-card group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/30"
          :style="{ '--delay': `${index * 120}ms` }"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              {{ capability.number }}
            </span>
          </div>

          <div class="mt-6 space-y-2 text-2xl font-semibold tracking-tight">
            <p class="uppercase">{{ capability.title }}</p>
            <p class="uppercase text-white/40">{{ capability.title }}</p>
          </div>

          <ul class="mt-6 space-y-2 text-sm text-white/70">
            <li v-for="service in capability.services" :key="service" class="flex gap-2">
              <span class="text-white/40">•</span>
              <span>{{ service }}</span>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cap-card {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: var(--delay, 0ms);
}

.is-visible .cap-card {
  opacity: 1;
  transform: translateY(0);
}
</style>
