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
    <section id="experience" className="relative mx-auto max-w-3xl px-6 py-28">
      <SectionHeader index={s.index} eyebrow={s.eyebrow} title={s.title} />

      <div className="relative space-y-12 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-gradient-to-b before:from-neon-cyan before:via-neon-violet before:to-transparent">
        {jobs.map((job, i) => (
          <FadeIn key={`${job.company}-${job.period}`} delay={i * 0.1}>
            <div className="relative pl-10">
              <span className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-neon-violet bg-night shadow-[0_0_16px_rgba(129,140,248,0.8)]" />
              <div className="glass rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-neon-violet/40 hover:shadow-[0_16px_48px_-16px_rgba(129,140,248,0.35)]">
                <span className="inline-block rounded-full border border-neon-cyan/20 bg-neon-cyan/10 px-3 py-1 font-mono text-xs text-neon-cyan">
                  {job.period}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {job.role} · <span className="text-gradient">{job.company}</span>
                </h3>
                <p className="mt-3 leading-relaxed text-slate-400">{job.desc}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
