import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { navigate } from '../hooks/useHashRoute'
import { ExternalIcon, GitHubIcon } from '../components/Icons'
import GitHubStats from '../components/GitHubStats'

export default function ProjectDetail({ project, index, projects }) {
  const { lang } = useLang()
  const t = ui[lang].proj
  const detail = project.detail

  const newer = index > 0 ? projects[index - 1] : null
  const older = index < projects.length - 1 ? projects[index + 1] : null

  return (
    <article className="mx-auto max-w-4xl px-6 pb-24 pt-32">
      <button
        type="button"
        onClick={() => navigate('/projects')}
        data-cursor-label="BACK"
        className="font-mono text-sm text-neon-cyan transition-colors hover:text-white"
      >
        ← {t.back}
      </button>

      <div
        className="relative mt-10 h-52 overflow-hidden rounded-2xl md:h-64"
        style={{
          background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
        }}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 h-full w-full object-cover"
            decoding="async"
          />
        ) : (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-9xl font-bold text-white/15 md:text-[12rem]">
            {project.letter}
          </span>
        )}
        <div className="absolute inset-0 bg-night/40" />
      </div>

      <h1 className="mt-10 text-3xl font-bold text-white md:text-5xl">{project.title}</h1>
      <p className="mt-4 leading-relaxed text-slate-400">{project.desc}</p>
      {(() => {
        const m = project.github.match(/github\.com\/([^/]+)\/([^/#?]+)/)
        return m ? (
          <div className="mt-4">
            <GitHubStats repo={`${m[1]}/${m[2]}`} />
          </div>
        ) : null
      })()}

      <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
        <div>
          <p className="font-mono text-xs tracking-widest text-slate-500">{t.role}</p>
          <p className="mt-1 font-medium text-slate-200">{detail.role}</p>
        </div>
        <div>
          <p className="font-mono text-xs tracking-widest text-slate-500">{t.year}</p>
          <p className="mt-1 font-medium text-slate-200">{detail.year}</p>
        </div>
        <div>
          <p className="font-mono text-xs tracking-widest text-slate-500">{t.stack}</p>
          <div className="mt-2 flex flex-wrap gap-2">
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

      <div className="mt-12 space-y-6 leading-8 text-slate-400">
        {detail.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <h2 className="mt-14 text-xl font-bold text-white">{t.highlights}</h2>
      <ul className="mt-5 space-y-3">
        {detail.highlights.map((highlight) => (
          <li key={highlight} className="flex items-start gap-3 leading-7 text-slate-400">
            <span className="mt-0.5 text-neon-cyan">✦</span>
            {highlight}
          </li>
        ))}
      </ul>

      <div className="mt-12 flex flex-wrap gap-4">
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            data-cursor-label="OPEN"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink px-6 py-3 font-semibold text-night transition-all hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(129,140,248,0.45)]"
          >
            {t.demo}
            <ExternalIcon className="h-4 w-4" />
          </a>
        )}
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          data-cursor-label="CODE"
          className="glass inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-slate-200 transition-all hover:border-neon-cyan/40 hover:text-white"
        >
          <GitHubIcon className="h-5 w-5" />
          {t.code}
        </a>
      </div>

      <nav className="mt-16 flex items-center justify-between gap-4 border-t border-white/10 pt-8 font-mono text-sm">
        {newer ? (
          <a href={`#/projects/${newer.id}`} className="text-slate-400 transition-colors hover:text-neon-cyan">
            {t.newer}
          </a>
        ) : (
          <span />
        )}
        {older ? (
          <a href={`#/projects/${older.id}`} className="text-slate-400 transition-colors hover:text-neon-cyan">
            {t.older}
          </a>
        ) : (
          <span />
        )}
      </nav>
    </article>
  )
}
