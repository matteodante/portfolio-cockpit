import type { CSSProperties } from 'react'
import { useT } from '@/lib/i18n'

type ChatHeaderProps = { sending: boolean }

const STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '6px 10px',
  background: 'var(--color-cockpit-panel-light)',
  border: '1px solid #000',
  fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
  fontSize: 10,
  letterSpacing: 2,
  color: 'var(--color-cockpit-text-dim)',
}

export default function ChatHeader({ sending }: ChatHeaderProps) {
  const t = useT()
  return (
    <div style={STYLE}>
      <span>
        {t('cockpit.sections.comm.label')} · {t('cockpit.hud.aiStatus')}
      </span>
      <span>
        {sending ? t('cockpit.comm.thinking').toUpperCase() : 'READY'}
      </span>
    </div>
  )
}
