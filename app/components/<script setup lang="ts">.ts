<script setup lang="ts">
import gsap from "gsap";
import { ref, onMounted, nextTick } from "vue";

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
const circleEls = ref<HTMLElement[]>([]);

const setters = ref<Array<{
  rotateX: (val: number) => void;
  rotateY: (val: number) => void;
}>>([]);

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

const handleCircleHover = (e: MouseEvent, index: number) => {
  const circle = circleEls.value[index];
  if (!circle) return;

  const rect = circle.getBoundingClientRect();
  const setter = setters.value[index];

  const handleMove = (ev: MouseEvent) => {
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (ev.clientX - centerX) / (rect.width / 2);
    const dy = (ev.clientY - centerY) / (rect.height / 2);

    const rotX = -dy * 12;
    const rotY = dx * 12;

    setter.rotateX(rotX);
    setter.rotateY(rotY);
  };

  const handleLeave = () => {
    document.removeEventListener("pointermove", handleMove);
    document.removeEventListener("pointerleave", handleLeave);

    gsap.to(circle, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power3.out",
      overwrite: "auto"
    });
  };

  document.addEventListener("pointermove", handleMove, { passive: true });
  document.addEventListener("pointerleave", handleLeave);
};

const registerCircleRef = (el: HTMLElement | null) => {
  if (el) circleEls.value.push(el);
};

onMounted(() => {
  if (!mainRef.value) return;

  const rect = mainRef.value.getBoundingClientRect();
  gridWidth.value = rect.width;
  gridHeight.value = rect.height;
  generateCircles(gridWidth.value, gridHeight.value);

  nextTick(() => {
    setters.value = circleEls.value.map((el) => ({
      rotateX: gsap.quickSetter(el, "rotateX", "deg"),
      rotateY: gsap.quickSetter(el, "rotateY", "deg")
    }));
  });
});
</script>

<template>
  <div ref="mainRef" class="main h-screen w-full">
    <div class="circles-grid">
      <div
        v-for="(circle, index) in circles"
        :key="circle.id"
        :ref="registerCircleRef"
        class="circle-item"
        :style="{
          left: `${circle.x}px`,
          top: `${circle.y}px`
        }"
        @mouseenter="handleCircleHover($event, index)"
      />
    </div>
  </div>
</template>

<style scoped>
.main {
  position: relative;
  overflow: hidden;
  background: #0a0a0a;
  perspective: 1000px;
}

.circles-grid {
  position: absolute;
  inset: 0;
}

.circle-item {
  position: absolute;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(255, 255, 255, 0.15);
  will-change: transform;
  transform-style: preserve-3d;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.circle-item:hover {
  border-color: rgba(0, 255, 209, 0.8);
  box-shadow: 
    0 0 15px 2px rgba(0, 255, 209, 0.6),
    0 0 30px 8px rgba(0, 255, 209, 0.3),
    inset 0 0 20px rgba(0, 255, 209, 0.2);
}
</style>