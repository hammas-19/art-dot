# ARTDOT AGENCY - Nuxt.js Clone Project Specification

## 🎯 PROJECT OVERVIEW
Recreate the example website using Nuxt.js 3, Tailwind CSS, and modern Vue.js patterns. The site is a premium creative agency portfolio with smooth animations, 3D effects, and interactive elements.

## 🛠️ TECH STACK

### Core Framework
- **Nuxt 4** (v4.3+ - latest stable)
- **Vue 3** (Composition API)
- **TypeScript** (preferred)

### Styling & UI
- **Tailwind CSS 4** (v4.0+ - new high-performance engine)
- **Custom CSS** (for complex animations)

### Animation & Interactions
- **Lenis** (smooth scroll) - `@studio-freight/lenis` or `lenis`
- **GSAP** or **@vueuse/motion** (replacing Framer Motion)
- **Three.js** (3D graphics/effects)
- **VueUse** (composition utilities)

### Icons & Assets
- **lucide-vue-next** (icon library)
- **nuxt-image** (image optimization)

### Additional Libraries
- **Intersection Observer API** (scroll-triggered animations)
- **Video.js** or native HTML5 video (video playback)

**Key Dependencies to Install:**
```bash
# Animations & Interactions
npm install lenis gsap @vueuse/core @vueuse/motion

# 3D Graphics
npm install three

# Icons
npm install lucide-vue-next

# Images (if using Nuxt Image module)
npm install @nuxt/image

# Tailwind CSS 4 (Vite plugin)
npm install -D tailwindcss @tailwindcss/vite
```

**Note:** You'll handle the full project setup. The above is just a reference for the main packages needed.

---

## 🎨 CUSTOM CURSOR FOLLOWER

**CRITICAL FEATURE - DO NOT SKIP**

The original site has a custom animated cursor follower that follows the mouse movement with a smooth delay. This is a signature visual element of the site.

### Component Name: `CursorFollower.vue`

