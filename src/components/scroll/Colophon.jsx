import { profile } from '../../data/profile'

/* 地头（牌记）
   古籍卷尾的牌记：谁刻的、什么时候、刻在哪里。这里照这个意思收尾。
   干支年号由 [data-gz] 自动填（seals.js），无脚本时停在丙午。 */
export default function Colophon() {
  return (
    <>
      <footer>
        <div className="wrap foot">
          <div>
            <span className="seal-slot" style={{ '--w': "27px", verticalAlign: "-8px", marginRight: "11px", '--tilt': "-1.4deg" }} data-seal="璃|1|1|zhu" aria-hidden="true"></span>
            <span style={{ fontFamily: "var(--serif-cn)", letterSpacing: ".14em" }}>{profile.name} · {profile.latinName}</span>
          </div>
          <p className="small">纸与釉 · <span data-gz>丙午</span> · {profile.location}</p>
        </div>
      </footer>
    </>
  )
}
