export type SettingsSectionId =
  | 'jobs'
  | 'candidates'
  | 'pipeline'
  | 'talent-crm'
  | 'talent-crm-usage-limits'
  | 'talent-crm-column-filter'
  | 'talent-crm-talent-pool'
  | 'talent-crm-candidate'
  | 'talent-crm-campaign'
  | 'campaigns'
  | 'reports'
  | 'client-management'
  | 'one-way-interview'
  | 'two-way-interview'
  | 'recruiter-profile'
  | 'company-branding'
  | 'notification-config'
  | 'templates'
  | 'triggers'
  | 'approvals'
  | 'user-management'
  | 'role-management'
  | 'admin-panel'
  | 'domain-rules'
  | 'candidate-privacy'
  | 'data-retention'
  | 'audit-activity'
  | 'account-settings'
  | 'notification-preferences'

export type SettingsNavItem = {
  id: string
  label: string
  /** Nested settings links (e.g. Talent CRM sub-modules). */
  children?: SettingsNavItem[]
}

export type SettingsNavGroup = {
  id: string
  title: string
  items: SettingsNavItem[]
}

export const TALENT_CRM_NAV_CHILDREN: SettingsNavItem[] = [
  { id: 'talent-crm-usage-limits', label: 'Usage & Limits' },
  { id: 'talent-crm-column-filter', label: 'Column & Filter Visibility' },
  { id: 'talent-crm-talent-pool', label: 'Talent Pool Settings' },
  { id: 'talent-crm-candidate', label: 'Candidate Settings' },
  { id: 'talent-crm-campaign', label: 'Campaign Settings' },
]

/**
 * Secondary settings navigation —
 * Module Configuration + Settings Hub + Platform Administration + Security & Privacy.
 */
export const SETTINGS_NAV_GROUPS: SettingsNavGroup[] = [
  {
    id: 'module-configuration',
    title: 'Module Configuration',
    items: [
      { id: 'jobs', label: 'Jobs' },
      { id: 'candidates', label: 'Candidates' },
      { id: 'pipeline', label: 'Pipeline' },
      {
        id: 'talent-crm',
        label: 'Talent CRM',
        children: TALENT_CRM_NAV_CHILDREN,
      },
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
      { id: 'templates', label: 'Templates' },
      { id: 'triggers', label: 'Triggers' },
      { id: 'approvals', label: 'Approvals' },
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
  {
    id: 'security-privacy',
    title: 'Security & Privacy',
    items: [
      { id: 'domain-rules', label: 'Domain Rules' },
      { id: 'candidate-privacy', label: 'Candidate Privacy' },
      { id: 'data-retention', label: 'Data Retention' },
      { id: 'audit-activity', label: 'Audit & Activity' },
    ],
  },
]

export const DEFAULT_SETTINGS_SECTION: SettingsSectionId = 'recruiter-profile'

export const DEFAULT_CANDIDATE_SETTINGS_SECTION: SettingsSectionId =
  'account-settings'

/** Default landing page when opening Talent CRM parent. */
export const DEFAULT_TALENT_CRM_SECTION: SettingsSectionId =
  'talent-crm-usage-limits'

export const CANDIDATE_SETTINGS_NAV_GROUPS: SettingsNavGroup[] = [
  {
    id: 'candidate-settings',
    title: '',
    items: [
      { id: 'account-settings', label: 'Account Settings' },
      { id: 'notification-preferences', label: 'Notification Preferences' },
    ],
  },
]

const CANDIDATE_SETTINGS_SECTION_IDS: SettingsSectionId[] = [
  'account-settings',
  'notification-preferences',
]

/** Canonical path for a settings hub item (e.g. `/settings/company-branding`). */
export function getSettingsSectionPath(id: SettingsSectionId): string {
  return `/settings/${id}`
}

export function flattenSettingsNavItems(
  groups: SettingsNavGroup[] = SETTINGS_NAV_GROUPS,
): SettingsNavItem[] {
  const items: SettingsNavItem[] = []
  for (const group of groups) {
    for (const item of group.items) {
      items.push(item)
      if (item.children?.length) {
        items.push(...item.children)
      }
    }
  }
  return items
}

export function getSettingsNavGroupsForRole(
  role: 'recruiter' | 'candidate',
): SettingsNavGroup[] {
  return role === 'candidate'
    ? CANDIDATE_SETTINGS_NAV_GROUPS
    : SETTINGS_NAV_GROUPS
}

export function getDefaultSettingsSectionForRole(
  role: 'recruiter' | 'candidate',
): SettingsSectionId {
  return role === 'candidate'
    ? DEFAULT_CANDIDATE_SETTINGS_SECTION
    : DEFAULT_SETTINGS_SECTION
}

export function isSettingsSectionIdForRole(
  value: string,
  role: 'recruiter' | 'candidate',
): value is SettingsSectionId {
  if (role === 'candidate') {
    return CANDIDATE_SETTINGS_SECTION_IDS.includes(value as SettingsSectionId)
  }

  return isRecruiterSettingsSectionId(value)
}

function isRecruiterSettingsSectionId(
  value: string,
): value is SettingsSectionId {
  if (value === 'talent-crm') return true
  if (CANDIDATE_SETTINGS_SECTION_IDS.includes(value as SettingsSectionId)) {
    return false
  }
  return flattenSettingsNavItems().some((item) => item.id === value)
}

export function isSettingsSectionId(value: string): value is SettingsSectionId {
  if (value === 'talent-crm') return true
  if (CANDIDATE_SETTINGS_SECTION_IDS.includes(value as SettingsSectionId)) {
    return true
  }
  return flattenSettingsNavItems().some((item) => item.id === value)
}

export function getSettingsSectionLabel(id: SettingsSectionId): string {
  if (id === 'talent-crm') return 'Talent CRM'
  for (const item of flattenSettingsNavItems(CANDIDATE_SETTINGS_NAV_GROUPS)) {
    if (item.id === id) return item.label
  }
  for (const item of flattenSettingsNavItems()) {
    if (item.id === id) return item.label
  }
  return 'Settings'
}

/** Resolve parent route `/settings/talent-crm` to a concrete child section. */
export function resolveSettingsSectionId(
  sectionId: SettingsSectionId,
): SettingsSectionId {
  if (sectionId === 'talent-crm') return DEFAULT_TALENT_CRM_SECTION
  return sectionId
}
