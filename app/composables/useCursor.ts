import { ref, onMounted, onUnmounted } from "vue";

export const useCursor = () => {
  const cursorX = ref(0);
  const cursorY = ref(0);
  const cursorVisible = ref(false);

  let mouseX = 0;
  let mouseY = 0;
  let rafId: number | null = null;
  let enabled = false;

  const handleMouseMove = (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorVisible.value = true;
  };

  const handleMouseLeave = () => {
    cursorVisible.value = false;
  };

  const animateCursor = () => {
    const speed = 0.15;
    cursorX.value += (mouseX - cursorX.value) * speed;
    cursorY.value += (mouseY - cursorY.value) * speed;
    rafId = requestAnimationFrame(animateCursor);
  };

  const enable = () => {
    if (enabled) return;
    enabled = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    animateCursor();
  };

  const disable = () => {
    if (!enabled) return;
    enabled = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseleave", handleMouseLeave);
    cursorVisible.value = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const handleResize = () => {
    if (window.innerWidth > 1024) {
      enable();
    } else {
      disable();
    }
  };

  onMounted(() => {
    if (window.innerWidth > 1024) {
      enable();
    }

    window.addEventListener("resize", handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
    disable();
  });

  return { cursorX, cursorY, cursorVisible };
};
