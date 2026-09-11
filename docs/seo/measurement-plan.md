# SEO e misurazione — prima fase

Stato al 2026-09-10: GA4 creato nell'account Google del titolare
`matteo.dante659@gmail.com` (Google visualizza la forma senza punti).
Account Analytics esistente `238824806`, proprietà `MatteoDante.it`
`553514237`, flusso web `15753370678`, ID `G-RNBF9FLEY4`.
Timezone Italia / Europe-Rome, valuta EUR. ID salvato come variabile
Vercel Production; le anteprime non inviano dati a questa proprietà.
Vercel Web Analytics e Speed Insights sono già abilitati e mostrano dati.
Il deploy di attivazione è completato. Richieste reali accettate da Google
(HTTP 204); il report Realtime mostra la visita di prova.

La revisione tecnica di metadati, JSON-LD, sitemap, robots e llms.txt è
verificata nel build di produzione locale e pronta per il commit/push
richiesto dal titolare. Dettagli, fonti e controlli:
[technical-metadata.md](technical-metadata.md). La pubblicazione del codice
non attiva automaticamente gli account Google né conferma l'indicizzazione.

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
Cal.com. Il referrer è limitato all’origine. Su richiesta del titolare, i parametri UTM source, medium, campaign,
content e id sono ora mappati ai campi campagna GA4 solo dopo consenso.
Accettiamo etichette di massimo 80 caratteri, lettere/numeri/trattino/underscore.
Il resto della query, i termini liberi e gli identificatori gclid/fbclid
non vengono inoltrati dal codice applicativo. I dati di campagna non vengono
salvati dal sito prima del consenso; un cambio pagina prima di accettare
può perdere l'attribuzione iniziale. Non confondere questa
predisposizione con un setup pubblicitario già attivo.

## Consenso e confini

- Senza ID valido, nessun tag Google; il pannello mostra solo le preferenze tecniche.
- Alla prima visita il pannello appare dopo 20 secondi. L'apertura manuale
  delle preferenze nel footer è immediata; il ritardo non concede consenso.
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

## Own-website proof links

The homepage and website-development page now show matteodante.it and the
cockpit as a personal project. Their existing `project_opened` event uses
`portfolio_website` or `portfolio_cockpit`, with `home_work` or
`service_proof` placement. These are explicit allowed labels. A click shows
interest in an example; it is not game completion, a booking or a lead.
Google receipt is still unverified until the existing activation steps run.


## Configurazione operativa — 2026-09-10

- Misurazione avanzata del flusso disattivata; `page_view` manuale per
  evitare doppi eventi e raccolta automatica di moduli/ricerche/link.
- Google Signals e raccolta dati forniti dagli utenti non attivati.
  Personalizzazione annunci disabilitata in tutte le 307 regioni.
- Dimensioni evento registrate: placement (Posizione del clic), service
  (Servizio), project (Progetto), method (Metodo prenotazione), locale
  (Lingua del sito). Nessuna contiene testo della chat o dati del calendario.
- Vercel usa `beforeSend` per ripulire gli URL in Analytics e Speed Insights,
  rimuovendo query/frammenti e sostituendo percorsi sconosciuti con /not-found.
  Il cockpit può apparire come pagina pubblica Vercel; GA resta limitato
  alla parte commerciale. Chat, CV e operazioni private non sono eventi GA.
- Piano Vercel Hobby: traffico e prestazioni disponibili; eventi custom
  Vercel richiedono Pro/Enterprise. Nessun upgrade o costo attivato: gli
  eventi commerciali restano in GA4.

## Campagne future

Convenzione: slug brevi e senza dati personali. Esempio illustrativo,
non campagna attiva:
`https://matteodante.it/it/servizi/sviluppo-siti-web?utm_source=google&utm_medium=cpc&utm_campaign=siti_it&utm_content=annuncio_a`

GA4 distingue sempre `booking_opened` (intenzione), `booking_created`
(callback del calendario incorporato), contatto email cliccato e risultato
commerciale. Non usare aperture o clic email come conversione primaria
per offerte automatiche Ads. Il calendario diretto su Cal.com non riporta
automaticamente l'esito sul sito; per quello serve collegamento Cal o
webhook e prova end-to-end. Nessuna prenotazione fittizia è stata creata.

