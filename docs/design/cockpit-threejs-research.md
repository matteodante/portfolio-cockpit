# Cockpit: ricerca Three.js per qualità visiva e costo GPU

Data: 14 settembre 2026. Stato: ricerca e proposta, nessuna modifica al gioco.
Versione verificata: `three@0.183.2` in `package.json` e `node_modules`.
La documentazione online viene aggiornata: per il comportamento di questa
applicazione fa fede il sorgente installato, non un esempio della versione
più recente. Le fonti sono documentazione Three.js, sorgente Three.js e
asset/codice del repository. Non sono stati misurati FPS o tempi GPU in
questa ricerca; la verifica del browser è un'attività distinta.

Vincoli dell'owner: conservare il buco nero e la sua resa; conservare la UI
mobile; studiare una scena più luminosa, curata e leggibile senza peggiorare
le prestazioni. Le raccomandazioni seguenti non sono scelte già approvate.

## Risultato principale

Ci sono interventi concreti sui materiali e sugli effetti esistenti prima
di aggiungere effetti a schermo intero: correggere la tinta delle texture
dei pianeti, usare correttamente la maschera delle nuvole, migliorare la
risposta del materiale dell'astronauta e raggruppare i propulsori. Questi
punti hanno evidenza nel codice. Il loro beneficio estetico e il costo
finale vanno verificati sul gioco.

La pipeline colore richiede particolare attenzione: **manca la conversione
finale prevista da Three.js**, ma inserirla globalmente cambierebbe anche
il buco nero approvato. Non è una modifica da includere automaticamente
nel primo intervento grafico.

## 1. Colore e tone mapping: anomalia confermata, impatto da verificare

In [renderer.ts](../../components/cockpit/scene/three/renderer.ts) la catena è
`RenderPass → UnrealBloomPass → GodRaysPass`. Il renderer dichiara sRGB,
ACES e exposure 1.16, ma non esiste `OutputPass`. Il materiale composito
finale di [god-rays.ts](../../components/cockpit/scene/three/god-rays.ts)
scrive direttamente `scene + rays`: non include conversione sRGB né tone
mapping.

