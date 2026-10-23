import type { UserRole } from '../lib/auth'
import { COPILOT_MATCHES, COPILOT_PROFILE } from './copilotInterview'
import {
  handleHireFlowAction,
  isHireFlowAction,
  recruiterWelcomeContent,
} from './copilotRecruiterFlow'

export type CopilotScenarioId =
  | 'profile'
  | 'resume'
  | 'jobs'
  | 'status'
  | 'recJobs'
  | 'recCandidates'
  | 'recInterviews'
  | 'recReports'

export type CopilotChipVariant = 'default' | 'primary' | 'skip' | 'danger'

export type CopilotChip = {
  id: string
  label: string
  variant?: CopilotChipVariant
  toast?: string
  job?: string
  reason?: string
}

export type CopilotGapItem = {
  key: 'exp' | 'skills' | 'prefs'
  title: string
  detail: string
}

export type CopilotJobMatch = {
  title: string
  company: string
  score: number
  why: string
}

export type CopilotParseItem = {
  title: string
  detail: string
  confidence: 'high' | 'low'
}

export type CopilotAppItem = {
  title: string
  company: string
  status: string
  statusTone: 'interview' | 'review' | 'submitted'
  next: string
}

export type CopilotTimelineStep = {
  label: string
  detail: string
  state: 'done' | 'now' | 'upcoming'
}

export type CopilotWhyItem = {
  ok: boolean
  text: string
}

export type CopilotFormField = {
  id: string
  label: string
  value: string
  kind?: 'text' | 'select' | 'textarea'
  options?: string[]
  half?: boolean
}

export type CopilotDetailCard = {
  heading: string
  badge?: string
  badgeTone?: 'amber' | 'green' | 'grey' | 'navy'
  linkLabel?: string
  rows: Array<{ label: string; value: string }>
}

export type CopilotOptionCard = {
  id: string
  icon: 'upload' | 'ai' | 'db' | 'play' | 'call'
  title: string
  description: string
  aiTag?: boolean
}

export type CopilotContinueBar = {
  emptyLabel: string
  showMoreLabel?: string
  showMoreToast?: string
  continueLabel: string
  continueId: string
}

export type CopilotPipelineRow = {
  id: string
  name: string
  title: string
  match: number
  why: string
  gap: string
  stage: string
}

export type CopilotPipelineTable = {
  heading: string
  badge?: string
  linkLabel?: string
  stages: string[]
  rows: CopilotPipelineRow[]
  shortlistId: string
}

export type CopilotConfirmBox = {
  title: string
  lines: string[]
  primary: CopilotChip
  secondary?: CopilotChip
}

export type CopilotChecklist = {
  heading?: string
  items: Array<{ label: string; done?: boolean; detail?: string }>
}

export type CopilotKpi = {
  label: string
  value: string
  hint: string
}

export type CopilotBarItem = {
  label: string
  pct: number
  score: string
}

export type CopilotTable = {
  heading?: string
  badge?: string
  columns: string[]
  rows: Array<{
    cells: string[]
    pill?: { label: string; tone: 'green' | 'amber' | 'grey' | 'blue' }
  }>
}

export type CopilotPersonCard = {
  id?: string
  name: string
  initials: string
  title: string
  score: number
  why: string[]
  source: string
  contact?: string
}

export type CopilotJobBanner = {
  title: string
  meta: string
  status: string
  apps: string
}

export type CopilotRankedApplicant = {
  name: string
  initials: string
  match: number
  experience: string
  skills: string
  status: string
}

export type CopilotRankedApplicants = {
  heading: string
  badge: string
  applicants: CopilotRankedApplicant[]
  footer: string
  primary: CopilotChip
}

export type CopilotActionNotice = {
  message: string
  meta: string[]
  undo?: CopilotChip
  primary?: CopilotChip
}

export type CopilotEmailRecipient = {
  name: string
  initials: string
  match: number
  experience: string
  email: string
  sendId: string
}

export type CopilotEmailPreview = {
  recipientsHeading: string
  recipientsBadge: string
  recipients: CopilotEmailRecipient[]
  subject: string
  body: string
  editChip: CopilotChip
  sendChip: CopilotChip
}

export type CopilotActivityReportRow = {
  candidate: string
  position: string
  city: string
  skillMatch: number
  source: string
  skills: string[]
}

export type CopilotActivityReport = {
  heading: string
  rows: CopilotActivityReportRow[]
  positions: string[]
  skills: string[]
  sources: string[]
}

export type CopilotMasterDashboardTab = {
  id: string
  label: string
  kpis: Array<{ label: string; value: string }>
  series: Array<{
    key: string
    label: string
    color: string
    fillColor: string
  }>
  points: Array<{ label: string; values: Record<string, number> }>
}

export type CopilotMasterDashboard = {
  heading: string
  periods: string[]
  defaultPeriod: string
  tabs: CopilotMasterDashboardTab[]
}

export type CopilotBotContent = {
  title?: string
  text?: string
  ring?: { pct: number; summary: string }
  gaps?: CopilotGapItem[]
  matches?: CopilotJobMatch[]
  parse?: CopilotParseItem[]
  upload?: { name: string; detail: string }
  fileCard?: { name: string; detail: string }
  form?: CopilotFormField[]
  apps?: CopilotAppItem[]
  timeline?: CopilotTimelineStep[]
  why?: CopilotWhyItem[]
  chips?: CopilotChip[]
  /** Rich recruiter / Create Job UI blocks (Claude-style) */
  detailCard?: CopilotDetailCard
  optionCards?: CopilotOptionCard[]
  confirmBox?: CopilotConfirmBox
  checklist?: CopilotChecklist
  kpis?: CopilotKpi[]
  bars?: CopilotBarItem[]
  table?: CopilotTable
  personCards?: CopilotPersonCard[]
  /** Bottom selection bar under person cards (Add to Job → Continue) */
  continueBar?: CopilotContinueBar
  /** Selectable pipeline shortlist table */
  pipelineTable?: CopilotPipelineTable
  /** Ranked new-applicants list (e.g. JR-1042 by match %) */
  rankedApplicants?: CopilotRankedApplicants
  /** Soft confirmation / audit notice (e.g. after shortlist) */
  actionNotice?: CopilotActionNotice
  /** Email draft preview with recipients */
  emailPreview?: CopilotEmailPreview
  /** Recruiterwise activity report with filters + table/chart */
  activityReport?: CopilotActivityReport
  /** Master Recruitment Dashboard (time-to-hire trends) */
  masterDashboard?: CopilotMasterDashboard
  jobBanner?: CopilotJobBanner
  successBanner?: string
}

export type CopilotScenarioState = {
  scenario: CopilotScenarioId | null
  profilePct: number
  filled: { exp: boolean; skills: boolean; prefs: boolean }
  dismissedJobs: string[]
  pendingJob: string | null
  withdrawn: string[]
  pendingWithdraw: string | null
  pickedSkills: string[]
  /** Recruiter end-to-end hire flow step (0–9). */
  hireStep: number
}

export type ScenarioActionResult = {
  state: CopilotScenarioState
  content?: CopilotBotContent
  followUp?: CopilotBotContent
  delayMs?: number
  toast?: string
}

export type CopilotScenarioOption = {
  id: CopilotScenarioId
  label: string
  description: string
}

export const COPILOT_SCENARIO_OPTIONS: CopilotScenarioOption[] = [
  {
    id: 'profile',
    label: 'Profile completion nudge',
    description: 'See what’s missing and what each item unlocks.',
  },
  {
    id: 'resume',
    label: 'Resume parsing assistant',
    description: 'Upload a newer resume and confirm what Copilot read.',
  },
  {
    id: 'jobs',
    label: 'Job recommendations',
    description: 'New matches with reasons — Copilot never applies for you.',
  },
  {
    id: 'status',
    label: 'Application status',
    description: 'Track next steps, prep, and withdraw if needed.',
  },
]