Prima di avviare Ads: scegliere account/campagna, conversione primaria e
budget con Matteo; verificare una vera prenotazione autorizzata, quindi
registrare/importare l'evento chiave; collegare Google Ads e configurare
l'eventuale consenso pubblicitario, informativa e gestione dei click ID.
Non ci sono tag AW, remarketing, enhanced conversions, liste pubblico o
spesa pubblicitaria attivi. Il consenso analytics non abilita advertising:
`ad_storage`, `ad_user_data` e `ad_personalization` restano denied.

Fonti: [configurazione gtag](https://developers.google.com/tag-platform/gtagjs/reference),
[eventi custom Vercel](https://vercel.com/docs/analytics/custom-events),
[filtri Speed Insights](https://vercel.com/docs/speed-insights/package).


## Verifica reale dell'attivazione

- Account proprietario verificato nel selettore Google; nessun account o
  destinatario aggiuntivo ha ricevuto accesso.
- Google: nessuna richiesta prima del consenso, dopo rifiuto o dopo revoca.
  L'accettazione carica un tag per `G-RNBF9FLEY4`; i cookie GA vengono
  rimossi alla revoca.
- `page_view` e `service_opened` reali hanno ricevuto HTTP 204. L'evento
  servizio include `service=web` e `placement=services`.
- Campagna di prova `setup_qa / internal / analytics_setup` presente nei
  campi campagna; page_location è `https://matteodante.it/it` senza query.
- La disattivazione scelta durante la creazione dello stream non era
  rimasta salvata: il test iniziale ha rilevato scroll automatico e doppio
  page_view. Corretto nello stream esistente e riverificato dopo ricarica:
  un solo page_view per il cambio pagina IT→EN, nessuno scroll automatico.
  I primi eventi di prova restano dati QA, non traffico commerciale.
- Realtime GA4 ha mostrato 1 utente attivo. I report standard di una nuova
  proprietà possono richiedere elaborazione; non sono risultati di campagna.
- Vercel Web Analytics mostra traffico e Speed Insights dati prestazionali.
  Il payload `/view` osservato contiene l'URL pubblico senza query. Il
  controllo client riguarda il campo URL; gli altri metadati restano
  governati dal SDK Vercel e dal suo servizio.
- Corretto il footer: le preferenze cookie ora riservano spazio sopra i
  controlli fissi, per consentire accettazione/rifiuto/revoca con il mouse.
- `bun run check`: 42 test / 518 asserzioni; build superato. React Doctor
  93, una segnalazione preesistente di complessità nel pannello consenso.
- Nessuna prenotazione reale, email di prova o campagna Ads inviata.

## Provenienza delle prenotazioni — 2026-09-11

Nell'evento Cal.com esistente `Talk with me` (`matteo-dante/30min`) è stata
salvata la domanda facoltativa bilingue «Come mi hai trovato? / How did you
find me?», identificatore `discovery_source`. Placeholder: Google, ChatGPT,
passaparola/referral, altro/other. Salvataggio verificato riaprendo la sezione
Booking form; campo presente anche nell'anteprima. Nessun appuntamento o
messaggio di prova inviato, nessuna modifica a durata, disponibilità o URL.

La risposta rimane nel calendario: non viene copiata in GA4 o nel repository.
È provenienza dichiarata, non attribuzione certa a un annuncio; “Google”
può indicare ricerca organica. Serve anche per le prenotazioni dai link Cal
diretti, il cui esito non ritorna automaticamente al sito. L'integrazione
embed esistente distingue `booking_created` da `booking_opened`, ma la
ricezione di una vera prenotazione resta da verificare. Non è stato
configurato un nuovo evento chiave sulla base di un clic o di un test finto.

Il report GA4 esistente e la pagina Bookings di Cal.com sono le viste
operative attuali. Costi pubblicitari e clienti non sono sincronizzati con
GA4. Le bozze complete, URL UTM e criteri del confronto sono nel repository
freelance, `outreach/drafts/ads-siti-web-2026-09/README.md`. Sono file di bozza,
non campagne native pubblicate. Nessuna attivazione Ads o spesa effettuata.
