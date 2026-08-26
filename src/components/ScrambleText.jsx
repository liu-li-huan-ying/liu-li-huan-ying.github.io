import { useEffect, useRef, useState } from 'react'

const GLYPHS = '!<>-_\\/[]{}=+*^?#$%&@01'

function initialChaos(text) {
  return [...text]
    .map((ch, i) => (ch === ' ' ? ' ' : GLYPHS[(i * 7 + 3) % GLYPHS.length]))
    .join('')
}

export default function ScrambleText({ text, speed = 24 }) {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [output, setOutput] = useState(() => (reduced ? text : initialChaos(text)))
  const ref = useRef(null)
  const played = useRef(false)

  useEffect(() => {
    if (reduced) return undefined

    let interval

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || played.current) return
        played.current = true

        const queue = [...text].map((ch, i) => ({
          ch,
          end: Math.floor(8 + i * 2.1 + Math.random() * 8),
        }))
        let frame = 0

        interval = setInterval(() => {
          frame += 1
          let done = true
          const next = queue
            .map((q) => {
              if (frame >= q.end) return q.ch
              done = false
              return q.ch === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
            })
            .join('')
          setOutput(next)
          if (done) {
            clearInterval(interval)
            setOutput(text)
          }
        }, speed)
      },
      { threshold: 0, rootMargin: '0px 0px -60px 0px' }
    )

    observer.observe(ref.current)
    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [text, speed, reduced])

  return <span ref={ref}>{output}</span>
}
