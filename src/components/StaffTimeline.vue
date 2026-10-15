<script setup>
import { timeline } from '../data'

// The story timeline: each milestone is a note on a treble staff. Line spacing is 16px, so one pitch step is 8px.
const STEP = 8
</script>

<template>
  <div class="scroller">
    <div class="score">
      <div class="staff" aria-hidden="true">
        <span class="clef">&#x1D11E;</span>
        <span class="bar end" />
      </div>

      <ol class="notes">
        <li v-for="(m, i) in timeline" :key="m.title" v-reveal="i * 110">
          <div class="note-slot" aria-hidden="true">
            <span class="note" :style="{ bottom: `${m.pitch * STEP}px` }">
              <i class="head" />
              <i class="stem" />
            </span>
          </div>
          <p class="when mono">{{ m.when }}</p>
          <h3>{{ m.title }}</h3>
          <p class="body">{{ m.body }}</p>
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.scroller {
  margin-top: clamp(64px, 8vw, 112px);
}

.score {
  position: relative;
  padding-left: 88px;
}

/* Five lines, 16px apart, sitting at the top of the score. */
.staff {
  position: absolute;
  left: 0;
  right: 0;
  top: 72px;
  height: 65px;
  background: repeating-linear-gradient(
    to bottom,
    var(--line-strong) 0 1px,
    transparent 1px 16px
  );
}

.clef {
  position: absolute;
  left: 6px;
  top: -30px;
  font-size: 104px;
  line-height: 1;
  color: var(--text);
  font-family: 'Segoe UI Symbol', 'Noto Music', 'Apple Symbols', serif;
}

.bar.end {
  position: absolute;
  right: 0;
  top: 0;
  height: 65px;
  width: 9px;
  border-left: 1px solid var(--line-strong);
  border-right: 4px solid var(--text);
  opacity: 0.8;
}

.notes {
  list-style: none;
  margin: 0;
  padding: 0 24px 0 0;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 28px;
}

.note-slot {
  position: relative;
  height: 137px;
}

/* Bottom line of the staff is at 137px from the top of the slot. */
.note {
  position: absolute;
  left: 4px;
  width: 22px;
  height: 0;
}

.head {
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 21px;
  height: 15px;
  border-radius: 50%;
  background: var(--accent);
  transform: rotate(-22deg);
}

.stem {
  position: absolute;
  left: 19px;
  bottom: -2px;
  width: 1.6px;
  height: 52px;
  background: var(--accent);
}

li:last-child .head {
  background: transparent;
  box-shadow: inset 0 0 0 2.5px var(--accent);
}

.when {
  margin-top: 36px;
  font-size: 12px;
  color: var(--accent);
  letter-spacing: 0.04em;
}

h3 {
  margin-top: 10px;
  font-size: 1.45rem;
  font-weight: 600;
  letter-spacing: -0.03em;
}

.body {
  margin-top: 10px;
  color: var(--muted);
  font-size: 0.96rem;
  line-height: 1.55;
}

@media (max-width: 1023px) {
  .scroller {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    margin-left: calc(-1 * clamp(16px, 4vw, 48px));
    margin-right: calc(-1 * clamp(16px, 4vw, 48px));
    padding: 0 clamp(16px, 4vw, 48px) 16px;
    scrollbar-width: thin;
  }

  .score {
    width: 1080px;
  }

  .notes li {
    scroll-snap-align: start;
    scroll-margin-left: 16px;
  }
}
</style>
