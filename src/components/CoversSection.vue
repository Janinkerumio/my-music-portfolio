<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { PhPlay, PhPause, PhSkipBack, PhSkipForward, PhArrowSquareOut, PhCaretDown } from '@phosphor-icons/vue'
import { covers, recordingLabels, coverStreamUrl, coverDriveUrl, driveFolderUrl } from '../data'

const audio = ref(null)
const index = ref(0)
const status = ref('idle') // idle | loading | playing | paused | error
const current = ref(0)
const duration = ref(0)
const showAll = ref(false)
const showLegend = ref(false)

const INITIAL = 6
const track = computed(() => covers[index.value])
const playing = computed(() => status.value === 'playing')
const visible = computed(() => (showAll.value ? covers : covers.slice(0, INITIAL)))
const usedLabels = [...new Set(covers.map((c) => c.label))]

function fmt(s) {
  if (!Number.isFinite(s)) return '0:00'
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

async function play() {
  status.value = 'loading'
  try {
    await audio.value.play()
  } catch (e) {
    if (e.name !== 'AbortError') status.value = 'error'
  }
}

function toggle() {
  if (playing.value || status.value === 'loading') audio.value.pause()
  else play()
}

async function select(i) {
  if (i === index.value && status.value !== 'error') return toggle()
  index.value = i
  current.value = 0
  duration.value = 0
  status.value = 'idle'
  await nextTick()
  audio.value.load()
  play()
}

function step(dir) {
  const next = (index.value + dir + covers.length) % covers.length
  if (next >= INITIAL) showAll.value = true
  select(next)
}

function seek(e) {
  if (duration.value) audio.value.currentTime = (Number(e.target.value) / 1000) * duration.value
}

const progress = computed(() => (duration.value ? (current.value / duration.value) * 1000 : 0))

const handlers = {
  playing: () => (status.value = 'playing'),
  pause: () => status.value !== 'error' && (status.value = 'paused'),
  waiting: () => (status.value = 'loading'),
  timeupdate: () => (current.value = audio.value.currentTime),
  loadedmetadata: () => (duration.value = audio.value.duration),
  durationchange: () => (duration.value = audio.value.duration),
  ended: () => step(1),
  error: () => (status.value = 'error'),
}

watch(index, () => {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.value.title,
      artist: `${track.value.artist} (cover by Janino Abrenica)`,
    })
  }
})
</script>

