import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// 只要 latin 子集：整包会连 cyrillic / greek / vietnamese 一起给，
// 每字重六条 @font-face，其中几条还被内联成 base64 塞进渲染阻塞的 CSS 里
import '@fontsource/jetbrains-mono/latin-400.css'
import '@fontsource/jetbrains-mono/latin-500.css'
import '@fontsource/jetbrains-mono/latin-600.css'
import './index.css'
import App from './App.jsx'

/* 入场编排的开关：设计稿在 <head> 里同步加上这个类，
   开卷的界格描绘、页头落下、钤印都挂在 html.js 下。
   放在渲染之前加，与设计稿同一时序 —— 晚一步会看到元素先显形再被动画抓走。 */
document.documentElement.classList.add('js')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
