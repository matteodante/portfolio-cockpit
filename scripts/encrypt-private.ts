#!/usr/bin/env bun

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import {
  CHAT_PROFILE_ENC,
  cvMdEnc,
  cvPdfEnc,
  PRIVATE_TRANSLATIONS_ENC,
} from '../lib/auth/encrypted-paths'
import { encryptBlob } from '../lib/auth/secret-box'

const ROOT = resolve(__dirname, '..')

type Entry = { from: string; to: string }

const ENTRIES: Entry[] = [
  { from: 'private-src/cv-en.md', to: cvMdEnc('en') },
  { from: 'private-src/cv-it.md', to: cvMdEnc('it') },
  { from: 'private-src/cv-en.pdf', to: cvPdfEnc('en') },
  { from: 'private-src/cv-it.pdf', to: cvPdfEnc('it') },
  { from: 'private-src/en.private.json', to: PRIVATE_TRANSLATIONS_ENC.en },
  { from: 'private-src/it.private.json', to: PRIVATE_TRANSLATIONS_ENC.it },
  { from: 'private-src/chat-profile.md', to: CHAT_PROFILE_ENC },
]

function main() {
  if (!process.env.CV_DECRYPT_KEY) {
    console.error(
      'CV_DECRYPT_KEY is not set. Generate one:\n' +
        '  openssl rand -base64 32\n' +
        'Then export it before running this script.'
    )
    process.exit(1)
  }

  for (const { from, to } of ENTRIES) {
    const src = join(ROOT, from)
    const dst = join(ROOT, to)
    if (!existsSync(src)) {
      console.error(`missing source: ${from}`)
      process.exit(1)
    }
    const plaintext = readFileSync(src)
    const blob = encryptBlob(plaintext)
    mkdirSync(dirname(dst), { recursive: true })
    writeFileSync(dst, blob)
    console.log(`encrypted ${from} → ${to} (${blob.length} bytes)`)
  }
}

main()
