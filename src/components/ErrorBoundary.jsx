import { Component } from 'react'

/* 兜底：渲染期真出了错，至少给一张能读的错页。
   版式沿用 404 的 .missing（同样是一张「此页不在」的错页），
   并且顺手把错误原文摊出来 —— 出了问题先看它，比看控制台快。 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error) {
    console.error(error)
  }

  render() {
    if (this.state.error) {
      return (
        <section className="page">
          <div className="wrap">
            <div className="missing">
              <div className="missing-code" aria-hidden="true">✕</div>
              <h1 className="missing-title">这一卷没打开</h1>
              <p className="small">渲染的时候出了点问题。错误原文在下面。</p>
              <pre className="err-box">{String(this.state.error)}</pre>
              <div className="missing-links">
                <button type="button" className="chip" onClick={() => window.location.reload()}>
                  重新加载
                </button>
                <a className="backlink" href="#/" style={{ marginBottom: 0 }}>回卷首</a>
              </div>
            </div>
          </div>
        </section>
      )
    }
    return this.props.children
  }
}
