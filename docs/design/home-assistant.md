# Homepage assistant and cookie choices

Implemented and locally reviewed on 2026-09-10. This is a scoped extension
of the existing homepage identity; the finish review returned SHIP after
resolving composer focus and narrow-screen send-button clipping.

## Interaction and appearance

`components/landing/home-assistant.tsx` adds an IT/EN lower-right helmet
launcher above the motion controls. On mobile, the launcher is a compact
44×44px chat icon with an accessible label; desktop retains the helmet
and visible label. The code-drawn SVG needs no raster
asset. Its 400px console uses near-black, ivory, orange, two-pixel corners,
Unbounded headings and Space Grotesk reading text. Local neutral shades
support transcript contrast without changing the shared palette.

Three starter questions introduce services and Matteo. Replies stream as
plain text into a scrollable transcript; following pauses when the visitor
scrolls back. The bottom area retains the composer and a direct booking
link to `https://cal.com/matteo-dante`. Opening and submitting focus the
composer; Escape within the panel closes it and returns focus to the
launcher. The panel is a nonmodal region. Enter sends, Shift+Enter adds a
line, and IME composition does not submit. Sending disables the send
button without removing textarea focus. Errors offer a retry and retain
the booking route.

Below 800px the open console uses the available dynamic viewport, hides
its launcher and temporarily hides the cookie panel. The transcript can
shrink and scroll while the send control retains its 44px width. The short
240ms entrance respects reduced motion and the homepage pause control.
Reading and contact elsewhere on the homepage remain independent of chat.

## Public conversation contract

`lib/ai/landing-context.ts` supplies public facts and the homepage model
`gpt-5.6-luna`, using the shared `/api/chat` route with `surface: 'home'`.
The homepage branch uses reasoning effort `none`, a 400-token output cap,
streaming and `store: false`. It never selects the private CV instructions,
even with a valid access cookie. The cockpit branch retains its existing
model and gated/public context behavior.

The prompt distinguishes the EUR 300 website starting price from a fixed
package, personal products from client work, and public career names from
private employer details. It instructs concise localized replies and one
relevant question at a time. It cannot read availability, book appointments,
send follow-up messages or confirm bookings. These are prompt boundaries,
not guarantees that a model can never make a mistake. The visible disclosure
identifies AI, OpenAI processing and the possibility of errors.

The shared hook keeps a bounded in-memory transcript, cancels on unmount,
and reports failed, empty or interrupted responses. No conversation is
persisted to browser storage. Existing request normalization, message and
total-input limits, moderation and rate limiting still apply. `store: false`
is an API setting; it is not a claim of zero provider retention.

## Cookie choices

The localized marketing-page panel now appears even without a Google
measurement ID, after a 20-second first-visit delay. Manual opening from
footer preferences is immediate, and previously saved choices suppress
automatic display. Google still requires positive consent during the delay.
That mode states that Google Analytics is inactive and
offers an acknowledgment. With an ID, reject and accept have equal visual
weight. An expandable explanation covers technical preferences, 180-day
choice persistence, OpenAI chat processing, Vercel measurements and the
user-triggered Cal.com route. Preferences can be reopened in normal footer
flow; the cockpit remains excluded from this panel.

`components/analytics/marketing-analytics.tsx` retains positive-consent
Google loading. A booking click remains intent, never a confirmed lead or
appointment. The copy describes implementation and provider behavior; this
work does not establish legal compliance or conversion uplift.

## Local QA and limits

- `bun run check`: 40 tests, 515 assertions passed. `bun run build` passed
  with the existing encrypted-path tracing warning.
- Static design detector: zero antipatterns, 44 advisories, including small
  type and local shades. React Doctor: 80; existing shared-hook `finally`
  compiler limitation plus complexity/array warnings remain.
- Browser review covered 1440×900, 390×844 and 320×568, closed/open chat,
  IT/EN, conversation, error and retry. Focus retention, Escape closure
  and the corrected send control passed. At 320px the transcript reached
  scrollTop 308 of a 308px maximum.
- Live Luna answered the Italian service question with the correct
  starting price. The English boundary check declined private Pilatus
  details and could not confirm a booking. These checks cover sampled
  replies, not exhaustive model behavior.
- With JavaScript disabled on `/it`, the page title, exact email contact
  and all three direct booking links remained available.
- A mocked 503 showed the error state; a subsequent real retry succeeded.
- With no local GA ID, necessary-only acknowledgment, preference
  persistence and zero Google Analytics scripts were verified. Configured
  GA accept/reject was not newly browser-validated in this pass.

Local screenshots are ignored artifacts under
`.impeccable/review/home-assistant/`: `desktop-closed.png`,
`desktop-open.png`, `desktop-conversation.png`, `mobile-open.png`,
`mobile-closed.png`, `mobile-320.png`, `mobile-en.png`, `mobile-error.png`
and `mobile-320-conversation.png`. No public deployment is verified by
these checks, and no new raster shipped in this extension.

## Source references

The selected model is documented in the official
[GPT-5.6 Luna model page](https://developers.openai.com/api/docs/models/gpt-5.6-luna).
Provider statements informing the Vercel explanation are the
[Web Analytics privacy documentation](https://vercel.com/docs/analytics/privacy-policy)
and [Speed Insights privacy documentation](https://vercel.com/docs/speed-insights/privacy-policy).

## Compact launcher follow-up

The mobile launcher is 44×44px with a 22px chat icon. The scroll hint
reserves space beside it. Browser checks found no cookie panel initially
or at 18 seconds; it appeared at approximately 20 seconds. Footer
preferences opened immediately, and saved choices persisted after reload.
Desktop retained its labeled launcher. Check/build passed; React Doctor
reported 92 with two existing complexity advisories and no errors.
