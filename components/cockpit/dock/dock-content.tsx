'use client'

import type { CockpitSection } from '@/lib/data/cockpit-sections'
import type { Locale } from '@/lib/i18n/config'
import AboutSection from './sections/about'
import CommChat from './sections/comm-chat'
import ContactSection from './sections/contact'
import ExperienceSection from './sections/experience'
import ProjectsSection from './sections/projects'
import SkillsSection from './sections/skills'

type DockContentProps = {
  section: CockpitSection
  locale: Locale
}

export default function DockContent({ section, locale }: DockContentProps) {
  switch (section.id) {
    case 'about':
      return <AboutSection />
    case 'experience':
      return <ExperienceSection />
    case 'projects':
      return <ProjectsSection />
    case 'skills':
      return <SkillsSection />
    case 'contact':
      return <ContactSection />
    case 'comm':
      return <CommChat locale={locale} />
    default:
      return null
  }
}
