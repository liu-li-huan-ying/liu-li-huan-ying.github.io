import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { profile } from '../data/profile'
import FadeIn from './FadeIn'

export default function Contact() {
  const { lang } = useLang()
  const t = ui[lang].contact
  const email = profile[lang].email

  return (
    <section id="contact" className="px-6 py-28 sm:px-12 md:px-20">
      <div className="mx-auto max-w-2xl text-center">
        <FadeIn>
          <p className="mono-label mb-6">{t.eyebrow}</p>

          <h2 className="editorial-heading text-4xl sm:text-5xl md:text-6xl">
            {t.head} <span className="accent">{t.accent}</span>
          </h2>

          <p className="mx-auto mt-6 max-w-md text-[var(--color-text-secondary)]">
            {t.blurb}
          </p>

          <a
            href={`mailto:${email}`}
            className="mt-10 inline-flex items-center gap-2 border border-[var(--color-border)] px-6 py-3 text-sm text-[var(--color-text-primary)] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            {t.cta}
          </a>
        </FadeIn>
      </div>
    </section>
  )
}
