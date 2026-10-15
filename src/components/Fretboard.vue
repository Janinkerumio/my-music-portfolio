<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { PhSpeakerHigh, PhSpeakerSlash } from '@phosphor-icons/vue'

// Standard tuning, low E on top the way you see it holding the guitar.
const STRINGS = [
  { note: 'E2', name: 'E', freq: 82.41, width: 3.2, wound: true },
  { note: 'A2', name: 'A', freq: 110.0, width: 2.7, wound: true },
  { note: 'D3', name: 'D', freq: 146.83, width: 2.2, wound: true },
  { note: 'G3', name: 'G', freq: 196.0, width: 1.7, wound: false },
  { note: 'B3', name: 'B', freq: 246.94, width: 1.3, wound: false },
  { note: 'E4', name: 'e', freq: 329.63, width: 1.0, wound: false },
]

const W = 640
const H = 420
const NUT = 58
const SCALE = 1371
const TOP = 82
const GAP = 51
const stringY = STRINGS.map((_, i) => TOP + i * GAP)
const frets = Array.from({ length: 10 }, (_, i) => NUT + SCALE * (1 - 2 ** (-(i + 1) / 12)))
const fretX = (n) => (n === 0 ? NUT : frets[n - 1])
const inlays = [3, 5, 7, 9].map((n) => (fretX(n - 1) + fretX(n)) / 2)

const svg = ref(null)
const paths = []
const windings = []
const soundOn = ref(false)
const lastNote = ref('')
const noteKey = ref(0)
const isTouch = ref(false)

const reduceMotion = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

// ---- Vibration: damped sine on the curve's control point, written straight to the DOM.
const state = STRINGS.map(() => ({ amp: 0, x: W / 2, t0: 0 }))
let raf = 0

function flatPath(i) {
  return `M${NUT - 6} ${stringY[i]} L${W} ${stringY[i]}`
}

function frame(now) {
  let active = false
  state.forEach((s, i) => {
    if (!s.amp) return
    const t = (now - s.t0) / 1000
    const decay = Math.exp(-t * 3.2)
    if (decay < 0.02) {
      s.amp = 0
      paths[i]?.setAttribute('d', flatPath(i))
      windings[i]?.setAttribute('d', flatPath(i))
      paths[i]?.classList.remove('hot')
      return
    }
    active = true
    const offset = s.amp * decay * Math.sin(t * 2 * Math.PI * (14 + i * 2))
    const d = `M${NUT - 6} ${stringY[i]} Q${s.x} ${stringY[i] + offset * 2} ${W} ${stringY[i]}`
    paths[i]?.setAttribute('d', d)
    windings[i]?.setAttribute('d', d)
  })
  raf = active ? requestAnimationFrame(frame) : 0
}

function pluck(i, x, strength = 1) {
  lastNote.value = STRINGS[i].note
  noteKey.value++
  if (soundOn.value) playString(i, strength)
  if (reduceMotion) return
  state[i] = { amp: 7 * strength, x: Math.min(Math.max(x, NUT + 40), W - 40), t0: performance.now() }
  paths[i]?.classList.add('hot')
  if (!raf) raf = requestAnimationFrame(frame)
}

// ---- Sound: Karplus-Strong plucked string, one buffer per string, built when sound is switched on.
let ctx = null
let buffers = []

function buildBuffer(freq) {
  const sr = ctx.sampleRate
  const period = Math.round(sr / freq)
  const len = Math.floor(sr * 2.6)
  const buf = ctx.createBuffer(1, len, sr)
  const d = buf.getChannelData(0)
  for (let i = 0; i < period; i++) d[i] = Math.random() * 2 - 1
  for (let i = 1; i < period; i++) d[i] = (d[i] + d[i - 1]) / 2
  const damp = 0.4985 + Math.min(freq, 330) / 330 * 0.0008
  for (let i = period; i < len; i++) d[i] = damp * (d[i - period] + d[i - period + 1])
  return buf
}

function playString(i, strength) {
  if (!ctx) return
  const src = ctx.createBufferSource()
  src.buffer = buffers[i]
  const gain = ctx.createGain()
  gain.gain.value = 0.22 * Math.min(1, 0.55 + strength * 0.45)
  src.connect(gain).connect(ctx.destination)
  src.start()
}

async function toggleSound() {
  if (!soundOn.value) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    ctx ??= new AC()
    if (ctx.state === 'suspended') await ctx.resume()
    if (!buffers.length) buffers = STRINGS.map((s) => buildBuffer(s.freq))
    soundOn.value = true
    // A soft open-string strum confirms the sound is live.
    STRINGS.forEach((_, i) => setTimeout(() => pluck(i, W * 0.62, 0.6), i * 38))
  } else {
    soundOn.value = false
  }
}

// ---- Pointer: map screen coords into the viewBox (preserveAspectRatio slice).
function toBox(e) {
  const r = svg.value.getBoundingClientRect()
  const s = Math.max(r.width / W, r.height / H)
  return {
    x: (e.clientX - r.left) / s,
    y: (e.clientY - r.top - (r.height - H * s) / 2) / s,
  }
}

let lastY = null
let lastT = 0

function onMove(e) {
  if (e.pointerType === 'touch') return
  const { x, y } = toBox(e)
  const now = performance.now()
  if (lastY !== null) {
    const lo = Math.min(lastY, y)
    const hi = Math.max(lastY, y)
    const speed = Math.abs(y - lastY) / Math.max(now - lastT, 8)
    stringY.forEach((sy, i) => {
      if (sy > lo && sy <= hi) pluck(i, x, Math.min(1, 0.35 + speed * 0.35))
    })
  }
  lastY = y
  lastT = now
}

function onLeave() {
  lastY = null
}

