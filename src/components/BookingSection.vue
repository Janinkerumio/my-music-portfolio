<script setup>
import { reactive, ref, computed } from 'vue'
import {
  PhFacebookLogo,
  PhInstagramLogo,
  PhTiktokLogo,
  PhYoutubeLogo,
  PhArrowUpRight,
  PhMessengerLogo,
  PhCheck,
} from '@phosphor-icons/vue'
import { socials, booking } from '../data'

const icons = { facebook: PhFacebookLogo, instagram: PhInstagramLogo, tiktok: PhTiktokLogo, youtube: PhYoutubeLogo }
const year = new Date().getFullYear()

const form = reactive({ name: '', contact: '', type: booking.eventTypes[0], date: '', place: '', details: '' })
const errors = reactive({})
const sent = ref(false)
const copied = ref(false)

const message = computed(() => {
  const lines = [
    'Hi Janino, I would like to book you.',
    '',
    `Name: ${form.name.trim()}`,
    `Contact: ${form.contact.trim()}`,
    `Booking: ${form.type}`,
  ]
  if (form.date) lines.push(`Date: ${new Date(form.date + 'T00:00').toLocaleDateString('en-PH', { dateStyle: 'long' })}`)
  if (form.place.trim()) lines.push(`Location: ${form.place.trim()}`)
  if (form.details.trim()) lines.push('', form.details.trim())
  return lines.join('\n')
})

function validate() {
  errors.name = form.name.trim() ? '' : 'Please add your name.'
  errors.contact = form.contact.trim() ? '' : 'Add a number, email or Facebook name so I can reply.'
  return !errors.name && !errors.contact
}

async function copy() {
  try {
    await navigator.clipboard.writeText(message.value)
    copied.value = true
  } catch {
    copied.value = false
  }
}

async function submit() {
  if (!validate()) return
  await copy()
  sent.value = true
  window.open(booking.messengerUrl, '_blank', 'noopener')
}

function reset() {
  sent.value = false
  copied.value = false
}
</script>

<template>
  <section id="booking" class="section booking">
    <div class="wrap split">
      <div class="intro">
        <span v-reveal class="eyebrow">Booking</span>
        <h2 v-reveal="60" class="h2">Let's play your event.</h2>
        <p v-reveal="120" class="lede">
          Acoustic sets, lead guitar for your band, or something else. Tell me about it and we'll sort the rest on
          Messenger.
        </p>

        <ul class="socials">
          <li v-for="(s, i) in socials" :key="s.name" v-reveal="160 + i * 60">
            <a :href="s.url" target="_blank" rel="noopener" class="social">
              <component :is="icons[s.icon]" :size="22" weight="light" />
              <span class="s-name">{{ s.name }}</span>
              <span class="s-handle mono">{{ s.handle }}</span>
              <PhArrowUpRight :size="16" weight="light" class="s-go" />
            </a>
          </li>
        </ul>
      </div>

      <div v-reveal="100" class="shell">
        <div class="core form-core">
          <Transition name="swap" mode="out-in">
            <form v-if="!sent" key="form" novalidate @submit.prevent="submit">
              <div class="field">
                <label for="b-name">Your name</label>
                <input id="b-name" v-model="form.name" autocomplete="name" :aria-invalid="!!errors.name" />
                <p v-if="errors.name" class="err">{{ errors.name }}</p>
              </div>

              <div class="field">
                <label for="b-contact">How can I reach you?</label>
                <input
                  id="b-contact"
                  v-model="form.contact"
                  placeholder="Number, email or Facebook name"
                  :aria-invalid="!!errors.contact"
                />
                <p v-if="errors.contact" class="err">{{ errors.contact }}</p>
              </div>

              <fieldset class="field">
                <legend>What do you need?</legend>
                <div class="chips">
                  <label v-for="t in booking.eventTypes" :key="t" class="chip" :class="{ on: form.type === t }">
                    <input v-model="form.type" type="radio" name="type" :value="t" class="sr-only" />
                    {{ t }}
                  </label>
                </div>
              </fieldset>

              <div class="row2">
                <div class="field">
                  <label for="b-date">Date <span class="opt">(optional)</span></label>
                  <input id="b-date" v-model="form.date" type="date" />
                </div>
                <div class="field">
                  <label for="b-place">Location <span class="opt">(optional)</span></label>
                  <input id="b-place" v-model="form.place" placeholder="Venue or town" />
                </div>
              </div>

              <div class="field">
                <label for="b-details">Details <span class="opt">(optional)</span></label>
                <textarea
                  id="b-details"
                  v-model="form.details"
                  rows="4"
                  placeholder="Songs you have in mind, set length, vocalist, sound system..."
                />
              </div>

              <button type="submit" class="btn btn-primary submit">
                Send via Messenger
                <span class="island"><PhMessengerLogo :size="18" weight="regular" /></span>
              </button>
              <p class="note">Your request is copied, then Messenger opens so you can paste and send it.</p>
            </form>

            <div v-else key="done" class="done" role="status">
              <span class="tick"><PhCheck :size="22" weight="regular" /></span>
              <h3>{{ copied ? 'Request copied.' : 'Almost there.' }}</h3>
              <p>
                {{
                  copied
                    ? 'Messenger is open in a new tab. Paste the message into the chat and hit send.'
                    : 'Your browser blocked copying, so copy the message below and send it in Messenger.'
                }}
              </p>
              <pre class="preview mono">{{ message }}</pre>
              <div class="done-actions">
                <a :href="booking.messengerUrl" target="_blank" rel="noopener" class="btn btn-primary">
                  Open Messenger
                  <span class="island"><PhArrowUpRight :size="16" weight="regular" /></span>
                </a>
                <button class="link" @click="copy">{{ copied ? 'Copy again' : 'Try copying' }}</button>
                <button class="link" @click="reset">Edit request</button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <footer class="wrap foot">
      <span>&copy; {{ year }} Janino Abrenica</span>
      <a href="#top">Back to top</a>
    </footer>
  </section>
