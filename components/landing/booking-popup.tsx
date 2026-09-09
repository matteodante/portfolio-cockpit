'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { trackMarketing } from '@/lib/analytics/client'
import { CAL_BOOKING_URL } from '@/lib/constants/contact'
import type { Locale } from '@/lib/i18n/config'

const Cal = dynamic(() => import('@calcom/embed-react'), { ssr: false })

function connectCalendar(id: string) {
  let disposed = false
  let removeListener: (() => void) | undefined
  void import('@calcom/embed-react')
    .then(async ({ getCalApi }) => {
      const cal = await getCalApi({ namespace: `service-${id}` })
      if (disposed) return
      let recorded = false
      const onBooking = () => {
        if (recorded) return
        recorded = true
        trackMarketing('booking_created', {
          placement: 'service_popup',
          method: 'embed',
          service: id === 'app' || id === 'ai' ? id : 'web',
        })
      }
      cal('on', { action: 'bookingSuccessfulV2', callback: onBooking })
      removeListener = () =>
        cal('off', { action: 'bookingSuccessfulV2', callback: onBooking })
      cal('ui', {
        theme: 'dark',
        styles: { body: { background: '#101010' } },
        cssVarsPerTheme: {
          dark: { 'cal-brand': '#ff6b35' },
          light: { 'cal-brand': '#ff6b35' },
        },
      })
    })
    .catch(() => {
      /* The direct calendar link remains available. */
    })
  return () => {
    disposed = true
    removeListener?.()
  }
}

type Props = {
  id: string
  locale: Locale
  label: string
  title: string
  closeLabel: string
  className?: string
  fallbackLabel: string
}

export default function BookingPopup({
  id,
  locale,
  label,
  title,
  closeLabel,
  fallbackLabel,
  className = 'service-booking',
}: Props) {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!(open && dialog)) return
    dialog.showModal()
    const disconnect = connectCalendar(id)
    return () => {
      disconnect()
      dialog.close()
    }
  }, [id, open])

  return (
    <>
      <Link
        href={CAL_BOOKING_URL}
        className={className}
        data-track="booking_opened"
        data-placement="service_popup"
        data-method="embed"
        data-service={id === 'app' || id === 'ai' ? id : 'web'}
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
            return
          event.preventDefault()
          setOpen(true)
        }}
      >
        {label}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 12h14m-6-6 6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </Link>
      <dialog
        ref={dialogRef}
        className="booking-dialog"
        aria-labelledby={`booking-title-${id}`}
        onClose={() => setOpen(false)}
      >
        <header className="booking-dialog-header">
          <h2 id={`booking-title-${id}`}>{title}</h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={closeLabel}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </header>
        {open && (
          <Cal
            namespace={`service-${id}`}
            calLink={CAL_BOOKING_URL.replace('https://cal.com/', '')}
            config={{ theme: 'dark', layout: 'month_view', locale }}
            className="booking-calendar"
          />
        )}
        <footer className="booking-dialog-footer">
          <Link
            href={CAL_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {fallbackLabel}
          </Link>
        </footer>
      </dialog>
    </>
  )
}
