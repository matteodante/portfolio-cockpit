/**
 * The courses database (Postgres on Railway). Better Auth's four tables, then
 * courses, lessons, who can see which course, lesson progress and the pilot
 * applications sent from the courses page.
 *
 * After a change here: `bun run db:generate` writes the SQL migration into
 * drizzle/; `bun run db:migrate` (Railway's pre-deploy command) applies it.
 */
import { sql } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

const at = (name: string) => timestamp(name, { withTimezone: true })
const createdAt = () => at('created_at').notNull().defaultNow()
const updatedAt = () =>
  at('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
const uuidKey = () => uuid('id').primaryKey().default(sql`gen_random_uuid()`)

// Better Auth 1.7 (ids generated as UUIDs). The TypeScript keys are the field
// names its Drizzle adapter expects.

export const user = pgTable('user', {
  id: uuidKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})

export const session = pgTable(
  'session',
  {
    id: uuidKey(),
    expiresAt: at('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (t) => [index('session_user_id_idx').on(t.userId)]
)

export const account = pgTable(
  'account',
  {
    id: uuidKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: at('access_token_expires_at'),
    refreshTokenExpiresAt: at('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index('account_user_id_idx').on(t.userId)]
)

export const verification = pgTable(
  'verification',
  {
    id: uuidKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: at('expires_at').notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index('verification_identifier_idx').on(t.identifier)]
)

/**
 * `free`: every signed-in account sees it. `assigned`: only the accounts
 * Matteo enrols (a paid course, a 1:1 student's recordings).
 */
export const COURSE_ACCESS = ['free', 'assigned'] as const
export type CourseAccess = (typeof COURSE_ACCESS)[number]

/** A course is taught in one language; the site around it stays bilingual. */
export const COURSE_LANGUAGES = ['it', 'en'] as const

export const courses = pgTable('courses', {
  id: uuidKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  summary: text('summary').notNull().default(''),
  language: text('language', { enum: COURSE_LANGUAGES })
    .notNull()
    .default('it'),
  access: text('access', { enum: COURSE_ACCESS }).notNull().default('assigned'),
  published: boolean('published').notNull().default(false),
  position: integer('position').notNull().default(0),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})

/** A lesson: Markdown notes and, optionally, a recording in the bucket. */
export const lessons = pgTable(
  'lessons',
  {
    id: uuidKey(),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    body: text('body').notNull().default(''),
    /** The recording's object key in the bucket (lessons/<id>/<file>). */
    videoKey: text('video_key'),
    published: boolean('published').notNull().default(false),
    position: integer('position').notNull().default(0),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex('lessons_course_slug_idx').on(t.courseId, t.slug)]
)

/** Who can see an `assigned` course. */
export const enrollments = pgTable(
  'enrollments',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    createdAt: createdAt(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.courseId] }),
    index('enrollments_course_idx').on(t.courseId),
  ]
)

export const lessonProgress = pgTable(
  'lesson_progress',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    lessonId: uuid('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    completedAt: at('completed_at').notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonId] })]
)

export const APPLICATION_STATUSES = ['new', 'accepted', 'declined'] as const
export const APPLICATION_TOPICS = ['ai-dev', 'ai-work', 'unsure'] as const
export const APPLICATION_FORMATS = ['one-to-one', 'group', 'either'] as const
export const APPLICATION_LEVELS = ['beginner', 'some', 'developer'] as const

/** A pilot-place request from the courses page. Matteo reads them in /admin. */
export const applications = pgTable(
  'applications',
  {
    id: uuidKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    topic: text('topic', { enum: APPLICATION_TOPICS }).notNull(),
    format: text('format', { enum: APPLICATION_FORMATS }).notNull(),
    level: text('level', { enum: APPLICATION_LEVELS }).notNull(),
    goal: text('goal').notNull(),
    locale: text('locale', { enum: COURSE_LANGUAGES }).notNull(),
    status: text('status', { enum: APPLICATION_STATUSES })
      .notNull()
      .default('new'),
    createdAt: createdAt(),
  },
  (t) => [index('applications_created_idx').on(t.createdAt)]
)