Nel sorgente installato `WebGLRenderer.js:2275–2291`, i render target
ordinari usano Linear-sRGB e disabilitano il tone mapping del materiale;
la conversione deve quindi avvenire alla fine. `OutputPass` e
`OutputShader` installati applicano esplicitamente entrambe le operazioni.
La guida ufficiale prescrive questo passaggio con il postprocessing e
descrive la mancata conversione come possibile causa di immagine scura.
È quindi una spiegazione tecnica plausibile del “cupo”, non una misura
del suo peso percettivo nel cockpit.
Fonti: [gestione colore](https://threejs.org/manual/en/color-management.html),
[postprocessing](https://threejs.org/manual/en/how-to-use-post-processing.html),
[OutputPass](https://threejs.org/docs/pages/OutputPass.html),
[renderer r183](https://github.com/mrdoob/three.js/blob/r183/src/renderers/WebGLRenderer.js).

Il preset `low` spegne bloom e god-rays: `RenderPass` diventa l'ultima
passata e rende direttamente sul canvas. I materiali built-in possono
quindi seguire un percorso colore diverso dai preset `mid/high`. Lo
shader custom del buco nero non contiene comunque i chunk colore finali.
Le immagini dei preset devono essere confrontate separatamente.
Evidenza: `lib/utils/scene-quality.ts`,
`node_modules/three/examples/jsm/postprocessing/EffectComposer.js:236`,
`node_modules/three/examples/jsm/postprocessing/RenderPass.js`,
`components/cockpit/scene/blackhole/blackhole-shader.ts`.

**Raccomandazione:** registrare il problema e mantenere invariata la catena
globale durante la prima proposta. Un eventuale percorso colore corretto
per tutta la scena richiede un confronto dedicato del buco nero; una
separazione in più compositing pass aggiungerebbe complessità e costo e
non è giustificata prima di quel confronto. Nemmeno aumentare soltanto
`toneMappingExposure` è una soluzione affidabile alla catena attuale.

## 2. Pianeti: colore, nuvole e materiali

Le sei texture planetarie sono 2048×1024 e il loader le annota sRGB
correttamente. Tuttavia il materiale moltiplica la mappa fotografica per
`section.color`: la Terra usa `0x2b6cb0`, Giove `0x7a9fc9`, Nettuno
`0x8fa87a`. Queste tinte non sono una semplice etichetta della sezione:
alterano e attenuano l'albedo. Prima proposta: colore neutro o molto vicino
al bianco per i pianeti dotati di texture, accenti di sezione nei segnali
di navigazione. Nessuna nuova geometria o passata è necessaria.
Evidenza: [planets.ts](../../components/cockpit/scene/three/planets.ts),
[textures.ts](../../components/cockpit/scene/three/textures.ts),
[cockpit-sections.ts](../../lib/data/cockpit-sections.ts).
La modulazione `map × color` è documentata in
[MeshStandardMaterial](https://threejs.org/docs/pages/MeshStandardMaterial.html).

La mappa delle nuvole, ispezionata localmente, contiene nuvole bianche su
sfondo nero. È un JPEG senza alpha, usato come `map` con opacity 0.45:
anche le zone nere della sfera contribuiscono alla composizione. Proposta
mirata: usare quell'immagine come `alphaMap`, con colore bianco e
`NoColorSpace`, sostituendo il campionamento colore con quello della
maschera. Le zone senza nuvole diventerebbero trasparenti senza aggiungere
una seconda mappa. Opacità e terminatore vanno rivisti visivamente.
Fonti: [asset nuvole](../../public/textures/planets/earth_clouds_2k.jpg),
`planets.ts:74–95`, [semantica alphaMap](https://threejs.org/docs/pages/MeshStandardMaterial.html#alphaMap).

Normali e roughness dedicate possono aggiungere dettaglio illuminato
senza aumentare i triangoli, ma aggiungono campionamenti e memoria. Sono
una seconda fase, concentrata sui pianeti osservabili da vicino. Per
l'atmosfera, un bordo dipendente dall'angolo di vista sulla sfera già
esistente è una proposta più contenuta di un nuovo effetto volumetrico;
resta da prototipare e non è un miglioramento misurato.

## 3. Illuminazione PBR: riutilizzare una base già presente

La scena ha ambient, hemisphere, una directional, due point light vicino
all'origine e una terza point light nel lettering. Non manca il numero
di luci. Le tre point light usano `decay=1`: è una scelta artistica,
diversa dal default fisico `2`, e cambiarla richiederebbe un nuovo tuning
delle intensità. Non serve trasformare il gioco in una simulazione
fotometrica per renderlo più leggibile.
Evidenza: [lights.ts](../../components/cockpit/scene/three/lights.ts),
[backdrop-text.ts](../../components/cockpit/scene/three/backdrop-text.ts).
Fonte: [PointLight](https://threejs.org/docs/pages/PointLight.html).

Il lettering genera già una PMREM da `RoomEnvironment`, assegnata solo al
suo materiale. Pianeti e astronauta non ricevono questa illuminazione
d'ambiente. Three.js raccomanda un environment per la resa PBR;
`PMREMGenerator.fromScene()` è disponibile anche nella versione installata.
Una piccola illuminazione d'ambiente generata una volta, dosata sui
materiali interessati, può dare separazione alle superfici senza una
cubemap dinamica aggiuntiva. Non occorre cambiare `scene.background`.
Esiste però un costo di generazione iniziale e di campionamento nei
materiali: “una volta” non significa costo runtime nullo.
Fonti: [MeshStandardMaterial](https://threejs.org/docs/pages/MeshStandardMaterial.html),
[PMREMGenerator](https://threejs.org/docs/pages/PMREMGenerator.html),
`node_modules/three/src/extras/PMREMGenerator.js:109`.

**Raccomandazione:** provare un fill morbido e neutro mantenendo il
contrasto caldo/freddo esistente, con lo stesso numero o meno luci.
Testare l'environment sull'astronauta prima di estenderlo. Tenere
`MeshStandardMaterial` come base; `MeshPhysicalMaterial` ha un costo per
pixel maggiore quando si attivano le caratteristiche avanzate. Non
aggiungere transmission, clearcoat generalizzato o ombre dinamiche alla
prima proposta. Il lettering è già l'eccezione Physical con clearcoat.
Fonte: [MeshPhysicalMaterial](https://threejs.org/docs/pages/MeshPhysicalMaterial.html).

## 4. Modello astronauta: il peso è soprattutto la texture

Lettura del JSON GLB e degli header PNG, senza modificare l'asset:

| Dato | Valore verificato |
| --- | ---: |
| GLB | 2.225.844 byte |
| Mesh / primitive / materiali | 1 / 1 / 1 |
| Vertici / triangoli | 3.254 / 1.604 |
| Skin / animazioni | 0 / 0 |
| Texture incorporata | PNG 2048×2048, 2.110.065 byte |
| Materiale | metallic 0, roughness 1, sola baseColorTexture |

Evidenza: [astronaut.glb](../../public/models/astronaut.glb),
[astronaut.ts](../../components/cockpit/scene/player/astronaut.ts).
`GLTFLoader` installato applica questi fattori e annota la base color
sRGB; l'app non arricchisce il materiale caricato. L'animazione di volo
attuale è il bob/roll dell'intero gruppo, non una clip scheletrica.

La visiera e il tessuto condividono quindi la stessa risposta roughness.
Proposta: conservare forma e singolo materiale, valutando un atlante di
roughness/metalness per differenziare le superfici e un environment
controllato. Una nuova mesh molto più dettagliata non è il primo bisogno
dimostrato. Draco/Meshopt ridurrebbero dati geometrici, ma oltre il 94%
del file attuale è immagine: non sono la prima leva di download.
Supporto loader: [GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html).

## 5. Effetti e costo: dove recuperare margine

| Elemento verificato | Opportunità proposta | Limite della conclusione |
| --- | --- | --- |
| Propulsori: nuova Mesh e clone materiale per particella, massimo 96 | Pool con un solo `Points` o instancing; forma della scia più curata con attributi per età/dimensione | Riduce oggetti e potenziali draw call; resa e guadagno GPU da misurare |
| Asteroidi: 10 istanze, già un `InstancedMesh` | Conservare instancing; diversificare colori/scala e una geometria rocciosa migliore solo se leggibile | Non proporre un refactor di batching già esistente |
| Esplosione: 40 particelle in un solo `Points` | Riutilizzare il modello di gestione a buffer | Non è una sorgente dimostrata di lentezza |
| God-rays: 24 tap a metà larghezza/altezza | Saltare il calcolo raggi quando `visibility=0`, mantenendo il composito | Oggi il composito ignora i raggi a zero, ma la prima passata viene comunque eseguita |
| Testo 3D: 6.752 triangoli generati, materiale Physical | Valutare bevel più economico se il confronto non perde la silhouette | Conteggio geometrico offline, non tempo GPU |

Evidenza: `player/thrusters.ts`, `three/asteroids.ts`,
`three/explosion.ts`, `three/god-rays.ts:143–147`,
`three/backdrop-text.ts:32–42`, sotto `components/cockpit/scene/`.
Il conteggio testo è stato riprodotto con `TextGeometry` installato e gli
stessi parametri di produzione. L'instancing riduce le chiamate di disegno
per oggetti con geometria/materiale condivisi:
[InstancedMesh](https://threejs.org/docs/pages/InstancedMesh.html).

`UnrealBloomPass` r183.2 esegue estrazione, dieci blur su cinque livelli,
composizione e blending: **13 disegni di quad** nella catena attuale,
a risoluzioni diverse. God-rays ne aggiunge due. Non equivalgono a 15
render completi della scena, ma sconsigliano di sommare altri effetti
fullscreen senza un budget misurato. Bloom, raggio, soglia e god-rays
concorrono al buco nero approvato: conservarli nel primo intervento.
Evidenza: `node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js:283–368`.

La cubemap del buco nero esegue **sei render della scena** per update,
uno per faccia; il commento “un render aggiuntivo” in `build-world.ts`
semplifica troppo il costo. È già esclusa in alcune condizioni. Frequenza,
risoluzione e contenuto sono parte del vincolo “buco nero intatto”, quindi
non sono margine liberamente spendibile.
Fonte: [CubeCamera r183](https://github.com/mrdoob/three.js/blob/r183/src/cameras/CubeCamera.js),
evidenza locale `node_modules/three/src/cameras/CubeCamera.js:220–247`.

`antialias:true` sul renderer non configura MSAA sui render target del
composer: quelli creati qui hanno `samples=0`. Un eventuale MSAA del
target o AA finale deve essere valutato nel percorso corretto e può
alterare anche il buco nero; non è una ottimizzazione gratuita.
Fonti: [RenderTarget.samples](https://threejs.org/docs/pages/RenderTarget.html#samples),
`node_modules/three/examples/jsm/postprocessing/EffectComposer.js:69`,
`node_modules/three/src/core/RenderTarget.js:62`.

## 6. Texture: separare download, memoria e frame time

Le sei mappe planetarie più quella dell'astronauta occuperebbero circa
85 MiB con il modello RGBA8 + mipmap complete; è una stima teorica dalle
dimensioni, non VRAM letta dal driver. Non include render target, PMREM,
label o fallback. Ridurre solo la qualità JPEG/PNG migliora il download,
non la memoria dopo la decompressione.
Fonte: [memoria delle texture](https://threejs.org/manual/en/textures.html).

Proposta in ordine: verificare la risoluzione effettivamente necessaria
nelle inquadrature vicine; ottimizzare il PNG dominante del GLB; valutare
KTX2/Basis se la memoria o l'upload sono problemi misurati. KTX2 può
transcodificare in formati compressi supportati dalla GPU, ma introduce
transcoder/worker e necessita `detectSupport(renderer)`. Compressione
texture e minor numero di triangoli non garantiscono più FPS se il limite
principale è il postprocessing.
Fonte: [KTX2Loader](https://threejs.org/docs/pages/KTX2Loader.html).

## 7. Verifica richiesta prima di promettere le stesse prestazioni

1. Ripetere lo stesso percorso: intro, volo con BH visibile, rotazione con
   BH dietro, avvicinamento alla Terra, propulsione continua e dock.
2. Registrare dimensione canvas, DPR effettivo, preset iniziale e preset
   runtime. L'adattamento attuale può spegnere effetti: non attribuire a
   una modifica grafica gli FPS guadagnati dal downgrade.
3. Misurare frame time p50/p95, frame lenti e contatori renderer su desktop
   e dispositivo mobile reale. In un frame con composer/cubemap serve
   `renderer.info.autoReset=false` e un reset per frame completo; il
   default azzera i dati a ogni singola chiamata render. I contatori sono
   carico di disegno, non un timer GPU.
4. Conservare confronti del BH alla stessa camera e allo stesso tempo,
   includendo disco, photon ring, alone, stelle e lensing. Cambiare luci o
   materiali esterni può cambiare i pianeti campionati nella sua cubemap;
   il fatto di non modificare `blackhole/` non dimostra da solo invarianza
   percettiva. Anche bloom e raggi reagiscono al contenuto della scena.
   Preservare identità, disco, ring e parametri globali è distinto dal
   promettere pixel identici attorno ai pianeti riflessi. Cielo e stelle
   sono prodotti dentro `blackhole-shader.ts`: nessun nuovo intervento
   sul cielo nel primo lotto.
5. Confrontare la UI mobile esistente e desktop separatamente. Questa
   ricerca non propone modifiche ai comandi o alla disposizione mobile.

Fonte per i contatori:
[WebGLRenderer.info](https://threejs.org/docs/pages/WebGLRenderer.html#info).
Evidenza dei vincoli runtime: `build-world.ts`, `scene-quality.ts` e
`blackhole-shader.ts:194–232`.

## Sequenza consigliata

Prima proposta visuale: pianeti meno tinti, nuvole trasparenti corrette,
astronauta più leggibile e materiali differenziati, scia più elegante e
HUD desktop più integrato. Prima implementazione solo dopo la scelta
della direzione: interventi locali, batching dei propulsori e lavoro
evitato quando i raggi non contribuiscono. Poi confronto a qualità
costante. Environment e ulteriori mappe entrano solo se il confronto
mostra beneficio entro il budget recuperato. Correzione globale del
colore, nuovi effetti fullscreen, nuova architettura renderer o modifiche
alla cubemap restano fuori da questa prima proposta.
