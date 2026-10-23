/**
 * The site's own analytics address (/ingest, app/ingest): the browser sends PostHog's events
 * here and the server passes them on to PostHog's EU ingestion. Only the event paths, only a few
 * headers (never the visitor's cookies, which carry the course sign-in session), a bounded body, a
 * bounded number of requests per address, only events for this site's own project (read, checked
 * and passed on as read), and only when the analytics are configured (lib/analytics/posthog.ts).
 * Ported from DroneClean (matteodante/droneclean, apps/web/src/lib/ingest.ts).
 */
import { Buffer } from 'node:buffer'
import { gunzipSync } from 'node:zlib'

export const POSTHOG_INGEST = 'https://eu.i.posthog.com'

/** The path posthog-js sends events to (lib/analytics asks without the trailing slash). */
const EVENT_PATHS = new Set(['e'])
/**
 * Far above a real batch of events: an event is a few kB before compression, and a page sends a
 * few at a time (a beacon, when it closes, holds at most 64 kB). Small on purpose: the body is
 * unpacked and read on the server's one thread, which also serves the site and the API.
 */
export const MAX_INGEST_BYTES = 256_000
export const MAX_UNPACKED_BYTES = 256_000
/** Events in one request, and objects and lists in all of them (an event has a few of each). */
export const MAX_EVENTS = 100
const MAX_NESTING = 2_000
/** How long a browser may take to send its events, then how long PostHog may take to answer. */
export const READ_TIMEOUT_MS = 10_000
const TIMEOUT_MS = 10_000
/**
 * Requests per visitor address and minute: a visit sends a batch every few seconds at most, so
 * this is far above a person (and above a few people behind one address), and it stops a script
 * from filling the PostHog project or the server's memory. Counted in this server's memory only.
 */
export const MAX_INGEST_PER_MINUTE = 120
const WINDOW_MS = 60_000
const MAX_TRACKED_ADDRESSES = 10_000
const windows = new Map<string, { start: number; count: number }>()

/** Whether this address may send one more request now (and counts it). */
export function allowIngest(address: string, now = Date.now()): boolean {
  let entry = windows.get(address)
  if (!entry || now - entry.start >= WINDOW_MS) {
    if (!entry && windows.size >= MAX_TRACKED_ADDRESSES) {
      for (const [key, value] of windows)
        if (now - value.start >= WINDOW_MS) windows.delete(key)
      // Still full: too many addresses at once (an attack, not visitors). New ones wait; the
      // counts already running stay, so no address gets its limit back early.
      if (windows.size >= MAX_TRACKED_ADDRESSES) return false
    }
    entry = { start: now, count: 0 }
    windows.set(address, entry)
  }
  entry.count += 1
  return entry.count <= MAX_INGEST_PER_MINUTE
}

/**
 * The events of a body, checked, as the JSON passed on to PostHog, or null when the body is not
 * what posthog-js sends for this site's own project (`projectKey`). posthog-js writes gzip (its
 * usual form), `data=` with base64 (sendBeacon, when a page closes; `compression=base64`) or plain
 * JSON: `{ api_key, batch, sent_at }` (what it sends today, checked 12 Oct 2026), a list of events
 * or one, each event with its project key in `properties.token`. Anything else
 * is refused (another encoding, another field, a key elsewhere or another key), and only the
 * events read here are passed on, never the bytes received, so what PostHog reads is what was
 * checked. The size, the number of events and the nesting are bounded before the JSON is read.
 */
