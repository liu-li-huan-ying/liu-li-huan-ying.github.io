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
    <div className={`flex items-center gap-5 ${className}`}>
      {socials.map((social) => {
        const Icon = iconFor[social.label] ?? GitHubIcon
        if (social.enc) {
          return (
            <button
              key={social.label}
              type="button"
              onClick={() => copyValue(social)}
              aria-label={`Copy ${social.label} ID`}
              className={`relative flex h-5 w-5 items-center justify-center transition-colors ${
                copiedLabel === social.label
                  ? 'text-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              }`}
            >
              <Icon className="absolute h-5 w-5" />
              {copiedLabel === social.label && (
                <span className="absolute text-[10px]">✓</span>
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
            className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-secondary)]"
          >
            <Icon className="h-5 w-5" />
          </a>
        )
      })}
    </div>
  )
}
