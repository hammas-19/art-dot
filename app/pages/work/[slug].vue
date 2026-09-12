<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useIntersectionObserver } from "@vueuse/core";
import { useTextAnimation } from "@/composables/useTextAnimation";
import projectsData from "@/data/projects.json";

interface ResultStat {
  value: number;
  suffix: string;
  label: string;
}

interface GalleryImage {
  url: string;
  caption: string;
  aspect: string;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

interface AdjacentProject {
  slug: string;
  title: string;
  subtitle: string;
}

interface Project {
  slug: string;
  title: string;
  subtitle: string;
  number: string;
  year: string;
  client: string;
  industry: string;
  services: string[];
  heroImage: string;
  overview: string;
  challenge: string;
  approach: string;
  results: ResultStat[];
  galleryImages: GalleryImage[];
  testimonial: Testimonial;
  nextProject: AdjacentProject;
  prevProject: AdjacentProject;
}

const route = useRoute();
const router = useRouter();

const project = computed<Project | undefined>(() => {
  const slug = route.params.slug as string;
  return (projectsData as Project[]).find((p) => p.slug === slug);
});

// Dynamic SEO
useHead(() => ({
  title: project.value ? `${project.value.title} — ART.DOT Case Study` : "Project Not Found — ART.DOT",
  meta: [
    {
      name: "description",
      content: project.value ? project.value.overview : "Creative agency case study and project detail."
    },
    {
      property: "og:title",
      content: project.value ? `${project.value.title} | ART.DOT` : "ART.DOT"
    },
    {
      property: "og:image",
      content: project.value?.heroImage || ""
    }
  ]
}));

// Section refs & intersection visibility
const heroRef = ref<HTMLElement | null>(null);
const metaRef = ref<HTMLElement | null>(null);
const narrativeRef = ref<HTMLElement | null>(null);
const statsRef = ref<HTMLElement | null>(null);
const galleryRef = ref<HTMLElement | null>(null);
const testimonialRef = ref<HTMLElement | null>(null);
const navStripRef = ref<HTMLElement | null>(null);

const heroVisible = ref(false);
const metaVisible = ref(false);
const narrativeVisible = ref(false);
const statsVisible = ref(false);
const galleryVisible = ref(false);
const testimonialVisible = ref(false);
const navStripVisible = ref(false);

const cleanupObservers: Array<() => void> = [];

// Results Animated Values
const animatedStats = ref<number[]>([]);
let statsRafId: number | null = null;

const runStatsCounter = () => {
  if (!project.value) return;
  const start = performance.now();
  const duration = 1500;
  const targetStats = project.value.results;

  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    animatedStats.value = targetStats.map((s) => Math.round(s.value * easeProgress));
    if (progress < 1) {
      statsRafId = requestAnimationFrame(tick);
    }
  };
  statsRafId = requestAnimationFrame(tick);
};

// Glow Cursor Card Handler
const glowStates = new WeakMap<HTMLElement, { x: number; y: number; tx: number; ty: number; raf: number | null }>();

