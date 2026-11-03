/**
 * Applies the course database migrations (drizzle/). Railway runs it before
 * each deploy (`bun run db:migrate`); without DATABASE_URL it does nothing.
 */
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'

const url = process.env.DATABASE_URL
if (!url) {
  console.log('DATABASE_URL is not set: no migrations to apply.')
  process.exit(0)
}
const pool = new Pool({ connectionString: url, max: 1 })
await migrate(drizzle(pool), { migrationsFolder: 'drizzle' })
await pool.end()
console.log('Course database migrations applied.')
