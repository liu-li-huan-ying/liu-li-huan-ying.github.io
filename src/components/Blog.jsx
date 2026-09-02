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
    <section id="blog" className="px-6 py-28 sm:px-12 md:px-20">
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          eyebrow={s.eyebrow}
          title={s.title}
          more="#/blog"
          moreLabel={s.more}
        />

        <div>
          {posts.map((post, i) => (
            <FadeIn key={post.slug} delay={i * 0.06}>
              <a
                href={`#/blog/${post.slug}`}
                className="group flex flex-col gap-2 border-b border-[var(--color-border)] py-6 transition-colors hover:border-[var(--color-border-hover)] sm:flex-row sm:items-center sm:gap-8"
              >
                <time className="shrink-0 text-xs text-[var(--color-text-muted)] sm:w-24">
                  {post.date}
                </time>

                <div className="flex-1">
                  <h3 className="text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-accent)]">
                    {post.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">{post.summary}</p>
                </div>

                <div className="hidden shrink-0 items-center gap-3 text-xs text-[var(--color-text-muted)] sm:flex">
                  {post.readTime} {t.read}
                  <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
