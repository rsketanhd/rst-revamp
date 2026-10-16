export type SettingsSectionId =
  | 'jobs'
  | 'jobs-general'
  | 'jobs-pipeline'
  | 'jobs-job-categories'
  | 'jobs-industries'
  | 'jobs-career-page'
  | 'jobs-field-customization'
  | 'candidates'
  | 'candidates-general'
  | 'candidates-documents'
  | 'candidates-masking'
  | 'candidate-discovery'
  | 'candidate-discovery-general'
  | 'offer-management'
  | 'offer-management-stages-status'
  | 'offer-management-pipeline-sync'
  | 'offer-management-reasons'
  | 'offer-management-approval-rules'
  | 'offer-management-templates-emails'
  | 'offer-management-team-notifications'
  | 'offer-management-entities-compensation'
  | 'offer-management-lifecycle-signing'
  | 'offer-management-audit-log'
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
  | 'jeeves-ai'
  | 'jeeves-ai-general'
  | 'jeeves-ai-question-sets'
  | 'jeeves-ai-triggers'
  | 'jeeves-ai-change-history'
  | 'communication-hub'
  | 'communication-hub-assignment-handover'
  | 'communication-hub-unassigned-chats'
  | 'communication-hub-topic-status'
  | 'communication-hub-notes-priority'
  | 'communication-hub-document-requests'
  | 'communication-hub-retention-export'
  | 'one-way-interview'
  | 'one-way-interview-default'
  | 'one-way-interview-pipeline-sync'
  | 'one-way-interview-avatar'
  | 'one-way-interview-competency'
  | 'two-way-interview'
  | 'two-way-interview-configuration'
  | 'two-way-interview-rounds'
  | 'two-way-interview-plan-summary'
  | 'two-way-interview-notifications'
  | 'two-way-interview-connections'
  | 'two-way-interview-change-history'
  | 'recruiter-profile'
  | 'company-branding'
  | 'notification-config'
  | 'templates'
  | 'triggers'
  | 'approvals'
  | 'user-management'
  | 'role-management'
  | 'admin-panel'
  | 'license-limits'
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

export const JEEVES_AI_NAV_CHILDREN: SettingsNavItem[] = [
  { id: 'jeeves-ai-general', label: 'General' },
  { id: 'jeeves-ai-question-sets', label: 'Question Sets' },
  { id: 'jeeves-ai-triggers', label: 'Triggers' },
  { id: 'jeeves-ai-change-history', label: 'Change History' },
]

export const COMMUNICATION_HUB_NAV_CHILDREN: SettingsNavItem[] = [
  {
    id: 'communication-hub-assignment-handover',
    label: 'Assignment & Handover',
  },
  { id: 'communication-hub-unassigned-chats', label: 'Unassigned Chats' },
  { id: 'communication-hub-topic-status', label: 'Topic Status' },
  { id: 'communication-hub-notes-priority', label: 'Notes & Priority' },
  { id: 'communication-hub-document-requests', label: 'Document Requests' },
  { id: 'communication-hub-retention-export', label: 'Retention & Export' },
]

export const ONE_WAY_INTERVIEW_NAV_CHILDREN: SettingsNavItem[] = [
  { id: 'one-way-interview-default', label: 'Default Settings' },
  { id: 'one-way-interview-pipeline-sync', label: 'Pipeline Sync' },
  { id: 'one-way-interview-avatar', label: 'Avatar Settings' },
  { id: 'one-way-interview-competency', label: 'Competency' },
]

export const TWO_WAY_INTERVIEW_NAV_CHILDREN: SettingsNavItem[] = [
  { id: 'two-way-interview-configuration', label: 'Configuration' },
  { id: 'two-way-interview-rounds', label: 'Rounds' },
  { id: 'two-way-interview-plan-summary', label: 'Interview Plan & Summary' },
  { id: 'two-way-interview-notifications', label: 'Notifications' },
  { id: 'two-way-interview-connections', label: 'Two Way Connections' },
  { id: 'two-way-interview-change-history', label: 'Change History' },
]

export const JOBS_NAV_CHILDREN: SettingsNavItem[] = [
  { id: 'jobs-general', label: 'General' },
  { id: 'jobs-pipeline', label: 'Pipeline' },
  { id: 'jobs-job-categories', label: 'Categories' },
  { id: 'jobs-industries', label: 'Industries' },
  { id: 'jobs-career-page', label: 'Career Page' },
  { id: 'jobs-field-customization', label: 'Field Customization' },
]

export const CANDIDATES_NAV_CHILDREN: SettingsNavItem[] = [
  { id: 'candidates-general', label: 'General' },
  { id: 'candidates-documents', label: 'Documents' },
  { id: 'candidates-masking', label: 'Masking' },
]

export const CANDIDATE_DISCOVERY_NAV_CHILDREN: SettingsNavItem[] = [
  { id: 'candidate-discovery-general', label: 'General' },
]

