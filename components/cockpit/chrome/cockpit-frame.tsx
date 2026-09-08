export default function CockpitFrame() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 220,
        background: 'var(--color-cockpit-bg)',
        borderTop: '1px solid var(--color-cockpit-border)',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    />
  )
}
