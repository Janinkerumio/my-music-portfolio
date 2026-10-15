<script setup>
import SiteNav from './components/SiteNav.vue'
import HeroSection from './components/HeroSection.vue'
import CoversSection from './components/CoversSection.vue'
import AboutSection from './components/AboutSection.vue'
import GallerySection from './components/GallerySection.vue'
import ProductionsSection from './components/ProductionsSection.vue'
import BookingSection from './components/BookingSection.vue'
</script>

<template>
  <SiteNav />
  <main>
    <HeroSection />
    <CoversSection />
    <AboutSection />
    <!-- Upcoming events goes here once there are dates to list. -->
    <GallerySection />
    <ProductionsSection />
    <BookingSection />
  </main>
</template>