export const RECRUITER_SCENARIO_OPTIONS: CopilotScenarioOption[] = [
  {
    id: 'recJobs',
    label: 'Jobs',
    description: 'Open roles, drafts, and pipeline health.',
  },
  {
    id: 'recCandidates',
    label: 'Candidates',
    description: 'New applicants, shortlists, and discovery.',
  },
  {
    id: 'recInterviews',
    label: 'Interview Schedule',
    description: 'Today’s interviews and scheduling gaps.',
  },
  {
    id: 'recReports',
    label: 'Reports',
    description: 'Funnel, time-to-hire, and offer insights.',
  },
]

export function scenarioOptionsForRole(role: UserRole): CopilotScenarioOption[] {
  return role === 'recruiter'
    ? RECRUITER_SCENARIO_OPTIONS
    : COPILOT_SCENARIO_OPTIONS
}

const SKILL_OPTIONS = [
  'Usability Testing',
  'Accessibility (WCAG)',
  'Arabic UI / RTL',
  'Design Tokens',
] as const

const JOB_MATCHES: CopilotJobMatch[] = [
  {
    title: 'Sr. Product Designer (UI/UX)',
    company: 'Riyadh Digital Bank · Riyadh',
    score: 92,
    why: '5 of 6 skills · Riyadh · in salary band',
  },
  {
    title: 'Product Designer (UI)',
    company: 'Al Khaleej Insurance · Dubai · Hybrid',
    score: 84,
    why: '3 of 4 skills · hybrid, as you prefer',
  },
  {
    title: 'Senior UX Designer — Mobile',
    company: 'Emirates Mobility · Abu Dhabi',
    score: 81,
    why: '3 of 4 skills · senior level',
  },
]

const MORE_JOBS: CopilotJobMatch[] = [
  {
    title: 'UX Researcher',
    company: 'Tamkeen Health · Riyadh · Hybrid',
    score: 71,
    why: '3 of 4 skills · lower seniority',
  },
  {
    title: 'Design Systems Engineer',
    company: 'Riyadh Digital Bank · Riyadh',
    score: 63,
    why: '2 of 4 skills · needs React',
  },
]

const APPLICATIONS: CopilotAppItem[] = [
  {
    title: 'Data Scientist',
    company: 'Tamkeen Health',
    status: 'Interview',
    statusTone: 'interview',
    next: 'Interview Thu 18 Sep, 2:00 PM',
  },
  {
    title: 'UI/UX Designer',
    company: 'Al Khaleej Insurance',
    status: 'Under review',
    statusTone: 'review',
    next: 'Recruiter reviewing · 5 days so far',
  },
  {
    title: 'Networking Engineer',
    company: 'Helios Energy',
    status: 'Submitted',
    statusTone: 'submitted',
    next: 'Waiting for screening · 2 hours',
  },
]

const DISMISS_TUNE: Record<string, string> = {
  location: "I'll weight Abu Dhabi lower and keep Riyadh and Dubai first.",
  seniority: "I'll aim for senior-and-above roles only.",
  company: "I won't show roles from that company again.",
  salary: "I'll hide roles below your band even if the skills match.",
  other: 'Noted.',
}

function chip(
  id: string,
  label: string,
  extras: Omit<CopilotChip, 'id' | 'label'> = {},
): CopilotChip {
  return { id, label, ...extras }
}

function scenarioSwitchChips(role: UserRole = 'candidate'): CopilotChip[] {
  return scenarioOptionsForRole(role).map((option) =>
    chip(`start-${option.id}`, option.label),
  )
}

function shortJobLabel(title: string) {
  if (title.includes('Mobile')) return 'Senior UX — Mobile'
  if (title.includes('Product Designer (UI)')) return 'Product Designer (UI)'
  return 'Sr. Product Designer'
}

function activeJobs(state: CopilotScenarioState) {
  return JOB_MATCHES.filter((job) => !state.dismissedJobs.includes(job.title))
}

function activeApps(state: CopilotScenarioState) {
  return APPLICATIONS.filter((app) => !state.withdrawn.includes(app.title))
}

export function createScenarioState(): CopilotScenarioState {
  return {
    scenario: null,
    profilePct: COPILOT_PROFILE.completeness,
    filled: { exp: false, skills: false, prefs: false },
    dismissedJobs: [],
    pendingJob: null,
    withdrawn: [],
    pendingWithdraw: null,
    pickedSkills: [],
    hireStep: 0,
  }
}

export function scenarioPickerContent(
  role: UserRole = 'candidate',
): CopilotBotContent {
  if (role === 'recruiter') {
    return recruiterWelcomeContent()
  }
  return {
    title: 'What can I help with?',
    text: `Hi ${COPILOT_PROFILE.name}. Pick a topic to continue — or type anything about your profile, resume, jobs, and applications.`,
    chips: COPILOT_SCENARIO_OPTIONS.map((option) =>
      chip(`start-${option.id}`, option.label, { variant: 'default' }),
    ),
  }
}

function profileGaps(state: CopilotScenarioState): CopilotGapItem[] {
  const all: CopilotGapItem[] = [
    {
      key: 'exp',
      title: 'Work experience',
      detail: 'Unlocks experience-based matching · +15%',
    },
    {
      key: 'skills',
      title: '2–3 more skills',
      detail: 'Lifts match score on 7 jobs · +10%',
    },
    {
      key: 'prefs',
      title: 'Salary & location preferences',
      detail: "Filters out jobs you'd decline · +15%",
    },
  ]
  return all.filter((item) => !state.filled[item.key])
}

function profileCard(state: CopilotScenarioState): CopilotBotContent {
  const gaps = profileGaps(state)
  if (!gaps.length) {
    return {
      title: 'Profile complete',
      ring: {
        pct: 100,
        summary: `All done, ${COPILOT_PROFILE.name}. Recruiters now see your full profile and your matches have been re-scored.`,
      },
      chips: [chip('jobs-start', 'Show my updated matches', { variant: 'primary' })],
    }
  }

  return {
    title: `Profile ${state.profilePct}%`,
    ring: {
      pct: state.profilePct,
      summary: `${gaps.length} thing${gaps.length > 1 ? 's' : ''} left. Each one changes what I can match you to.`,
    },
    gaps,
    chips: [chip('prof-snooze', 'Remind me later', { variant: 'skip' })],
  }
}

function profileSaved(
  state: CopilotScenarioState,
  text: string,
): ScenarioActionResult {
  const card = profileCard(state)
  return {
    state,
    content: {
      title: 'Saved',
      text,
      ring: card.ring,
      gaps: card.gaps,
      chips: card.chips,
    },
  }
}

function skillsPickerContent(picked: string[]): CopilotBotContent {
  return {
    title: 'Skills',
    text: "These appear in jobs you match with but aren't on your profile. Tap the ones you have.",
    chips: [
      ...SKILL_OPTIONS.map((skill) =>
        chip(`prof-skill-toggle:${skill}`, skill, {
          variant: picked.includes(skill) ? 'primary' : 'default',
        }),
      ),
      chip('prof-skills-save', 'Add selected', { variant: 'primary' }),
      chip('prof-back', 'Cancel', { variant: 'skip' }),
    ],
  }
}

function jobsCard(state: CopilotScenarioState): CopilotBotContent {
  const matches = activeJobs(state)
  return {
    title: `${matches.length} new matches`,
    text: 'Posted since yesterday and above your 80% threshold.',
    matches,
    chips: [
      chip('job-why', 'Why the top one?'),
      chip('job-no', "One isn't for me"),
      chip('job-more', 'Show more'),
    ],
  }
}

function statusCard(state: CopilotScenarioState): CopilotBotContent {
  return {
    title: 'Your applications',
    apps: activeApps(state),
    chips: [
      chip('st-ds', "What's next for Data Scientist?", { variant: 'primary' }),
      chip('st-wait', 'How long does "under review" take?'),
      chip('st-withdraw', 'Withdraw one'),
    ],
  }
}

