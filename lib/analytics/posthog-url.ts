/**
 * What PostHog keeps of an address: its origin and path only. Query strings and fragments can carry
 * a checkout session, a creator's code, Google's sign-in answer or a search on another site; the
 * campaign tags (utm_*) are read into their own properties before this runs.
 */
export function bareUrl(value: unknown): unknown {
  if (typeof value !== 'string' || value === '' || value === '$direct')
    return value
  try {
    const url = new URL(value)
    return `${url.origin}${url.pathname}`
  } catch {
    return null
  }
}

/**
 * The properties that hold a whole address: $current_url, $referrer and their $initial_,
 * $session_entry_ and $prev_pageview_ forms, in the event itself and in $set / $set_once.
 */
const URL_PROPERTY = /(?:_url|referrer)$/

type Properties = Record<string, unknown>

function strip(properties: Properties | undefined) {
  if (!properties) return
  for (const key of Object.keys(properties)) {
    if (URL_PROPERTY.test(key)) properties[key] = bareUrl(properties[key])
  }
}

/** PostHog's `before_send`: every address in the event, bare. */
export function stripEventUrls<
  T extends {
    properties?: Properties
    $set?: Properties
    $set_once?: Properties
  },
>(event: T | null): T | null {
  if (!event) return event
  strip(event.properties)
  strip(event.$set)
  strip(event.$set_once)
  strip(event.properties?.$set as Properties | undefined)
  strip(event.properties?.$set_once as Properties | undefined)
  return event
}
