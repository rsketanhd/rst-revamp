export const STATUS_TONE_CLASS = {
  green: 'bg-[#E3F5EA] text-[#1F8F57]',
  amber: 'bg-[#FFF5E3] text-[#B56A00]',
  blue: 'bg-[#E5F0FB] text-[#1F5F9E]',
  grey: 'bg-[#EEEFF4] text-[#7A756C]',
  purple: 'bg-[#F3EEFF] text-[#6D5BD0]',
  orange: 'bg-[#FFF1E8] text-[#C2410C]',
  red: 'bg-[#FDF2F5] text-[#C44B7A]',
} as const

export type StatusTone = keyof typeof STATUS_TONE_CLASS

export type RecruiterKpi = {
  id: string
  label: string
  value: string
  href: string
}

export type LatestApplicant = {
  id: string
  candidateId: string
  name: string
  initials: string
  avatarTone: string
  jobTitle: string
  status: string
  statusTone: StatusTone
  appliedAt: string
}

export type JobOverviewFilter = 'full' | 'part' | 'all'

export type RecruiterJobRow = {
  id: string
  name: string
  initials: string
  avatarTone: string
  active: number
  hired: number
  rejected: number
  filters: JobOverviewFilter[]
}

export type ActivitySlice = {
  id: string
  label: string
  value: number
  color: string
}

export type VelocityStat = {
  id: string
  label: string
  value: string
  unit: string
  hint: string
  accent: string
}

export type EngagementKpi = {
  id: string
  label: string
  value: string
  hint: string
}

export type EngagementSegment = {
  id: string
  segment: string
  active: string
  newCount: string
}

export type GrowthTrend = {
  id: string
  title: string
  value: string
  change: string
  changePositive: boolean
  points: number[]
  color: string
}

export type PipelineMetric = {
  id: string
  label: string
  value: string
  color: string
}

export type PipelineBarItem = {
  id: string
  label: string
  value: number
  color: string
}

export type PipelineStage = {
  id: string
  step: number
  title: string
  count: string
  change: string
  changePositive: boolean
  color: string
}

export type ActiveCandidateKpi = {
  id: string
  label: string
  value: string
  className: string
}

export type CandidateJobFilter = 'all' | 'active' | 'closed' | 'paused'

export type ActiveCandidate = {
  id: string
  candidateId: string
  name: string
  initials: string
  avatarTone: string
  role: string
  company: string
  status: string
  statusTone: StatusTone
  lastActivity: string
  department: string
  score: string
  jobFilter: CandidateJobFilter
}

export type ActivityTabId =
  | 'sharing'
  | 'interview'
  | 'todo'
  | 'rank'
  | 'live'

export type ActivityTab = {
  id: ActivityTabId
  label: string
  count: number
  accent: string
  hint: string
}

export type UpcomingActivity = {
  id: string
  title: string
  meta: string
  badge: string
  badgeTone: StatusTone
  when: string
  actionLabel: string
  tabId: ActivityTabId
  href: string
  candidateId?: string
}

export const RECRUITER_DASHBOARD_KPIS: RecruiterKpi[] = [
  {
    id: 'candidates',
    label: 'Total Candidates',
    value: '84',
    href: '/candidates',
  },
  {
    id: 'applications',
    label: 'Total Applications',
    value: '62',
    href: '/jobs',
  },
  {
    id: 'selected',
    label: 'Total Selected Candidates',
    value: '38',
    href: '/candidates',
  },
  {
    id: 'active-jobs',
    label: 'Active Jobs',
    value: '19',
    href: '/jobs',
  },
  {
    id: 'onboard',
    label: 'Total Onboard',
    value: '09',
    href: '/offer-management',
  },
  {
    id: 'hired',
    label: 'Total Hired',
    value: '01',
    href: '/offer-management',
  },
]

