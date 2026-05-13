import type { CSSProperties } from 'react'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import { useT } from '@/lib/i18n'
import MetalPanel from '../primitives/metal-panel'
import PanelHeader from './panel-header'
import ScanLine from './scan-line'

type AiPanelProps = {
  onOpenComm: () => void
}

const PANEL_STYLE: CSSProperties = {
  padding: '10px 14px',
  position: 'relative',
  overflow: 'hidden',
}

/** Middle-right panel: AI assistant teaser + Open button. */
export default function AiPanel({ onOpenComm }: AiPanelProps) {
  const t = useT()
  const title = t('cockpit.sections.comm.title')
  const sub = t('cockpit.sections.comm.sub')

  return (
    <MetalPanel style={PANEL_STYLE}>
      <PanelHeader
        title={t('cockpit.hud.aiPanel')}
        right={
          <span style={{ color: 'var(--color-cockpit-hud-green)' }}>
            {t('cockpit.hud.aiStatus')}
          </span>
        }
      />
      <div
        style={{
          marginTop: 6,
          fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
          fontSize: 19,
          fontWeight: 600,
          lineHeight: 1.1,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 11,
          color: 'var(--color-cockpit-text-dim)',
          marginTop: 3,
          fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
        }}
      >
        {sub}
      </div>

      <div
        style={{
          marginTop: 8,
          border: `1px solid ${COCKPIT_ACCENT}44`,
          background: 'rgba(8, 12, 16, 0.45)',
          padding: '8px 10px',
          fontSize: 11,
          lineHeight: 1.45,
          color: '#b8b2a8',
          fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
        }}
      >
        {t('cockpit.hud.aiPreview')}
      </div>

      <button
        type="button"
        onClick={onOpenComm}
        style={{
          position: 'absolute',
          bottom: 10,
          right: 14,
          padding: '6px 12px',
          background: COCKPIT_ACCENT,
          border: `1px solid ${COCKPIT_ACCENT}`,
          color: '#000',
          fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
          letterSpacing: 1.6,
          fontSize: 10,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: `0 0 12px ${COCKPIT_ACCENT}66`,
        }}
      >
        {t('cockpit.controls.openAiBtn')}
      </button>

      <ScanLine />
    </MetalPanel>
  )
}
