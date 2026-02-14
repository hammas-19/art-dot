<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useCursor } from "~/composables/useCursor";

const { cursorX, cursorY, cursorVisible } = useCursor();
const isHovering = ref(false);
let checkInterval: number | null = null;

const detectHover = () => {
  if (!cursorVisible.value) {
    isHovering.value = false;
    return;
  }

  const hoveredElement = document.elementFromPoint(cursorX.value, cursorY.value);
  isHovering.value =
    hoveredElement?.matches("a, button, [role='button']") ?? false;
};

onMounted(() => {
  // Check for hover state every 100ms instead of on every cursor position change
  checkInterval = window.setInterval(detectHover, 100);
});

onUnmounted(() => {
  if (checkInterval) {
    clearInterval(checkInterval);
  }
});
</script>

<template>
  <div
    v-if="cursorVisible"
    class="cursor-follower"
    :class="{ 'is-hovering': isHovering }"
    :style="{
      '--x': cursorX,
      '--y': cursorY
    }"
  />
</template>

<style scoped>
.cursor-follower {
  --cursor-size: 14px;
  position: fixed;
  top: 0;
  left: 0;
  width: var(--cursor-size);
  height: var(--cursor-size);
  border-radius: 999px;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  background: rgba(255, 255, 255, 0.35);
  box-shadow:
    0 0 0 2px rgba(255, 255, 255, 0.95),
    0 0 18px rgba(255, 255, 255, 0.35),
    0 0 40px rgba(255, 255, 255, 0.2);
  transform: translate3d(
    calc(var(--x) * 1px - (var(--cursor-size) / 2)),
    calc(var(--y) * 1px - (var(--cursor-size) / 2)),
    0
  );
  transform-origin: center;
  transition: width 0.25s ease, height 0.25s ease, box-shadow 0.25s ease;
  will-change: transform, width, height;
}

.cursor-follower::after {
  content: "";
  position: absolute;
  inset: -10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  opacity: 0.7;
}

.cursor-follower.is-hovering {
  --cursor-size: 34px;
  background: rgba(255, 255, 255, 0.2);
  box-shadow:
    0 0 0 2px rgba(255, 255, 255, 1),
    0 0 24px rgba(255, 255, 255, 0.5),
    0 0 60px rgba(255, 255, 255, 0.35);
}
</style>
