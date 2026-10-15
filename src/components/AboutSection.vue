<script setup>
import { ref, onMounted } from 'vue'
import PhotoSlot from './PhotoSlot.vue'
import Fretboard from './Fretboard.vue'
import StaffTimeline from './StaffTimeline.vue'
import { photos, roles } from '../data'

// Until about.jpg exists, the playable fretboard stands in for the portrait.
const hasPhoto = ref(false)
onMounted(() => {
  const probe = new Image()
  probe.onload = () => (hasPhoto.value = true)
  probe.src = photos.about
})
</script>

<template>
  <section id="about" class="section">
    <div class="wrap">
      <div class="split">
        <div v-reveal class="visual" :class="{ portrait: hasPhoto }">
          <div v-if="hasPhoto" class="shell frame">
            <div class="core"><PhotoSlot :src="photos.about" alt="Portrait of Janino Abrenica with his guitar" /></div>
          </div>
          <Fretboard v-else />
        </div>

        <div class="copy">
          <h2 v-reveal class="h2">About the artist</h2>
          <p v-reveal="80" class="bio">
            I'm Janino, a guitarist who started playing in 2022. In college I joined the Cebu Technological University
            Moalboal Campus Musical Ensemble (CMME), where I sang tenor in the choir and took lead guitar in the bands.
          </p>
          <p v-reveal="140" class="bio">
            Most of my stage time has been acoustic gigs, playing behind many different vocalists. These days I play
            solo fingerstyle while working as a programmer.
          </p>

          <ul class="roles">
            <li v-for="(r, i) in roles" :key="r.title" v-reveal="200 + i * 60">
              <h3>{{ r.title }}</h3>
              <p>{{ r.body }}</p>
            </li>
          </ul>
        </div>
      </div>

      <StaffTimeline />
    </div>
  </section>
</template>

<style scoped>
.split {
  display: grid;
  grid-template-columns: minmax(0, 6fr) minmax(0, 5fr);
  gap: clamp(40px, 6vw, 96px);
  align-items: center;
}

.visual {
  height: min(70vh, 560px);
  min-height: 360px;
}

.visual.portrait {
  height: auto;
  min-height: 0;
  aspect-ratio: 4 / 5;
  max-height: 680px;
}

.frame {
  height: 100%;
}

.bio {
  margin-top: 24px;
  color: var(--muted);
  font-size: 1.08rem;
  max-width: 50ch;
}

.bio:first-of-type {
  margin-top: 32px;
}

.roles {
  list-style: none;
  margin: 40px 0 0;
  padding: 28px 0 0;
  border-top: 1px solid var(--line);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 32px;
}

.roles h3 {
  font-size: 1.1rem;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.roles h3::before {
  content: '';
  display: inline-block;
  width: 14px;
  height: 2px;
  margin-right: 10px;
  vertical-align: middle;
  background: var(--accent);
}

.roles p {
  margin-top: 6px;
  font-size: 0.92rem;
  color: var(--muted);
}

@media (max-width: 900px) {
  .split {
    grid-template-columns: 1fr;
  }

  .visual {
    order: 2;
    height: auto;
    min-height: 0;
    aspect-ratio: 4 / 3;
  }

  .visual.portrait {
    aspect-ratio: 4 / 5;
  }
}

@media (max-width: 480px) {
  .roles {
    grid-template-columns: 1fr;
  }
}
</style>