export function startScenario(
  id: CopilotScenarioId,
  state: CopilotScenarioState,
): { state: CopilotScenarioState; content: CopilotBotContent } {
  switch (id) {
    case 'profile': {
      const next: CopilotScenarioState = {
        ...state,
        scenario: 'profile',
        profilePct: 60,
        filled: { exp: false, skills: false, prefs: false },
      }
      return { state: next, content: profileCard(next) }
    }
    case 'resume':
      return {
        state: { ...state, scenario: 'resume' },
        content: {
          title: 'Resume',
          text: 'Your resume on file is from March 2026. Upload a newer one and I’ll read it, show you what changed, and update your profile — you approve every change first.',
          chips: [
            chip('res-upload', 'Upload new resume', { variant: 'primary' }),
            chip('res-current', "What's on file now?"),
          ],
        },
      }
    case 'jobs': {
      const next: CopilotScenarioState = {
        ...state,
        scenario: 'jobs',
        dismissedJobs: [],
        pendingJob: null,
      }
      return { state: next, content: jobsCard(next) }
    }
    case 'status': {
      const next: CopilotScenarioState = {
        ...state,
        scenario: 'status',
        withdrawn: [],
        pendingWithdraw: null,
      }
      return { state: next, content: statusCard(next) }
    }
    case 'recJobs':
      return {
        state: { ...state, scenario: 'recJobs', hireStep: 0 },
        content: recruiterJobsCard(),
      }
    case 'recCandidates':
      return {
        state: { ...state, scenario: 'recCandidates' },
        content: dataAnalystPipelineContent(),
      }
    case 'recInterviews':
      return {
        state: { ...state, scenario: 'recInterviews' },
        content: riyadhDesignersCampaignContent(),
      }
    case 'recReports':
      return {
        state: { ...state, scenario: 'recReports' },
        content: q3HiringSummaryContent(),
      }
    default: {
      const _exhaustive: never = id
      return _exhaustive
    }
  }
}

function recruiterJobsCard(): CopilotBotContent {
  return {
    title: 'Jobs',
    text: 'You can start an end-to-end hire in one prompt, or open Jobs for day-to-day work.',
    chips: [
      chip('hire-start', 'Hire a Java Developer — Pune', { variant: 'primary' }),
      chip('toast', 'Open Jobs', { toast: 'Opening Jobs' }),
      chip('toast', 'Create a new job', { toast: 'Opening Create Job' }),
    ],
  }
}

function dataAnalystPipelineContent(): CopilotBotContent {
  return {
    title: 'Data Analyst pipeline review',
    text: 'JR-1044 · Data Analyst – Bengaluru. 31 in pipeline · 8 in Screening · 3 waiting on panel feedback.',
    apps: [
      {
        title: 'Meera Kapoor',
        company: 'Data Analyst · Bengaluru',
        status: 'Panel',
        statusTone: 'interview',
        next: 'Feedback due today · 91% match',
      },
      {
        title: 'Vikram Shah',
        company: 'BI Analyst · Pune',
        status: 'Screen',
        statusTone: 'review',
        next: 'Jeeves complete · ready for VScreen',
      },
      {
        title: 'Ananya Iyer',
        company: 'Data Analyst · Hyderabad',
        status: 'New',
        statusTone: 'submitted',
        next: 'Applied yesterday · 86% match',
      },
    ],
    chips: [
      chip('toast', 'Open pipeline', {
        variant: 'primary',
        toast: 'Opening Data Analyst pipeline',
      }),
      chip('rc-shortlist', 'Suggest a shortlist'),
      chip('start-recReports', 'Compare to Q3 funnel'),
    ],
  }
}

function riyadhDesignersCampaignContent(): CopilotBotContent {
  return {
    title: 'Riyadh designers campaign',
    text: 'Active sourcing campaign for Sr. Product Designer roles in Riyadh. 126 reached · 38 replied · 12 added to jobs.',
    timeline: [
      {
        label: 'Campaign live',
        detail: 'LinkedIn + RS Plus · started 12 Sep',
        state: 'done',
      },
      {
        label: 'Best reply window',
        detail: 'Sun–Tue evenings · Arabic + English copy',
        state: 'now',
      },
      {
        label: 'Next nurture',
        detail: 'Follow-up to 26 warm leads tomorrow 10:00',
        state: 'upcoming',
      },
    ],
    chips: [
      chip('toast', 'Open campaign', {
        variant: 'primary',
        toast: 'Opening Riyadh designers campaign',
      }),
      chip('rc-discovery', 'Find more designers'),
      chip('ri-gaps', 'Book intro calls'),
    ],
  }
}

function q3HiringSummaryContent(): CopilotBotContent {
  return {
    title: 'Q3 hiring summary',
    text: 'Q3 closed with 41 hires. Time-to-hire 26 days median. Offer acceptance 74%. Strongest funnel: Engineering in Pune.',
    why: [
      { ok: true, text: '41 hires vs target 38' },
      { ok: true, text: 'Agency spend down 22% (RS Plus + database)' },
      { ok: false, text: 'Design roles averaged 34 days to hire' },
      { ok: false, text: '3 roles still open past SLA' },
    ],
    chips: [
      chip('rr-funnel', 'Show hiring funnel', { variant: 'primary' }),
      chip('rr-tth', 'Time-to-hire breakdown'),
      chip('toast', 'Export Q3 summary', { toast: 'Q3 summary exported' }),
    ],
  }
}

