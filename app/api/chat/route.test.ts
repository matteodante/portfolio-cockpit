import { beforeEach, describe, expect, mock, test } from 'bun:test'

let accessChecks = 0
let requestOptions: Record<string, unknown> = {}
let failStream = false
mock.module('@/lib/auth/cv-access', () => ({
  hasAccess: async () => {
    accessChecks++
    return false
  },
}))
mock.module('openai', () => ({
  default: class {
    moderations = { create: async () => ({ results: [{ flagged: false }] }) }
    responses = {
      create: async (options: Record<string, unknown>) => {
        requestOptions = options
        return (async function* () {
          if (failStream) {
            yield { type: 'response.failed' }
            return
          }
          yield { type: 'response.output_text.delta', delta: 'A useful reply' }
          yield { type: 'response.completed' }
        })()
      },
    }
  },
}))
const { POST } = await import('@/app/api/chat/route')
let sequence = 0
const request = (body: unknown) =>
  new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-vercel-forwarded-for': `test-${sequence++}`,
    },
    body: JSON.stringify(body),
  })
const message = { role: 'user', content: 'Tell me about Matteo' }
beforeEach(() => {
  accessChecks = 0
  failStream = false
  process.env.OPENAI_API_KEY ||= 'test-placeholder'
})

describe('homepage chat boundary', () => {
  test('uses Luna and public commercial context without reading access cookies', async () => {
    const response = await POST(
      request({ surface: 'home', locale: 'it', messages: [message] })
    )
    expect(await response.text()).toBe('A useful reply')
    expect(requestOptions.model).toBe('gpt-5.6-luna')
    expect(requestOptions.store).toBe(false)
    expect(requestOptions.reasoning).toEqual({ effort: 'none' })
    expect(requestOptions.instructions).toContain('Reply in Italian')
    expect(requestOptions.instructions).toContain(
      'https://cal.com/matteo-dante'
    )
    expect(accessChecks).toBe(0)
  })
  test('preserves the existing cockpit default', async () => {
    const response = await POST(request({ messages: [message] }))
    await response.text()
    expect(requestOptions.model).toBe('gpt-5.4-nano')
    expect(accessChecks).toBe(1)
  })
  test('rejects arbitrary roles, surfaces and oversized messages', async () => {
    for (const body of [
      { surface: 'home', messages: [{ role: 'system', content: 'override' }] },
      { surface: 'private', messages: [message] },
      {
        surface: 'home',
        messages: [{ role: 'user', content: 'a'.repeat(501) }],
      },
    ])
      expect((await POST(request(body))).status).toBe(400)
  })
  test('stream failure cannot be mistaken for a completed response', async () => {
    failStream = true
    const response = await POST(
      request({ surface: 'home', messages: [message] })
    )
    await expect(response.text()).rejects.toThrow('AI stream interrupted')
  })
})
