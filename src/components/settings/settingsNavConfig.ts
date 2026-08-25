export type SettingsSectionId =
  | 'jobs'
  | 'candidates'
  | 'pipeline'
  | 'talent-crm'
  | 'campaigns'
  | 'reports'
  | 'client-management'
  | 'one-way-interview'
  | 'two-way-interview'
  | 'recruiter-profile'
  | 'company-branding'
  | 'notification-config'
  | 'email-config'
  | 'user-management'
  | 'role-management'
  | 'admin-panel'

export type SettingsNavItem = {
  id: string
  label: string
}

export type SettingsNavGroup = {
  id: string
  title: string
  items: SettingsNavItem[]
}

/**
 * Secondary settings navigation —
 * Module Configuration + Settings Hub + Platform Administration.
 */
export const SETTINGS_NAV_GROUPS: SettingsNavGroup[] = [
  {
    id: 'module-configuration',
    title: 'Module Configuration',
    items: [
      { id: 'jobs', label: 'Jobs' },
      { id: 'candidates', label: 'Candidates' },
      { id: 'pipeline', label: 'Pipeline' },
      { id: 'talent-crm', label: 'Talent CRM' },
      { id: 'campaigns', label: 'Campaigns' },
      { id: 'reports', label: 'Reports' },
      { id: 'client-management', label: 'Client Management' },
      { id: 'one-way-interview', label: '1 Way Interview' },
      { id: 'two-way-interview', label: '2 Way Interview' },
    ],
  },
  {
    id: 'settings-hub',
    title: 'Settings Hub',
    items: [
      { id: 'recruiter-profile', label: 'Recruiter Profile' },
      { id: 'company-branding', label: 'Company & Branding' },
      { id: 'notification-config', label: 'Notification Config' },
      { id: 'email-config', label: 'Email Config' },
    ],
  },
  {
    id: 'platform-admin',
    title: 'Platform Administration',
    items: [
      { id: 'user-management', label: 'User Management' },
      { id: 'role-management', label: 'Role Management' },
      { id: 'admin-panel', label: 'Admin Panel' },
    ],
  },
]

export const DEFAULT_SETTINGS_SECTION: SettingsSectionId = 'recruiter-profile'

/** Canonical path for a settings hub item (e.g. `/settings/company-branding`). */
export function getSettingsSectionPath(id: SettingsSectionId): string {
  return `/settings/${id}`
}

export function isSettingsSectionId(value: string): value is SettingsSectionId {
  return SETTINGS_NAV_GROUPS.some((group) =>
    group.items.some((item) => item.id === value),
  )
}

export function getSettingsSectionLabel(id: SettingsSectionId): string {
  for (const group of SETTINGS_NAV_GROUPS) {
    const item = group.items.find((entry) => entry.id === id)
    if (item) return item.label
  }
  return 'Settings'
}
