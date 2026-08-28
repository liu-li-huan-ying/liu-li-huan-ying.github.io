import { motion } from 'framer-motion'
import { navigate } from '../hooks/useHashRoute'
import { coverWipeNavigate } from '../utils/pageTransition'
import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { githubProfileUrl, profile } from '../data/profile'
import { ExternalIcon, FolderIcon, GitHubIcon } from './Icons'
import SectionHeader from './SectionHeader'
import TiltCard from './TiltCard'
import GitHubStats from './GitHubStats'

export default function Projects() {
  const { lang } = useLang()
  const s = ui[lang].sec.projects
  const p2 = ui[lang].proj
  const projects = profile[lang].projects

  const openProject = (event, id) => {
    const cover = event?.currentTarget?.querySelector('[data-cover]') ?? null
    coverWipeNavigate(navigate, `/projects/${id}`, cover)
  }

  return (
    <section id="projects" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          index={s.index}
          eyebrow={s.eyebrow}
          title={s.title}
          more="#/projects"
          moreLabel={s.more}
        />
      </div>

      <div className="relative mt-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-night to-transparent md:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-night to-transparent md:w-32" />

        <div className="flex gap-8 overflow-x-auto px-8 pb-6 pt-2 snap-x snap-mandatory md:px-16 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="min-w-[340px] w-[340px] snap-center md:min-w-[520px] md:w-[520px]"
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
                    className="relative h-56 overflow-hidden md:h-72"
                    style={{
                      background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
                    }}
                  >
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-8xl font-bold text-white/15 transition-transform duration-500 group-hover:scale-125">
                        {project.letter}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-night/30 transition-opacity duration-300 group-hover:opacity-10" />
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

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-neon-violet/20 bg-neon-violet/10 px-2.5 py-1 font-mono text-xs text-neon-violet"
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

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: projects.length * 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="min-w-[340px] w-[340px] snap-center md:min-w-[520px] md:w-[520px]"
          >
            <TiltCard className="h-full rounded-2xl">
              <a
                href={githubProfileUrl}
                target="_blank"
                rel="noreferrer"
                data-cursor-label="GITHUB"
                className="group glass flex h-full min-h-[360px] flex-col items-center justify-center gap-4 rounded-2xl border-dashed p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-neon-cyan/40 hover:shadow-[0_24px_60px_-16px_rgba(34,211,238,0.3)]"
              >
                <GitHubIcon className="h-10 w-10 text-slate-400 transition-colors group-hover:text-neon-cyan" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{p2.moreTitle}</h3>
                  <p className="mt-1 font-mono text-sm text-slate-500">@liu-li-huan-ying</p>
                </div>
                <span className="font-mono text-xs text-neon-violet transition-transform group-hover:translate-x-1">
                  → {p2.moreSub}
                </span>
              </a>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
