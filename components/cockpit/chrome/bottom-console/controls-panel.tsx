import { useHud } from '@/lib/hooks/cockpit-store'
import { useT } from '@/lib/i18n'
import Key from '../primitives/key'
import MetalPanel from '../primitives/metal-panel'
import PanelHeader from './panel-header'

/** Left-hand panel listing keyboard controls. */
export default function ControlsPanel() {
  const t = useT()
  const phase = useHud((s) => s.phase)
  const spaceLabel =
    phase === 'landed'
      ? t('cockpit.controls.takeoff')
      : t('cockpit.controls.land')

  return (
    <MetalPanel style={{ width: 200, padding: '10px 12px' }}>
      <PanelHeader title={t('cockpit.hud.controls')} />
      <div
        style={{
          marginTop: 8,
          fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
          fontSize: 11,
          lineHeight: 1.8,
          color: 'var(--color-cockpit-text)',
        }}
      >
        <div>
          <Key>W</Key>
          <Key>A</Key>
          <Key>S</Key>
          <Key>D</Key>{' '}
          <span style={{ color: 'var(--color-cockpit-text-dim)' }}>
            {t('cockpit.controls.move')}
          </span>
        </div>
        <div style={{ marginTop: 4 }}>
          <Key>SPACE</Key>{' '}
          <span style={{ color: 'var(--color-cockpit-text-dim)' }}>
            {spaceLabel}
          </span>
        </div>
        <div style={{ marginTop: 4 }}>
          <Key>SHIFT</Key>{' '}
          <span style={{ color: 'var(--color-cockpit-text-dim)' }}>
            {t('cockpit.controls.run')}
          </span>
        </div>
        <div style={{ marginTop: 4 }}>
          <Key>E</Key>{' '}
          <span style={{ color: 'var(--color-cockpit-text-dim)' }}>
            {t('cockpit.controls.dock')}
          </span>
        </div>
        <div style={{ marginTop: 4 }}>
          <Key>ESC</Key>{' '}
          <span style={{ color: 'var(--color-cockpit-text-dim)' }}>
            {t('cockpit.controls.undock')}
          </span>
        </div>
      </div>
    </MetalPanel>
  )
}
