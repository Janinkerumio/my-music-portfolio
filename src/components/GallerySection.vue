<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { PhX, PhCaretLeft, PhCaretRight } from '@phosphor-icons/vue'
import PhotoSlot from './PhotoSlot.vue'
import { gallery } from '../data'
import { galleryStatus, galleryPhotos, showGallery } from '../gallery'

const dev = import.meta.env.DEV
// Live site shows only photos that exist. Locally, every slot shows so you can see where files go.
const tiles = computed(() => (dev ? gallery : galleryPhotos.value))

const open = ref(-1)
const viewable = galleryPhotos
const current = computed(() => viewable.value[open.value])

function show(item) {
  if (galleryStatus[item.src] !== 'ok') return
  open.value = viewable.value.indexOf(item)
}

const close = () => (open.value = -1)
const step = (dir) => (open.value = (open.value + dir + viewable.value.length) % viewable.value.length)

function onKey(e) {
  if (open.value < 0) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowRight') step(1)
  if (e.key === 'ArrowLeft') step(-1)
}

watch(open, (v) => {
  document.documentElement.style.overflow = v >= 0 ? 'hidden' : ''
  if (v >= 0) window.addEventListener('keydown', onKey)
  else window.removeEventListener('keydown', onKey)
})

onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <section v-if="showGallery" id="gallery" class="section">
    <div class="wrap">
      <h2 v-reveal class="h2">Photo gallery</h2>

      <ul class="grid">
        <li v-for="(g, i) in tiles" :key="g.src" v-reveal="(i % 3) * 80" :class="{ wide: g.wide }">
          <button class="tile" :aria-label="`View photo: ${g.alt}`" @click="show(g)">
            <PhotoSlot :src="g.src" :alt="g.alt" />
          </button>
        </li>
      </ul>
    </div>

    <Teleport to="body">
      <Transition name="lb">
        <div v-if="current" class="lightbox" role="dialog" aria-modal="true" :aria-label="current.alt" @click.self="close">
          <img :key="current.src" :src="current.src" :alt="current.alt" />
          <p class="cap">{{ current.alt }}</p>
          <button class="lb-btn close" aria-label="Close" @click="close"><PhX :size="20" weight="light" /></button>
          <template v-if="viewable.length > 1">
            <button class="lb-btn prev" aria-label="Previous photo" @click="step(-1)">
              <PhCaretLeft :size="20" weight="light" />
            </button>
            <button class="lb-btn next" aria-label="Next photo" @click="step(1)">
              <PhCaretRight :size="20" weight="light" />
            </button>
          </template>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.grid {
  list-style: none;
  margin: clamp(40px, 5vw, 64px) 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: clamp(220px, 24vw, 340px);
  grid-auto-flow: dense;
  gap: 12px;
}

.wide {
  grid-column: span 2;
}

.tile {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: var(--r-core);
  overflow: hidden;
  border: 1px solid var(--line);
  cursor: zoom-in;
}

.tile :deep(img) {
  transition: transform 1.2s var(--ease);
}

.tile:hover :deep(img) {
  transform: scale(1.04);
}

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 72px;
  background: rgba(12, 10, 9, 0.94);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.lightbox img {
  max-width: 100%;
  max-height: calc(100dvh - 160px);
  border-radius: 14px;
  object-fit: contain;
}

.cap {
  margin-top: 16px;
  color: var(--muted);
  font-size: 0.92rem;
  text-align: center;
}

.lb-btn {
  position: absolute;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(236, 228, 216, 0.08);
  border: 1px solid var(--line-strong);
  transition: background-color 0.4s var(--ease);
}

.lb-btn:hover {
  background: rgba(236, 228, 216, 0.16);
}

.close {
  top: 20px;
  right: 20px;
}

.prev {
  left: 16px;
  top: 50%;
  translate: 0 -50%;
}

.next {
  right: 16px;
  top: 50%;
  translate: 0 -50%;
}

.lb-enter-active,
.lb-leave-active {
  transition: opacity 0.45s var(--ease);
}

.lb-enter-from,
.lb-leave-to {
  opacity: 0;
}

@media (max-width: 767px) {
  .grid {
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 44vw;
    gap: 8px;
  }

  .lightbox {
    padding: 72px 16px;
  }

  .prev,
  .next {
    top: auto;
    bottom: 20px;
    translate: none;
  }

  .prev {
    left: calc(50% - 56px);
  }

  .next {
    right: calc(50% - 56px);
  }
}
</style>
