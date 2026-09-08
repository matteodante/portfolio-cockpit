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
  un ritratto generato. CTA diretta a Cal.com; configurazione esplicitamente
  rimandata dall’utente a una sessione successiva insieme.
- Terminologia ricorrente: decollo/takeoff, PLAY, cockpit, COMM, DOCK.

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
- Nessuna testimonianza cliente, case study scritto, metrica o logo
  cliente presente nel repo: non fabbricarne.

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
