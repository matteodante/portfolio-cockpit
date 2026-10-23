'use client'

import Link from 'next/link'
import { useActionState, useEffect, useRef, useState } from 'react'
import type { CoursesCopy } from '@/components/courses/courses-copy'
import { trackMarketing } from '@/lib/analytics/client'
import { EMAIL, EMAIL_HREF } from '@/lib/constants/contact'
import { PRIVACY_PATHS } from '@/lib/constants/site'
import { type ApplyState, submitApplication } from '@/lib/courses/apply'
import type { Locale } from '@/lib/i18n/config'

const initial: ApplyState = { status: 'idle' }

type Option = readonly [string, string]

/**
 * The pilot-place application as a boarding pass: the form is the pass, the
 * stub carries the offer's terms. Sending tears the stub and stamps the pass.
 */
export default function PilotPass({
  copy,
  locale,
}: {
  copy: CoursesCopy['pass']
  locale: Locale
}) {
  const [state, action, pending] = useActionState(submitApplication, initial)
  const sent = state.status === 'sent'
  const invalid = new Set(state.fields)
  const values = state.values ?? {}
  const section = useRef<HTMLElement>(null)
  // The stub echoes the chosen route and class, like a printed pass.
  const [choice, setChoice] = useState({
    topic: values.topic || copy.topics[0][0],
    format: values.format || copy.formats[0][0],
  })
  const label = (options: readonly Option[], value: string) =>
    options.find(([key]) => key === value)?.[1] ?? ''

  useEffect(() => {
    if (!sent) return
    trackMarketing('application_sent', { placement: 'courses_pass' })
    section.current?.scrollIntoView({ block: 'start' })
  }, [sent])

  const chips = (name: string, legend: string, options: readonly Option[]) => (
    <fieldset className="pass-chips" aria-invalid={invalid.has(name)}>
      <legend>{legend}</legend>
      <div>
        {options.map(([value, label], index) => (
          <label key={value}>
            <input
              type="radio"
              name={name}
              value={value}
              required
              defaultChecked={
                values[name] ? values[name] === value : index === 0
              }
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )

  const problem =
    state.status === 'idle' || state.status === 'sent' ? '' : copy[state.status]
  return (
    <section
      ref={section}
      id="posto"
      className="pilot-pass"
      aria-label={copy.label}
      data-state={sent ? 'sent' : 'open'}
    >
      <div className="pass-main">
        <div className="pass-head">
          <h2>{copy.title}</h2>
          <span className="pass-price">{copy.price}</span>
        </div>
        {sent ? (
          <div className="pass-sent" role="status">
            <span className="pass-stamp" aria-hidden="true">
              {copy.sentStamp}
            </span>
            <p className="pass-sent-title">{copy.sentTitle}</p>
            <p>{copy.sentBody}</p>
          </div>
        ) : (
          <form
            key={JSON.stringify(values)}
            className="pass-form"
            action={action}
            onChange={(event) => {
              const field = event.target
              if (
                field instanceof HTMLInputElement &&
                (field.name === 'topic' || field.name === 'format')
              )
                setChoice((current) => ({
                  ...current,
                  [field.name]: field.value,
                }))
            }}
          >
            <input type="hidden" name="locale" value={locale} />
            <div className="pass-hp" aria-hidden="true">
              <label>
                Website
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>
            <div className="pass-row">
              <label className="pass-field">
                <span>{copy.name}</span>
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={120}
                  defaultValue={values.name}
                  aria-invalid={invalid.has('name')}
                />
              </label>
              <label className="pass-field">
                <span>{copy.email}</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={200}
                  defaultValue={values.email}
                  aria-invalid={invalid.has('email')}
                />
              </label>
            </div>
            {chips('topic', copy.topic, copy.topics)}
            {chips('format', copy.format, copy.formats)}
            <div className="pass-row pass-row-goal">
              <label className="pass-field">
                <span>{copy.level}</span>
                <select
                  name="level"
                  required
                  defaultValue={values.level}
                  aria-invalid={invalid.has('level')}
                >
                  {copy.levels.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="pass-field">
                <span>{copy.goal}</span>
                <input
                  name="goal"
                  required
                  maxLength={2000}
                  placeholder={copy.goalPlaceholder}
                  defaultValue={values.goal}
                  aria-invalid={invalid.has('goal')}
                />
              </label>
            </div>
            <div className="pass-submit">
              <label className="pass-consent">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  aria-invalid={invalid.has('consent')}
                />
                <span>
                  {copy.consent}{' '}
                  <Link href={PRIVACY_PATHS[locale]}>Privacy</Link>
                </span>
              </label>
              <button className="booking-link" type="submit" disabled={pending}>
                {pending ? copy.sending : copy.submit}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8h11M8.5 3.5 13 8l-4.5 4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              </button>
              <p className="pass-problem" role="alert">
                {problem}
                {state.status === 'failed' || state.status === 'unavailable' ? (
                  <>
                    {' '}
                    <Link href={EMAIL_HREF} data-track="contact_clicked">
                      {EMAIL}
                    </Link>
                  </>
                ) : null}
              </p>
            </div>
          </form>
        )}
      </div>
      <div className="pass-stub">
        <p className="pass-code">{copy.code}</p>
        <dl aria-live="polite">
          <div>
            <dt>{copy.topic}</dt>
            <dd>{label(copy.topics, choice.topic)}</dd>
          </div>
          <div>
            <dt>{copy.format}</dt>
            <dd>{label(copy.formats, choice.format)}</dd>
          </div>
          {copy.stub.map(([term, detail]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
        <svg
          className="pass-barcode"
          viewBox="0 0 120 28"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {BARS.map(([x, w]) => (
            <rect key={x} x={x} width={w} height="28" />
          ))}
        </svg>
      </div>
    </section>
  )
}

// A fixed decorative barcode: bar positions and widths along 120 units.
const BARS = [
  [0, 2],
  [4, 1],
  [7, 3],
  [12, 1],
  [15, 2],
  [19, 1],
  [22, 4],
  [28, 1],
  [31, 2],
  [35, 1],
  [38, 3],
  [43, 2],
  [47, 1],
  [50, 1],
  [53, 4],
  [59, 2],
  [63, 1],
  [66, 3],
  [71, 1],
  [74, 2],
  [78, 1],
  [81, 4],
  [87, 1],
  [90, 2],
  [94, 3],
  [99, 1],
  [102, 2],
  [106, 1],
  [109, 3],
  [114, 1],
  [117, 3],
] as const