export const LATEST_APPLICANTS: LatestApplicant[] = [
  {
    id: 'a1',
    candidateId: 'C100123',
    name: 'Maryum Zulfiqar',
    initials: 'MZ',
    avatarTone: '#E8EEF9',
    jobTitle: 'Senior Python Developer',
    status: 'Applied',
    statusTone: 'green',
    appliedAt: '2h ago',
  },
  {
    id: 'a2',
    candidateId: 'C100124',
    name: 'Farrah Gail Mendoza',
    initials: 'FM',
    avatarTone: '#E3F5EA',
    jobTitle: 'Frontend Engineer',
    status: 'Screening',
    statusTone: 'blue',
    appliedAt: '4h ago',
  },
  {
    id: 'a3',
    candidateId: 'C100125',
    name: 'Kyun Deok-su',
    initials: 'KD',
    avatarTone: '#FFF5E3',
    jobTitle: 'SDET Lead',
    status: 'Interview',
    statusTone: 'purple',
    appliedAt: 'Yesterday',
  },
  {
    id: 'a4',
    candidateId: 'C100126',
    name: 'Nipa Shrestha',
    initials: 'NS',
    avatarTone: '#F3EEFF',
    jobTitle: 'Product Designer',
    status: 'Applied',
    statusTone: 'green',
    appliedAt: 'Yesterday',
  },
  {
    id: 'a5',
    candidateId: 'C100127',
    name: 'Aman Kr. Masani',
    initials: 'AM',
    avatarTone: '#E5F0FB',
    jobTitle: 'DevOps Engineer',
    status: 'Shortlisted',
    statusTone: 'amber',
    appliedAt: '2d ago',
  },
]

export const RECRUITER_JOB_OVERVIEW: RecruiterJobRow[] = [
  {
    id: 'r1',
    name: 'Maria Brooks',
    initials: 'MB',
    avatarTone: '#E3F5EA',
    active: 2,
    hired: 4,
    rejected: 0,
    filters: ['full', 'all'],
  },
  {
    id: 'r2',
    name: 'Noah Kim',
    initials: 'NK',
    avatarTone: '#F3EEFF',
    active: 5,
    hired: 2,
    rejected: 1,
    filters: ['full', 'part', 'all'],
  },
  {
    id: 'r3',
    name: 'Priya Rao',
    initials: 'PR',
    avatarTone: '#E8EEF9',
    active: 3,
    hired: 6,
    rejected: 2,
    filters: ['part', 'all'],
  },
  {
    id: 'r4',
    name: 'Alex Stone',
    initials: 'AS',
    avatarTone: '#FFF5E3',
    active: 1,
    hired: 3,
    rejected: 0,
    filters: ['full', 'all'],
  },
  {
    id: 'r5',
    name: 'Jordan Lee',
    initials: 'JL',
    avatarTone: '#E5F0FB',
    active: 4,
    hired: 1,
    rejected: 3,
    filters: ['part', 'all'],
  },
]

export const ACTIVITY_STATUS_SLICES: ActivitySlice[] = [
  { id: 'active', label: 'Active', value: 19, color: '#22C55E' },
  { id: 'on-hold', label: 'On Hold', value: 5, color: '#3B82F6' },
  { id: 'draft', label: 'Draft', value: 12, color: '#EAB308' },
  { id: 'expired', label: 'Expired', value: 4, color: '#1F1D4F' },
]

export const HIRING_VELOCITY_STATS: VelocityStat[] = [
  {
    id: 'tth',
    label: 'Avg Time to Hire',
    value: '26.5',
    unit: 'Avg. working days',
    hint: 'Compared to last period across open requisitions.',
    accent: '#2D2061',
  },
  {
    id: 'fill',
    label: 'Fill Rate',
    value: '84.2%',
    unit: 'Overall Fill Rate',
    hint: 'Offers accepted versus roles opened this period.',
    accent: '#1F8F57',
  },
  {
    id: 'interview',
    label: 'Avg Time per Interview',
    value: '4',
    unit: 'Hours / Interview',
    hint: 'Average scheduled interview duration this period.',
    accent: '#6D5BD0',
  },
]

export const LICENSE_SEGMENTS: ActivitySlice[] = [
  { id: 'utilized', label: 'Seats Utilized', value: 42, color: '#6D5BD0' },
  { id: 'active', label: 'Active', value: 28, color: '#22C55E' },
  { id: 'used', label: 'Used', value: 18, color: '#3B82F6' },
  { id: 'vacant', label: 'Vacant', value: 12, color: '#E8E6F0' },
]

