import MetalPanel from '@/components/cockpit/chrome/primitives/metal-panel'
import { useT } from '@/lib/i18n'

export default function AiPanel({ onOpenComm }: { onOpenComm: () => void }) {
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body), sans-serif',
            fontSize: 21,
            fontWeight: 500,
          }}
        >
          {t('cockpit.sections.comm.title')}
        </span>
        <span
          style={{
            color: 'var(--color-cockpit-hud-green)',
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 10,
          }}
        >
          {t('cockpit.hud.aiStatus')}
        </span>
      </div>
      <p
        style={{
          fontFamily: 'var(--font-body), sans-serif',
          fontSize: 12,
          lineHeight: 1.5,
          color: 'var(--color-cockpit-text-dim)',
          margin: 0,
        }}
      >
        {t('cockpit.hud.aiPreview')}
      </p>
      <button
        type="button"
        className="brand-button"
        onClick={onOpenComm}
        style={{
          marginTop: 'auto',
          alignSelf: 'flex-end',
          minHeight: 38,
          padding: '8px 14px',
          fontSize: 12,
        }}
      >
        {t('cockpit.controls.openAiBtn')}
      </button>
    </MetalPanel>
  )
}
