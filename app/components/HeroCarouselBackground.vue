<script setup lang="ts">
import { gsap } from "gsap";
import { computed, onMounted, onUnmounted, ref } from "vue";

type SlideItem = {
  href: string;
  bg: string;
  circle: string;
  title: string;
  descriptionLines: string[];
  webp: string;
  png: string;
  width: number;
  height: number;
  alt: string;
};

const defaultSlides: SlideItem[] = [
  {
    href: "/products/noir-bloom",
    bg: "#111315",
    circle: "#31363c",
    title: "noir bloom",
    descriptionLines: ["#velvet amber", "Lamar Essence 01"],
    webp: "https://i.pinimg.com/1200x/ef/b6/50/efb6506cc9d0a9b54d59c8f36650f42c.jpg",
    png: "https://i.pinimg.com/1200x/ef/b6/50/efb6506cc9d0a9b54d59c8f36650f42c.jpg",
    width: 1200,
    height: 1200,
    alt: "Noir Bloom Perfume"
  },
  {
    href: "/products/saffron-dusk",
    bg: "#241b14",
    circle: "#5a4432",
    title: "saffron dusk",
    descriptionLines: ["#smoky spice", "Lamar Essence 02"],
    webp: "https://i.pinimg.com/1200x/6a/59/8e/6a598ec385116d3ce949c78fe00d488b.jpg",
    png: "https://i.pinimg.com/1200x/6a/59/8e/6a598ec385116d3ce949c78fe00d488b.jpg",
    width: 1200,
    height: 1200,
    alt: "Saffron Dusk Perfume"
  },
  {
    href: "/products/azure-veil",
    bg: "#171a1e",
    circle: "#3d4652",
    title: "azure veil",
    descriptionLines: ["#marine iris", "Lamar Essence 03"],
    webp: "https://i.pinimg.com/736x/75/ca/1b/75ca1bf5aedb2187144e7bba2cb1ff98.jpg",
    png: "https://i.pinimg.com/736x/75/ca/1b/75ca1bf5aedb2187144e7bba2cb1ff98.jpg",
    width: 736,
    height: 736,
    alt: "Azure Veil Perfume"
  },
  {
    href: "/products/rose-cinder",
    bg: "#1e1411",
    circle: "#4e2f28",
    title: "rose cinder",
    descriptionLines: ["#petal smoke", "Lamar Essence 04"],
    webp: "https://i.pinimg.com/1200x/52/49/49/524949bd9d40b35d44348c529bd5206f.jpg",
    png: "https://i.pinimg.com/1200x/52/49/49/524949bd9d40b35d44348c529bd5206f.jpg",
    width: 1200,
    height: 1200,
    alt: "Rose Cinder Perfume"
  },
  {
    href: "/products/emerald-hush",
    bg: "#121d1a",
    circle: "#2e4f45",
    title: "emerald hush",
    descriptionLines: ["#green musk", "Lamar Essence 05"],
    webp: "https://i.pinimg.com/736x/0e/a9/58/0ea958b73d2b357cfd751d824bd5bc50.jpg",
    png: "https://i.pinimg.com/736x/0e/a9/58/0ea958b73d2b357cfd751d824bd5bc50.jpg",
    width: 736,
    height: 736,
    alt: "Emerald Hush Perfume"
  },
  {
    href: "/products/violet-static",
    bg: "#201f22",
    circle: "#575063",
    title: "violet static",
    descriptionLines: ["#powder electric", "Lamar Essence 06"],
    webp: "https://i.pinimg.com/736x/69/12/2b/69122ba88de69eb3ed314b88d4bc0d70.jpg",
    png: "https://i.pinimg.com/736x/69/12/2b/69122ba88de69eb3ed314b88d4bc0d70.jpg",
    width: 736,
    height: 736,
    alt: "Violet Static Perfume"
  },
  {
    href: "/products/cedar-whisper",
    bg: "#1c1713",
    circle: "#4c3f31",
    title: "cedar whisper",
    descriptionLines: ["#dry wood", "Lamar Essence 07"],
    webp: "https://i.pinimg.com/736x/c2/1a/53/c21a5323919194254b7a21fc5ed4775e.jpg",
    png: "https://i.pinimg.com/736x/c2/1a/53/c21a5323919194254b7a21fc5ed4775e.jpg",
    width: 736,
    height: 736,
    alt: "Cedar Whisper Perfume"
  },
  {
    href: "/products/midnight-rain",
    bg: "#191b21",
    circle: "#3f4d66",
    title: "midnight rain",
    descriptionLines: ["#ozonic depth", "Lamar Essence 08"],
    webp: "https://i.pinimg.com/736x/88/36/92/8836929fa65343965fbbbabeb28e8359.jpg",
    png: "https://i.pinimg.com/736x/88/36/92/8836929fa65343965fbbbabeb28e8359.jpg",
    width: 736,
    height: 736,
    alt: "Midnight Rain Perfume"
  },
  {
    href: "/products/moss-orbit",
    bg: "#151a18",
    circle: "#35564c",
    title: "moss orbit",
    descriptionLines: ["#earth mineral", "Lamar Essence 09"],
    webp: "https://i.pinimg.com/1200x/21/81/ac/2181ace57ec0a9fc396b7a9a90e64781.jpg",
    png: "https://i.pinimg.com/1200x/21/81/ac/2181ace57ec0a9fc396b7a9a90e64781.jpg",
    width: 1200,
    height: 1200,
    alt: "Moss Orbit Perfume"
  },
  {
    href: "/products/amber-tide",
    bg: "#211714",
    circle: "#5a4037",
    title: "amber tide",
    descriptionLines: ["#warm resin", "Lamar Essence 10"],
    webp: "https://i.pinimg.com/736x/e2/af/2f/e2af2f1992e3d31924279bd713bf4d75.jpg",
    png: "https://i.pinimg.com/736x/e2/af/2f/e2af2f1992e3d31924279bd713bf4d75.jpg",
    width: 736,
    height: 736,
    alt: "Amber Tide Perfume"
  }
];