function onDown(e) {
  if (e.pointerType !== 'touch') return
  isTouch.value = true
  const { x, y } = toBox(e)
  let best = -1
  let dist = 30
  stringY.forEach((sy, i) => {
    if (Math.abs(sy - y) < dist) {
      dist = Math.abs(sy - y)
      best = i
    }
  })
  if (best >= 0) pluck(best, x, 0.9)
}

onMounted(() => {
  isTouch.value = matchMedia('(hover: none)').matches
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  ctx?.close()
})
</script>

<template>
  <div class="shell board-shell">
    <div class="core board">
      <svg
        ref="svg"
        :viewBox="`0 0 ${W} ${H}`"
        preserveAspectRatio="xMinYMid slice"
        class="neck"
        role="img"
        aria-label="An interactive guitar neck in standard tuning. Move across the strings to strum."
        @pointermove="onMove"
        @pointerleave="onLeave"
        @pointerdown="onDown"
      >
        <defs>
          <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#2e2018" />
            <stop offset="0.5" stop-color="#231812" />
            <stop offset="1" stop-color="#1b130e" />
          </linearGradient>
          <pattern id="grain" width="240" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 4 C60 2 120 7 240 4" stroke="rgba(0,0,0,0.25)" stroke-width="1" fill="none" />
            <path d="M0 11 C80 13 150 9 240 11" stroke="rgba(255,220,190,0.03)" stroke-width="1" fill="none" />
          </pattern>
          <linearGradient id="fret" x1="0" x2="1">
            <stop offset="0" stop-color="#8f877d" />
            <stop offset="0.5" stop-color="#e6ddd0" />
            <stop offset="1" stop-color="#7a7269" />
          </linearGradient>
        </defs>

        <rect :width="W" :height="H" fill="url(#wood)" />
        <rect :width="W" :height="H" fill="url(#grain)" />

        <!-- Inlays -->
        <circle v-for="x in inlays" :key="x" :cx="x" :cy="H / 2 + 6" r="9" class="inlay" />

        <!-- Nut + frets -->
        <rect :x="NUT - 12" y="0" width="12" :height="H" fill="#e9e0d1" />
        <rect v-for="x in frets" :key="x" :x="x - 2" y="0" width="4" :height="H" fill="url(#fret)" opacity="0.85" />

        <text
          v-for="(s, i) in STRINGS"
          :key="'t' + s.note"
          x="24"
          :y="stringY[i]"
          class="tune"
          text-anchor="middle"
          dominant-baseline="central"
        >{{ s.name }}</text>

        <!-- Strings -->
        <g v-for="(s, i) in STRINGS" :key="s.note">
          <path :d="flatPath(i)" class="shadow" :stroke-width="s.width + 2" :transform="`translate(0 4)`" />
          <path
            :ref="(el) => (paths[i] = el)"
            :d="flatPath(i)"
            class="string"
            :stroke-width="s.width"
          />
          <path
            v-if="s.wound"
            :ref="(el) => (windings[i] = el)"
            :d="flatPath(i)"
            class="winding"
            :stroke-width="s.width"
          />
        </g>
      </svg>


      <div class="hud">
        <button class="sound" :class="{ on: soundOn }" :aria-pressed="soundOn" @click="toggleSound">
          <component :is="soundOn ? PhSpeakerHigh : PhSpeakerSlash" :size="18" weight="light" />
          <span>{{ soundOn ? 'Sound on' : 'Turn on sound' }}</span>
        </button>
        <p class="hint mono">
          {{ isTouch ? 'Tap a string' : 'Sweep across the strings' }}
        </p>
      </div>

      <p class="note mono" aria-live="polite">
        <Transition name="note" mode="out-in">
          <span :key="noteKey">{{ lastNote }}</span>
        </Transition>
      </p>
    </div>
  </div>
</template>

<style scoped>
.board-shell {
  height: 100%;
}

.board {
  position: relative;
  background: var(--wood-2);
}

.neck {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: pan-y;
  cursor: grab;
}

.inlay {
  fill: #d8cfc2;
  opacity: 0.55;
}

.shadow {
  stroke: rgba(0, 0, 0, 0.45);
  fill: none;
  filter: blur(1.5px);
}

.string {
  stroke: #ddd4c7;
  fill: none;
  stroke-linecap: round;
  transition: stroke 0.6s var(--ease);
}

.string.hot {
  stroke: var(--accent);
}

.winding {
  stroke: rgba(40, 30, 22, 0.55);
  fill: none;
  stroke-dasharray: 1 1.6;
  pointer-events: none;
}

.tune {
  font-family: var(--mono);
  font-size: 11px;
  fill: rgba(236, 228, 216, 0.55);
}

.hud {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  pointer-events: none;
}

.sound {
  pointer-events: auto;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px 8px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  background: rgba(16, 14, 13, 0.78);
  border: 1px solid var(--line-strong);
  transition: background-color 0.4s var(--ease), color 0.4s var(--ease), transform 0.4s var(--ease);
}

.sound:active {
  transform: scale(0.96);
}

.sound.on {
  background: var(--accent);
  color: #1a0d07;
  border-color: transparent;
}

.hint {
  font-size: 11px;
  color: rgba(236, 228, 216, 0.6);
  background: rgba(16, 14, 13, 0.6);
  padding: 6px 10px;
  border-radius: 999px;
}

@media (max-width: 560px) {
  .hint {
    display: none;
  }
}

.note {
  position: absolute;
  top: 14px;
  right: 18px;
  margin: 0;
  font-size: 13px;
  color: var(--accent);
  min-width: 2ch;
  text-align: right;
  pointer-events: none;
}

.note-enter-active,
.note-leave-active {
  transition: opacity 0.25s var(--ease), transform 0.25s var(--ease);
}

.note-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.note-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
