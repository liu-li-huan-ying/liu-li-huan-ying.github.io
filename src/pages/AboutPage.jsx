import GitHubHeatmap from '../components/GitHubHeatmap'
import { MapPinIcon } from '../components/Icons'
import FadeIn from '../components/FadeIn'
import SectionHeader from '../components/SectionHeader'
import { navigate } from '../hooks/useHashRoute'
import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { githubProfileUrl, profile } from '../data/profile'

const CHIP_COLORS = [
  'border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan',
  'border-neon-violet/30 bg-neon-violet/10 text-neon-violet',
  'border-neon-pink/30 bg-neon-pink/10 text-neon-pink',
]

export default function AboutPage() {
  const { lang } = useLang()
  const a = ui[lang].apage
  const data = profile[lang]
  const username = githubProfileUrl.split('/').pop()

  return (
    <section className="relative mx-auto max-w-5xl px-6 pb-24 pt-32">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-0 z-0 select-none font-display text-[9rem] font-bold leading-none text-white/[0.03] md:text-[15rem]"
      >
        01
      </span>

      <div className="relative z-10">
        <SectionHeader index="01" eyebrow={a.eyebrow} title={a.title} />

        <FadeIn className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <MapPinIcon className="h-3.5 w-3.5 text-neon-violet" />
            {data.location}
          </span>
          <a
            href={githubProfileUrl}
            target="_blank"
            rel="noreferrer"
            data-cursor-label="GITHUB"
            className="text-neon-cyan transition-colors hover:text-white"
          >
            @{username}
          </a>
        </FadeIn>

        <div className="space-y-8">
          <FadeIn delay={0.05}>
            <GitHubHeatmap username={username} year={2026} labels={a} />
          </FadeIn>

          <div className="grid gap-8 md:grid-cols-2">
            <FadeIn delay={0.1}>
              <div className="glass h-full rounded-2xl p-6">
                <h3 className="font-semibold text-white">{a.langTitle}</h3>
                <ul className="mt-4 space-y-4">
                  {a.langs.map((item) => (
                    <li key={item.name} className="flex items-start justify-between gap-4">
                      <span className="font-medium text-slate-200">{item.name}</span>
                      <span className="text-right font-mono text-xs text-slate-500">{item.level}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.16}>
              <div className="glass h-full rounded-2xl p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold text-white">{a.nowTitle}</h3>
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                </div>
                <p className="mt-1 font-mono text-[11px] text-slate-500">{a.nowSubtitle}</p>
                <ul className="mt-4 space-y-4">
                  {a.nowItems.map((item) => (
                    <li key={item.name} className="flex items-start gap-3">
                      <span className="mt-1 text-neon-cyan">✦</span>
                      <div>
                        <p className="font-medium text-slate-200">{item.name}</p>
                        <p className="mt-0.5 text-sm text-slate-500">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.2}>
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-white">{a.focusTitle}</h3>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {a.focusChips.map((chip, i) => (
                  <span
                    key={chip}
                    className={`rounded-lg border px-3.5 py-1.5 font-mono text-xs ${CHIP_COLORS[i % CHIP_COLORS.length]}`}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.25}>
            <button
              type="button"
              onClick={() => navigate('/')}
              data-cursor-label="BACK"
              className="font-mono text-sm text-neon-cyan transition-colors hover:text-white"
            >
              ← {a.back}
            </button>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
