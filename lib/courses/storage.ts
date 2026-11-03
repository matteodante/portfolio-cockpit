import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutBucketCorsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

/**
 * Lesson recordings: a private Railway bucket (S3-compatible). Browsers upload
 * and play through short-lived pre-signed URLs; nothing in the bucket is
 * public. STORAGE_* are references to the bucket's own variables on Railway.
 */
type Storage = { client: S3Client; bucket: string }
let storage: Storage | null | undefined

function getStorage(): Storage | null {
  if (storage !== undefined) return storage
  const bucket = process.env.STORAGE_BUCKET
  const accessKeyId = process.env.STORAGE_ACCESS_KEY_ID
  const secretAccessKey = process.env.STORAGE_SECRET_ACCESS_KEY
  storage =
    bucket && accessKeyId && secretAccessKey
      ? {
          bucket,
          client: new S3Client({
            region: process.env.STORAGE_REGION ?? 'auto',
            ...(process.env.STORAGE_ENDPOINT
              ? { endpoint: process.env.STORAGE_ENDPOINT }
              : {}),
            forcePathStyle: process.env.STORAGE_FORCE_PATH_STYLE === 'true',
            credentials: { accessKeyId, secretAccessKey },
            // Default CRC32 checksums would be signed into browser PUT URLs.
            requestChecksumCalculation: 'WHEN_REQUIRED',
            responseChecksumValidation: 'WHEN_REQUIRED',
          }),
        }
      : null
  return storage
}

export function storageEnabled(): boolean {
  return getStorage() !== null
}

export const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
/** One PUT holds up to 5 GB; a recording of a long lesson fits. */
export const MAX_VIDEO_BYTES = 5 * 1024 ** 3

export async function presignUpload(
  key: string,
  contentType: string,
  origin: string
): Promise<string> {
  const store = getStorage()
  if (!store) throw new Error('storage is not configured')
  await store.client.send(
    new PutBucketCorsCommand({
      Bucket: store.bucket,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: [origin],
            AllowedMethods: ['PUT', 'GET', 'HEAD'],
            AllowedHeaders: ['content-type', 'range'],
            ExposeHeaders: ['ETag', 'Content-Length', 'Content-Range'],
            MaxAgeSeconds: 3600,
          },
        ],
      },
    })
  )
  return getSignedUrl(
    store.client,
    new PutObjectCommand({
      Bucket: store.bucket,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 3600, signableHeaders: new Set(['content-type']) }
  )
}

/** A playback URL valid for a long lesson; the page asks again on reload. */
export async function presignPlayback(key: string): Promise<string | null> {
  const store = getStorage()
  if (!store) return null
  return getSignedUrl(
    store.client,
    new GetObjectCommand({ Bucket: store.bucket, Key: key }),
    { expiresIn: 4 * 3600 }
  )
}

export async function deleteObject(key: string) {
  const store = getStorage()
  if (!store) return
  await store.client.send(
    new DeleteObjectCommand({ Bucket: store.bucket, Key: key })
  )
}
