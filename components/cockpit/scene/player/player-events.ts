// Mobile on-screen buttons fire these on the global window; player-input
// listens and routes them through the same paths as Space / E / A / D.
export const COCKPIT_EVENT_JUMP = 'cockpit:jump' as const
export const COCKPIT_EVENT_INFO = 'cockpit:info' as const
export const COCKPIT_EVENT_TURN_LEFT_DOWN = 'cockpit:turnLeft:down' as const
export const COCKPIT_EVENT_TURN_LEFT_UP = 'cockpit:turnLeft:up' as const
export const COCKPIT_EVENT_TURN_RIGHT_DOWN = 'cockpit:turnRight:down' as const
export const COCKPIT_EVENT_TURN_RIGHT_UP = 'cockpit:turnRight:up' as const