export const LICENSE_DONUT: ActivitySlice[] = [
  { id: 'recruiters', label: 'Recruiters', value: 36, color: '#2D2061' },
  { id: 'managers', label: 'Hiring Managers', value: 22, color: '#6D5BD0' },
  { id: 'admins', label: 'Admins', value: 8, color: '#22C55E' },
  { id: 'viewers', label: 'Viewers', value: 14, color: '#F59E0B' },
]

export const PLATFORM_ENGAGEMENT_KPIS: EngagementKpi[] = [
  { id: 'sessions', label: 'Total Sessions', value: '1,284', hint: 'Last 30 days' },
  { id: 'views', label: 'Profile Views', value: '3,912', hint: 'Candidate profiles' },
  { id: 'published', label: 'Jobs Published', value: '54', hint: 'This month' },
]

export const CANDIDATE_ENGAGEMENT_RATE = 67.2

export const PLATFORM_ENGAGEMENT_SEGMENTS: EngagementSegment[] = [
  { id: 'recruiters', segment: 'Recruiters', active: '48', newCount: '6' },
  { id: 'managers', segment: 'Hiring Managers', active: '32', newCount: '4' },
  { id: 'candidates', segment: 'Candidates', active: '1,204', newCount: '186' },
]

export const GROWTH_TRENDS: GrowthTrend[] = [
  {
    id: 'jobs',
    title: 'Job Creation Trend',
    value: '54 jobs posted this month',
    change: '+12.5%',
    changePositive: true,
    points: [18, 22, 20, 28, 32, 30, 38, 42, 48, 54],
    color: '#2D2061',
  },
  {
    id: 'apps',
    title: 'Application Trends',
    value: '812 applications received',
    change: '+5.2%',
    changePositive: true,
    points: [40, 48, 45, 52, 58, 55, 62, 70, 74, 80],
    color: '#3B82F6',
  },
  {
    id: 'pool',
    title: 'Candidate Pool Growth Trend',
    value: '18,450 total talent pool',
    change: '+8.5%',
    changePositive: true,
    points: [50, 52, 55, 58, 60, 63, 68, 72, 76, 82],
    color: '#22C55E',
  },
]

export const PIPELINE_SUMMARY: {
  total: string
  metrics: PipelineMetric[]
} = {
  total: '5,340',
  metrics: [
    { id: 'new', label: 'New Applied', value: '6,310', color: '#22C55E' },
    { id: 'stage', label: 'In Stage', value: '2,230', color: '#6D5BD0' },
    { id: 'shortlist', label: 'Shortlisted', value: '150', color: '#1F8F57' },
    { id: 'interview', label: 'Interview', value: '45', color: '#3B82F6' },
    { id: 'hired', label: 'Hired', value: '20', color: '#EAB308' },
  ],
}

export const PIPELINE_BAR_ITEMS: PipelineBarItem[] = [
  { id: 's1', label: 'Sourced', value: 1489, color: '#6D5BD0' },
  { id: 's2', label: 'Applied', value: 1743, color: '#3B82F6' },
  { id: 's3', label: 'Screened', value: 389, color: '#EC4899' },
  { id: 's4', label: 'HM Review', value: 236, color: '#F59E0B' },
  { id: 's5', label: 'Assessment', value: 130, color: '#22C55E' },
  { id: 's6', label: 'Panel', value: 258, color: '#8B5CF6' },
  { id: 's7', label: 'Exec Review', value: 110, color: '#06B6D4' },
  { id: 's8', label: 'Offer', value: 15, color: '#F97316' },
  { id: 's9', label: 'Hired', value: 5, color: '#14B8A6' },
  { id: 's10', label: 'Archive', value: 98, color: '#94A3B8' },
]

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'p1',
    step: 1,
    title: 'Sourced & Enrolled',
    count: '1,489',
    change: '+7.2%',
    changePositive: true,
    color: '#6D5BD0',
  },
  {
    id: 'p2',
    step: 2,
    title: 'Inbound Applications',
    count: '1,743',
    change: '+3.5%',
    changePositive: true,
    color: '#3B82F6',
  },
  {
    id: 'p3',
    step: 3,
    title: 'Administrative Screened',
    count: '389',
    change: '+0.5%',
    changePositive: true,
    color: '#EC4899',
  },
  {
    id: 'p4',
    step: 4,
    title: 'Hiring Manager Review',
    count: '236',
    change: '-0.1%',
    changePositive: false,
    color: '#F59E0B',
  },
  {
    id: 'p5',
    step: 5,
    title: 'Intro-Call & Tech Assessment',
    count: '130',
    change: '+2.1%',
    changePositive: true,
    color: '#22C55E',
  },
  {
    id: 'p6',
    step: 6,
    title: 'Live Panel & HM Round',
    count: '258',
    change: '+3.6%',
    changePositive: true,
    color: '#8B5CF6',
  },
  {
    id: 'p7',
    step: 7,
    title: 'Executive & VP Review',
    count: '110',
    change: '+1.7%',
    changePositive: true,
    color: '#06B6D4',
  },
  {
    id: 'p8',
    step: 8,
    title: 'Offer Decision & Extension',
    count: '15',
    change: '-0.4%',
    changePositive: false,
    color: '#F97316',
  },
  {
    id: 'p9',
    step: 9,
    title: 'Hired & Onboarding',
    count: '05',
    change: '+0.1%',
    changePositive: true,
    color: '#14B8A6',
  },
  {
    id: 'p10',
    step: 10,
    title: 'Archive / Not Hired',
    count: '98',
    change: '-1.2%',
    changePositive: false,
    color: '#94A3B8',
  },
]

