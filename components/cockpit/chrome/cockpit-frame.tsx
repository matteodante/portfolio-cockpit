import { COCKPIT_ACCENT } from '@/lib/constants/theme'

const FRAME_BG = 'linear-gradient(180deg, #2a2a2a 0%, #0a0a0a 50%, #000 100%)'
const BOTTOM = 220

export default function CockpitFrame() {
  return (
    <>
      {/* Bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: BOTTOM,
          background: FRAME_BG,
          zIndex: 10,
          boxShadow:
            'inset 0 2px 6px rgba(0,0,0,0.8), 0 -2px 8px rgba(0,0,0,0.5)',
          borderTop: '1px solid #000',
          pointerEvents: 'none',
        }}
      />

      {/* Window glow + scanlines */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: BOTTOM,
          zIndex: 9,
          pointerEvents: 'none',
          boxShadow: `inset 0 0 40px rgba(0,0,0,0.85), inset 0 0 0 2px ${COCKPIT_ACCENT}22`,
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.03) 0%, transparent 40%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: BOTTOM,
          zIndex: 9,
          pointerEvents: 'none',
          background:
            'repeating-linear-gradient(to bottom, transparent 0, transparent 2px, rgba(255,255,255,0.025) 2px, rgba(255,255,255,0.025) 3px)',
        }}
      />

      {/* Corner accent brackets */}
      <div
        style={{
          position: 'absolute',
          bottom: BOTTOM + 10,
          left: 10,
          width: 24,
          height: 24,
          borderBottom: `2px solid ${COCKPIT_ACCENT}`,
          borderLeft: `2px solid ${COCKPIT_ACCENT}`,
          zIndex: 11,
          pointerEvents: 'none',
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: BOTTOM + 10,
          right: 10,
          width: 24,
          height: 24,
          borderBottom: `2px solid ${COCKPIT_ACCENT}`,
          borderRight: `2px solid ${COCKPIT_ACCENT}`,
          zIndex: 11,
          pointerEvents: 'none',
          opacity: 0.6,
        }}
      />
    </>
  )
}
