import Intro from '../components/scroll/Intro'
import Material from '../components/scroll/Material'
import Works from '../components/scroll/Works'
import SelfNote from '../components/scroll/SelfNote'
import Writing from '../components/scroll/Writing'
import Closing from '../components/scroll/Closing'

/* 首页 —— 手卷五段：引首（题名）→ 画心（壹—伍）→ 拖尾（落款）
   全站固定层（印面滤镜、纸面、乌丝栏、卷轴）在外壳里，不在这里。 */
export default function Home() {
  return (
    <>
      <Intro />
      <Material />
      <Works />
      <SelfNote />
      <Writing />
      <Closing />
    </>
  )
}
