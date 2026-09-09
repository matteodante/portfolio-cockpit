'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { createHeroInteraction } from '@/components/landing/hero-interaction'
import { PERSON_IMAGE_PATH } from '@/lib/constants/site'

const ASTRONAUT = '/landing-v2/identity/astronaut.webp'
const MATTEO = PERSON_IMAGE_PATH

export default function HeroIdentity() {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!(host && canvas)) return
    return createHeroInteraction(host, canvas, [ASTRONAUT, MATTEO])
  }, [])

  return (
    <div ref={hostRef} className="hero-identity" aria-hidden="true">
      <Image src={ASTRONAUT} alt="" fill priority unoptimized />
      <canvas ref={canvasRef} />
    </div>
  )
}
