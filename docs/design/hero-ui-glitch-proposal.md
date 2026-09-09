# Proposta — una hero con glitch condiviso tra ritratto e UI

Ricerca del 2026-09-09, sulla versione `1f13ac4`.
Stato: direzione A e ritocchi della hero approvati e implementati localmente.
Le osservazioni sotto descrivono la versione precedente. Lo stato e la
verifica dell'implementazione sono in `docs/design/hero-ui-glitch.md`.
La successiva estensione alle altre sezioni e i nuovi video restano separati.
Il titolare chiede più cura da sito Awwwards, estensione del glitch al
passaggio del mouse sulla UI e una lista concreta di interventi.

## Evidenze della hero attuale

- Browser: 1440×900 e 390×844, homepage italiana. Capture in
  `.impeccable/review/hero-ui-research/{desktop,mobile}.png`.
- Il sistema visivo è riconoscibile: spazio, arancione, nome outline/pieno,
  foto personale e astronauta. Questi elementi restano la base.
- `hero-identity.tsx` ascolta il movimento sulla hero-stage, ma normalizza
  le coordinate rispetto al canvas della fotografia, scarta i punti esterni
  e ignora esplicitamente link, pulsanti e campi. Il testo non è disegnato
  nel canvas. Estendere soltanto il listener non produrrebbe glitch sulla UI.
- I pulsanti hanno hover CSS separati: colore, bordo e un piccolo movimento.
  Il feedback non condivide posizione, intensità o decadimento del ritratto.
- Il ruolo è 11px desktop e 9px mobile. I pulsanti misurano circa 52px
  desktop; su mobile la CTA principale è 46px, quella del CV circa 48px.
  La CTA dell'header può spezzare “Prenota una call” su due righe.
- Il link “Servizi” nell'header porta alla sola pagina siti web. La homepage
  contiene tre servizi: l'etichetta generale suggerisce una destinazione
  diversa da quella attuale.
- La hero occupa 180svh quando il cinema è attivo. Ogni riduzione proposta
  va verificata sul passaggio reale verso i servizi, senza togliere la scena.

## Direzioni possibili

| Direzione | Risultato percepito | Implementazione e compromesso |
| --- | --- | --- |
| **A. Glitch ottico preciso — consigliata** | Nome, fotografia e bordi dei controlli rispondono allo stesso passaggio del cursore. Brevi disallineamenti e rifrazione, con riposo pulito. | DOM/CSS per la UI e renderer WebGL esistente per il ritratto. Costo contenuto, fallback HTML, nessuna nuova libreria prevista. Richiede buona sincronizzazione. |
| B. Trasmissione digitale | Caratteri che si ricompongono e scansioni nette sui controlli. Più vicino al linguaggio del cockpit/terminale. | DOM e GSAP, costo contenuto. Più esplicitamente ludico; un uso esteso può rendere faticosa la lettura e indebolire il tono professionale. |
| C. Distorsione liquida | La scritta si piega come la superficie del ritratto, con una scia persistente. | Texture del titolo e framebuffer aggiuntivi. Più lavoro e costo GPU; testo HTML deve comunque restare disponibile. Richiede una verifica specifica su telefoni reali. |

Le valutazioni di impatto/costo sono stime progettuali, non misure FPS.

## Primo intervento proposto: direzione A

Valori iniziali da tarare nella prova visiva, non specifiche già validate.

| Elemento | Modifica concreta |
| --- | --- |
| **Matteo Dante** | Due copie decorative ritagliate del nome, con sottili bande vicino al cursore. Scarto iniziale 2–4px, più forte durante il drag. Stessa tipografia, outline e punto arancione. La scritta originale rimane leggibile. |
| **Punto arancione** | Brevissimo doppio contorno durante il cambio identità, come richiamo del glitch principale. Nessuna pulsazione continua a riposo. |
| **CTA arancione** | Una scansione del bordo e lieve disallineamento della freccia all'ingresso del cursore, circa 180–240ms. Il testo e l'area cliccabile rimangono stabili; il click apre subito Cal.com. |
| **CTA scura del CV** | Stesso ritmo, intensità minore: il bordo arancione e l'icona reagiscono insieme. Identica altezza della CTA primaria. |
| **Offerta e ruolo** | Reazione molto più lieve del titolo. Nessun rimescolamento delle parole dell'offerta. La lettura e il contrasto restano prioritari. |
| **Fotografia** | Conservare il glitch già approvato. Il passaggio dalla foto alla UI deve risultare continuo, con una sola sorgente di posizione e intensità. |
| **Touch** | Conservare l'intensità forte sul ritratto; sul titolo applicare un limite dedicato. Tap e drag danno un impulso, mentre lo scroll nativo rimane libero. I pulsanti rispondono al primo tap. |
| **Riposo e focus** | Il disturbo si spegne quando termina il movimento. Focus da tastiera netto e stabile; il comando di riduzione del movimento disattiva anche la nuova parte UI. |

## Piccoli ritocchi da fare insieme