export const ACTIVE_CANDIDATE_KPIS: ActiveCandidateKpi[] = [
  {
    id: 'total',
    label: 'Total Active Candidates',
    value: '5,272',
    className: 'bg-[#EEF2FF] text-[#2D2061]',
  },
  {
    id: 'engaged',
    label: 'Active — Engaged',
    value: '342',
    className: 'bg-[#E3F5EA] text-[#1F6B45]',
  },
  {
    id: 'retained',
    label: 'Active — Retained',
    value: '1,360',
    className: 'bg-[#E5F0FB] text-[#1F5F9E]',
  },
  {
    id: 'success',
    label: 'Avg Success Rate',
    value: '84.2%',
    className: 'bg-[#FFF5E3] text-[#B56A00]',
  },
]

export const ACTIVE_CANDIDATES: ActiveCandidate[] = [
  {
    id: 'c1',
    candidateId: 'C100123',
    name: 'Priya Nair',
    initials: 'P',
    avatarTone: '#E8EEF9',
    role: 'Senior Frontend Developer',
    company: 'TechNova',
    status: 'Active Now',
    statusTone: 'green',
    lastActivity: '5 mins ago',
    department: 'Engineering',
    score: '92%',
    jobFilter: 'active',
  },
  {
    id: 'c2',
    candidateId: 'C100124',
    name: 'Gabriel Ortiz',
    initials: 'G',
    avatarTone: '#E3F5EA',
    role: 'Product Manager',
    company: 'Orbit Labs',
    status: 'In Review',
    statusTone: 'blue',
    lastActivity: '28 mins ago',
    department: 'Product',
    score: '88%',
    jobFilter: 'active',
  },
  {
    id: 'c3',
    candidateId: 'C100125',
    name: 'Mei Lin',
    initials: 'M',
    avatarTone: '#FCE7F3',
    role: 'UX Researcher',
    company: 'BrightPath',
    status: 'Active Now',
    statusTone: 'green',
    lastActivity: '1h ago',
    department: 'Design',
    score: '95%',
    jobFilter: 'paused',
  },
  {
    id: 'c4',
    candidateId: 'C100126',
    name: 'Liam Carter',
    initials: 'L',
    avatarTone: '#E5F0FB',
    role: 'Data Engineer',
    company: 'CloudNine',
    status: 'Follow-up',
    statusTone: 'amber',
    lastActivity: '3h ago',
    department: 'Data',
    score: '81%',
    jobFilter: 'closed',
  },
  {
    id: 'c5',
    candidateId: 'C100127',
    name: 'Rina Kapoor',
    initials: 'R',
    avatarTone: '#FFF5E3',
    role: 'Marketing Lead',
    company: 'Pulse Media',
    status: 'Active Now',
    statusTone: 'green',
    lastActivity: 'Yesterday',
    department: 'Marketing',
    score: '90%',
    jobFilter: 'active',
  },
]

