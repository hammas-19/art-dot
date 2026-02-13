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
    id="section-cta"
    ref="sectionRef"
    class="relative overflow-hidden bg-black text-white"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="absolute inset-0 opacity-20">
      <div class="marquee-track">
        <div class="marquee-row">
          <span v-for="index in 12" :key="`cta-${index}`" class="marquee-item">
            artdotagency
          </span>
        </div>
      </div>
    </div>

    <div class="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
      <div class="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div class="space-y-6">
          <h2 class="cta-fade text-4xl font-semibold tracking-tight sm:text-5xl">
            Seen Enough?
          </h2>
          <p class="cta-fade max-w-2xl text-base text-white/70 sm:text-lg">
            You've seen the numbers. You've seen the reach. Now stop watching and
            start dominating.
          </p>
        </div>
        <div class="flex items-center lg:justify-end">
          <a
            href="mailto:Enquiry@artdotagency.co.uk"
            class="cta-fade inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-4 text-xs font-semibold uppercase tracking-[0.35em] transition hover:border-white"
          >
            Start a Project
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marquee-track {
  overflow: hidden;
}

.marquee-row {
  display: flex;
  gap: 3rem;
  padding: 1.5rem 0;
  animation: marquee 22s linear infinite;
}

.marquee-item {
  font-size: 3rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4em;
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.15);
}

.cta-fade {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.is-visible .cta-fade {
  opacity: 1;
  transform: translateY(0);
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