**Behavior:**
- A circular element that follows the mouse cursor
- Smooth easing/lag effect (doesn't snap instantly to cursor position)
- Changes size/appearance on hover over interactive elements
- Visible only on desktop/large screens
- Hidden on mobile/touch devices

**Implementation Details:**

```javascript
// composables/useCursor.js
import { ref, onMounted, onUnmounted } from 'vue'

export const useCursor = () => {
  const cursorX = ref(0)
  const cursorY = ref(0)
  const cursorVisible = ref(false)
  
  let mouseX = 0
  let mouseY = 0
  
  const handleMouseMove = (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    cursorVisible.value = true
  }
  
  const handleMouseLeave = () => {
    cursorVisible.value = false
  }
  
  // Smooth follow with lerp (linear interpolation)
  const animateCursor = () => {
    const speed = 0.15 // Adjust for smoother/faster follow
    cursorX.value += (mouseX - cursorX.value) * speed
    cursorY.value += (mouseY - cursorY.value) * speed
    requestAnimationFrame(animateCursor)
  }
  
  onMounted(() => {
    if (window.innerWidth > 1024) { // Only on desktop
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseleave', handleMouseLeave)
      animateCursor()
    }
  })
  
  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseleave', handleMouseLeave)
  })
  
  return { cursorX, cursorY, cursorVisible }
}
```

**Component Structure:**

```vue
<script setup lang="ts">
const { cursorX, cursorY, cursorVisible } = useCursor()
const isHovering = ref(false)

// Detect hover over interactive elements
const detectHover = () => {
  const hoveredElement = document.elementFromPoint(cursorX.value, cursorY.value)
  isHovering.value = hoveredElement?.matches('a, button, [role="button"]') || false
}

watch([cursorX, cursorY], detectHover)
</script>

<template>
  <div 
    v-if="cursorVisible"
    class="cursor-follower"
    :class="{ 'is-hovering': isHovering }"
    :style="{
      transform: `translate(${cursorX}px, ${cursorY}px)`
    }"
  />
</template>

<style scoped>
.cursor-follower {
  position: fixed;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  border: 2px solid white;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  transform-origin: center;
  transition: width 0.3s ease, height 0.3s ease;
}

.cursor-follower.is-hovering {
  width: 40px;
  height: 40px;
}

/* Hide default cursor on interactive elements */
:root {
  cursor: none;
}

a, button, [role="button"] {
  cursor: none;
}

/* Show default cursor on mobile */
@media (max-width: 1024px) {
  :root {
    cursor: auto;
  }
  
  a, button, [role="button"] {
    cursor: pointer;
  }
}
</style>
```

**Styling Options:**
- Circle with border (most common)
- Filled circle with opacity
- Dot with outer ring
- `mix-blend-mode: difference` for contrast on any background
- Scale up on hover over links/buttons
- Add blur or glow effects

**Where to Place:**
- Add to `app.vue` or main layout
- Ensure it's rendered on every page
- Use `<ClientOnly>` wrapper to avoid SSR issues

```vue
<!-- app.vue or layouts/default.vue -->
<template>
  <div>
    <ClientOnly>
      <CursorFollower />
    </ClientOnly>
    <slot />
  </div>
</template>
```

---

## 📐 SITE STRUCTURE & SECTIONS

### SECTION 1: HERO
**Component Name:** `HeroSection.vue`

**Layout:**
- Full viewport height
- Large animated counter "0" top left
- Logo "art." below counter
- Main headline (h1): "Culture moves faster than your strategy."
- Subheadline: "We bridge the gap between brands and the generation that drives them. No fluff. Just impact."
- CTA Button: "Start a Project" (links to #pricing)
- Scroll indicator: "( Scroll to Explore )"
- Sticky navigation dots on right side (•01About Us, •02Capabilities, etc.)

**Animations:**
- Counter animates from 0 on page load
- Parallax effect on scroll
- Smooth fade-in for text elements
- 3D background effect (Three.js - optional but recommended)

**Styling:**
- Dark background (likely black or very dark gray)
- White text
- Large typography (headline should be 4-6rem)
- Minimal spacing, modern layout

**Key Features:**
```javascript
// Counter animation logic
const counter = ref(0)
const animateCounter = () => {
  // Animate from 0 to final number
}

// Scroll indicator
const scrollToExplore = () => {
  // Smooth scroll to next section
}
```

---

### SECTION 2: NAVIGATION (Sticky)
**Component Name:** `NavigationDots.vue`

**Layout:**
- Fixed position on right side of viewport
- Vertical list of navigation items
- Items: •01About Us, •02Capabilities, •03Reach & Impact, •04Our Process

**Behavior:**
- Active state changes based on scroll position
- Smooth scroll to section on click
- Show/hide based on scroll position

**Styling:**
- Small, minimalist design
- Active indicator (likely color change or bold)

---

### SECTION 3: ABOUT US
**Component Name:** `AboutSection.vue`

**Layout:**
- Section heading: "01 — Who We Are"
- Dense text block with NO SPACES between words (stylistic choice)
- Text: "WeareateamofMidlandsbasedmarketers&entrepreneurs..."
- Secondary text: "Part of our art.quarter ecosystem"

**Layout Pattern:**
- Two-column grid on desktop
- Single column on mobile
- Section number prefix (01 —)

**Styling:**
- Clean, minimal
- Section titles in uppercase or small caps
- Dense typography creates visual texture

---

### SECTION 4: MISSION
**Component Name:** `MissionSection.vue`

**Layout:**
- Section heading: "02 — Our Mission"
- Dense text block (similar to About)
- Text: "Wecraftstrategic,creativesolutions..."

**Same pattern as About section**

---

### SECTION 5: CAPABILITIES
**Component Name:** `CapabilitiesSection.vue`

**Layout:**
- Section heading: "02 — Capabilities"
- 3-column grid of service cards
- Each card has:
  - Number (01, 02, 03)
  - Title (STRATEGY, CONTENT, PROMOTION) - repeated twice
  - Bulleted list of services

**Card Structure:**
```
01
STRATEGYSTRATEGY (title repeated)
• Strategy Data
• Analytics
• Discovery & Research
• User Experience
• Brand Strategy
• Marketing Campaigns
```

**Animations:**
- Fade in on scroll
- Stagger effect for cards
- Hover effects on cards

**Styling:**
- Cards with borders or subtle backgrounds
- List items with bullet points
- Clean spacing

---

### SECTION 6: REACH & IMPACT (Stats)
**Component Name:** `StatsSection.vue`

**Layout:**
- Section heading: "03 — Reach & Impact"
- Grid of stat cards (4 columns, 2-3 rows)
- Each stat shows:
  - Animated number (00+, 00k, 00%, 00M+)
  - Label below

**Stats to display:**
- Cultural Events
- Avg Influencer Reach
- Attendees Ages 18-30
- Influencer Engagements
- Interactions / Event
- Total Footfall
- Social Video Views
- National Features
- Sponsor Retention

**Bottom tagline:** "Delivering real impressive results through data led strategies"

**Animations:**
- Count-up animation when section comes into view
- Use Intersection Observer
- Stagger animations across grid

**Implementation:**
```javascript
const stats = ref([
  { value: 15, suffix: '+', label: 'Cultural Events' },
  { value: 10, suffix: 'k', label: 'Avg Influencer Reach' },
  // ... etc
])

const animateNumber = (targetValue, duration) => {
  // GSAP or custom counter animation
}
```

---

### SECTION 7: MARKETING EXPERIENCE (Logo Marquee)
**Component Name:** `MarqueeSection.vue`

**Layout:**
- Heading: "Our Marketing Experience"
- Subtitle: "We have extensive experience growing brands..."
- Infinite horizontal scrolling marquee of brand logos/names

**Brands (repeating):**
AXEL ARIGATO, SIEMATIC, CARSICKO, SOUTHWEST, SIX, YOYOSO

**Animation:**
- Continuous seamless loop
- Logos scroll from right to left
- Multiple rows (stack them or single row)
- Pause on hover (optional)

**Implementation:**
```javascript
// CSS-based or GSAP marquee
.marquee {
  display: flex;
  animation: scroll 20s linear infinite;
}

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

---

### SECTION 8: BRAND ACTIVATION
**Component Name:** `BrandActivationSection.vue`

**Layout:**
- Section: "Live Experiences"
- Heading: "Brand Activation"
- Description: "We have hosted cultural events..."
- Stats:
  - 15+ Cultural Events Hosted
  - 10k+ Total Attendees

**Styling:**
- Two-column layout (text + stats)
- Large numbers with labels

---

### SECTION 9: ARTIST NETWORK
**Component Name:** `ArtistNetworkSection.vue`

**Layout:**
- Heading: "The Network"
- Subheading: "Renowned Artists"
- Top stats:
  - 0.00M Avg Reach / Event
  - 0.00M+ Total Impressions
- Grid of artist cards

**Artist Card Structure:**
Each card shows:
- Instagram handle (@burnaboygram)
- Artist name (BURNA BOY)
- Instagram follower count (17.7M)
- TikTok follower count (6.8M)

**Artists:**
1. Burna Boy - 17.7M / 6.8M
2. Headie One - 8.48M / 2.18M
3. Ehiz - 330K / 12.7M
4. Uche Natori - 653K / 8.35M
5. Rimzee - 1.28M / —
6. M Huncho - 616K / —
7. Brumtown UK - 35K / 556

**Styling:**
- Grid layout (3-4 columns)
- Cards with subtle borders
- Icons for Instagram/TikTok

---

### SECTION 10: CTA BANNER
**Component Name:** `CtaBanner.vue`

**Layout:**
- Text marquee: "artdotagency" repeated
- Heading: "Seen Enough?"
- Subheading: "You've seen the numbers. You've seen the reach. Now stop watching and start dominating."
- CTA Button: "Start a Project" (mailto link)

**Animation:**
- Background marquee animation
- Bold, attention-grabbing design

---

### SECTION 11: CASE STUDIES
**Component Name:** `CaseStudiesSection.vue`

**Layout:**
- Section heading: "04 — Selected Work"
- Subheading: "Featured Case Studies"
- Subtitle: "Real results delivered through data-led strategies."
- Grid of case study cards (2 columns)

**Case Study Cards:**
Each card contains:
- Number (01, 02, 03, 04)
- Large featured image
- Brand name (AXEL ARIGATO, SIEMATIC, CARSICKO, SOUTHWESTSIX)
- Subtitle (Digital Advertising Case Study, etc.)
- Link to case study page

**Hover Effects:**
- Image zoom/parallax
- Overlay appear
- Smooth transitions

**Implementation:**
```javascript
const caseStudies = [
  {
    id: 1,
    number: '01',
    title: 'AXEL ARIGATO',
    subtitle: 'Digital Advertising Case Study',
    image: '/images/axel.jpg',
    link: '/work/axel-arigato'
  },
  // ... more cases
]
```

---

### SECTION 12: LIVE FEED
**Component Name:** `LiveFeedSection.vue`

**Layout:**
- Heading: "Live Feed"
- Subheading: "Unfiltered Culture."
- Description: "No scripts. No storyboards. Just raw moments..."
- Grid or carousel of video thumbnails
- CTA: "Watch The Feed" button

**Features:**
- Video thumbnails with play overlay
- Modal/lightbox for video playback
- Grid or horizontal scroll layout

**Implementation:**
```javascript
const videos = [
  { id: 1, thumbnail: '/path/to/thumb.jpg', videoUrl: 'video.mp4' },
  // ... more videos
]
```

---

### SECTION 13: METHODOLOGY/PROCESS
**Component Name:** `ProcessSection.vue`

**Layout:**
- Section heading: "05 — Methodology"
- Heading: "Our Process"
- Subtitle: "A strategic framework for scalable growth."
- 6-step process cards

**Process Steps:**
1. Market Analysis & Positioning
2. Brand & Localisation Strategy Adaptation
3. Omni-channel Marketing Campaign
4. Influencer & Partnership Program
5. Localised Product Optimisation
6. Customer Experience Design

**Card Structure:**
- Step number (01-06)
- Title (repeated twice like other sections)
- Description paragraph

**Styling:**
- Vertical timeline or numbered list
- Large step numbers
- Clean typography

---

### SECTION 14: CREATIVE SERVICES
**Component Name:** `ServicesSection.vue`

**Layout:**
- Section heading: "06 — Services"
- Heading: "Creative Services"
- Subtitle: "Bespoke solutions bridging the gap between brands and culture."
- Grid of service items

**Services:**
- Immersive Set Design
- Creative Campaigns
- Street Culture Consulting
- Brand Community Interfacing
- Event Production
- Influencer Partnerships
- Youth Co-creation Panels

**Styling:**
- Simple list or 2-column grid
- Minimal, text-based
- Bullet points or numbered items

---

### SECTION 15: VALUE PROPOSITION
**Component Name:** `ValuePropositionSection.vue`

**Layout:**
- Section heading: "07 — Value Proposition"
- Heading: "Why Partner With Us?"
- Grid of value cards (2-3 columns)

**Value Points:**
1. Hard-to-Reach Audience
2. Guaranteed Visibility
3. Co-Created Activations
4. Media Attention
5. Influencer Coverage
6. Viral Social Moments

**Card Structure:**
- Icon or number
- Title
- Short description

---

### SECTION 16: PRICING
**Component Name:** `PricingSection.vue`

**Layout:**
- Section heading: "07 — Pricing"
- Heading: "Packages & Rates"
- Grid of pricing cards (5 cards total)
- Time selector at bottom (slider from 06:00 AM to 06:00 PM)

**Pricing Packages:**

**Solo Packages:**
1. **BASIC** - £599
   - CH 01
   - List of features (bullet points)
   - "Start A Project" button

2. **ADVANCED** - £999 (Popular badge)
   - CH 02
   - List of features
   - "Start A Project" button

3. **PREMIUM** - £1,799
   - CH 03
   - List of features
   - "Start A Project" button

**Hourly Options:**
4. **STUDIO SESSION** - £299/Per Hour
   - CH 04
   - List of features
   - "Book Hourly" button

5. **STUDIO RENT** - £199/Per Hour
   - CH 05
   - List of features
   - "Book Hourly" button

**Time Selector:**
- Drag slider to select time
- Range: 06:00 AM to 06:00 PM
- Default: 12:00 PM
- Text: "Drag to Select Time"

**Styling:**
- Cards with borders
- "Popular" badge on ADVANCED package
- Pricing in large font
- Feature lists with checkmarks or bullets
- Different button styles for different CTAs

**Implementation:**
```javascript
const packages = [
  {
    type: 'solo',
    channel: 'CH 01',
    name: 'BASIC',
    price: 599,
    currency: '£',
    features: ['Basic content guidance', '...'],
    cta: 'Start A Project',
    popular: false
  },
  // ... more packages
]

const selectedTime = ref(12) // 12:00 PM
```

---

### SECTION 17: FOOTER
**Component Name:** `FooterSection.vue`

**Layout:**
- Large heading: "Thank You" (stacked vertically)
- Heading: "To Partner With Us"
- Contact section:
  - "Get in Touch"
  - Email: example
- Visit section:
  - Link: artdotquarter.io
  - Address: 14-15 Allison Street, Birmingham, United Kingdom
- Social section:
  - "Follow Us"
  - Social media links
- Copyright: "© 2026 artdotagency. All Rights Reserved."
- "Back to Top ↑" link

**Styling:**
- Dark background
- Large, creative typography for "Thank You"
- Multi-column layout
- Minimal, clean design

---

## 🎨 GLOBAL DESIGN PATTERNS

### Color Scheme (Tailwind 4 - OKLCH)
```css
/* Tailwind 4 uses OKLCH for wider color gamut and better perceptual uniformity */
@theme {
  /* Base colors */
  --color-artdot-black: oklch(0.05 0 0);
  --color-artdot-dark: oklch(0.1 0 0);
  --color-artdot-gray: oklch(0.53 0 0);
  --color-artdot-light: oklch(0.98 0 0);
  
  /* Accent colors (adjust hue as needed) */
  --color-accent: oklch(0.6 0.15 30); /* Example orange-red */
  --color-accent-hover: oklch(0.5 0.15 30);
}

/* Alternative using CSS variables for dynamic theming */
:root {
  --bg-primary: oklch(0.05 0 0);
  --text-primary: oklch(0.98 0 0);
  --text-secondary: oklch(0.7 0 0);
}
```

### Typography (Tailwind 4)
```css
@theme {
  /* Font families */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-heading: 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'IBM Plex Mono', 'Courier New', monospace;

  /* Font sizes - Tailwind 4 uses custom properties */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;
  --text-6xl: 3.75rem;
  --text-7xl: 4.5rem;
  --text-8xl: 6rem;
  
  /* Line heights */
  --text-xs--line-height: 1rem;
  --text-sm--line-height: 1.25rem;
  --text-base--line-height: 1.5rem;
  --text-lg--line-height: 1.75rem;
  --text-xl--line-height: 1.75rem;
}

/* Usage in components */
.hero-title {
  font-size: var(--text-6xl);
  font-family: var(--font-heading);
  line-height: 1.1;
}
```

**Note:** In Tailwind 4, you can also use utilities directly like `text-6xl`, `font-sans`, etc. The above shows how to define custom values.

### Spacing & Layout
```css
/* Tailwind 4 maintains the same spacing scale */
/* Use standard Tailwind utilities: p-4, m-8, gap-6, etc. */

/* Sections typically use: */
- py-20 or py-32 (vertical padding)
- max-w-7xl mx-auto (max width, centered)
- px-6 lg:px-8 (horizontal padding, responsive)
- gap-8 lg:gap-12 (grid/flex gaps)

/* Container queries (new in Tailwind 4 - experimental) */
@container (min-width: 400px) {
  .card {
    grid-template-columns: 1fr 1fr;
  }
}
```

**Tailwind 4 New Features to Leverage:**
- **3D Transforms:** Native support with `rotate-x-*`, `rotate-y-*`, `rotate-z-*`
- **Container Queries:** `@container` for component-based responsive design
- **Color-mix():** Dynamic color mixing `color-mix(in oklch, red 50%, blue)`
- **Cascade Layers:** Better specificity management built-in
- **`size-*` utility:** Set width and height together (e.g., `size-12` = `w-12 h-12`)
- **Automatic content detection:** No need to configure `content` array

### Animation Patterns
```javascript
// Scroll-triggered animations
const { stop } = useIntersectionObserver(
  target,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      // Trigger animation
    }
  }
)

