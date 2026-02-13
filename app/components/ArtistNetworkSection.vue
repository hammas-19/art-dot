<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { Instagram, Music4 } from "lucide-vue-next";

type Artist = {
  handle: string;
  name: string;
  instagram: string;
  tiktok?: string;
  image: string;
};

const artists: Artist[] = [
  {
    handle: "@burnaboygram",
    name: "BURNA BOY",
    instagram: "17.7M",
    tiktok: "6.8M",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1400&q=80"
  },
  {
    handle: "@headieone",
    name: "HEADIE ONE",
    instagram: "8.48M",
    tiktok: "2.18M",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1400&q=80"
  },
  {
    handle: "@ehiz",
    name: "EHIZ",
    instagram: "330K",
    tiktok: "12.7M",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80"
  },
  {
    handle: "@uchenatori",
    name: "UCHE NATORI",
    instagram: "653K",
    tiktok: "8.35M",
    image: "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=900&q=80"
  },
  {
    handle: "@rimzee",
    name: "RIMZEE",
    instagram: "1.28M",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=80"
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
    id="section-artist-network"
    ref="sectionRef"
    class="bg-black text-white"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-32">
      <div class="flex flex-col gap-8 border-b border-white/10 pb-8 lg:flex-row lg:items-start lg:justify-between">
        <div class="space-y-2">
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
            The Network
          </p>
          <h2 class="text-4xl font-semibold tracking-tight sm:text-5xl">Renowned Artists</h2>
        </div>
        <div class="grid gap-8 text-right sm:grid-cols-2">
          <div class="stat-block">
            <p class="text-3xl font-semibold sm:text-4xl">3.83M</p>
            <p class="mt-2 text-[0.65rem] uppercase tracking-[0.35em] text-white/50">
              Avg Reach / Event
            </p>
          </div>
          <div class="stat-block">
            <p class="text-3xl font-semibold sm:text-4xl">22.97M+</p>
            <p class="mt-2 text-[0.65rem] uppercase tracking-[0.35em] text-white/50">
              Total Impressions
            </p>
          </div>
        </div>
      </div>

      <div class="mt-10 grid gap-6 lg:grid-cols-6">
        <article
          v-for="(artist, index) in artists"
          :key="artist.handle"
          class="artist-card group relative overflow-hidden rounded-2xl border border-white/10"
          :class="index < 2 ? 'lg:col-span-3' : 'lg:col-span-2'"
          :style="{ '--delay': `${index * 90}ms` }"
        >
          <div class="relative aspect-[16/9] w-full lg:aspect-[4/3]">
            <img
              :src="artist.image"
              :alt="artist.name"
              class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
          </div>

          <span class="badge">
            {{ artist.handle.toUpperCase() }}
          </span>

          <div class="absolute bottom-4 left-4 space-y-2">
            <h3 class="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {{ artist.name }}
            </h3>
            <div class="flex items-center gap-4 text-xs uppercase tracking-[0.25em] text-white/70">
              <span class="flex items-center gap-2">
                <Instagram class="h-3.5 w-3.5 text-white/70" />
                {{ artist.instagram }}
              </span>
              <span v-if="artist.tiktok" class="flex items-center gap-2">
                <Music4 class="h-3.5 w-3.5 text-white/70" />
                {{ artist.tiktok }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.artist-card {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.is-visible .artist-card {
  opacity: 1;
  transform: translateY(0);
}

.artist-card {
  transition-delay: var(--delay, 0ms);
}

.badge {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.65);
  font-size: 0.55rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
}
</style>
