import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { profile } from '../data/profile'
import { MailIcon } from './Icons'
import FadeIn from './FadeIn'
import SocialLinks from './SocialLinks'

export default function Contact() {
  const { lang } = useLang()
  const t = ui[lang].contact
  const email = profile[lang].email

  return (
    <section id="contact" className="relative mx-auto max-w-2xl px-6 py-32 text-center">
      <FadeIn>
        <p className="font-mono text-sm tracking-[0.3em] text-neon-cyan">05. // {t.eyebrow}</p>

        <h2 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-5xl">
          {t.head} <span className="text-gradient">{t.accent}</span>.
        </h2>

        <p className="mx-auto mt-6 max-w-md leading-relaxed text-slate-400">{t.blurb}</p>

        <a
          href={`mailto:${email}`}
          data-cursor-label="MAIL"
          className="mt-10 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink px-8 py-4 font-semibold text-night transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(129,140,248,0.5)]"
        >
          <MailIcon className="h-5 w-5" />
          {t.cta}
        </a>

        <div className="mt-14 flex justify-center">
          <SocialLinks />
        </div>
      </FadeIn>
    </section>
  )
}
