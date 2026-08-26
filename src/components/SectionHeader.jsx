import FadeIn from './FadeIn'
import ScrambleText from './ScrambleText'
import { ArrowRightIcon } from './Icons'

export default function SectionHeader({ index, eyebrow, title, more, moreLabel }) {
  const words = title.split(' ')
  const last = words.pop()
  return (
    <FadeIn className="relative mb-14">
      <p className="font-mono text-sm tracking-[0.3em] text-neon-cyan">
        {index}. // <ScrambleText text={eyebrow} />
      </p>
      <h2 className="mt-4 text-3xl font-bold text-white md:text-5xl">
        {words.length > 0 && (
          <span className="mr-2">
            <ScrambleText text={words.join(' ')} />
          </span>
        )}
        <span className="text-gradient">
          <ScrambleText text={last} />
        </span>
      </h2>
      {more && moreLabel && (
        <a
          href={more}
          data-cursor-label="MORE"
          className="group absolute bottom-1 right-0 hidden items-center gap-1.5 font-mono text-sm text-neon-cyan transition-colors hover:text-white md:inline-flex"
        >
          {moreLabel}
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      )}
    </FadeIn>
  )
}
