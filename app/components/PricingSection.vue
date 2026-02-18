<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

type PricingPackage = {
  id: number;
  channel: string;
  name: string;
  price: number;
  batteryLevel: number;
  features: string[];
  cta: string;
  popular?: boolean;
};

type HourlyPackage = {
  id: number;
  channel: string;
  name: string;
  price: number;
  features: string[];
  cta: string;
};

const soloPackages: PricingPackage[] = [
  {
    id: 1,
    channel: "CH 01",
    name: "BASIC",
    price: 599,
    batteryLevel: 20,
    features: [
      "Basic content guidance",
      "Video topic planning",
      "Studio-based shooting",
      "Professional camera use",
      "Lighting & audio setup",
      "Full video editing",
      "Basic color & sound correction",
      "Custom thumbnail design",
      "Basic YouTube SEO",
      "Two revision rounds"
    ],
    cta: "Start a Project"
  },
  {
    id: 2,
    channel: "CH 02",
    name: "ADVANCED",
    price: 999,
    batteryLevel: 65,
    features: [
      "Content planning guidance",
      "Video topic structuring",
      "Studio-based video shooting",
      "Professional camera setup",
      "Lighting & audio setup",
      "Full video editing",
      "Color correction & sound",
      "Custom thumbnail design",
      "YouTube SEO basics",
      "Two revision rounds"
    ],
    cta: "Start a Project",
    popular: true
  },
  {
    id: 3,
    channel: "CH 03",
    name: "PREMIUM",
    price: 1799,
    batteryLevel: 95,
    features: [
      "YouTube content strategy",
      "Video planning & scheduling",
      "Studio-based video shooting",
      "Professional camera setup",
      "Lighting & audio setup",
      "Full video editing",
      "Color grading & sound",
      "Custom thumbnail design",
      "YouTube SEO optimization",
      "Two revision rounds"
    ],
    cta: "Start a Project"
  }
];

const hourlyPackages: HourlyPackage[] = [
  {
    id: 4,
    channel: "CH 04",
    name: "STUDIO SESSION",
    price: 299,
    features: [
      "Professional studio access",
      "Camera, lighting & audio",
      "Multi-video recording",
      "Full video editing",
      "Thumbnail per video",
      "Two revision rounds"
    ],
    cta: "Book Hourly"
  },
  {
    id: 5,
    channel: "CH 05",
    name: "STUDIO RENT",
    price: 199,
    features: [
      "Professional studio access",
      "2 professional cameras",
      "Professional lighting",
      "Pod mics & collar mics",
      "Full equipment access"
    ],
    cta: "Book Hourly"
  }
];

const sectionRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const selectedTime = ref(12);
let stopObserver: (() => void) | null = null;

const timeLabel = computed(() => {
  const hours = Math.floor(selectedTime.value);
  const minutes = Math.round((selectedTime.value - hours) * 60);
  const isPm = hours >= 12;
  const displayHours = ((hours + 11) % 12) + 1;
  const paddedMinutes = minutes.toString().padStart(2, "0");
  return `${displayHours}:${paddedMinutes} ${isPm ? "PM" : "AM"}`;
});

const timePercent = computed(() => {
  const min = 6;
  const max = 18;
  return ((selectedTime.value - min) / (max - min)) * 100;
});

onMounted(() => {
  const { stop } = useIntersectionObserver(
    sectionRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting) isVisible.value = true;
    },
    { threshold: 0.2 }
  );
  stopObserver = stop;
});

onUnmounted(() => {
  stopObserver?.();
});
</script>

