<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

type NavItem = {
  id: string;
  label: string;
  number: string;
};

const items: NavItem[] = [
  { id: "section-about", label: "About Us", number: "01" },
  { id: "section-capabilities", label: "Capabilities", number: "02" },
  { id: "section-stats", label: "Reach & Impact", number: "03" },
  { id: "section-process", label: "Our Process", number: "04" }
];

const activeId = ref<string | null>(null);
const isVisible = ref(false);
let observer: IntersectionObserver | null = null;

const updateVisibility = () => {
  isVisible.value = window.scrollY > window.innerHeight * 0.2;
};

const handleClick = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};

onMounted(() => {
  updateVisibility();
  window.addEventListener("scroll", updateVisibility, { passive: true });
  window.addEventListener("resize", updateVisibility);

  observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1));

      if (visibleEntries.length > 0) {
        const id = visibleEntries[0].target.getAttribute("id");
        activeId.value = id;
      }
    },
    { rootMargin: "-20% 0px -55% 0px", threshold: 0.1 }
  );

  items.forEach((item) => {
    const el = document.getElementById(item.id);
    if (el) observer?.observe(el);
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateVisibility);
  window.removeEventListener("resize", updateVisibility);
  observer?.disconnect();
});
</script>

<template>
  <aside
    class="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    :class="{ 'opacity-0': !isVisible, 'opacity-100': isVisible }"
    aria-label="Section navigation"
  >
    <nav class="pointer-events-auto flex flex-col gap-4 text-[0.7rem] uppercase tracking-[0.35em] text-light-60">
      <button
        v-for="item in items"
        :key="item.id"
        class="flex items-center gap-2 text-left transition hover:text-white"
        :class="{
          'text-white': activeId === item.id,
          'text-light-60': activeId !== item.id
        }"
        @click="handleClick(item.id)"
        type="button"
      >
        <span :class="{ 'text-white': activeId === item.id }">•</span>
        {{ item.number }} {{ item.label }}
      </button>
    </nav>
  </aside>
</template>

<style scoped>
aside {
  transition: opacity 0.4s ease;
}
</style>