<template>
  <section id="music" class="section">
    <div class="wrap narrow">
      <h2 v-reveal class="h2 center">Latest covers</h2>
      <p v-reveal="80" class="lede center">
        Fingerstyle arrangements I recorded myself, mostly on my phone. Press play on any track.
      </p>

      <div v-reveal="120" class="shell card">
        <div class="core">
          <!-- Now playing -->
          <div class="now">
            <div class="disc" :class="{ spin: playing }" aria-hidden="true">
              <span class="hole" />
            </div>
            <div class="now-meta">
              <p class="now-label mono">{{ playing ? 'Now playing' : 'Ready to play' }}</p>
              <h3>{{ track.title }}</h3>
              <p class="artist">{{ track.artist }}<span v-if="track.note"> / {{ track.note }}</span></p>
            </div>
            <div class="controls">
              <button class="ctl" aria-label="Previous track" @click="step(-1)">
                <PhSkipBack :size="18" weight="light" />
              </button>
              <button
                class="ctl main"
                :class="{ busy: status === 'loading' }"
                :aria-label="playing ? 'Pause' : 'Play'"
                @click="toggle"
              >
                <PhPause v-if="playing" :size="22" weight="fill" />
                <PhPlay v-else :size="22" weight="fill" />
              </button>
              <button class="ctl" aria-label="Next track" @click="step(1)">
                <PhSkipForward :size="18" weight="light" />
              </button>
            </div>
          </div>

          <div class="scrub">
            <span class="mono">{{ fmt(current) }}</span>
            <input
              type="range"
              min="0"
              max="1000"
              :value="progress"
              :style="{ '--p': progress / 10 + '%' }"
              :disabled="!duration"
              aria-label="Seek"
              @input="seek"
            />
            <span class="mono">{{ duration ? fmt(duration) : status === 'loading' ? '...' : '0:00' }}</span>
          </div>

          <p v-if="status === 'error'" class="error" role="alert">
            This track would not load.
            <a :href="coverDriveUrl(track.id)" target="_blank" rel="noopener">Play it on Google Drive</a>.
          </p>

          <!-- Tracks -->
          <TransitionGroup tag="ol" name="row" class="tracks">
            <li v-for="(c, i) in visible" :key="c.id">
              <button class="row" :class="{ active: i === index }" :aria-current="i === index" @click="select(i)">
                <span class="play-ic" aria-hidden="true">
                  <span v-if="i === index && playing" class="eq"><i /><i /><i /></span>
                  <PhPause v-else-if="i === index && status === 'loading'" :size="14" weight="fill" />
                  <PhPlay v-else :size="14" weight="fill" />
                </span>
                <span class="row-title">{{ c.title }}</span>
                <span class="row-artist">{{ c.artist }}</span>
                <span class="row-tag mono" :title="recordingLabels[c.label].desc">{{ c.label }}</span>
              </button>
            </li>
          </TransitionGroup>

          <div class="foot">
            <button class="more" :aria-expanded="showAll" @click="showAll = !showAll">
              {{ showAll ? 'Show fewer' : `Show all ${covers.length} tracks` }}
              <PhCaretDown :size="14" weight="light" :class="{ flip: showAll }" />
            </button>
            <button class="more" :aria-expanded="showLegend" @click="showLegend = !showLegend">
              About the tags
              <PhCaretDown :size="14" weight="light" :class="{ flip: showLegend }" />
            </button>
          </div>

          <Transition name="fold">
            <dl v-if="showLegend" class="legend">
              <div v-for="key in usedLabels" :key="key">
                <dt class="mono">{{ key }}</dt>
                <dd>{{ recordingLabels[key].source }}. {{ recordingLabels[key].desc }}</dd>
              </div>
              <a class="folder" :href="driveFolderUrl" target="_blank" rel="noopener">
                All recordings on Google Drive <PhArrowSquareOut :size="14" weight="light" />
              </a>
            </dl>
          </Transition>

          <audio ref="audio" :src="coverStreamUrl(track.file)" preload="metadata" v-on="handlers" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.narrow {
  max-width: 920px;
}

