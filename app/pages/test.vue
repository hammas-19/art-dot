<script setup lang="ts">
import { onMounted } from "vue";

type AccentTheme = {
  name: string;
  primary: string;
  hover: string;
  dark: string;
  rgb: string;
  darkRgb: string;
  glowRgb: string;
};

const accentThemes: AccentTheme[] = [
  {
    name: "Electric Blue",
    primary: "#0892D0",
    hover: "#3DADDE",
    dark: "#0675A6",
    rgb: "8, 146, 208",
    darkRgb: "6, 117, 166",
    glowRgb: "8, 146, 208"
  },
  {
    name: "Warm Orange",
    primary: "#FEC47F",
    hover: "#FDD6A7",
    dark: "#E5AB65",
    rgb: "254, 196, 127",
    darkRgb: "229, 171, 101",
    glowRgb: "254, 196, 127"
  },
  {
    name: "Gold",
    primary: "#EDC31B",
    hover: "#F3D559",
    dark: "#D1A914",
    rgb: "237, 195, 27",
    darkRgb: "209, 169, 20",
    glowRgb: "237, 195, 27"
  }
];

const applyAccentTheme = (theme: AccentTheme) => {
  const root = document.documentElement;
  root.style.setProperty("--color-accent-primary", theme.primary);
  root.style.setProperty("--color-accent-hover", theme.hover);
  root.style.setProperty("--color-accent-dark", theme.dark);
  root.style.setProperty("--color-accent-rgb", theme.rgb);
  root.style.setProperty("--color-accent-dark-rgb", theme.darkRgb);
  root.style.setProperty("--color-accent-glow-rgb", theme.glowRgb);
};

onMounted(() => {
  const defaultTheme = accentThemes[0];
  if (defaultTheme) applyAccentTheme(defaultTheme);
});
</script>

<template>
  <div>
    <div class="fixed right-6 top-6 z-50 flex flex-col gap-3">
      <aside class="rounded-2xl border border-light/20 bg-dark-80 p-4 backdrop-blur">
        <p class="mb-3 text-[10px] uppercase tracking-[0.28em] text-light-60">Accent Theme</p>
        <div class="flex gap-3">
          <button
            v-for="theme in accentThemes"
            :key="theme.name"
            type="button"
            class="h-8 w-8 rounded-full border border-white/30 transition-transform hover:scale-110"
            :style="{ backgroundColor: theme.primary }"
            :aria-label="`Apply ${theme.name} accent`"
            @click="applyAccentTheme(theme)"
          />
        </div>
      </aside>

      <div class="rounded-xl border border-light/20 bg-dark-80 px-3 py-3 backdrop-blur">
        <p class="mb-2 text-[10px] uppercase tracking-[0.24em] text-light-60">Colors</p>
        <ul class="space-y-2 text-xs text-light-80">
          <li
            v-for="theme in accentThemes"
            :key="`${theme.name}-tooltip`"
            class="flex items-center gap-2"
          >
            <span class="h-3.5 w-3.5 rounded-sm border border-white/30" :style="{ backgroundColor: theme.primary }" />
            <span>{{ theme.name }}</span>
          </li>
        </ul>
      </div>
    </div>

    <TestsMarqueeSection />
    <TestsBrandActivationSection />
    <TestsCtaBanner />
  </div>
</template>
