import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { profile } from '../data/profile'

export default function Footer() {
  const { lang } = useLang()
  const t = ui[lang].footer
  const name = profile[lang].name

  return (
    <footer className="border-t border-white/5 py-8 text-center">
      <p className="font-mono text-xs text-slate-500">
        {t.pre} <span className="text-slate-300">{name}</span> {t.suf} · © {new Date().getFullYear()}
      </p>
      <p className="mt-2 font-mono text-xs text-slate-500">{t.stack}</p>
    </footer>
  )
}
