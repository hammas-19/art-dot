import { onMounted, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

export const useTextAnimation = (selector: string, options = { threshold: 0.3 }) => {
  const isAnimated = ref(false);
  const timeline = ref<gsap.core.Timeline | null>(null);
  let stopObserver: (() => void) | null = null;

  onMounted(() => {
    try {
      // Register the SplitText plugin
      gsap.registerPlugin(SplitText);

      // Get the element
      const element = document.querySelector(selector);
      if (!element) {
        console.warn(`Element with selector "${selector}" not found`);
        return;
      }

      // Use intersection observer to animate only when element comes into view
      const { stop } = useIntersectionObserver(
        element as HTMLElement,
        ([entry]) => {
          if (entry.isIntersecting && !isAnimated.value) {
            animateText();
            isAnimated.value = true;
            // Optional: cleanup after animation
            stop();
          }
        },
        options
      );
      stopObserver = stop;
    } catch (error) {
      console.error("Text animation setup error:", error);
    }
  });

  const animateText = () => {
    try {
      const element = document.querySelector(selector);
      if (!element) return;

      // Create the split text
      const mySplitText = SplitText.create(selector, {
        type: "words,chars",
      });
      const chars = mySplitText.chars;

      // Set perspective on the parent element
      gsap.set(selector, { perspective: 400 });

      // Create timeline
      const tl = gsap.timeline();

      tl.from(chars, {
        duration: 0.8,
        opacity: 0,
        scale: 0,
        y: 80,
        rotationX: 180,
        transformOrigin: "0% 50% -50",
        ease: "back",
        stagger: 0.01,
      });

      timeline.value = tl;
    } catch (error) {
      console.error("Text animation error:", error);
    }
  };

  const restart = () => {
    if (timeline.value) {
      timeline.value.restart();
    }
  };

  onUnmounted(() => {
    stopObserver?.();
  });

  return {
    isAnimated,
    restart,
  };
};
