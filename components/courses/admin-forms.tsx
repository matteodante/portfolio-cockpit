'use client'

import { useActionState, useState } from 'react'
import {
  type AdminState,
  enroll,
  finishVideoUpload,
  saveCourse,
  saveLesson,
  startVideoUpload,
} from '@/lib/courses/admin-actions'

type CourseValues = {
  id?: string
  title?: string
  slug?: string
  summary?: string
  language?: string
  access?: string
  position?: number
  published?: boolean
}

function Result({ state }: { state: AdminState }) {
  if (state.error)
    return (
      <p className="admin-result" data-error role="alert">
        {state.error}
      </p>
    )
  if (state.ok)
    return (
      <p className="admin-result" role="status">
        {state.ok}
      </p>
    )
  return null
}

export function CourseForm({ course = {} }: { course?: CourseValues }) {
  const [state, action, pending] = useActionState(saveCourse, {})
  return (
    <form className="admin-form" action={action}>
      {course.id && <input type="hidden" name="id" value={course.id} />}
      <label>
        <span>Titolo</span>
        <input name="title" required defaultValue={course.title} />
      </label>
      <label>
        <span>Slug (URL)</span>
        <input
          name="slug"
          required
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          defaultValue={course.slug}
        />
      </label>
      <label className="admin-wide">
        <span>Descrizione breve</span>
        <textarea name="summary" rows={2} defaultValue={course.summary} />
      </label>
      <label>
        <span>Lingua</span>
        <select name="language" defaultValue={course.language ?? 'it'}>
          <option value="it">Italiano</option>
          <option value="en">English</option>
        </select>
      </label>
      <label>
        <span>Accesso</span>
        <select name="access" defaultValue={course.access ?? 'assigned'}>
          <option value="assigned">Solo iscritti (assegnato)</option>
          <option value="free">Gratuito per tutti gli account</option>
        </select>
      </label>
      <label>
        <span>Ordine</span>
        <input
          name="position"
          type="number"
          min={0}
          defaultValue={course.position ?? 0}
        />
      </label>
      <label className="admin-check">
        <input
          type="checkbox"
          name="published"
          defaultChecked={course.published}
        />
        <span>Pubblicato</span>
      </label>
      <div className="admin-wide admin-submit">
        <button className="booking-link" type="submit" disabled={pending}>
          {course.id ? 'Salva corso' : 'Crea corso'}
        </button>
        <Result state={state} />
      </div>
    </form>
  )
}

type LessonValues = {
  id?: string
  title?: string
  slug?: string
  body?: string
  position?: number
  published?: boolean
}

export function LessonForm({
  courseId,
  lesson = {},
}: {
  courseId: string
  lesson?: LessonValues
}) {
  const [state, action, pending] = useActionState(saveLesson, {})
  return (
    <form className="admin-form" action={action}>
      <input type="hidden" name="courseId" value={courseId} />
      {lesson.id && <input type="hidden" name="id" value={lesson.id} />}
      <label>
        <span>Titolo</span>
        <input name="title" required defaultValue={lesson.title} />
      </label>
      <label>
        <span>Slug (URL)</span>
        <input
          name="slug"
          required
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          defaultValue={lesson.slug}
        />
      </label>
      <label className="admin-wide">
        <span>Appunti (Markdown)</span>
        <textarea name="body" rows={8} defaultValue={lesson.body} />
      </label>
      <label>
        <span>Ordine</span>
        <input
          name="position"
          type="number"
          min={0}
          defaultValue={lesson.position ?? 0}
        />
      </label>
      <label className="admin-check">
        <input
          type="checkbox"
          name="published"
          defaultChecked={lesson.published}
        />
        <span>Pubblicata</span>
      </label>
      <div className="admin-wide admin-submit">
        <button className="booking-link" type="submit" disabled={pending}>
          {lesson.id ? 'Salva lezione' : 'Aggiungi lezione'}
        </button>
        <Result state={state} />
      </div>
    </form>
  )
}

export function EnrollForm({ courseId }: { courseId: string }) {
  const [state, action, pending] = useActionState(enroll, {})
  return (
    <form className="admin-form admin-inline" action={action}>
      <input type="hidden" name="courseId" value={courseId} />
      <label>
        <span>Email dell’account</span>
        <input name="email" type="email" required />
      </label>
      <button className="hero-play" type="submit" disabled={pending}>
        Iscrivi
      </button>
      <Result state={state} />
    </form>
  )
}

/** Uploads a recording straight to the bucket through a signed URL. */
export function VideoUpload({ lessonId }: { lessonId: string }) {
  const [status, setStatus] = useState('')
  const [progress, setProgress] = useState<number | null>(null)

  async function upload(file: File) {
    setStatus('')
    const started = await startVideoUpload(lessonId, {
      name: file.name,
      type: file.type,
      size: file.size,
    })
    if ('error' in started) {
      setStatus(started.error)
      return
    }
    setProgress(0)
    const ok = await new Promise<boolean>((resolve) => {
      const request = new XMLHttpRequest()
      request.open('PUT', started.url)
      request.setRequestHeader('content-type', file.type)
      request.upload.onprogress = (event) =>
        event.lengthComputable && setProgress(event.loaded / event.total)
      request.onload = () => resolve(request.status < 300)
      request.onerror = () => resolve(false)
      request.send(file)
    })
    setProgress(null)
    if (!ok) {
      setStatus('Caricamento non riuscito.')
      return
    }
    await finishVideoUpload(lessonId, started.key)
    setStatus('Registrazione caricata.')
  }

  return (
    <div className="admin-upload">
      <label>
        <span>Registrazione (MP4, WebM, MOV)</span>
        <input
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          disabled={progress !== null}
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) void upload(file)
          }}
        />
      </label>
      {progress !== null && (
        <progress max={1} value={progress}>
          {Math.round(progress * 100)}%
        </progress>
      )}
      <p className="admin-result" role="status">
        {status}
      </p>
    </div>
  )
}