</template>

<style scoped>
.booking {
  position: relative;
  padding-bottom: 40px;
  overflow: hidden;
}

.booking::before {
  content: '';
  position: absolute;
  right: -10%;
  top: 10%;
  width: 70vw;
  height: 70vh;
  background: radial-gradient(closest-side, rgba(240, 100, 60, 0.1), transparent);
  pointer-events: none;
}

.split {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  gap: clamp(40px, 6vw, 96px);
  align-items: start;
}

.socials {
  list-style: none;
  margin: 40px 0 0;
  padding: 0;
}

.social {
  display: grid;
  grid-template-columns: 22px auto 1fr 16px;
  align-items: center;
  gap: 14px;
  padding: 14px 4px;
  color: var(--muted);
  transition: color 0.4s var(--ease);
}

.socials li + li .social {
  border-top: 1px solid var(--line);
}

.social:hover {
  color: var(--text);
}

.s-name {
  font-weight: 500;
  color: var(--text);
}

.s-handle {
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.s-go {
  transition: transform 0.4s var(--ease);
}

.social:hover .s-go {
  transform: translate(2px, -2px);
  color: var(--accent);
}

.form-core {
  padding: clamp(22px, 3vw, 36px);
}

form {
  display: grid;
  gap: 20px;
}

.field {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
}

label,
legend {
  font-size: 0.92rem;
  font-weight: 500;
  padding: 0;
}

legend {
  margin-bottom: 8px;
}

.opt {
  color: var(--muted);
  font-weight: 400;
}

input:not([type='radio']),
textarea {
  width: 100%;
  font: inherit;
  font-size: 1rem;
  color: var(--text);
  background: var(--bg);
  border: 1px solid var(--line-strong);
  border-radius: 14px;
  padding: 13px 16px;
  transition: border-color 0.4s var(--ease), box-shadow 0.4s var(--ease);
  color-scheme: dark;
}

textarea {
  resize: vertical;
  min-height: 112px;
}

input::placeholder,
textarea::placeholder {
  color: #8a8177;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

[aria-invalid='true'] {
  border-color: #f2a48c !important;
}

.err {
  font-size: 0.86rem;
  color: #f2a48c;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  cursor: pointer;
  padding: 9px 16px;
  border-radius: 999px;
  border: 1px solid var(--line-strong);
  font-size: 0.9rem;
  font-weight: 400;
  color: var(--muted);
  transition: background-color 0.4s var(--ease), color 0.4s var(--ease), border-color 0.4s var(--ease);
}

.chip:hover {
  color: var(--text);
}

.chip.on {
  background: var(--text);
  color: var(--bg);
  border-color: transparent;
}

.chip:has(input:focus-visible) {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.row2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.submit {
  justify-self: start;
  margin-top: 4px;
}

.note {
  font-size: 0.85rem;
  color: var(--muted);
}

.done {
  display: grid;
  gap: 14px;
}

.tick {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--accent);
  color: #1a0d07;
}

.done h3 {
  font-size: 1.8rem;
  letter-spacing: -0.03em;
}

.done p {
  color: var(--muted);
}

.preview {
  margin: 4px 0 0;
  padding: 16px;
  border-radius: 14px;
  background: var(--bg);
  border: 1px solid var(--line);
  font-size: 12px;
  line-height: 1.7;
  white-space: pre-wrap;
  color: var(--text);
  user-select: all;
}

.done-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-top: 6px;
}

.link {
  color: var(--muted);
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-color: var(--line-strong);
  font-size: 0.92rem;
}

.link:hover {
  color: var(--text);
}

.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.4s var(--ease), transform 0.4s var(--ease);
}

.swap-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.swap-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.foot {
  position: relative;
  margin-top: clamp(96px, 10vw, 140px);
  padding-top: 24px;
  border-top: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 0.9rem;
  color: var(--faint);
}

.foot a:hover {
  color: var(--text);
}

@media (max-width: 900px) {
  .split {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .row2 {
    grid-template-columns: 1fr;
  }

  .submit {
    justify-self: stretch;
    justify-content: space-between;
  }
}
</style>