<template>
  <section
    id="section-pricing"
    ref="sectionRef"
    class="pricing-section bg-black text-white"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="mx-auto max-w-[110rem] px-6 py-20 lg:px-10 lg:py-28">
      <div class="flex flex-col items-center gap-6 text-center">
        <p class="text-[0.7rem] font-semibold uppercase tracking-[0.5em] text-accent">07 — Pricing</p>
        <h2 class="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          <span class="text-white">Packages</span>
          <span class="text-accent"> &amp; Rates</span>
        </h2>
      </div>

      <div class="mt-14 grid gap-6 lg:grid-cols-3">
        <article
          v-for="(pkg, index) in soloPackages"
          :key="pkg.id"
          class="pricing-card group relative overflow-hidden border border-light/10 bg-gradient-to-b from-light/5 to-dark-80 p-10"
          :class="{ 'is-popular': pkg.popular }"
          :style="{ '--delay': `${index * 120}ms` }"
        >
          <span
            v-if="pkg.popular"
            class="popular-badge"
          >
            Popular
          </span>
          <div class="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.35em] text-light-50">
            <span>Solo</span>
            <span>{{ pkg.channel }}</span>
          </div>
          <div class="mt-8 space-y-2 text-center">
            <p class="text-[0.7rem] uppercase tracking-[0.35em] text-light-50">Package</p>
            <h3 class="text-3xl font-semibold tracking-tight text-white lg:text-4xl">
              <span :class="pkg.popular ? 'text-accent' : ''">{{ pkg.name }}</span>
            </h3>
          </div>

          <div class="battery-wrap mt-10">
            <div class="battery">
              <span class="battery-fill" :style="{ height: `${pkg.batteryLevel}%` }" />
            </div>
          </div>

          <div class="mt-10 text-center">
            <p class="text-5xl font-semibold lg:text-6xl">£{{ pkg.price.toLocaleString() }}</p>
          </div>

          <ul class="mt-10 space-y-4 text-base text-light-65">
            <li v-for="feature in pkg.features" :key="feature" class="flex items-start gap-3">
              <span class="feature-dot" />
              <span>{{ feature }}</span>
            </li>
          </ul>

          <button
            type="button"
            class="mt-12 w-full border border-light/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-light-70 transition hover:border-accent/60 hover:text-accent-hover"
            :class="pkg.popular ? 'bg-accent-dark/90 text-black hover:text-black' : 'bg-light/5'"
          >
            {{ pkg.cta }}
          </button>
        </article>
      </div>

      <div class="mt-16 border-t border-light/10 pt-12">
        <div class="text-center">
          <p class="text-[0.7rem] font-semibold uppercase tracking-[0.45em] text-accent">Hourly Options</p>
        </div>
        <div class="mt-10 grid gap-6 lg:grid-cols-2">
          <article
            v-for="(pkg, index) in hourlyPackages"
            :key="pkg.id"
            class="hourly-card border border-light/10 bg-gradient-to-b from-light/5 to-dark-80 p-10"
            :style="{ '--delay': `${(index + 3) * 120}ms` }"
          >
            <div class="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.35em] text-light-50">
              <span>{{ pkg.channel }}</span>
              <span class="text-accent">£{{ pkg.price }}</span>
            </div>
            <h3 class="mt-6 text-2xl font-semibold uppercase tracking-tight text-white lg:text-3xl">
              {{ pkg.name }}
            </h3>
            <p class="mt-2 text-[0.7rem] uppercase tracking-[0.35em] text-light-40">Per hour</p>

            <ul class="mt-8 space-y-4 text-base text-light-65">
              <li v-for="feature in pkg.features" :key="feature" class="flex items-start gap-3">
                <span class="feature-dot" />
                <span>{{ feature }}</span>
              </li>
            </ul>

            <button
              type="button"
              class="mt-10 w-full border border-light/15 bg-light/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-light-70 transition hover:border-accent/60 hover:text-accent-hover"
            >
              {{ pkg.cta }}
            </button>
          </article>
        </div>

        <div class="slider-wrap relative mt-14 border border-light/10 bg-gradient-to-b from-light/5 to-dark p-10">
          <div class="flex flex-col gap-4 text-center">
            <div class="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.45em] text-light-45">
              <span class="text-accent">06:00 AM</span>
              <span>Drag to select time</span>
              <span class="text-accent">06:00 PM</span>
            </div>

            <div class="relative mt-6">
              <div class="range-track">
                <span class="range-progress" :style="{ width: `${timePercent}%` }" />
                <div class="range-ticks">
                  <span v-for="tick in 13" :key="tick" class="tick" />
                </div>
              </div>
              <div class="range-bubble" :style="{ left: `calc(${timePercent}% - 16px)` }">
                {{ timeLabel }}
              </div>
              <input
                v-model.number="selectedTime"
                type="range"
                min="6"
                max="18"
                step="0.25"
                class="range-input"
                aria-label="Select time"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pricing-card,