export const ACTIVITY_TABS: ActivityTab[] = [
  {
    id: 'sharing',
    label: 'Sharing',
    count: 12,
    accent: 'text-[#C44B7A]',
    hint: '3 applicants are sharing profiles.',
  },
  {
    id: 'interview',
    label: 'Interview Flow',
    count: 3,
    accent: 'text-[#2D2061]',
    hint: '24 new candidates reached interview.',
  },
  {
    id: 'todo',
    label: 'To-Do List',
    count: 2,
    accent: 'text-[#2D2061]',
    hint: '2 tasks to finish soon.',
  },
  {
    id: 'rank',
    label: 'Daily Rank',
    count: 3,
    accent: 'text-[#C44B7A]',
    hint: 'Ranked list generated today.',
  },
  {
    id: 'live',
    label: 'Live Profile',
    count: 4,
    accent: 'text-[#1F5F9E]',
    hint: 'Candidates with live profiles.',
  },
]

export const UPCOMING_ACTIVITIES: UpcomingActivity[] = [
  {
    id: 'u1',
    title: 'Schedule technical interview — Fullstack Developer',
    meta: 'Atrin Team · India (Remote)',
    badge: 'URGENT',
    badgeTone: 'orange',
    when: '20 minutes ago',
    actionLabel: 'Modify',
    tabId: 'interview',
    href: '/e2e-interviews/scheduler',
    candidateId: 'C100123',
  },
  {
    id: 'u2',
    title: 'Final interview with Lead Designer',
    meta: 'BrightPath · Hybrid',
    badge: 'IN REVIEW',
    badgeTone: 'purple',
    when: 'Today, 3:30 PM',
    actionLabel: 'Open',
    tabId: 'interview',
    href: '/e2e-interviews/two-way/scheduled',
    candidateId: 'C100124',
  },
  {
    id: 'u3',
    title: 'Send offer letter — Cloud Security Engineer',
    meta: 'Orbit Labs · Onsite',
    badge: 'ACTIVE',
    badgeTone: 'green',
    when: 'Tomorrow, 10:00 AM',
    actionLabel: 'Apply',
    tabId: 'todo',
    href: '/offer-management/new',
    candidateId: 'C100125',
  },
  {
    id: 'u4',
    title: 'Screening call — Backend Engineer',
    meta: 'TechNova · Remote',
    badge: 'NEW',
    badgeTone: 'blue',
    when: 'Thu, 11:15 AM',
    actionLabel: 'Open',
    tabId: 'todo',
    href: '/e2e-interviews/scheduler',
    candidateId: 'C100126',
  },
  {
    id: 'u5',
    title: 'Share shortlist with hiring manager',
    meta: 'Pulse Media · Hybrid',
    badge: 'NEW',
    badgeTone: 'blue',
    when: 'Today, 5:00 PM',
    actionLabel: 'Share',
    tabId: 'sharing',
    href: '/candidates',
    candidateId: 'C100127',
  },
  {
    id: 'u6',
    title: 'Review daily ranked applicants — JR-1042',
    meta: 'SniperAI · Auto-ranked',
    badge: 'ACTIVE',
    badgeTone: 'green',
    when: 'Today, 9:00 AM',
    actionLabel: 'Open',
    tabId: 'rank',
    href: '/jobs',
  },
  {
    id: 'u7',
    title: 'Candidate live profile updated — Mei Lin',
    meta: 'BrightPath · Design',
    badge: 'NEW',
    badgeTone: 'blue',
    when: '1h ago',
    actionLabel: 'View',
    tabId: 'live',
    href: '/candidates/C100125',
    candidateId: 'C100125',
  },
]

export const PIPELINE_JOB_OPTIONS = [
  { value: 'all', label: 'All jobs' },
  { value: 'JR-1042', label: 'JR-1042' },
  { value: 'JR-1061', label: 'JR-1061' },
] as const

export type PipelineJobId = (typeof PIPELINE_JOB_OPTIONS)[number]['value']

export function sumSliceValues(slices: Array<{ value: number }>): number {
  return slices.reduce((sum, slice) => sum + slice.value, 0)
}

export function getJobOverviewRows(filter: JobOverviewFilter): RecruiterJobRow[] {
  return RECRUITER_JOB_OVERVIEW.filter((row) => row.filters.includes(filter))
}