function handleRecruiterAction(
  actionId: string,
  state: CopilotScenarioState,
  formValues: Record<string, string> = {},
): ScenarioActionResult | null {
  if (actionId.startsWith('rc-jr1042-email-one:')) {
    const name = actionId.slice('rc-jr1042-email-one:'.length)
    return {
      state: { ...state, scenario: 'recCandidates' },
      content: {
        actionNotice: {
          message: `Email sent to ${name} for JR-1042 shortlist update.`,
          meta: [
            'Status updated',
            'Logged as Deepak Singh',
            'Audit #EML-4401',
          ],
          undo: chip('rc-jr1042-email', 'Back to preview'),
          primary: chip('rc-jr1042-email-send', 'Send to remaining →', {
            variant: 'primary',
          }),
        },
      },
    }
  }

  switch (actionId) {
    case 'rj-attention':
      return {
        state,
        content: {
          title: 'Needs attention',
          text: 'Two roles need you today.',
          matches: [
            {
              title: 'Data Scientist',
              company: 'Tamkeen Health · 9 in screening',
              score: 64,
              why: 'Oldest applicant waiting 6 days',
            },
            {
              title: 'Networking Engineer',
              company: 'Helios Energy · Draft',
              score: 0,
              why: 'Publish blocked — JD missing skills section',
            },
          ],
          chips: [
            chip('toast', 'Open Data Scientist pipeline', {
              variant: 'primary',
              toast: 'Opening job applications',
            }),
            chip('rj-draft', 'Finish Networking Engineer JD'),
            chip('start-recJobs', 'Back to Jobs', { variant: 'skip' }),
          ],
        },
      }
    case 'rj-draft':
      return {
        state,
        content: {
          title: 'Draft JD',
          text: 'Networking Engineer is 60% complete. Missing: required skills, salary band, and interview plan.',
          chips: [
            chip('toast', 'Continue in Job Analyzer', {
              variant: 'primary',
              toast: 'Opening Job Analyzer',
            }),
            chip('toast', 'Use last similar JD', {
              toast: 'Template applied from prior Networking role',
            }),
            chip('start-recJobs', 'Back', { variant: 'skip' }),
          ],
        },
      }
    case 'rj-create':
      return {
        state,
        toast: 'Opening Create Job',
        content: {
          text: 'Opening Create Job. I can prefill title and skills from a similar role if you want.',
          chips: scenarioSwitchChips('recruiter'),
        },
      }
    case 'rc-new':
      return {
        state,
        content: {
          title: 'New applicants',
          text: 'Top 3 to review first — ranked by role fit and recency.',
          apps: [
            {
              title: 'Faisal Al-Otaibi',
              company: 'Sr. Product Designer · 92%',
              status: 'New',
              statusTone: 'submitted',
              next: 'Applied 2h ago · Design Systems + Arabic UI',
            },
            {
              title: 'Noura Al-Sayed',
              company: 'Data Scientist · 88%',
              status: 'New',
              statusTone: 'submitted',
              next: 'Applied 5h ago · Python, NLP',
            },
            {
              title: 'Hassan Farid',
              company: 'Product Designer · 81%',
              status: 'New',
              statusTone: 'submitted',
              next: 'Applied yesterday · Hybrid Riyadh',
            },
          ],
          chips: [
            chip('toast', 'Open Faisal’s profile', {
              variant: 'primary',
              toast: 'Opening candidate profile',
            }),
            chip('rc-shortlist', 'Build a shortlist'),
            chip('start-recCandidates', 'Back', { variant: 'skip' }),
          ],
        },
      }
    case 'rc-shortlist':
      return {
        state,
        content: {
          title: 'Shortlist suggestion',
          text: 'For Sr. Product Designer I’d shortlist Faisal Al-Otaibi and Hassan Farid. Both clear the skills bar and are in Riyadh/hybrid.',
          chips: [
            chip('toast', 'Shortlist both', {
              variant: 'primary',
              toast: '2 candidates shortlisted',
            }),
            chip('toast', 'Only Faisal', { toast: 'Faisal shortlisted' }),
            chip('start-recCandidates', 'Back', { variant: 'skip' }),
          ],
        },
      }
    case 'rc-jr1042-shortlist':
      return {
        state: { ...state, scenario: 'recCandidates' },
        content: jr1042ShortlistNoticeContent(),
      }
    case 'rc-jr1042-undo':
      return {
        state: { ...state, scenario: 'recCandidates' },
        content: {
          successBanner:
            '✓ Shortlist undone for JR-1042. Candidates are back in Applied · New.',
          ...jr1042ApplicantsRankedContent(),
        },
      }
    case 'rc-jr1042-email':
      return {
        state: { ...state, scenario: 'recCandidates' },
        content: jr1042EmailPreviewContent(formValues),
      }
    case 'rc-jr1042-email-edit':
      return {
        state: { ...state, scenario: 'recCandidates' },
        content: jr1042EmailEditContent(formValues),
      }
    case 'rc-jr1042-email-send':
      return {
        state: { ...state, scenario: 'recCandidates' },
        content: {
          actionNotice: {
            message:
              'Email sent to 5 shortlisted candidates for JR-1042 (Rajesh Kumar, Sneha Kulkarni, Vikram Malhotra, Ananya Deshmukh, Amit Patil).',
            meta: [
              'Status updated',
              'Medium confirm policy',
              'Logged as Deepak Singh',
              'Audit #EML-8821',
            ],
            undo: chip('rc-jr1042-email', 'Back to email preview'),
            primary: chip('toast', 'Open pipeline →', {
              toast: 'Opening JR-1042 pipeline',
            }),
          },
        },
      }
    case 'rc-discovery':
      return {
        state,
        toast: 'Opening Candidate Discovery',
        content: {
          text: 'Opening Candidate Discovery with filters for senior product design in Riyadh.',
          chips: scenarioSwitchChips('recruiter'),
        },
      }
    case 'ri-today':
      return {
        state,
        content: {
          title: 'Today',
          timeline: [
            {
              label: '2:00 PM · Data Scientist',
              detail: 'Faisal Al-Otaibi · with you + Lina Al-Harbi',
              state: 'now',
            },
            {
              label: '4:30 PM · Sr. Product Designer',
              detail: 'Sara Khan · Room 3B',
              state: 'upcoming',
            },
          ],
          chips: [
            chip('ri-prep', 'Prep pack for 2:00 PM', { variant: 'primary' }),
            chip('toast', 'Add to calendar', { toast: 'Calendar synced' }),
            chip('start-recInterviews', 'Back', { variant: 'skip' }),
          ],
        },
      }
    case 'ri-gaps':
      return {
        state,
        content: {
          title: 'Scheduling gaps',
          text: 'UX Researcher panel has 3 candidates waiting. Suggested slots: Thu 11:00, Thu 15:30, Fri 10:00.',
          chips: [
            chip('toast', 'Propose all 3 slots', {
              variant: 'primary',
              toast: 'Invites sent to panel',
            }),
            chip('toast', 'Open scheduler', {
              toast: 'Opening Interview Scheduler',
            }),
            chip('start-recInterviews', 'Back', { variant: 'skip' }),
          ],
        },
      }
    case 'ri-prep':
      return {
        state,
        content: {
          title: 'Interview prep pack',
          text: 'Faisal’s highlights: 6 years UI/UX, Design Systems lead at Riyadh Digital Bank, strong Arabic RTL work. Suggested questions: product critique, design ops, stakeholder conflict.',
          chips: [
            chip('toast', 'Send pack to panel', {
              variant: 'primary',
              toast: 'Prep pack shared',
            }),
            chip('toast', 'Open scorecard', { toast: 'Opening scorecard' }),
            chip('start-recInterviews', 'Back', { variant: 'skip' }),
          ],
        },
      }
    case 'rr-funnel':
      return {
        state,
        content: {
          title: 'Hiring funnel',
          text: 'This month: 312 applied → 86 screened → 34 interviewed → 11 offered → 8 hired.',
          why: [
            { ok: true, text: 'Screen-to-interview conversion 40%' },
            { ok: false, text: 'Data Scientist screening conversion only 18%' },
            { ok: true, text: 'Offer acceptance above target' },
          ],
          chips: [
            chip('rr-tth', 'Time-to-hire next'),
            chip('toast', 'Open Job Statistics', {
              toast: 'Opening Job Statistics Overview',
            }),
            chip('start-recReports', 'Back', { variant: 'skip' }),
          ],
        },
      }
    case 'rr-tth':
      return {
        state,
        content: {
          title: 'Time-to-hire',
          text: 'Median 28 days (+2 vs last month). Technical roles: 34 days. Design roles: 22 days.',
          chips: [
            chip('toast', 'Open stage-time analytics', {
              variant: 'primary',
              toast: 'Opening Hiring Stage Time Analytics',
            }),
            chip('rr-funnel', 'Back to funnel'),
            chip('start-recReports', 'Reports home', { variant: 'skip' }),
          ],
        },
      }
    case 'rr-offers':
      return {
        state,
        toast: 'Opening Offer & Hired Distribution',
        content: {
          text: 'Opening Offer & Hired Distribution. Want a filter for this quarter only?',
          chips: [
            chip('toast', 'This quarter', { toast: 'Filter applied' }),
            ...scenarioSwitchChips('recruiter'),
          ],
        },
      }
    default:
      return null
  }
}

function handleProfileAction(
  actionId: string,
  state: CopilotScenarioState,
  formValues: Record<string, string>,
): ScenarioActionResult | null {
  switch (actionId) {
    case 'prof-exp':
      return {
        state,
        content: {
          title: 'Add work experience',
          text: "Just your most recent role for now — I'll read the rest from your resume.",
          form: [
            { id: 'p-title', label: 'Job title', value: 'Senior UI Designer' },
            { id: 'p-co', label: 'Company', value: '' },
            { id: 'p-from', label: 'From', value: '2021', half: true },
            { id: 'p-to', label: 'To', value: 'Present', half: true },
          ],
          chips: [
            chip('prof-exp-save', 'Save to profile', { variant: 'primary' }),
            chip('prof-back', 'Cancel', { variant: 'skip' }),
          ],
        },
      }
    case 'prof-exp-save': {
      const next = {
        ...state,
        filled: { ...state.filled, exp: true },
        profilePct: state.profilePct + 15,
      }
      const company = formValues['p-co']?.trim() || 'your company'
      return profileSaved(
        next,
        `Added Senior UI Designer at ${company}. You're at ${next.profilePct}%.`,
      )
    }
    case 'prof-skills':
      return {
        state: { ...state, pickedSkills: [] },
        content: skillsPickerContent([]),
      }
    case 'prof-skills-save': {
      const next = {
        ...state,
        filled: { ...state.filled, skills: true },
        profilePct: state.profilePct + 10,
      }
      const label = state.pickedSkills.length
        ? state.pickedSkills.join(', ')
        : 'no new skills'
      return profileSaved(
        next,
        `Added ${label}. You're at ${next.profilePct}%.`,
      )
    }
    case 'prof-prefs':
      return {
        state,
        content: {
          title: 'Preferences',
          form: [
            {
              id: 'p-sal',
              label: 'Minimum salary',
              value: 'SAR 20,000',
              half: true,
            },
            {
              id: 'p-mode',
              label: 'Work mode',
              value: 'Hybrid',
              kind: 'select',
              options: ['Hybrid', 'On site', 'Remote'],
              half: true,
            },
            { id: 'p-loc', label: 'Locations', value: 'Riyadh, Dubai' },
          ],
          chips: [
            chip('prof-prefs-save', 'Save to profile', { variant: 'primary' }),
            chip('prof-back', 'Cancel', { variant: 'skip' }),
          ],
        },
      }
    case 'prof-prefs-save': {
      const next = {
        ...state,
        filled: { ...state.filled, prefs: true },
        profilePct: state.profilePct + 15,
      }
      return profileSaved(
        next,
        `I'll only show jobs that fit these. You're at ${next.profilePct}%.`,
      )
    }
    case 'prof-back':
      return { state, content: profileCard(state) }
    case 'prof-snooze':
      return {
        state,
        content: {
          text: 'No problem. When should I bring this up again?',
          chips: [
            chip('prof-snoozed', 'Tomorrow'),
            chip('prof-snoozed', 'Next week'),
            chip('prof-snoozed', 'When a job needs it'),
          ],
        },
      }
    case 'prof-snoozed':
      return {
        state,
        content: {
          text: "Done — I'll stay quiet about your profile until then.",
          chips: scenarioSwitchChips(),
        },
      }
    default:
      return null
  }
}

