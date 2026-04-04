<script setup lang="ts">
import { computed } from "vue";

type ProductDetail = {
  slug: string;
  name: string;
  subtitle: string;
  price: string;
  size: string;
  heroImage: string;
  gallery: string[];
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  story: string;
  details: string[];
  ingredients: string;
};

const catalog: Record<string, ProductDetail> = {
  "noir-bloom": {
    slug: "noir-bloom",
    name: "Noir Bloom",
    subtitle: "Dark Floral / Signature Collection",
    price: "$145",
    size: "50ml Eau de Parfum",
    heroImage: "https://i.pinimg.com/1200x/ef/b6/50/efb6506cc9d0a9b54d59c8f36650f42c.jpg",
    gallery: [
      "https://i.pinimg.com/1200x/ef/b6/50/efb6506cc9d0a9b54d59c8f36650f42c.jpg",
      "https://i.pinimg.com/1200x/21/81/ac/2181ace57ec0a9fc396b7a9a90e64781.jpg",
      "https://i.pinimg.com/736x/e2/af/2f/e2af2f1992e3d31924279bd713bf4d75.jpg"
    ],
    topNotes: ["Pink Pepper", "Bergamot", "Blackcurrant"],
    heartNotes: ["Turkish Rose", "Iris", "Violet Leaf"],
    baseNotes: ["Patchouli", "Amberwood", "Vanilla Bean"],
    story:
      "Noir Bloom opens with a crisp spark before deepening into velvety petals and warm resin. Built for evenings, it leaves a polished, modern trail.",
    details: ["Long-lasting: 8-10 hours", "Projection: Moderate", "Refillable glass bottle", "Made in France"],
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Citral, Geraniol, Coumarin, Benzyl Benzoate"
  },
  "saffron-dusk": {
    slug: "saffron-dusk",
    name: "Saffron Dusk",
    subtitle: "Amber Spice / Signature Collection",
    price: "$165",
    size: "75ml Eau de Parfum",
    heroImage: "https://i.pinimg.com/1200x/6a/59/8e/6a598ec385116d3ce949c78fe00d488b.jpg",
    gallery: [
      "https://i.pinimg.com/1200x/6a/59/8e/6a598ec385116d3ce949c78fe00d488b.jpg",
      "https://i.pinimg.com/736x/69/12/2b/69122ba88de69eb3ed314b88d4bc0d70.jpg",
      "https://i.pinimg.com/736x/0e/a9/58/0ea958b73d2b357cfd751d824bd5bc50.jpg"
    ],
    topNotes: ["Saffron", "Mandarin", "Cardamom"],
    heartNotes: ["Rose Absolute", "Suede", "Labdanum"],
    baseNotes: ["Cedar", "Tonka Bean", "Amber"],
    story:
      "Saffron Dusk balances brightness and heat. It begins golden and airy, then settles into rich, textured warmth designed for colder nights.",
    details: ["Long-lasting: 10-12 hours", "Projection: Strong", "Refillable glass bottle", "Made in France"],
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Benzyl Salicylate, Linalool, Eugenol, Cinnamal, Citral, Limonene"
  },
  "rose-cinder": {
    slug: "rose-cinder",
    name: "Rose Cinder",
    subtitle: "Smoky Rose / Reserve Collection",
    price: "$175",
    size: "50ml Extrait de Parfum",
    heroImage: "https://i.pinimg.com/1200x/52/49/49/524949bd9d40b35d44348c529bd5206f.jpg",
    gallery: [
      "https://i.pinimg.com/1200x/52/49/49/524949bd9d40b35d44348c529bd5206f.jpg",
      "https://i.pinimg.com/736x/c2/1a/53/c21a5323919194254b7a21fc5ed4775e.jpg",
      "https://i.pinimg.com/736x/75/ca/1b/75ca1bf5aedb2187144e7bba2cb1ff98.jpg"
    ],
    topNotes: ["Pink Pepper", "Saffron", "Pear"],
    heartNotes: ["Damask Rose", "Incense", "Orris"],
    baseNotes: ["Leather", "Guaiac Wood", "Musk"],
    story:
      "Rose Cinder fuses lush florals with smoky undertones. The contrast creates a dramatic signature that feels intimate yet powerful.",
    details: ["Long-lasting: 12+ hours", "Projection: Strong", "Limited reserve batch", "Made in France"],
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Alpha-Isomethyl Ionone, Linalool, Benzyl Alcohol, Geraniol, Eugenol"
  },
  "midnight-rain": {
    slug: "midnight-rain",
    name: "Midnight Rain",
    subtitle: "Ozonic Musk / Reserve Collection",
    price: "$155",
    size: "100ml Eau de Parfum",
    heroImage: "https://i.pinimg.com/736x/88/36/92/8836929fa65343965fbbbabeb28e8359.jpg",
    gallery: [
      "https://i.pinimg.com/736x/88/36/92/8836929fa65343965fbbbabeb28e8359.jpg",
      "https://i.pinimg.com/1200x/21/81/ac/2181ace57ec0a9fc396b7a9a90e64781.jpg",
      "https://i.pinimg.com/736x/e2/af/2f/e2af2f1992e3d31924279bd713bf4d75.jpg"
    ],
    topNotes: ["Marine Accord", "Juniper", "Bergamot"],
    heartNotes: ["Iris", "Violet", "Salted Jasmine"],
    baseNotes: ["White Musk", "Driftwood", "Ambroxan"],
    story:
      "Midnight Rain captures the feeling of cold air and wet pavement after sunset. Transparent florals and musks keep it clean and atmospheric.",
    details: ["Long-lasting: 8-10 hours", "Projection: Moderate", "Refillable glass bottle", "Made in France"],
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Linalool, Hexyl Cinnamal, Citronellol, Benzyl Benzoate, Citral"
  },
  "azure-veil": {
    slug: "azure-veil",
    name: "Azure Veil",
    subtitle: "Marine Iris / Signature Collection",
    price: "$150",
    size: "50ml Eau de Parfum",
    heroImage: "https://i.pinimg.com/736x/75/ca/1b/75ca1bf5aedb2187144e7bba2cb1ff98.jpg",
    gallery: [
      "https://i.pinimg.com/736x/75/ca/1b/75ca1bf5aedb2187144e7bba2cb1ff98.jpg",
      "https://i.pinimg.com/1200x/21/81/ac/2181ace57ec0a9fc396b7a9a90e64781.jpg",
      "https://i.pinimg.com/736x/69/12/2b/69122ba88de69eb3ed314b88d4bc0d70.jpg"
    ],
    topNotes: ["Sea Salt", "Bergamot", "Neroli"],
    heartNotes: ["Iris", "Water Lily", "Clary Sage"],
    baseNotes: ["Cashmere Musk", "Cedar", "Ambrette"],
    story:
      "Azure Veil feels bright, cool, and precise. It opens with a marine lift before moving into iris and soft woods for a clean signature.",
    details: ["Long-lasting: 7-9 hours", "Projection: Moderate", "Refillable glass bottle", "Made in France"],
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Linalool, Citronellol, Limonene, Geraniol, Benzyl Salicylate"
  },
  "emerald-hush": {
    slug: "emerald-hush",
    name: "Emerald Hush",
    subtitle: "Green Musk / Signature Collection",
    price: "$160",
    size: "75ml Eau de Parfum",
    heroImage: "https://i.pinimg.com/736x/0e/a9/58/0ea958b73d2b357cfd751d824bd5bc50.jpg",
    gallery: [
      "https://i.pinimg.com/736x/0e/a9/58/0ea958b73d2b357cfd751d824bd5bc50.jpg",
      "https://i.pinimg.com/736x/c2/1a/53/c21a5323919194254b7a21fc5ed4775e.jpg",
      "https://i.pinimg.com/1200x/05/1d/95/051d956ccf0090d892fce327666a7099.jpg"
    ],
    topNotes: ["Galbanum", "Basil", "Pear Leaf"],
    heartNotes: ["Muguet", "Fig Leaf", "Jasmine"],
    baseNotes: ["Musk", "Vetiver", "Oakmoss"],
    story:
      "Emerald Hush is a crisp green fragrance with a soft, elegant finish. The composition stays fresh while still feeling refined and grounded.",
    details: ["Long-lasting: 8-10 hours", "Projection: Moderate", "Refillable glass bottle", "Made in France"],
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Linalool, Coumarin, Citral, Eugenol, Limonene"
  },
  "violet-static": {
    slug: "violet-static",
    name: "Violet Static",
    subtitle: "Powder Electric / Reserve Collection",
    price: "$170",
    size: "50ml Extrait de Parfum",
    heroImage: "https://i.pinimg.com/736x/69/12/2b/69122ba88de69eb3ed314b88d4bc0d70.jpg",
    gallery: [
      "https://i.pinimg.com/736x/69/12/2b/69122ba88de69eb3ed314b88d4bc0d70.jpg",
      "https://i.pinimg.com/736x/88/36/92/8836929fa65343965fbbbabeb28e8359.jpg",
      "https://i.pinimg.com/736x/e2/af/2f/e2af2f1992e3d31924279bd713bf4d75.jpg"
    ],
    topNotes: ["Pink Pepper", "Almond Milk", "Bergamot"],
    heartNotes: ["Heliotrope", "Iris", "Lavender"],
    baseNotes: ["Tonka Bean", "Musk", "Sandalwood"],
    story:
      "Violet Static brings a soft powdery texture with a cool electric edge. It wears like a quiet statement and lingers with a creamy dry-down.",
    details: ["Long-lasting: 10-12 hours", "Projection: Strong", "Limited reserve batch", "Made in France"],
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Benzyl Alcohol, Linalool, Alpha-Isomethyl Ionone, Coumarin"
  },
  "cedar-whisper": {
    slug: "cedar-whisper",
    name: "Cedar Whisper",
    subtitle: "Dry Wood / Signature Collection",
    price: "$148",
    size: "100ml Eau de Parfum",
    heroImage: "https://i.pinimg.com/736x/c2/1a/53/c21a5323919194254b7a21fc5ed4775e.jpg",
    gallery: [
      "https://i.pinimg.com/736x/c2/1a/53/c21a5323919194254b7a21fc5ed4775e.jpg",
      "https://i.pinimg.com/1200x/21/81/ac/2181ace57ec0a9fc396b7a9a90e64781.jpg",
      "https://i.pinimg.com/736x/0e/a9/58/0ea958b73d2b357cfd751d824bd5bc50.jpg"
    ],
    topNotes: ["Cardamom", "Juniper", "Black Tea"],
    heartNotes: ["Atlas Cedar", "Cashmere Wood", "Iris"],
    baseNotes: ["Vetiver", "Amber", "Musk"],
    story:
      "Cedar Whisper is a dry, polished wood scent with calm sophistication. It feels understated, layered, and easy to wear every day.",
    details: ["Long-lasting: 8-9 hours", "Projection: Moderate", "Refillable glass bottle", "Made in France"],
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Citral, Geraniol"
  },
  "moss-orbit": {
    slug: "moss-orbit",
    name: "Moss Orbit",
    subtitle: "Earth Mineral / Signature Collection",
    price: "$152",
    size: "50ml Eau de Parfum",
    heroImage: "https://i.pinimg.com/1200x/21/81/ac/2181ace57ec0a9fc396b7a9a90e64781.jpg",
    gallery: [
      "https://i.pinimg.com/1200x/21/81/ac/2181ace57ec0a9fc396b7a9a90e64781.jpg",
      "https://i.pinimg.com/736x/75/ca/1b/75ca1bf5aedb2187144e7bba2cb1ff98.jpg",
      "https://i.pinimg.com/1200x/05/1d/95/051d956ccf0090d892fce327666a7099.jpg"
    ],
    topNotes: ["Petitgrain", "Green Apple", "Verbena"],
    heartNotes: ["Moss", "Gardenia", "Tea"],
    baseNotes: ["Patchouli", "Musk", "Cedar"],
    story:
      "Moss Orbit is fresh, damp, and quietly textured. It evokes shaded gardens and cool stone, with green notes that stay balanced and modern.",
    details: ["Long-lasting: 7-8 hours", "Projection: Moderate", "Refillable glass bottle", "Made in France"],
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Benzyl Salicylate, Linalool, Limonene, Citral"
  },
  "amber-tide": {
    slug: "amber-tide",
    name: "Amber Tide",
    subtitle: "Warm Resin / Reserve Collection",
    price: "$168",
    size: "75ml Extrait de Parfum",
    heroImage: "https://i.pinimg.com/736x/e2/af/2f/e2af2f1992e3d31924279bd713bf4d75.jpg",
    gallery: [
      "https://i.pinimg.com/736x/e2/af/2f/e2af2f1992e3d31924279bd713bf4d75.jpg",
      "https://i.pinimg.com/736x/88/36/92/8836929fa65343965fbbbabeb28e8359.jpg",
      "https://i.pinimg.com/1200x/6a/59/8e/6a598ec385116d3ce949c78fe00d488b.jpg"
    ],
    topNotes: ["Bergamot", "Saffron", "Rum Accord"],
    heartNotes: ["Amber", "Resin", "Rose"],
    baseNotes: ["Vanilla", "Labdanum", "Sandalwood"],
    story:
      "Amber Tide is rich, glowing, and textured. It leans warm and sensual with resinous depth that builds gradually across the skin.",
    details: ["Long-lasting: 12+ hours", "Projection: Strong", "Limited reserve batch", "Made in France"],
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Coumarin, Eugenol, Limonene, Benzyl Benzoate"
  }
};

