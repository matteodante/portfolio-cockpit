# Cockpit: risultato e verifica locale

14 settembre 2026 · branch `codex/cockpit-visual-upgrade` · confronto con
`dd00a08` · Three.js 0.183.2. Implementazione locale, non pubblicata.

L'owner ha approvato il nuovo HUD anche su mobile e il lavoro su illuminazione,
materiali e particelle, con prestazioni come vincolo. iPhone 16 è un riferimento
indicativo: non è stata eseguita una misura su quel dispositivo fisico.

## Risultato

- Luce globale più neutra e leggibile: riempimento ambientale/emisferico,
  controluce freddo e sorgenti calde dosate, con lo stesso numero di luci.
  È illuminazione ambientale approssimata e riflessione d'ambiente precalcolata,
  non GI con rimbalzi dinamici o ray tracing.
- L'astronauta conserva GLB, atlante, silhouette, una mesh e un materiale.
  La visiera risponde con roughness diversa dalla tuta; riutilizza la PMREM
  già generata per il lettering. Nessun nuovo download o cubemap dinamica.
- Albedo dei pianeti neutra sulle fotografie, nuvole con alphaMap lineare,
  atmosfera Fresnel sulla shell esistente e bande radiali sull'anello.
  Asteroidi più leggibili, sempre instanziati e con geometria invariata.
- Due scie con un solo `Points`, 64 slot riutilizzati, emissione al secondo e
  dissolvenza morbida. Le scintille d'impatto mantengono 40 slot e hanno un
  profilo circolare; nessun draw quando il sistema è vuoto.
- HUD compatto desktop/touch, scena visibile dietro gli strumenti inferiori,
  menu nativo per comandi e collegamenti, azione contestuale al centro.
  CV pubblico/privato, contatto, chat, musica, IT/EN e decollo restano accessibili.
- Telemetria limitata a 10 Hz, con cambi di fase/bersaglio immediati;
  camera interpolata in base al tempo. Menu/dock fermano simulazione e GPU,
  documento nascosto sospende RAF e cancella gli input pendenti.
- Fallback senza WebGL con CV, email e home. PMREM/risorse temporanee e GLB
  caricato dopo l'unmount vengono rilasciati.

I file del buco nero, il renderer e i preset sono identici al commit di
partenza. Bloom/raggi globali conservano i loro parametri; si evita soltanto
la passata dei raggi quando il composito non la usa. La scena riflessa nel
buco nero include naturalmente i nuovi materiali dei pianeti. L'adattamento
esistente ora interviene sotto 50 fps sostenuti, dopo la stessa grazia e
cooldown; `benchmark=1` lo sospende per misure a qualità costante.

## Catture dell'implementazione

[Desktop reale](cockpit-study/desktop-after.png) ·
[Mobile reale, emulazione DPR 3](cockpit-study/mobile-after.png).
Sono catture del gioco, distinte dal precedente
[studio artistico](cockpit-study/astronaut-lighting-concept.png).
Le catture funzionali supplementari sono locali in
`output/playwright/cockpit-upgrade/`.

## Confronto di produzione

Stesso Mac M4 con GPU 10 core, Chromium 153/ANGLE Metal, viewport e DPR 1
corrispondenti alla baseline. Misure con wrapper delle funzioni WebGL di draw
(inclusi i sei render cubemap) e intervalli RAF. Tab visibile; nessun altro
cockpit attivo durante le misure. 8 secondi per idle, 3 per avanzamento,
dopo caricamento/warm-up. Preset high prima e dopo; nel nuovo campione è
anche verificato dal dataset del mount.

| Campione | Draw/frame medi prima → dopo | Mediana frame ms prima → dopo | p95 ms prima → dopo |
| --- | --- | --- | --- |
| Desktop 1440×900, idle | 61,8 → 52,1 | 6,9 → 6,9 | 7,1 → 8,1 |
| Desktop 1440×900, avanti | 127,8 → 61,7 | 6,9 → 6,9 | 7,4 → 7,8 |
| QHD 2560×1440, idle | 61,8 → 52,0 | 13,2 → 13,1 | 14,7 → 14,8 |
| Viewport 390×844, idle | 54,8 → 46,4 | 6,9 → 6,9 | 7,2 → 8,2 |

Il calo delle chiamate è **51,7% nel volo con scia** e circa 15–16% negli idle.
Non significa 52% di fps in più o di consumo energetico in meno. Media e
mediana RAF rimangono sostanzialmente equivalenti; p95 leggermente più alto
in alcuni campioni. Nessun frame oltre 33,4 ms in questi brevi confronti.
La frequenza configurata è 144 Hz; i monitor risultavano in sleep, quindi
RAF non prova la presentazione fisica dei frame. Non sono timestamp GPU,
misure termiche o dati di campo.

Dati: [prima](cockpit-study/baseline.json),
[dopo](cockpit-study/after-metrics.json).
Il controllo ripetuto dopo le correzioni della review mantiene 52,1 draw/frame
idle desktop e 61,7 in avanzamento, con media RAF circa 6,95 ms. Su QHD la
media resta 10,87 ms, ma il p95 varia a 20,9 ms (massimo 29,1 ms), rispetto
ai 14,8 ms del primo dopo. Il risparmio di draw è confermato; la variabilità
di pacing a QHD resta un limite di queste brevi misure RAF, non una misura
GPU. Nessun frame oltre 33,4 ms nel ricontrollo.
[Dati finali dopo review](cockpit-study/final-metrics.json).

