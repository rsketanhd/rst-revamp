import type { ReportHighlightStat } from './jobStatisticsOverview'

export type HiringStageDistributionGrouping =
  | 'jr-status'
  | 'source'
  | 'job-function'
  | 'employee-group'

export type HiringStageTransitionId =
  | 'shortlist-evaluation'
  | 'evaluation-interview'
  | 'interview-background'
  | 'background-offer'
  | 'offer-hired'

export const HIRING_STAGE_DISTRIBUTION_OPTIONS: Array<{
  value: HiringStageDistributionGrouping
  label: string
}> = [
  { value: 'jr-status', label: 'JR Status Wise' },
  { value: 'source', label: 'By Source' },
  { value: 'job-function', label: 'By Job Function' },
  { value: 'employee-group', label: 'By Employee Group' },
]

export const HIRING_STAGE_TRANSITIONS: Array<{
  id: HiringStageTransitionId
  label: string
  count: number
}> = [
  {
    id: 'shortlist-evaluation',
    label: 'In the shortlist → Evaluation',
    count: 10,
  },
  { id: 'evaluation-interview', label: 'Evaluation → Interview', count: 10 },
  {
    id: 'interview-background',
    label: 'Interview → Background check',
    count: 6,
  },
  { id: 'background-offer', label: 'Background check → Offer', count: 14 },
  { id: 'offer-hired', label: 'Offer → Hired', count: 26 },
]

export const HIRING_STAGE_DISTRIBUTION_STATS: ReportHighlightStat[] = [
  { id: 'total-jobs', label: 'Total Jobs', value: '2919' },
  { id: 'jobs-offered', label: 'Jobs Offered', value: '2017' },
  { id: 'jobs-assigned', label: 'Jobs Assigned', value: '712' },
  { id: 'total-offers', label: 'Total Offers', value: '3591' },
  { id: 'total-employees', label: 'Total Employees', value: '754' },
  { id: 'avg-offer-time', label: 'Average Offer Time', value: '25' },
  { id: 'avg-hiring-time', label: 'Average Hiring Time', value: '62' },
]

export type VerticalBarDatum = {
  id: string
  label: string
  value: number
}

const DISTRIBUTION_BY_GROUPING: Record<
  HiringStageDistributionGrouping,
  VerticalBarDatum[]
> = {
  'employee-group': [
    { id: 'permanent', label: 'Permanent Employee', value: 2442 },
    { id: 'unavailable', label: 'Unavailable', value: 180 },
    { id: 'project', label: 'Project Employee', value: 420 },
    { id: 'contractor', label: 'Contractor', value: 680 },
    { id: 'temporary', label: 'Temporary Employee', value: 1220 },
    { id: 'external-service', label: 'External Service Provider', value: 310 },
    { id: 'intern', label: 'Intern and Trainee', value: 540 },
    { id: 'external-delegate', label: 'External Delegate', value: 260 },
  ],
  'jr-status': [
    { id: 'open', label: 'Open', value: 980 },
    { id: 'on-hold', label: 'On Hold', value: 420 },
    { id: 'filled', label: 'Filled', value: 1560 },
    { id: 'cancelled', label: 'Cancelled', value: 310 },
    { id: 'draft', label: 'Draft', value: 240 },
  ],
  source: [
    { id: 'referral', label: 'Referral', value: 720 },
    { id: 'corporate', label: 'Corporate Site', value: 980 },
    { id: 'social', label: 'Social Media', value: 540 },
    { id: 'boards', label: 'Job Boards', value: 1120 },
    { id: 'agency', label: 'Agency', value: 640 },
  ],
  'job-function': [
    { id: 'tech', label: 'Technology', value: 1320 },
    { id: 'finance', label: 'Finance', value: 680 },
    { id: 'marketing', label: 'Marketing', value: 540 },
    { id: 'ops', label: 'Operations', value: 760 },
    { id: 'hr', label: 'HR', value: 420 },
  ],
}

export function getHiringStageDistributionBars(
  grouping: HiringStageDistributionGrouping,
): VerticalBarDatum[] {
  return DISTRIBUTION_BY_GROUPING[grouping]
}

const STAGE_TRENDS: Record<
  HiringStageTransitionId,
  Array<{ month: string; value: number }>
> = {
  'shortlist-evaluation': [
    { month: 'January', value: 11 },
    { month: 'February', value: 14 },
    { month: 'March', value: 18 },
    { month: 'April', value: 16 },
    { month: 'May', value: 22 },
    { month: 'June', value: 32 },
    { month: 'July', value: 28 },
    { month: 'August', value: 24 },
    { month: 'September', value: 21 },
    { month: 'October', value: 19 },
    { month: 'November', value: 17 },
    { month: 'December', value: 20 },
  ],
  'evaluation-interview': [
    { month: 'January', value: 9 },
    { month: 'February', value: 12 },
    { month: 'March', value: 15 },
    { month: 'April', value: 13 },
    { month: 'May', value: 18 },
    { month: 'June', value: 26 },
    { month: 'July', value: 23 },
    { month: 'August', value: 20 },
    { month: 'September', value: 17 },
    { month: 'October', value: 16 },
    { month: 'November', value: 14 },
    { month: 'December', value: 18 },
  ],
  'interview-background': [
    { month: 'January', value: 6 },
    { month: 'February', value: 8 },
    { month: 'March', value: 10 },
    { month: 'April', value: 9 },
    { month: 'May', value: 12 },
    { month: 'June', value: 16 },
    { month: 'July', value: 14 },
    { month: 'August', value: 13 },
    { month: 'September', value: 11 },
    { month: 'October', value: 10 },
    { month: 'November', value: 9 },
    { month: 'December', value: 12 },
  ],
  'background-offer': [
    { month: 'January', value: 12 },
    { month: 'February', value: 15 },
    { month: 'March', value: 19 },
    { month: 'April', value: 17 },
    { month: 'May', value: 21 },
    { month: 'June', value: 28 },
    { month: 'July', value: 25 },
    { month: 'August', value: 22 },
    { month: 'September', value: 20 },
    { month: 'October', value: 18 },
    { month: 'November', value: 16 },
    { month: 'December', value: 19 },
  ],
  'offer-hired': [
    { month: 'January', value: 20 },
    { month: 'February', value: 24 },
    { month: 'March', value: 28 },
    { month: 'April', value: 26 },
    { month: 'May', value: 30 },
    { month: 'June', value: 36 },
    { month: 'July', value: 33 },
    { month: 'August', value: 29 },
    { month: 'September', value: 27 },
    { month: 'October', value: 25 },
    { month: 'November', value: 23 },
    { month: 'December', value: 26 },
  ],
}

export function getHiringStageTrend(
  transitionId: HiringStageTransitionId,
): Array<{ month: string; value: number }> {
  return STAGE_TRENDS[transitionId]
}
