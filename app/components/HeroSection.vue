<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { useTextAnimation } from "@/composables/useTextAnimation";

const heroRef = ref<HTMLElement | null>(null);
const heroVisible = ref(false);
const scrollParallaxY = ref(0);

// GSAP text animations
useTextAnimation(".hero-heading");
useTextAnimation(".hero-subtitle");

let ctx: gsap.Context | null = null;
let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
let scrollHandler: (() => void) | null = null;

const scrollToSection = (id: string, event?: Event) => {
  if (event) event.preventDefault();
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};

const scrollToExplore = () => {
  const aboutSection = document.getElementById("section-about");
  aboutSection?.scrollIntoView({ behavior: "smooth" });
};

onMounted(() => {
  heroVisible.value = true;
  if (!heroRef.value) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Scroll parallax
  scrollHandler = () => {
    scrollParallaxY.value = window.scrollY * 0.12;
  };
  window.addEventListener("scroll", scrollHandler, { passive: true });

  if (prefersReducedMotion) return;

  // GSAP animations context
  ctx = gsap.context(() => {
    // Reveal animation
    gsap.from(".living-tile", {
      opacity: 0,
      scale: 0.94,
      y: 16,
      duration: 0.85,
      stagger: {
        amount: 0.4,
        from: "random",
      },
      ease: "power3.out",
    });

    // Autonomous organic micro-floating
    const floatingTiles = heroRef.value?.querySelectorAll(".living-tile-float");
    floatingTiles?.forEach((tile, i) => {
      const dirY = i % 2 === 0 ? 3.5 : -3.5;
      const dirX = i % 3 === 0 ? 2.5 : -2.5;
      gsap.to(tile, {
        y: dirY,
        x: dirX,
        duration: 4.5 + (i % 3) * 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.25,
      });
    });

    // Mouse parallax tracking
    const heroEl = heroRef.value;
    if (!heroEl) return;

    mouseMoveHandler = (e: MouseEvent) => {
      const rect = heroEl.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      // Parallax for layer elements with data-depth
      const parallaxEls = heroEl.querySelectorAll<HTMLElement>("[data-depth]");
      parallaxEls.forEach((el) => {
        const depth = parseFloat(el.getAttribute("data-depth") || "10");
        gsap.to(el, {
          x: normX * depth,
          y: normY * depth,
          duration: 0.9,
          ease: "power2.out",
          overwrite: "auto",
        });
      });

      // Subtle parallax on hero center
      gsap.to(".hero-center-content", {
        x: normX * 3,
        y: normY * 3,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const mouseLeaveHandler = () => {
      const parallaxEls = heroEl.querySelectorAll<HTMLElement>("[data-depth]");
      parallaxEls.forEach((el) => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
      gsap.to(".hero-center-content", {
        x: 0,
        y: 0,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    heroEl.addEventListener("mousemove", mouseMoveHandler, { passive: true });
    heroEl.addEventListener("mouseleave", mouseLeaveHandler, { passive: true });
  }, heroRef.value);
});

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener("scroll", scrollHandler);
  }
  ctx?.revert();
});
</script>

<template>
  <section
    id="section-hero"
    ref="heroRef"
    class="relative min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col justify-between select-none py-2"
    :class="{ 'is-visible': heroVisible }"
  >
    <!-- Background Ambient Glow Points -->
    <div
      class="absolute top-1/4 left-1/4 w-[32rem] h-[32rem] rounded-full bg-[#d0fc4d]/[0.025] blur-3xl pointer-events-none"
    />
    <div
      class="absolute bottom-1/4 right-1/4 w-[36rem] h-[36rem] rounded-full bg-[#d0fc4d]/[0.02] blur-3xl pointer-events-none"
    />

    <!-- Quiet Center Radial Vignette behind hero copy -->
    <div
      class="absolute inset-0 pointer-events-none z-10"
      style="background: radial-gradient(ellipse 65% 55% at 50% 50%, rgba(5, 5, 5, 0.92) 0%, rgba(5, 5, 5, 0.6) 55%, transparent 100%);"
    />

    <!-- Living Grid Interactive Composition Container (~1200px - 1420px) -->
    <div
      class="relative z-20 mx-auto w-full max-w-[1420px] px-3 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center"
      :style="{ transform: `translate3d(0, ${scrollParallaxY * 0.12}px, 0)` }"
    >
      <!-- ==========================================
           DESKTOP LIVING GRID LAYOUT (>= 1024px)
           ========================================== -->
      <div class="hidden lg:flex flex-col gap-3.5 py-2 w-full">
        <!-- TOP ROW TILES -->
        <div class="grid grid-cols-12 gap-3.5 h-44 xl:h-48">
          <!-- Tile 1: Top-Left Large B&W Portrait Card (3 cols) -->
          <div
            data-depth="14"
            class="living-tile living-tile-float col-span-3 relative overflow-hidden rounded-[26px] border border-[#d0fc4d]/25 bg-[#080808] group transition-all duration-500 hover:border-[#d0fc4d]/75 hover:shadow-[0_0_35px_rgba(208,252,77,0.2)]"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
              alt="Editorial portrait"
              class="absolute inset-0 h-full w-full object-cover object-top grayscale contrast-135 brightness-[0.82] transition-transform duration-700 group-hover:scale-105"
              loading="eager"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/35" />

            <!-- Top Left Metadata -->
            <div class="absolute top-3.5 left-4 flex flex-col space-y-0.5 text-[9px] font-mono tracking-[0.28em] text-white/85 uppercase">
              <span>IDEAS</span>
              <span>PEOPLE</span>
              <span>CULTURE</span>
              <span>IMPACT</span>
            </div>

            <!-- Bottom Left Badge -->
            <div class="absolute bottom-3.5 left-4 text-[10px] font-mono tracking-[0.25em] text-[#d0fc4d]/90 font-medium">
              01 / 04
            </div>

            <!-- Bottom Right Crosshair -->
            <div class="absolute bottom-3.5 right-4 text-[#d0fc4d] text-base font-light transition-transform duration-300 group-hover:rotate-90">
              +
            </div>
          </div>

          <!-- Tile 2: Top-Center-Left Abstract Lime Waves (3 cols) -->
          <div
            data-depth="10"
            class="living-tile living-tile-float col-span-3 relative overflow-hidden rounded-[26px] border border-[#d0fc4d]/25 bg-[#080808] group transition-all duration-500 hover:border-[#d0fc4d]/75 hover:shadow-[0_0_35px_rgba(208,252,77,0.2)]"
          >
            <LivingGridWave density="dense" />

            <!-- Metadata -->
            <div class="absolute top-3.5 left-4 flex flex-col space-y-0.5 text-[9px] font-mono tracking-[0.28em] text-white/85 uppercase pointer-events-none">
              <span>CREATIVE</span>
              <span class="text-[#d0fc4d]">STRATEGY</span>
            </div>
          </div>

          <!-- Tile 3: Top-Center Skater Mid-Air (2 cols) -->
          <div
            data-depth="8"
            class="living-tile col-span-2 relative overflow-hidden rounded-[26px] border border-[#d0fc4d]/25 bg-[#080808] group transition-all duration-500 hover:border-[#d0fc4d]/75 hover:shadow-[0_0_35px_rgba(208,252,77,0.2)]"
          >
            <img
              src="https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=800&q=80"
              alt="Skater mid-air"
              class="absolute inset-0 h-full w-full object-cover object-center grayscale contrast-135 brightness-[0.88] transition-transform duration-700 group-hover:scale-105"
              loading="eager"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25" />
            <div class="absolute top-3 right-3 text-[9px] text-[#d0fc4d]/70 font-mono">+</div>
          </div>

          <!-- Tile 4: Top-Center-Right Sonar Radar (2 cols) -->
          <div
            data-depth="12"
            class="living-tile col-span-2 relative overflow-hidden rounded-[26px] border border-[#d0fc4d]/25 bg-[#080808] group transition-all duration-500 hover:border-[#d0fc4d]/75 hover:shadow-[0_0_35px_rgba(208,252,77,0.2)]"
          >
            <LivingGridSonar />
          </div>

          <!-- Tile 5: Top-Right Brutalist Architecture (2 cols) -->
          <div
            data-depth="14"
            class="living-tile living-tile-float col-span-2 relative overflow-hidden rounded-[26px] border border-[#d0fc4d]/25 bg-[#080808] group transition-all duration-500 hover:border-[#d0fc4d]/75 hover:shadow-[0_0_35px_rgba(208,252,77,0.2)]"
          >
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
              alt="Brutalist architecture"
              class="absolute inset-0 h-full w-full object-cover grayscale contrast-135 brightness-[0.78] transition-transform duration-700 group-hover:scale-105"
              loading="eager"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />
            <div class="absolute top-3.5 right-4 text-right flex flex-col space-y-0.5 text-[9px] font-mono tracking-[0.28em] text-white/85 uppercase">
              <span>GLOBAL</span>
              <span>PERSPECTIVE</span>
            </div>
          </div>
        </div>

        <!-- MIDDLE ROW: LEFT TILES + HERO CENTER CONTENT + RIGHT TILE -->
        <div class="grid grid-cols-12 gap-3.5 items-stretch min-h-[270px] xl:min-h-[300px]">
          <!-- Left Column (3 cols): Tile 6 (Crosshair box) + Tile 7 (Moody Clouds) -->
          <div class="col-span-3 grid grid-cols-2 gap-3.5">
            <!-- Tile 6: Small Crosshair Dark Tile -->
            <div
              data-depth="16"
              class="living-tile relative flex items-center justify-center overflow-hidden rounded-[26px] border border-[#d0fc4d]/25 bg-[#070707] group transition-all duration-500 hover:border-[#d0fc4d]/75 hover:shadow-[0_0_35px_rgba(208,252,77,0.2)] cursor-pointer"
            >
              <div class="text-[#d0fc4d] text-2xl font-light transition-transform duration-500 group-hover:scale-125 group-hover:rotate-90">
                +
              </div>
              <div class="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-[#d0fc4d]/40">SYS.01</div>
            </div>

            <!-- Tile 7: Moody Clouds & Concrete -->
            <div
              data-depth="11"
              class="living-tile relative overflow-hidden rounded-[26px] border border-[#d0fc4d]/25 bg-[#080808] group transition-all duration-500 hover:border-[#d0fc4d]/75 hover:shadow-[0_0_35px_rgba(208,252,77,0.2)]"
            >
              <img
                src="https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?auto=format&fit=crop&w=600&q=80"
                alt="Clouds over architecture"
                class="absolute inset-0 h-full w-full object-cover grayscale contrast-130 brightness-[0.82] transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/35" />
            </div>
          </div>

          <!-- HERO CENTER CONTENT (6 cols) -->
          <div class="col-span-6 flex flex-col items-center justify-center text-center px-4 py-4 relative z-30 hero-center-content">
            <h1 class="hero-heading fade-in text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4.1rem] font-medium tracking-tight leading-[1.08] text-white">
              Culture moves faster <br />
              than your <span class="text-accent font-semibold text-[#d0fc4d]">strategy.</span>
            </h1>

            <p class="hero-subtitle fade-in mt-5 max-w-xl text-[0.78rem] xl:text-[0.84rem] font-light uppercase tracking-[0.24em] text-light-70 leading-relaxed">
              We bridge the gap between brands and the generation that drives them. No fluff. Just impact.
            </p>

            <div class="fade-in mt-7">
              <a
                href="#section-pricing"
                class="pointer-events-auto inline-flex items-center justify-center gap-2 border border-white/20 bg-black/50 backdrop-blur-md px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.3em] text-white transition-all duration-500 hover:text-black hover:bg-[#d0fc4d] hover:border-[#d0fc4d] hover:shadow-[0_0_30px_rgba(208,252,77,0.45)] rounded-full"
              >
                START A PROJECT <span>→</span>
              </a>
            </div>
          </div>

          <!-- Right Column (3 cols): Tile 8 (Youth Culture Portrait in Sunglasses) -->
          <div
            data-depth="15"
            class="living-tile living-tile-float col-span-3 relative overflow-hidden rounded-[26px] border border-[#d0fc4d]/25 bg-[#080808] group transition-all duration-500 hover:border-[#d0fc4d]/75 hover:shadow-[0_0_35px_rgba(208,252,77,0.2)]"
          >
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80"
              alt="Youth creative with sunglasses"
              class="absolute inset-0 h-full w-full object-cover object-center grayscale contrast-135 brightness-[0.8] transition-transform duration-700 group-hover:scale-105"
              loading="eager"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />

            <!-- Top Right Metadata -->
            <div class="absolute top-3.5 right-4 text-right flex flex-col space-y-0.5 text-[9px] font-mono tracking-[0.28em] text-white/85 uppercase">
              <span>BRANDS</span>
              <span>CULTURE</span>
              <span class="text-[#d0fc4d]">YOUTH</span>
              <span>CREATIVE</span>
            </div>
          </div>
        </div>

        <!-- BOTTOM ROW TILES -->
        <div class="grid grid-cols-12 gap-3.5 h-44 xl:h-48">
          <!-- Tile 9: Bottom-Left Abstract Acoustic Waves (3 cols) -->
          <div
            data-depth="15"
            class="living-tile living-tile-float col-span-3 relative overflow-hidden rounded-[26px] border border-[#d0fc4d]/25 bg-[#080808] group transition-all duration-500 hover:border-[#d0fc4d]/75 hover:shadow-[0_0_35px_rgba(208,252,77,0.2)]"
          >
            <LivingGridWave density="minimal" />
            <div class="absolute bottom-3.5 left-4 flex flex-col space-y-0.5 text-[9px] font-mono tracking-[0.26em] text-white/85 uppercase pointer-events-none">
              <span>REAL</span>
              <span>CONNECTIONS</span>
              <span>LAST LONGER</span>
              <span class="text-[#d0fc4d]">—</span>
            </div>
          </div>

          <!-- Tile 10: Streetwear Sneaker Close-up (2 cols) -->
          <div
            data-depth="11"
            class="living-tile col-span-2 relative overflow-hidden rounded-[26px] border border-[#d0fc4d]/25 bg-[#080808] group transition-all duration-500 hover:border-[#d0fc4d]/75 hover:shadow-[0_0_35px_rgba(208,252,77,0.2)]"
          >
            <img
              src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80"
              alt="Streetwear sneaker"
              class="absolute inset-0 h-full w-full object-cover grayscale contrast-130 brightness-[0.8] transition-transform duration-700 group-hover:scale-105"
              loading="eager"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
            <div class="absolute bottom-3.5 left-4 text-[9px] font-mono tracking-[0.25em] text-[#d0fc4d]/90 font-medium">
              02 / 04
            </div>
          </div>

          <!-- Tile 11: Dark Ambient Card with Lime Bleed (3 cols) -->
          <div
            data-depth="9"
            class="living-tile col-span-3 relative overflow-hidden rounded-[26px] border border-[#d0fc4d]/25 bg-[#060606] group transition-all duration-500 hover:border-[#d0fc4d]/75 hover:shadow-[0_0_35px_rgba(208,252,77,0.2)]"
          >
            <!-- Ambient lime light bleed -->
            <div
              class="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-[#d0fc4d]/12 blur-2xl transition-opacity duration-700 group-hover:opacity-95"
            />
            <div class="absolute top-4 left-5 flex flex-col space-y-1 text-[9px] font-mono tracking-[0.26em] text-white/85 uppercase">
              <span class="text-[#d0fc4d] text-base">→</span>
              <span>BUILDING BRANDS</span>
              <span>FOR TOMORROW</span>
            </div>
          </div>

          <!-- Tile 12: Concert Crowd (2 cols) -->
          <div
            data-depth="12"
            class="living-tile col-span-2 relative overflow-hidden rounded-[26px] border border-[#d0fc4d]/25 bg-[#080808] group transition-all duration-500 hover:border-[#d0fc4d]/75 hover:shadow-[0_0_35px_rgba(208,252,77,0.2)]"
          >
            <img
              src="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=800&q=80"
              alt="Concert crowd"
              class="absolute inset-0 h-full w-full object-cover grayscale contrast-135 brightness-[0.8] transition-transform duration-700 group-hover:scale-105"
              loading="eager"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />
            <div class="absolute top-3.5 right-4 text-[#d0fc4d] text-base font-light">+</div>
          </div>

          <!-- Tile 13: Botanical Leaves with Glowing Lime Rim (2 cols) -->
          <div
            data-depth="14"
            class="living-tile living-tile-float col-span-2 relative overflow-hidden rounded-[26px] border border-[#d0fc4d]/25 bg-[#080808] group transition-all duration-500 hover:border-[#d0fc4d]/75 hover:shadow-[0_0_35px_rgba(208,252,77,0.2)]"
          >
            <img
              src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80"
              alt="Moody tropical foliage"
              class="absolute inset-0 h-full w-full object-cover grayscale contrast-135 brightness-[0.78] transition-transform duration-700 group-hover:scale-105"
              loading="eager"
            />
            <!-- Glowing lime rim filter effect on leaves -->
            <div class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#d0fc4d]/20 mix-blend-screen pointer-events-none" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />

            <div class="absolute bottom-3.5 right-4 text-[9px] font-mono tracking-[0.25em] text-[#d0fc4d]/90 border-b border-[#d0fc4d]/50 pb-0.5">
              01 / 04
            </div>
          </div>
        </div>
      </div>

      <!-- ==========================================
           TABLET & MOBILE LIVING GRID (< 1024px)
           ========================================== -->
      <div class="lg:hidden flex flex-col items-center justify-center py-6 w-full gap-8">
        <!-- Hero Copy -->
        <div class="flex flex-col items-center justify-center text-center space-y-5 w-full pt-4">
          <h1 class="hero-heading fade-in text-4xl sm:text-5xl font-medium tracking-tight text-white leading-[1.12]">
            Culture moves faster <br />
            than your <span class="text-accent font-semibold text-[#d0fc4d]">strategy.</span>
          </h1>
          <p class="hero-subtitle fade-in max-w-lg text-sm font-light uppercase tracking-[0.22em] text-light-70 leading-relaxed">
            We bridge the gap between brands and the generation that drives them. No fluff. Just impact.
          </p>
          <div class="fade-in pt-2">
            <a
              href="#section-pricing"
              class="pointer-events-auto inline-flex items-center justify-center gap-2 border border-white/25 bg-black/50 backdrop-blur-md px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition-all duration-300 hover:text-black hover:bg-[#d0fc4d] rounded-full"
            >
              START A PROJECT <span>→</span>
            </a>
          </div>
        </div>

        <!-- Curated Bento Grid on Mobile & Tablet -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl px-2">
          <!-- Mobile Tile 1: Wave -->
          <div class="relative h-32 sm:h-36 overflow-hidden rounded-2xl border border-[#d0fc4d]/25 bg-[#080808]">
            <LivingGridWave density="minimal" :interactive="false" />
            <div class="absolute top-2.5 left-2.5 text-[8px] font-mono tracking-widest text-[#d0fc4d]">CREATIVE</div>
          </div>

          <!-- Mobile Tile 2: Skater -->
          <div class="relative h-32 sm:h-36 overflow-hidden rounded-2xl border border-[#d0fc4d]/25 bg-[#080808]">
            <img
              src="https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=600&q=80"
              alt="Skater"
              class="absolute inset-0 h-full w-full object-cover grayscale brightness-[0.8]"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div class="absolute bottom-2.5 left-2.5 text-[8px] font-mono tracking-widest text-white/80">01 / 04</div>
          </div>

          <!-- Mobile Tile 3: Sonar -->
          <div class="relative h-32 sm:h-36 overflow-hidden rounded-2xl border border-[#d0fc4d]/25 bg-[#080808]">
            <LivingGridSonar />
          </div>

          <!-- Mobile Tile 4: Portrait -->
          <div class="relative h-32 sm:h-36 overflow-hidden rounded-2xl border border-[#d0fc4d]/25 bg-[#080808]">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
              alt="Editorial portrait"
              class="absolute inset-0 h-full w-full object-cover grayscale brightness-[0.8]"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div class="absolute bottom-2.5 right-2.5 text-[8px] font-mono tracking-widest text-[#d0fc4d]">+</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==========================================
         BOTTOM CONTROLS & NAVIGATION (Preserved)
         ========================================== -->
    <div class="relative z-30 w-full flex flex-col items-center gap-5 sm:gap-6 pb-4 sm:pb-6 pt-2">
      <button
        class="pointer-events-auto fade-in flex items-center gap-2 sm:gap-3 text-xs sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-light-60 transition hover:text-[#d0fc4d] px-3 py-1 sm:px-0 sm:py-0"
        style="transition-delay: 280ms"
        @click="scrollToExplore"
      >
        ( Scroll to Explore )
      </button>

      <nav
        class="fade-in flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-xs sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-light-60 w-full px-2 sm:px-0"
        style="transition-delay: 340ms"
      >
        <a
          href="#section-about"
          class="pointer-events-auto flex items-center gap-1 sm:gap-2 hover:text-[#d0fc4d] transition whitespace-nowrap"
          @click="(e) => scrollToSection('section-about', e)"
        >
          <span class="text-[#d0fc4d]">•</span>01 About Us
        </a>
        <a
          href="#section-capabilities"
          class="pointer-events-auto flex items-center gap-1 sm:gap-2 hover:text-[#d0fc4d] transition whitespace-nowrap"
          @click="(e) => scrollToSection('section-capabilities', e)"
        >
          <span class="text-[#d0fc4d]">•</span>02 Capabilities
        </a>
        <a
          href="#section-stats"
          class="pointer-events-auto flex items-center gap-1 sm:gap-2 hover:text-[#d0fc4d] transition whitespace-nowrap"
          @click="(e) => scrollToSection('section-stats', e)"
        >
          <span class="text-[#d0fc4d]">•</span>03 Reach & Impact
        </a>
        <a
          href="#section-process"
          class="pointer-events-auto flex items-center gap-1 sm:gap-2 hover:text-[#d0fc4d] transition whitespace-nowrap"
          @click="(e) => scrollToSection('section-process', e)"
        >
          <span class="text-[#d0fc4d]">•</span>04 Our Process
        </a>
      </nav>
    </div>
  </section>
</template>

<style scoped>
.fade-in {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.is-visible .fade-in {
  opacity: 1;
  transform: translateY(0);
}

.living-tile {
  will-change: transform, border-color, box-shadow;
  backface-visibility: hidden;
}
</style>