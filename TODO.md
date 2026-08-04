# TODO — matteodante.it

Stato: landing rifatta — singola hero clip AI (astronauta in ascesa)
scrubbata dallo scroll + sezioni editorial; scroll-world rimosso.
La roadmap sotto (fase video multi-scena) è superata e resta solo
come storico costi.

## Pre-video (gratis, via Codex image_gen)

- [x] Rigenerare in alta qualità le 2 still ancora in qualità draft API:
      `web` (città siti/e-commerce) e `contact` (launchpad). Fatto —
      tutte e 5 le scene ora sono Codex HD, sorgente uniforme.

## Fase video (a pagamento — vedi confronto costi sotto)

Chain fly-through, 5 scene: 5 dive + 4 connettori per chain.

- Desktop 16:9: 9 clip × ~5s = 45s
- Mobile 9:16 nativa: 9 clip × ~5s = 45s
- Totale: 18 clip ≈ 90s di video (+~15% di re-roll)

Costi stimati (prezzi verificati lug 2026):

| Provider | Qualità | Costo stimato (2 chain + re-roll) |
|---|---|---|
| Replicate `bytedance/seedance-2.0-fast` | 720p | **~$15** ($0.1452/s) |
| Replicate `bytedance/seedance-2.0` | 720p | ~$31 ($0.3024/s) |
| Replicate previz | 480p | ~$7 solo desktop ($0.1512/s) |
| Monid (default skill) | 1080p | ~$55 |
| Higgsfield credits | 1080p | ~900–1200 crediti |

Varianti risparmio:
- Solo dive senza connettori (l'engine fa crossfade diretto):
  10 clip totali ≈ 50s → **~$7-8** con seedance-2.0-fast 720p.
- Solo desktop, mobile con hardening automatico: metà dei costi.

Limite Replicate: max 720p (niente 1080p). Per il master desktop 1080p
serve Monid o Higgsfield.

Flusso: previz 480p → approvazione → finale 720p/1080p → encode ffmpeg
(crf 20, -g 8, +faststart, mobile -g 4 720p) → config engine
(`clip`/`clipMobile`/`connectors`) → deploy.

## Grafica / brand

- [ ] OG + Twitter image (`app/[lang]/opengraph-image.tsx`,
      `twitter-image.tsx`): usano ancora la grafica pre-landing.
      Rifarle col logo cartoon + mondo glossy-toy.
- [ ] README: gli screenshot in `preview/` mostrano il sito vecchio
      (solo cockpit). Aggiornare con landing + cockpit.
- [ ] Valutare logo astronauta (già generato, in scratchpad) come
      icona dentro il cockpit.

## UX / features landing

- [ ] Language switcher sulla landing (ora si cambia lingua solo via
      URL o dal cockpit).
- [ ] Evento analytics sul click PLAY (Vercel Analytics custom event)
      per misurare landing → cockpit.
- [ ] QA mobile su device reale (portrait crop delle scene 16:9,
      copy in basso, safe-area).
- [ ] Copy IT sezione intro: 4 righe su viewport medi, valutare
      accorciamento.

## Note tecniche

- OPENAI_API_KEY (gymtrainer) ha raggiunto il billing hard limit:
  immagini solo via Codex CLI (`codex exec` + image_gen, fatturato
  all'abbonamento ChatGPT) finché non si alza il limite.
- Still canoniche per la chain video: scratchpad della sessione
  Claude (`stills/`, `webapp-variants/cantiere.png`,
  `ai-variants/fabbrica.png`, `intro-v3.png`).
