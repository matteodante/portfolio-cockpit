import type { CSSProperties } from 'react'

type ScrewProps = {
  size?: number
  angle?: number
  style?: CSSProperties
}

export default function Screw({ size = 14, angle = 45, style }: ScrewProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background:
          'radial-gradient(circle at 30% 30%, #b0ada8, #555 70%, #222)',
        boxShadow:
          'inset 0 1px 2px rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.8)',
        position: 'relative',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '15%',
          right: '15%',
          height: 1.5,
          background: '#111',
          transform: `translateY(-50%) rotate(${angle}deg)`,
          boxShadow: '0 1px 0 rgba(255,255,255,0.15)',
        }}
      />
    </div>
  )
}
