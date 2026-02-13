<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

type FeedItem = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
};

const videos: FeedItem[] = [
  {
    id: 1,
    title: "Backstage Energy",
    description: "Raw moments from a live culture set.",
    thumbnail:
      "https://images.unsplash.com/photo-1507878866276-a947ef722fee?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://cdn.coverr.co/videos/coverr-night-drive-1080p.mp4"
  },
  {
    id: 2,
    title: "Street Culture",
    description: "Unfiltered crowd movement and sound.",
    thumbnail:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://cdn.coverr.co/videos/coverr-dancers-1080p.mp4"
  },
  {
    id: 3,
    title: "Event Build",
    description: "Set design before the doors open.",
    thumbnail:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://cdn.coverr.co/videos/coverr-night-city-1080p.mp4"
  },
  {
    id: 4,
    title: "Crowd Moments",
    description: "No scripts. Just raw moments.",
    thumbnail:
      "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://cdn.coverr.co/videos/coverr-slow-motion-1080p.mp4"
  }
];

const sectionRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const activeVideo = ref<FeedItem | null>(null);
let stopObserver: (() => void) | null = null;

const openVideo = (item: FeedItem) => {
  activeVideo.value = item;
  document.body.style.overflow = "hidden";
};

const closeVideo = () => {
  activeVideo.value = null;
  document.body.style.overflow = "";
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") closeVideo();
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
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  stopObserver?.();
  window.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "";
});
</script>

<template>
  <section
    id="section-live-feed"
    ref="sectionRef"
    class="bg-black text-white"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-32">
      <div class="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div class="space-y-4">
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
            Live Feed
          </p>
          <h2 class="text-4xl font-semibold tracking-tight sm:text-5xl">
            Unfiltered Culture.
          </h2>
          <p class="max-w-2xl text-base text-white/70 sm:text-lg">
            No scripts. No storyboards. Just raw moments that show the energy we
            build with every activation.
          </p>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.35em] text-white/80 transition hover:border-white hover:text-white"
        >
          Watch The Feed
          <span class="text-base">↗</span>
        </button>
      </div>

      <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="(item, index) in videos"
          :key="item.id"
          class="feed-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          :style="{ '--delay': `${index * 90}ms` }"
        >
          <img
            :src="item.thumbnail"
            :alt="item.title"
            class="h-56 w-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />

          <button
            type="button"
            class="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white transition group-hover:border-white"
            :aria-label="`Play ${item.title}`"
            @click="openVideo(item)"
          >
            ▶
          </button>

          <div class="absolute bottom-4 left-4 right-4 space-y-1">
            <h3 class="text-lg font-semibold">{{ item.title }}</h3>
            <p class="text-xs uppercase tracking-[0.3em] text-white/60">
              {{ item.description }}
            </p>
          </div>
        </article>
      </div>
    </div>

    <div
      v-if="activeVideo"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Live feed video"
      @click.self="closeVideo"
    >
      <div class="w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-black">
        <div class="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <p class="text-xs uppercase tracking-[0.35em] text-white/50">Now Playing</p>
            <h3 class="text-lg font-semibold">{{ activeVideo.title }}</h3>
          </div>
          <button
            type="button"
            class="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/70 transition hover:border-white hover:text-white"
            @click="closeVideo"
          >
            Close
          </button>
        </div>
        <video
          v-if="activeVideo"
          class="h-full w-full"
          :src="activeVideo.videoUrl"
          controls
          autoplay
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.feed-card {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: var(--delay, 0ms);
}

.is-visible .feed-card {
  opacity: 1;
  transform: translateY(0);
}
</style>