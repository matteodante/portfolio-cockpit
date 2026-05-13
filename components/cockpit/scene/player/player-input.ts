import {
  COCKPIT_EVENT_INFO,
  COCKPIT_EVENT_JUMP,
  COCKPIT_EVENT_TURN_LEFT_DOWN,
  COCKPIT_EVENT_TURN_LEFT_UP,
  COCKPIT_EVENT_TURN_RIGHT_DOWN,
  COCKPIT_EVENT_TURN_RIGHT_UP,
} from './player-events'
import type { PlayerInput } from './player-physics'

type InputController = {
  /** Held-key state, mutated in place. Readers must NOT retain a copy. */
  input: PlayerInput
  /**
   * Returns true at most once per Space press (rising edge). Consumed on
   * read so landings/takeoffs only fire on the initial keydown, not on
   * auto-repeat.
   */
  consumeSpaceEdge(): boolean
  dispose(): void
}

type InputOptions = {
  /** Called on the rising edge of `E` (dock request). */
  onDockKey(): void
  /**
   * Optional element (usually the canvas) to attach touch controls to.
   * When present: press-and-hold = forward, horizontal swipe = turn.
   */
  touchTarget?: HTMLElement
}

// Map lowercase key → PlayerInput field it flips.
const KEY_BINDINGS: Record<string, keyof PlayerInput> = {
  w: 'forward',
  arrowup: 'forward',
  s: 'back',
  arrowdown: 'back',
  a: 'turnLeft',
  arrowleft: 'turnLeft',
  d: 'turnRight',
  arrowright: 'turnRight',
  shift: 'run',
}

// True if focus is on an editable element — used to ignore WASD while typing.
function isTypingTarget(): boolean {
  const el = document.activeElement as HTMLElement | null
  if (!el) return false
  const tag = el.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (el.isContentEditable) return true
  return false
}

