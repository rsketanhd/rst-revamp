import { CAMPAIGN_OWNER_OPTIONS } from '../../data/campaigns'

export type CampaignPromptCriterionId =
  | 'talentPoolName'
  | 'channelType'
  | 'location'
  | 'experience'
  | 'schedule'

export type CampaignPromptCriterion = {
  id: CampaignPromptCriterionId
  label: string
}

export type CampaignSuggestedPrompt = {
  id: string
  text: string
}

export const CAMPAIGN_PROMPT_CRITERIA: CampaignPromptCriterion[] = [
  { id: 'talentPoolName', label: 'Talent Pool Name' },
  { id: 'channelType', label: 'Channel Type' },
  { id: 'location', label: 'Location' },
  { id: 'experience', label: 'Experience' },
  { id: 'schedule', label: 'Schedule' },
]

export const DEFAULT_CAMPAIGN_CRITERIA: CampaignPromptCriterionId[] = []

const CRITERION_MATCHERS: Record<CampaignPromptCriterionId, RegExp> = {
  talentPoolName: /talent pool|developers?|designers?|engineers?|managers?/i,
  channelType: /email|sms|linkedin|multi-channel|channel/i,
  location: /riyadh|jeddah|dubai|saudi|ahmedabad|city|cities/i,
  experience: /senior|junior|years?|experience|backend|frontend/i,
  schedule: /schedule|follow-?up|real-time|recurring|once|automated/i,
}

export function detectCampaignCriteria(
  prompt: string,
): CampaignPromptCriterionId[] {
  const text = prompt.trim()
  if (!text) return DEFAULT_CAMPAIGN_CRITERIA
  return CAMPAIGN_PROMPT_CRITERIA.filter((item) =>
    CRITERION_MATCHERS[item.id].test(text),
  ).map((item) => item.id)
}

export const CAMPAIGN_PROMPT_PLACEHOLDER =
  'Describe the campaign goal, audience, channels, and outreach style…'

export const CAMPAIGN_RECENT_SEARCHES = [
  'Design Internship Riyadh',
  'Senior React Developers',
  'Marketing Managers Dubai',
  'Graduate Engineering Program',
]

export const CAMPAIGN_SUGGESTED_PROMPTS: CampaignSuggestedPrompt[] = [
  {
    id: 'eng-sprint',
    text: 'Q2 Engineering Hiring Sprint targeting Senior Backend Developers. Multi-channel approach using Email and LinkedIn with real-time analytics.',
  },
  {
    id: 'summer-internship',
    text: 'Summer Internship 2026 outreach for UX/UI designers across major Saudi cities. Personalized SMS campaign with automated follow-ups.',
  },
  {
    id: 'sales-drive',
    text: 'Sales Executives recruitment drive for Riyadh and Jeddah. Email-first outreach with weekly nurture sequences and meeting booking.',
  },
]

export type SimilarCampaignMatch = {
  id: string
  name: string
  matchPercent: number
}

export const AI_SIMILAR_CAMPAIGNS: SimilarCampaignMatch[] = [
  {
    id: 'sim-senior-dev',
    name: 'Senior Dev Outreach Q1',
    matchPercent: 95,
  },
  {
    id: 'sim-backend',
    name: 'Backend Talent Program',
    matchPercent: 95,
  },
]

export type CampaignRefineCriteria = {
  experienceLevel: string
  talentPoolLocation: string
  sourceChannels: string
  outreachFrequency: string
}

export const DEFAULT_CAMPAIGN_REFINE_CRITERIA: CampaignRefineCriteria = {
  experienceLevel: '',
  talentPoolLocation: '',
  sourceChannels: '',
  outreachFrequency: '',
}

export const CAMPAIGN_EXPERIENCE_OPTIONS = [
  '0–2 Years',
  '3–7 Years',
  '8–12 Years',
  '12+ Years',
]

export const CAMPAIGN_LOCATION_OPTIONS = [
  'Riyadh, Saudi Arabia',
  'Jeddah, Saudi Arabia',
  'Dubai, UAE',
  'Ahmedabad, India',
  'Remote',
]

