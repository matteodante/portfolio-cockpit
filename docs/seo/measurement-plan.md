# SEO e misurazione — prima fase

Stato al 2026-09-09: implementazione locale pronta; account Google, ID
reali, verifica proprietà, pubblicazione e ricezione eventi ancora da
completare. Nessun dato storico o miglioramento SEO è stato misurato.

## Pagine e acquisizione

| Servizio / prova | Italiano | Inglese |
| --- | --- | --- |
| Siti web | /it/servizi/sviluppo-siti-web | /en/services/web-development |
| App e software | /it/servizi/sviluppo-app-software | /en/services/app-software-development |
| Automazioni AI | /it/servizi/automazioni-ai | /en/services/ai-automation |
| PiùUDITO, un cliente e tre siti | /it/progetti/piuudito | /en/projects/piuudito |

Le card della homepage portano alle rispettive pagine. La pagina servizio
spiega l’offerta, mostra progetti reali, risponde a domande concrete e porta
a Cal.com. I siti partono da 300 €; app e AI hanno preventivo su richiesta.
Nessun pacchetto o prezzo superiore è stato confermato.

Tutte le pagine sono renderizzate staticamente, con titolo e descrizione
propri, canonical sul dominio `https://matteodante.it`, hreflang IT/EN,
Open Graph, WebPage + Service/CreativeWork + breadcrumb JSON-LD, sitemap e
collegamenti pubblici in llms.txt. I dati strutturati descrivono il contenuto:
non garantiscono rich result o ranking. Non sono state create pagine locali
ripetitive o articoli generici solo per aumentare il numero di URL.

## Attivazione Google

1. Accedere all’account Google del titolare. La sessione controllata nel
   browser di Codex risultava disconnessa; richiesta di accesso già inviata.
2. Creare o scegliere una proprietà Search Console per `matteodante.it`.
   Preferibile proprietà Dominio con verifica DNS. In alternativa, proprietà
   prefisso URL e token HTML in `GOOGLE_SITE_VERIFICATION` (solo il token).
   I nameserver osservati erano GoDaddy; nessun record DNS è stato modificato.
3. Creare o scegliere GA4 e un flusso web per `https://matteodante.it`.
   Inserire il vero ID `G-…` in `NEXT_PUBLIC_GA_MEASUREMENT_ID`, nell’ambiente
   di produzione. Un build/deploy è necessario: le pagine sono statiche.
4. Prima di attivare il tag, disabilitare le misurazioni avanzate automatiche
   del flusso (incluse quelle basate sulla cronologia) per mantenere gli eventi
   manuali definiti qui, evitare doppioni e raccolta automatica di URL/form.
   Lasciare Google Signals, personalizzazione pubblicitaria e collegamenti
   Google Ads spenti. Integrare l’informativa del titolare con il trattamento
   effettivamente scelto prima dell’attivazione pubblica.
5. Pubblicare, verificare Search Console, inviare `/sitemap.xml` e controllare
   le otto URL con Ispezione URL. La richiesta di indicizzazione non promette
   che Google indicizzi immediatamente tutte le pagine.
6. Dopo consenso di prova, verificare gli eventi in GA4 Realtime/DebugView.
   Il test locale usa un ID fittizio e Google simulato: non prova la ricezione
   nel vero account. Registrare placement, service e project come dimensioni
   personalizzate se utili per i report.
7. Considerare `booking_created` come evento chiave solo dopo una prova del
   calendario effettivo. Una prenotazione creata non dimostra una call svolta,
   un lead qualificato o una vendita. Per misurare il percorso diretto esterno
   su Cal.com serve un’integrazione aggiuntiva nell’account o un webhook.

## Eventi GA4 predisposti

| Evento | Cosa significa | Cosa non dimostra |
| --- | --- | --- |
| page_view | Pagina commerciale vista dopo consenso | Lettura completa |
| service_opened | Clic su una pagina servizio | Richiesta ricevuta |
| case_study_opened | Clic sul caso PiùUDITO | Acquisto |
| project_opened | Clic su sito, App Store o repository | Uso del prodotto |
| booking_opened | Clic verso Cal.com o apertura popup | Prenotazione |
| booking_created | Callback bookingSuccessfulV2 del popup | Conferma, presenza, qualifica o vendita |
| contact_clicked | Clic sul link email | Email inviata o lead |