// Smooth scroll with Lenis
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
})
```

## 🎬 ANIMATION GUIDELINES

### Lenis Smooth Scroll Setup
```javascript
// plugins/lenis.client.js
import Lenis from 'lenis'

export default defineNuxtPlugin(() => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  })

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)

  return {
    provide: {
      lenis
    }
  }
})
```

### Tailwind CSS 4 Setup
With Tailwind 4, the setup is simplified. In your main CSS file:

```css
/* assets/css/main.css */
@import "tailwindcss";

/* Your custom theme variables (Tailwind 4 uses @theme) */
@theme {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Courier New', monospace;
  
  /* Custom colors */
  --color-artdot-black: oklch(0.05 0 0);
  --color-artdot-gray: oklch(0.53 0 0);
  
  /* Custom sizes */
  --text-7xl: 5rem;
  --text-8xl: 6rem;
}

/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.animate-marquee {
  animation: marquee 20s linear infinite;
}
```

**Note:** Tailwind 4 uses native CSS features like `@theme`, cascade layers, and `@property`. Configuration is now done in CSS instead of JavaScript.

### Scroll-Triggered Animations
```javascript
// composables/useScrollAnimation.js
import { useIntersectionObserver } from '@vueuse/core'

export const useScrollAnimation = (target, options = {}) => {
  const { threshold = 0.1, rootMargin = '0px' } = options
  
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        // Trigger your animation
        target.value?.classList.add('animate-in')
      }
    },
    { threshold, rootMargin }
  )
  
  return { stop }
}
```

### Counter Animation
```javascript
// composables/useCounterAnimation.js
import { gsap } from 'gsap'

