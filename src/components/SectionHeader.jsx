import FadeIn from './FadeIn'

export default function SectionHeader({ eyebrow, title, more, moreLabel }) {
  return (
    <FadeIn className="mb-16">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="mono-label mb-3">{eyebrow}</p>
          <h2 className="editorial-heading text-3xl sm:text-4xl md:text-5xl">{title}</h2>
        </div>
        {more && moreLabel && (
          <a
            href={more}
            className="hidden text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)] sm:block"
          >
            {moreLabel} →
          </a>
        )}
      </div>
      <div className="divider mt-8" />
    </FadeIn>
  )
}