Script riproducibili locali in `.impeccable/tmp/cockpit-study/`:
`capture.js`, `capture-after.js`, `functional-qa.js`, `stress.js`.

### Prova CPU rallentata

Viewport mobile 390×844, DPR dispositivo 3, CPU Chromium rallentata 6×,
GPU M4 invariata. High usa buffer 780×1688, low usa 390×844.

| Profilo | Draw/frame medi | Mediana / p95 ms | Qualità finale |
| --- | --- | --- | --- |
| High fisso | 46,8 | 6,9 / 8,5 | high |
| Low fisso | 10,0 | 6,9 / 8,5 | low |
| Automatico | 46,8 | 6,9 / 8,5 | high |

Il campione low ha un outlier di 34,6 ms. Questo esercizio verifica il percorso
leggero e il comportamento sotto rallentamento CPU; non simula la GPU, Safari,
la memoria o il throttling termico di un vecchio telefono. Il carico non ha
provocato un downgrade automatico sul Mac. [Dati](cockpit-study/cpu-stress.json).

Il preset low esplicito preesistente compila il buco nero con 28 passi e
riduce sensibilmente il disco in questa inquadratura: limite già presente,
non corretto per rispettare il vincolo sul buco nero. Il downgrade runtime
riduce DPR/passate/cubemap ma conserva i passi compilati all'avvio. Il normale
avvio parte da high; la qualità adattiva comporta ancora i compromessi
visivi originali sui dispositivi che non sostengono quel carico.

## Verifiche

- `bun run check`: Biome e TypeScript senza errori, 51 test passati,
  569 expect. Quattro nuovi controlli significativi verificano pool/drain,
  densità delle scie e stabilità temporale della camera a 30/60/144 Hz.
- `bun run build`: riuscita. Resta il warning NFT preesistente nel percorso
  di caricamento delle traduzioni cifrate, estraneo a questa modifica.
- React Doctor 0.9.14: nessun problema riportato sulle modifiche; score
  78/100. Corretto l'accesso ai ref durante render segnalato nel primo passaggio.
- Impeccable cockpit detector e `design:check`: nessun finding primario;
  advisory su toni/taglie e componenti preesistenti. `design:doctor` riporta
  soltanto il buildPath non scelto, senza imporre una nuova decisione ora.
- Menu: focus contenuto, Escape e ritorno al trigger; tasti premuti nel
  menu non muovono il giocatore dopo la chiusura. Zero draw in menu e chat.
- Chat apre/chiude senza inviare messaggi; HUD sottostante inert, focus
  restituito al pulsante. Contatti ed email disponibili; CV pubblico HTTP 200.
- Atterraggio automatico, Info del pianeta Progetti, chiusura e decollo
  verificati nel gioco. Impatto e respawn verificati da una nuova partenza;
  scintille compilate/renderizzate senza errori shader.
  [Esito impatto](cockpit-study/impact-qa.json).
- Mobile touch nativo emulato, DPR 3, portrait e landscape; pressione sul
  canvas avvia il movimento. Controlli e menu visibili a 320 px, IT/EN;
  layout a 720×450 verificato come equivalente di reflow desktop al 200%.
- `prefers-reduced-motion: reduce`: UI e comandi restano utilizzabili.
  La simulazione e gli effetti di volo restano animati; non è una modalità
  di gioco completamente statica.
- Nessun errore JavaScript nella sessione mobile. Console produzione locale:
  attesi 401 delle traduzioni private e 404 degli script riservati a Vercel;
  nessun errore shader nella scena/propulsori osservati.
- In questa sessione automatizzata il cambio tab non ha reso `document.hidden`
  vero. Il ramo visibility è stato quindi verificato con override dell'attributo
  e evento sintetico: zero draw dopo hide, ripresa dopo show. Resta da verificare
  il cambio app reale su iPhone.
- WebGL negato prima dell'avvio: fallback leggibile e tre link funzionanti.

[Esiti funzionali automatici](cockpit-study/functional-qa.json).
Dopo la review sono passati anche i controlli di ritorno del focus da Contatto
header e menu→Contatto/chat, rilascio nativo di due dita sul telefono emulato,
e respawn interrotto da 4,2 secondi di menu. Nessun errore JavaScript/shader:
[regressioni della review](cockpit-study/review-qa.json).
La verifica su Safari/iPhone 16 fisico e su hardware più vecchio resta aperta.
L’owner ha successivamente autorizzato review, correzioni e commit/push del
branch. La [review indipendente](cockpit-code-review.md) registra quattro
problemi corretti e nessun blocco residuo. Questo non attesta un deploy
sul dominio pubblico.
L'anteprima di produzione locale ascolta su `0.0.0.0:3001`; Tailscale risulta
Running e la route `/it/cockpit` risponde HTTP 200 sull'IP del Mac.
