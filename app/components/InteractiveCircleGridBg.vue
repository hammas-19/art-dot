<script setup lang="ts">
import gsap from "gsap";
import { ref, onMounted, onUnmounted } from "vue";

const mainRef = ref<HTMLDivElement | null>(null);
const cellSize = 90;

interface Circle {
  id: number;
  x: number;
  y: number;
}

const circles = ref<Circle[]>([]);

const generateCircles = (width: number, height: number) => {
  const cols = Math.ceil(width / cellSize) + 2;
  const rows = Math.ceil(height / cellSize) + 2;
  const generated: Circle[] = [];
  let id = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      generated.push({
        id: id++,
        x: col * cellSize + cellSize / 2,
        y: row * cellSize + cellSize / 2,
      });
    }
  }
  circles.value = generated;
};

const handleCircleHover = (e: MouseEvent) => {
  gsap.to(e.currentTarget as HTMLElement, {
    borderRadius: "50%",
    borderColor: "rgba(255,255,255,0.5)",
    boxShadow: "0 0 18px 3px #ffffff,0.55), 0 0 40px 10px #ffffff,0.25), inset 0 0 20px #ffffff,0.2)",
    duration: 0.4,
    ease: "power2.out",
  });
};

const handleCircleLeave = (e: MouseEvent) => {
  gsap.to(e.currentTarget as HTMLElement, {
    borderRadius: "20%",
    borderColor: "rgba(255,255,255,0.18)",
    boxShadow: "0 0 0px 0px #ffffff,0)",
    duration: 0.4,
    ease: "power2.inOut",
  });
};

let ro: ResizeObserver | null = null;

onMounted(() => {
  if (!mainRef.value) return;

  // Use ResizeObserver so dimensions are always accurate
  ro = new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;
    if (width && height) generateCircles(width, height);
  });
  ro.observe(mainRef.value);
});

onUnmounted(() => {
  ro?.disconnect();
});
</script>

<template>
  <div ref="mainRef" class="circle-bg">
    <div
      v-for="circle in circles"
      :key="circle.id"
      class="circle-item"
      :style="{ left: `${circle.x}px`, top: `${circle.y}px` }"
      @mouseenter="handleCircleHover"
      @mouseleave="handleCircleLeave"
    />
  </div>
</template>

<style scoped>
.circle-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  /* no background here — hero section owns the bg color */
  pointer-events: none; /* container transparent to events… */
}

.circle-item {
  position: absolute;
  width: 70px;
  height: 70px;
  border-radius: 20%;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 0 0px 0px rgba(var(--color-accent-rgb), 0);
  will-change: box-shadow, border-radius, border-color;
  pointer-events: auto; /* …but each cell catches mouse */
  cursor: pointer;
}
</style>