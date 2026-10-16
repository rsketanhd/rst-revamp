import { Link, Navigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PageContainer, PageHeader } from '../components/layout'
import { getSettingsSectionPath } from '../components/settings'
import {
  SETTINGS_LANDING_SECTIONS,
  type SettingsLandingCard,
} from '../data/settingsLanding'
import { getUserRole } from '../lib/auth'

/**
 * Settings hub landing — card grid to open module / platform settings groups.
 */
export function SettingsLandingPage() {
  const role = getUserRole()

  if (role === 'candidate') {
    return <Navigate to="/settings/account-settings" replace />
  }

  return (
    <PageContainer contentClassName="gap-6 sm:gap-8">
      <PageHeader
        title="Settings"
        subtitle="Manage your workspace configuration and administration. Choose a group to open its settings."
      />

      <div className="flex w-full flex-col gap-8">
        {SETTINGS_LANDING_SECTIONS.map((section) => (
          <section key={section.id} className="min-w-0">
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8B8B9E]">
              {section.title}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {section.cards.map((card) => (
                <SettingsGroupCard key={card.id} card={card} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageContainer>
  )
}

function SettingsGroupCard({ card }: { card: SettingsLandingCard }) {
  const Icon = card.icon
  const count = card.items.length
  const href = getSettingsSectionPath(card.href)

  return (
    <article className="flex h-full flex-col rounded-[10px] border border-[#E8E6F0] bg-white p-4 shadow-[0_4px_18px_rgba(45,32,97,0.05)] sm:p-5">
      <div className="flex items-start gap-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#F0EEF8] text-[#2D2061]">
          <Icon className="size-[1.125rem]" strokeWidth={1.75} aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                to={href}
                className="block text-[15px] font-bold text-[#1A1A2E] transition-colors hover:text-[#2D2061]"
              >
                {card.title}
              </Link>
              <p className="mt-0.5 text-xs text-[#8B8B9E]">
                {count} {count === 1 ? 'setting' : 'settings'}
              </p>
            </div>
            <Link
              to={href}
              aria-label={`Open ${card.title}`}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-[#A0A0B2] transition-colors hover:bg-[#F7F8FB] hover:text-[#2D2061]"
            >
              <ArrowRight className="size-4" strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      <ul className="mt-3 flex flex-1 flex-wrap content-start gap-1.5">
        {card.items.map((item) => (
          <li key={`${card.id}-tag-${item.label}`}>
            <Link
              to={getSettingsSectionPath(item.sectionId)}
              className="inline-flex max-w-full items-center rounded-full border border-[#E4E1EE] bg-[#F7F8FB] px-2.5 py-1 text-[11px] font-semibold text-[#5A5A72] transition-colors hover:border-[#2D2061] hover:bg-[#F0EEF8] hover:text-[#2D2061]"
            >
              <span className="truncate">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  )
}
