import { useEffect, useCallback, useState, useRef } from 'react'
import { useCameraCaptureStore } from '@/stores/useCameraCaptureStore'
import { useThemeStore } from '@/stores/useThemeStore'
import { THEMES, type ThemeId } from '@/types/theme'

const LABEL_MAP: Record<string, string> = {}
THEMES.forEach((t) => { LABEL_MAP[t.id] = t.label })

const fmt = (v: number) => v.toFixed(1)
const fmtArr = (arr: [number, number, number]) => arr.map(fmt).join(', ')

function formatConfig(themeId: ThemeId, pos: [number, number, number], tgt: [number, number, number]): string {
  return [
    `// ${LABEL_MAP[themeId] || themeId}`,
    `'${themeId}': {`,
    `  position: [${fmtArr(pos)}],`,
    `  target: [${fmtArr(tgt)}],`,
    `},`,
  ].join('\n')
}

function copyText(text: string): boolean {
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    ta.style.top = '-9999px'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

function CameraCapturePanelInner({ inline }: { inline?: boolean }) {
  const current = useCameraCaptureStore((s) => s.current)
  const capture = useCameraCaptureStore((s) => s.capture)
  const currentTheme = useThemeStore((s) => s.currentTheme)
  const [copied, setCopied] = useState(false)
  const [lastConfig, setLastConfig] = useState('')
  const [visible, setVisible] = useState(false)
  const textRef = useRef<HTMLTextAreaElement>(null)

  const doCopy = useCallback((text: string) => {
    console.log('[CameraCapture]', text)
    copyText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [])

  const handleCapture = useCallback(() => {
    const state = capture()
    const text = formatConfig(currentTheme, state.position, state.target)
    setLastConfig(text)
    doCopy(text)
  }, [currentTheme, capture, doCopy])

  useEffect(() => {
    if (lastConfig && textRef.current) {
      textRef.current.select()
    }
  }, [lastConfig])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault()
        handleCapture()
      }
      if (e.shiftKey && (e.key === 'X' || e.key === 'x')) {
        e.preventDefault()
        setVisible((v) => !v)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleCapture])

  if (inline) {
    if (!visible) return null
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginLeft: 12, pointerEvents: 'auto' }}>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>|</span>
        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10 }}>CAM</span>
        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10 }}>{LABEL_MAP[currentTheme]}</span>
        <span style={{ color: '#4fc3f7', fontSize: 10, whiteSpace: 'nowrap' }}>
          pos {fmtArr(current.position)}
        </span>
        <span style={{ color: '#aed581', fontSize: 10, whiteSpace: 'nowrap' }}>
          tgt {fmtArr(current.target)}
        </span>
        <button
          onClick={handleCapture}
          style={{
            background: copied ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.1)',
            border: `1px solid ${copied ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.2)'}`,
            borderRadius: 3,
            color: copied ? '#22c55e' : 'rgba(255,255,255,0.6)',
            fontSize: 9,
            padding: '0 5px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            lineHeight: '1.5',
          }}
        >
          {copied ? 'OK' : 'CAP'}
        </button>
        <button
          onClick={() => setVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.25)',
            fontSize: 11,
            padding: 0,
            cursor: 'pointer',
            lineHeight: '1',
          }}
          title="关闭 (Shift+X)"
        >
          &times;
        </button>
      </span>
    )
  }

  if (!visible) {
    return (
      <div
        onClick={() => setVisible(true)}
        style={{
          position: 'fixed',
          bottom: 72,
          right: 12,
          zIndex: 9999,
          padding: '3px 8px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: 10,
          fontFamily: 'monospace',
          fontSize: 10,
          color: 'rgba(255,255,255,0.3)',
          cursor: 'pointer',
          pointerEvents: 'auto',
          userSelect: 'none',
        }}
        title="Shift+X 显示"
      >
        CAM
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 72,
      right: 12,
      zIndex: 9999,
      padding: '6px 10px',
      background: 'rgba(0,0,0,0.65)',
      borderRadius: 6,
      fontFamily: 'monospace',
      fontSize: 11,
      color: '#fff',
      backdropFilter: 'blur(4px)',
      userSelect: 'none',
      minWidth: 220,
      lineHeight: 1.7,
      pointerEvents: 'auto',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10 }}>
          CAM &middot; {LABEL_MAP[currentTheme] || currentTheme}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={handleCapture}
            style={{
              background: copied ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.1)',
              border: `1px solid ${copied ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.2)'}`,
              borderRadius: 4,
              color: copied ? '#22c55e' : 'rgba(255,255,255,0.8)',
              fontSize: 10,
              padding: '1px 7px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              transition: 'all 0.2s',
            }}
          >
            {copied ? 'OK' : 'CAP'}
          </button>
          <button
            onClick={() => setVisible(false)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 4,
              color: 'rgba(255,255,255,0.4)',
              fontSize: 10,
              padding: '1px 6px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              lineHeight: '1.2',
            }}
            title="关闭 (Shift+X)"
          >
            &times;
          </button>
        </div>
      </div>
      <div style={{ color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap' }}>
        pos <span style={{ color: '#4fc3f7' }}>{fmtArr(current.position)}</span>
      </div>
      <div style={{ color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap' }}>
        tgt <span style={{ color: '#aed581' }}>{fmtArr(current.target)}</span>
      </div>
      {lastConfig && (
        <textarea
          ref={textRef}
          readOnly
          value={lastConfig}
          onClick={(e) => {
            (e.target as HTMLTextAreaElement).select()
            doCopy(lastConfig)
          }}
          style={{
            width: '100%',
            marginTop: 4,
            padding: '3px 5px',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 3,
            color: '#aed581',
            fontSize: 10,
            fontFamily: 'monospace',
            lineHeight: 1.5,
            resize: 'none',
            outline: 'none',
            cursor: 'pointer',
            boxSizing: 'border-box',
          }}
          rows={4}
        />
      )}
      <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9, marginTop: 2 }}>
        {lastConfig ? '点击文本框全选复制' : 'Shift+C 捕获 | Shift+X 切换'}
      </div>
    </div>
  )
}

export default function CameraCapturePanel({ inline }: { inline?: boolean }) {
  if (import.meta.env.DEV) {
    return <CameraCapturePanelInner inline={inline} />
  }
  return null
}
