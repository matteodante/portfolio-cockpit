'use client'

import { COCKPIT_ACCENT } from '@/lib/constants/theme'
import { SECTIONS } from '@/lib/data/cockpit-sections'
import { useHud } from '@/lib/hooks/cockpit-store'

const SCALE = 0.15

export default function MiniRadar() {
  const coords = useHud((s) => s.coords)
  const [px, pz] = coords

  return (
    <div
      style={{
        position: 'relative',
        width: 76,
        height: 76,
        border: `1px solid ${COCKPIT_ACCENT}`,
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(0,30,20,0.4), rgba(0,0,0,0.9))',
        boxShadow: `inset 0 0 12px ${COCKPIT_ACCENT}44`,
        marginLeft: 'auto',
      }}
    >
      {/* grid */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: 1,
          background: `${COCKPIT_ACCENT}22`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: 1,
          background: `${COCKPIT_ACCENT}22`,
        }}
      />
      {/* sweep */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `conic-gradient(from 0deg, ${COCKPIT_ACCENT}66, transparent 60deg)`,
          animation: 'cockpit-spin 3s linear infinite',
          mixBlendMode: 'screen',
        }}
      />
      {/* sections */}
      {SECTIONS.map((s) => {
        const dx = (s.pos[0] - px) * SCALE
        const dz = (s.pos[2] - pz) * SCALE
        const d = Math.hypot(dx, dz)
        if (d > 36) return null
        return (
          <div
            key={s.id}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(${dx - 3}px, ${dz - 3}px)`,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#d4cfc5',
              boxShadow: '0 0 4px #fff',
            }}
          />
        )
      })}
      {/* you */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%,-50%)',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: COCKPIT_ACCENT,
          boxShadow: `0 0 6px ${COCKPIT_ACCENT}`,
        }}
      />
    </div>
  )
}
