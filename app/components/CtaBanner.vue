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
    class="relative overflow-hidden bg-white text-black"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="absolute inset-0 flex items-center opacity-40">
      <div class="marquee-track">
        <div class="marquee-row">
          <span v-for="index in 12" :key="`cta-${index}`" class="marquee-item">
            artdotagency
          </span>
        </div>
      </div>
    </div>

    <div class="relative mx-auto max-w-[110rem] px-6 py-24 lg:px-16 lg:py-32">
      <div class="flex flex-col items-center gap-6 text-center">
        <h2 class="cta-fade text-4xl font-semibold uppercase tracking-tight sm:text-5xl lg:text-6xl">
          Seen Enough?
        </h2>
        <p class="cta-fade max-w-3xl text-sm uppercase tracking-[0.2em] text-dark-60 sm:text-base">
          You've seen the numbers. You've seen the reach. Now stop watching and
          start dominating.
        </p>
        <a
          href="mailto:Enquiry@artdotagency.co.uk"
          class="cta-fade inline-flex items-center justify-center gap-3 bg-accent px-10 py-4 text-xs font-semibold uppercase tracking-[0.35em] text-black transition hover:bg-accent-hover"
        >
          Start a Project
          <span aria-hidden="true">→</span>
        </a>
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
  font-size: clamp(5rem, 16vw, 13rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  white-space: nowrap;
  color: rgba(0, 0, 0, 0.08);
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