const props = defineProps<{
  slidesData?: SlideItem[];
  sectionTitle?: string;
  sectionSubtitle?: string;
  backgroundImage?: string;
}>();

const slides = computed(() => (props.slidesData?.length ? props.slidesData : defaultSlides));

const sectionTitle = computed(() => props.sectionTitle ?? "Lamar.");
const sectionSubtitle = computed(() => props.sectionSubtitle ?? "A Perfume Brand That Transcends Time and Trends");
const backgroundStyle = computed(() => ({
  backgroundImage: `url("${props.backgroundImage ?? "https://i.pinimg.com/1200x/05/1d/95/051d956ccf0090d892fce327666a7099.jpg"}")`
}));

const sliderRef = ref<HTMLElement | null>(null);
let sliderInstance: Slider | null = null;

const lerp = (start: number, end: number, amount: number) => (1 - amount) * start + amount * end;

const hasBrowserApi = typeof window !== "undefined" && typeof navigator !== "undefined";

const isMobile =
  hasBrowserApi &&
  (/iPad|iPhone|iPod|android/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

function debounce(func: (...args: unknown[]) => void, wait = 100) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (this: unknown, ...args: unknown[]) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(this, args);
    }, wait);
  };
}

class SliderItem {
  hover = false;
  index: number;
  length: number;
  viewport = { width: 0, height: 0 };
  extra = 0;
  width = 0;
  height = 0;
  padding = 0;
  widthTotal = 0;
  x = 0;
  r = 0;
  isBefore = false;
  isAfter = false;
  bounds = new DOMRect();
  renderedStyles = {
    tx: { previous: 0, current: 0, amt: 0.1 },
    ty: { previous: 0, current: 0, amt: 0.1 }
  };

  DOM: {
    el: HTMLElement;
    layers: NodeListOf<HTMLElement>;
  };

  mouseenterFn: (() => void) | null = null;
  mouseleaveFn: (() => void) | null = null;

  constructor(element: HTMLElement, index: number, length: number) {
    this.index = index;
    this.length = length;
    this.DOM = {
      el: element,
      layers: element.querySelectorAll(".layer")
    };

    this.DOM.layers.forEach((layer) => {
      const value = parseFloat(layer.dataset.range || "0");
      (layer as HTMLElement & { range?: number }).range = Number.isFinite(value) ? value : 0;
    });

    this.initEvents();
  }

  calculatePosition() {
    this.bounds = this.DOM.el.getBoundingClientRect();
  }

  clearState() {
    this.renderedStyles.tx.previous = 0;
    this.renderedStyles.tx.current = 0;
    this.renderedStyles.ty.previous = 0;
    this.renderedStyles.ty.current = 0;
  }

  initEvents() {
    this.mouseenterFn = () => {
      this.hover = true;
    };

    this.mouseleaveFn = () => {
      this.hover = false;
      this.DOM.layers.forEach((layer) => {
        gsap.to(layer, {
          duration: 0.5,
          x: 0,
          y: 0,
          ease: "elastic.out(1, 0.6)"
        });
      });
      this.clearState();
    };

    this.DOM.el.addEventListener("mouseenter", this.mouseenterFn);
    this.DOM.el.addEventListener("mouseleave", this.mouseleaveFn);
  }

