<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

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
    id="section-brand-activation"
    ref="sectionRef"
    class="bg-black text-white"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-32">
      <div class="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
        <div class="space-y-6">
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
            Live Experiences
          </p>
          <h2 class="text-4xl font-semibold tracking-tight sm:text-5xl">
            Brand Activation
          </h2>
          <p class="text-base text-white/70 sm:text-lg">
            We have hosted cultural events that connect brands with real-world
            communities, creating energy, visibility, and lasting impact.
          </p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2">
          <div class="stat-card rounded-2xl border border-white/10 bg-white/5 p-6">
            <p class="text-4xl font-semibold">15+</p>
            <p class="mt-2 text-xs uppercase tracking-[0.3em] text-white/60">
              Cultural Events Hosted
            </p>
          </div>
          <div class="stat-card rounded-2xl border border-white/10 bg-white/5 p-6">
            <p class="text-4xl font-semibold">10k+</p>
            <p class="mt-2 text-xs uppercase tracking-[0.3em] text-white/60">
              Total Attendees
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stat-card {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.is-visible .stat-card {
  opacity: 1;
  transform: translateY(0);
}
</style>
