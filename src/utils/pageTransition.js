export function coverWipeNavigate(navigateFn, hash, coverElement) {
  let clone = null

  try {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (coverElement && !reduced) {
      const rect = coverElement.getBoundingClientRect()
      clone = coverElement.cloneNode(true)
      Object.assign(clone.style, {
        position: 'fixed',
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        margin: '0',
        zIndex: '200',
        borderRadius: '16px',
        pointerEvents: 'none',
        boxShadow: '0 24px 60px -16px rgba(129,140,248,0.5)',
      })
      document.body.appendChild(clone)

      requestAnimationFrame(() => {
        clone.style.transition = 'all 0.5s cubic-bezier(0.22, 0.61, 0.36, 1)'
        Object.assign(clone.style, {
          left: '50%',
          top: '0',
          width: '100vw',
          height: '100vh',
          transform: 'translateX(-50%)',
          borderRadius: '0',
        })
      })
    }
  } catch (err) {
    void err
  }

  navigateFn(hash)

  setTimeout(() => {
    try {
      if (clone) {
        clone.style.transition = 'opacity 0.3s ease'
        clone.style.opacity = '0'
      }
    } catch (err) {
      void err
    }
    setTimeout(() => clone?.remove(), 350)
  }, 480)
}
