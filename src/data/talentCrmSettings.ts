export type TalentCrmStage = {
  id: string
  name: string
  alwaysShown: boolean
}

export type AtsSubStage = {
  id: string
  name: string
  enabled: boolean
}

export type AtsStage = {
  id: string
  name: string
  count: number
  enabled: boolean
  subStages: AtsSubStage[]
}

export type BadgeRuleType =
  | 'Application status'
  | 'Alumni'
  | 'Source / role'
  | 'Silver medalist'
  | 'VIP'

export type BadgeRule = {
  id: string
  badge: string
  ruleType: BadgeRuleType
  description: string
  badgedCount: number
  applicationStages: string[]
  jobStatus: string
  appliedOnOrAfter: string
  appliedBefore: string
}

export const TALENT_CRM_STAGES: TalentCrmStage[] = [
  { id: 'lead', name: 'Lead', alwaysShown: true },
  { id: 'engaged', name: 'Engaged', alwaysShown: true },
]

export const ATS_STAGES: AtsStage[] = [
  {
    id: 'application-started',
    name: 'Application Started',
    count: 1,
    enabled: true,
    subStages: [
      { id: 'as-new', name: 'New', enabled: true },
      { id: 'as-in-progress', name: 'In Progress', enabled: false },
    ],
  },
  {
    id: 'screen',
    name: 'Screen',
    count: 11,
    enabled: true,
    subStages: [
      { id: 'sc-phone', name: 'Phone Screen', enabled: true },
      { id: 'sc-recruiter', name: 'Recruiter Screen', enabled: true },
    ],
  },
  {
    id: 'interview',
    name: 'Interview',
    count: 6,
    enabled: true,
    subStages: [
      { id: 'in-first', name: 'First Interview', enabled: true },
      { id: 'in-final', name: 'Final Interview', enabled: false },
    ],
  },
  {
    id: 'assessment',
    name: 'Assessment',
    count: 4,
    enabled: true,
    subStages: [{ id: 'asmt-tech', name: 'Technical', enabled: true }],
  },
  {
    id: 'offer',
    name: 'Offer',
    count: 3,
    enabled: true,
    subStages: [
      { id: 'of-extended', name: 'Extended', enabled: true },
      { id: 'of-accepted', name: 'Accepted', enabled: false },
    ],
  },
  {
    id: 'background-check',
    name: 'Background Check',
    count: 2,
    enabled: true,
    subStages: [],
  },
  {
    id: 'ready-for-hire',
    name: 'Ready for Hire',
    count: 1,
    enabled: true,
    subStages: [],
  },
  {
    id: 'rejected',
    name: 'Rejected',
    count: 21,
    enabled: true,
    subStages: [],
  },
]

export const BADGE_RULE_TYPE_OPTIONS: BadgeRuleType[] = [
  'Application status',
  'Alumni',
  'Source / role',
  'Silver medalist',
  'VIP',
]

export const APPLICATION_STAGE_OPTIONS = [
  'Application Started',
  'Screen',
  'Interview',
  'Assessment',
  'Offer',
  'Background Check',
  'Ready for Hire',
  'Rejected',
]

export const JOB_STATUS_OPTIONS = [
  'Active (live/open)',
  'Inactive',
  'Draft',
  'Any status',
]

export const INITIAL_BADGE_RULES: BadgeRule[] = [
  {
    id: 'rule-active-applicant',
    badge: 'Active Applicant',
    ruleType: 'Application status',
    description:
      'Application stages: Application Started on jobs that are Active (live/open), applied on/after 2023-01-01.',
    badgedCount: 6,
    applicationStages: ['Application Started'],
    jobStatus: 'Active (live/open)',
    appliedOnOrAfter: '2025-01-01',
    appliedBefore: '',
  },
  {
    id: 'rule-alumni',
    badge: 'Alumni',
    ruleType: 'Alumni',
    description:
      'Candidates who previously worked at Rentokil initial (company history match).',
    badgedCount: 12,
    applicationStages: [],
    jobStatus: 'Any status',
    appliedOnOrAfter: '',
    appliedBefore: '',
  },
  {
    id: 'rule-referral',
    badge: 'Referral',
    ruleType: 'Source / role',
    description: 'Candidates sourced via LinkedIn or Naukri.',
    badgedCount: 18,
    applicationStages: [],
    jobStatus: 'Any status',
    appliedOnOrAfter: '',
    appliedBefore: '',
  },
  {
    id: 'rule-silver',
    badge: 'Silver Medalist',
    ruleType: 'Silver medalist',
    description:
      'Strong applicants who reached Offer, Declined or On Hold in the last 24 months.',
    badgedCount: 9,
    applicationStages: ['Offer'],
    jobStatus: 'Any status',
    appliedOnOrAfter: '',
    appliedBefore: '',
  },
  {
    id: 'rule-vip',
    badge: 'VIP',
    ruleType: 'VIP',
    description:
      'Candidates with Alumni or Silver Medalist status and a suitability score of at least 75.',
    badgedCount: 4,
    applicationStages: [],
    jobStatus: 'Any status',
    appliedOnOrAfter: '',
    appliedBefore: '',
  },
]

export function formatBadgedCount(count: number): string {
  return `${String(count).padStart(2, '0')} - Candidates currently badged`
}

export function formatDateDisplay(iso: string): string {
  if (!iso) return ''
  const [year, month, day] = iso.split('-')
  if (!year || !month || !day) return iso
  return `${day}/${month}/${year}`
}
