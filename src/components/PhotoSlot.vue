<script setup>
import { ref } from 'vue'
import { PhImage } from '@phosphor-icons/vue'

// Shows the photo when the file exists. Otherwise a stage-light placeholder, plus a
// "drop a file here" hint that only appears while developing locally.
const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  eager: { type: Boolean, default: false },
})
defineEmits(['loaded'])

const state = ref('loading') // loading | ok | missing
const dev = import.meta.env.DEV
const file = props.src.split('/').pop()
</script>

<template>
  <div class="slot" :class="state">
    <img
      v-show="state === 'ok'"
      :src="src"
      :alt="alt"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
      @load="state = 'ok'; $emit('loaded', true)"
      @error="state = 'missing'; $emit('loaded', false)"
    />
    <div v-if="state !== 'ok'" class="placeholder" aria-hidden="true">
      <span class="beam b1" />
      <span class="beam b2" />
      <span class="beam b3" />
      <span class="haze" />
      <p v-if="dev && state === 'missing'" class="hint mono">
        <PhImage :size="16" weight="light" />
        public/photos/{{ file }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.slot {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #120f0d;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.placeholder {
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 70% at 50% 115%, rgba(240, 100, 60, 0.2), transparent 60%), #120f0d;
}

.beam {
  position: absolute;
  top: -10%;
  width: 36%;
  height: 125%;
  background: linear-gradient(to bottom, rgba(255, 214, 180, 0.2), rgba(255, 214, 180, 0) 85%);
  clip-path: polygon(45% 0, 55% 0, 100% 100%, 0 100%);
  transform-origin: 50% 0;
  animation: sway 10s var(--ease) infinite alternate;
}

.b1 {
  left: 6%;
  transform: rotate(16deg);
}

.b2 {
  left: 32%;
  opacity: 0.75;
  animation-delay: -3.5s;
}

.b3 {
  left: 58%;
  transform: rotate(-16deg);
  animation-delay: -7s;
}

.haze {
  position: absolute;
  left: 8%;
  right: 8%;
  bottom: 12%;
  height: 22%;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(255, 214, 180, 0.14), transparent);
}

@keyframes sway {
  from {
    rotate: -3deg;
  }
  to {
    rotate: 3deg;
  }
}

.hint {
  position: absolute;
  left: 50%;
  bottom: 16px;
  translate: -50% 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  white-space: nowrap;
  color: var(--muted);
  background: rgba(16, 14, 13, 0.8);
  border: 1px dashed var(--line-strong);
  padding: 6px 10px;
  border-radius: 999px;
}
</style>
