// v-reveal: fades an element up the first time it enters the viewport.
// Usage: v-reveal or v-reveal="120" (stagger delay in ms).
const observer =
  typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            entry.target.classList.add('is-in')
            observer.unobserve(entry.target)
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
      )
    : null

export const reveal = {
  mounted(el, binding) {
    el.classList.add('reveal')
    if (binding.value) el.style.setProperty('--delay', `${binding.value}ms`)
    if (observer) observer.observe(el)
    else el.classList.add('is-in')
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}
