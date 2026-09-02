import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { profile } from '../data/profile'
import FadeIn from './FadeIn'
import SectionHeader from './SectionHeader'

export default function Experience() {
  const { lang } = useLang()
  const s = ui[lang].sec.experience
  const jobs = profile[lang].experience

  return (
    <section id="experience" className="px-6 py-28 sm:px-12 md:px-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow={s.eyebrow} title={s.title} />

        <div className="space-y-8">
          {jobs.map((job, i) => (
            <FadeIn key={`${job.company}-${job.period}`} delay={i * 0.08}>
              <div className="flex flex-col gap-2 border-l border-[var(--color-border)] py-2 pl-6 transition-colors hover:border-[var(--color-accent)]">
                <span className="mono-label">{job.period}</span>
                <h3 className="text-lg text-[var(--color-text-primary)]">
                  {job.role} — <span className="accent">{job.company}</span>
                </h3>
                <p className="text-[var(--color-text-secondary)]">{job.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
