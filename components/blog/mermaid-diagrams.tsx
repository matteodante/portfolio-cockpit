'use client'

import { useEffect } from 'react'

// Draws the article's ```mermaid blocks (<pre class="mermaid">) in the site's palette. Mermaid loads only on
// pages that have diagrams; without JavaScript the diagram source stays readable.
export default function MermaidDiagrams() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>('.article-body pre.mermaid')
    )
    if (!nodes.length) return
    let cancelled = false
    import('mermaid').then(async ({ default: mermaid }) => {
      if (cancelled) return
      const body = document.querySelector('.article-body')
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'base',
        fontFamily: body ? getComputedStyle(body).fontFamily : 'sans-serif',
        // Natural size: the CSS fits them to the column on wide screens and lets them scroll on phones.
        flowchart: { useMaxWidth: false },
        sequence: { useMaxWidth: false },
        themeVariables: {
          darkMode: true,
          fontSize: '15px',
          background: '#0c0d11',
          primaryColor: '#14161c',
          primaryTextColor: '#f2ede3',
          primaryBorderColor: '#5c5a55',
          secondaryColor: '#14161c',
          tertiaryColor: '#0c0d11',
          lineColor: '#a7a5a1',
          textColor: '#f2ede3',
          mainBkg: '#14161c',
          nodeBorder: '#5c5a55',
          clusterBkg: '#0c0d11',
          clusterBorder: '#3b3a37',
          edgeLabelBackground: '#0c0d11',
          actorBkg: '#14161c',
          actorBorder: '#5c5a55',
          actorTextColor: '#f2ede3',
          actorLineColor: '#5c5a55',
          signalColor: '#a7a5a1',
          signalTextColor: '#f2ede3',
          labelBoxBkgColor: '#14161c',
          labelBoxBorderColor: '#5c5a55',
          labelTextColor: '#f2ede3',
          noteBkgColor: '#1d1a17',
          noteBorderColor: '#ff6b35',
          noteTextColor: '#f2ede3',
          activationBkgColor: '#1d1a17',
          activationBorderColor: '#ff6b35',
        },
      })
      await mermaid.run({ nodes })
    })
    return () => {
      cancelled = true
    }
  }, [])
  return null
}