export const CAMPAIGN_SOURCE_CHANNEL_OPTIONS = [
  'Email',
  'SMS',
  'Telephonic',
  'Email + LinkedIn',
]

export const CAMPAIGN_FREQUENCY_OPTIONS = ['Once', 'Recurring', 'Weekly', 'Monthly']

type PromptRule = {
  test: (text: string) => boolean
  value: string
}

function pickFromPrompt(
  text: string,
  rules: PromptRule[],
): string | undefined {
  for (const rule of rules) {
    if (rule.test(text)) return rule.value
  }
  return undefined
}

const EXPERIENCE_FROM_PROMPT: PromptRule[] = [
  { test: (t) => /senior|8|12/.test(t), value: '8–12 Years' },
  { test: (t) => /junior|intern|0–2|graduate/.test(t), value: '0–2 Years' },
]

const LOCATION_FROM_PROMPT: PromptRule[] = [
  { test: (t) => /jeddah/.test(t), value: 'Jeddah, Saudi Arabia' },
  { test: (t) => /dubai/.test(t), value: 'Dubai, UAE' },
  { test: (t) => /ahmedabad/.test(t), value: 'Ahmedabad, India' },
]

const SOURCE_CHANNELS_FROM_PROMPT: PromptRule[] = [
  { test: (t) => /sms/.test(t), value: 'SMS' },
  { test: (t) => /linkedin|multi-channel/.test(t), value: 'Email + LinkedIn' },
  { test: (t) => /telephonic|phone|call/.test(t), value: 'Telephonic' },
]

const FREQUENCY_FROM_PROMPT: PromptRule[] = [
  {
    test: (t) => /recurring|weekly|nurture|follow-?up/.test(t),
    value: 'Recurring',
  },
]

/** Seed refine fields from the prompt when possible; fall back to defaults. */
export function refineCampaignCriteriaFromPrompt(
  prompt: string,
): CampaignRefineCriteria {
  const text = prompt.toLowerCase()
  return {
    experienceLevel:
      pickFromPrompt(text, EXPERIENCE_FROM_PROMPT) ?? '3–7 Years',
    talentPoolLocation:
      pickFromPrompt(text, LOCATION_FROM_PROMPT) ?? 'Riyadh, Saudi Arabia',
    sourceChannels: pickFromPrompt(text, SOURCE_CHANNELS_FROM_PROMPT) ?? 'Email',
    outreachFrequency: pickFromPrompt(text, FREQUENCY_FROM_PROMPT) ?? 'Once',
  }
}

export type CampaignChannel = 'email' | 'sms' | 'telephonic' | ''

export type CampaignSuppressedAction =
  | 'reschedule'
  | 'suppress'
  | 'ignore'
  | ''

export type CampaignSendMode = 'now' | 'schedule' | 'recurring'

export type CampaignRecurringUnit = 'day' | 'week' | 'month' | 'year'

export type CampaignWeekday =
  | 'mon'
  | 'tue'
  | 'wed'
  | 'thu'
  | 'fri'
  | 'sat'
  | 'sun'

export type CampaignMonthOrdinal =
  | 'first'
  | 'second'
  | 'third'
  | 'fourth'
  | 'last'

export type CampaignRecurringMonthMode = 'day-of-month' | 'nth-weekday'

export type CampaignRecurringEnd =
  | { type: 'never' }
  | { type: 'after'; occurrences: number }
  | { type: 'on-date'; date: string }

export type CreateCampaignFormState = {
  naturalLanguage: string
  detectedCriteria: CampaignPromptCriterionId[]
  name: string
  owners: string[]
  channel: CampaignChannel
  fromAddress: string
  replyToAddress: string
  talentPool: string
  stageFilter: string
  dateAddedFilter: string
  cooldownDays: number
  suppressedAction: CampaignSuppressedAction
  sendMode: CampaignSendMode
  scheduleDate: string
  scheduleTime: string
  scheduleTimezone: string
  recurringInterval: number
  recurringUnit: CampaignRecurringUnit
  recurringWeekdays: CampaignWeekday[]
  recurringMonthMode: CampaignRecurringMonthMode
  recurringMonthDay: number
  recurringMonthOrdinal: CampaignMonthOrdinal
  recurringMonthWeekday: CampaignWeekday
  recurringYearMonth: number
  recurringYearDay: number
  recurringTime: string
  recurringTimezone: string
  recurringStartDate: string
  recurringEnd: CampaignRecurringEnd
  messages: CampaignSequenceMessage[]
}

