# Search Console e indicizzazione

Verifica operativa: 11 settembre 2026.

## Proprietà e file pubblico

La proprietà prefisso URL `https://matteodante.it/` è stata verificata
nell'account del titolare tramite `public/google1080ef41ff116224.html`.
Il file è intenzionalmente pubblico, compatibile con la repo open source;
non contiene credenziali Vercel. Va mantenuto nei deploy successivi.
L'header `X-Robots-Tag: noindex` evita di proporlo come pagina di contenuto.

La verifica tramite GA4 non trovava il tag nella pagina iniziale:
Analytics viene caricato dopo consenso. Non è stato anticipato il tag per
superare la verifica. Nessun DNS modificato o accesso assegnato a terzi.

## Risultati iniziali di Google

- Sitemap inviata e letta l'11 settembre: stato **Riuscita**, 14 URL
  rilevate. L'iniziale messaggio di recupero non riuscito è scomparso
  dopo l'elaborazione, senza cambiare URL o formato della sitemap.
- Homepage italiana indicizzata, canonical Google uguale a quello dichiarato.
  Ultima scansione riportata: 3 luglio 2026, 02:06:41, Googlebot smartphone.
  Il risultato di ricerca mostrava ancora il vecchio titolo del cockpit.
  Nuova indicizzazione richiesta e accettata nella coda prioritaria.
- Siti web e app/software: rilevate tramite sitemap ma non ancora scansionate
  né indicizzate. Richieste di indicizzazione accettate nella coda prioritaria.
- Automazioni AI: inizialmente sconosciuta a Google; richiesta di scansione
  accettata nella coda prioritaria.
- Caso PiùUDITO: rilevato ma non ancora indicizzato; richiesta accettata.
- I report aggregati della nuova proprietà sono in elaborazione; Google
  indica di ricontrollare tra un giorno o due. Non sono ancora dati finali.

## Modifiche tecniche

- Sitemap: mantenute le 14 destinazioni pubbliche canoniche, le varianti
  reciproche EN/IT, x-default e le immagini. Aggiunte date `lastmod` stabili,
  ricavate dalla cronologia dei contenuti pubblicati: homepage/cockpit
  10 settembre (`087d659`, `a02ebb4`), pagine commerciali 9 settembre
  (`6b69ac0`), Markdown CV pubblico 8 luglio (`76cf38d`). Aggiornare le date
  in `app/sitemap.ts` solo per cambiamenti sostanziali ai contenuti,
  collegamenti o dati strutturati; mai impostarle alla data di ogni build.
- Robots: consentita la scansione anche delle API, affinché Google possa
  leggere i loro header `noindex`. CV e traduzioni private restano protetti
  da autenticazione e restituiscono 401 ai visitatori anonimi. Robots non
  è un controllo di accesso. I percorsi privati non entrano nella sitemap.
- Verificati titoli distinti, canonical autonomi, riferimenti linguistici,
  schemi Person/WebSite/Service/CreativeWork e breadcrumb. I link ai servizi
  sono già nel markup HTML della homepage e nei footer commerciali.
  Non sono state aggiunte pagine duplicate o un falso schema per sitelink.

## Controlli

`bun run check`: 42 test, 532 asserzioni, lint e tipi superati.
`bun run build`: superato; permane l'avviso preesistente di tracing dei
file nel loader dei contenuti cifrati. Nessun cambiamento visivo.

Verifiche HTTP: le 14 URL della sitemap pubblicata rispondono 200 senza
redirect; le 12 pagine HTML hanno canonical coerente e non hanno noindex.
Sul build locale aggiornato: sitemap XML valida con 14 date, robots
accessibile, file Google 200 + noindex, API protette 401 + noindex e
servizio inesistente 404 + noindex.

Commit applicativo `17bf6f7` pubblicato tramite il deploy GitHub/Vercel
`dpl_FrrKFnH6wEdCcFcBW6cU9dZcAbP7` (Ready). Verificati anche sul dominio
pubblico robots aggiornato, 14 lastmod, file Google 200 + noindex,
API protette 401 + noindex e pagina inesistente 404 + noindex.

## Sitelink e limiti

I sitelink organici sono scelti da Google in base alla query e alla struttura
del sito. Le pagine candidate esistono già; il primo ostacolo osservato è
l'assenza di scansione delle nuove pagine servizio. Verifica della proprietà,
invio sitemap e richieste di scansione non garantiscono indicizzazione,
posizionamento o comparsa dei sitelink. Non esiste un pulsante di attivazione
né un markup che ne garantisca la visualizzazione.

Fonti:

- [Sitelink](https://developers.google.com/search/docs/appearance/sitelinks?hl=it)
- [Sitemap e date reali](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Noindex e scansione](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [Search Console del sito](https://search.google.com/search-console?resource_id=https%3A%2F%2Fmatteodante.it%2F)
