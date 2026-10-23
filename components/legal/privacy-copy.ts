import { EMAIL } from '@/lib/constants/contact'
import type { Locale } from '@/lib/i18n/config'

/**
 * The privacy policy, written from what the code actually does: hosting and
 * rate limits, the chat, the CV unlock, course applications and accounts,
 * recordings, and analytics after consent. Change it together with the data
 * flows it describes.
 */
export type PrivacySection = { heading: string; body: readonly string[] }

export type PrivacyCopy = {
  metaTitle: string
  metaDescription: string
  skip: string
  home: string
  nav: string
  title: string
  updated: string
  intro: string
  sections: readonly PrivacySection[]
}

export const PRIVACY_UPDATED = '2026-10-23'

export const PRIVACY_COPY: Record<Locale, PrivacyCopy> = {
  it: {
    metaTitle: 'Privacy · Matteo Dante',
    metaDescription:
      'Quali dati tratta matteodante.it, perché, con quali fornitori e come chiederne copia o cancellazione.',
    skip: 'Vai al contenuto',
    home: 'Home',
    nav: 'Navigazione',
    title: 'Privacy',
    updated: 'Aggiornata il 23 ottobre 2026',
    intro:
      'Questa pagina spiega quali dati personali tratta matteodante.it, perché, con quali fornitori e come puoi chiederne copia o cancellazione.',
    sections: [
      {
        heading: 'Chi tratta i dati',
        body: [
          `Il titolare del trattamento è Matteo Dante. Per qualsiasi domanda o richiesta sulla privacy scrivi a ${EMAIL}.`,
        ],
      },
      {
        heading: 'Visitare il sito',
        body: [
          'Il sito è ospitato da Railway in un data center nell’Unione europea (Paesi Bassi). Per consegnare le pagine e proteggere il servizio, i server ricevono dati tecnici come indirizzo IP, browser e pagina richiesta.',
          'Per limitare gli abusi, l’indirizzo IP di chi usa la chat, lo sblocco del CV o il modulo dei corsi viene contato per pochi minuti in un archivio temporaneo (Upstash Redis). Base giuridica: legittimo interesse alla sicurezza del sito.',
        ],
      },
      {
        heading: 'Chat del cockpit',
        body: [
          'Quando invii un messaggio nella chat, il testo viene inviato a OpenAI per generare la risposta e per il controllo dei contenuti. Il sito non salva le conversazioni né sul server né sul tuo dispositivo. OpenAI può conservare i dati secondo le proprie condizioni per le API. Non scrivere dati personali nella chat.',
        ],
      },
      {
        heading: 'CV dettagliato',
        body: [
          'Se inserisci il codice di accesso, il sito salva un cookie tecnico firmato (cv_access) per 30 giorni, così non devi reinserirlo. Non contiene dati personali.',
        ],
      },
      {
        heading: 'Candidature ai corsi',
        body: [
          'Il modulo della pagina corsi raccoglie nome, email, argomento, formato, livello, obiettivo e lingua. Uso questi dati solo per risponderti e organizzare i corsi pilota. Base giuridica: la tua richiesta (misure precontrattuali). Restano nel database del sito finché servono a questo scopo o finché non chiedi di cancellarli.',
        ],
      },
      {
        heading: 'Area corsi e accesso con Google',
        body: [
          'Se accedi all’area corsi con Google, il sito riceve da Google nome, email, immagine del profilo e l’identificativo del tuo account. Salva anche la sessione di accesso (con indirizzo IP e browser, per 60 giorni), i corsi a cui sei iscritto e le lezioni completate. Base giuridica: fornirti il servizio che hai richiesto.',
          'Le registrazioni delle lezioni si fanno solo con l’accordo di tutti i partecipanti. Sono conservate in uno spazio privato (Railway, Paesi Bassi) e visibili solo agli iscritti a quel corso tramite link temporanei.',
          'L’account resta attivo finché non chiedi di cancellarlo: alla cancellazione vengono rimossi anche iscrizioni, progressi e sessioni.',
        ],
      },
      {
        heading: 'Statistiche, solo con il tuo consenso',
        body: [
          'Se scegli “Accetta statistiche”, PostHog (server nell’Unione europea) e, se attivo, Google Analytics misurano visite e clic sui pulsanti. PostHog non registra lo schermo e non collega i dati al tuo account dei corsi. La misurazione pubblicitaria di Google è disattivata. Base giuridica: il tuo consenso, che puoi revocare in qualsiasi momento da “Preferenze cookie”.',
          'Se rifiuti, nessuno di questi strumenti viene caricato. La tua scelta resta salvata sul dispositivo per 180 giorni.',
        ],
      },
      {
        heading: 'Prenotazioni',
        body: [
          'Le chiamate si prenotano su Cal.com, che si apre solo quando scegli di prenotare. I dati che inserisci lì sono trattati da Cal.com secondo la sua informativa e poi ricevuti da me per la chiamata.',
        ],
      },
      {
        heading: 'Fornitori e trasferimenti',
        body: [
          'I fornitori sono Railway (hosting e database), Upstash (limiti di utilizzo), OpenAI (chat), Google (accesso e, con consenso, statistiche), PostHog (statistiche con consenso) e Cal.com (prenotazioni). Alcuni hanno sede negli Stati Uniti: in quel caso il trasferimento avviene con le garanzie previste dal GDPR, come le clausole contrattuali standard o il Data Privacy Framework.',
          'Non vendo i dati e non li uso per pubblicità.',
        ],
      },
      {
        heading: 'I tuoi diritti',
        body: [
          `Puoi chiedere accesso, rettifica, cancellazione, limitazione, portabilità e opporti al trattamento basato sul legittimo interesse, scrivendo a ${EMAIL}. Puoi anche presentare reclamo all’autorità di controllo del tuo Paese, per esempio il Garante per la protezione dei dati personali in Italia o l’Incaricato federale della protezione dei dati e della trasparenza in Svizzera.`,
        ],
      },
      {
        heading: 'Modifiche',
        body: [
          'Se cambio il modo in cui il sito tratta i dati, aggiorno questa pagina e la data in alto.',
        ],
      },
    ],
  },
  en: {
    metaTitle: 'Privacy · Matteo Dante',
    metaDescription:
      'What data matteodante.it processes, why, with which providers and how to ask for a copy or deletion.',
    skip: 'Skip to content',
    home: 'Home',
    nav: 'Navigation',
    title: 'Privacy',
    updated: 'Updated 23 October 2026',
    intro:
      'This page explains what personal data matteodante.it processes, why, with which providers and how you can ask for a copy or deletion.',
    sections: [
      {
        heading: 'Who processes the data',
        body: [
          `The controller is Matteo Dante. For any privacy question or request, write to ${EMAIL}.`,
        ],
      },
      {
        heading: 'Visiting the site',
        body: [
          'The site is hosted by Railway in a data centre in the European Union (the Netherlands). To deliver pages and protect the service, the servers receive technical data such as IP address, browser and requested page.',
          'To limit abuse, the IP address of anyone using the chat, the CV unlock or the courses form is counted for a few minutes in a temporary store (Upstash Redis). Legal basis: legitimate interest in the security of the site.',
        ],
      },
      {
        heading: 'Cockpit chat',
        body: [
          'When you send a chat message, the text goes to OpenAI to generate the reply and for content moderation. The site does not save conversations, neither on the server nor on your device. OpenAI may keep data under its own API terms. Please do not type personal data into the chat.',
        ],
      },
      {
        heading: 'Detailed CV',
        body: [
          'If you enter the access code, the site saves a signed technical cookie (cv_access) for 30 days so you do not have to type it again. It contains no personal data.',
        ],
      },
      {
        heading: 'Course applications',
        body: [
          'The form on the courses page collects name, email, topic, format, level, goal and language. I use these details only to reply and to organise the pilot courses. Legal basis: your request (pre-contractual steps). They stay in the site’s database as long as they serve this purpose or until you ask me to delete them.',
        ],
      },
      {
        heading: 'Course area and Google sign-in',
        body: [
          'If you sign in to the course area with Google, the site receives your name, email, profile picture and account identifier from Google. It also stores your sign-in session (with IP address and browser, for 60 days), the courses you are enrolled in and the lessons you completed. Legal basis: providing the service you asked for.',
          'Lessons are recorded only with every participant’s agreement. Recordings are kept in private storage (Railway, the Netherlands) and shown only to that course’s participants through temporary links.',
          'Your account stays active until you ask me to delete it; deletion also removes enrolments, progress and sessions.',
        ],
      },
      {
        heading: 'Analytics, only with your consent',
        body: [
          'If you choose “Accept analytics”, PostHog (servers in the European Union) and, when enabled, Google Analytics measure visits and button clicks. PostHog makes no screen recordings and never ties the data to your course account. Google’s advertising measurement is disabled. Legal basis: your consent, which you can withdraw at any time from “Cookie preferences”.',
          'If you reject, none of these tools loads. Your choice is saved on your device for 180 days.',
        ],
      },
      {
        heading: 'Bookings',
        body: [
          'Calls are booked on Cal.com, which opens only when you choose to book. What you enter there is processed by Cal.com under its own policy and then received by me for the call.',
        ],
      },
      {
        heading: 'Providers and transfers',
        body: [
          'The providers are Railway (hosting and database), Upstash (usage limits), OpenAI (chat), Google (sign-in and, with consent, analytics), PostHog (analytics with consent) and Cal.com (bookings). Some are based in the United States: those transfers rely on the safeguards the GDPR provides, such as standard contractual clauses or the Data Privacy Framework.',
          'I do not sell data or use it for advertising.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          `You can ask for access, rectification, deletion, restriction and portability, and object to processing based on legitimate interest, by writing to ${EMAIL}. You can also complain to the supervisory authority of your country, for example the Garante per la protezione dei dati personali in Italy or the Federal Data Protection and Information Commissioner in Switzerland.`,
        ],
      },
      {
        heading: 'Changes',
        body: [
          'If the way the site processes data changes, I update this page and the date above.',
        ],
      },
    ],
  },
}