  onResize(viewport: { width: number; height: number }) {
    this.viewport = viewport;
    const scale = viewport.height / 1500;
    this.height = 900 * scale;
    this.width = 740 * scale;
    this.padding = (this.width / 100) * 25;
    this.widthTotal = (this.width + this.padding) * this.length;
    this.x = (this.width + this.padding) * this.index;
    this.r = (2 * this.widthTotal) / (2 * Math.PI);

    this.DOM.el.style.width = `${this.width}px`;
    this.DOM.el.style.height = `${this.height}px`;
    this.DOM.el.style.marginTop = `${-this.height / 2}px`;
    this.DOM.el.style.marginLeft = `${-this.width / 2}px`;
    this.DOM.el.style.fontSize = `${this.height / 27}px`;

    this.extra = 0;
    this.calculatePosition();
  }

  update(
    scroll: { current: number },
    direction: "left" | "right",
    isDown: boolean,
    isSliderMoving: boolean,
    mousePos: { x: number; y: number }
  ) {
    const n = this.x - scroll.current - this.extra;
    let h = Math.asin(n / this.r) * (180 / Math.PI);

    if (Number.isNaN(h)) {
      this.DOM.el.classList.add("media-hidden");
      h = 0;
    } else {
      this.DOM.el.classList.remove("media-hidden");
    }

    const a = this.r - Math.cos(h * (Math.PI / 180)) * this.r;
    this.DOM.el.style.transform = `translate3d(${n}px, ${a}px, 0) rotate(${h}deg)`;

    const d = this.width / 2;
    const l = this.viewport.width;
    this.isBefore = n + d < -l;
    this.isAfter = n - d > l;

    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
    }

    if (!isDown && !isSliderMoving && this.hover && !isMobile) {
      this.calculatePosition();

      const tx = 0.3 * (mousePos.x - this.bounds.left - this.bounds.width / 2);
      const ty = 0.3 * (mousePos.y - this.bounds.top - this.bounds.height / 2);

      this.renderedStyles.tx.current = tx;
      this.renderedStyles.ty.current = ty;

      this.renderedStyles.tx.previous = lerp(
        this.renderedStyles.tx.previous,
        this.renderedStyles.tx.current,
        this.renderedStyles.tx.amt
      );

      this.renderedStyles.ty.previous = lerp(
        this.renderedStyles.ty.previous,
        this.renderedStyles.ty.current,
        this.renderedStyles.ty.amt
      );

      this.DOM.layers.forEach((layer) => {
        const range = (layer as HTMLElement & { range?: number }).range || 0;
        gsap.set(layer, {
          x: this.renderedStyles.tx.previous * range,
          y: this.renderedStyles.ty.previous * range
        });
      });
    }
  }

  destroy() {
    if (this.mouseenterFn) this.DOM.el.removeEventListener("mouseenter", this.mouseenterFn);
    if (this.mouseleaveFn) this.DOM.el.removeEventListener("mouseleave", this.mouseleaveFn);
  }
}

class Slider {
  DOM: {
    el: HTMLElement;
    viewport: HTMLElement;
    wrapper: HTMLElement;
    medias: NodeListOf<HTMLElement>;
  };

  start = 0;
  stop = 0;
  isDown = false;
  mousePos = { x: 0, y: 0 };
  itemIndex = 0;
  medias: SliderItem[] = [];
  viewport = { width: 0, height: 0 };
  rafId = 0;
  autoPauseDuration = isMobile ? 1200 : 1600;
  nextAutoAt = 0;
  autoPausedUntil = 0;

  scroll = {
    ease: isMobile ? 0.12 : 0.09,
    current: 0,
    target: 0,
    last: 0,
    position: 0
  };

  direction: "left" | "right" = "left";

  debouncedOnResize: (() => void) | null = null;

  onMouseMoveBound: ((event: MouseEvent) => void) | null = null;
  onTouchDownBound: ((event: MouseEvent | TouchEvent) => void) | null = null;
  onTouchMoveBound: ((event: MouseEvent | TouchEvent) => void) | null = null;
  onTouchUpBound: ((event: MouseEvent | TouchEvent) => void) | null = null;
  onKeyDownBound: ((event: KeyboardEvent) => void) | null = null;

