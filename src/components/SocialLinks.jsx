import { useState } from 'react'
import { useLang } from '../i18n/use-lang'
import { profile } from '../data/profile'
import { reveal } from '../utils/secret'
import { GitHubIcon, LinkedinIcon, MailIcon, QQIcon, WeChatIcon } from './Icons'

const iconFor = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedinIcon,
  Email: MailIcon,
  QQ: QQIcon,
  WeChat: WeChatIcon,
}

export default function SocialLinks({ className = '' }) {
  const { lang } = useLang()
  const [copiedLabel, setCopiedLabel] = useState(null)
  const socials = profile[lang].socials

  const copyValue = async (social) => {
    try {
      await navigator.clipboard.writeText(reveal(social.enc))
    } catch (err) {
      void err
      return
    }
    setCopiedLabel(social.label)
    setTimeout(() => setCopiedLabel(null), 1500)
  }

  return (
    <div className={`flex items-center gap-6 ${className}`}>
      {socials.map((social) => {
        const Icon = iconFor[social.label] ?? GitHubIcon
        if (social.enc) {
          return (
            <button
              key={social.label}
              type="button"
              onClick={() => copyValue(social)}
              aria-label={`Copy ${social.label} ID`}
              data-cursor-label="COPY"
              className={`relative flex h-6 w-6 items-center justify-center transition-all hover:-translate-y-1 ${
                copiedLabel === social.label ? 'text-emerald-300' : 'text-slate-400 hover:text-neon-cyan'
              }`}
            >
              <Icon className="absolute h-6 w-6" />
              {copiedLabel === social.label && (
                <span className="absolute font-mono text-[10px]">✓</span>
              )}
            </button>
          )
        }
        return (
          <a
            key={social.label}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            aria-label={social.label}
            data-cursor-label="OPEN"
            className="text-slate-400 transition-all hover:-translate-y-1 hover:text-neon-cyan"
          >
            <Icon className="h-6 w-6" />
          </a>
        )
      })}
    </div>
  )
}
