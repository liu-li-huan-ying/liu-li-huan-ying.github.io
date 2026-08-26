import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'

export default function NotFound() {
  const { lang } = useLang()
  const t = ui[lang].notFound

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="text-gradient font-display text-8xl font-bold md:text-9xl">{t.code}</p>
      <h1 className="mt-6 text-2xl font-bold text-white md:text-3xl">{t.title}</h1>
      <p className="mt-4 max-w-md leading-relaxed text-slate-400">{t.desc}</p>
      <a
        href="#/"
        data-cursor-label="HOME"
        className="mt-10 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink px-6 py-3 font-semibold text-night transition-all hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(129,140,248,0.45)]"
      >
        {t.home}
      </a>
    </section>
  )
}
