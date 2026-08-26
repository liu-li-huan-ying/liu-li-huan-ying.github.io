import FadeIn from './FadeIn'
import ScrambleText from './ScrambleText'

export default function SectionHeader({ index, eyebrow, title }) {
  const words = title.split(' ')
  const last = words.pop()
  return (
    <FadeIn className="mb-14">
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
    </FadeIn>
  )
}
