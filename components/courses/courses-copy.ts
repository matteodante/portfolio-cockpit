import { EMAIL } from '@/lib/constants/contact'
import type { Locale } from '@/lib/i18n/config'

/**
 * Courses page copy. Offer terms confirmed by Matteo on 2026-10-23: 1:1 and
 * small-group courses, AI for developers and AI for work, free pilot places in
 * exchange for honest feedback (a public review is optional, never a
 * condition), recordings in the course area. No prices after the pilot, group
 * sizes, durations, number of places or results are confirmed: keep them out.
 */
export const COURSES_COPY = {
  it: {
    skip: 'Vai al contenuto',
    nav: 'Navigazione corsi',
    home: 'Home',
    crumb: 'Corsi',
    signIn: 'Area corsi',
    calendar: 'Prenota una call',
    calendarShort: 'Prenota',
    hero: 'Impara l’AI con chi la porta in produzione.',
    intro:
      'Corsi dal vivo, uno a uno o in piccoli gruppi. I primi posti sono gratuiti: compila il pass e ti rispondo via email.',
    pass: {
      label: 'Candidatura al posto pilota',
      title: 'Posto pilota',
      price: 'Gratuito',
      code: 'MD · AI · PILOTA',
      stub: [
        ['Dove', 'Online'],
        ['Costo', '0 €'],
        ['In cambio', 'Feedback onesto'],
      ],
      name: 'Nome',
      email: 'Email',
      topic: 'Percorso',
      topics: [
        ['ai-dev', 'AI per sviluppatori'],
        ['ai-work', 'AI per il lavoro'],
        ['unsure', 'Non so ancora'],
      ],
      format: 'Formato',
      formats: [
        ['one-to-one', 'Uno a uno'],
        ['group', 'Piccolo gruppo'],
        ['either', 'Indifferente'],
      ],
      level: 'Livello',
      levels: [
        ['beginner', 'Parto da zero'],
        ['some', 'Uso già un po’ l’AI'],
        ['developer', 'Sono uno sviluppatore'],
      ],
      goal: 'Cosa vuoi saper fare alla fine?',
      goalPlaceholder: 'Es. creare un assistente per i preventivi',
      consent: `Uso questi dati solo per rispondere. Puoi chiederne la cancellazione a ${EMAIL}.`,
      submit: 'Candidati gratis',
      sending: 'Invio…',
      sentTitle: 'Sei in lista.',
      sentBody:
        'Ho ricevuto la candidatura. Ti rispondo via email per fissare una breve call.',
      sentStamp: 'Ricevuto',
      invalid: 'Controlla i campi evidenziati e riprova.',
      limited: 'Troppi invii ravvicinati. Riprova tra qualche minuto.',
      failed: 'Non sono riuscito a salvare la candidatura. Riprova o scrivimi:',
      unavailable: 'Il modulo non è ancora attivo. Scrivimi:',
    },
    fitTitle: 'Fa per me?',
    fit: [
      [
        'Sviluppatori junior',
        'Vuoi lavorare con gli agenti di coding e portare l’AI nelle tue app.',
      ],
      [
        'Professionisti e PMI',
        'Vuoi usare l’AI nel tuo lavoro, senza scrivere codice.',
      ],
      ['Principianti', 'Parti da zero: scegliamo insieme percorso e ritmo.'],
    ],
    learnTitle: 'Cosa imparo?',
    tracks: [
      {
        id: 'ai-dev',
        title: 'AI per sviluppatori',
        audience: 'Per sviluppatori junior e per chi inizia a programmare.',
        items: [
          'Lavorare con agenti di coding come Claude Code e Codex',
          'Dal prototipo all’app pubblicata, con Next.js e React Native',
          'LLM nelle applicazioni: RAG, strumenti e valutazioni',
          'Portare l’AI in produzione senza sorprese',
        ],
      },
      {
        id: 'ai-work',
        title: 'AI per il lavoro',
        audience: 'Per professionisti, PMI e principianti. Niente codice.',
        items: [
          'Usare ChatGPT, Claude e strumenti simili con metodo',
          'Assistenti che rispondono sui documenti della tua attività',
          'Automazioni per email, preventivi e attività ripetitive',
          'Capire limiti, costi e privacy prima di adottare l’AI',
        ],
      },
    ],
    freeTitle: 'Davvero gratis?',
    freeBody:
      'Sì. Sto avviando i corsi e voglio costruirli con i primi studenti, quindi alcuni posti sono gratuiti. In cambio ti chiedo un feedback onesto alla fine: cosa ha funzionato e cosa no.',
    freePoints: [
      ['Posto pilota', 'Gratis, nessun pagamento richiesto.'],
      [
        'Feedback',
        'Onesto, anche solo privato. Una recensione pubblica è facoltativa e non deve essere positiva.',
      ],
      ['Dopo il pilota', 'Prezzo su richiesta, concordato prima di iniziare.'],
    ],
    howTitle: 'Come funziona?',
    process: [
      ['Candidatura', 'Compili il pass: due minuti.'],
      [
        'Call conoscitiva',
        'Una breve chiamata per capire se il corso fa per te.',
      ],
      ['Lezioni dal vivo', 'Online, con esercizi sul tuo caso reale.'],
      ['Area corsi', 'Registrazioni e materiali nel tuo account.'],
      ['Feedback', 'Mi dici com’è andata, così i corsi migliorano.'],
    ],
    areaTitle: 'Le lezioni restano?',
    areaBody:
      'Sì, nella tua area corsi. Entri con Google e trovi i corsi gratuiti aperti a tutti e quelli che ti assegno, con appunti e avanzamento. Registro una lezione solo se tutti i partecipanti sono d’accordo.',
    areaCta: 'Entra nell’area corsi',
    areaPreview:
      'Esempio illustrativo dell’area corsi: titoli e contenuti dei corsi reali possono cambiare.',
    areaMock: {
      title: 'I tuoi corsi',
      lesson: 'Lezione 3 · Agenti di coding nel tuo progetto',
      rows: ['Registrazione', 'Appunti', 'Completata'],
    },
    teacherTitle: 'Chi insegna?',
    teacherBody: [
      'Io, Matteo Dante: software engineer con oltre otto anni su prodotti in produzione. Ho pubblicato sull’App Store Maestro e GymTree, due app con funzioni AI, e lavoro ogni giorno con agenti di coding come Claude Code e Codex.',
      'Nei corsi porto quello che uso nei progetti: strumenti reali, errori reali e il modo per evitarli.',
    ],
    teacherLinks: [
      ['Automazioni AI per aziende', 'ai'],
      ['Gioca al mio CV', 'cockpit'],
    ],
    faqTitle: 'Altre domande',
    faqs: [
      [
        'Devo saper programmare?',
        'Solo per il percorso sviluppatori, e anche lì va bene se sei all’inizio. AI per il lavoro non richiede codice.',
      ],
      [
        'Dove si svolgono le lezioni?',
        'Online, in videochiamata, in italiano o in inglese.',
      ],
      [
        'Come scegli chi entra nel pilota?',
        'Leggo ogni candidatura e scelgo in base al percorso e alla mia disponibilità. Rispondo a tutti.',
      ],
      [
        'Come entro nell’area corsi?',
        'Con il tuo account Google. I corsi gratuiti sono subito visibili; quelli del tuo percorso te li assegno io.',
      ],
    ],
    closeTitle: 'Preferisci parlarne prima?',
    closeBody:
      'Prenota una breve call o scrivimi: ti dico se il corso fa per te.',
    backToPass: 'Torna al pass',
    book: 'Prenota una call',
    email: 'Scrivimi via email',
    close: 'Chiudi',
    fallback: 'Apri Cal.com in una nuova scheda',
    footerCockpit: 'Gioca al mio CV',
  },
  en: {
    skip: 'Skip to content',
    nav: 'Courses navigation',
    home: 'Home',
    crumb: 'Courses',
    signIn: 'Course area',
    calendar: 'Book a call',
    calendarShort: 'Book',
    hero: 'Learn AI from someone who ships it.',
    intro:
      'Live courses, one-to-one or in small groups. The first places are free: fill in the pass and I will reply by email.',
    pass: {
      label: 'Pilot place application',
      title: 'Pilot place',
      price: 'Free',
      code: 'MD · AI · PILOT',
      stub: [
        ['Where', 'Online'],
        ['Cost', '€0'],
        ['In return', 'Honest feedback'],
      ],
      name: 'Name',
      email: 'Email',
      topic: 'Track',
      topics: [
        ['ai-dev', 'AI for developers'],
        ['ai-work', 'AI for work'],
        ['unsure', 'Not sure yet'],
      ],
      format: 'Format',
      formats: [
        ['one-to-one', 'One-to-one'],
        ['group', 'Small group'],
        ['either', 'Either'],
      ],
      level: 'Level',
      levels: [
        ['beginner', 'Starting from zero'],
        ['some', 'I already use AI a bit'],
        ['developer', 'I am a developer'],
      ],
      goal: 'What do you want to be able to do?',
      goalPlaceholder: 'E.g. build an assistant for my quotes',
      consent: `I use these details only to reply. You can ask me to delete them at ${EMAIL}.`,
      submit: 'Apply for free',
      sending: 'Sending…',
      sentTitle: 'You are on the list.',
      sentBody:
        'I received your application. I will reply by email to set up a short call.',
      sentStamp: 'Received',
      invalid: 'Check the highlighted fields and try again.',
      limited: 'Too many attempts. Try again in a few minutes.',
      failed: 'I could not save the application. Try again or email me:',
      unavailable: 'The form is not active yet. Email me:',
    },
    fitTitle: 'Is it for me?',
    fit: [
      [
        'Junior developers',
        'You want to work with coding agents and bring AI into your apps.',
      ],
      [
        'Professionals and small businesses',
        'You want to use AI in your work, without writing code.',
      ],
      ['Beginners', 'Starting from zero: we choose track and pace together.'],
    ],
    learnTitle: 'What will I learn?',
    tracks: [
      {
        id: 'ai-dev',
        title: 'AI for developers',
        audience: 'For junior developers and people starting to code.',
        items: [
          'Working with coding agents such as Claude Code and Codex',
          'From prototype to a published app, with Next.js and React Native',
          'LLMs inside applications: RAG, tools and evaluations',
          'Taking AI to production without surprises',
        ],
      },
      {
        id: 'ai-work',
        title: 'AI for work',
        audience: 'For professionals, small businesses and beginners. No code.',
        items: [
          'Using ChatGPT, Claude and similar tools with a method',
          'Assistants that answer from your own business documents',
          'Automations for email, quotes and repetitive tasks',
          'Understanding limits, costs and privacy before adopting AI',
        ],
      },
    ],
    freeTitle: 'Is it really free?',
    freeBody:
      'Yes. I am starting the courses and want to shape them with the first students, so some places are free. In return I ask for honest feedback at the end: what worked and what did not.',
    freePoints: [
      ['Pilot place', 'Free, no payment asked.'],
      [
        'Feedback',
        'Honest, private is fine. A public review is optional and does not have to be positive.',
      ],
      ['After the pilot', 'Price on request, agreed before we start.'],
    ],
    howTitle: 'How does it work?',
    process: [
      ['Application', 'Fill in the pass: two minutes.'],
      ['Intro call', 'A short call to check the course fits you.'],
      ['Live lessons', 'Online, with exercises on your real case.'],
      ['Course area', 'Recordings and materials in your account.'],
      ['Feedback', 'Tell me how it went, so the courses get better.'],
    ],
    areaTitle: 'Do the lessons stay?',
    areaBody:
      'Yes, in your course area. Sign in with Google to find the free courses open to everyone and the ones I assign to you, with notes and progress. I record a lesson only if every participant agrees.',
    areaCta: 'Open the course area',
    areaPreview:
      'Illustrative example of the course area: real course titles and content may differ.',
    areaMock: {
      title: 'Your courses',
      lesson: 'Lesson 3 · Coding agents in your project',
      rows: ['Recording', 'Notes', 'Completed'],
    },
    teacherTitle: 'Who teaches?',
    teacherBody: [
      'Me, Matteo Dante: a software engineer with more than eight years on production products. I published Maestro and GymTree on the App Store, two apps with AI features, and I work every day with coding agents such as Claude Code and Codex.',
      'The courses bring what I use in real projects: real tools, real mistakes and how to avoid them.',
    ],
    teacherLinks: [
      ['AI automation for businesses', 'ai'],
      ['Play my CV', 'cockpit'],
    ],
    faqTitle: 'More questions',
    faqs: [
      [
        'Do I need to code?',
        'Only for the developer track, and being a beginner is fine there too. AI for work needs no code.',
      ],
      [
        'Where do lessons happen?',
        'Online, over video call, in English or Italian.',
      ],
      [
        'How do you choose pilot students?',
        'I read every application and choose by track and my availability. I reply to everyone.',
      ],
      [
        'How do I enter the course area?',
        'With your Google account. Free courses are visible straight away; I assign the ones for your track.',
      ],
    ],
    closeTitle: 'Rather talk first?',
    closeBody:
      'Book a short call or email me: I will tell you if the course fits.',
    backToPass: 'Back to the pass',
    book: 'Book a call',
    email: 'Email me',
    close: 'Close',
    fallback: 'Open Cal.com in a new tab',
    footerCockpit: 'Play my CV',
  },
} as const satisfies Record<Locale, unknown>

export type CoursesCopy = (typeof COURSES_COPY)[Locale]