const VELOCITY_BY_PERIOD: Record<string, VelocityStat[]> = {
  '24h': [
    {
      id: 'tth',
      label: 'Avg Time to Hire',
      value: '0.8',
      unit: 'Avg. working days',
      hint: 'Roles advanced in the last 24 hours.',
      accent: '#2D2061',
    },
    {
      id: 'fill',
      label: 'Fill Rate',
      value: '12.0%',
      unit: 'Overall Fill Rate',
      hint: 'Offers closed in the last 24 hours.',
      accent: '#1F8F57',
    },
    {
      id: 'interview',
      label: 'Avg Time per Interview',
      value: '3.5',
      unit: 'Hours / Interview',
      hint: 'Interviews completed today.',
      accent: '#6D5BD0',
    },
  ],
  '7d': [
    {
      id: 'tth',
      label: 'Avg Time to Hire',
      value: '18.2',
      unit: 'Avg. working days',
      hint: 'Compared to the previous 7 days.',
      accent: '#2D2061',
    },
    {
      id: 'fill',
      label: 'Fill Rate',
      value: '61.4%',
      unit: 'Overall Fill Rate',
      hint: 'Offers accepted this week.',
      accent: '#1F8F57',
    },
    {
      id: 'interview',
      label: 'Avg Time per Interview',
      value: '3.8',
      unit: 'Hours / Interview',
      hint: 'Average interview duration this week.',
      accent: '#6D5BD0',
    },
  ],
  '30d': HIRING_VELOCITY_STATS,
  '1y': [
    {
      id: 'tth',
      label: 'Avg Time to Hire',
      value: '32.1',
      unit: 'Avg. working days',
      hint: 'Trailing twelve-month average.',
      accent: '#2D2061',
    },
    {
      id: 'fill',
      label: 'Fill Rate',
      value: '79.6%',
      unit: 'Overall Fill Rate',
      hint: 'Offers accepted over the last year.',
      accent: '#1F8F57',
    },
    {
      id: 'interview',
      label: 'Avg Time per Interview',
      value: '4.2',
      unit: 'Hours / Interview',
      hint: 'Yearly average interview duration.',
      accent: '#6D5BD0',
    },
  ],
}

export function getVelocityStats(period: string): VelocityStat[] {
  return VELOCITY_BY_PERIOD[period] ?? HIRING_VELOCITY_STATS
}

const TREND_SCALE: Record<string, number> = {
  week: 0.35,
  '1m': 1,
  '3m': 2.4,
  year: 8.5,
}

function growthTrendSuffix(period: string): string {
  switch (period) {
    case 'week':
      return 'this week'
    case '3m':
      return 'last 3 months'
    case 'year':
      return 'this year'
    default:
      return 'this month'
  }
}

function growthTrendValue(
  trendId: string,
  scale: number,
  suffix: string,
): string {
  switch (trendId) {
    case 'jobs':
      return `${Math.max(1, Math.round(54 * scale))} jobs posted ${suffix}`
    case 'apps':
      return `${Math.max(1, Math.round(812 * scale)).toLocaleString('en-US')} applications ${suffix}`
    default:
      return `${Math.max(1, Math.round(18450 * Math.min(scale, 1.2))).toLocaleString('en-US')} total talent pool`
  }
}

export function getGrowthTrends(period: string): GrowthTrend[] {
  const scale = TREND_SCALE[period] ?? 1
  const suffix = growthTrendSuffix(period)

  return GROWTH_TRENDS.map((trend) => ({
    ...trend,
    points: trend.points.map((point) =>
      Math.max(1, Math.round(point * scale)),
    ),
    value: growthTrendValue(trend.id, scale, suffix),
  }))
}