1. Portare il ruolo mobile da 9px a 11–12px, diminuendo il tracking.
2. Uniformare a 48–52px i due pulsanti della hero e allineare icone e baseline.
3. Usare una label breve per la prenotazione nell'header mobile, ad esempio
   “Prenota”, conservando “Prenota una call” nella hero. Verificare anche EN.
4. Portare il link generale “Servizi” a `#services`; mantenere i tre link
   delle card alle rispettive pagine. È una proposta di navigazione.
5. Rendere più evidente il passaggio ai servizi: usare l'indicazione di
   scorrimento come link reale a quella sezione, con un target comodo.
6. Provare una durata più compatta della hero, da 180svh verso 155–165svh,
   soltanto se il confronto visivo conserva la scena e anticipa i contenuti.
7. Dopo la hero, condividere solo il piccolo feedback di bordo/freccia con
   le CTA dei servizi e progetti. Il muro dei brand resta lento ed elegante.
8. In un passaggio separato, sostituire i film di riferimento con media
   originali coordinati. La qualità dei contenuti visivi pesa quanto l'hover.

## Percorso tecnico proposto

- Coordinare gli input a livello di hero: coordinate del cursore, velocità,
  stato hover/drag/touch e decadimento. Conservare la trasformazione delle
  coordinate necessaria al canvas fotografico.
- Tenere distinta la reazione decorativa della UI dall'attivazione dei link.
  Osservare il puntatore sui controlli senza intercettarne click, focus o tap.
- Mantenere H1, descrizione e link nel DOM. Copie decorative `aria-hidden`
  e senza pointer events; nessuna cattura continua del DOM in una texture.
- Usare CSS clip-path/transform e GSAP già presente per i piccoli spostamenti.
  `quickTo` è adatto a proprietà numeriche aggiornate spesso dal puntatore.
  Non creare un tween nuovo per ogni evento.
- Per i transform che partecipano già al parallasse, usare un figlio
  decorativo: il glitch non deve sovrascrivere il movimento di scroll.
- Un solo ciclo di aggiornamento per il coordinamento, attivo finché serve;
  nessun setState per ogni movimento. Evitare letture ripetute del layout
  per ciascun frammento di testo.
- Fermare gli effetti fuori viewport, a pagina nascosta e con movimento
  ridotto. La UI deve funzionare anche se immagini o WebGL non si avviano.
- File da interessare: `landing-page.tsx`, `hero-identity.tsx`,
  `identity-pointer.ts`, `landing.css` e, se utile, un piccolo controller
  locale di coordinamento. Nessun nuovo sistema globale di animazione.

## Criteri per la prova prima del rilascio

Una singola verifica con desktop/mobile, EN/IT e input mouse/touch/tastiera,
poi correzioni in un blocco e una conferma. Controllare passaggio foto→nome→CTA,
drag veloce, pausa, tab nascosta, WebGL assente e scroll verso i servizi.
Nessuna duplicazione annunciata del testo, nessun salto di layout o click
ritardato. Misurare frame time durante l'interazione su hardware disponibile;
una viewport ridotta non dimostra prestazioni su un telefono reale.

## Riferimenti studiati e applicazione

- [Unseen Studio su Awwwards](https://www.awwwards.com/sites/unseen-studio):
  scheda SOTD e repertorio di menu, gallerie e transizioni. Riferimento per
  la coerenza delle interazioni tra componenti; palette e contenuti restano
  quelli di Matteo. La scheda valuta anche usabilità e contenuto.
- [CSS Glitch Effect — Codrops](https://tympanus.net/codrops/2017/12/21/css-glitch-effect/):
  livelli ritagliati e traslati. Base per un disturbo selettivo del testo;
  non adottare alla lettera le vecchie note di supporto browser dell'articolo.
- [Hover Animations for Terminal-like Typography — Codrops](https://tympanus.net/codrops/2024/06/19/hover-animations-for-terminal-like-typography/):
  demo aperta e provata con il cursore. Mostra ricomposizione per carattere
  e marcatori temporanei. Per questa landing userei il ritmo, evitando di
  nascondere o rimescolare il testo della CTA e dell'offerta.
- [Mouse Flowmap Deformation with OGL — Codrops](https://tympanus.net/codrops/2019/09/25/mouse-flowmap-deformation-with-ogl/):
  il movimento viene conservato in una texture e influenza il campionamento.
  Utile per valutare l'alternativa liquida, non necessario al primo intervento.
- [Typography Motion Trail — Codrops](https://tympanus.net/codrops/2021/07/21/creating-a-typography-motion-trail-effect-with-three-js/):
  framebuffer e persistenza per testo. Riferimento dell'opzione più costosa;
  non richiede adottare React Three Fiber o cambiare lo stack del progetto.
- [GSAP quickTo](https://gsap.com/docs/v3/GSAP/gsap.quickTo()/):
  riutilizzo di un tween per aggiornamenti numerici frequenti da mousemove.
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion):
  collegare la nuova decorazione alla preferenza di movimento dell'utente.

La proposta non attribuisce un premio né un incremento di conversione al
sito: sono risultati da ottenere e verificare, non conseguenze garantite
di una tecnica di animazione.
