<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import gsap from "gsap";

const sectionRef = ref<HTMLElement | null>(null);
const phoneShellRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
let stopObserver: (() => void) | null = null;

const videoId = "dQw4w9WgXcQ";
const videoEmbedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&mute=1&controls=0&loop=1&playlist=${videoId}`;

onMounted(() => {
  const { stop } = useIntersectionObserver(
    sectionRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting) isVisible.value = true;
    },
    { threshold: 0.2 }
  );
  stopObserver = stop;

  // Mouse parallax 3D tilt effect
  if (phoneShellRef.value && sectionRef.value) {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = phoneShellRef.value!.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      let rotationY = ((mouseX - centerX) / rect.width) * 25;
      let rotationX = ((centerY - mouseY) / rect.height) * 25;
      
      // Clamp rotations to prevent flipping
      rotationX = Math.max(-20, Math.min(20, rotationX));
      rotationY = Math.max(-20, Math.min(20, rotationY));
      
      gsap.to(phoneShellRef.value, {
        rotationX,
        rotationY,
        duration: 0.6,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(phoneShellRef.value, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.6,
        ease: "power2.out"
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }
});

onUnmounted(() => {
  stopObserver?.();
});
</script>

<template>
  <section
    id="section-live-feed"
    ref="sectionRef"
    class="bg-black text-white"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="mx-auto max-w-[110rem] px-6 py-20 lg:px-10 lg:py-28">
      <div class="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
        <div class="space-y-6">
          <div class="flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-red-400">
            <span class="h-2 w-2 rounded-full bg-red-500" />
            Live Feed
          </div>
          <h2 class="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Unfiltered
            <span class="block text-white/60">Culture.</span>
          </h2>
          <p class="max-w-xl text-lg text-white/60 sm:text-xl">
            No scripts. No storyboards. Just raw moments from the artists and
            events shaping the timeline right now.
          </p>
          <button
            type="button"
            class="inline-flex items-center gap-4 rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-black transition hover:bg-amber-200"
          >
            Watch The Feed
            <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
              ▶
            </span>
          </button>
        </div>

        <div class="feed-card relative flex items-center justify-center">
          <div class="phone-shell" ref="phoneShellRef">
            <div class="phone-notch" />
            <div class="phone-screen">
              <iframe
                class="h-full w-full"
                :src="videoEmbedUrl"
                title="Live feed sample"
                frameborder="0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowfullscreen
              />
            </div>
            <div class="phone-like">❤</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.feed-card {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  perspective: 1200px;
}

.is-visible .feed-card {
  opacity: 1;
  transform: translateY(0);
}

.phone-shell {
  position: relative;
  width: min(320px, 82vw);
  aspect-ratio: 9 / 18;
  border-radius: 40px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.02));
  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.6),
    inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  padding: 14px;
  overflow: hidden;
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
  transform-origin: center center;
}

.phone-screen {
  width: 100%;
  height: 100%;
  border-radius: 30px;
  overflow: hidden;
  background: #000;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.phone-notch {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 22px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.8);
  z-index: 2;
}

.phone-like {
  position: absolute;
  right: 22px;
  bottom: 28px;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #f43f5e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  z-index: 2;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.35);
}
</style>