export function getPipelineForJob(jobId: PipelineJobId): {
  total: string
  metrics: PipelineMetric[]
  bars: PipelineBarItem[]
  stages: PipelineStage[]
} {
  if (jobId === 'all') {
    return {
      total: PIPELINE_SUMMARY.total,
      metrics: PIPELINE_SUMMARY.metrics,
      bars: PIPELINE_BAR_ITEMS,
      stages: PIPELINE_STAGES,
    }
  }

  const factor = jobId === 'JR-1042' ? 0.42 : 0.28
  const bars = PIPELINE_BAR_ITEMS.map((item) => ({
    ...item,
    value: Math.max(1, Math.round(item.value * factor)),
  }))
  const stages = PIPELINE_STAGES.map((stage, index) => ({
    ...stage,
    count: String(bars[index]?.value ?? 0),
  }))
  const total = bars.reduce((sum, item) => sum + item.value, 0)

  return {
    total: total.toLocaleString('en-US'),
    metrics: PIPELINE_SUMMARY.metrics.map((metric) => ({
      ...metric,
      value: Math.max(
        1,
        Math.round(Number(metric.value.replace(/,/g, '')) * factor),
      ).toLocaleString('en-US'),
    })),
    bars,
    stages,
  }
}

export function getActiveCandidates(
  filter: CandidateJobFilter,
): ActiveCandidate[] {
  if (filter === 'all') return ACTIVE_CANDIDATES
  return ACTIVE_CANDIDATES.filter((row) => row.jobFilter === filter)
}

const KPI_BY_PERIOD: Record<string, ActiveCandidateKpi[]> = {
  day: [
    {
      id: 'total',
      label: 'Total Active Candidates',
      value: '186',
      className: 'bg-[#EEF2FF] text-[#2D2061]',
    },
    {
      id: 'engaged',
      label: 'Active — Engaged',
      value: '42',
      className: 'bg-[#E3F5EA] text-[#1F6B45]',
    },
    {
      id: 'retained',
      label: 'Active — Retained',
      value: '64',
      className: 'bg-[#E5F0FB] text-[#1F5F9E]',
    },
    {
      id: 'success',
      label: 'Avg Success Rate',
      value: '71.0%',
      className: 'bg-[#FFF5E3] text-[#B56A00]',
    },
  ],
  week: ACTIVE_CANDIDATE_KPIS,
  month: [
    {
      id: 'total',
      label: 'Total Active Candidates',
      value: '5,272',
      className: 'bg-[#EEF2FF] text-[#2D2061]',
    },
    {
      id: 'engaged',
      label: 'Active — Engaged',
      value: '842',
      className: 'bg-[#E3F5EA] text-[#1F6B45]',
    },
    {
      id: 'retained',
      label: 'Active — Retained',
      value: '2,110',
      className: 'bg-[#E5F0FB] text-[#1F5F9E]',
    },
    {
      id: 'success',
      label: 'Avg Success Rate',
      value: '84.2%',
      className: 'bg-[#FFF5E3] text-[#B56A00]',
    },
  ],
  quarter: [
    {
      id: 'total',
      label: 'Total Active Candidates',
      value: '9,840',
      className: 'bg-[#EEF2FF] text-[#2D2061]',
    },
    {
      id: 'engaged',
      label: 'Active — Engaged',
      value: '1,920',
      className: 'bg-[#E3F5EA] text-[#1F6B45]',
    },
    {
      id: 'retained',
      label: 'Active — Retained',
      value: '3,450',
      className: 'bg-[#E5F0FB] text-[#1F5F9E]',
    },
    {
      id: 'success',
      label: 'Avg Success Rate',
      value: '81.5%',
      className: 'bg-[#FFF5E3] text-[#B56A00]',
    },
  ],
  year: [
    {
      id: 'total',
      label: 'Total Active Candidates',
      value: '18,450',
      className: 'bg-[#EEF2FF] text-[#2D2061]',
    },
    {
      id: 'engaged',
      label: 'Active — Engaged',
      value: '4,210',
      className: 'bg-[#E3F5EA] text-[#1F6B45]',
    },
    {
      id: 'retained',
      label: 'Active — Retained',
      value: '7,880',
      className: 'bg-[#E5F0FB] text-[#1F5F9E]',
    },
    {
      id: 'success',
      label: 'Avg Success Rate',
      value: '78.9%',
      className: 'bg-[#FFF5E3] text-[#B56A00]',
    },
  ],
}

export function getActiveCandidateKpis(period: string): ActiveCandidateKpi[] {
  return KPI_BY_PERIOD[period] ?? ACTIVE_CANDIDATE_KPIS
}

export function getActivitiesForTab(tabId: ActivityTabId): UpcomingActivity[] {
  return UPCOMING_ACTIVITIES.filter((item) => item.tabId === tabId)
}
