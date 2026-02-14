<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

type ServiceItem = {
  id: number;
  title: string;
};

const services: ServiceItem[] = [
  { id: 1, title: "Immersive Set Design" },
  { id: 2, title: "Creative Campaigns" },
  { id: 3, title: "Street Culture Consulting" },
  { id: 4, title: "Brand Community Interfacing" },
  { id: 5, title: "Event Production" },
  { id: 6, title: "Influencer Partnerships" },
  { id: 7, title: "Youth Co-creation Panels" }
];

const activeIndex = ref(1);
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
    id="section-services"
    ref="sectionRef"
    class="bg-black text-white"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-32">
      <div class="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div class="space-y-6">
          <div class="flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-amber-300">
            <span class="inline-block h-px w-8 bg-amber-300/70" />
            06 — Services
          </div>
          <h2 class="text-4xl font-semibold tracking-tight sm:text-5xl">
            <span class="text-white">Creative</span>
            <span class="text-amber-300"> Services</span>
          </h2>
          <div class="max-w-sm border-l border-white/10 pl-4 text-xs uppercase tracking-[0.35em] text-white/50">
            Bespoke solutions bridging the gap between brands and culture.
          </div>
        </div>

        <div class="space-y-4">
          <button
            v-for="(service, index) in services"
            :key="service.id"
            type="button"
            class="service-row flex w-full items-center justify-between gap-6 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-left text-base uppercase tracking-[0.25em] text-white/80 transition"
            :class="{
              'is-active': activeIndex === index,
              'hover:border-amber-300/40 hover:bg-amber-300/10 hover:text-amber-200': true
            }"
            :style="{ '--delay': `${index * 90}ms` }"
            @mouseenter="activeIndex = index"
          >
            <span class="service-label">{{ service.title }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.service-row {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease, border-color 0.4s ease, background 0.4s ease;
  transition-delay: var(--delay, 0ms);
}

.is-visible .service-row {
  opacity: 1;
  transform: translateY(0);
}

.service-row.is-active {
  border-color: rgba(251, 191, 36, 0.6);
  background: linear-gradient(90deg, rgba(251, 191, 36, 0.12) 0%, rgba(0, 0, 0, 0.2) 70%);
  color: rgba(251, 191, 36, 0.95);
}

.service-label {
  display: inline-block;
  transform: translateX(0);
  transition: transform 0.35s ease;
}

.service-row:hover .service-label {
  transform: translateX(15px);
}
</style>
