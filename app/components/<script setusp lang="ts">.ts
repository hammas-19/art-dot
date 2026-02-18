<script setup lang="ts">
import gsap from "gsap";
import { ref, computed, onMounted, nextTick } from "vue";

const mainRef = ref<HTMLDivElement | null>(null);
const cellSize = 54;
const circleSize = 46;

interface Circle {
  id: number;
  row: number;
  col: number;
  x: number;
  y: number;
  isFilled: boolean;
}

const circles = ref<Circle[]>([]);
const gridWidth = ref(0);
const gridHeight = ref(0);

const generateCircles = (width: number, height: number) => {
  const cols = Math.ceil(width / cellSize) + 2;
  const rows = Math.ceil(height / cellSize) + 2;
  
  const generated: Circle[] = [];
  let id = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      generated.push({
        id: id++,
        row,
        col,
        x: col * cellSize + cellSize / 2,
        y: row * cellSize + cellSize / 2,
        isFilled: false
      });
    }
  }

  circles.value = generated;
};

const handleCircleHover = (e: MouseEvent) => {
  const circle = e.currentTarget as HTMLElement;
  
  gsap.to(circle, {
    "--glow-opacity": 1,
    duration: 0,
    ease: "power2.out"
  } as any);
};

const handleCircleLeave = (e: MouseEvent) => {
  const circle = e.currentTarget as HTMLElement;
  
  gsap.to(circle, {
    "--glow-opacity": 0,
    duration: 0.5,
    ease: "power2.inOut"
  } as any);
};

onMounted(() => {
  if (!mainRef.value) return;
  
  const rect = mainRef.value.getBoundingClientRect();
  gridWidth.value = rect.width;
  gridHeight.value = rect.height;
  generateCircles(gridWidth.value, gridHeight.value);
});
</script>

<template>
  <div ref="mainRef" class="main h-screen w-full">
    <div class="circles-grid">
      <div
        v-for="circle in circles"
        :key="circle.id"
        class="circle-item"
        :class="{ filled: circle.isFilled }"
        :style="{
          left: `${circle.x}px`,
          top: `${circle.y}px`,
          '--glow-opacity': 0
        }"
        @mouseenter="handleCircleHover"
        @mouseleave="handleCircleLeave"
      />
    </div>
  </div>
</template>

<style scoped>
.main {
  position: relative;
  overflow: hidden;
  background: #0a0a0a;
}

.circles-grid {
  position: absolute;
  inset: 0;
}

.circle-item {
  --glow-opacity: 0;
  position: absolute;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 rgba(0, 255, 209, 0);
  will-change: box-shadow;
}

.circle-item:hover {
  border-color: rgba(0, 255, 209, 0.8);
  box-shadow: 
    0 0 15px 2px rgba(0, 255, 209, var(--glow-opacity)),
    0 0 30px 8px rgba(0, 255, 209, calc(var(--glow-opacity) * 0.5)),
    inset 0 0 20px rgba(0, 255, 209, calc(var(--glow-opacity) * 0.3));
}
</style>