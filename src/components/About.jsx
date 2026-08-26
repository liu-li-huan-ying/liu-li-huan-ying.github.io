import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { profile } from '../data/profile'
import { CodeIcon, RocketIcon, SparklesIcon, ZapIcon } from './Icons'
import FadeIn from './FadeIn'
import SectionHeader from './SectionHeader'
import Terminal from './Terminal'

const featureIcons = {
  code: CodeIcon,
  sparkles: SparklesIcon,
  zap: ZapIcon,
  rocket: RocketIcon,
}

export default function About() {
  const { lang } = useLang()
  const s = ui[lang].sec.about
  const data = profile[lang]

  return (
    <section id="about" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader index={s.index} eyebrow={s.eyebrow} title={s.title} />

        <div className="grid items-start gap-14 lg:grid-cols-2">
          <FadeIn>
            <Terminal key={lang} />
          </FadeIn>

          <div>
            {data.about.map((paragraph, i) => (
              <FadeIn key={i} delay={i * 0.12}>
                <p className="mb-5 leading-relaxed text-slate-400">{paragraph}</p>
              </FadeIn>
            ))}

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {data.features.map((feature, i) => {
                const Icon = featureIcons[feature.icon]
                return (
                  <FadeIn key={feature.title} delay={i * 0.08}>
                    <div className="glass group h-full rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-neon-violet/40 hover:shadow-[0_12px_40px_-12px_rgba(129,140,248,0.35)]">
                      <Icon className="h-7 w-7 text-neon-cyan transition-transform duration-300 group-hover:scale-110" />
                      <h3 className="mt-4 font-semibold text-white">{feature.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{feature.desc}</p>
                    </div>
                  </FadeIn>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <FadeIn className="mt-24 overflow-hidden border-y border-white/5 py-5">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[...data.skills, ...data.skills].map((skill, i) => (
            <span key={i} className="flex items-center gap-10 font-mono text-sm text-slate-500">
              {skill}
              <span className="text-neon-violet">✦</span>
            </span>
          ))}
        </div>
      </FadeIn>
    </section>
  )
}
