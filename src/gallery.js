import { reactive, computed } from 'vue'
import { gallery } from './data'

// Probes which gallery photos actually exist so the section (and its nav link)
// can hide itself on the live site until photos are added.
const status = reactive(Object.fromEntries(gallery.map((g) => [g.src, 'loading'])))

if (typeof window !== 'undefined') {
  for (const g of gallery) {
    const img = new Image()
    img.onload = () => (status[g.src] = 'ok')
    img.onerror = () => (status[g.src] = 'missing')
    img.src = g.src
  }
}

export const galleryStatus = status
export const galleryPhotos = computed(() => gallery.filter((g) => status[g.src] === 'ok'))
export const showGallery = computed(() => import.meta.env.DEV || galleryPhotos.value.length > 0)
