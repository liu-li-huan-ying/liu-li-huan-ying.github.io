import { navigate } from '../hooks/useHashRoute'
import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { profile } from '../data/profile'
import FadeIn from './FadeIn'
import SectionHeader from './SectionHeader'

export default function Projects() {
  const { lang } = useLang()
  const s = ui[lang].sec.projects
  const projects = profile[lang].projects

  return (
    <section id="projects" className="px-6 py-28 sm:px-12 md:px-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow={s.eyebrow}
          title={s.title}
          more="#/projects"
          moreLabel={s.more}
        />

        <div className="space-y-0">
          {projects.map((project, i) => (
            <FadeIn key={project.id} delay={i * 0.08}>
              <button
                type="button"
                onClick={() => navigate(`/projects/${project.id}`)}
                className="group flex w-full items-start gap-6 border-t border-[var(--color-border)] py-8 text-left transition-colors hover:border-[var(--color-border-hover)] sm:gap-10"
              >
                {/* Number */}
                <span className="mono-label mt-1.5 shrink-0 text-[var(--color-text-muted)]">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-display text-2xl text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-accent)] sm:text-3xl">
                    {project.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-[var(--color-text-secondary)]">
                    {project.desc}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-[var(--color-text-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <span className="mt-2 text-lg text-[var(--color-text-muted)] transition-all group-hover:translate-x-1 group-hover:text-[var(--color-accent)]">
                  →
                </span>
              </button>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
