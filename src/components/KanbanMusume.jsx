import { useState, useEffect, useRef, useCallback } from 'react'
import { useLang } from '../i18n/use-lang'

const TIP_STYLE = {
  fontSize: '14px',
  lineHeight: '1.6',
  padding: '12px 16px',
  maxWidth: '260px',
  width: 'max-content',
  whiteSpace: 'normal',
  wordBreak: 'break-word',
}

const TIPS_BY_LANG = {
  en: {
    welcomeMessage: ['Welcome to my corner of the internet ✨', 'Finally you are here~'],
    messages: [
      'Try pressing Ctrl + K for the command palette!',
      'Type help in the terminal above for surprises',
      'Psst: ↑↑↓↓←→←→BA hides an easter egg',
      'Scroll down for my featured projects →',
      'Use the dice in my menu to change my outfit',
      'Another day, another line of code!',
    ],
    duration: 4200,
    interval: 9000,
    style: TIP_STYLE,
    typing: { param: 'PARAM_MOUTH_OPEN_Y', speed: 80 },
  },
  zh: {
    welcomeMessage: ['欢迎来到我的主页 ✨', '终于等到你啦～'],
    messages: [
      '试试按 Ctrl + K 唤起命令面板！',
      '在上面的终端里输入 help 有惊喜',
      '悄悄说：↑↑↓↓←→←→BA 有彩蛋',
      '下面有我的精选项目哦 →',
      '点菜单里的骰子图标可以换装',
      '今天也要元气满满地写代码呢！',
    ],
    duration: 4200,
    interval: 9000,
    style: TIP_STYLE,
    typing: { param: 'PARAM_MOUTH_OPEN_Y', speed: 80 },
  },
}

const TRIGGER_LABELS = { en: 'Meet HK416', zh: '和看板娘打个招呼' }

export default function KanbanMusume() {
  const [loaded, setLoaded] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const widgetRef = useRef(null)
  const { lang } = useLang()

  const activate = useCallback(async () => {
    setLoaded(true)
    try {
      const { createWidget } = await import('l2d-widget')
      if (!widgetRef.current) return

      const stageSize = Math.round(Math.min(460, Math.max(300, window.innerHeight * 0.46)))

      widgetRef.current = createWidget({
        position: 'bottom-right',
        size: stageSize,
        primaryColor: 'rgba(129, 140, 248, 0.92)',
        transitionType: 'slide',
        transitionDuration: 1200,
        model: [
          {
            path: 'https://model.hacxy.cn/HK416-1-normal/model.json',
            volume: 0,
            tips: TIPS_BY_LANG[lang],
          },
          {
            path: 'https://model.hacxy.cn/cat-black/model.json',
            volume: 0,
            tips: TIPS_BY_LANG[lang],
          },
        ],
        menus: {
          extraItems: [
            {
              icon: 'mdi:arrow-up',
              label: 'Back to top',
              onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
            },
          ],
        },
      })

      setTimeout(() => {
        try {
          const stage = [...document.body.children].find(
            (el) => el instanceof HTMLDivElement && el.querySelector(':scope > canvas')
          )
          if (!stage) return
          stage.style.pointerEvents = 'none'
          const canvas = stage.querySelector('canvas')
          if (canvas) canvas.style.pointerEvents = 'none'
          stage.querySelectorAll('button, a, input, [role="button"]').forEach((el) => {
            el.style.pointerEvents = 'auto'
          })
          const hitbox = document.createElement('div')
          hitbox.className = 'kanban-hitbox'
          hitbox.style.cssText = [
            `position:fixed`,
            `right:0`,
            `bottom:0`,
            `width:${Math.round(stage.offsetWidth * 0.92)}px`,
            `height:${Math.round(stage.offsetHeight * 0.62)}px`,
            `z-index:${Number.parseInt(stage.style.zIndex || '9999', 10) - 1}`,
            `pointer-events:auto`,
          ].join(';')
          hitbox.addEventListener('click', () => {
            if (!canvas) return
            const r = canvas.getBoundingClientRect()
            canvas.dispatchEvent(
              new MouseEvent('click', {
                bubbles: true,
                clientX: r.left + r.width / 2,
                clientY: r.top + r.height * 0.6,
              })
            )
          })
          document.body.appendChild(hitbox)
        } catch {
          // silent
        }
      }, 300)
    } catch {
      setLoaded(false)
    }
  }, [lang])

  useEffect(() => {
    return () => {
      const widget = widgetRef.current
      widgetRef.current = null
      if (widget) widget.destroy()
    }
  }, [])

  if (dismissed) return null

  if (!loaded) {
    return (
      <div className="fixed right-4 bottom-4 z-[9998]">
        <button
          type="button"
          onClick={activate}
          aria-label={TRIGGER_LABELS[lang]}
          className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-lg backdrop-blur-md transition hover:scale-110 hover:border-neon-cyan/50 hover:bg-neon-cyan/20"
        >
          <span className="text-xl leading-none select-none">🐱</span>
        </button>
        <span className="pointer-events-none absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-black/70 px-2.5 py-1 text-xs text-white/80 opacity-0 shadow backdrop-blur transition-opacity group-hover:opacity-100">
          {TRIGGER_LABELS[lang]}
        </span>
      </div>
    )
  }

  return (
    <div ref={widgetRef}>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Close widget"
        className="fixed right-4 bottom-4 z-[9999] flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/60 backdrop-blur transition hover:border-neon-cyan/50 hover:text-neon-cyan"
      >
        ✕
      </button>
    </div>
  )
}
