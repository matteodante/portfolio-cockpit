# Cockpit: proposta grafica e piano di verifica

14 settembre 2026 · commit studiato `dd00a08` · Three.js `0.183.2`.
**Stato aggiornato: UI desktop/mobile e intervento 3D approvati e implementati
in anteprima locale.** L'owner ha confermato illuminazione globale e particelle
come priorità, con prestazioni adatte anche a dispositivi meno potenti; iPhone 16
è un riferimento mobile indicativo, non il minimo hardware certificato.
Il buco nero rimane protetto. Le sezioni seguenti conservano lo studio iniziale;
risultato, misure e limiti sono in
[cockpit-visual-upgrade-validation.md](cockpit-visual-upgrade-validation.md).

## Raccomandazione

La scena può guadagnare molto dalla leggibilità delle forme e dai materiali.
Il primo intervento consigliato combina astronauta avorio ben illuminato,
pianeti con colori più naturali, scia dei propulsori più curata e un HUD
desktop compatto ai bordi. Recuperare lavoro inutile e chiamate di disegno
prima di introdurre ulteriori costi. Conservare il motore vanilla Three.js,
la separazione dalla UI React e la fisica esistente.

La [proposta interattiva](cockpit-study/index.html) confronta la UI desktop
attuale con una composizione proposta sulla scena reale. Include uno
[studio artistico dell'astronauta](cockpit-study/astronaut-lighting-concept.png),
generato con ImageGen a partire dal modello visibile nel gioco: è un
riferimento per luce e materiali, non un rendering ottenuto in Three.js.
Il [prompt completo](cockpit-study/astronaut-lighting-prompt.md) ne conserva
la provenienza. La proposta non seleziona un nuovo modello.

La [ricerca tecnica Three.js](cockpit-threejs-research.md) contiene fonti
ufficiali, riscontri sul sorgente installato, dettagli degli asset e
alternative escluse dal primo intervento.

## Riscontri nel gioco e nel motore

Sono stati esaminati renderer/composer, luci, costruzione del mondo,
pianeti e texture, GLB astronauta, propulsori, asteroidi, esplosione,
lettering, camera, input/fisica, qualità adattiva e bridge HUD/Zustand.
Il buco nero è stato letto per individuare dipendenze, senza modificarlo.
Intro e gameplay sono stati ispezionati a desktop e larghezza mobile;
la cattura QHD conferma la composizione su schermo largo.

| Riscontro confermato | Conseguenza pratica |
| --- | --- |
| `CockpitFrame` crea una fascia opaca alta 220 px; la scena continua a essere renderizzata sotto | A 900 px copre il 24,4% dell'altezza. La UI sembra un pannello separato dal mondo e nasconde parte dell'inquadratura senza risparmiare rendering |
| Quattro pannelli desktop mostrano sempre legenda, bersaglio, presentazione AI e azioni | Molto spazio fisso anche quando nessun bersaglio richiede attenzione; a QHD i pannelli centrali si allargano lasciando grandi vuoti |
| Astronauta: 1 mesh, 1 materiale, 1.604 triangoli; roughness 1 uniforme | Il modello è già leggero, ma visiera, guscio e tuta rispondono allo stesso modo alla luce |
| Il PNG incorporato pesa 2.110.065 dei 2.225.844 byte del GLB | Il download è dominato dall'immagine; decimare la mesh o aggiungere Draco non è la prima leva |
| Le mappe dei pianeti sono moltiplicate per tinte scure/sature | Colori e mezzi toni si perdono; la Terra ha anche una sovrapposizione di nuvole che contribuisce con il nero |
| Il lettering ha una PMREM; l'astronauta no | Esiste già un precedente per riflessi d'ambiente generati una volta; estenderli con controllo costa campionamenti ma non una nuova cubemap dinamica |
| Ogni particella dei propulsori crea una Mesh e un materiale | La scia è una priorità concreta per batching e riuso, anche nelle viste della cubemap |
| Asteroidi ed esplosione sono già raggruppati | Preservare rispettivamente `InstancedMesh` e `Points`; non rifare ottimizzazioni già presenti |
| Il calcolo raggi viene eseguito anche quando il composito lo ignora | Quando `visibility=0`, si può evitare la prima passata mantenendo il passaggio finale invariato |
| Camera e shrink/emissione delle particelle contengono fattori per frame | Il comportamento visivo può cambiare tra 60 e 144 Hz; renderlo dipendente dal tempo è un affinamento separato della fluidità |

`setHud` effettua già un confronto prima di pubblicare e il radar ha
l'angolo quantizzato. Durante il movimento, però, coordinate e velocità
grezze cambiano ogni frame anche se vengono mostrate con pochi decimali.
È sensato profilare e quantizzare i valori destinati alla sola telemetria,
mantenendo precisione piena nella simulazione. Non c'è evidenza per
sostituire Zustand o riscrivere la fisica di cinque pianeti e dieci asteroidi.

## Direzione artistica e interazione proposte

**Astronauta.** Conservare silhouette, equipaggiamento e carattere toy.
Schiarire la luce di riempimento con una componente neutra e dosare il
contrasto caldo/freddo. Differenziare la roughness della visiera e della
tuta con un atlante, preservando se possibile una sola mesh/materiale.
Valutare una piccola environment map prima solo sul personaggio. Il volto
scuro della visiera deve avere un riflesso leggibile, non emissione finta.

**Pianeti.** Usare albedo quasi neutra sulle fotografie, correggere le
nuvole con `alphaMap` e conservare una zona in ombra leggibile. Secondo
passaggio, entro il budget: bordo atmosferico dipendente dall'angolo di
vista sulla shell già esistente e bande radiali nell'anello esistente.
Normali extra solo dove una cattura ravvicinata ne dimostri l'utilità.
Non aumentare indiscriminatamente risoluzioni o numero di sfere.

**Effetti.** Sostituire le piccole sfere dei propulsori con un unico
buffer di particelle/sprite, alimentato per secondo e riutilizzato.
Sagoma, colore ed evoluzione della scia devono comunicare accelerazione.
Riutilizzare il sistema Points esistente per migliorare il burst di
impatto. Asteroidi con variazioni sobrie di colore e una superficie più
leggibile, mantenendo instancing e volumi di collisione. I risparmi sono
ipotesi da misurare, non un'autorizzazione ad aumentare tutti gli effetti.

**Desktop.** Lo spazio arriva fino al bordo inferiore. Identità e azioni
generali in alto; radar e telemetria compatti in basso a sinistra; chat e
legenda richiamabile a destra. Al centro una sola area contestuale:

- Volo libero: invito breve a esplorare, con i comandi essenziali.
- Avvicinamento: nome del pianeta e `Aggancia [E]` in evidenza.
- Atterraggio: stato locale e comando di decollo.
- Dock aperto: contenuti e gestione del focus restano nel componente attuale.

Le azioni sono normali controlli HTML accessibili, non interazioni WebGL.
Nel mockup sono disegnate in SVG solo per valutare la composizione.
Riutilizzare avatar, pulsanti, lingua e contenuti esistenti. CV, contatti,
GitHub, musica e chat mantengono percorsi accessibili. Stessi testi EN/IT
e stessi comportamenti di focus/Escape nell'implementazione.

**Mobile — estensione approvata dall'owner.** Portare la nuova direzione
anche sul telefono: strumenti compatti ai bordi e un'azione contestuale
centrale, adattando composizione e densità allo schermo stretto. Conservare
le funzioni dei comandi touch, menu, chat e navigazione, con hit target
comodi e safe area. Non ridurre semplicemente il layout desktop in scala.
La schermata mobile nella proposta interattiva documenta ancora la
baseline precedente: non è il nuovo layout mobile approvato e implementato.
La scena può beneficiare dei materiali nuovi; la qualità va verificata
su hardware mobile reale oltre che nel browser.

## Buco nero: confine effettivo

La catena attuale è `RenderPass → UnrealBloomPass → GodRaysPass`, senza
conversione finale `OutputPass`. Il percorso `mid/high` può quindi
contribuire al cupo. La documentazione Three.js spiega il ruolo della
[conversione finale](https://threejs.org/manual/en/color-management.html).
La sola dichiarazione ACES/exposure sul renderer non risolve questo
percorso. Correggerlo globalmente altererebbe anche la resa approvata.

Nel primo lotto rimangono fissi shader/configurazione BH, disco, anello,
cielo/stelle, qualità/frequenza della cubemap e parametri di bloom/raggi.
Il cielo è generato dentro lo stesso shader: aggiungere una nuova nebulosa
non è un intervento indipendente. L'ottimizzazione dei raggi a visibilità
zero evita lavoro che già non contribuisce al risultato.

Le luci e i materiali esterni cambiano naturalmente l'aspetto dei pianeti
campionati nella lente gravitazionale; possono inoltre cambiare la loro
contribuzione a bloom e raggi. Preservare il codice del BH da solo non
dimostra una resa identica. Il confronto deve controllare anche queste
interazioni e scartare gli interventi che alterano il carattere approvato.
Nessun nuovo compositing separato viene proposto senza evidenza del bisogno.

## Baseline locale di produzione

Build eseguita e avviata con `bun run build` e `bun run start --port 3001`.
Hardware rilevato: Apple M4, GPU 10 core, monitor QHD configurato a 144 Hz.
Browser: Chromium 153, ANGLE Metal Apple M4, pagina visibile, DPR 1.
Il sistema riportava i monitor in sleep: questi sono intervalli del
browser, non una misura di presentazione fisica del pannello.

| Scenario | Campione | Frame p50 / p95 | Chiamate disegno medie / p95 |
| --- | --- | --- | --- |
| 1440×900, volo fermo | 8 s, 1.152 frame | 6,9 / 7,1 ms | 61,8 / 65 |
| 1440×900, tasto W | 3 s, 432 frame | 6,9 / 7,4 ms | 127,8 / 160 |
| 2560×1440, volo fermo | 8 s, 737 frame | 13,2 / 14,7 ms | 61,8 / 65 |
| 390×844, viewport sul Mac | 8 s, 1.152 frame | 6,9 / 7,2 ms | 54,8 / 57 |

Nessun intervallo oltre 33,4 ms in questi campioni brevi. Il conteggio
include tutti i draw WebGL intercettati, anche postprocessing e cubemap;
non è tempo GPU. La propulsione cambia anche la posizione/culling: la
differenza non è una misura isolata del costo delle sole particelle.
Il campione QHD suggerisce sensibilità alla quantità di pixel, non prova
da solo quale passata sia il collo di bottiglia.

Dati integrali: [baseline.json](cockpit-study/baseline.json).
Acquisizioni: [desktop](cockpit-study/desktop-before.png),
[scena senza UI](cockpit-study/desktop-scene.png),
[viewport mobile](cockpit-study/mobile-before.png).
Script diagnostico locale:
`.impeccable/tmp/cockpit-study/capture.js`, eseguito attraverso il wrapper
Playwright `run-code --filename`; dati temporanei in
`output/playwright/cockpit-study/`. La prima cattura non aveva restituito
i dati al chiamante; il campione riportato è quello successivo salvato
esplicitamente in `window.__cockpitBaseline` e letto con `eval`.

`?quality=high` seleziona solo il preset iniziale: l'adattamento resta
attivo. Non è stato esposto il preset runtime; non considerare questi
campioni un benchmark bloccato a qualità costante. Safari, DPR 2/3,
mobile reale, riscaldamento prolungato e dock non sono coperti dai tempi
riportati. Il guadagno della proposta non è ancora misurato.

## File coinvolti e ordine di lavoro

| Ordine | Intervento | File principali |
| --- | --- | --- |
| 1 | Strumento di misura per frame completo e confronto a qualità costante, senza cambiare preset in produzione | `scene/build-world.ts`, `scene/three/renderer.ts` |
| 2 | Raggi senza contributo e batching della scia | `scene/three/god-rays.ts`, `scene/player/thrusters.ts` |
| 3 | Fill, materiale astronauta, albedo e nuvole | `scene/three/lights.ts`, `scene/player/astronaut.ts`, `scene/three/planets.ts`, `scene/three/textures.ts`; atlante derivato solo se necessario |
| 4 | Composizione desktop e area contestuale; adattamento della stessa direzione al mobile approvato dall'owner | `cockpit.css`, `chrome/cockpit-frame.tsx`, `chrome/top-bar.tsx`, `chrome/left-console.tsx`, `chrome/right-console.tsx`, `chrome/bottom-console/*`, `chrome/mobile-actions.tsx`, `chrome/mobile-game-controls.tsx`, eventuale wiring in `cockpit-app.tsx` |
| 5 | Solo con margine verificato: atmosfera/anelli, rifinitura asteroidi, fluidità camera e telemetria | `scene/three/planets.ts`, `scene/three/asteroids.ts`, `scene/camera/follow-camera.ts`, `lib/hooks/cockpit-store.ts` |

I percorsi `scene/`, `chrome/` e `cockpit*` sono relativi a
`components/cockpit/`. Il primo lotto non sostituisce renderer, framework,
modello o sistema di illuminazione con un'architettura nuova. Nessun
passaggio a WebGPU/R3F, ombre dinamiche globali, SSAO, depth of field o
motion blur è necessario per questa direzione.

## Criteri di accettazione proposti

- Stesso percorso e qualità effettiva prima/dopo: spawn, propulsione,
  rotazione BH davanti/dietro, Terra da vicino, atterraggio, dock e ritorno.
- Confrontare p50/p95, frame lenti, draw call e memoria/texture su build
  produzione; media FPS da sola non basta. Su dispositivi da 60 Hz il
  budget di riferimento è 16,7 ms, da validare rispetto alla baseline reale.
- Nessun miglioramento ottenuto abbassando DPR, raymarch o qualità BH.
  Aggiunte visive accettate solo entro il costo recuperato; nessuna
  percentuale di miglioramento promessa prima del confronto.
- Astronauta e pianeti leggibili sul lato in ombra, tuta non bruciata,
  visiera distinta, Terra senza velo nero, silhouette toy invariata.
- Buco nero alla stessa camera/tempo e con le stesse interazioni della
  scena circostante: disco, anello, alone, stelle e lensing riconoscibili.
- Desktop 1440/QHD e mobile verificati insieme; EN/IT, touch, tastiera,
  focus, Escape, reduced motion, assenza WebGL e asset non caricabili.
- Test comportamentali solo dove cambiano logiche; `bun run check`, build
  e controlli statici di design. Lo studio corrente non certifica nuove
  funzioni o prestazioni.

## Verifiche dello studio

`bun run check` passato: Biome/TypeScript e 42 test. Build di produzione
passata, con warning preesistente NFT tracing lungo il caricamento dei
file cifrati. In locale il 401 delle traduzioni private e il 404 degli
script Vercel non costituiscono errori del rendering 3D.

La pagina di proposta è stata ispezionata su desktop e mobile; il confronto
e lo stato di avvicinamento sono controlli del mockup, non modifiche al
gioco. Biome sulla pagina e sul JSON passato. Il detector Impeccable
segnala il frame screenshot senza padding e l'alias font `Space`, più
advisory sui toni e misure della pagina di studio: il bordo contiene
intenzionalmente un'immagine a piena area, e `Space` carica il file reale
Space Grotesk. Non sono stati cambiati i token o `DESIGN.md` per far
passare il mockup come sistema visivo già approvato.
