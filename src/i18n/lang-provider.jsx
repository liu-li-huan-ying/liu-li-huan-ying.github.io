import { useEffect, useState } from 'react'
import { LangContext } from './context'

function detectLang() {
  try {
    const saved = localStorage.getItem('pf-lang')
    if (saved === 'zh' || saved === 'en') return saved
  } catch (err) {
    void err
  }
  return navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(detectLang)

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
    try {
      localStorage.setItem('pf-lang', lang)
    } catch (err) {
      void err
    }
  }, [lang])

  const toggle = () => setLang((v) => (v === 'zh' ? 'en' : 'zh'))

  return <LangContext.Provider value={{ lang, setLang, toggle }}>{children}</LangContext.Provider>
}
