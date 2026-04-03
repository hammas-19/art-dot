<template>
  <div>
    <NuxtRouteAnnouncer />
    <ClientOnly>
      <CursorFollower />
    </ClientOnly>
    <!-- <NavigationDots /> -->
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
    <ServicesSection />
    <ValuePropositionSection />
    <PricingSection />
    <FooterSection />
  </div>
</template>
<script setup>
onMounted(() => {
  useRouter().push("/test")
})
</script>