  constructor(element: HTMLElement) {
    this.DOM = {
      el: element,
      viewport: element.querySelector(".viewport") as HTMLElement,
      wrapper: element.querySelector(".wrapper") as HTMLElement,
      medias: element.querySelectorAll(".media") as NodeListOf<HTMLElement>
    };

    this.createMedias();
    this.addEventListeners();
    this.onResize();
    this.update();
  }

  createMedias() {
    const originalMedias = Array.from(this.DOM.medias);
    if (!originalMedias.length) return;

    const fragment = document.createDocumentFragment();
    const allMedias = [...originalMedias];

    if (allMedias.length < 12) {
      const needed = 12 - allMedias.length;
      for (let i = 0; i < needed; i += 1) {
        const source = originalMedias[i % originalMedias.length];
        if (!source) continue;
        const clone = source.cloneNode(true) as HTMLElement;
        fragment.appendChild(clone);
        allMedias.push(clone);
      }
      this.DOM.wrapper.appendChild(fragment);
    }

    this.medias = allMedias.map((el, index) => new SliderItem(el, index, allMedias.length));
  }

  pauseAutoplay(ms = 2500) {
    this.autoPausedUntil = performance.now() + ms;
    this.nextAutoAt = 0;
  }

  onTouchDown(event: MouseEvent | TouchEvent) {
    this.pauseAutoplay();
    this.isDown = true;
    this.DOM.el.classList.add("move");
    this.scroll.position = this.scroll.current;

    const touchPoint = "touches" in event ? event.touches[0] : null;
    this.start = touchPoint ? touchPoint.clientX : (event as MouseEvent).clientX;
    this.stop = this.start;
  }

