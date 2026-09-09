# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The homepage primarily serves potential clients (confirmed 2026-09-08).
Recruiters retain the separate playable CV:

- **PMI e imprenditori italiani** — cercano un fornitore unico per sito,
  app o AI; spesso arrivano da passaparola o ricerca.
- **Startup e team di prodotto** (anche esteri) — cercano un senior
  freelance per costruire o accelerare un prodotto.
- **Aziende che vogliono l'AI in produzione** — cercano un consulente che
  l'abbia già portata in produzione davvero.
- **Recruiter / hiring manager** — valutano il profilo per contratti o
  posizioni; il cockpit-CV giocabile e il CV completo gated sono pensati
  soprattutto per loro.

## Product Purpose

Sito personale di Matteo Dante, software engineer freelance & consulente
AI (8+ anni di ingegneria in produzione). Due superfici: una landing
per clienti con prenotazione diretta su Cal.com, e il "cockpit" —
un gioco 3D nello spazio che È il CV giocabile. Successo della landing = una call prenotata per discutere un progetto.
Email resta un contatto alternativo; il cockpit serve il percorso CV.

## Positioning

**Fornitore unico full-stack**: un solo interlocutore per sito, app
mobile e AI — dall'idea all'App Store senza agenzie di mezzo. (Claim
confermata dall'utente come posizionamento portante; "produzione, non
demo" resta un supporto veritiero già presente nel copy.)

## Operating Context

- Visitatori arrivano su `/{locale}` (landing) e possono passare a
  `/{locale}/cockpit` (gioco/CV). Locale rilevato da Accept-Language.
- Il CV completo (markdown + PDF), le traduzioni private e il profilo
  chat completo sono dietro un codice d'accesso condiviso
  (cookie firmato); versioni pubbliche "skeletal" sempre disponibili.
- Chat AI nel cockpit (sezione COMM) risponde su profilo pubblico o
  privato a seconda dell'accesso.

## Capabilities and Constraints

- Servizi offerti: web app & app mobile (React, Next.js, React Native,
  TypeScript — app pubblicate sull'App Store), consulenza AI (agenti
  LLM, RAG, automazioni, AI in produzione), siti & e-commerce (SEO,
  performance, pagamenti).
- Stack del sito: Next.js 16 App Router, React 19 + Compiler, Three.js
  vanilla (non R3F), Tailwind v4, Bun. Nessun CMS, nessun DB.
- Homepage: sostituzione della vecchia landing autorizzata il 2026-09-08.
  Reference scelta: https://www.dungyov.com/, struttura e composizione
  molto fedeli, contenuti propri, brevi e orientati ai clienti.
  Correzione successiva: Oakley Axiom Space come reference per grandi media,
  parallasse 3D e scene legate allo scroll, anche su telefono. Placeholder
  fotografici ora; media originali e video in una fase successiva.
- Foto personale fornita dall’utente, utilizzabile come riferimento per
  un ritratto generato. CTA diretta a Cal.com: l’utente ha poi confermato
  `https://cal.com/matteo-dante`, ora collegato ai pulsanti di prenotazione.
- Terminologia ricorrente: decollo/takeoff, PLAY, cockpit, COMM, DOCK.
- Prezzi confermati dall’utente: siti web a partire da 300 €; app e
  software, AI su misura su richiesta. Tre card con pulsanti che aprono le rispettive pagine servizio
  (correzione del titolare, 2026-09-09). Nelle pagine servizio la CTA finale
  apre Cal.com in un popup, con link diretto come fallback.

## Brand Commitments

Vincolanti (confermati dall'utente):

- **Mondo spaziale + astronauta**: tema spazio, astronauta toy glossy,
  metafora decollo/cockpit — identità permanente.
- **Landing più seria e diretta per clienti**: poco testo, offerta
  comprensibile, contatto immediato. Il tono giocoso rimane nel cockpit.
- **Bilinguismo EN/IT alla pari**, sempre.
- Unificazione approvata: stessa identità per landing e cockpit; stesso
  identità dell’astronauta, tipografia e controlli comuni. La landing usa
  una reinterpretazione Image Gen basata sul render del modello esistente. L’esperienza del gioco rimane
  più giocosa, con strumenti leggibili e dettagli decorativi ridotti.

Non vincolante (esplicitamente lasciato libero di evolvere): la palette
attuale dark `#05060a` + accento arancio `#ff6b35`. È l'incumbent, non un
impegno.

Asset di identità: nome "Matteo Dante", astronauta toy e foto reale fornita
dall’utente. Avatar circolare e ritratto sono elaborazioni della stessa foto,
con volto realistico e riconoscibile. Il simbolo orbitale negli header e nei
servizi è stato rimosso su richiesta; la hero include il link al CV giocabile.
Font e trattamento dei controlli sono documentati in DESIGN.md.

## Evidence on Hand

- App reali sull'App Store: Maestro e GymTree (URL in
  `lib/constants/contact.ts`).
- Immagini progetti in `public/images/` (galileo, gymtree, hexa) e foto
  profilo.
- CV: versioni pubbliche skeletal in `public/resume/`, versioni complete
  cifrate in `private/resume/` (+ sorgenti LaTeX).
- Profili: GitHub (matteodante), LinkedIn, Instagram.
- Esperienze nel CV: Pilatus Aircraft, DonTouch, Hexa Credit Care e
  Galileo SpA. L’utente ha confermato anche PiùUDITO, Fastweb e Sorgenia
  per la sezione “Chi ho aiutato”. Loghi ufficiali e asset dei progetti
  sono in `public/landing-v2/brands/`, con provenienza documentata.
- GymTree, Maestro e claude-local-docs sono prodotti personali e vengono
  indicati come tali. Non presentarli come clienti esterni.
- Il titolare ha confermato di aver realizzato per l'azienda PiùUDITO
  `piuudito.it`, `piuuditogroup.it` e `fabiotomassetti.it`.
  Sono tre siti per lo stesso cliente, il primo caso da sviluppare per
  il servizio siti web.
  Non sono disponibili risultati economici o di acquisizione misurati.
- Nessuna testimonianza, case study scritto o metrica di conversione
  confermata: non fabbricarne. Il caso PiùUDITO è implementato in IT/EN nella repo e presenta
  i tre siti come lavoro per un solo cliente. Non è una prova di risultati
  SEO o commerciali.

## Owner refinement — initial commercial growth

Confirmed 2026-09-09:

- Websites are the initial commercial priority; app/software and AI
  have dedicated commercial pages, as subsequently requested by the owner.
- Priority audiences: professionals, startups and small businesses in
  Italy and Ticino. Larger and international opportunities remain welcome.
- Acquisition budget is small; prioritize word of mouth and organic search.
  No numeric advertising budget or acquisition target has been agreed.
- The owner says this commercial activity is just starting. Existing
  projects are the available evidence; do not invent additional clients,
  historical leads or testimonials, or describe him as new to engineering.
- The owner reports no established search/analytics measurement setup.
  Vercel Analytics and Speed Insights are mounted in code; account setup,
  collected data and conversion instrumentation still need verification.
- The proposed scope of the 300 € offer and the suggested 1,000–2,000 €
  project range are recommendations, not confirmed public offer terms.

## Product Principles

1. **Il sito è la dimostrazione**: ogni superficie deve reggere come
   prova delle capacità dichiarate (engineering e craft).
2. **Un interlocutore, tre mestieri**: siti, app, AI presentati come
   un'unica offerta coerente, mai come servizi scollegati.
3. **Gioco al servizio della conversione**: la parte ludica (cockpit,
   decollo) porta sempre a contatto o CV, mai fine a sé stessa.
4. **Verità in produzione**: niente claim, numeri o prove inventate;
   solo ciò che esiste (app pubblicate, codice, CV).
5. **Due lingue, stessa qualità**: EN e IT sono entrambe prima classe,
   in copy e SEO.

## Accessibility & Inclusion

Nessun requisito normativo specifico stabilito. Prassi già in essere da
preservare: `prefers-reduced-motion` onorato globalmente, focus states
visibili, contenuti significativi e link server-rendered e utilizzabili
anche senza animazioni o JavaScript.

## Owner refinement — booking and cockpit navigation

Confirmed destination: `https://cal.com/matteo-dante`. The hero CV action
is a dark squared button. The cockpit avatar returns to the localized
homepage before and during the game. The owner requested the original
orange extruded 3D name in the scene; shared UI fonts remain unchanged.

## Owner refinement — services and work relationships

Replace the second hero chapter “Dall’idea. Al lancio.” with “Chi ho
aiutato” below services. On 2026-09-09 the owner rejected the orbital
carousel and confirmed a compact, elegant wall: three slow automatic
rows moving right, left, right, with repeated marks allowed. The wall
stays in native vertical flow, with no scroll-driven rail or tall sticky
stage. Pause, reduced motion and no JavaScript expose the same ten real
relationships in a complete static grid. The existing space identity,
hero and Work film sequence remain. No award, partnership or conversion
improvement is implied by the treatment.
The owner subsequently requested gentle acceleration during native
vertical scrolling, settling back to the slow automatic baseline while
preserving the compact wall and its row directions.

## Owner refinement — cinematic identity transformation

The owner requested a striking first-load hero: Matteo and his astronaut
alter ego in matching, convincing AI-generated poses, alternating through
a realistic film-inspired glitch every five seconds. Implementation may
use shaders or media; no particular technical approach was prescribed.
The owner explicitly requested visual judgment and iteration, then commit
and push of all accumulated changes. Contact copy and usable static
fallbacks remain part of the landing's purpose.
