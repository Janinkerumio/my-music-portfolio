<script setup>
import { PhArrowUpRight, PhPlay } from '@phosphor-icons/vue'
import PhotoSlot from './PhotoSlot.vue'
import { photos } from '../data'
</script>

<template>
  <section id="top" class="hero">
    <div class="bg">
      <PhotoSlot :src="photos.hero" alt="Janino Abrenica playing guitar on stage" eager />
    </div>
    <div class="shade" aria-hidden="true" />

    <div class="wrap content">
      <h1 class="hero-in" style="--d: 60ms">Janino Abrenica</h1>
      <p class="tag hero-in" style="--d: 160ms">Acoustic &middot; Live Music</p>
      <div class="ctas hero-in" style="--d: 260ms">
        <a href="#music" class="btn btn-primary">
          Listen
          <span class="island"><PhPlay :size="15" weight="fill" /></span>
        </a>
        <a href="#booking" class="btn btn-glass">
          Book me
          <span class="island"><PhArrowUpRight :size="16" weight="light" /></span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  isolation: isolate;
}

.bg {
  position: absolute;
  inset: 0;
  z-index: -2;
  animation: settle 2.4s var(--ease-out) both;
}

@keyframes settle {
  from {
    transform: scale(1.08);
  }
}

/* Darken the bottom and edges so the type always reads over any photo. */
.shade {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(to top, var(--bg) 2%, rgba(16, 14, 13, 0.72) 32%, rgba(16, 14, 13, 0.1) 65%, rgba(16, 14, 13, 0.45)),
    radial-gradient(120% 90% at 50% 40%, transparent 50%, rgba(16, 14, 13, 0.6));
}

.content {
  text-align: center;
  padding-bottom: clamp(72px, 12vh, 128px);
}

h1 {
  font-size: clamp(3rem, 10.5vw, 9.5rem);
  font-weight: 650;
  letter-spacing: -0.055em;
  line-height: 0.9;
  text-wrap: balance;
}

.tag {
  margin-top: 22px;
  font-family: var(--mono);
  font-size: clamp(12px, 1.2vw, 14px);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text);
  opacity: 0.8;
}

.ctas {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.btn-glass {
  color: var(--text);
  background: rgba(236, 228, 216, 0.08);
  border: 1px solid rgba(236, 228, 216, 0.22);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.btn-glass .island {
  background: rgba(236, 228, 216, 0.12);
}

.btn-glass:hover {
  background: rgba(236, 228, 216, 0.14);
}

.hero-in {
  opacity: 0;
  transform: translateY(28px);
  filter: blur(6px);
  animation: hero-in 1.1s var(--ease-out) forwards;
  animation-delay: var(--d);
}

@keyframes hero-in {
  to {
    opacity: 1;
    transform: none;
    filter: none;
  }
}
</style>