.center {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.h2.center {
  max-width: none;
}

.card {
  margin-top: clamp(40px, 5vw, 64px);
}

.now {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 20px;
  padding: 24px 24px 8px;
}

/* A small sunburst guitar body, spinning like a record while a track plays. */
.disc {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background:
    repeating-radial-gradient(circle, transparent 0 9px, rgba(236, 228, 216, 0.35) 9px 10px, transparent 10px 12px),
    radial-gradient(circle, #c9762f 0%, #8a4320 40%, #2a160c 90%);
  display: grid;
  place-items: center;
  box-shadow: 0 10px 30px -10px rgba(240, 100, 60, 0.45);
  animation: spin 6s linear infinite paused;
}

.disc.spin {
  animation-play-state: running;
}

.hole {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #0b0908;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.now-label {
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--accent);
}

h3 {
  margin-top: 6px;
  font-size: clamp(1.4rem, 2.6vw, 1.9rem);
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.artist {
  margin-top: 4px;
  color: var(--muted);
  font-size: 0.95rem;
}

.controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ctl {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1px solid var(--line-strong);
  transition: background-color 0.4s var(--ease), transform 0.4s var(--ease);
}

.ctl:hover {
  background: rgba(236, 228, 216, 0.06);
}

.ctl:active {
  transform: scale(0.94);
}

.ctl.main {
  width: 56px;
  height: 56px;
  border: 0;
  background: var(--accent);
  color: #1a0d07;
}

.ctl.main:hover {
  background: #f57650;
}

.ctl.busy {
  animation: pulse 1.1s var(--ease) infinite alternate;
}

@keyframes pulse {
  to {
    opacity: 0.6;
  }
}

.scrub {
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  gap: 12px;
  padding: 12px 24px 20px;
  font-size: 11px;
  color: var(--faint);
}

.scrub span:last-child {
  text-align: right;
}

input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 18px;
  background: transparent;
  cursor: pointer;
  --p: 0%;
}

input[type='range']::-webkit-slider-runnable-track {
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(to right, var(--accent) var(--p), rgba(236, 228, 216, 0.14) var(--p));
}

input[type='range']::-moz-range-track {
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(to right, var(--accent) var(--p), rgba(236, 228, 216, 0.14) var(--p));
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 13px;
  height: 13px;
  margin-top: -5px;
  border-radius: 50%;
  background: var(--text);
}

input[type='range']::-moz-range-thumb {
  width: 13px;
  height: 13px;
  border: 0;
  border-radius: 50%;
  background: var(--text);
}

input:disabled {
  cursor: default;
}

.error {
  padding: 0 24px 16px;
  font-size: 0.92rem;
  color: #f2a48c;
}

.error a {
  text-decoration: underline;
}

.tracks {
  list-style: none;
  margin: 0;
  padding: 8px;
  border-top: 1px solid var(--line);
}

.row {
  width: 100%;
  display: grid;
  grid-template-columns: 36px minmax(0, 1.2fr) minmax(0, 1fr) 80px;
  align-items: center;
  gap: 14px;
  padding: 12px 16px 12px 12px;
  border-radius: 16px;
  text-align: left;
  transition: background-color 0.4s var(--ease), transform 0.4s var(--ease);
}

.row:hover {
  background: rgba(236, 228, 216, 0.04);
}

.row:active {
  transform: scale(0.99);
}

.row.active {
  background: var(--accent-soft);
}

.play-ic {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1px solid var(--line-strong);
  color: var(--muted);
  transition: background-color 0.4s var(--ease), color 0.4s var(--ease), border-color 0.4s var(--ease);
}

.row:hover .play-ic,
.row.active .play-ic {
  background: var(--accent);
  border-color: transparent;
  color: #1a0d07;
}

.row-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-artist {
  color: var(--muted);
  font-size: 0.92rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-tag {
  font-size: 10px;
  color: var(--faint);
  text-align: right;
}

.eq {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 12px;
}

.eq i {
  width: 2.5px;
  height: 100%;
  background: #1a0d07;
  border-radius: 1px;
  transform-origin: bottom;
  animation: eq 0.8s var(--ease) infinite alternate;
}

.eq i:nth-child(2) {
  animation-delay: -0.3s;
}

.eq i:nth-child(3) {
  animation-delay: -0.55s;
}

@keyframes eq {
  from {
    transform: scaleY(0.25);
  }
  to {
    transform: scaleY(1);
  }
}

.row-enter-active {
  transition: opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out);
}

.row-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.row-leave-active {
  display: none;
}

.foot {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 16px 16px;
}

.more {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 0.9rem;
  color: var(--muted);
  transition: color 0.4s var(--ease), background-color 0.4s var(--ease);
}

.more:hover {
  color: var(--text);
  background: rgba(236, 228, 216, 0.05);
}

.more svg {
  transition: transform 0.5s var(--ease);
}

.more .flip {
  transform: rotate(180deg);
}

.legend {
  margin: 0;
  padding: 8px 28px 28px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px 28px;
}

dt {
  font-size: 12px;
  color: var(--accent);
}

dd {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 0.9rem;
}

.folder {
  grid-column: 1 / -1;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: max-content;
  color: var(--text);
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-color: var(--line-strong);
}

.fold-enter-active,
.fold-leave-active {
  transition: opacity 0.5s var(--ease), transform 0.5s var(--ease);
}

.fold-enter-from,
.fold-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 680px) {
  .now {
    grid-template-columns: auto 1fr;
    padding: 20px 18px 4px;
    gap: 16px;
  }

  .disc {
    width: 60px;
    height: 60px;
  }

  .controls {
    grid-column: 1 / -1;
    justify-content: center;
  }

  .scrub {
    padding: 12px 18px 18px;
  }

  .row {
    grid-template-columns: 36px minmax(0, 1fr) auto;
    grid-template-rows: auto auto;
    column-gap: 12px;
    row-gap: 0;
  }

  .play-ic {
    grid-row: span 2;
  }

  .row-artist {
    grid-column: 2;
    grid-row: 2;
    font-size: 0.85rem;
  }

  .row-tag {
    grid-column: 3;
    grid-row: 1 / span 2;
  }

  .legend {
    grid-template-columns: 1fr;
    padding: 8px 20px 24px;
  }

  .foot {
    flex-wrap: wrap;
  }
}
</style>
