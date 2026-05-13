'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'cockpit:music-muted'
const SRC = '/audio/ambient.mp3'
const VOLUME = 0.1

/**
 * Background music for the cockpit.
 * - Reads/writes the mute preference in localStorage so refresh remembers it.
 * - Playback is gated by `active`; pass `started` from the cockpit so the
 *   audio only starts after the intro is dismissed (which is the user gesture
 *   browsers require to permit audio.play()).
 * - The audio file at SRC is expected to be a loopable ambient track.
 */
export function useBackgroundMusic(active: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === '1') setMuted(true)

    const audio = new Audio(SRC)
    audio.loop = true
    audio.volume = VOLUME
    audio.preload = 'metadata'
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, muted ? '1' : '0')
  }, [muted])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (active && !muted) {
      audio.play().catch(() => {
        // Autoplay still blocked (no user gesture yet) — toggle will retry.
      })
    } else {
      audio.pause()
    }
  }, [active, muted])

  const toggle = useCallback(() => {
    setMuted((m) => !m)
  }, [])

  return { muted, toggle }
}
