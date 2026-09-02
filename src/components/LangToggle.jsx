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
      className="glass relative flex items-center rounded-full p-1"
      style={{ gap: 0 }}
    >
      <motion.span
        aria-hidden="true"
        className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink shadow-[0_0_14px_rgba(129,140,248,0.55)]"
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
          data-cursor-label="LANG"
          className={`relative z-10 font-mono text-xs transition-colors duration-200 ${
            lang === option.value ? 'font-semibold text-night' : 'text-slate-400 hover:text-white'
          }`}
          style={{ width: THUMB_W, lineHeight: '22px', minWidth: '40px' }}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