export const CAMPAIGN_TIMEZONE_OPTIONS = [
  { value: 'Europe/London', label: 'GMT (London)' },
  { value: 'America/New_York', label: 'EST (New York)' },
  { value: 'America/Los_Angeles', label: 'PST (Los Angeles)' },
  { value: 'Asia/Kolkata', label: 'IST (Kolkata)' },
  { value: 'Asia/Dubai', label: 'GST (Dubai)' },
  { value: 'UTC', label: 'UTC' },
]

export const CAMPAIGN_RECURRING_UNIT_OPTIONS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
]

export const CAMPAIGN_RECURRING_INTERVAL_OPTIONS = Array.from(
  { length: 30 },
  (_, index) => {
    const value = String(index + 1)
    return { value, label: value }
  },
)

export const CAMPAIGN_WEEKDAY_OPTIONS: Array<{
  value: CampaignWeekday
  label: string
  short: string
}> = [
  { value: 'mon', label: 'Monday', short: 'Mon' },
  { value: 'tue', label: 'Tuesday', short: 'Tue' },
  { value: 'wed', label: 'Wednesday', short: 'Wed' },
  { value: 'thu', label: 'Thursday', short: 'Thu' },
  { value: 'fri', label: 'Friday', short: 'Fri' },
  { value: 'sat', label: 'Saturday', short: 'Sat' },
  { value: 'sun', label: 'Sunday', short: 'Sun' },
]

export const CAMPAIGN_MONTH_DAY_OPTIONS = Array.from({ length: 31 }, (_, index) => {
  const value = String(index + 1)
  return { value, label: value }
})

export const CAMPAIGN_MONTH_ORDINAL_OPTIONS: Array<{
  value: CampaignMonthOrdinal
  label: string
}> = [
  { value: 'first', label: 'First' },
  { value: 'second', label: 'Second' },
  { value: 'third', label: 'Third' },
  { value: 'fourth', label: 'Fourth' },
  { value: 'last', label: 'Last' },
]

export const CAMPAIGN_YEAR_MONTH_OPTIONS = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
]

export const CAMPAIGN_TIME_OPTIONS = [
  '12:00 AM',
  '12:30 AM',
  '01:00 AM',
  '01:30 AM',
  '02:00 AM',
  '02:30 AM',
  '03:00 AM',
  '03:30 AM',
  '04:00 AM',
  '04:30 AM',
  '05:00 AM',
  '05:30 AM',
  '06:00 AM',
  '06:30 AM',
  '07:00 AM',
  '07:30 AM',
  '08:00 AM',
  '08:30 AM',
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
  '07:30 PM',
  '08:00 PM',
  '08:30 PM',
  '09:00 PM',
  '09:30 PM',
  '10:00 PM',
  '10:30 PM',
  '11:00 PM',
  '11:30 PM',
]

export const CAMPAIGN_FROM_ADDRESS_OPTIONS = [
  'recruiting@infosys.com | The Infosys Team',
  'talent@company.com | Talent Acquisition',
  'careers@company.com | Careers Team',
]

export const CAMPAIGN_REPLY_TO_OPTIONS = [
  'noreply@infosys.com',
  'recruiting@infosys.com',
  'talent@company.com',
]

export const CAMPAIGN_TALENT_POOL_OPTIONS = [
  'Software Developers in Ahmedabad',
  'Finance Analysts — Jeddah & Riyadh',
  'Product Managers - Remote',
  'Sales Leadership Pipeline',
  'Field Service Technicians - Northeast US',
]

export const CAMPAIGN_STAGE_FILTER_OPTIONS = [
  'Lead',
  'Engaged',
  'Screening',
  'Qualified',
  'Rejected',
]

