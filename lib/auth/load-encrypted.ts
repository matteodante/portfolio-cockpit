import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { decryptBlob } from '@/lib/auth/secret-box'

const cache = new Map<string, Buffer>()

function readEncryptedFile(relPath: string): Promise<Buffer> {
  const filename = path.basename(relPath)

  // Keep each read rooted in a literal asset directory so Next can trace it
  // without including the whole repository in serverless bundles.
  switch (path.dirname(relPath)) {
    case 'private/resume':
      return readFile(path.join(process.cwd(), 'private/resume', filename))
    case 'lib/i18n/translations':
      return readFile(
        path.join(process.cwd(), 'lib/i18n/translations', filename)
      )
    case 'lib/ai':
      return readFile(path.join(process.cwd(), 'lib/ai', filename))
    default:
      throw new Error(`Unknown encrypted asset directory: ${relPath}`)
  }
}

export async function loadDecrypted(relPath: string): Promise<Buffer> {
  const cached = cache.get(relPath)
  if (cached) return cached
  const blob = await readEncryptedFile(relPath)
  const plain = decryptBlob(blob)
  cache.set(relPath, plain)
  return plain
}

export async function loadDecryptedText(relPath: string): Promise<string> {
  return (await loadDecrypted(relPath)).toString('utf8')
}

export async function loadDecryptedJson<T>(relPath: string): Promise<T> {
  return JSON.parse(await loadDecryptedText(relPath)) as T
}