Le proprietà inviate sono etichette interne ammesse: placement, service,
project, method, locale e URL della pagina ripulito. Non vengono inviati
query string, frammenti, percorsi sconosciuti, dati dei form o payload di
Cal.com. Il referrer è limitato all’origine. I parametri UTM non vengono
conservati da questa prima integrazione: l’attribuzione delle campagne
richiederà una scelta esplicita prima delle Ads. Non confondere questa
predisposizione con un setup pubblicitario già attivo.

## Consenso e confini

- Senza ID valido, nessun tag Google e nessuna interfaccia di consenso GA.
- Con ID valido, il tag viene caricato solo dopo scelta esplicita positiva.
  Prima della scelta e dopo il rifiuto, nessuna richiesta al tag Google.
- Scelta in localStorage `matteo-analytics-consent-v1`, durata 180 giorni.
  Valori mancanti, malformati, futuri o scaduti non concedono consenso.
- I due pulsanti hanno uguale trattamento. Le preferenze si riaprono dal
  fondo pagina, senza coprire i contenuti durante la navigazione.
- La revoca ferma gli eventi applicativi, imposta il flag di disattivazione
  GA, aggiorna il consenso a denied e cancella i cookie GA accessibili.
  Un tag già caricato resta in memoria fino alla navigazione completa.
- Tutti i consensi pubblicitari restano negati. Nessun pixel Ads o Meta.
- GA è limitato alle pagine commerciali; il cockpit è escluso. Non misura
  chat o CV protetto. Senza JavaScript, contenuti, link e FAQ restano usabili.
- Vercel Web Analytics e Speed Insights erano già presenti e restano
  indipendenti da questo controllo GA. Disponibilità e raccolta nel loro
  account non sono state verificate. Il consenso qui non è una CMP universale.

## Piano sostenibile di contenuti

Prima osservare ricerche e contatti reali; poi scrivere una guida che
risponda a un dubbio frequente: cosa preparare per un sito, quando serve
un rifacimento, come definire una prima versione di app. Ogni guida deve
rimandare al servizio pertinente e includere esperienza o esempi reali.

Per il passaparola, condividere direttamente la pagina del servizio adatto.
Ogni mese controllare query e pagine in Search Console, visite con consenso,
aperture del calendario, prenotazioni e richieste effettivamente ricevute.
Tenere separati questi livelli. Con poco traffico, privilegiare qualità
delle richieste e conversazioni reali rispetto a test A/B senza campione.

## Fonti tecniche

- [Google: consenso](https://developers.google.com/tag-platform/security/guides/consent)
- [GA4: page view manuali](https://developers.google.com/analytics/devguides/collection/ga4/views)
- [Google: versioni localizzate](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Search Console](https://support.google.com/webmasters/answer/9128668?hl=it)
- Cal: contratto `bookingSuccessfulV2`, `on` e `off` verificato nel pacchetto
  installato `@calcom/embed-core` 1.5.3. Il test locale simula il callback,
  senza prenotare appuntamenti o inviare dati al servizio.

## Verifica dell’implementazione

- `bun run check`: 26 test, 120 asserzioni; lint e tipi inclusi.
- `bun run build`: otto pagine commerciali statiche IT/EN generate.
- Browser di produzione: otto canonical/hreflang/schema corretti, sitemap,
  URL inesistenti 404, nessun overflow nei viewport verificati, link delle
  tre card corretti e prezzi allineati. Contenuti, FAQ native e link Cal
  utilizzabili senza JavaScript; skip link con focus visibile.
- GA simulato: nessun caricamento prima del consenso o dopo rifiuto; un
  solo tag e page view manuali senza duplicati, distinzione clic/prenotazione,
  callback Cal deduplicato e rimosso alla chiusura, revoca e cancellazione
  cookie. Non è una verifica di ricezione nei servizi esterni.
- React Doctor sul diff: 96/100, nessun problema segnalato. La scansione
  completa segnala anche diagnostiche preesistenti di cockpit e hero,
  escluse da questa modifica; non è dichiarata pulita l’intera repo.
- Impeccable: zero anti-pattern primari nella scansione iniziale; note sulla
  scala tipografica esaminate nel contesto del sistema visivo. Revisione
  indipendente su desktop/mobile e revisione del controllo FAQ.
- Nuove immagini: quattro catture, circa 580 KiB complessivi; provenienza
  incorporata in tutte. Le pagine servizio non importano la scena WebGL
  o la sequenza video della homepage.