export function checkedEvents(
  body: Uint8Array,
  projectKey: string,
  contentEncoding: string | null,
  compression: string | null
): string | null {
  if (!projectKey) return null
  if (contentEncoding !== null && contentEncoding !== 'gzip') return null
  if (
    compression !== null &&
    compression !== 'gzip-js' &&
    compression !== 'base64'
  )
    return null
  try {
    const gzip =
      (body[0] === 0x1f && body[1] === 0x8b) || contentEncoding === 'gzip'
    const bytes = gzip
      ? gunzipSync(body, { maxOutputLength: MAX_UNPACKED_BYTES })
      : body
    if (bytes.byteLength > MAX_UNPACKED_BYTES) return null
    let text = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    if (compression === 'base64' || text.startsWith('data=')) {
      const form = new URLSearchParams(text)
      const fields = [...form.keys()]
      if (fields.length !== 1 || fields[0] !== 'data') return null
      const packed = Buffer.from(form.get('data') ?? '', 'base64')
      if (packed.byteLength > MAX_UNPACKED_BYTES) return null
      text = new TextDecoder('utf-8', { fatal: true }).decode(packed)
    }
    let nesting = 0
    for (let index = 0; index < text.length; index += 1) {
      const code = text.charCodeAt(index)
      if ((code === 0x7b || code === 0x5b) && ++nesting > MAX_NESTING)
        return null // { [
    }
    const value: unknown = JSON.parse(text)
    let events: unknown[]
    let sentAt: string | undefined
    if (isRecord(value) && 'batch' in value) {
      const { api_key: key, batch, sent_at: sent, ...rest } = value
      if (
        Object.keys(rest).length > 0 ||
        key !== projectKey ||
        !Array.isArray(batch)
      )
        return null
      if (sent !== undefined && typeof sent !== 'string') return null
      events = batch
      sentAt = sent
    } else {
      events = Array.isArray(value) ? value : [value]
    }
    if (events.length === 0 || events.length > MAX_EVENTS) return null
    for (const event of events) {
      if (!isRecord(event) || typeof event.event !== 'string') return null
      if ('api_key' in event || 'token' in event || 'batch' in event)
        return null
      if (!isRecord(event.properties) || event.properties.token !== projectKey)
        return null
    }
    return JSON.stringify({
      api_key: projectKey,
      batch: events,
      ...(sentAt ? { sent_at: sentAt } : {}),
    })
  } catch {
    return null
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Forgets the counts (tests). */
export function resetIngestLimits() {
  windows.clear()
}

/**
 * The request's body, read as it arrives: no more than `MAX_INGEST_BYTES` (a body without a length,
 * sent in chunks, is cut off as soon as it passes it) and no longer than `READ_TIMEOUT_MS`.
 */
async function readBody(
  request: Request
): Promise<Uint8Array<ArrayBuffer> | 413 | 408> {
  if (!request.body) return new Uint8Array(new ArrayBuffer(0))
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  let timedOut = false
  const timer = setTimeout(() => {
    timedOut = true
    void reader.cancel().catch(() => undefined)
  }, READ_TIMEOUT_MS)
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > MAX_INGEST_BYTES) {
        void reader.cancel().catch(() => undefined)
        return 413
      }
      chunks.push(value)
    }
  } catch {
    return 408
  } finally {
    clearTimeout(timer)
  }
  if (timedOut) return 408
  const body = new Uint8Array(new ArrayBuffer(size))
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }
  return body
}

/** Where an /ingest request goes at PostHog, or null for a path that is not an event path. */
export function ingestTarget(
  path: readonly string[],
  search: string
): URL | null {
  const joined = path.join('/')
  if (!EVENT_PATHS.has(joined)) return null
  return new URL(`${POSTHOG_INGEST}/${joined}/${search}`)
}

/**
 * The visitor's address as Railway's edge saw it: first in X-Forwarded-For, which the edge writes
 * itself, whatever a client sends (checked on DroneClean, 9 Oct 2026). PostHog turns it into a
 * country and city; the limit above counts by it.
 */
export function visitorIp(headers: Headers): string | null {
  const first = headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? ''
  return /^[0-9a-f.:]{3,45}$/i.test(first) ? first : null
}

/**
 * `projectKey`: this site's own PostHog key (empty: no analytics). Only events for it are passed
 * on, so /ingest cannot be used to send events to another PostHog project.
 */
export async function forwardToPostHog(
  request: Request,
  path: readonly string[],
  projectKey: string
): Promise<Response> {
  const url = new URL(request.url)
  const compression = url.searchParams.get('compression')
  // What is passed on is plain JSON (`checkedEvents`): no compression to announce.
  url.searchParams.delete('compression')
  const target = projectKey ? ingestTarget(path, url.search) : null
  if (!target) return new Response(null, { status: 404 })
  if (Number(request.headers.get('content-length') ?? 0) > MAX_INGEST_BYTES) {
    return new Response(null, { status: 413 })
  }
  const ip = visitorIp(request.headers)
  if (!allowIngest(ip ?? 'unknown')) {
    return new Response(null, { status: 429, headers: { 'retry-after': '60' } })
  }
  const body = await readBody(request)
  if (typeof body === 'number') return new Response(null, { status: body })
  const events = checkedEvents(
    body,
    projectKey,
    request.headers.get('content-encoding'),
    compression
  )
  if (events === null) return new Response(null, { status: 400 })

  // Only what PostHog needs: never the visitor's cookies or anything else they sent.
  const headers = new Headers({ 'content-type': 'application/json' })
  const agent = request.headers.get('user-agent')
  if (agent) headers.set('user-agent', agent)
  if (ip) headers.set('x-forwarded-for', ip)

  try {
    const answer = await fetch(target, {
      method: 'POST',
      headers,
      body: events,
      redirect: 'manual',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    return new Response(await answer.arrayBuffer(), {
      status: answer.status,
      headers: {
        'content-type':
          answer.headers.get('content-type') ?? 'application/json',
        'cache-control': 'no-store',
      },
    })
  } catch {
    return new Response(null, { status: 502 })
  }
}
