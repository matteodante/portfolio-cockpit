'use client'

import Link from 'next/link'
import { cvDownloadFilename, cvPublicPdfPath } from '@/lib/constants/site'
import type { Locale } from '@/lib/i18n/config'

export default function CvDownloadLink({
  locale,
  label,
}: {
  locale: Locale
  label: string
}) {
  return (
    <Link
      className="hero-download"
      href={cvPublicPdfPath(locale)}
      download="matteo-dante-cv.pdf"
      prefetch={false}
      onClick={(event) => {
        event.currentTarget.download = cvDownloadFilename()
      }}
    >
      {label}
    </Link>
  )
}