export const OFFER_MANAGEMENT_NAV_CHILDREN: SettingsNavItem[] = [
  { id: 'offer-management-stages-status', label: 'Statuses & Stages' },
  { id: 'offer-management-pipeline-sync', label: 'Pipeline Sync' },
  { id: 'offer-management-reasons', label: 'Reasons' },
  { id: 'offer-management-approval-rules', label: 'Approval Rules' },
  { id: 'offer-management-templates-emails', label: 'Templates & Emails' },
  { id: 'offer-management-team-notifications', label: 'Team Notifications' },
  {
    id: 'offer-management-entities-compensation',
    label: 'Entities & Compensation',
  },
  { id: 'offer-management-lifecycle-signing', label: 'Lifecycle & Signing' },
  { id: 'offer-management-audit-log', label: 'Audit Log' },
]

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
      { id: 'jobs', label: 'Jobs', children: JOBS_NAV_CHILDREN },
      {
        id: 'candidates',
        label: 'Candidates',
        children: CANDIDATES_NAV_CHILDREN,
      },
      {
        id: 'candidate-discovery',
        label: 'Candidate Discovery',
        children: CANDIDATE_DISCOVERY_NAV_CHILDREN,
      },
      {
        id: 'offer-management',
        label: 'Offer Management',
        children: OFFER_MANAGEMENT_NAV_CHILDREN,
      },
      { id: 'pipeline', label: 'Pipeline' },
      {
        id: 'talent-crm',
        label: 'Talent CRM',
        children: TALENT_CRM_NAV_CHILDREN,
      },
      { id: 'campaigns', label: 'Campaigns' },
      { id: 'reports', label: 'Reports' },
      { id: 'client-management', label: 'Client Management' },
      {
        id: 'jeeves-ai',
        label: 'Jeeves AI',
        children: JEEVES_AI_NAV_CHILDREN,
      },
      {
        id: 'communication-hub',
        label: 'Communication Hub',
        children: COMMUNICATION_HUB_NAV_CHILDREN,
      },
      {
        id: 'one-way-interview',
        label: '1 Way Interview',
        children: ONE_WAY_INTERVIEW_NAV_CHILDREN,
      },
      {
        id: 'two-way-interview',
        label: '2 Way Interview',
        children: TWO_WAY_INTERVIEW_NAV_CHILDREN,
      },
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
      { id: 'license-limits', label: 'License & Limit Management' },
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

/** Default landing page when opening Jobs parent. */
export const DEFAULT_JOBS_SECTION: SettingsSectionId = 'jobs-general'

/** Default landing page when opening Candidates parent. */
export const DEFAULT_CANDIDATES_SECTION: SettingsSectionId =
  'candidates-general'

/** Default landing page when opening Candidate Discovery parent. */
export const DEFAULT_CANDIDATE_DISCOVERY_SECTION: SettingsSectionId =
  'candidate-discovery-general'

/** Default landing page when opening Offer Management parent. */
export const DEFAULT_OFFER_MANAGEMENT_SECTION: SettingsSectionId =
  'offer-management-stages-status'

/** Default landing page when opening Talent CRM parent. */
export const DEFAULT_TALENT_CRM_SECTION: SettingsSectionId =
  'talent-crm-usage-limits'

/** Default landing page when opening Jeeves AI parent. */
export const DEFAULT_JEEVES_AI_SECTION: SettingsSectionId = 'jeeves-ai-general'

/** Default landing page when opening Communication Hub parent. */
export const DEFAULT_COMMUNICATION_HUB_SECTION: SettingsSectionId =
  'communication-hub-assignment-handover'

/** Default landing page when opening 1 Way Interview parent. */
export const DEFAULT_ONE_WAY_INTERVIEW_SECTION: SettingsSectionId =
  'one-way-interview-default'

/** Default landing page when opening 2 Way Interview parent. */
export const DEFAULT_TWO_WAY_INTERVIEW_SECTION: SettingsSectionId =
  'two-way-interview-configuration'

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
  if (id === 'offer-management') return 'Offer Management'
  if (id === 'jeeves-ai') return 'Jeeves AI'
  if (id === 'communication-hub') return 'Communication Hub'
  if (id === 'one-way-interview') return '1 Way Interview'
  if (id === 'two-way-interview') return '2 Way Interview'
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
  if (sectionId === 'jobs') return DEFAULT_JOBS_SECTION
  if (sectionId === 'candidates') return DEFAULT_CANDIDATES_SECTION
  if (sectionId === 'candidate-discovery') return DEFAULT_CANDIDATE_DISCOVERY_SECTION
  if (sectionId === 'offer-management') return DEFAULT_OFFER_MANAGEMENT_SECTION
  if (sectionId === 'talent-crm') return DEFAULT_TALENT_CRM_SECTION
  if (sectionId === 'jeeves-ai') return DEFAULT_JEEVES_AI_SECTION
  if (sectionId === 'communication-hub') return DEFAULT_COMMUNICATION_HUB_SECTION
  if (sectionId === 'one-way-interview') return DEFAULT_ONE_WAY_INTERVIEW_SECTION
  if (sectionId === 'two-way-interview') return DEFAULT_TWO_WAY_INTERVIEW_SECTION
  return sectionId
}
