import PanelHeader from '@/components/cockpit/chrome/bottom-console/panel-header'
import MetalPanel from '@/components/cockpit/chrome/primitives/metal-panel'
import type { CockpitSection } from '@/lib/data/cockpit-sections'
import { type TranslationKey, useT } from '@/lib/i18n'

export default function TargetPanel({
  near,
  onDock,
}: {
  near: CockpitSection | null
  onDock: () => void
}) {
  const t = useT()
  return (
    <MetalPanel
      style={{
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <PanelHeader
        title={t('cockpit.hud.targetInfo')}
        right={
          <span>{near ? t('cockpit.hud.locked') : t('cockpit.hud.none')}</span>
        }
      />
      {near ? (
        <>
          <div style={{ fontSize: 22, fontWeight: 500 }}>
            {t(`${near.i18nKey}.title` as TranslationKey)}
          </div>
          <p
            style={{
              fontSize: 12,
              lineHeight: 1.5,
              color: 'var(--color-cockpit-text-dim)',
              margin: 0,
            }}
          >
            {t(`${near.i18nKey}.sub` as TranslationKey)}
          </p>
          <button
            type="button"
            className="brand-button"
            onClick={onDock}
            style={{
              marginTop: 'auto',
              alignSelf: 'flex-end',
              minHeight: 38,
              padding: '8px 14px',
              fontSize: 12,
            }}
          >
            {t('cockpit.controls.dockBtn')}
          </button>
        </>
      ) : (
        <div
          style={{
            margin: 'auto',
            maxWidth: 240,
            color: 'var(--color-cockpit-text-dim)',
            textAlign: 'center',
            fontSize: 12,
            lineHeight: 1.6,
          }}
        >
          {t('cockpit.hud.emptyHint')}
        </div>
      )}
    </MetalPanel>
  )
}