const animateGlow = (target: HTMLElement) => {
  const state = glowStates.get(target);
  if (!state) return;

  const dx = state.tx - state.x;
  const dy = state.ty - state.y;
  state.x += dx * 0.14;
  state.y += dy * 0.14;
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

// Text animations
useTextAnimation(".project-hero-title");
useTextAnimation(".project-narrative-title");
useTextAnimation(".project-quote-text");

// Reset state when route changes between projects
watch(
  () => route.params.slug,
  () => {
    if (project.value) {
      animatedStats.value = project.value.results.map(() => 0);
      if (statsVisible.value) {
        runStatsCounter();
      }
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (project.value) {
    animatedStats.value = project.value.results.map(() => 0);
  }

  // Setup observers
  const obsConfigs = [
    { ref: heroRef, setter: (v: boolean) => (heroVisible.value = v) },
    { ref: metaRef, setter: (v: boolean) => (metaVisible.value = v) },
    { ref: narrativeRef, setter: (v: boolean) => (narrativeVisible.value = v) },
    {
      ref: statsRef,
      setter: (v: boolean) => {
        if (v && !statsVisible.value) {
          statsVisible.value = true;
          runStatsCounter();
        }
      }
    },
    { ref: galleryRef, setter: (v: boolean) => (galleryVisible.value = v) },
    { ref: testimonialRef, setter: (v: boolean) => (testimonialVisible.value = v) },
    { ref: navStripRef, setter: (v: boolean) => (navStripVisible.value = v) }
  ];

  obsConfigs.forEach(({ ref: targetRef, setter }) => {
    const { stop } = useIntersectionObserver(
      targetRef,
      ([{ isIntersecting }]) => {
        if (isIntersecting) setter(true);
      },
      { threshold: 0.15 }
    );
    cleanupObservers.push(stop);
  });
});

onUnmounted(() => {
  cleanupObservers.forEach((stop) => stop());
  if (statsRafId) cancelAnimationFrame(statsRafId);
});
</script>

<template>
  <div class="min-h-screen bg-black text-white selection:bg-accent selection:text-black">
    <ClientOnly>
      <CursorFollower />
    </ClientOnly>

    <!-- Top Floating Header Bar -->
    <header class="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md transition-all duration-300">
      <div class="mx-auto flex max-w-[120rem] items-center justify-between px-6 py-4 lg:px-16">
        <!-- Logo -->
        <NuxtLink to="/" class="group flex items-center gap-2 text-sm font-semibold tracking-widest text-white transition hover:text-accent">
          <span class="inline-block h-2 w-2 rounded-full bg-accent transition group-hover:scale-125" />
          <span>ART.DOT</span>
        </NuxtLink>

        <!-- Center breadcrumbs / tag -->
        <div class="hidden items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-light-50 md:flex">
          <NuxtLink to="/" class="transition hover:text-accent">Work</NuxtLink>
          <span class="text-white/20">/</span>
          <span class="text-accent font-mono">{{ project?.number || '00' }}</span>
          <span class="text-white font-medium">{{ project?.title }}</span>
        </div>

        <!-- Back Link -->
        <NuxtLink
          to="/#section-case-studies"
          class="group inline-flex items-center gap-2 rounded-full border border-light/15 bg-light/5 px-4 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.25em] text-light-80 transition duration-300 hover:border-accent hover:bg-accent/10 hover:text-accent"
        >
          <span class="transition-transform duration-300 group-hover:-translate-x-1">←</span>
          <span>All Work</span>
        </NuxtLink>
      </div>
    </header>

    <!-- 404 State if project not found -->
    <main v-if="!project" class="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-32 text-center">
      <p class="text-xs uppercase tracking-[0.4em] text-accent">Error 404</p>
      <h1 class="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">Project Not Found</h1>
      <p class="mt-4 max-w-md text-sm text-light-60">The case study you are looking for does not exist or has been relocated.</p>
      <NuxtLink
        to="/"
        class="mt-8 inline-flex items-center gap-2 rounded-full border border-accent bg-accent px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-white"
      >
        Return to Home
      </NuxtLink>
    </main>

    <!-- Main Project Content -->
    <main v-else class="relative pt-20">
      <!-- 1. HERO SECTION -->
      <section
        ref="heroRef"
        class="relative min-h-[85vh] lg:min-h-[92vh] flex flex-col justify-end overflow-hidden border-b border-light/10"
        :class="{ 'is-visible': heroVisible }"
      >
        <!-- Background Imagery with Parallax Zoom & Gradient Overlay -->
        <div class="absolute inset-0 z-0">
          <img
            :src="project.heroImage"
            :alt="project.title"
            class="h-full w-full object-cover object-center filter grayscale contrast-110 brightness-60 transition duration-1000 scale-100"
          />
          <!-- Multi-tier gradient overlay for readability & dark mood -->
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
          <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div class="radial-vignette absolute inset-0 pointer-events-none" />
        </div>

        <!-- Technical Corner Accents -->
        <div class="pointer-events-none absolute left-6 top-24 font-mono text-[10px] uppercase tracking-widest text-accent/60 lg:left-16">
          <span class="inline-block h-1.5 w-1.5 bg-accent mr-2 animate-pulse" />
          CASE_FILE // {{ project.number }}
        </div>
        <div class="pointer-events-none absolute right-6 top-24 hidden font-mono text-[10px] uppercase tracking-widest text-white/40 lg:block lg:right-16">
          ARCHIVE_REF: 2024_{{ project.slug.toUpperCase() }}
        </div>

        <!-- Hero Content Container -->
        <div class="relative z-10 mx-auto w-full max-w-[120rem] px-6 pb-16 pt-32 lg:px-16 lg:pb-24">
          <!-- Top Eyebrow -->
          <div class="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.4em] text-accent">
            <span class="inline-block h-px w-8 bg-accent/70" />
            <span>{{ project.number }} — CASE STUDY</span>
            <span class="text-white/30">•</span>
            <span class="text-white/60">{{ project.year }}</span>
          </div>

          <!-- Main Title -->
          <h1 class="project-hero-title mt-6 text-5xl font-bold uppercase tracking-tight sm:text-7xl lg:text-8xl xl:text-9xl text-white">
            {{ project.title }}
          </h1>

          <!-- Subtitle / Hook -->
          <p class="mt-6 max-w-3xl text-lg font-light leading-relaxed text-light-80 sm:text-xl lg:text-2xl">
            {{ project.subtitle }}
          </p>

          <!-- Quick Service Tags Pills -->
          <div class="mt-8 flex flex-wrap items-center gap-2 pt-4">
            <span
              v-for="service in project.services"
              :key="service"
              class="inline-flex items-center rounded-full border border-light/15 bg-black/40 px-3.5 py-1 text-[0.7rem] font-medium tracking-wider text-light-80 backdrop-blur-sm transition hover:border-accent/50 hover:text-accent"
            >
              {{ service }}
            </span>
          </div>
        </div>
      </section>

      <!-- 2. PROJECT METADATA BAR -->
      <section
        ref="metaRef"
        class="border-b border-light/10 bg-dark-40"
        :class="{ 'is-visible': metaVisible }"
      >
        <div class="mx-auto max-w-[120rem] px-6 py-12 lg:px-16 lg:py-16">
          <div
            class="meta-card relative grid gap-8 overflow-hidden rounded-xl border border-light/10 bg-light/5 p-8 backdrop-blur-md sm:grid-cols-2 lg:grid-cols-4"
            @mousemove="handleCardMove"
            @mouseleave="handleCardLeave"
          >
            <!-- Crosshairs decoration -->
            <span class="absolute top-2 left-2 text-[10px] font-mono text-accent/40">+</span>
            <span class="absolute top-2 right-2 text-[10px] font-mono text-accent/40">+</span>
            <span class="absolute bottom-2 left-2 text-[10px] font-mono text-accent/40">+</span>
            <span class="absolute bottom-2 right-2 text-[10px] font-mono text-accent/40">+</span>

            <!-- Col 1: Client -->
            <div class="space-y-2 border-b border-white/5 pb-6 sm:border-b-0 sm:pb-0">
              <p class="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-accent/80">Client</p>
              <p class="text-lg font-medium text-white">{{ project.client }}</p>
            </div>

            <!-- Col 2: Industry -->
            <div class="space-y-2 border-b border-white/5 pb-6 sm:border-b-0 sm:pb-0">
              <p class="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-accent/80">Industry</p>
              <p class="text-lg font-medium text-white">{{ project.industry }}</p>
            </div>

            <!-- Col 3: Year & Timeline -->
            <div class="space-y-2 border-b border-white/5 pb-6 sm:border-b-0 sm:pb-0">
              <p class="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-accent/80">Year / Timeline</p>
              <p class="text-lg font-medium text-white">{{ project.year }} // 12-Week Sprint</p>
            </div>

            <!-- Col 4: Key Deliverables -->
            <div class="space-y-2">
              <p class="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-accent/80">Core Disciplines</p>
              <p class="text-sm leading-relaxed text-light-70">
                {{ project.services.join(" • ") }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. STRATEGIC NARRATIVE & OVERVIEW -->
      <section
        ref="narrativeRef"
        class="border-b border-light/10 bg-black text-white"
        :class="{ 'is-visible': narrativeVisible }"
      >
        <div class="mx-auto max-w-[120rem] px-6 py-20 lg:px-16 lg:py-32">
          <!-- Section Heading -->
          <div class="flex flex-col gap-4 border-b border-light/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
            <div class="space-y-3">
              <div class="flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-accent">
                <span class="inline-block h-px w-8 bg-accent/70" />
                01 — Narrative & Strategy
              </div>
              <h2 class="project-narrative-title text-3xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Engineering <span class="text-accent">Cultural Resonance.</span>
              </h2>
            </div>
            <p class="max-w-sm text-[0.75rem] uppercase tracking-[0.35em] text-light-50 lg:text-right">
              From creative thesis to tangible market dominance.
            </p>
          </div>

          <!-- 2-Column Editorial Grid -->
          <div class="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
            <!-- Left: Overview Lead Paragraph -->
            <div class="lg:col-span-5 space-y-6">
              <div class="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[0.65rem] font-mono tracking-widest text-accent uppercase">
                Executive Overview
              </div>
              <p class="text-xl font-normal leading-relaxed text-white sm:text-2xl">
                {{ project.overview }}
              </p>
              <div class="h-px w-24 bg-gradient-to-r from-accent to-transparent" />
            </div>

            <!-- Right: The Challenge & Strategic Approach -->
            <div class="lg:col-span-7 space-y-12">
              <!-- Challenge Box -->
              <div
                class="narrative-card group relative overflow-hidden rounded-xl border border-light/10 bg-light/5 p-8 transition duration-500 hover:border-light/20"
                @mousemove="handleCardMove"
                @mouseleave="handleCardLeave"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs font-mono uppercase tracking-widest text-accent/80">01 // The Challenge</span>
                  <span class="text-xs font-mono text-white/30">[DIAGNOSIS]</span>
                </div>
                <h3 class="mt-4 text-2xl font-semibold text-white">The Market Hurdle</h3>
                <p class="mt-4 text-base leading-relaxed text-light-70">
                  {{ project.challenge }}
                </p>
              </div>

              <!-- Approach Box -->
              <div
                class="narrative-card group relative overflow-hidden rounded-xl border border-light/10 bg-light/5 p-8 transition duration-500 hover:border-light/20"
                @mousemove="handleCardMove"
                @mouseleave="handleCardLeave"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs font-mono uppercase tracking-widest text-accent/80">02 // The Execution</span>
                  <span class="text-xs font-mono text-white/30">[INTERVENTION]</span>
                </div>
                <h3 class="mt-4 text-2xl font-semibold text-white">Strategic Architecture</h3>
                <p class="mt-4 text-base leading-relaxed text-light-70">
                  {{ project.approach }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. KEY RESULTS & METRICS -->
      <section
        ref="statsRef"
        class="border-b border-light/10 bg-dark-40 text-white"
        :class="{ 'is-visible': statsVisible }"
      >
        <div class="mx-auto max-w-[120rem] px-6 py-20 lg:px-16 lg:py-32">
          <!-- Section Header -->
          <div class="flex flex-col gap-4 border-b border-light/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div class="space-y-2">
              <div class="flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-accent">
                <span class="inline-block h-px w-8 bg-accent/70" />
                02 — Measured Impact
              </div>
              <h2 class="text-3xl font-semibold tracking-tight sm:text-5xl">
                Quantitative <span class="text-accent">Outcomes</span>
              </h2>
            </div>
            <p class="text-[0.7rem] uppercase tracking-[0.35em] text-light-50">
              Audited performance metrics post-campaign.
            </p>
          </div>

          <!-- 4 Stat Cards Grid with Glow on Hover -->
          <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="(stat, index) in project.results"
              :key="stat.label"
              class="stat-card group relative flex flex-col items-center justify-center rounded-xl border border-light/10 bg-light/5 px-8 py-12 text-center transition duration-500 hover:border-accent/40"
              :class="{ 'stat-animate': statsVisible }"
              :style="{ '--delay': `${index * 100}ms` }"
              @mousemove="handleCardMove"
              @mouseleave="handleCardLeave"
            >
              <!-- Top corner technical label -->
              <span class="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-widest text-accent/60">
                METRIC_0{{ index + 1 }}
              </span>

              <!-- Counter Value -->
              <p class="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                <span class="transition-colors duration-300 group-hover:text-accent">
                  {{ animatedStats[index] !== undefined ? animatedStats[index] : stat.value }}
                </span>
                <span class="text-accent transition-colors duration-300 group-hover:text-white">
                  {{ stat.suffix }}
                </span>
              </p>

              <!-- Label -->
              <p class="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-light-60 transition duration-300 group-hover:text-white">
                {{ stat.label }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. ASYMMETRIC BENTO VISUAL GALLERY -->
      <section
        ref="galleryRef"
        class="border-b border-light/10 bg-black text-white"
        :class="{ 'is-visible': galleryVisible }"
      >
        <div class="mx-auto max-w-[120rem] px-6 py-20 lg:px-16 lg:py-32">
          <!-- Section Header -->
          <div class="flex flex-col gap-4 border-b border-light/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
            <div class="space-y-3">
              <div class="flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-accent">
                <span class="inline-block h-px w-8 bg-accent/70" />
                03 — Visual Artifacts
              </div>
              <h2 class="text-3xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Campaign <span class="text-accent">Gallery</span>
              </h2>
            </div>
            <p class="max-w-xs text-[0.75rem] uppercase tracking-[0.35em] text-light-50 lg:text-right">
              Production stills & creative distribution assets.
            </p>
          </div>

          <!-- Asymmetric Bento Grid -->
          <div class="mt-14 grid gap-8 md:grid-cols-12">
            <!-- Image 1: Large Featured Span (8 cols) -->
            <div
              v-if="project.galleryImages[0]"
              class="gallery-item group relative overflow-hidden rounded-xl border border-light/10 bg-light/5 md:col-span-8"
              @mousemove="handleCardMove"
              @mouseleave="handleCardLeave"
            >
              <div class="relative aspect-[16/10] w-full overflow-hidden">
                <img
                  :src="project.galleryImages[0].url"
                  :alt="project.galleryImages[0].caption"
                  class="h-full w-full object-cover filter grayscale contrast-110 transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition duration-500" />
              </div>
              <!-- Crosshairs -->
              <span class="pointer-events-none absolute top-3 left-3 font-mono text-xs text-accent/60">+</span>
              <span class="pointer-events-none absolute top-3 right-3 font-mono text-xs text-accent/60">+</span>
              <!-- Caption footer -->
              <div class="p-6">
                <p class="text-xs font-mono uppercase tracking-widest text-accent/90">PLATE_01</p>
                <p class="mt-1 text-sm text-light-70">{{ project.galleryImages[0].caption }}</p>
              </div>
            </div>

            <!-- Image 2: Tall Portrait Span (4 cols) -->
            <div
              v-if="project.galleryImages[1]"
              class="gallery-item group relative overflow-hidden rounded-xl border border-light/10 bg-light/5 md:col-span-4"
              @mousemove="handleCardMove"
              @mouseleave="handleCardLeave"
            >
              <div class="relative aspect-[4/5] md:aspect-auto md:h-[calc(100%-80px)] w-full overflow-hidden">
                <img
                  :src="project.galleryImages[1].url"
                  :alt="project.galleryImages[1].caption"
                  class="h-full w-full object-cover filter grayscale contrast-110 transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition duration-500" />
              </div>
              <!-- Crosshairs -->
              <span class="pointer-events-none absolute top-3 left-3 font-mono text-xs text-accent/60">+</span>
              <span class="pointer-events-none absolute top-3 right-3 font-mono text-xs text-accent/60">+</span>
              <!-- Caption footer -->
              <div class="p-6">
                <p class="text-xs font-mono uppercase tracking-widest text-accent/90">PLATE_02</p>
                <p class="mt-1 text-sm text-light-70">{{ project.galleryImages[1].caption }}</p>
              </div>
            </div>

            <!-- Image 3: Wide Cinematic Span (7 cols) -->
            <div
              v-if="project.galleryImages[2]"
              class="gallery-item group relative overflow-hidden rounded-xl border border-light/10 bg-light/5 md:col-span-7"
              @mousemove="handleCardMove"
              @mouseleave="handleCardLeave"
            >
              <div class="relative aspect-[16/9] w-full overflow-hidden">
                <img
                  :src="project.galleryImages[2].url"
                  :alt="project.galleryImages[2].caption"
                  class="h-full w-full object-cover filter grayscale contrast-110 transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition duration-500" />
              </div>
              <span class="pointer-events-none absolute top-3 left-3 font-mono text-xs text-accent/60">+</span>
              <span class="pointer-events-none absolute top-3 right-3 font-mono text-xs text-accent/60">+</span>
              <div class="p-6">
                <p class="text-xs font-mono uppercase tracking-widest text-accent/90">PLATE_03</p>
                <p class="mt-1 text-sm text-light-70">{{ project.galleryImages[2].caption }}</p>
              </div>
            </div>

            <!-- Image 4: Medium Span (5 cols) -->
            <div
              v-if="project.galleryImages[3]"
              class="gallery-item group relative overflow-hidden rounded-xl border border-light/10 bg-light/5 md:col-span-5"
              @mousemove="handleCardMove"
              @mouseleave="handleCardLeave"
            >
              <div class="relative aspect-[16/9] md:aspect-[4/3] w-full overflow-hidden">
                <img
                  :src="project.galleryImages[3].url"
                  :alt="project.galleryImages[3].caption"
                  class="h-full w-full object-cover filter grayscale contrast-110 transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition duration-500" />
              </div>
              <span class="pointer-events-none absolute top-3 left-3 font-mono text-xs text-accent/60">+</span>
              <span class="pointer-events-none absolute top-3 right-3 font-mono text-xs text-accent/60">+</span>
              <div class="p-6">
                <p class="text-xs font-mono uppercase tracking-widest text-accent/90">PLATE_04</p>
                <p class="mt-1 text-sm text-light-70">{{ project.galleryImages[3].caption }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. CLIENT TESTIMONIAL -->
      <section
        v-if="project.testimonial"
        ref="testimonialRef"
        class="border-b border-light/10 bg-dark-40 text-white"
        :class="{ 'is-visible': testimonialVisible }"
      >
        <div class="mx-auto max-w-[100rem] px-6 py-24 lg:px-16 lg:py-36">
          <div
            class="testimonial-card relative overflow-hidden rounded-2xl border border-light/10 bg-light/5 p-10 text-center lg:p-20"
            @mousemove="handleCardMove"
            @mouseleave="handleCardLeave"
          >
            <!-- Decorative Large Quotation Mark -->
            <div class="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 text-8xl font-serif font-black text-accent/15 lg:text-9xl">
              “
            </div>

            <div class="relative z-10 mx-auto max-w-4xl space-y-8">
              <div class="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Client Perspective
              </div>

              <blockquote class="project-quote-text text-2xl font-normal leading-relaxed text-white sm:text-3xl lg:text-4xl">
                “{{ project.testimonial.quote }}”
              </blockquote>

              <div class="pt-4 space-y-1.5">
                <p class="text-lg font-semibold text-white tracking-wide">
                  {{ project.testimonial.author }}
                </p>
                <p class="text-xs font-mono uppercase tracking-[0.25em] text-accent/90">
                  {{ project.testimonial.role }} — {{ project.testimonial.company }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 7. ADJACENT PROJECT NAVIGATION STRIP -->
      <section
        ref="navStripRef"
        class="border-b border-light/10 bg-black text-white"
        :class="{ 'is-visible': navStripVisible }"
      >
        <div class="mx-auto max-w-[120rem] px-6 py-16 lg:px-16 lg:py-24">
          <div class="grid gap-6 md:grid-cols-2">
            <!-- Prev Project Link -->
            <NuxtLink
              v-if="project.prevProject"
              :to="`/work/${project.prevProject.slug}`"
              class="nav-project-card group relative overflow-hidden rounded-xl border border-light/10 bg-light/5 p-8 transition duration-500 hover:border-accent/40 lg:p-12"
              @mousemove="handleCardMove"
              @mouseleave="handleCardLeave"
            >
              <div class="flex items-center gap-3 text-[0.7rem] font-mono uppercase tracking-widest text-accent/80 transition-transform duration-300 group-hover:-translate-x-1">
                <span>←</span>
                <span>Previous Case Study</span>
              </div>
              <h3 class="mt-4 text-2xl font-bold uppercase tracking-tight text-white transition-colors duration-300 group-hover:text-accent sm:text-3xl lg:text-4xl">
                {{ project.prevProject.title }}
              </h3>
              <p class="mt-2 text-xs uppercase tracking-[0.25em] text-light-50">
                {{ project.prevProject.subtitle }}
              </p>
            </NuxtLink>

            <!-- Next Project Link -->
            <NuxtLink
              v-if="project.nextProject"
              :to="`/work/${project.nextProject.slug}`"
              class="nav-project-card group relative overflow-hidden rounded-xl border border-light/10 bg-light/5 p-8 text-left md:text-right transition duration-500 hover:border-accent/40 lg:p-12"
              @mousemove="handleCardMove"
              @mouseleave="handleCardLeave"
            >
              <div class="flex items-center justify-start md:justify-end gap-3 text-[0.7rem] font-mono uppercase tracking-widest text-accent/80 transition-transform duration-300 group-hover:translate-x-1">
                <span>Next Case Study</span>
                <span>→</span>
              </div>
              <h3 class="mt-4 text-2xl font-bold uppercase tracking-tight text-white transition-colors duration-300 group-hover:text-accent sm:text-3xl lg:text-4xl">
                {{ project.nextProject.title }}
              </h3>
              <p class="mt-2 text-xs uppercase tracking-[0.25em] text-light-50">
                {{ project.nextProject.subtitle }}
              </p>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- 8. GLOBAL FOOTER -->
      <FooterSection />
    </main>
  </div>
</template>

<style scoped>
/* Card glow effect matching site system */
.meta-card::before,
.narrative-card::before,
.stat-card::before,
.gallery-item::before,
.testimonial-card::before,
.nav-project-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    650px circle at var(--glow-x, 50%) var(--glow-y, 50%),
    rgba(var(--color-accent-glow-rgb), 0.18),
    rgba(var(--color-accent-glow-rgb), 0.03) 45%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  filter: blur(16px);
  pointer-events: none;
  z-index: 1;
}

.meta-card:hover::before,
.narrative-card:hover::before,
.stat-card:hover::before,
.gallery-item:hover::before,
.testimonial-card:hover::before,
.nav-project-card:hover::before {
  opacity: 1;
}

/* Vignette gradient */
.radial-vignette {
  background: radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, 0.75) 100%);
}

/* Stat card animations */
.stat-card {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.stat-card.stat-animate {
  animation: statFadeUp 0.65s ease forwards;
  animation-delay: var(--delay, 0ms);
}

@keyframes statFadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Gallery and Narrative fade */
.gallery-item,
.narrative-card,
.testimonial-card,
.nav-project-card {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.is-visible .gallery-item,
.is-visible .narrative-card,
.is-visible .testimonial-card,
.is-visible .nav-project-card {
  opacity: 1;
  transform: translateY(0);
}
</style>
