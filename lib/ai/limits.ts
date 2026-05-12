// Single source of truth for the chat API limits — imported by both the
// route handler (for Zod) and the client (for history trimming).
export const CHAT_MAX_MESSAGES = 8
export const CHAT_MAX_MESSAGE_LENGTH = 500
export const CHAT_MAX_TOTAL_INPUT_CHARS = 4000
