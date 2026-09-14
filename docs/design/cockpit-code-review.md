# Cockpit — review indipendente e correzioni

14 settembre 2026. Richiesta owner: review da un altro Astra xhigh, correzione
dei problemi confermati e commit/push del lavoro. Due reviewer indipendenti
`gpt-6-astra`, reasoning `xhigh`, hanno esaminato Standards e Spec separatamente.
Confronto: `dd00a08d2e2dfbdc6e9c7f532aa9f5508770c2e1` → working tree, inclusi
nuovi sorgenti/test/documenti e integrazioni dell'intero cockpit.

## Standards

Nessuna violazione confermata. Esaminati HUD, input/scene bridge, materiali,
particelle, lifecycle GPU, hook condivisi, traduzioni, test, documentazione e
catture desktop/mobile. Il motore conserva vanilla Three.js, separazione da
React, `setHud`, controlli localizzati e confine CV pubblico/privato.
Nessuna nuova astrazione richiesta. Ripuliti i commenti obsoleti su telemetria
e vecchia gestione dock; i file temporanei Playwright sono esclusi da Git.
Le licenze dei font accompagnano le copie della proposta statica.

## Spec

Quattro difetti P2 confermati, corretti e ricontrollati dal reviewer:

| Problema | Origine | Correzione |
| --- | --- | --- |
| Timer di atterraggio/decollo e respawn consumavano il tempo nel menu | Nuova pausa | Timer basati sul tempo della simulazione, avanzato soltanto nei frame attivi |
| Anelli/atmosfera restavano visibili quando i pianeti sfumavano lontano | Nuovi shader | Uniformi e profondità fog condivise; normale fog sull'anello, attenuazione alpha sull'atmosfera additiva |
| Sollevare il dito dal canvas prima del dito sul comando lasciava la spinta attiva | Preesistente | Touch appartenenti al canvas; composizione separata di tastiera, pulsanti e gesto |
| Camera degli shader del buco nero in ritardo di un frame | Preesistente | Aggiornamento uniformi dopo framing e aggiornamento matrice della camera |

Durante la riparazione del touch è stato individuato e corretto anche un
conflitto fra tastiera premuta e rilascio di un pulsante touch. Un test ne
copre il caso. Shader/config del buco nero, renderer e preset sono invariati.
Il cambiamento di ordine della camera corregge l'integrazione esterna senza
cambiare l'effetto artistico.

## Validazione

`bun run check`: 51 test, 569 expect, Biome/TypeScript passati.
`bun run build`: riuscita, solo warning NFT preesistente nel caricamento dei
file cifrati. React Doctor 0.9.14: nessun finding, 78/100 invariato.
I nuovi test coprono entrambi gli ordini di rilascio dei tocchi, cancellazione,
reset, combinazione tastiera/touch e atterraggio/decollo durante una lunga
pausa dell'orologio reale. Il reviewer ha rieseguito i test mirati.

Contatto da tastiera, menu→Contatto/chat, rilascio multitouch e respawn
in pausa sono passati anche nel browser sulla build finale. Nessun errore
JavaScript/shader. Verificata anche la scena a circa Z −853: nessun anello
o atmosfera rimane visibile oltre la distanza di fog. Il benchmark finale
conferma i draw ridotti, con la variabilità QHD riportata esplicitamente.
Le verifiche e i limiti hardware sono riportati in
[cockpit-visual-upgrade-validation.md](cockpit-visual-upgrade-validation.md).
Nessuna prova su un telefono fisico è stata eseguita dagli agenti di review.

Standards: 0 finding. Spec: 4 P2 corretti, nessun blocco residuo identificato.
