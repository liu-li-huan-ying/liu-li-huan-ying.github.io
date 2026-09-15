/* 全站固定层
   SVG defs（印面雕琢滤镜、洇墨遮罩与渐变）、纸面纹理、乌丝栏界格、跳转主内容链接。
   这些要跟着每一页活着（换地色的遮罩、印的滤镜都靠它），所以挂在外壳里，
   而不是挂在首页 —— 换页时不能跟着卸载。
   书耳、目次、卷轴各有自己的文件。 */
import { INK_DISP, INK_CORE } from '../../lib/theme.js'

export default function Chrome() {
  return (
    <>

      {/* 印面质感：feTurbulence 做位移，让边框与笔画像刻刀走出来的；
           再用一层细噪声把零星笔画挖掉，得到印泥不匀的「残破」。
           只定义不渲染，供各枚印引用 */}
      <svg className="defs-only" aria-hidden="true" focusable="false">
        <defs>
          <filter id="seal-carve" x="-14%" y="-14%" width="128%" height="128%"
                  colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.042 0.055" numOctaves="4"
                          seed="17" result="edge"/>
            <feDisplacementMap in="SourceGraphic" in2="edge" scale="7"
                               xChannelSelector="R" yChannelSelector="G" result="carved"/>
            <feTurbulence type="fractalNoise" baseFrequency="0.56" numOctaves="2"
                          seed="5" result="grain"/>
            <feColorMatrix in="grain" type="matrix"
                           values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  .95 0 0 0 -.66"
                           result="grainA"/>
            <feComposite in="carved" in2="grainA" operator="out"/>
          </filter>
          {/* 小印（导航、页脚那几枚 30px 上下的）用同一套参数会糊成一团：
               位移减半、噪声加密、去掉挖空，只留刀口的手感 */}
          <filter id="seal-carve-sm" x="-10%" y="-10%" width="120%" height="120%"
                  colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.09 0.11" numOctaves="3"
                          seed="17" result="edge"/>
            <feDisplacementMap in="SourceGraphic" in2="edge" scale="2.4"
                               xChannelSelector="R" yChannelSelector="G"/>
          </filter>

          {/* 解剖图的箭头。markerUnits 用 userSpace，尺寸才不会跟着线宽缩放 */}
          <marker id="a-arw" viewBox="0 0 10 10" refX="8.4" refY="5"
                  markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse"
                  orient="auto-start-reverse">
            <path d="M1.6,1.6 L8.4,5 L1.6,8.4" fill="none" stroke="var(--accent-2)"
                  strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </marker>
          <marker id="a-arw-hot" viewBox="0 0 10 10" refX="8.4" refY="5"
                  markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse"
                  orient="auto-start-reverse">
            <path d="M1.6,1.6 L8.4,5 L1.6,8.4" fill="none" stroke="var(--cinnabar)"
                  strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </marker>

          {/* 主题切换「墨水洇染宣纸」转场用的遮罩部件。
               一个被湍流位移滤镜揉乱边缘的径向渐变块，靠 JS 逐帧放大，
               从按钮位置把新地色「洇」出来。两张滤镜 / 两个渐变对应两个方向：
               变深（纸→墨）边缘狰狞、位移大；变浅（墨→纸）位移减半、渐变更柔。
               渐变中心即按钮位置（rect 由 JS 居中在此），核心实、边缘虚，
               最外圈留一档极淡的灰，做出湿痕羽化。
               ⚠️ 位移幅度不写死在这里 —— 它是 INK_DISP（lib/theme.js）：
                  JS 的几何计算要拿同一个数把「白核 + 位移」卡在最远角上，
                  运行时还会按 s 回写 scale（前缘碎度有下限）。改一处即可。 */}
          <filter id="inkDisp" x="-20%" y="-20%" width="140%" height="140%"
                  colorInterpolationFilters="sRGB">
            {/* 频率拔高、八度收到 3：不再是几团大波浪，而是细密的墨指，
                 并顺着宣纸的横纹走（x 频率低于 y），像墨被纸纤维牵着爬 */}
            <feTurbulence id="inkTurb" type="fractalNoise"
                          baseFrequency="0.02 0.055" numOctaves="3" seed="7" result="n"/>
            <feDisplacementMap id="inkDispMap" in="SourceGraphic" in2="n" scale={INK_DISP.ink}
                               xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          <filter id="inkDispSoft" x="-20%" y="-20%" width="140%" height="140%"
                  colorInterpolationFilters="sRGB">
            <feTurbulence id="inkTurbSoft" type="fractalNoise"
                          baseFrequency="0.02 0.055" numOctaves="3" seed="7" result="n"/>
            <feDisplacementMap id="inkDispMapSoft" in="SourceGraphic" in2="n" scale={INK_DISP.soft}
                               xChannelSelector="R" yChannelSelector="G"/>
          </filter>

          {/* 变深：核心实、72% 仍全白、86% 起羽化、100% 全黑。
               ⚠️ 第二个停点（白核边界）**必须等于 INK_CORE**：
                  theme.js 的 R 就是按这个比例反推的，白核半径 = INK_CORE × R。
                  这里若改成别的数（曾经浅色版写 60% 而 R 按 0.70 算），
                  s=1 时白核够不到最远角，转场收场瞬间那个角会「啪」地跳亮。
                  深浅两版共用同一个 INK_CORE，差别只在下面中段停点的位置。 */}
          <radialGradient id="inkGrad">
            <stop offset="0%"   stopColor="#fff"/>
            <stop offset={`${INK_CORE * 100}%`} stopColor="#fff"/>
            <stop offset="86%"  stopColor="#cfcfcf"/>
            <stop offset="100%" stopColor="#000"/>
          </radialGradient>
          {/* 变浅：同样的结构与同一个白核，但中段更靠后、颜色更浅 ——
               羽化区更长更缓，像被清水洗淡 */}
          <radialGradient id="inkGradSoft">
            <stop offset="0%"   stopColor="#fff"/>
            <stop offset={`${INK_CORE * 100}%`} stopColor="#fff"/>
            <stop offset="90%"  stopColor="#cccccc"/>
            <stop offset="100%" stopColor="#000"/>
          </radialGradient>

          {/* 遮罩：内容用 userSpaceOnUse（即被遮罩元素的 CSS 像素坐标系，
               这里就是视口），rect 的尺寸 / 位置由 JS 按点击点与视口算出；
               遮罩区域给得很大，免得位移滤镜揉出的毛边被裁掉。
               明度即可见度：白=显新地色，黑=显旧地色，灰=湿痕半透。 */}
          <mask id="ink-mask" maskUnits="userSpaceOnUse" x="0" y="0"
                width="100000" height="100000" maskContentUnits="userSpaceOnUse">
            <g id="inkBlot">
              <rect id="inkRect" x="-100" y="-100" width="10" height="10"
                    fill="url(#inkGrad)" filter="url(#inkDisp)"/>
            </g>
          </mask>
        </defs>
      </svg>

      <div className="surface" aria-hidden="true"></div>
      <div className="ulan" aria-hidden="true"></div>
      <a href="#main" className="skip">跳到主内容</a>

    </>
  )
}
