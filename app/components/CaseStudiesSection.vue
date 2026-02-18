<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

type CaseStudy = {
  id: number;
  number: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
};

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    number: "01",
    title: "AXEL ARIGATO",
    subtitle: "Digital Advertising Case Study",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80",
    link: "/work/axel-arigato"
  },
  {
    id: 2,
    number: "02",
    title: "SIEMATIC",
    subtitle: "Brand Awareness & Content Strategy",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    link: "/work/siematic"
  },
  {
    id: 3,
    number: "03",
    title: "CARSICKO",
    subtitle: "Community Growth & Influencer Activation",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80",
    link: "/work/carsicko"
  },
  {
    id: 4,
    number: "04",
    title: "SOUTHWESTSIX",
    subtitle: "Experiential Launch & Social Momentum",
    image:
      "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=1400&q=80",
    link: "/work/southwestsix"
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
    id="section-case-studies"
    ref="sectionRef"
    class="bg-black text-white"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="mx-auto max-w-[120rem] px-6 py-20 lg:px-16 lg:py-32">
      <div class="flex flex-col gap-10 border-b border-light/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-4">
          <div class="flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-accent">
            <span class="inline-block h-px w-8 bg-accent/70" />
            04 — Selected Work
          </div>
          <h2 class="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            <span class="text-white">Featured</span>
            <span class="text-accent"> Case Studies</span>
          </h2>
        </div>
        <p class="max-w-sm text-[0.75rem] uppercase tracking-[0.4em] text-light-50 lg:text-right">
          Real results delivered through data-led strategies.
        </p>
      </div>

      <div class="mt-12 grid gap-8 lg:grid-cols-2">
        <a
          v-for="(study, index) in caseStudies"
          :key="study.id"
          :href="study.link"
          class="case-card group relative overflow-hidden border border-light/10 bg-dark-40"
          :style="{ '--delay': `${index * 110}ms` }"
          role="button"
          aria-label="Open case study"
        >
          <div class="pointer-events-none relative aspect-[16/10] overflow-hidden">
            <img
              :src="study.image"
              :alt="study.title"
              class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-dark-85 via-dark-40 to-dark/10 opacity-90 transition duration-500 group-hover:opacity-100"
            />
          </div>

          <div class="pointer-events-none absolute left-5 top-5 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-accent/90">
            {{ study.number }}
          </div>

         

          <div
            class="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 border border-accent/70 bg-accent/10 p-2 text-accent transition duration-300 group-hover:bg-accent group-hover:text-black"
          >
            <span class="text-base">→</span>
          </div>

          <div class="case-footer pointer-events-none">
            <h3 class="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              {{ study.title }}
            </h3>
            <p class="mt-1 text-[0.8rem] uppercase tracking-[0.3em] text-accent/80">
              {{ study.subtitle }}
            </p>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.case-card {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: var(--delay, 0ms);
}

.is-visible .case-card {
  opacity: 1;
  transform: translateY(0);
}

.case-footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 2rem 2rem 2rem;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.78) 55%, rgba(0, 0, 0, 0.95) 100%);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.case-ring {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 2px solid rgba(var(--color-accent-rgb), 0.55);
  box-shadow: 0 0 0 6px rgba(var(--color-accent-rgb), 0.08);
}
</style>