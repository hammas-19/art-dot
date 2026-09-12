<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const props = withDefaults(
  defineProps<{
    density?: "dense" | "minimal";
    accentColor?: string;
    interactive?: boolean;
  }>(),
  {
    density: "dense",
    accentColor: "#d0fc4d",
    interactive: true,
  }
);

const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number | null = null;
let time = 0;
let mouseX = 0.5;
let mouseY = 0.5;
let targetMouseX = 0.5;
let targetMouseY = 0.5;

const handleMouseMove = (e: MouseEvent) => {
  if (!props.interactive || !canvasRef.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  targetMouseX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  targetMouseY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
};

const handleMouseLeave = () => {
  targetMouseX = 0.5;
  targetMouseY = 0.5;
};

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = (canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1) || 400);
  let height = (canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1) || 200);

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.contentRect.width && entry.contentRect.height) {
        width = canvas.width = entry.contentRect.width * (window.devicePixelRatio || 1);
        height = canvas.height = entry.contentRect.height * (window.devicePixelRatio || 1);
      }
    }
  });
  resizeObserver.observe(canvas);

  const lineCount = props.density === "dense" ? 16 : 8;

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    // Smooth mouse lerp
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    if (!prefersReducedMotion) {
      time += 0.014;
    }

    const centerY = height * 0.52;
    const baseAmplitude = height * 0.24;

    for (let i = 0; i < lineCount; i++) {
      const progress = i / lineCount;
      const opacity = Math.sin(progress * Math.PI) * 0.85 + 0.12;
      const linePhase = time * 0.85 + i * 0.2;
      const mouseInfluence = (mouseY - 0.5) * height * 0.28;

      ctx.beginPath();
      ctx.lineWidth = (props.density === "dense" ? 1.3 : 1.6) * (window.devicePixelRatio || 1);
      ctx.strokeStyle = `rgba(208, 252, 77, ${opacity.toFixed(3)})`;
      ctx.shadowColor = "rgba(208, 252, 77, 0.4)";
      ctx.shadowBlur = i % 3 === 0 ? 8 : 0;

      const points = 50;
      for (let j = 0; j <= points; j++) {
        const x = (j / points) * width;
        const normX = j / points;
        const envelope = Math.sin(normX * Math.PI);
        const wave =
          Math.sin(normX * 7.5 + linePhase) * 0.65 +
          Math.sin(normX * 3.8 - linePhase * 0.7 + i * 0.18) * 0.35;

        const dynamicAmp =
          baseAmplitude * (1 + (progress - 0.5) * 0.55) * (1 + (mouseX - 0.5) * 0.35);
        const y = centerY + wave * dynamicAmp * envelope + (progress - 0.5) * 40 + mouseInfluence * envelope;

        if (j === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(draw);
    }
  };

  draw();

  onUnmounted(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    resizeObserver.disconnect();
  });
});
</script>

<template>
  <div
    class="relative h-full w-full overflow-hidden bg-[#040404]"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <canvas ref="canvasRef" class="h-full w-full block pointer-events-auto" />
    <div
      class="absolute inset-0 bg-gradient-to-r from-[#040404]/60 via-transparent to-[#040404]/70 pointer-events-none"
    />
  </div>
</template>