export const useCounterAnimation = (target, endValue, duration = 2) => {
  const counter = { value: 0 }
  
  gsap.to(counter, {
    value: endValue,
    duration,
    ease: 'power1.out',
    onUpdate: () => {
      target.value = Math.round(counter.value)
    }
  })
}
```

---

## 📝 CODING WORKFLOW

### When Building Each Section:

1. **Create Component**
   - Use `components/` directory
   - Follow naming convention: `SectionName.vue`

2. **Structure**
   ```vue
   <script setup lang="ts">
   // Imports
   // Composables
   // Reactive data
   // Methods
   // Lifecycle hooks
   </script>

   <template>
     <!-- HTML structure -->
   </template>

   <style scoped>
   /* Component-specific styles */
   </style>
   ```

3. **Use Tailwind First**
   - Prefer Tailwind utilities
   - Only use custom CSS for complex animations

4. **Implement Animations**
   - Use Intersection Observer for scroll triggers
   - GSAP for complex animations
   - CSS transitions for simple effects

5. **Responsive Design**
   - Mobile-first approach
   - Breakpoints: sm, md, lg, xl, 2xl
   - Test on multiple screen sizes

---

## 🚀 PROMPT TEMPLATE FOR EACH SECTION

When requesting a section to be built, use this format:

```
Build the [SECTION NAME] component for the Artdot Agency website.

