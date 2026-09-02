import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { profile } from '../data/profile'
import { ArrowRightIcon } from './Icons'
import FadeIn from './FadeIn'
import SectionHeader from './SectionHeader'

export default function Blog() {
  const { lang } = useLang()
  const s = ui[lang].sec.blog
  const t = ui[lang].post
  const posts = profile[lang].posts

  return (
    <section id="blog" className="relative mx-auto max-w-4xl px-6 py-28">
      <SectionHeader
        index={s.index}
        eyebrow={s.eyebrow}
        title={s.title}
        more="#/blog"
        moreLabel={s.more}
      />

      <div>
        {posts.map((post, i) => (
          <FadeIn key={post.slug} delay={i * 0.07}>
            <a
              href={`#/blog/${post.slug}`}
              data-cursor-label="READ"
              className="group -mx-4 flex flex-col gap-2 rounded-xl px-4 py-6 transition-colors hover:bg-white/[0.03] sm:flex-row sm:items-center sm:gap-8"
            >
              <time className="shrink-0 font-mono text-xs text-slate-500 sm:w-24">{post.date}</time>

              <div className="flex-1">
                <h3 className="font-semibold text-slate-100 transition-colors group-hover:text-neon-cyan">
                  {post.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{post.summary}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-xs text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="hidden shrink-0 items-center gap-3 font-mono text-xs text-slate-500 sm:flex">
                {post.readTime} {t.read}
                <ArrowRightIcon className="h-4 w-4 transition-all group-hover:translate-x-1 group-hover:text-neon-cyan" />
              </div>
            </a>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
