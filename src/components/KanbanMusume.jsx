import { useEffect, useRef } from 'react'
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

export default function KanbanMusume() {
  const widgetRef = useRef(null)
  const hitboxRef = useRef(null)
  const { lang } = useLang()

  useEffect(() => {
    if (!window.matchMedia('(min-width: 1024px)').matches) return undefined

    let cancelled = false

    const init = async () => {
      try {
        const { createWidget } = await import('l2d-widget')
        if (cancelled) return undefined

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
            hitboxRef.current = hitbox
          } catch {
            // silent
          }
        }, 300)
      } catch {
        // silent
      }
      return undefined
    }

    const schedule =
      typeof window.requestIdleCallback === 'function'
        ? (cb) => window.requestIdleCallback(cb, { timeout: 2500 })
        : (cb) => setTimeout(cb, 1800)

    schedule(init)

    return () => {
      cancelled = true
      hitboxRef.current?.remove()
      hitboxRef.current = null
      const widget = widgetRef.current
      widgetRef.current = null
      if (widget) {
        widget.destroy()
      }
    }
  }, [lang])

  return null
}
