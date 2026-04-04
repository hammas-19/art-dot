<script setup lang="ts">
withDefaults(
  defineProps<{
    href?: string;
    bg: string;
    circle: string;
    title: string;
    descriptionLines: string[];
    imageWebp: string;
    imagePng: string;
    imageWidth?: number;
    imageHeight?: number;
    alt: string;
  }>(),
  {
    href: "https://example.com/",
    imageWidth: 736,
    imageHeight: 736
  }
);
</script>

<template>
  <NuxtLink :to="href" class="media" draggable="false" @dragstart.prevent>
    <div class="bg layer" :style="{ background: bg }" data-range="0.25">
      <div class="circle layer" data-range="0.1" :style="{ background: circle }" />
      <div class="title layer" data-range="0.15">
        <span>{{ title }}</span>
        <span>{{ title }}</span>
        <span>{{ title }}</span>
      </div>
      <picture>
        <source :srcset="imageWebp" type="image/webp">
        <source :srcset="imagePng" type="image/png">
        <img
          class="layer"
          data-range="-0.15"
          :width="imageWidth"
          :height="imageHeight"
          :src="imagePng"
          :alt="alt"
        >
      </picture>
      <div class="description layer" data-range="0.4">
        <span>{{ descriptionLines[0] }}</span>
        <span>{{ descriptionLines[1] }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.media {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  color: inherit;
  text-decoration: none;
  transition: opacity 0.3s ease;
  opacity: 1;
  user-select: none;
  -webkit-user-drag: none;
  will-change: transform;
}

.media.media-hidden {
  opacity: 0;
}

.media .bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.28);
}

.media .circle {
  position: absolute;
  left: -10%;
  bottom: -60%;
  width: 120%;
  height: 0;
  padding-bottom: 120%;
  border-radius: 50%;
  z-index: 1;
}

.media .title {
  position: absolute;
  padding: 0.15em;
  font-size: 2.8em;
  line-height: 0.8em;
  font-family: "Noto Sans JP", sans-serif;
  font-weight: 800;
  text-transform: uppercase;
  white-space: nowrap;
  z-index: 3;
}

.media .title span {
  display: block;
  color: #fff;
}

@supports (-webkit-text-stroke: 1px #fff) {
  .media .title span:nth-child(2n-1) {
    color: transparent;
    -webkit-text-stroke: 1px #fff;
  }
}

.media .description {
  position: absolute;
  right: 2em;
  bottom: 2em;
  border-radius: 0.25em;
  background: #fff;
  color: #6068b2;
  padding: 0.5em 0.8em;
  font-size: 0.72em;
  line-height: 1.2em;
  font-family: "Noto Sans JP", sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  z-index: 3;
}

.media .description span {
  display: block;
}

.media picture,
.media img {
  position: absolute;
  left: -5%;
  bottom: -5%;
  width: 110%;
  height: auto;
  pointer-events: none;
  z-index: 2;
}

@media (max-width: 768px) {
  .media .description {
    right: 1.1em;
    bottom: 1.1em;
    font-size: 0.62em;
  }
}
</style>
