import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { profile } from '../data/profile'
import SocialLinks from './SocialLinks'

export default function Footer() {
  const { lang } = useLang()
  const t = ui[lang].footer
  const name = profile[lang].name

  return (
    <footer className="border-t border-[var(--color-border)] px-6 py-12 sm:px-12 md:px-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <p className="text-xs text-[var(--color-text-muted)]">
          {t.pre} <span className="text-[var(--color-text-secondary)]">{name}</span> {t.suf} · ©{' '}
          {new Date().getFullYear()}
        </p>
        <SocialLinks />
      </div>
    </footer>
  )
}
