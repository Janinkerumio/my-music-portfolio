<script setup>
import { ref, watch, computed } from 'vue'
import { showGallery } from '../gallery'

const links = computed(() =>
  [
    { href: '#music', label: 'Music' },
    { href: '#about', label: 'About' },
    showGallery.value && { href: '#gallery', label: 'Gallery' },
    { href: '#videos', label: 'Videos' },
  ].filter(Boolean),
)

const open = ref(false)
watch(open, (v) => {
  document.documentElement.style.overflow = v ? 'hidden' : ''
})
</script>

<template>
  <header class="nav-wrap">
    <nav class="nav" aria-label="Main">
      <a href="#top" class="brand" @click="open = false">
        <span class="brand-mark" aria-hidden="true">J</span>
        <span>Janino</span>
      </a>
      <ul class="links">
        <li v-for="l in links" :key="l.href">
          <a :href="l.href">{{ l.label }}</a>
        </li>
      </ul>
      <a href="#booking" class="book" @click="open = false">Book me</a>
      <button
        class="burger"
        :class="{ open }"
        :aria-expanded="open"
        aria-controls="mobile-menu"
        @click="open = !open"
      >
        <span class="sr-only">{{ open ? 'Close menu' : 'Open menu' }}</span>
        <i /><i />
      </button>
    </nav>

    <div id="mobile-menu" class="overlay" :class="{ open }" :aria-hidden="!open">
      <ul>
        <li v-for="(l, i) in links" :key="l.href" :style="{ '--i': i }">
          <a :href="l.href" :tabindex="open ? 0 : -1" @click="open = false">{{ l.label }}</a>
        </li>
        <li :style="{ '--i': links.length }">
          <a href="#booking" class="accent" :tabindex="open ? 0 : -1" @click="open = false">Book me</a>
        </li>
      </ul>
    </div>
  </header>
</template>

<style scoped>
.nav-wrap {
  position: fixed;
  top: 18px;
  left: 0;
  right: 0;
  z-index: 40;
  display: flex;
  justify-content: center;
  padding: 0 16px;
  pointer-events: none;
}

.nav {
  pointer-events: auto;
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 36px;
  height: 56px;
  padding: 0 8px 0 10px;
  border-radius: 999px;
  background: rgba(23, 20, 18, 0.72);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  border: 1px solid var(--line);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 20px 40px -20px rgba(8, 5, 3, 0.8);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--accent);
  color: #1a0d07;
  font-weight: 700;
}

.links {
  display: flex;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.links a {
  display: block;
  padding: 8px 16px;
  border-radius: 999px;
  color: var(--muted);
  font-size: 0.94rem;
  transition: color 0.4s var(--ease), background-color 0.4s var(--ease);
}

.links a:hover {
  color: var(--text);
  background: rgba(236, 228, 216, 0.06);
}

.book {
  padding: 9px 18px;
  border-radius: 999px;
  background: var(--accent);
  color: #1a0d07;
  font-size: 0.94rem;
  font-weight: 500;
  white-space: nowrap;
  transition: background-color 0.4s var(--ease), transform 0.4s var(--ease);
}

.book:hover {
  background: #f57650;
}

.book:active {
  transform: scale(0.97);
}

.overlay a.accent {
  color: var(--accent);
}

.burger {
  display: none;
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(236, 228, 216, 0.07);
}

.burger i {
  position: absolute;
  top: calc(50% - 0.75px);
  left: 12px;
  right: 12px;
  height: 1.5px;
  background: var(--text);
  transition: transform 0.6s var(--ease);
}

.burger i:first-of-type {
  transform: translateY(-4px);
}

.burger i:last-of-type {
  transform: translateY(4px);
}

.burger.open i:first-of-type {
  transform: rotate(45deg);
}

.burger.open i:last-of-type {
  transform: rotate(-45deg);
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 1;
  display: none;
  align-items: center;
  padding: 0 28px;
  background: rgba(16, 14, 13, 0.88);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.6s var(--ease);
}

.overlay.open {
  opacity: 1;
  pointer-events: auto;
}

.overlay ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.overlay li {
  overflow: hidden;
}

.overlay a {
  display: block;
  font-size: clamp(2.6rem, 12vw, 4rem);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1.15;
  transform: translateY(100%);
  opacity: 0;
  transition: transform 0.8s var(--ease), opacity 0.8s var(--ease);
  transition-delay: calc(var(--i) * 70ms + 80ms);
}

.overlay.open a {
  transform: none;
  opacity: 1;
}

@media (max-width: 767px) {
  .links {
    display: none;
  }

  .nav {
    width: 100%;
    gap: 8px;
  }

  .brand {
    margin-right: auto;
  }

  .book {
    padding: 8px 14px;
    font-size: 0.88rem;
  }

  .burger,
  .overlay {
    display: grid;
  }

  .overlay {
    display: flex;
  }
}
</style>
