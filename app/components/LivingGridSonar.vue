<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";

const props = withDefaults(
  defineProps<{
    accentColor?: string;
  }>(),
  {
    accentColor: "#d0fc4d",
  }
);

const sonarContainer = ref<HTMLElement | null>(null);
let ctx: gsap.Context | null = null;

onMounted(() => {
  if (!sonarContainer.value) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  ctx = gsap.context(() => {
    // Pulse center orb
    gsap.to(".sonar-core-dot", {
      scale: 1.35,
      opacity: 1,
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Expanding concentric pulse waves
    gsap.to(".sonar-wave-1", {
      scale: 2.2,
      opacity: 0,
      duration: 2.8,
      repeat: -1,
      ease: "power1.out",
    });

    gsap.to(".sonar-wave-2", {
      scale: 2.6,
      opacity: 0,
      duration: 2.8,
      delay: 1.4,
      repeat: -1,
      ease: "power1.out",
    });

    // Slow sweeping radar beam
    gsap.to(".sonar-sweep", {
      rotation: 360,
      duration: 6.5,
      repeat: -1,
      ease: "none",
      transformOrigin: "center center",
    });
  }, sonarContainer.value);
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<template>
  <div
    ref="sonarContainer"
    class="relative h-full w-full flex items-center justify-center overflow-hidden bg-[#040404]"
  >
    <!-- Background Polar Grid Lines -->
    <svg
      class="absolute inset-0 h-full w-full opacity-40 pointer-events-none"
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
    >
      <line x1="0" y1="100" x2="200" y2="100" stroke="#d0fc4d" stroke-width="0.75" stroke-dasharray="2 4" />
      <line x1="100" y1="0" x2="100" y2="200" stroke="#d0fc4d" stroke-width="0.75" stroke-dasharray="2 4" />
      <circle cx="100" cy="100" r="28" fill="none" stroke="#d0fc4d" stroke-width="0.75" />
      <circle cx="100" cy="100" r="54" fill="none" stroke="#d0fc4d" stroke-width="0.75" stroke-dasharray="3 3" />
      <circle cx="100" cy="100" r="78" fill="none" stroke="#d0fc4d" stroke-width="0.75" />
    </svg>

    <!-- Radar Sweep Effect -->
    <div
      class="sonar-sweep absolute w-48 h-48 rounded-full pointer-events-none opacity-40"
      style="background: conic-gradient(from 0deg at 50% 50%, rgba(208, 252, 77, 0.5) 0deg, rgba(208, 252, 77, 0) 60deg, transparent 360deg);"
    />

    <!-- Expanding Pulse Wave 1 -->
    <div
      class="sonar-wave-1 absolute w-14 h-14 rounded-full border border-[#d0fc4d]/70 pointer-events-none"
    />

    <!-- Expanding Pulse Wave 2 -->
    <div
      class="sonar-wave-2 absolute w-14 h-14 rounded-full border border-[#d0fc4d]/50 pointer-events-none"
    />

    <!-- Inner Fixed Ring -->
    <div
      class="absolute w-12 h-12 rounded-full border border-[#d0fc4d]/40 pointer-events-none"
    />

    <!-- Central Glowing Core Orb -->
    <div
      class="sonar-core-dot relative z-10 w-4 h-4 rounded-full bg-[#d0fc4d] shadow-[0_0_20px_#d0fc4d,0_0_40px_rgba(208,252,77,0.7)]"
    />

    <!-- Corner Crosshairs -->
    <span class="absolute top-2.5 left-2.5 text-[9px] text-[#d0fc4d]/60 font-mono tracking-widest">+</span>
    <span class="absolute bottom-2.5 right-2.5 text-[9px] text-[#d0fc4d]/60 font-mono tracking-widest">+</span>
  </div>
</template>
