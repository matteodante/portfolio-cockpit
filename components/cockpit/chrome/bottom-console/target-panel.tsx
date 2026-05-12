import type { CSSProperties } from 'react'
import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import type { CockpitSection } from '@/lib/data/cockpit-sections'
import { type TranslationKey, useT } from '@/lib/i18n'
import MetalPanel from '../primitives/metal-panel'
import PanelHeader from './panel-header'
import ScanLine from './scan-line'

type TargetPanelProps = {
  near: CockpitSection | null
  onDock: () => void
}

const PANEL_STYLE: CSSProperties = {
  padding: '10px 14px',
  position: 'relative',
  overflow: 'hidden',
}

/** Middle-left panel: info about the section being approached + Dock button. */
export default function TargetPanel({ near, onDock }: TargetPanelProps) {
  const t = useT()
  const nearTitle = near ? t(`${near.i18nKey}.title` as TranslationKey) : ''
  const nearSub = near ? t(`${near.i18nKey}.sub` as TranslationKey) : ''

  return (
    <MetalPanel style={PANEL_STYLE}>
      <PanelHeader
        title={t('cockpit.hud.targetInfo')}
        right={
          <span style={{ color: 'var(--color-cockpit-text-dim)' }}>
            {near ? t('cockpit.hud.locked') : t('cockpit.hud.none')}
          </span>
        }
      />
      {near ? (
        <Locked title={nearTitle} sub={nearSub} onDock={onDock} />
      ) : (
        <Empty />
      )}
      <ScanLine />
    </MetalPanel>
  )
}

function Locked({
  title,
  sub,
  onDock,
}: {
  title: string
  sub: string
  onDock: () => void
}) {
  const t = useT()
  return (
    <div style={{ marginTop: 6 }}>
      <div
        style={{
          fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: -0.5,
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
      <button
        type="button"
        onClick={onDock}
        style={{
          position: 'absolute',
          bottom: 10,
          right: 14,
          padding: '6px 16px',
          background: COCKPIT_ACCENT,
          border: `1px solid ${COCKPIT_ACCENT}`,
          color: '#000',
          fontFamily: 'var(--font-orbitron), Orbitron, sans-serif',
          letterSpacing: 2,
          fontSize: 11,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: `0 0 12px ${COCKPIT_ACCENT}66`,
        }}
      >
        {t('cockpit.controls.dockBtn')}
      </button>
    </div>
  )
}

function Empty() {
  const t = useT()
  return (
    <div
      style={{
        marginTop: 20,
        textAlign: 'center',
        color: 'var(--color-cockpit-text-dim)',
        fontSize: 12,
        fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
      }}
    >
      <div style={{ fontSize: 32, opacity: 0.3 }}>◉</div>
      <div style={{ marginTop: 4, letterSpacing: 2 }}>
        {t('cockpit.hud.emptyHint')}
      </div>
    </div>
  )
}
