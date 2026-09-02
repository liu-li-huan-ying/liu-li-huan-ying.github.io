import { motion } from 'framer-motion'
import { useLang } from '../i18n/use-lang'

const OPTIONS = [
  { value: 'zh', label: '中' },
  { value: 'en', label: 'EN' },
]

const THUMB_W = 34
const GAP = 4

export default function LangToggle() {
  const { lang, setLang } = useLang()
  const index = OPTIONS.findIndex((o) => o.value === lang)

  return (
    <div
      role="group"
      aria-label="Language"
      className="relative flex items-center rounded-full border border-[var(--color-border)] p-1"
    >
      <motion.span
        aria-hidden="true"
        className="absolute top-1 bottom-1 rounded-full bg-[var(--color-accent)]"
        style={{ width: THUMB_W, left: GAP }}
        animate={{ x: index * THUMB_W }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      />
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLang(option.value)}
          aria-pressed={lang === option.value}
          className={`relative z-10 text-xs transition-colors duration-200 ${
            lang === option.value
              ? 'font-medium text-[var(--color-surface)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
          }`}
          style={{ width: THUMB_W, lineHeight: '22px', minWidth: '40px' }}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