export const CAMPAIGN_DATE_ADDED_OPTIONS = [
  'Last 7 days',
  'Last 30 days',
  'Last 90 days',
  'This year',
]

const DEFAULT_SCHEDULE_DATE = '2025-01-07'
const DEFAULT_SCHEDULE_TIME = '09:00 AM'
const DEFAULT_TIMEZONE = 'Europe/London'

export const emptyCreateCampaignForm: CreateCampaignFormState = {
  naturalLanguage: '',
  detectedCriteria: [],
  name: '',
  owners: [],
  channel: '',
  fromAddress: '',
  replyToAddress: '',
  talentPool: '',
  stageFilter: '',
  dateAddedFilter: '',
  cooldownDays: 3,
  suppressedAction: 'reschedule',
  sendMode: 'now',
  scheduleDate: DEFAULT_SCHEDULE_DATE,
  scheduleTime: DEFAULT_SCHEDULE_TIME,
  scheduleTimezone: DEFAULT_TIMEZONE,
  recurringInterval: 1,
  recurringUnit: 'day',
  recurringWeekdays: ['tue', 'thu'],
  recurringMonthMode: 'nth-weekday',
  recurringMonthDay: 15,
  recurringMonthOrdinal: 'second',
  recurringMonthWeekday: 'tue',
  recurringYearMonth: 1,
  recurringYearDay: 10,
  recurringTime: DEFAULT_SCHEDULE_TIME,
  recurringTimezone: DEFAULT_TIMEZONE,
  recurringStartDate: DEFAULT_SCHEDULE_DATE,
  recurringEnd: { type: 'never' },
  messages: [{ id: 'msg-1', template: null, rule: null, expanded: false }],
}

function weekdayLabel(day: CampaignWeekday, short = false): string {
  const match = CAMPAIGN_WEEKDAY_OPTIONS.find((item) => item.value === day)
  if (!match) return day
  return short ? match.short : match.label
}

function monthLabel(month: number): string {
  return (
    CAMPAIGN_YEAR_MONTH_OPTIONS.find((item) => Number(item.value) === month)
      ?.label ?? String(month)
  )
}

function ordinalLabel(ordinal: CampaignMonthOrdinal): string {
  return (
    CAMPAIGN_MONTH_ORDINAL_OPTIONS.find((item) => item.value === ordinal)
      ?.label ?? ordinal
  )
}

/** Human-readable summary for the Recurring settings card. */
export function formatCampaignRecurringSummary(
  form: Pick<
    CreateCampaignFormState,
    | 'recurringInterval'
    | 'recurringUnit'
    | 'recurringWeekdays'
    | 'recurringMonthMode'
    | 'recurringMonthDay'
    | 'recurringMonthOrdinal'
    | 'recurringMonthWeekday'
    | 'recurringYearMonth'
    | 'recurringYearDay'
    | 'recurringTime'
    | 'recurringStartDate'
    | 'recurringEnd'
  >,
): string {
  const interval = Math.max(1, Number(form.recurringInterval) || 1)
  const unit = form.recurringUnit
  const time = form.recurringTime || DEFAULT_SCHEDULE_TIME
  const startLabel = formatCampaignDisplayDate(form.recurringStartDate)
  let endLabel = 'indefinitely'
  switch (form.recurringEnd.type) {
    case 'never':
      endLabel = 'indefinitely'
      break
    case 'after': {
      const n = Math.max(1, form.recurringEnd.occurrences || 1)
      endLabel = `for ${n} occurrence${n === 1 ? '' : 's'}`
      break
    }
    case 'on-date':
      endLabel = `until ${formatCampaignDisplayDate(form.recurringEnd.date)}`
      break
    default: {
      const exhaustive: never = form.recurringEnd
      return exhaustive
    }
  }

  let schedule = ''
  switch (unit) {
    case 'day':
      schedule =
        interval === 1
          ? `Every day at ${time}`
          : `Every ${interval} days at ${time}`
      break
    case 'week': {
      const days = form.recurringWeekdays
        .map((day) => weekdayLabel(day))
        .join(', ')
      const onDays = days ? ` on ${days}` : ''
      schedule =
        interval === 1
          ? `Every week${onDays} at ${time}`
          : `Every ${interval} weeks${onDays} at ${time}`
      break
    }
    case 'month': {
      if (form.recurringMonthMode === 'nth-weekday') {
        const nth = `${ordinalLabel(form.recurringMonthOrdinal)} ${weekdayLabel(form.recurringMonthWeekday)}`
        schedule =
          interval === 1
            ? `On the ${nth} of every month at ${time}`
            : `Every ${interval} months on the ${nth} at ${time}`
      } else {
        schedule =
          interval === 1
            ? `On day ${form.recurringMonthDay} of every month at ${time}`
            : `Every ${interval} months on day ${form.recurringMonthDay} at ${time}`
      }
      break
    }
    case 'year': {
      const month = monthLabel(form.recurringYearMonth)
      schedule =
        interval === 1
          ? `Every year on ${month} ${form.recurringYearDay} at ${time}`
          : `Every ${interval} years on ${month} ${form.recurringYearDay} at ${time}`
      break
    }
    default: {
      const exhaustive: never = unit
      return exhaustive
    }
  }

  return `${schedule}. Starting ${startLabel}, ${endLabel}.`
}

