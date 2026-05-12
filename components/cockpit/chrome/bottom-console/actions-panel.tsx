import { EMAIL_HREF } from '@/lib/constants/contact'
import { useT } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/config'
import ActionButton from '../action-button'
import { externalActions } from './external-actions'

type ActionsPanelProps = {
  locale: Locale
}

/** Right-hand stack: download CV, contact email, GitHub. */
export default function ActionsPanel({ locale }: ActionsPanelProps) {
  const t = useT()
  const { downloadCv, goContact, goGithub } = externalActions(locale)
  const cvSub = t('cockpit.actions.downloadCvSub').replace('{locale}', locale)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: 200,
      }}
    >
      <ActionButton
        onClick={downloadCv}
        label={t('cockpit.actions.downloadCv')}
        sub={cvSub}
      />
      <ActionButton
        onClick={goContact}
        label={t('cockpit.actions.contact')}
        sub={EMAIL_HREF.replace('mailto:', '')}
      />
      <ActionButton
        onClick={goGithub}
        label={t('cockpit.actions.github')}
        sub={t('cockpit.actions.githubSub')}
      />
    </div>
  )
}