export function createInputController({
  onDockKey,
  touchTarget,
}: InputOptions): InputController {
  const input: PlayerInput = {
    forward: false,
    back: false,
    turnLeft: false,
    turnRight: false,
    run: false,
  }
  let spaceHeld = false
  let spaceEdge = false

  const releaseAll = () => {
    input.forward = false
    input.back = false
    input.turnLeft = false
    input.turnRight = false
    input.run = false
    spaceHeld = false
  }

  const handleDown = (e: KeyboardEvent) => {
    if (isTypingTarget()) return

    if (e.code === 'Space') {
      if (!spaceHeld) spaceEdge = true
      spaceHeld = true
      e.preventDefault()
      return
    }

    const k = e.key.toLowerCase()
    const field = KEY_BINDINGS[k]
    if (field) {
      input[field] = true
      return
    }
    if (k === 'e') onDockKey()
  }

  const handleUp = (e: KeyboardEvent) => {
    if (isTypingTarget()) {
      releaseAll()
      return
    }
    if (e.code === 'Space') {
      spaceHeld = false
      return
    }
    const field = KEY_BINDINGS[e.key.toLowerCase()]
    if (field) input[field] = false
  }

  const onJumpEvent = () => {
    if (!spaceHeld) spaceEdge = true
  }
  const onInfoEvent = () => onDockKey()
  const onTurnLeftDown = () => {
    input.turnLeft = true
  }
  const onTurnLeftUp = () => {
    input.turnLeft = false
  }
  const onTurnRightDown = () => {
    input.turnRight = true
  }
  const onTurnRightUp = () => {
    input.turnRight = false
  }
  const onBlur = () => releaseAll()

  window.addEventListener('keydown', handleDown)
  window.addEventListener('keyup', handleUp)
  window.addEventListener(COCKPIT_EVENT_JUMP, onJumpEvent)
  window.addEventListener(COCKPIT_EVENT_INFO, onInfoEvent)
  window.addEventListener(COCKPIT_EVENT_TURN_LEFT_DOWN, onTurnLeftDown)
  window.addEventListener(COCKPIT_EVENT_TURN_LEFT_UP, onTurnLeftUp)
  window.addEventListener(COCKPIT_EVENT_TURN_RIGHT_DOWN, onTurnRightDown)
  window.addEventListener(COCKPIT_EVENT_TURN_RIGHT_UP, onTurnRightUp)
  window.addEventListener('blur', onBlur)

  const TURN_DEADZONE_PX = 1
  // hold = |dx| * SCALE clamped to [MIN, MAX]; bigger swipes carry farther
  // before the auto-reset kicks in.
  const TURN_HOLD_MIN_MS = 220
  const TURN_HOLD_MAX_MS = 1400
  const TURN_HOLD_SCALE = 35
  let lastTouchX: number | null = null
  let turnTimer: ReturnType<typeof setTimeout> | null = null

  const clearTurn = () => {
    input.turnLeft = false
    input.turnRight = false
    if (turnTimer) {
      clearTimeout(turnTimer)
      turnTimer = null
    }
  }

  const onTouchStart = (e: TouchEvent) => {
    if (isTypingTarget()) return
    if (e.touches.length !== 1) return
    const touch = e.touches[0]
    if (!touch) return
    input.forward = true
    lastTouchX = touch.clientX
    e.preventDefault()
  }

  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length !== 1 || lastTouchX === null) return
    const touch = e.touches[0]
    if (!touch) return
    const dx = touch.clientX - lastTouchX
    const adx = Math.abs(dx)
    if (adx <= TURN_DEADZONE_PX) return
    lastTouchX = touch.clientX
    input.turnRight = dx > 0
    input.turnLeft = dx < 0
    if (turnTimer) clearTimeout(turnTimer)
    // Auto-reset emulates keyboard keyup once the finger stops moving.
    const holdMs = Math.min(
      TURN_HOLD_MAX_MS,
      Math.max(TURN_HOLD_MIN_MS, adx * TURN_HOLD_SCALE)
    )
    turnTimer = setTimeout(() => {
      input.turnLeft = false
      input.turnRight = false
      turnTimer = null
    }, holdMs)
    e.preventDefault()
  }

  const onTouchEnd = (e: TouchEvent) => {
    if (e.touches.length === 0) {
      input.forward = false
      clearTurn()
      lastTouchX = null
      return
    }
    const touch = e.touches[0]
    if (touch) lastTouchX = touch.clientX
  }

  const touchHandlers: readonly [
    keyof HTMLElementEventMap,
    EventListener,
    AddEventListenerOptions?,
  ][] = [
    ['touchstart', onTouchStart as EventListener, { passive: false }],
    ['touchmove', onTouchMove as EventListener, { passive: false }],
    ['touchend', onTouchEnd as EventListener],
    ['touchcancel', onTouchEnd as EventListener],
  ]
  if (touchTarget) {
    for (const [type, handler, opts] of touchHandlers) {
      touchTarget.addEventListener(type, handler, opts)
    }
  }

  return {
    input,
    consumeSpaceEdge() {
      if (!spaceEdge) return false
      spaceEdge = false
      return true
    },
    dispose() {
      window.removeEventListener('keydown', handleDown)
      window.removeEventListener('keyup', handleUp)
      window.removeEventListener(COCKPIT_EVENT_JUMP, onJumpEvent)
      window.removeEventListener(COCKPIT_EVENT_INFO, onInfoEvent)
      window.removeEventListener(COCKPIT_EVENT_TURN_LEFT_DOWN, onTurnLeftDown)
      window.removeEventListener(COCKPIT_EVENT_TURN_LEFT_UP, onTurnLeftUp)
      window.removeEventListener(COCKPIT_EVENT_TURN_RIGHT_DOWN, onTurnRightDown)
      window.removeEventListener(COCKPIT_EVENT_TURN_RIGHT_UP, onTurnRightUp)
      window.removeEventListener('blur', onBlur)
      if (touchTarget) {
        for (const [type, handler] of touchHandlers) {
          touchTarget.removeEventListener(type, handler)
        }
      }
      if (turnTimer) clearTimeout(turnTimer)
    },
  }
}