.hourly-card,
.slider-wrap {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease, border-color 0.5s ease;
  transition-delay: var(--delay, 0ms);
}

.is-visible .pricing-card,
.is-visible .hourly-card,
.is-visible .slider-wrap {
  opacity: 1;
  transform: translateY(0);
}

.pricing-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border: 1px solid transparent;
  background: linear-gradient(135deg, rgba(var(--color-accent-rgb), 0.12), rgba(0, 0, 0, 0)) border-box;
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.pricing-card:hover::after {
  opacity: 1;
}

.pricing-card.is-popular {
  border-color: rgba(var(--color-accent-rgb), 0.65);
  box-shadow: 0 0 0 1px rgba(var(--color-accent-rgb), 0.5), 0 30px 60px rgba(var(--color-accent-rgb), 0.15);
}

.popular-badge {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-accent-dark);
  color: #111;
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.35em;
}

.battery-wrap {
  display: flex;
  justify-content: center;
  margin-top: 22px;
}

.battery {
  width: 34px;
  height: 56px;
  border: 2px solid rgba(var(--color-accent-rgb), 0.5);
  border-radius: 8px;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 4px;
  background: rgba(0, 0, 0, 0.4);
}

.battery::after {
  content: "";
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 6px;
  border-radius: 3px 3px 0 0;
  background: rgba(var(--color-accent-rgb), 0.5);
}

.battery-fill {
  display: block;
  width: 100%;
  height: 50%;
  border-radius: 5px;
  background: linear-gradient(180deg, rgba(var(--color-accent-rgb), 0.9), rgba(var(--color-accent-rgb), 0.4));
  box-shadow: 0 0 12px rgba(var(--color-accent-rgb), 0.45);
}

.feature-dot {
  width: 6px;
  height: 6px;
  margin-top: 6px;
  border-radius: 999px;
  background: rgba(var(--color-accent-rgb), 0.75);
  box-shadow: 0 0 6px rgba(var(--color-accent-rgb), 0.6);
  flex-shrink: 0;
}

.range-track {
  position: relative;
  height: 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  overflow: hidden;
}

.range-progress {
  position: absolute;
  inset: 0;
  height: 100%;
  background: linear-gradient(90deg, rgba(var(--color-accent-rgb), 0.6), rgba(var(--color-accent-rgb), 0.2));
}

.range-ticks {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 6px;
  pointer-events: none;
}

.tick {
  width: 1px;
  height: 10px;
  background: rgba(255, 255, 255, 0.2);
}

.range-input {
  -webkit-appearance: none;
  appearance: none;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 28px;
  background: transparent;
  cursor: pointer;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: var(--color-accent-dark);
  box-shadow: 0 0 0 6px rgba(var(--color-accent-rgb), 0.18), 0 0 12px rgba(var(--color-accent-rgb), 0.45);
  border: 2px solid rgba(0, 0, 0, 0.6);
}

.range-input::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: var(--color-accent-dark);
  box-shadow: 0 0 0 6px rgba(var(--color-accent-rgb), 0.18), 0 0 12px rgba(var(--color-accent-rgb), 0.45);
  border: 2px solid rgba(0, 0, 0, 0.6);
}

.range-bubble {
  position: absolute;
  top: -46px;
  padding: 6px 12px;
  border-radius: 12px;
  background: #f8f8f8;
  color: #111;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  transform: translateX(-50%);
  transition: left 0.2s ease;
}

.range-bubble::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -6px;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #f8f8f8;
}

@media (max-width: 1024px) {
  .popular-badge {
    letter-spacing: 0.2em;
  }
}
</style>