/** Settings card copy on the Review step. */
export function formatCampaignSettingsSummary(
  form: CreateCampaignFormState,
): string {
  switch (form.sendMode) {
    case 'now':
      return 'Send immediately when the campaign is created.'
    case 'schedule': {
      const date = formatCampaignDisplayDate(form.scheduleDate)
      const tz =
        CAMPAIGN_TIMEZONE_OPTIONS.find(
          (item) => item.value === form.scheduleTimezone,
        )?.label ?? form.scheduleTimezone
      return `Scheduled for ${date} at ${form.scheduleTime}${tz ? ` (${tz})` : ''}.`
    }
    case 'recurring':
      return formatCampaignRecurringSummary(form)
    default: {
      const exhaustive: never = form.sendMode
      return exhaustive
    }
  }
}

/** Parse "email | Display Name" from-address options. */
export function parseCampaignFromAddress(value: string): {
  email: string
  name: string
} {
  const parts = value.split('|').map((part) => part.trim())
  return {
    email: parts[0] || value,
    name: parts[1] || '',
  }
}

/** Review message-preview rule line. */
export function formatCampaignReviewRule(
  rule: CampaignMessageRule | null,
  messageIndex: number,
): string {
  if (messageIndex === 0 || !rule) {
    return 'Initial message — sent first in the sequence.'
  }
  const condition = campaignRuleReviewConditionLabel(rule.condition)
  const wait =
    rule.waitDays === 1 ? 'Wait 1 day' : `Wait ${rule.waitDays} days`
  return `Send this message if '${condition}' to previous message, ${wait}`
}

function campaignRuleReviewConditionLabel(
  condition: CampaignMessageRuleCondition,
): string {
  switch (condition) {
    case 'no-open':
      return 'No reply'
    case 'opened':
      return 'Opened'
    case 'clicked':
      return 'Clicked'
    case 'replied':
      return 'Replied'
    case 'bounced':
      return 'Bounced'
    default: {
      const exhaustive: never = condition
      return exhaustive
    }
  }
}

function formatCampaignDisplayDate(iso: string): string {
  if (!iso) return '—'
  const parts = iso.split('-').map(Number)
  const y = parts[0]
  const m = parts[1]
  const d = parts[2]
  if (!y || !m || !d) return iso
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const month = months[m - 1] ?? String(m)
  return `${d} ${month} ${y}`
}

