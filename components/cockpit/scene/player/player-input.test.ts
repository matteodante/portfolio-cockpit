import { afterEach, beforeEach, expect, test } from 'bun:test'
import {
  COCKPIT_EVENT_TURN_LEFT_DOWN,
  COCKPIT_EVENT_TURN_LEFT_UP,
} from '@/components/cockpit/scene/player/player-events'
import { createInputController } from '@/components/cockpit/scene/player/player-input'

const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window')
const documentDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  'document'
)
let eventWindow: EventTarget
let canvas: EventTarget
let controller: ReturnType<typeof createInputController>

beforeEach(() => {
  eventWindow = new EventTarget()
  canvas = new EventTarget()
  Object.defineProperty(globalThis, 'window', {
    value: eventWindow,
    configurable: true,
  })
  Object.defineProperty(globalThis, 'document', {
    value: { activeElement: null },
    configurable: true,
  })
  controller = createInputController({
    onDockKey: () => undefined,
    touchTarget: canvas as HTMLElement,
  })
})

afterEach(() => {
  controller.dispose()
  if (windowDescriptor) {
    Object.defineProperty(globalThis, 'window', windowDescriptor)
  } else Reflect.deleteProperty(globalThis, 'window')
  if (documentDescriptor) {
    Object.defineProperty(globalThis, 'document', documentDescriptor)
  } else Reflect.deleteProperty(globalThis, 'document')
})

function touch(type: string, canvasFingers: number, totalFingers: number) {
  const event = new Event(type, { cancelable: true })
  const finger = { clientX: 100 }
  Object.defineProperties(event, {
    targetTouches: { value: new Array(canvasFingers).fill(finger) },
    touches: { value: new Array(totalFingers).fill(finger) },
  })
  canvas.dispatchEvent(event)
}

const turn = (down: boolean) =>
  eventWindow.dispatchEvent(
    new Event(down ? COCKPIT_EVENT_TURN_LEFT_DOWN : COCKPIT_EVENT_TURN_LEFT_UP)
  )

test('lifting the canvas finger releases thrust while a turn stays held', () => {
  touch('touchstart', 1, 1)
  turn(true)
  expect(controller.input.forward).toBe(true)
  expect(controller.input.turnLeft).toBe(true)
  touch('touchend', 0, 1)
  expect(controller.input.forward).toBe(false)
  expect(controller.input.turnLeft).toBe(true)
  turn(false)
  expect(controller.input.turnLeft).toBe(false)
})

test('a finger on the turn button does not prevent canvas thrust', () => {
  turn(true)
  touch('touchstart', 1, 2)
  expect(controller.input.forward).toBe(true)
  turn(false)
  expect(controller.input.forward).toBe(true)
  touch('touchend', 0, 0)
  expect(controller.input.forward).toBe(false)
})

test('cancel and pause clear thrust and held touch controls', () => {
  touch('touchstart', 1, 1)
  turn(true)
  touch('touchcancel', 0, 1)
  expect(controller.input.forward).toBe(false)
  controller.reset()
  expect(controller.input.turnLeft).toBe(false)
  expect(controller.input.turnRight).toBe(false)
  touch('touchstart', 1, 1)
  expect(controller.input.forward).toBe(true)
})

test('releasing a touch control preserves a held keyboard turn', () => {
  const key = (type: string) => {
    const event = new Event(type)
    Object.defineProperty(event, 'key', { value: 'd' })
    eventWindow.dispatchEvent(event)
  }
  key('keydown')
  turn(true)
  turn(false)
  expect(controller.input.turnRight).toBe(true)
  touch('touchstart', 1, 1)
  touch('touchcancel', 0, 0)
  expect(controller.input.turnRight).toBe(true)
  key('keyup')
  expect(controller.input.turnRight).toBe(false)
})