function handleResumeAction(
  actionId: string,
  state: CopilotScenarioState,
): ScenarioActionResult | null {
  switch (actionId) {
    case 'res-current':
      return {
        state,
        content: {
          title: 'On file',
          fileCard: {
            name: 'Faisal_AlOtaibi_CV_Mar2026.pdf',
            detail: '2 pages · uploaded 14 Mar 2026 · used for 3 applications',
          },
          chips: [
            chip('res-upload', 'Upload a newer one', { variant: 'primary' }),
            chip('toast', 'Open it', { toast: 'Opening resume' }),
          ],
        },
      }
    case 'res-upload':
      return {
        state,
        content: {
          title: 'Uploading',
          upload: {
            name: 'Faisal_AlOtaibi_CV_Sep2026.pdf',
            detail: '418 KB · reading…',
          },
        },
        followUp: {
          title: "Here's what I read",
          parse: [
            {
              title: 'Senior Product Designer',
              detail: 'Current title · was "Senior UI Designer"',
              confidence: 'high',
            },
            {
              title: 'Riyadh Digital Bank · 2024–present',
              detail: 'New role added',
              confidence: 'high',
            },
            {
              title: 'Noor Telecom · 2019–2021?',
              detail: 'Dates were unclear in the PDF',
              confidence: 'low',
            },
            {
              title: '+3 skills',
              detail: 'Design Tokens, Accessibility, Motion Design',
              confidence: 'high',
            },
            {
              title: 'MSc HCI, 2023?',
              detail: 'Found in a sidebar — degree or course?',
              confidence: 'low',
            },
          ],
          text: "Two things I'm not sure about. Let's confirm them, then I'll update your profile.",
          chips: [
            chip('res-check1', 'Confirm the dates', { variant: 'primary' }),
            chip('res-apply-partial', 'Skip checks, apply the rest', {
              variant: 'skip',
            }),
          ],
        },
        delayMs: 1400,
      }
    case 'res-check1':
      return {
        state,
        content: {
          title: 'Noor Telecom',
          text: 'When were you at Noor Telecom?',
          form: [
            { id: 'r-from', label: 'From', value: '2019', half: true },
            { id: 'r-to', label: 'To', value: '2021', half: true },
          ],
          chips: [chip('res-check2', "That's right", { variant: 'primary' })],
        },
      }
    case 'res-check2':
      return {
        state,
        content: {
          title: 'MSc HCI, 2023',
          text: 'Is this a completed degree?',
          chips: [
            chip('res-apply', 'Yes, completed degree', { variant: 'primary' }),
            chip('res-apply', "It's a short course"),
            chip('res-apply', 'Remove it'),
          ],
        },
      }
    case 'res-apply':
      return {
        state,
        content: {
          title: 'Profile updated',
          text: 'Applied 5 changes: new title, new role, Noor Telecom dates, 3 skills, education. Your old resume is kept in My Documents.\n\nRe-scored your matches: 4 jobs went up, best is now Sr. Product Designer, Riyadh Digital Bank — 95%.',
          chips: [
            chip('jobs-start', 'Show matches', { variant: 'primary' }),
            chip('res-which', 'Which resume for new applications?'),
            chip('toast', 'Undo', { toast: 'Changes reverted' }),
          ],
        },
      }
    case 'res-apply-partial':
      return {
        state,
        content: {
          title: 'Partly updated',
          text: "Applied the 3 confident changes; left Noor Telecom dates and the MSc as they were. I'll ask again next time.",
          chips: [
            chip('res-check1', 'Confirm them now'),
            chip('jobs-start', 'Show matches', { variant: 'primary' }),
          ],
        },
      }
    case 'res-which':
      return {
        state,
        content: {
          text: "I'll use Sep 2026 for new applications. The three applications already in progress keep the version you applied with — recruiters see a change notice if you want to send the new one.",
          chips: [
            chip('toast', 'Send new one to all 3', {
              toast: 'New resume sent to 3 recruiters',
            }),
            chip('toast', 'Keep as is', {
              variant: 'skip',
              toast: 'Kept as is',
            }),
          ],
        },
      }
    default:
      return null
  }
}

function handleJobsAction(
  actionId: string,
  state: CopilotScenarioState,
  chipData: CopilotChip,
): ScenarioActionResult | null {
  switch (actionId) {
    case 'jobs-start': {
      const next = { ...state, scenario: 'jobs' as const }
      return { state: next, content: jobsCard(next) }
    }
    case 'job-open':
      return {
        state,
        content: {
          title: chipData.job ?? 'Job',
          text: 'Opening the job in My Jobs. I can prefill the application from your profile — you review and submit it yourself.',
          chips: [
            chip('toast', 'Open & prefill', {
              variant: 'primary',
              toast: 'Job opened with application prefilled',
            }),
            chip('toast', 'Save for later', { toast: 'Saved' }),
          ],
        },
      }
    case 'job-why':
      return {
        state,
        content: {
          title: 'Why 92% — Sr. Product Designer',
          why: [
            {
              ok: true,
              text: 'Figma, Design Systems, User Research, Prototyping, Arabic UI/RTL',
            },
            { ok: false, text: 'Motion Design — not on your profile' },
            { ok: true, text: 'Riyadh, on site — matches your preference' },
            { ok: true, text: 'SAR 22–28k — inside your band' },
            { ok: true, text: '5–10 years — you have 6' },
          ],
          text: 'Adding Motion Design would take this to about 97%, if you have it.',
          chips: [
            chip('toast', 'I have Motion Design', {
              variant: 'primary',
              toast: 'Motion Design added',
            }),
            chip('jobs-start', 'Back to matches'),
          ],
        },
      }
    case 'job-no':
      return {
        state,
        content: {
          text: "Which one, and why? I'll use it to tune future matches.",
          chips: activeJobs(state).map((job) =>
            chip('job-no-why', shortJobLabel(job.title), { job: job.title }),
          ),
        },
      }
    case 'job-no-why':
      return {
        state: { ...state, pendingJob: chipData.job ?? null },
        content: {
          text: `Got it — ${chipData.job}. What's the main reason?`,
          chips: [
            chip('job-no-done', 'Location', { reason: 'location' }),
            chip('job-no-done', 'Too junior / senior', { reason: 'seniority' }),
            chip('job-no-done', 'Company', { reason: 'company' }),
            chip('job-no-done', 'Salary', { reason: 'salary' }),
            chip('job-no-done', 'Other', { reason: 'other' }),
          ],
        },
      }
    case 'job-no-done': {
      const pending = state.pendingJob
      if (!pending) return { state, content: jobsCard(state) }
      const next = {
        ...state,
        dismissedJobs: [...state.dismissedJobs, pending],
        pendingJob: null,
      }
      const remaining = jobsCard(next)
      return {
        state: next,
        content: {
          title: 'Removed',
          text: `${DISMISS_TUNE[chipData.reason ?? 'other'] ?? 'Noted.'} Remaining matches below.`,
          matches: remaining.matches,
          chips: remaining.chips,
        },
      }
    }
    case 'job-more':
      return {
        state,
        content: {
          title: 'Next best',
          matches: MORE_JOBS,
          text: 'Below 80% I only show these on request. Want alerts at 70%+ instead?',
          chips: [
            chip('toast', 'Yes, 70%+', { toast: 'Alert threshold set to 70%' }),
            chip('jobs-start', 'Keep 80%', { variant: 'skip' }),
          ],
        },
      }
    default:
      return null
  }
}