/** Display value for date inputs styled like the mock (DD-MM-YYYY). */
export function toCampaignDateInputValue(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d}-${m}-${y}`
}

export function fromCampaignDateInputValue(display: string): string {
  const match = display.trim().match(/^(\d{2})-(\d{2})-(\d{4})$/)
  if (!match) return display
  const [, d, m, y] = match
  return `${y}-${m}-${d}`
}

export const CREATE_CAMPAIGN_STEPS = [
  { id: 'details', label: 'Details' },
  { id: 'messages', label: 'Messages' },
  { id: 'settings', label: 'Settings' },
  { id: 'review', label: 'Review' },
] as const

export type CampaignMessageTemplate = {
  id: string
  name: string
  updatedAgo: string
  subject: string
  /** Body paragraphs (first is greeting line when present). */
  body: string[]
  preheader?: string
  /** Full email-editor document for round-trip Edit Template. */
  editorState?: Record<string, unknown>
}

export type CampaignMessageRuleCondition =
  | 'no-open'
  | 'opened'
  | 'clicked'
  | 'replied'
  | 'bounced'

export type CampaignMessageRule = {
  condition: CampaignMessageRuleCondition
  waitDays: number
}

export type CampaignSequenceMessage = {
  id: string
  template: CampaignMessageTemplate | null
  rule: CampaignMessageRule | null
  expanded: boolean
}

export const CAMPAIGN_MESSAGE_RULE_CONDITION_OPTIONS: Array<{
  value: CampaignMessageRuleCondition
  label: string
}> = [
  { value: 'no-open', label: 'No Open' },
  { value: 'opened', label: 'Opened' },
  { value: 'clicked', label: 'Clicked' },
  { value: 'replied', label: 'Replied' },
  { value: 'bounced', label: 'Bounced' },
]

export const DEFAULT_CAMPAIGN_MESSAGE_RULE: CampaignMessageRule = {
  condition: 'no-open',
  waitDays: 3,
}

/** Badge wording for sequence pills (e.g. Message 1 'Not Open'). */
export function campaignRuleConditionBadgeLabel(
  condition: CampaignMessageRuleCondition,
): string {
  switch (condition) {
    case 'no-open':
      return 'Not Open'
    case 'opened':
      return 'Opened'
    case 'clicked':
      return 'Clicked'
    case 'replied':
      return 'Replied'
    case 'bounced':
      return 'Bounced'
    default: {
      const exhaustive: never = condition
      return exhaustive
    }
  }
}

export function formatCampaignMessageRuleBadge(
  rule: CampaignMessageRule,
  previousMessageNumber: number,
): string {
  const daysLabel =
    rule.waitDays === 1 ? '1 Day Later' : `${rule.waitDays} Days Later`
  const condition = campaignRuleConditionBadgeLabel(rule.condition)
  return `${daysLabel} | Message ${previousMessageNumber} '${condition}'`
}

/** Mock email templates for Select Template panel (Messages step). */
export const CAMPAIGN_MESSAGE_TEMPLATES: CampaignMessageTemplate[] = [
  {
    id: 'tpl-initial-se',
    name: 'Initial Outreach – Software Engineers',
    updatedAgo: '2 days ago',
    subject: 'New Software Engineering Opportunity at {{CompanyName}}',
    body: [
      'Hi {{FirstName}},',
      "We're reaching out from {{CompanyName}}, a fast-growing technology organization focused on building scalable, high-impact digital products used by millions of users worldwide.",
      "We're hiring Software Engineers to join our product engineering teams and help shape the next generation of our platform. Your background looks like a strong fit for the roles we're opening this quarter.",
      "If you're open to exploring a new opportunity, we'd love to share more details and find a time that works for you.",
    ],
  },
  {
    id: 'tpl-followup-no-response',
    name: 'Follow-up No Response',
    updatedAgo: '2 days ago',
    subject: 'Following up — {{CompanyName}} opportunity',
    body: [
      'Hi {{FirstName}},',
      "Just checking in on my previous note about openings at {{CompanyName}}. I'd be happy to share the role details or connect you with the hiring team whenever you're ready.",
    ],
  },
  {
    id: 'tpl-followup-reminder',
    name: 'Follow-up Reminder',
    updatedAgo: '1 week ago',
    subject: 'Quick reminder from {{CompanyName}}',
    body: [
      'Hi {{FirstName}},',
      "Wanted to gently bump this in case my last message got buried. We're still actively hiring and would welcome a short conversation if the timing is better now.",
    ],
  },
  {
    id: 'tpl-pm-outreach',
    name: 'Product Manager Outreach',
    updatedAgo: '3 days ago',
    subject: 'Product Manager roles at {{CompanyName}}',
    body: [
      'Hi {{FirstName}},',
      "{{CompanyName}} is growing its product organization and we're looking for Product Managers who thrive on clarity, customer insight, and shipping outcomes.",
      "I'd love to share more about the teams and roadmap if you're exploring new opportunities.",
    ],
  },
]

export type CreateCampaignNavState = {
  manualEntry?: boolean
  aiContinue?: boolean
  aiPrompt?: string
  similarCampaignId?: string
  similarCampaignName?: string
  refineCriteria?: CampaignRefineCriteria
  /** Pre-selected talent pool when starting from Talent Pool Details. */
  talentPoolName?: string
}

export type CampaignAudienceSummary = {
  totalInPool: number
  unsubscribed: number
  blocked: number
  recentlyContacted: number
  reachable: number
}

export const DEFAULT_AUDIENCE_SUMMARY: CampaignAudienceSummary = {
  totalInPool: 562,
  unsubscribed: 16,
  blocked: 11,
  recentlyContacted: 15,
  reachable: 491,
}

export const CAMPAIGN_CREATE_OWNER_OPTIONS = CAMPAIGN_OWNER_OPTIONS

function blankCreateCampaignForm(): CreateCampaignFormState {
  return {
    ...emptyCreateCampaignForm,
    owners: [],
    detectedCriteria: [],
    messages: [{ id: 'msg-1', template: null, rule: null, expanded: false }],
  }
}

function channelFromSourceChannels(sourceChannels: string): CampaignChannel {
  const value = sourceChannels.toLowerCase()
  if (value.includes('sms')) return 'sms'
  if (value.includes('telephonic')) return 'telephonic'
  if (value.includes('email')) return 'email'
  return 'email'
}

function nameFromPrompt(prompt: string): string {
  const firstSentence = prompt.split(/[.!?]/)[0]?.trim()
  if (firstSentence && firstSentence.length <= 90) return firstSentence
  return prompt.trim().slice(0, 80) || 'New Campaign'
}

function talentPoolFromPrompt(prompt: string, location: string): string {
  if (/ahmedabad/i.test(location) || /developers?/i.test(prompt)) {
    return 'Software Developers in Ahmedabad'
  }
  return CAMPAIGN_TALENT_POOL_OPTIONS[0] ?? ''
}

function naturalLanguageFromPrompt(prompt: string): string {
  if (prompt) return prompt
  return (
    CAMPAIGN_SUGGESTED_PROMPTS[1]?.text ?? CAMPAIGN_PROMPT_PLACEHOLDER
  )
}

function withTalentPoolPrefill(
  form: CreateCampaignFormState,
  talentPoolName?: string,
): CreateCampaignFormState {
  if (!talentPoolName?.trim()) return form
  return { ...form, talentPool: talentPoolName.trim() }
}

/** Build wizard form from AI prompt / refine criteria, or blank for manual entry. */
export function createCampaignFormFromNavState(
  state: CreateCampaignNavState | null,
): CreateCampaignFormState {
  if (!state || state.manualEntry || !state.aiContinue) {
    return withTalentPoolPrefill(blankCreateCampaignForm(), state?.talentPoolName)
  }

  const prompt = state.aiPrompt?.trim() ?? ''
  const refine =
    state.refineCriteria ?? refineCampaignCriteriaFromPrompt(prompt)

  return withTalentPoolPrefill(
    {
      ...blankCreateCampaignForm(),
      naturalLanguage: naturalLanguageFromPrompt(prompt),
      detectedCriteria: detectCampaignCriteria(prompt),
      name: nameFromPrompt(prompt),
      owners: ['Sarah Johnson'],
      channel: channelFromSourceChannels(refine.sourceChannels),
      fromAddress: CAMPAIGN_FROM_ADDRESS_OPTIONS[0] ?? '',
      replyToAddress: CAMPAIGN_REPLY_TO_OPTIONS[0] ?? '',
      talentPool: talentPoolFromPrompt(prompt, refine.talentPoolLocation),
      stageFilter: 'Lead',
      dateAddedFilter: '',
      cooldownDays: 3,
      suppressedAction: 'reschedule',
    },
    state.talentPoolName,
  )
}
