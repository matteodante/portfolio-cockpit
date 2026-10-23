import { defineConfig } from 'drizzle-kit'

/** Course database migrations: `bun run db:generate` after a schema change. */
export default defineConfig({
  dialect: 'postgresql',
  schema: './lib/courses/schema.ts',
  out: './drizzle',
})