function handleStatusAction(
  actionId: string,
  state: CopilotScenarioState,
  chipData: CopilotChip,
): ScenarioActionResult | null {
  switch (actionId) {
    case 'st-ds':
      return {
        state,
        content: {
          title: 'Data Scientist — Tamkeen Health',
          timeline: [
            { label: 'Applied', detail: '28 Aug', state: 'done' },
            { label: 'Screening call', detail: '4 Sep · passed', state: 'done' },
            {
              label: 'Technical interview',
              detail:
                'Thu 18 Sep, 2:00 PM · video, 45 min · with Lina Al-Harbi, Head of Data',
              state: 'now',
            },
            {
              label: 'Panel interview',
              detail: 'If successful, within a week',
              state: 'upcoming',
            },
            {
              label: 'Decision',
              detail: 'Typically 5 working days after panel',
              state: 'upcoming',
            },
          ],
          chips: [
            chip('st-prep', 'Prep for the interview', { variant: 'primary' }),
            chip('toast', 'Add to calendar', { toast: 'Added to calendar' }),
            chip('st-resched', 'Reschedule'),
          ],
        },
      }
    case 'st-prep':
      return {
        state,
        content: {
          title: 'Interview prep',
          text: 'Lina usually asks about model evaluation, a project you led end-to-end, and how you handle messy data. I can run a 10-minute mock with those, then give feedback.',
          chips: [
            chip('toast', 'Start mock interview', {
              variant: 'primary',
              toast: 'Mock interview started',
            }),
            chip('toast', 'Just send me tips', { toast: 'Tips sent' }),
            chip('status-start', 'Back'),
          ],
        },
      }
    case 'st-resched':
      return {
        state,
        content: {
          text: "I'll ask the recruiter for new slots. Any days that don't work?",
          chips: [
            chip('toast', 'Not Thursday', {
              toast: 'Reschedule request sent',
            }),
            chip('toast', 'Mornings only', {
              toast: 'Reschedule request sent',
            }),
            chip('st-ds', 'Never mind', { variant: 'skip' }),
          ],
        },
      }
    case 'st-wait':
      return {
        state,
        content: {
          title: 'UI/UX Designer — Al Khaleej Insurance',
          text: 'Under review for 5 days. For this employer the review stage has averaged 7 working days, so it’s still within the normal range. I’ll tell you the moment it changes.',
          chips: [
            chip('st-nudge', 'Nudge the recruiter'),
            chip('status-start', 'Back'),
          ],
        },
      }
    case 'st-nudge':
      return {
        state,
        content: {
          text: 'A polite check-in is fine after 7 days; I’d wait 2 more. Want me to draft one to send then, or open the thread now?',
          chips: [
            chip('toast', 'Remind me in 2 days', {
              variant: 'primary',
              toast: 'Reminder set for 17 Sep',
            }),
            chip('toast', 'Open thread now', {
              toast: 'Thread opened in Communication Hub',
            }),
          ],
        },
      }
    case 'st-withdraw':
      return {
        state,
        content: {
          text: 'Which application?',
          chips: [
            ...activeApps(state).map((app) =>
              chip('st-withdraw-confirm', app.title, { job: app.title }),
            ),
            chip('status-start', 'Cancel', { variant: 'skip' }),
          ],
        },
      }
    case 'st-withdraw-confirm':
      return {
        state: { ...state, pendingWithdraw: chipData.job ?? null },
        content: {
          title: `Withdraw ${chipData.job}?`,
          text: "This can't be undone and the recruiter will be notified. You can apply again later if the job is still open.",
          chips: [
            chip('st-withdrawn', 'Yes, withdraw', { variant: 'danger' }),
            chip('status-start', 'Keep it', { variant: 'skip' }),
          ],
        },
      }
    case 'st-withdrawn': {
      const pending = state.pendingWithdraw
      if (!pending) return { state, content: statusCard(state) }
      const next = {
        ...state,
        withdrawn: [...state.withdrawn, pending],
        pendingWithdraw: null,
      }
      const card = statusCard(next)
      return {
        state: next,
        content: {
          title: 'Withdrawn',
          text: `${pending} is withdrawn and the recruiter has been told.`,
          apps: card.apps,
          chips: card.chips,
        },
      }
    }
    case 'status-start':
      return { state, content: statusCard(state) }
    default:
      return null
  }
}

function handleSkillToggle(
  actionId: string,
  state: CopilotScenarioState,
): ScenarioActionResult | null {
  if (!actionId.startsWith('prof-skill-toggle:')) return null
  const skill = actionId.replace('prof-skill-toggle:', '')
  const picked = state.pickedSkills.includes(skill)
    ? state.pickedSkills.filter((item) => item !== skill)
    : [...state.pickedSkills, skill]
  return {
    state: { ...state, pickedSkills: picked },
    content: skillsPickerContent(picked),
  }
}

export function handleScenarioAction(
  actionId: string,
  state: CopilotScenarioState,
  selectedChip: CopilotChip,
  formValues: Record<string, string> = {},
): ScenarioActionResult | null {
  if (actionId.startsWith('start-')) {
    const id = actionId.replace('start-', '') as CopilotScenarioId
    const known = [...COPILOT_SCENARIO_OPTIONS, ...RECRUITER_SCENARIO_OPTIONS]
    if (!known.some((option) => option.id === id)) {
      return null
    }
    const started = startScenario(id, state)
    return { state: started.state, content: started.content }
  }

  const jr1042 = handleJr1042Action(actionId, state, selectedChip, formValues)
  if (jr1042) return jr1042

  if (actionId === 'toast') {
    return selectedChip.toast
      ? { state, toast: selectedChip.toast }
      : null
  }

  if (isHireFlowAction(actionId)) {
    const hire = handleHireFlowAction(actionId)
    if (!hire) return null
    return {
      state: {
        ...state,
        scenario: 'recJobs',
        hireStep: hire.hireStep,
      },
      content: hire.content,
      followUp: hire.followUp,
      delayMs: hire.delayMs,
      toast: hire.toast,
    }
  }

  return (
    handleSkillToggle(actionId, state) ??
    handleProfileAction(actionId, state, formValues) ??
    handleResumeAction(actionId, state) ??
    handleJobsAction(actionId, state, selectedChip) ??
    handleStatusAction(actionId, state, selectedChip) ??
    handleRecruiterAction(actionId, state, formValues)
  )
}

/** JR-1042 flow — checked before generic toast so Email/Undo CTAs always open UI. */
function handleJr1042Action(
  actionId: string,
  state: CopilotScenarioState,
  selectedChip: CopilotChip,
  formValues: Record<string, string>,
): ScenarioActionResult | null {
  const label = selectedChip.label.toLowerCase()
  const nextState = { ...state, scenario: 'recCandidates' as const }

  if (actionId.startsWith('rc-jr1042-')) {
    return handleRecruiterAction(actionId, nextState, formValues)
  }

  // Label fallbacks when an older message still carries id: 'toast'
  if (/email shortlisted candidates|back to (email )?preview/.test(label)) {
    return {
      state: nextState,
      content: jr1042EmailPreviewContent(formValues),
    }
  }
  if (label === 'edit copy') {
    return {
      state: nextState,
      content: jr1042EmailEditContent(formValues),
    }
  }
  if (/send to (5|\d+) candidates|send to remaining/.test(label)) {
    return handleRecruiterAction('rc-jr1042-email-send', nextState, formValues)
  }
  if (/shortlist top 5/.test(label)) {
    return {
      state: nextState,
      content: jr1042ShortlistNoticeContent(),
    }
  }
  if (
    label === 'undo' &&
    /shortlist|jr-1042|stg-8821/i.test(selectedChip.toast ?? '')
  ) {
    return handleRecruiterAction('rc-jr1042-undo', nextState, formValues)
  }

  return null
}

