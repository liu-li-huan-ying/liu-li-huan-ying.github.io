import { Component } from 'react'

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
      const lang = navigator.language.startsWith('zh') ? 'zh' : 'en'
      return (
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="glass max-w-xl rounded-2xl p-8 text-center">
            <p className="font-mono text-sm text-neon-pink">
              ⚠ {lang === 'zh' ? '渲染过程中出现了错误。' : 'Something broke while rendering.'}
            </p>
            <pre className="mt-4 max-h-48 overflow-auto rounded-lg bg-black/30 p-4 text-left font-mono text-xs text-slate-500">
              {String(this.state.error)}
            </pre>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg border border-neon-cyan/40 px-5 py-2 font-mono text-xs text-neon-cyan transition-colors hover:bg-neon-cyan/10"
            >
              {lang === 'zh' ? '重新加载' : 'Reload'}
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
