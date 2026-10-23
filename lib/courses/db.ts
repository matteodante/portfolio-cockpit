import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '@/lib/courses/schema'

export type Db = NodePgDatabase<typeof schema>

let db: Db | null | undefined

/**
 * The courses database, or null when DATABASE_URL is unset (a build, a
 * preview without a database): the courses page still renders and the
 * account area says it is not available yet.
 */
export function getDb(): Db | null {
  if (db !== undefined) return db
  const url = process.env.DATABASE_URL
  db = url
    ? drizzle(new Pool({ connectionString: url, max: 5 }), { schema })
    : null
  return db
}