export function freeTextScenarioHint(
  text: string,
  role: UserRole = 'candidate',
): CopilotScenarioId | null {
  const normalized = text.toLowerCase()
  if (role === 'recruiter') {
    if (/java|pune|hire a|end.to.end|jr-1061/.test(normalized)) {
      return 'recJobs'
    }
    if (
      /data analyst|pipeline review|candidate|applicant|talent|shortlist|discovery/.test(
        normalized,
      )
    ) {
      return 'recCandidates'
    }
    if (
      /riyadh|designer|campaign|interview|schedule|calendar|panel/.test(
        normalized,
      )
    ) {
      return 'recInterviews'
    }
    if (/q3|report|funnel|analytics|summary|metric/.test(normalized)) {
      return 'recReports'
    }
    if (/job|role|requisition|jd|draft/.test(normalized)) {
      return 'recJobs'
    }
    return null
  }
  if (/profile|complet|gap/.test(normalized)) return 'profile'
  if (/resume|cv|upload|parse/.test(normalized)) return 'resume'
  if (/match|job|recommend/.test(normalized)) return 'jobs'
  if (/application|status|interview|withdraw/.test(normalized)) return 'status'
  return null
}

const JR1042_APPLICANTS = [
  {
    name: 'Rajesh Kumar',
    initials: 'RK',
    match: 96,
    experience: '6.5 yrs exp',
    skills: 'Java 17, Spring Boot, Microservices, Kafka',
    email: 'rajesh.k@example.com',
  },
  {
    name: 'Sneha Kulkarni',
    initials: 'SK',
    match: 94,
    experience: '5.2 yrs exp',
    skills: 'Java 11, Spring Boot, AWS, Docker',
    email: 'sneha.k@example.com',
  },
  {
    name: 'Vikram Malhotra',
    initials: 'VM',
    match: 91,
    experience: '7.0 yrs exp',
    skills: 'Core Java, Hibernate, PostgreSQL, Microservices',
    email: 'vikram.m@example.com',
  },
  {
    name: 'Ananya Deshmukh',
    initials: 'AD',
    match: 89,
    experience: '4.8 yrs exp',
    skills: 'Java, Spring Cloud, REST APIs, Kubernetes',
    email: 'ananya.d@example.com',
  },
  {
    name: 'Amit Patil',
    initials: 'AP',
    match: 87,
    experience: '5.5 yrs exp',
    skills: 'Java, Spring Boot, CI/CD, SQL',
    email: 'amit.p@example.com',
  },
] as const

const JR1042_EMAIL_SUBJECT =
  'Your application for Java Developer – Pune: Next steps'

const JR1042_EMAIL_BODY = `Hi {{first_name}},

Thank you for your patience while we reviewed your application for the Java Developer position in Pune. Our engineering leadership was impressed by your profile, and you have been shortlisted for the next stage.

Our team will be in touch later this week to coordinate your technical discussion.

Best,
Deepak Singh · Acme Group Talent Acquisition`

function jr1042ApplicantsRankedContent(): CopilotBotContent {
  return {
    text: 'Here are the top new applicants for Java Developer – Pune (JR-1042) ranked by match %:',
    rankedApplicants: {
      heading: 'New Applicants Ranked by Match Score:',
      badge: '5 Candidates',
      applicants: JR1042_APPLICANTS.map((applicant) => ({
        name: applicant.name,
        initials: applicant.initials,
        match: applicant.match,
        experience: applicant.experience,
        skills: applicant.skills,
        status: 'New',
      })),
      footer:
        'All 5 profiles meet the 70% threshold for JR-1042. You can shortlist them now.',
      primary: chip('rc-jr1042-shortlist', 'Shortlist top 5 →', {
        variant: 'primary',
      }),
    },
  }
}

function jr1042ShortlistNoticeContent(): CopilotBotContent {
  const names = JR1042_APPLICANTS.map((applicant) => applicant.name).join(', ')
  return {
    actionNotice: {
      message: `Top 5 applicants for JR-1042 (${names}) moved to 'Shortlisted' stage.`,
      meta: [
        'Status updated',
        'Medium confirm policy',
        'Logged as Deepak Singh',
        'Audit #STG-8821',
      ],
      undo: chip('rc-jr1042-undo', 'Undo'),
      primary: chip('rc-jr1042-email', 'Email shortlisted candidates →', {
        variant: 'primary',
      }),
    },
  }
}

function jr1042EmailPreviewContent(
  formValues: Record<string, string> = {},
): CopilotBotContent {
  return {
    text: 'Here is a preview of the email update for the 5 shortlisted candidates for JR-1042:',
    emailPreview: {
      recipientsHeading: 'Target Recipients (Shortlisted for JR-1042):',
      recipientsBadge: '5 Recipients',
      recipients: JR1042_APPLICANTS.map((applicant) => ({
        name: applicant.name,
        initials: applicant.initials,
        match: applicant.match,
        experience: applicant.experience,
        email: applicant.email,
        sendId: `rc-jr1042-email-one:${applicant.name}`,
      })),
      subject: formValues['jr1042-subject'] || JR1042_EMAIL_SUBJECT,
      body: formValues['jr1042-body'] || JR1042_EMAIL_BODY,
      editChip: chip('rc-jr1042-email-edit', 'Edit copy'),
      sendChip: chip('rc-jr1042-email-send', 'Send to 5 candidates', {
        variant: 'primary',
      }),
    },
  }
}

function jr1042EmailEditContent(
  formValues: Record<string, string> = {},
): CopilotBotContent {
  return {
    text: 'Edit the shortlist email copy, then save to return to the preview.',
    form: [
      {
        id: 'jr1042-subject',
        label: 'Subject',
        value: formValues['jr1042-subject'] || JR1042_EMAIL_SUBJECT,
      },
      {
        id: 'jr1042-body',
        label: 'Body',
        value: formValues['jr1042-body'] || JR1042_EMAIL_BODY,
        kind: 'textarea',
      },
    ],
    chips: [
      chip('rc-jr1042-email', 'Save & preview →', { variant: 'primary' }),
      chip('rc-jr1042-shortlist', 'Back to shortlist notice', {
        variant: 'skip',
      }),
    ],
  }
}

function isJr1042ApplicantsPrompt(text: string): boolean {
  const normalized = text.toLowerCase()
  if (/jr-?1042/.test(normalized)) return true
  return (
    /new applicants?/.test(normalized) &&
    /match\s*%|match percent|sorted by match|rank(ed)? by match/.test(
      normalized,
    )
  )
}

