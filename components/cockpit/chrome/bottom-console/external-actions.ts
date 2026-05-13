import { EMAIL_HREF, GITHUB_URL } from '@/lib/constants/contact'
import { cvPdfPath } from '@/lib/constants/site'
import type { Locale } from '@/lib/i18n/config'

type ExternalActions = {
  downloadCv(): void
  goContact(): void
  goGithub(): void
}

/** External action handlers for the bottom-console action buttons. */
export function externalActions(
  locale: Locale,
  unlocked: boolean
): ExternalActions {
  const downloadCv = () => {
    const a = document.createElement('a')
    a.href = cvPdfPath(locale, unlocked)
    a.download = `MatteoDante_CV_${locale}.pdf`
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const goContact = () => {
    window.location.href = EMAIL_HREF
  }

  const goGithub = () => {
    window.open(GITHUB_URL, '_blank', 'noopener,noreferrer')
  }

  return { downloadCv, goContact, goGithub }
}
