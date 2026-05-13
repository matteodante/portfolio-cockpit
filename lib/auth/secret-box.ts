import {
  type CipherGCM,
  createCipheriv,
  createDecipheriv,
  type DecipherGCM,
  randomBytes,
} from 'node:crypto'
import { requireEnv } from './env'

const ALGO = 'aes-256-gcm'
const IV_BYTES = 12
const TAG_BYTES = 16
const KEY_BYTES = 32

let cachedKey: Buffer | undefined

function loadKey(): Buffer {
  if (cachedKey) return cachedKey
  const key = Buffer.from(requireEnv('CV_DECRYPT_KEY'), 'base64')
  if (key.length !== KEY_BYTES) {
    throw new Error(
      `CV_DECRYPT_KEY must decode to ${KEY_BYTES} bytes (got ${key.length})`
    )
  }
  cachedKey = key
  return key
}

export function encryptBlob(plaintext: Buffer): Buffer {
  const key = loadKey()
  const iv = randomBytes(IV_BYTES)
  const cipher = createCipheriv(ALGO, key, iv) as CipherGCM
  const body = Buffer.concat([cipher.update(plaintext), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, body, tag])
}

export function decryptBlob(blob: Buffer): Buffer {
  if (blob.length < IV_BYTES + TAG_BYTES) {
    throw new Error('encrypted blob too short')
  }
  const key = loadKey()
  const iv = blob.subarray(0, IV_BYTES)
  const tag = blob.subarray(blob.length - TAG_BYTES)
  const body = blob.subarray(IV_BYTES, blob.length - TAG_BYTES)
  const decipher = createDecipheriv(ALGO, key, iv) as DecipherGCM
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(body), decipher.final()])
}
