<script setup>
import { ref, computed, nextTick } from 'vue'
import { PhPlay, PhArrowUpRight, PhWaveform } from '@phosphor-icons/vue'
import { productions, ytThumb, ytEmbed, socials } from '../data'

const filters = [
  { key: 'original', label: 'Originals' },
  { key: 'remake', label: 'Remixes and remakes' },
]
const filter = ref('original')
const featuredId = ref(productions[0].id)
const playing = ref(false)
const stage = ref(null)

const featured = computed(() => productions.find((p) => p.id === featuredId.value))
const list = computed(() => productions.filter((p) => p.kind === filter.value))
const count = (k) => productions.filter((p) => p.kind === k).length
const channel = socials.find((s) => s.icon === 'youtube').url

async function choose(p) {
  featuredId.value = p.id
  playing.value = true
  await nextTick()
  const r = stage.value.getBoundingClientRect()
  if (r.top < 80 || r.bottom > innerHeight) stage.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<template>
  <section id="videos" class="section prod">
    <div class="wrap">
      <h2 v-reveal class="h2">Videos</h2>
      <p v-reveal="80" class="lede">
        My YouTube channel, where I release progressive house as Jnin K. Everything is produced in FL Studio
        Mobile.
      </p>

      <div ref="stage" v-reveal class="shell stage-shell">
        <div class="core stage">
          <div class="screen">
            <iframe
              v-if="playing"
              :key="featured.id"
              :src="ytEmbed(featured.id)"
              :title="`${featured.title} by ${featured.credit}`"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowfullscreen
            />
            <button v-else class="poster" :aria-label="`Play ${featured.title}`" @click="playing = true">
              <img :src="ytThumb(featured.id)" :alt="''" />
              <span class="play"><PhPlay :size="28" weight="fill" /></span>
            </button>
          </div>
          <div class="caption">
            <div>
              <h3>{{ featured.title }}</h3>
              <p class="by">{{ featured.credit }}</p>
            </div>
            <p class="style mono">
              <PhWaveform :size="16" weight="light" />
              {{ featured.style }}<template v-if="featured.year"> / {{ featured.year }}</template>
            </p>
          </div>
        </div>
      </div>

      <div class="bar">
        <div class="tabs" role="tablist" aria-label="Filter productions">
          <button
            v-for="f in filters"
            :key="f.key"
            role="tab"
            :aria-selected="filter === f.key"
            :class="{ on: filter === f.key }"
            @click="filter = f.key"
          >
            {{ f.label }} <span class="mono">{{ count(f.key) }}</span>
          </button>
        </div>
        <a :href="channel" target="_blank" rel="noopener" class="btn btn-ghost">
          Full channel
          <span class="island"><PhArrowUpRight :size="16" weight="light" /></span>
        </a>
      </div>

      <TransitionGroup tag="ul" name="rail" class="rail">
        <li v-for="p in list" :key="p.id">
          <button class="card" :class="{ current: p.id === featuredId }" @click="choose(p)">
            <span class="thumb">
              <img :src="ytThumb(p.id)" alt="" loading="lazy" />
            </span>
            <span class="card-title">{{ p.title }}</span>
            <span class="card-by">{{ p.credit }}</span>
          </button>
        </li>
      </TransitionGroup>
    </div>
  </section>
</template>

<style scoped>
.stage-shell {
  margin-top: clamp(48px, 6vw, 80px);
}

.screen {
  position: relative;
  aspect-ratio: 16 / 9;
  background: #0b0908;
}

iframe,
.poster {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.2s var(--ease);
}

.poster:hover img {
  transform: scale(1.03);
}

.play {
  position: absolute;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
  width: 84px;
  height: 84px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--accent);
  color: #1a0d07;
  box-shadow: 0 20px 50px -10px rgba(10, 5, 2, 0.7);
  transition: transform 0.5s var(--ease);
}

.poster:hover .play {
  transform: scale(1.08);
}

.caption {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  padding: 22px 26px 24px;
}

h3 {
  font-size: clamp(1.5rem, 2.8vw, 2.3rem);
  letter-spacing: -0.035em;
  line-height: 1.1;
}

.by {
  margin-top: 6px;
  color: var(--muted);
}

.style {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--accent);
  white-space: nowrap;
}

.bar {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.tabs {
  display: inline-flex;
  padding: 5px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(236, 228, 216, 0.03);
}

.tabs button {
  padding: 9px 18px;
  border-radius: 999px;
  color: var(--muted);
  font-size: 0.94rem;
  white-space: nowrap;
  transition: background-color 0.45s var(--ease), color 0.45s var(--ease);
}

.tabs button span {
  font-size: 11px;
  margin-left: 4px;
  opacity: 0.7;
}

.tabs button.on {
  background: var(--text);
  color: var(--bg);
}

.rail {
  list-style: none;
  margin: 28px 0 0;
  padding: 0 0 12px;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(260px, calc((100% - 48px) / 4));
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  scrollbar-color: var(--line-strong) transparent;
}

.rail li {
  scroll-snap-align: start;
}

.card {
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: left;
  padding: 6px 6px 16px;
  border-radius: var(--r-shell);
  border: 1px solid var(--line);
  background: rgba(236, 228, 216, 0.02);
  transition: border-color 0.45s var(--ease), transform 0.45s var(--ease);
}

.card:hover {
  border-color: var(--line-strong);
}

.card:active {
  transform: scale(0.98);
}

.card.current {
  border-color: var(--accent);
}

.thumb {
  display: block;
  aspect-ratio: 16 / 9;
  border-radius: var(--r-core);
  overflow: hidden;
  background: var(--bg-3);
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.9s var(--ease);
}

.card:hover .thumb img {
  transform: scale(1.05);
}

.card-title {
  margin: 14px 10px 0;
  font-weight: 500;
  line-height: 1.3;
}

.card-by {
  margin: 4px 10px 0;
  font-size: 0.86rem;
  color: var(--muted);
}

.rail-enter-active {
  transition: opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out);
}

.rail-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.rail-leave-active {
  display: none;
}

@media (max-width: 767px) {
  .caption {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 18px 18px 20px;
  }

  .play {
    width: 64px;
    height: 64px;
  }

  .rail {
    grid-auto-columns: 78%;
  }

  .tabs button {
    padding: 8px 12px;
    font-size: 0.86rem;
  }
}
</style>
