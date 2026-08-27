import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { githubProfileUrl, profile } from '../data/profile'
import { ExternalIcon, FolderIcon, GitHubIcon } from '../components/Icons'
import FadeIn from '../components/FadeIn'
import SectionHeader from '../components/SectionHeader'
import TiltCard from '../components/TiltCard'
import GitHubStats from '../components/GitHubStats'
import { coverWipeNavigate } from '../utils/pageTransition'
import { navigate } from '../hooks/useHashRoute'
import Magnetic from '../components/Magnetic'

export default function ProjectList() {
  const { lang } = useLang()
  const s = ui[lang].sec.projects
  const pl = ui[lang].plist
  const projects = profile[lang].projects

  const tagPool = useMemo(() => {
    const set = new Set()
    projects.forEach((p) => p.tags.forEach((t) => set.add(t)))
    return [...set]
  }, [projects])

  const [activeTag, setActiveTag] = useState(pl.all)
  const filtered =
    activeTag === pl.all ? projects : projects.filter((p) => p.tags.includes(activeTag))

  const chips = [pl.all, ...tagPool]

  const openProject = (event, id) => {
    const cover = event?.currentTarget?.querySelector('[data-cover]') ?? null
    coverWipeNavigate(navigate, `/projects/${id}`, cover)
  }

  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-32">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-0 z-0 select-none font-display text-[9rem] font-bold leading-none text-white/[0.03] md:text-[15rem]"
      >
        {s.index}
      </span>

      <div className="relative z-10">
        <SectionHeader index={s.index} eyebrow={pl.eyebrow} title={pl.title} />
      </div>

      <FadeIn className="relative z-10 mb-12 flex flex-wrap items-center gap-3">
        {chips.map((chip) => (
          <Magnetic key={chip} strength={0.25}>
            <button
              type="button"
              onClick={() => setActiveTag(chip)}
              data-cursor-label="FILTER"
              className={`rounded-full border px-4 py-1.5 font-mono text-xs transition-all ${
                activeTag === chip
                  ? 'border-neon-violet/60 bg-neon-violet/15 text-white shadow-[0_0_16px_rgba(129,140,248,0.35)]'
                  : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-neon-violet/40 hover:text-white'
              }`}
            >
              {chip}
            </button>
          </Magnetic>
        ))}
        <span className="ml-auto font-mono text-xs text-slate-500">
          {filtered.length} / {projects.length} {pl.items}
        </span>
      </FadeIn>

      <motion.div layout className="grid gap-6 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <TiltCard className="h-full rounded-2xl">
                <div
                  role="link"
                  tabIndex={0}
                  data-cursor-label="VIEW"
                  onClick={(e) => openProject(e, project.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openProject(e, project.id)
                    }
                  }}
                  className="group glass relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:border-neon-violet/40 hover:shadow-[0_24px_60px_-16px_rgba(129,140,248,0.35)]"
                >
                  <div
                    data-cover
                    className="relative h-52 overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
                    }}
                  >
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-8xl font-bold text-white/15 transition-transform duration-500 group-hover:scale-125">
                        {project.letter}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-night/40 transition-opacity duration-300 group-hover:opacity-20" />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    />
                    <span className="absolute left-4 top-4 rounded-md bg-night/50 px-2 py-0.5 font-mono text-[10px] tracking-widest text-white/70 backdrop-blur-sm">
                      {String(projects.indexOf(project) + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <div className="flex items-start justify-between">
                      <FolderIcon className="h-8 w-8 text-neon-violet" />
                      <div className="flex gap-3 text-slate-400">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${project.title} GitHub repository`}
                          onClick={(e) => e.stopPropagation()}
                          className="transition-colors hover:text-white"
                        >
                          <GitHubIcon className="h-5 w-5" />
                        </a>
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${project.title} live demo`}
                            onClick={(e) => e.stopPropagation()}
                            className="transition-colors hover:text-white"
                          >
                            <ExternalIcon className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-white transition-colors group-hover:text-neon-cyan">
                      {project.title}
                    </h3>
                    <p className="flex-1 text-sm leading-relaxed text-slate-400">{project.desc}</p>

                    {(() => {
                      const m = project.github.match(/github\.com\/([^/]+)\/([^/#?]+)/)
                      return m ? <GitHubStats repo={`${m[1]}/${m[2]}`} /> : null
                    })()}

                    <div className="flex flex-wrap gap-2 pt-1">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveTag(tag)
                          }}
                          data-cursor-label="FILTER"
                          className="cursor-pointer rounded-full border border-neon-violet/20 bg-neon-violet/10 px-2.5 py-1 font-mono text-xs text-neon-violet transition-colors hover:bg-neon-violet/25"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.div layout key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <TiltCard className="h-full rounded-2xl">
            <a
              href={githubProfileUrl}
              target="_blank"
              rel="noreferrer"
              data-cursor-label="GITHUB"
              className="group glass flex h-full min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border-dashed p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-neon-cyan/40 hover:shadow-[0_24px_60px_-16px_rgba(34,211,238,0.3)]"
            >
              <GitHubIcon className="h-10 w-10 text-slate-400 transition-colors group-hover:text-neon-cyan" />
              <p className="font-mono text-sm text-slate-400">{pl.cta}</p>
              <span className="font-mono text-xs text-neon-violet">@liu-li-huan-ying</span>
            </a>
          </TiltCard>
        </motion.div>
      </motion.div>
    </section>
  )
}