function recruiterwiseActivityReportContent(): CopilotBotContent {
  const rows: CopilotActivityReportRow[] = [
    {
      candidate: 'Rajesh Kumar',
      position: 'Java Developer',
      city: 'Pune',
      skillMatch: 96,
      source: 'LinkedIn',
      skills: ['Java', 'Spring Boot', 'Kafka'],
    },
    {
      candidate: 'Sneha Kulkarni',
      position: 'Java Developer',
      city: 'Pune',
      skillMatch: 94,
      source: 'Naukri',
      skills: ['Java', 'Spring Boot', 'AWS'],
    },
    {
      candidate: 'Meera Kapoor',
      position: 'Data Analyst',
      city: 'Bengaluru',
      skillMatch: 91,
      source: 'Referral',
      skills: ['SQL', 'Python', 'Tableau'],
    },
    {
      candidate: 'Faisal Al-Otaibi',
      position: 'Sr. Product Designer',
      city: 'Riyadh',
      skillMatch: 92,
      source: 'RS Plus',
      skills: ['Figma', 'Design Systems', 'Arabic UI'],
    },
    {
      candidate: 'Vikram Malhotra',
      position: 'Java Developer',
      city: 'Hyderabad',
      skillMatch: 88,
      source: 'Career site',
      skills: ['Java', 'Hibernate', 'PostgreSQL'],
    },
    {
      candidate: 'Ananya Iyer',
      position: 'Data Analyst',
      city: 'Hyderabad',
      skillMatch: 86,
      source: 'LinkedIn',
      skills: ['SQL', 'Power BI', 'Excel'],
    },
    {
      candidate: 'Hassan Farid',
      position: 'Sr. Product Designer',
      city: 'Riyadh',
      skillMatch: 84,
      source: 'Campaign',
      skills: ['UX Research', 'Figma', 'Prototyping'],
    },
    {
      candidate: 'Priya Nair',
      position: 'Java Developer',
      city: 'Pune',
      skillMatch: 87,
      source: 'Database',
      skills: ['Java', 'Spring Boot', 'PostgreSQL'],
    },
  ]
  const positions = [...new Set(rows.map((row) => row.position))].sort()
  const skills = [...new Set(rows.flatMap((row) => row.skills))].sort()
  const sources = [...new Set(rows.map((row) => row.source))].sort()

  return {
    title: 'Reports',
    text: 'Recruiterwise Activity Report — candidates touched this week across your open roles.',
    activityReport: {
      heading: 'Recruiterwise Activity Report',
      rows,
      positions,
      skills,
      sources,
    },
    chips: [
      chip('toast', 'Schedule weekly email', {
        toast: 'Weekly Recruiterwise Activity Report scheduled',
      }),
      chip('start-recReports', 'Open Q3 hiring summary', { variant: 'skip' }),
    ],
  }
}

function isRecruiterwiseActivityReportPrompt(text: string): boolean {
  const normalized = text.toLowerCase()
  return (
    /recruiter\s*-?\s*wise\s+activity\s+report/.test(normalized) ||
    /recruiterwise\s+activity\s+report/.test(normalized) ||
    ( /activity\s+report/.test(normalized) &&
      /recruiter|candidate|skill\s*match/.test(normalized))
  )
}

function masterRecruitmentDashboardContent(): CopilotBotContent {
  const months = ['Sep 25', 'Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26']
  const freshExpSeries = [
    {
      key: 'experienced',
      label: 'Experienced',
      color: '#2A9D8F',
      fillColor: 'rgba(42, 157, 143, 0.12)',
    },
    {
      key: 'fresh',
      label: 'Fresh Graduate',
      color: '#C4784A',
      fillColor: 'rgba(196, 120, 74, 0.14)',
    },
  ]
  const freshExpPoints = [
    { label: 'Sep 25', values: { experienced: 46, fresh: 72 } },
    { label: 'Oct 25', values: { experienced: 48, fresh: 76 } },
    { label: 'Nov 25', values: { experienced: 45, fresh: 74 } },
    { label: 'Dec 25', values: { experienced: 47, fresh: 78 } },
    { label: 'Jan 26', values: { experienced: 44, fresh: 71 } },
    { label: 'Feb 26', values: { experienced: 46, fresh: 75 } },
  ]

  return {
    title: 'Reports',
    text: 'Master Recruitment Dashboard — time-to-hire trends across your hiring segments.',
    masterDashboard: {
      heading: 'Master Recruitment Dashboard',
      periods: ['3 Months', '6 Months', '12 Months'],
      defaultPeriod: '6 Months',
      tabs: [
        {
          id: 'fresh',
          label: 'Fresh Graduate Wise',
          kpis: [
            { label: 'Fresh Graduate', value: '42 days' },
            { label: 'Experienced', value: '31 days' },
            { label: 'Overall Median', value: '38 days' },
            { label: 'Gap', value: '+11 days' },
          ],
          series: freshExpSeries,
          points: freshExpPoints,
        },
        {
          id: 'source',
          label: 'Source Wise',
          kpis: [
            { label: 'LinkedIn', value: '36 days' },
            { label: 'Referral', value: '28 days' },
            { label: 'Career site', value: '41 days' },
            { label: 'Agency', value: '47 days' },
          ],
          series: [
            {
              key: 'linkedin',
              label: 'LinkedIn',
              color: '#2A9D8F',
              fillColor: 'rgba(42, 157, 143, 0.12)',
            },
            {
              key: 'referral',
              label: 'Referral',
              color: '#C4784A',
              fillColor: 'rgba(196, 120, 74, 0.14)',
            },
          ],
          points: months.map((label, index) => ({
            label,
            values: {
              linkedin: 34 + (index % 3) * 2,
              referral: 26 + (index % 2) * 3,
            },
          })),
        },
        {
          id: 'function',
          label: 'Job Function Wise',
          kpis: [
            { label: 'Engineering', value: '40 days' },
            { label: 'Design', value: '29 days' },
            { label: 'Data', value: '35 days' },
            { label: 'Sales', value: '33 days' },
          ],
          series: [
            {
              key: 'engineering',
              label: 'Engineering',
              color: '#2A9D8F',
              fillColor: 'rgba(42, 157, 143, 0.12)',
            },
            {
              key: 'design',
              label: 'Design',
              color: '#C4784A',
              fillColor: 'rgba(196, 120, 74, 0.14)',
            },
          ],
          points: months.map((label, index) => ({
            label,
            values: {
              engineering: 38 + (index % 4) * 2,
              design: 27 + (index % 3) * 2,
            },
          })),
        },
        {
          id: 'group',
          label: 'Employee Group Wise',
          kpis: [
            { label: 'Full-time', value: '37 days' },
            { label: 'Contract', value: '24 days' },
            { label: 'Intern', value: '19 days' },
            { label: 'Gap', value: '+13 days' },
          ],
          series: [
            {
              key: 'fulltime',
              label: 'Full-time',
              color: '#2A9D8F',
              fillColor: 'rgba(42, 157, 143, 0.12)',
            },
            {
              key: 'contract',
              label: 'Contract',
              color: '#C4784A',
              fillColor: 'rgba(196, 120, 74, 0.14)',
            },
          ],
          points: months.map((label, index) => ({
            label,
            values: {
              fulltime: 35 + (index % 3) * 3,
              contract: 22 + (index % 2) * 2,
            },
          })),
        },
      ],
    },
  }
}

function isMasterRecruitmentDashboardPrompt(text: string): boolean {
  const normalized = text.toLowerCase()
  return (
    /master\s+recruitment\s+dashboard/.test(normalized) ||
    (/recruitment\s+dashboard/.test(normalized) &&
      /master|time.?to.?hire|fresh graduate/.test(normalized))
  )
}

/** Recruiter free-text: dashboards, activity report, JR-1042, or Java hire e2e. */
export function recruiterFreeTextStart(
  text: string,
  state: CopilotScenarioState,
): ScenarioActionResult | null {
  const normalized = text.toLowerCase()
  if (isMasterRecruitmentDashboardPrompt(normalized)) {
    return {
      state: { ...state, scenario: 'recReports' },
      content: masterRecruitmentDashboardContent(),
    }
  }
  if (isRecruiterwiseActivityReportPrompt(normalized)) {
    return {
      state: { ...state, scenario: 'recReports' },
      content: recruiterwiseActivityReportContent(),
    }
  }
  if (/email shortlisted candidates|email.*jr-?1042/.test(normalized)) {
    return {
      state: { ...state, scenario: 'recCandidates' },
      content: jr1042EmailPreviewContent(),
    }
  }
  if (isJr1042ApplicantsPrompt(normalized)) {
    return {
      state: { ...state, scenario: 'recCandidates' },
      content: jr1042ApplicantsRankedContent(),
    }
  }
  if (!/java|pune|hire a developer|jr-1061/.test(normalized)) return null
  const hire = handleHireFlowAction('hire-start')
  if (!hire) return null
  return {
    state: { ...state, scenario: 'recJobs', hireStep: hire.hireStep },
    content: hire.content,
  }
}

/** Fallback matches list for digest-style replies */
export function digestMatches() {
  return COPILOT_MATCHES.map((match) => ({
    title: match.title,
    company: match.company,
    score: match.score,
    why: '',
  }))
}
