<template>
  <section
    id="section-hero"
    ref="sectionRef"
    class="relative min-h-screen bg-gradient-to-t from-[#000000] via-[#000000] to-[#0a0a0a] text-white overflow-hidden"
    :class="{ 'is-visible': heroVisible }"
  >
    <!-- Layer 0: interactive circle grid (sits at the very back) -->
    <InteractiveCircleGridBg class="absolute inset-0 z-0" />



    <!-- Layer 2: main content — pointer-events-none on wrapper, re-enabled on interactive children -->
    <div class="pointer-events-none relative z-20 mx-auto flex min-h-screen max-w-[110rem] flex-col px-6 py-16 lg:px-10 items-center justify-center">
      <div class="flex-1 flex flex-col items-center justify-center text-center space-y-8 w-full">
        <h1 class="fade-in text-5xl font-semibold sm:text-6xl lg:text-7xl xl:text-8xl" style="transition-delay: 100ms">
          Culture moves faster than your <span class="text-accent">strategy.</span>
        </h1>
        <p class="fade-in max-w-3xl text-lg text-light-70 sm:text-xl lg:text-2xl" style="transition-delay: 160ms">
          We bridge the gap between brands and the generation that drives them. No fluff. Just impact.
        </p>
        <div class="fade-in flex flex-wrap gap-4 justify-center" style="transition-delay: 220ms">
          <a
            href="#pricing"
            class="pointer-events-auto inline-flex items-center justify-center gap-2 border border-white/30 px-8 py-4 text-sm font-semibold uppercase tracking-[0.35em] transition hover:border-white hover:bg-white/5"
          >
            Start a Project <span>→</span>
          </a>
        </div>
      </div>

      <div class="w-full flex flex-col items-center gap-12 pb-8">
        <button
          class="pointer-events-auto fade-in flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.35em] text-light-60 transition hover:text-white"
          style="transition-delay: 280ms"
          @click="scrollToExplore"
        >
          ( Scroll to Explore )
        </button>

        <nav class="fade-in flex items-center gap-8 text-[0.7rem] uppercase tracking-[0.35em] text-light-60" style="transition-delay: 340ms">
          <button class="pointer-events-auto flex items-center gap-2 hover:text-white transition">
            <span class="text-white">•</span>01 About Us
          </button>
          <button class="pointer-events-auto flex items-center gap-2 hover:text-white transition">
            <span>•</span>02 Capabilities
          </button>
          <button class="pointer-events-auto flex items-center gap-2 hover:text-white transition">
            <span>•</span>03 Reach & Impact
          </button>
          <button class="pointer-events-auto flex items-center gap-2 hover:text-white transition">
            <span>•</span>04 Our Process
          </button>
        </nav>
      </div>
    </div>
  </section>
</template>