  onTouchMove(event: MouseEvent | TouchEvent) {
    if (!this.isDown) return;

    const touchPoint = "touches" in event ? event.touches[0] : null;
    this.stop = touchPoint ? touchPoint.clientX : (event as MouseEvent).clientX;
    const distance = this.start - this.stop;
    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp(_event: MouseEvent | TouchEvent) {
    this.isDown = false;
    this.DOM.el.classList.remove("move");
    this.snapToNearest();
  }

  snapToNearest() {
    if (!this.medias.length) return;
    const firstMedia = this.medias[0];
    if (!firstMedia) return;

    const itemWidth = firstMedia.width + firstMedia.padding;
    this.itemIndex = Math.round(this.scroll.target / itemWidth);
    this.scroll.target = itemWidth * this.itemIndex;
  }

  onMove(direction: "left" | "right") {
    if (!this.medias.length) return;
    this.pauseAutoplay();

    const firstMedia = this.medias[0];
    if (!firstMedia) return;
    const itemWidth = firstMedia.width + firstMedia.padding;
    this.itemIndex = direction === "left" ? this.itemIndex - 1 : this.itemIndex + 1;
    this.scroll.target = itemWidth * this.itemIndex;
  }

  onResize() {
    this.DOM.viewport.style.width = `${4 * this.DOM.viewport.getBoundingClientRect().height}px`;

    const viewportBounds = this.DOM.viewport.getBoundingClientRect();
    this.viewport = {
      width: viewportBounds.width,
      height: viewportBounds.height
    };

    if (!this.medias.length) return;

    this.itemIndex %= this.medias.length;
    this.medias.forEach((media) => media.onResize(this.viewport));

    const firstMedia = this.medias[0];
    if (!firstMedia) return;
    const itemWidth = firstMedia.width + firstMedia.padding;
    this.scroll.target = itemWidth * this.itemIndex;
    this.scroll.current = this.scroll.target;
    this.nextAutoAt = performance.now() + this.autoPauseDuration;
  }

  update() {
    const now = performance.now();
    const isSettled = Math.abs(this.scroll.current - this.scroll.target) <= 0.5;
    const isAnyCardHovered = this.medias.some((media) => media.hover);

    if (isAnyCardHovered) {
      this.nextAutoAt = 0;
    }

    if (!this.isDown && !isAnyCardHovered && now > this.autoPausedUntil && this.medias.length) {
      const firstMedia = this.medias[0];
      if (firstMedia && isSettled) {
        if (!this.nextAutoAt) {
          this.nextAutoAt = now + this.autoPauseDuration;
        } else if (now >= this.nextAutoAt) {
          const itemWidth = firstMedia.width + firstMedia.padding;
          this.itemIndex += 1;
          this.scroll.target = itemWidth * this.itemIndex;
          this.nextAutoAt = 0;
        }
      }
    }

    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const isMoving = Math.abs(this.scroll.current - this.scroll.target) > 0.1;

    this.direction = this.scroll.current > this.scroll.last ? "right" : "left";

    this.medias.forEach((media) => {
      media.update(this.scroll, this.direction, this.isDown, isMoving, this.mousePos);
    });

    this.scroll.last = this.scroll.current;
    this.rafId = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    this.debouncedOnResize = debounce(this.onResize.bind(this), 250);
    window.addEventListener("resize", this.debouncedOnResize);

    this.onMouseMoveBound = (event) => {
      this.mousePos = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener("mousemove", this.onMouseMoveBound);

    this.onTouchDownBound = this.onTouchDown.bind(this);
    this.onTouchMoveBound = this.onTouchMove.bind(this);
    this.onTouchUpBound = this.onTouchUp.bind(this);

    this.DOM.el.addEventListener("mousedown", this.onTouchDownBound as EventListener);
    window.addEventListener("mousemove", this.onTouchMoveBound as EventListener);
    window.addEventListener("mouseup", this.onTouchUpBound as EventListener);

    this.DOM.el.addEventListener("touchstart", this.onTouchDownBound as EventListener, { passive: true });
    window.addEventListener("touchmove", this.onTouchMoveBound as EventListener, { passive: true });
    window.addEventListener("touchend", this.onTouchUpBound as EventListener);

    this.DOM.el.addEventListener(
      "click",
      (event) => {
        const dragDistance = Math.abs(this.start - this.stop);
        if (dragDistance > 10) event.preventDefault();
      },
      true
    );

    this.onKeyDownBound = (event) => {
      if (event.code === "ArrowLeft" || event.code === "ArrowDown") {
        this.onMove("left");
      } else if (event.code === "ArrowRight" || event.code === "ArrowUp") {
        this.onMove("right");
      }
    };

    window.addEventListener("keydown", this.onKeyDownBound);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);

    this.medias.forEach((media) => media.destroy());

    if (this.debouncedOnResize) window.removeEventListener("resize", this.debouncedOnResize);
    if (this.onMouseMoveBound) window.removeEventListener("mousemove", this.onMouseMoveBound);

    if (this.onTouchDownBound) {
      this.DOM.el.removeEventListener("mousedown", this.onTouchDownBound as EventListener);
      this.DOM.el.removeEventListener("touchstart", this.onTouchDownBound as EventListener);
    }

    if (this.onTouchMoveBound) {
      window.removeEventListener("mousemove", this.onTouchMoveBound as EventListener);
      window.removeEventListener("touchmove", this.onTouchMoveBound as EventListener);
    }

    if (this.onTouchUpBound) {
      window.removeEventListener("mouseup", this.onTouchUpBound as EventListener);
      window.removeEventListener("touchend", this.onTouchUpBound as EventListener);
    }

    if (this.onKeyDownBound) window.removeEventListener("keydown", this.onKeyDownBound);
  }
} 

onMounted(() => {
  if (!sliderRef.value) return;
  sliderInstance = new Slider(sliderRef.value);
});

onUnmounted(() => {
  sliderInstance?.destroy();
  sliderInstance = null;
});
</script>

<template>
  <main id="slider" ref="sliderRef" class="hero-slider-bg" aria-label="Hero carousel background">
    <div class="hero-bg-image" :style="backgroundStyle" aria-hidden="true" />
    <div class="flex gap-5 flex-col m-5">
      <h1 class="hero-heading fade-in text-4xl font-medium  uppercase" style="transition-delay: 100ms">
        {{ sectionTitle }}
      </h1>
      <!-- <p class="hero-subtitle fade-in max-w-3xl text-lg font-thin uppercase sm:text-xl lg:text-xl" style="transition-delay: 200ms">
        {{ sectionSubtitle }}
      </p> -->
    </div>
    <div class="viewport">
      <div class="wrapper mt-20">
        <SliderProductCard
          v-for="(slide, index) in slides"
          :key="`${slide.title}-${index}`"
          :href="slide.href"
          :bg="slide.bg"
          :circle="slide.circle"
          :title="slide.title"
          :description-lines="slide.descriptionLines"
          :image-webp="slide.webp"
          :image-png="slide.png"
          :image-width="slide.width"
          :image-height="slide.height"
          :alt="slide.alt"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
.hero-slider-bg {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.hero-bg-image {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  pointer-events: none;
}

.hero-slider-bg > .flex,
.viewport {
  position: relative;
  z-index: 1;
}

.viewport {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 60vh;
  will-change: transform;
}

.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .viewport {
    height: 48vh;
  }
}
</style>
