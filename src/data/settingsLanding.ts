import type { LucideIcon } from 'lucide-react'
import {
  BadgeCheck,
  Briefcase,
  Building2,
  ClipboardList,
  FileBarChart2,
  FileText,
  Filter,
  Headphones,
  KeyRound,
  LayoutTemplate,
  Radar,
  Scale,
  Settings2,
  Shield,
  Sparkles,
  UserCog,
  UserRound,
  Users,
  Video,
  Zap,
} from 'lucide-react'
import type {
  SettingsNavItem,
  SettingsSectionId,
} from '../components/settings/settingsNavConfig'
import {
  SETTINGS_NAV_GROUPS,
  resolveSettingsSectionId,
} from '../components/settings/settingsNavConfig'

export type SettingsLandingLink = {
  label: string
  sectionId: SettingsSectionId
}

export type SettingsLandingCard = {
  id: string
  title: string
  icon: LucideIcon
  /** Primary destination when the card arrow / header is clicked. */
  href: SettingsSectionId
  items: SettingsLandingLink[]
}

export type SettingsLandingSection = {
  id: string
  title: string
  cards: SettingsLandingCard[]
}

const CARD_ICONS: Record<string, LucideIcon> = {
  jobs: Briefcase,
  candidates: Users,
  'candidate-discovery': Radar,
  'offer-management': BadgeCheck,
  pipeline: Filter,
  'talent-crm': Users,
  campaigns: LayoutTemplate,
  reports: FileBarChart2,
  'client-management': Building2,
  'jeeves-ai': Sparkles,
  'communication-hub': Headphones,
  'one-way-interview': Video,
  'two-way-interview': Video,
  'recruiter-profile': UserRound,
  'company-branding': Building2,
  'notification-config': ClipboardList,
  templates: FileText,
  triggers: Zap,
  approvals: Scale,
  'user-management': Users,
  'role-management': UserCog,
  'admin-panel': Settings2,
  'license-limits': KeyRound,
  'domain-rules': Shield,
  'candidate-privacy': Shield,
  'data-retention': FileText,
  'audit-activity': ClipboardList,
}

function iconFor(id: string): LucideIcon {
  return CARD_ICONS[id] ?? Settings2
}

function toLandingCard(item: SettingsNavItem): SettingsLandingCard {
  const sectionId = item.id as SettingsSectionId
  const children = item.children ?? []

  if (children.length > 0) {
    return {
      id: item.id,
      title: item.label,
      icon: iconFor(item.id),
      href: resolveSettingsSectionId(sectionId),
      items: children.map((child) => ({
        label: child.label,
        sectionId: child.id as SettingsSectionId,
      })),
    }
  }

  return {
    id: item.id,
    title: item.label,
    icon: iconFor(item.id),
    href: sectionId,
    items: [{ label: item.label, sectionId }],
  }
}

/**
 * Settings landing sections — mirrors Settings nav groups and submenus.
 */
export const SETTINGS_LANDING_SECTIONS: SettingsLandingSection[] =
  SETTINGS_NAV_GROUPS.map((group) => ({
    id: group.id,
    title: group.title,
    cards: group.items.map(toLandingCard),
  }))
