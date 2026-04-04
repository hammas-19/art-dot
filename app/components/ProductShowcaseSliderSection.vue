<script setup lang="ts">
type ProductCard = {
  href: string;
  title: string;
  descriptionLines: string[];
  image: string;
  alt: string;
};

const products: ProductCard[] = [
  {
    href: "/products/noir-bloom",
    title: "noir bloom",
    descriptionLines: ["#dark floral", "Signature 50ml"],
    image: "https://i.pinimg.com/1200x/ef/b6/50/efb6506cc9d0a9b54d59c8f36650f42c.jpg",
    alt: "Noir Bloom"
  },
  {
    href: "/products/saffron-dusk",
    title: "saffron dusk",
    descriptionLines: ["#amber spice", "Signature 75ml"],
    image: "https://i.pinimg.com/1200x/6a/59/8e/6a598ec385116d3ce949c78fe00d488b.jpg",
    alt: "Saffron Dusk"
  },
  {
    href: "/products/azure-veil",
    title: "azure veil",
    descriptionLines: ["#marine iris", "Signature 50ml"],
    image: "https://i.pinimg.com/736x/75/ca/1b/75ca1bf5aedb2187144e7bba2cb1ff98.jpg",
    alt: "Azure Veil"
  },
  {
    href: "/products/rose-cinder",
    title: "rose cinder",
    descriptionLines: ["#smoky rose", "Reserve 50ml"],
    image: "https://i.pinimg.com/1200x/52/49/49/524949bd9d40b35d44348c529bd5206f.jpg",
    alt: "Rose Cinder"
  },
  {
    href: "/products/emerald-hush",
    title: "emerald hush",
    descriptionLines: ["#green musk", "Signature 75ml"],
    image: "https://i.pinimg.com/736x/0e/a9/58/0ea958b73d2b357cfd751d824bd5bc50.jpg",
    alt: "Emerald Hush"
  },
  {
    href: "/products/violet-static",
    title: "violet static",
    descriptionLines: ["#powder electric", "Reserve 50ml"],
    image: "https://i.pinimg.com/736x/69/12/2b/69122ba88de69eb3ed314b88d4bc0d70.jpg",
    alt: "Violet Static"
  },
  {
    href: "/products/cedar-whisper",
    title: "cedar whisper",
    descriptionLines: ["#dry wood", "Signature 100ml"],
    image: "https://i.pinimg.com/736x/c2/1a/53/c21a5323919194254b7a21fc5ed4775e.jpg",
    alt: "Cedar Whisper"
  },
  {
    href: "/products/midnight-rain",
    title: "midnight rain",
    descriptionLines: ["#ozonic musk", "Reserve 100ml"],
    image: "https://i.pinimg.com/736x/88/36/92/8836929fa65343965fbbbabeb28e8359.jpg",
    alt: "Midnight Rain"
  },
  {
    href: "/products/moss-orbit",
    title: "moss orbit",
    descriptionLines: ["#earth mineral", "Signature 50ml"],
    image: "https://i.pinimg.com/1200x/21/81/ac/2181ace57ec0a9fc396b7a9a90e64781.jpg",
    alt: "Moss Orbit"
  },
  {
    href: "/products/amber-tide",
    title: "amber tide",
    descriptionLines: ["#warm resin", "Reserve 75ml"],
    image: "https://i.pinimg.com/736x/e2/af/2f/e2af2f1992e3d31924279bd713bf4d75.jpg",
    alt: "Amber Tide"
  }
];
</script>

<template>
  <section id="section-products" class="bg-white px-6 py-16 text-slate-900 md:px-10">
    <div class="mx-auto max-w-6xl">
      <h2 class="text-3xl font-semibold uppercase tracking-[0.12em] md:text-4xl">Product Showcase</h2>
      <p class="mt-3 text-sm uppercase tracking-[0.18em] text-slate-500">Discover the new Lamar fragrance collection</p>

      <div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <NuxtLink
          v-for="product in products"
          :key="product.title"
          :to="product.href"
          class="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <img
            :src="product.image"
            :alt="product.alt"
            class="h-60 w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          >

          <div class="px-4 py-4">
            <h3 class="text-lg font-semibold uppercase tracking-[0.08em]">{{ product.title }}</h3>
            <p class="mt-2 text-xs uppercase tracking-[0.12em] text-slate-500">{{ product.descriptionLines[0] }}</p>
            <p class="text-xs uppercase tracking-[0.12em] text-slate-500">{{ product.descriptionLines[1] }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
