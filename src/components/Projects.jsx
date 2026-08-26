import { navigate } from '../hooks/useHashRoute'
import { coverWipeNavigate } from '../utils/pageTransition'
import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { githubProfileUrl, profile } from '../data/profile'
import { ExternalIcon, FolderIcon, GitHubIcon } from './Icons'
import FadeIn from './FadeIn'
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
    <section id="projects" className="relative mx-auto max-w-6xl px-6 py-28">
      <SectionHeader
        index={s.index}
        eyebrow={s.eyebrow}
        title={s.title}
        more="#/projects"
        moreLabel={s.more}
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <FadeIn key={project.id} delay={(i % 3) * 0.1} className="h-full">
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
                  className="relative h-44 overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
                  }}
                >
                  <div className="absolute inset-0 bg-night/40 transition-opacity duration-300 group-hover:opacity-20" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-8xl font-bold text-white/15 transition-transform duration-500 group-hover:scale-125">
                    {project.letter}
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
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-neon-cyan">
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
          </FadeIn>
        ))}

        <FadeIn delay={0.18} className="h-full">
          <TiltCard className="h-full rounded-2xl">
            <a
              href={githubProfileUrl}
              target="_blank"
              rel="noreferrer"
              data-cursor-label="GITHUB"
              className="group glass flex h-full min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border-dashed p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-neon-cyan/40 hover:shadow-[0_24px_60px_-16px_rgba(34,211,238,0.3)]"
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
        </FadeIn>
      </div>
    </section>
  )
}
