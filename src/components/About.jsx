import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { profile } from '../data/profile'
import FadeIn from './FadeIn'
import SectionHeader from './SectionHeader'
import Terminal from './Terminal'

export default function About() {
  const { lang } = useLang()
  const s = ui[lang].sec.about
  const data = profile[lang]

  return (
    <section id="about" className="relative px-6 py-28 sm:px-12 md:px-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow={s.eyebrow}
          title={s.title}
          more="#/about"
          moreLabel={s.more}
        />

        <div className="grid gap-16 lg:grid-cols-5">
          {/* Terminal — takes 2 cols */}
          <div className="lg:col-span-2">
            <FadeIn>
              <Terminal key={lang} />
            </FadeIn>
          </div>

          {/* Text — takes 3 cols */}
          <div className="lg:col-span-3">
            {data.about.map((paragraph, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <p className="mb-6 text-lg leading-relaxed">{paragraph}</p>
              </FadeIn>
            ))}

            {/* Skills as a simple line */}
            <FadeIn delay={0.3}>
              <div className="divider my-10" />
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-secondary)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}