Requirements:
- Component name: [ComponentName].vue
- Location: components/[ComponentName].vue
- Based on SECTION [NUMBER] in the project spec

Features needed:
- [List specific features]
- [Animation requirements]
- [Responsive considerations]

Please include:
1. Full Vue 3 Composition API setup
2. Tailwind CSS styling
3. Animations using [GSAP/VueUse Motion/CSS]
4. Responsive design (mobile, tablet, desktop)
5. TypeScript types (if applicable)
6. Comments explaining key logic

Additional notes:
[Any specific customizations or questions]
```

---

## 📋 CHECKLIST FOR COMPLETION

### Setup & Configuration
- [ ] Nuxt 4 project initialized
- [ ] All dependencies installed
- [ ] Tailwind CSS 4 configured with @import
- [ ] Smooth scroll plugin (Lenis) working
- [ ] **Custom cursor follower implemented**

### Core Sections
- [ ] Hero section
- [ ] Navigation dots
- [ ] About section
- [ ] Mission section
- [ ] Capabilities section
- [ ] Stats section
- [ ] Marquee section
- [ ] Brand activation
- [ ] Artist network
- [ ] CTA banner
- [ ] Case studies
- [ ] Live feed
- [ ] Process section
- [ ] Services section
- [ ] Value proposition
- [ ] Pricing section
- [ ] Footer section
- [ ] Responsive design tested
- [ ] Animations working
- [ ] Performance optimized
- [ ] Cross-browser tested

---

## 💡 TIPS & BEST PRACTICES

1. **Performance**
   - Lazy load images
   - Defer heavy animations until visible
   - Use `<ClientOnly>` for client-side only components

2. **Accessibility**
   - Add ARIA labels
   - Ensure keyboard navigation
   - Test with screen readers

3. **SEO**
   - Use semantic HTML
   - Add meta tags
   - Optimize images with alt text

4. **Code Organization**
   - Keep components small and focused
   - Use composables for shared logic
   - Extract constants to separate files

5. **Animation Performance**
   - Use `transform` and `opacity` for GPU acceleration
   - Avoid animating `width`, `height`, `top`, `left`
   - Use `will-change` sparingly

---

