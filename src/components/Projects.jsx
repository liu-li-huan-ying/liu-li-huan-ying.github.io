import { motion } from 'framer-motion'
import { navigate } from '../hooks/useHashRoute'
import { coverWipeNavigate } from '../utils/pageTransition'
import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { githubProfileUrl, profile } from '../data/profile'
import { ExternalIcon, GitHubIcon } from './Icons'
import SectionHeader from './SectionHeader'
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
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-night via-night/80 to-transparent md:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-night via-night/80 to-transparent md:w-24" />

        <div
          className="film-strip flex overflow-x-auto snap-x snap-mandatory py-6 pl-8 pr-8 md:pl-24 md:pr-24"
          style={{ scrollbarWidth: 'none' }}
          role="region"
          aria-label="Projects film strip"
        >
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="film-frame snap-center shrink-0 w-[340px] md:w-[520px]"
            >
              <div className="film-grain" />

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
                className="group cursor-pointer"
              >
                <div
                  data-cover
                  className="film-cover relative"
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
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-7xl font-bold text-white/15 md:text-9xl">
                      {project.letter}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/20 transition-opacity duration-500 group-hover:opacity-0" />
                </div>

                <div className="flex flex-col gap-3 px-5 py-4 md:px-6 md:py-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-neon-cyan md:text-xl">
                      {project.title}
                    </h3>
                    <div className="flex gap-2 text-slate-500">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${project.title} GitHub repository`}
                        onClick={(e) => e.stopPropagation()}
                        className="transition-colors hover:text-white"
                      >
                        <GitHubIcon className="h-4 w-4" />
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
                          <ExternalIcon className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-500">{project.desc}</p>

                  {(() => {
                    const m = project.github.match(/github\.com\/([^/]+)\/([^/#?]+)/)
                    return m ? <GitHubStats repo={`${m[1]}/${m[2]}`} /> : null
                  })()}

                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-neon-violet/15 bg-neon-violet/8 px-2 py-0.5 font-mono text-[10px] text-neon-violet/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: projects.length * 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="film-frame snap-center shrink-0 flex items-center justify-center w-[340px] md:w-[520px]"
          >
            <a
              href={githubProfileUrl}
              target="_blank"
              rel="noreferrer"
              data-cursor-label="GITHUB"
              className="group flex flex-col items-center gap-4 py-16 text-center transition-all duration-300"
            >
              <GitHubIcon className="h-10 w-10 text-slate-600 transition-colors group-hover:text-neon-cyan" />
              <div>
                <h3 className="text-lg font-semibold text-white">{p2.moreTitle}</h3>
                <p className="mt-1 font-mono text-sm text-slate-600">@liu-li-huan-ying</p>
              </div>
              <span className="font-mono text-xs text-neon-violet/60 transition-transform group-hover:translate-x-1">
                → {p2.moreSub}
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
