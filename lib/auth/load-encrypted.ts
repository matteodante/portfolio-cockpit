import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { decryptBlob } from './secret-box'

const cache = new Map<string, Buffer>()

export async function loadDecrypted(relPath: string): Promise<Buffer> {
  const cached = cache.get(relPath)
  if (cached) return cached
  const blob = await readFile(path.join(process.cwd(), relPath))
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
