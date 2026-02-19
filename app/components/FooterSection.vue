<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

const sectionRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
let stopObserver: (() => void) | null = null;

const scrollToTop = () => {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(() => {
  const { stop } = useIntersectionObserver(
    sectionRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting) isVisible.value = true;
    },
    { threshold: 0.15 }
  );
  stopObserver = stop;
});

onUnmounted(() => {
  stopObserver?.();
});
</script>

<template>
  <footer
    id="section-footer"
    ref="sectionRef"
    class="bg-black text-white"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="mx-auto max-w-[110rem] px-6 py-20 lg:px-10 lg:py-28">
      <div class="flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.45em] text-accent/80">
        <span class="inline-block h-px w-8 bg-accent/70" />
        To partner with us
      </div>

      <div class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div class="">
          <h2 class="thank-title thank-animate font-semibold uppercase tracking-tight">
            Thank
          </h2>
          <h2 class="thank-title thank-animate font-semibold uppercase tracking-tight">
            You
          </h2>
        </div>
        <div class="flex items-end justify-start lg:justify-end">
          <span class="text-xs uppercase tracking-[0.4em] text-white/40">To partner with us</span>
        </div>
      </div>

      <div class="mt-10 border-t border-white/10" />

      <div class="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.7fr)]">
        <div class="space-y-4">
          <p class="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-accent/80">Get in touch</p>
          <a
            href="mailto:Enquiry@artdotagency.co.uk"
            class="text-3xl font-semibold text-light transition hover:text-accent-hover lg:text-4xl"
          >
            Enquiry@artdotagency.co.uk
          </a>
        </div>

        <div class="space-y-4">
          <p class="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-accent/80">Visit us</p>
          <a
            href="https://artdotquarter.io"
            target="_blank"
            rel="noreferrer"
            class="inline-flex items-center gap-2 text-xl font-semibold text-light transition hover:text-accent-hover lg:text-2xl"
          >
            artdotquarter.io
            <span class="text-accent">↗</span>
          </a>
          <p class="text-base uppercase tracking-[0.3em] text-light-50">
            14-15 Allison Street, Birmingham
            <br />
            United Kingdom
          </p>
        </div>

        <div class="space-y-4 lg:text-right">
          <p class="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-accent/80">Follow us</p>
          <div class="flex items-center gap-3 lg:justify-end">
            <a href="#" class="social-chip" aria-label="Instagram">IG</a>
            <a href="#" class="social-chip" aria-label="Facebook">FB</a>
            <a href="#" class="social-chip" aria-label="TikTok">TT</a>
          </div>
        </div>
      </div>

      <div class="mt-12 border-t border-white/10" />

      <div class="mt-8 flex flex-col gap-6 text-xs uppercase tracking-[0.35em] text-light-45 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 artdotagency. All Rights Reserved.</span>
        <button
          type="button"
          class="inline-flex items-center gap-2 text-accent transition hover:text-accent-hover"
          @click="scrollToTop"
        >
          Back to top ↑
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.thank-title {
  font-size: clamp(4.5rem, 12vw, 9rem);
  line-height: 0.95;
}

.thank-animate {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.is-visible .thank-animate {
  opacity: 1;
  transform: translateY(0);
}

.social-chip {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-accent-dark);
  color: #111;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 12px 26px rgba(var(--color-accent-rgb), 0.2);
}

.social-chip:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 34px rgba(var(--color-accent-rgb), 0.35);
}
</style>
