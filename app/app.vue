<script setup lang="ts">
import CursorFollower from "./components/CursorFollower.vue";
import HeroSection from "./components/HeroSection.vue";
import NavigationDots from "./components/NavigationDots.vue";
import AboutSection from "./components/AboutSection.vue";
import MissionSection from "./components/MissionSection.vue";
import CapabilitiesSection from "./components/CapabilitiesSection.vue";
import StatsSection from "./components/StatsSection.vue";
import MarqueeSection from "./components/MarqueeSection.vue";
import BrandActivationSection from "./components/BrandActivationSection.vue";
import ArtistNetworkSection from "./components/ArtistNetworkSection.vue";
import CtaBanner from "./components/CtaBanner.vue";
import CaseStudiesSection from "./components/CaseStudiesSection.vue";
import LiveFeedSection from "./components/LiveFeedSection.vue";
import ProcessSection from "./components/ProcessSection.vue";
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <ClientOnly>
      <CursorFollower />
    </ClientOnly>
    <NavigationDots />
    <HeroSection />
    <AboutSection />
    <MissionSection />
    <CapabilitiesSection />
    <StatsSection />
    <MarqueeSection />
    <BrandActivationSection />
    <ArtistNetworkSection />
    <CtaBanner />
    <CaseStudiesSection />
    <LiveFeedSection />
    <ProcessSection />
  </div>
</template>