const route = useRoute();

const slug = computed(() => String(route.params.slug || "noir-bloom"));
const fallbackProduct = catalog["noir-bloom"] as ProductDetail;
const product = computed<ProductDetail>(() => catalog[slug.value] ?? fallbackProduct);
const notFound = computed(() => !Object.prototype.hasOwnProperty.call(catalog, slug.value));

const related = computed(() => Object.values(catalog).filter((item) => item.slug !== product.value.slug).slice(0, 3));
</script>

<template>
  <main class="bg-white text-slate-900">
    <section class="border-b border-slate-200 px-6 py-4 md:px-10">
      <div class="mx-auto flex max-w-6xl items-center justify-between">
        <NuxtLink to="/test" class="text-xs uppercase tracking-[0.16em] text-slate-500 hover:text-slate-900">
          Back to Showcase
        </NuxtLink>
        <p class="text-xs uppercase tracking-[0.16em] text-slate-500">Lamar Fragrance House</p>
      </div>
    </section>

    <section class="px-6 py-10 md:px-10 md:py-14">
      <div class="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <img :src="product.heroImage" :alt="product.name" class="h-120 w-full rounded-2xl object-cover">

          <div class="mt-4 grid grid-cols-3 gap-3">
            <img
              v-for="(image, idx) in product.gallery"
              :key="`${product.slug}-thumb-${idx}`"
              :src="image"
              :alt="`${product.name} view ${idx + 1}`"
              class="h-28 w-full rounded-xl object-cover"
              loading="lazy"
            >
          </div>
        </div>

        <div>
          <p v-if="notFound" class="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Sample product not found. Showing default content.
          </p>

          <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Product Detail</p>
          <h1 class="mt-3 text-4xl font-semibold uppercase tracking-[0.12em] md:text-5xl">{{ product.name }}</h1>
          <p class="mt-3 text-sm uppercase tracking-[0.16em] text-slate-500">{{ product.subtitle }}</p>

          <div class="mt-6 flex items-end gap-4">
            <p class="text-3xl font-semibold">{{ product.price }}</p>
            <p class="text-sm uppercase tracking-[0.16em] text-slate-500">{{ product.size }}</p>
          </div>

          <p class="mt-6 text-sm leading-7 text-slate-600">{{ product.story }}</p>

          <div class="mt-8 grid grid-cols-3 gap-3">
            <button class="rounded-full border border-slate-300 px-4 py-2 text-xs uppercase tracking-[0.14em] hover:border-slate-900">
              30ml
            </button>
            <button class="rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-xs uppercase tracking-[0.14em] text-white">
              50ml
            </button>
            <button class="rounded-full border border-slate-300 px-4 py-2 text-xs uppercase tracking-[0.14em] hover:border-slate-900">
              100ml
            </button>
          </div>

          <button class="mt-4 w-full rounded-full border border-slate-900 bg-slate-900 px-6 py-3 text-xs uppercase tracking-[0.22em] text-white transition hover:bg-black">
            Add to Bag
          </button>

          <div class="mt-8 border-t border-slate-200 pt-6">
            <h2 class="text-sm font-semibold uppercase tracking-[0.16em]">Fragrance Notes</h2>
            <div class="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p class="text-xs uppercase tracking-[0.14em] text-slate-500">Top</p>
                <p class="mt-2 text-sm text-slate-700">{{ product.topNotes.join(", ") }}</p>
              </div>
              <div>
                <p class="text-xs uppercase tracking-[0.14em] text-slate-500">Heart</p>
                <p class="mt-2 text-sm text-slate-700">{{ product.heartNotes.join(", ") }}</p>
              </div>
              <div>
                <p class="text-xs uppercase tracking-[0.14em] text-slate-500">Base</p>
                <p class="mt-2 text-sm text-slate-700">{{ product.baseNotes.join(", ") }}</p>
              </div>
            </div>
          </div>

          <div class="mt-8 border-t border-slate-200 pt-6">
            <h2 class="text-sm font-semibold uppercase tracking-[0.16em]">Details</h2>
            <ul class="mt-3 space-y-2 text-sm text-slate-700">
              <li v-for="item in product.details" :key="item">{{ item }}</li>
            </ul>
          </div>

          <div class="mt-8 border-t border-slate-200 pt-6">
            <h2 class="text-sm font-semibold uppercase tracking-[0.16em]">Ingredients</h2>
            <p class="mt-3 text-sm leading-7 text-slate-600">{{ product.ingredients }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="border-t border-slate-200 px-6 py-12 md:px-10">
      <div class="mx-auto max-w-6xl">
        <h2 class="text-2xl font-semibold uppercase tracking-[0.12em]">Related Fragrances</h2>
        <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="item in related"
            :key="item.slug"
            :to="`/products/${item.slug}`"
            class="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <img :src="item.heroImage" :alt="item.name" class="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.04]">
            <div class="px-4 py-4">
              <p class="text-lg font-semibold uppercase tracking-[0.08em]">{{ item.name }}</p>
              <p class="mt-2 text-xs uppercase tracking-[0.14em] text-slate-500">{{ item.subtitle }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>
