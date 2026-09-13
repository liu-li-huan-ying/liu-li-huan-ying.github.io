/* 作品卷的四张解剖图
   —— 不问「界面长什么样」，而问「它到底怎么跑的」。
   全部手绘 SVG：解剖图值钱的正是线要准、标注要能读，这是截图给不了的。
   用色照全站三色：界格灰画结构，青瓷画主路径，朱砂只点最关键那一处。
   每个项目一张，按 profile.projects[].specimen 取。
   加新项目：在这里补一段，并把 profile 里的 specimen 填成同一个键。 */
export const SPECIMENS = {
  yujian: (
    <>
      <div className="anim" style={{ '--d': "0" }}><div className="sp-bar"><i></i><i></i><i></i><span>yujian — 写回路径</span></div></div>
      <svg className="sp-anat" viewBox="0 0 400 300" role="img"
           aria-label="玉笺写回路径剖面：磁盘、解析、视图三层，未改动的字节经原样通道直接写回">
        <g className="anim" style={{ '--d': "80" }}>
          <rect className="a-box" x="26" y="34" width="330" height="44"/>
          <rect className="a-box-d" x="26" y="106" width="330" height="46"/>
          <rect className="a-box" x="26" y="180" width="330" height="42"/>
          <text className="a-cn" x="26" y="28">磁盘 · 普通 .md</text>
          <text className="a-cn" x="26" y="100">解析 · schema</text>
          <text className="a-cn" x="26" y="174">视图 · Milkdown</text>
        </g>
        {/* 字节行：青瓷那条是这次真正动过的 */}
        <g className="anim" style={{ '--d': "220" }}>
          <rect className="a-f" x="36" y="44" width="232" height="3.5"/>
          <rect className="a-f-hi" x="36" y="53" width="196" height="3.5"/>
          <rect className="a-f" x="36" y="62" width="248" height="3.5"/>
          <rect className="a-f" x="36" y="71" width="164" height="3.5"/>
        </g>
        {/* 语法树：只有改动过的片段才被实例化成节点 */}
        <g className="anim" style={{ '--d': "340" }}>
          <path className="a-line" d="M70,121 L52,136"/><path className="a-line" d="M70,121 L88,136"/>
          <circle className="a-f-hi" cx="70" cy="116" r="5"/>
          <circle className="a-f" cx="52" cy="140" r="5"/>
          <circle className="a-f" cx="88" cy="140" r="5"/>
          <text className="a-m" x="118" y="119">SCHEMA</text>
          <text className="a-cn" x="118" y="134">只有改动片段实例化</text>
        </g>
        <g className="anim" style={{ '--d': "460" }}>
          <rect className="a-f" x="36" y="190" width="240" height="4"/>
          <rect className="a-f" x="36" y="199" width="212" height="4"/>
          <rect className="a-f" x="36" y="208" width="168" height="4"/>
        </g>
        {/* 原样通道：贯穿三层，未改动的字节从这里原路穿回去 */}
        <g className="anim" style={{ '--d': "580" }}>
          <rect className="a-hot" x="286" y="34" width="30" height="188" strokeDasharray="4 3"/>
          <text className="a-cn-hot" x="301" y="28" textAnchor="middle">原样通道</text>
          <text className="a-m" x="301" y="240" textAnchor="middle">BYTE-IDENTICAL</text>
        </g>
        <g>
          <path className="a-hi dw" pathLength="100" style={{ '--d': "140" }} markerEnd="url(#a-arw)" d="M96,78 V102"/>
          <path className="a-hi dw" pathLength="100" style={{ '--d': "280" }} markerEnd="url(#a-arw)" d="M96,152 V176"/>
          <path className="a-hi dw" pathLength="100" style={{ '--d': "420" }} markerEnd="url(#a-arw)" d="M200,180 V156"/>
          <path className="a-hi dw" pathLength="100" style={{ '--d': "560" }} markerEnd="url(#a-arw)" d="M200,106 V82"/>
          <text className="a-m" x="104" y="86">parse</text>
          <text className="a-m" x="208" y="102">write</text>
          <text className="a-m" x="104" y="166">render</text>
          <text className="a-m" x="208" y="174">serialize</text>
        </g>
        <text className="a-cap anim" x="26" y="262" style={{ '--d': "700" }}>改动过的片段进出 schema，其余字节走原样通道 —— 保存时一个字节都不动</text>
      </svg>
    </>
  ),
  gojidb: (
    <>
      <div className="anim" style={{ '--d': "0" }}><div className="sp-bar"><i></i><i></i><i></i><span>gojidb — 存储剖面</span></div></div>
      <svg className="sp-anat" viewBox="0 0 400 300" role="img"
           aria-label="GojiDB 存储分层剖面：WAL、内存跳表与三层 SSTable，写路径自上面下，越下层越老越大">
        <g className="anim" style={{ '--d': "80" }}>
          <rect className="a-box" x="96" y="30" width="278" height="22"/>
          <rect className="a-box" x="96" y="62" width="278" height="32"/>
          <rect className="a-box" x="96" y="104" width="278" height="26"/>
          <rect className="a-box" x="96" y="140" width="278" height="30"/>
          <rect className="a-box" x="96" y="180" width="278" height="40"/>
        </g>
        <g className="anim" style={{ '--d': "160" }}>
          <text className="a-m" x="26" y="42">WAL</text>
          <text className="a-cn" x="26" y="54">顺序追加</text>
          <text className="a-m" x="26" y="79">MEMTABLE</text>
          <text className="a-cn" x="26" y="91">内存跳表</text>
          <text className="a-m" x="26" y="115">L0</text>
          <text className="a-m" x="26" y="156">L1</text>
          <text className="a-m" x="26" y="201">L2</text>
          <text className="a-cn" x="26" y="213">最老最大</text>
        </g>
        {/* WAL：一条只许往后加的日志 */}
        <g className="anim" style={{ '--d': "260" }}>
          <rect className="a-f" x="102" y="36" width="9" height="10"/><rect className="a-f" x="118" y="36" width="9" height="10"/>
          <rect className="a-f" x="134" y="36" width="9" height="10"/><rect className="a-f" x="150" y="36" width="9" height="10"/>
          <rect className="a-f" x="166" y="36" width="9" height="10"/><rect className="a-f" x="182" y="36" width="9" height="10"/>
          <rect className="a-f" x="198" y="36" width="9" height="10"/><rect className="a-f" x="214" y="36" width="9" height="10"/>
          <rect className="a-f-hi" x="230" y="36" width="9" height="10"/><rect className="a-f-hi" x="246" y="36" width="9" height="10"/>
          <text className="a-m" x="266" y="44">append-only</text>
        </g>
        {/* 跳表：三层索引，查询 O(log n) */}
        <g className="anim" style={{ '--d': "380" }}>
          <path className="a-line" d="M104,86 H344"/><path className="a-line" d="M152,78 H344"/><path className="a-line" d="M152,70 H344"/>
          <circle className="a-f-hi" cx="104" cy="86" r="3"/><circle className="a-f" cx="152" cy="86" r="3"/>
          <circle className="a-f" cx="200" cy="86" r="3"/><circle className="a-f" cx="248" cy="86" r="3"/>
          <circle className="a-f" cx="296" cy="86" r="3"/><circle className="a-f" cx="344" cy="86" r="3"/>
          <circle className="a-f" cx="152" cy="78" r="3"/><circle className="a-f" cx="248" cy="78" r="3"/>
          <circle className="a-f" cx="344" cy="78" r="3"/>
          <circle className="a-f" cx="152" cy="70" r="3"/><circle className="a-f" cx="344" cy="70" r="3"/>
        </g>
        {/* 下沉成 SSTable：块数越来越少，块越来越大 */}
        <g className="anim" style={{ '--d': "500" }}>
          <rect className="a-f-hi" x="100" y="110" width="34" height="14"/>
          <rect className="a-f-hi" x="140" y="110" width="34" height="14"/>
          <rect className="a-f-hi" x="180" y="110" width="34" height="14"/>
          <rect className="a-f-hi" x="100" y="146" width="80" height="18" opacity=".62"/>
          <rect className="a-f-hi" x="192" y="146" width="80" height="18" opacity=".62"/>
          <rect className="a-f-hi" x="100" y="186" width="210" height="28" opacity=".34"/>
        </g>
        {/* 布隆过滤器：先挡掉不存在的键，免得白翻一层 */}
        <g className="anim" style={{ '--d': "600" }}>
          <rect className="a-box" x="322" y="186" width="46" height="28"/>
          <g className="a-f-hot">
            <circle cx="332" cy="194" r="1.5"/><circle cx="339" cy="194" r="1.5"/><circle cx="346" cy="194" r="1.5"/>
            <circle cx="353" cy="194" r="1.5"/><circle cx="360" cy="194" r="1.5"/>
            <circle cx="332" cy="202" r="1.5"/><circle cx="339" cy="202" r="1.5"/><circle cx="346" cy="202" r="1.5"/>
            <circle cx="353" cy="202" r="1.5"/><circle cx="360" cy="202" r="1.5"/>
            <circle cx="332" cy="210" r="1.5"/><circle cx="339" cy="210" r="1.5"/><circle cx="346" cy="210" r="1.5"/>
            <circle cx="353" cy="210" r="1.5"/><circle cx="360" cy="210" r="1.5"/>
          </g>
          <text className="a-m" x="345" y="228" textAnchor="middle">BLOOM</text>
        </g>
        {/* 写路径：自上而下，一层一层沉下去 */}
        <g>
          <path className="a-hi dw" pathLength="100" style={{ '--d': "120" }} markerEnd="url(#a-arw)" d="M368,20 V28"/>
          <path className="a-hi dw" pathLength="100" style={{ '--d': "240" }} markerEnd="url(#a-arw)" d="M368,52 V60"/>
          <path className="a-hi dw" pathLength="100" style={{ '--d': "360" }} markerEnd="url(#a-arw)" d="M368,94 V102"/>
          <path className="a-hi dw" pathLength="100" style={{ '--d': "480" }} markerEnd="url(#a-arw)" d="M368,130 V138"/>
          <path className="a-hi dw" pathLength="100" style={{ '--d': "600" }} markerEnd="url(#a-arw)" d="M368,170 V178"/>
        </g>
        <text className="a-cap anim" x="26" y="250" style={{ '--d': "720" }}>写：先落 WAL，再进内存表；满了下沉成 SSTable，越往下越老、越大</text>
        <text className="a-cap anim" x="26" y="264" style={{ '--d': "760" }}>读：布隆过滤器先挡掉不存在的键，少翻好几层</text>
      </svg>
    </>
  ),
  lucent: (
    <>
      <div className="anim" style={{ '--d': "0" }}><div className="sp-bar"><i></i><i></i><i></i><span>lucent — 合成链</span></div></div>
      <svg className="sp-anat" viewBox="0 0 400 300" role="img"
           aria-label="Lucent 环境音合成链：噪声源经带通滤波与包络调制送到输出，包体内没有音频文件">
        <g className="anim" style={{ '--d': "80" }}>
          <rect className="a-box" x="26" y="58" width="80" height="60"/>
          <rect className="a-box" x="122" y="58" width="80" height="60"/>
          <rect className="a-box" x="218" y="58" width="80" height="60"/>
          <rect className="a-box" x="314" y="58" width="60" height="60"/>
          <text className="a-cn" x="66" y="50" textAnchor="middle">噪声源</text>
          <text className="a-cn" x="162" y="50" textAnchor="middle">带通</text>
          <text className="a-cn" x="258" y="50" textAnchor="middle">包络</text>
          <text className="a-cn" x="344" y="50" textAnchor="middle">输出</text>
          <text className="a-m" x="66" y="132" textAnchor="middle">NOISE</text>
          <text className="a-m" x="162" y="132" textAnchor="middle">BIQUAD</text>
          <text className="a-m" x="258" y="132" textAnchor="middle">GAIN</text>
          <text className="a-m" x="344" y="132" textAnchor="middle">OUT</text>
        </g>
        {/* 白噪声 */}
        <path className="a-hi dw" pathLength="100" style={{ '--d': "200" }}
              d="M32,92 L38,80 L44,98 L50,78 L56,96 L62,82 L68,94 L74,76 L80,94 L86,80 L94,92"/>
        {/* 频响：只放一条窄带过去 */}
        <path className="a-hi dw" pathLength="100" style={{ '--d': "320" }}
              d="M128,104 C152,104 154,74 162,74 C170,74 172,104 196,104"/>
        {/* 包络 + 低频振荡 */}
        <path className="a-hi dw" pathLength="100" style={{ '--d': "440" }} d="M224,104 L240,76 L292,100"/>
        <path className="a-hot dw" pathLength="100" style={{ '--d': "520" }} strokeDasharray="3 3"
              d="M224,88 q9,-8 18,0 t18,0 t18,0"/>
        {/* 扬声器 */}
        <g className="anim" style={{ '--d': "600" }}>
          <path className="a-hi" d="M322,84 h7 l11,-9 v26 l-11,-9 h-7 z"/>
          <path className="a-hi" d="M344,88 a9,9 0 0 1 0,20"/>
          <path className="a-hi" d="M350,82 a15,15 0 0 1 0,32"/>
        </g>
        <g>
          <path className="a-hi dw" pathLength="100" style={{ '--d': "260" }} markerEnd="url(#a-arw)" d="M106,88 H118"/>
          <path className="a-hi dw" pathLength="100" style={{ '--d': "380" }} markerEnd="url(#a-arw)" d="M202,88 H214"/>
          <path className="a-hi dw" pathLength="100" style={{ '--d': "500" }} markerEnd="url(#a-arw)" d="M298,88 H310"/>
        </g>
        {/* 上面是链路，下面是它听起来的样貌，中间分一道界 */}
        <g className="anim" style={{ '--d': "620" }}>
          <path className="a-line" d="M26,152 H374" strokeDasharray="2 4"/>
          <text className="a-m" x="26" y="164">OUTPUT SIGNAL</text>
        </g>
        {/* 合成出来的雨声：不是正弦，是滤波后的噪声，中间还夹着两记脉冲 */}
        <path className="a-hi dw" pathLength="100" style={{ '--d': "660" }}
              d="M26,200 C33,180 39,222 47,196 C55,172 61,218 69,202 C75,192 83,208 91,186
                 C99,166 105,216 113,200 C121,184 127,206 135,192 C143,178 149,220 157,202
                 L162,182 L166,210 C174,194 180,212 188,198 C196,184 202,214 210,198
                 C218,184 224,206 232,190 C240,174 246,214 254,198 C262,182 268,208 276,192
                 C284,176 290,210 298,196 L303,218 L308,184 C316,198 322,212 330,196
                 C338,180 344,208 352,194 C358,186 362,200 368,192 L374,196"/>
        <text className="a-m anim" x="26" y="240" style={{ '--d': "740" }}>NO AUDIO FILES IN THE PACKAGE</text>
        <text className="a-cap anim" x="26" y="258" style={{ '--d': "780" }}>雨声 = 白噪声 + 带通 + 随机脉冲，全部由 Web Audio 现场合成</text>
      </svg>
    </>
  ),
  beibei: (
    <>
      <div className="anim" style={{ '--d': "0" }}><div className="sp-bar"><i></i><i></i><i></i><span>beibei — 间隔重复</span></div></div>
      <svg className="sp-anat" viewBox="0 0 400 300" role="img"
           aria-label="间隔重复剖面：记忆强度按指数衰减，每次复习把它抬回去，复习间隔逐次拉长">
        <g>
          <path className="a-line dw" pathLength="100" style={{ '--d': "60" }} d="M40,230 H360"/>
          <path className="a-line dw" pathLength="100" style={{ '--d': "60" }} d="M40,44 V230"/>
          <text className="a-cn" x="44" y="40">记忆强度</text>
          <path className="a-line" d="M40,200 H360" strokeDasharray="3 3"/>
          <text className="a-m" x="356" y="196" textAnchor="end">忘却线</text>
        </g>
        {/* 四段衰减，越往后越平：复习过的内容忘得慢 */}
        <path className="a-hi dw" pathLength="100" style={{ '--d': "180" }} d="M40,58 C62,140 92,176 100,190"/>
        <path className="a-hi dw" pathLength="100" style={{ '--d': "340" }} d="M100,72 C130,132 160,174 180,188"/>
        <path className="a-hi dw" pathLength="100" style={{ '--d': "500" }} d="M180,78 C210,134 240,176 260,188"/>
        <path className="a-hi dw" pathLength="100" style={{ '--d': "660" }} d="M260,84 C290,138 320,178 340,190"/>
        {/* 复习：把强度抬回去，间隔就长一档 */}
        <g>
          <path className="a-hot dw" pathLength="100" style={{ '--d': "260" }} markerEnd="url(#a-arw-hot)" d="M100,190 V76"/>
          <path className="a-hot dw" pathLength="100" style={{ '--d': "420" }} markerEnd="url(#a-arw-hot)" d="M180,188 V82"/>
          <path className="a-hot dw" pathLength="100" style={{ '--d': "580" }} markerEnd="url(#a-arw-hot)" d="M260,188 V88"/>
          <circle className="a-f-hot" cx="100" cy="190" r="2.6"/><circle className="a-f-hi" cx="100" cy="72" r="2.6"/>
          <circle className="a-f-hot" cx="180" cy="188" r="2.6"/><circle className="a-f-hi" cx="180" cy="78" r="2.6"/>
          <circle className="a-f-hot" cx="260" cy="188" r="2.6"/><circle className="a-f-hi" cx="260" cy="84" r="2.6"/>
        </g>
        <g className="anim" style={{ '--d': "720" }}>
          <path className="a-line" d="M100,230 v4"/><path className="a-line" d="M180,230 v4"/>
          <path className="a-line" d="M260,230 v4"/><path className="a-line" d="M340,230 v4"/>
          <text className="a-m" x="70" y="246" textAnchor="middle">1 天</text>
          <text className="a-m" x="140" y="246" textAnchor="middle">3 天</text>
          <text className="a-m" x="220" y="246" textAnchor="middle">7 天</text>
          <text className="a-m" x="300" y="246" textAnchor="middle">16 天</text>
        </g>
        <text className="a-cap anim" x="26" y="272" style={{ '--d': "780" }}>每次复习把强度抬回去，下一次的间隔就长一档 —— 复习点由你的作答决定</text>
      </svg>
    </>
  ),
}
