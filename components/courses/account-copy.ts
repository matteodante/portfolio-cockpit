import type { Locale } from '@/lib/i18n/config'

/** Student-facing course area copy. The admin pages are Italian only. */
export const ACCOUNT_COPY = {
  it: {
    title: 'Area corsi',
    signInTitle: 'Entra nell’area corsi',
    signInBody:
      'Accedi con il tuo account Google. Trovi i corsi gratuiti e quelli che ti assegno, con registrazioni, appunti e avanzamento.',
    google: 'Continua con Google',
    devSignIn: 'Accesso di sviluppo (email e password)',
    devEmail: 'Email',
    devPassword: 'Password',
    devSubmit: 'Entra',
    unavailable:
      'L’area corsi non è ancora attiva. Nel frattempo puoi candidarti a un posto pilota.',
    toCourses: 'Vai alla pagina dei corsi',
    signOut: 'Esci',
    admin: 'Gestione',
    yourCourses: (name: string) => `I tuoi corsi, ${name}`,
    emptyTitle: 'Nessun corso ancora.',
    emptyBody:
      'Quando ti assegno un corso, o ne pubblico uno gratuito, lo trovi qui. Se non ti sei ancora candidato, parti dal posto pilota.',
    apply: 'Candidati a un posto pilota',
    lessons: (n: number) => (n === 1 ? '1 lezione' : `${n} lezioni`),
    completed: (done: number, total: number) =>
      `${done} di ${total} completate`,
    free: 'Gratuito',
    assigned: 'Assegnato a te',
    draft: 'Bozza',
    back: 'Tutti i corsi',
    lessonList: 'Lezioni',
    noLessons: 'Le lezioni di questo corso arrivano a breve.',
    noVideo: 'Questa lezione non ha una registrazione.',
    markDone: 'Segna come completata',
    markUndone: 'Completata · annulla',
    next: 'Lezione successiva',
    error: 'Qualcosa non ha funzionato. Riprova.',
  },
  en: {
    title: 'Course area',
    signInTitle: 'Open the course area',
    signInBody:
      'Sign in with your Google account. You will find the free courses and the ones I assign to you, with recordings, notes and progress.',
    google: 'Continue with Google',
    devSignIn: 'Development sign-in (email and password)',
    devEmail: 'Email',
    devPassword: 'Password',
    devSubmit: 'Sign in',
    unavailable:
      'The course area is not active yet. Meanwhile you can apply for a pilot place.',
    toCourses: 'Go to the courses page',
    signOut: 'Sign out',
    admin: 'Manage',
    yourCourses: (name: string) => `Your courses, ${name}`,
    emptyTitle: 'No courses yet.',
    emptyBody:
      'When I assign you a course, or publish a free one, it appears here. If you have not applied yet, start with a pilot place.',
    apply: 'Apply for a pilot place',
    lessons: (n: number) => (n === 1 ? '1 lesson' : `${n} lessons`),
    completed: (done: number, total: number) => `${done} of ${total} completed`,
    free: 'Free',
    assigned: 'Assigned to you',
    draft: 'Draft',
    back: 'All courses',
    lessonList: 'Lessons',
    noLessons: 'The lessons of this course are coming soon.',
    noVideo: 'This lesson has no recording.',
    markDone: 'Mark as completed',
    markUndone: 'Completed · undo',
    next: 'Next lesson',
    error: 'Something went wrong. Try again.',
  },
} satisfies Record<Locale, unknown>

export type AccountCopy = (typeof ACCOUNT_COPY)[Locale]
