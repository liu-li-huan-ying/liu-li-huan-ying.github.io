/* 换篇转场里滚过的那根轴
   必须排在 body 末尾：View Transition 的各个 group 是按对应元素的 DOM 顺序
   叠放的，排在 <main> 之前会被页面快照整块压在底下 —— 等于画了看不见。
   平时不可见，只在转场那一瞬被脚本点亮。
   b = 轴上方那道「卷口」的投影，让纸看着是贴着轴卷起来的；i = 轴身 */
export default function RollRod() {
  return (
    <div id="rollRod" aria-hidden="true"><b></b><i></i></div>
  )
}
