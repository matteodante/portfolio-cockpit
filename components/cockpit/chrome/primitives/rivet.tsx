import type { CSSProperties } from 'react'

type RivetProps = {
  size?: number
  style?: CSSProperties
}

export default function Rivet({ size = 10, style }: RivetProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, #888, #333 60%, #000)',
        boxShadow:
          'inset 0 1px 2px rgba(255,255,255,0.1), 0 1px 1px rgba(0,0,0,0.6)',
        ...style,
      }}
    />
  )
}
