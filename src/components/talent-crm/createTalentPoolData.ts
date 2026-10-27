export type TalentPoolPromptCriterionId =
  | 'skills'
  | 'experience'
  | 'location'
  | 'jobRadius'
  | 'score'

export type TalentPoolPromptCriterion = {
  id: TalentPoolPromptCriterionId
  label: string
}

export type TalentPoolSuggestedPrompt = {
  id: string
  text: string
}

export const TALENT_POOL_PROMPT_PLACEHOLDER =
  'Describe your Talent Pool requirements'

export const TALENT_POOL_PROMPT_CRITERIA: TalentPoolPromptCriterion[] = [
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'location', label: 'Location' },
  { id: 'jobRadius', label: 'Job Radius' },
  { id: 'score', label: 'Score' },
]

/** Empty until the prompt text meets a criterion. */
export const DEFAULT_TALENT_POOL_CRITERIA: TalentPoolPromptCriterionId[] = []

const CRITERION_MATCHERS: Record<TalentPoolPromptCriterionId, RegExp> = {
  skills:
    /\b(skills?|react|node\.?js|javascript|typescript|python|java|cfa|fintech|banking|developer|engineer|analyst|c-?suite|ceo|cfo|coo)\b/i,
  experience:
    /\b(experience|experiences|senior|junior|mid[- ]?level|\d+\+?\s*(years?|yrs?)|minimum\s+\d+)\b/i,
  location:
    /\b(location|based\s+in|remote|hybrid|riyadh|jeddah|dubai|abu\s+dhabi|london|saudi|nationals?|gcc)\b/i,
  jobRadius:
    /\b(job\s*radius|radius|within\s+\d+\s*km|commute|distance|\d+\s*km)\b/i,
  score: /\b(scores?|match\s*%|match\s*percent|ranked|ranking)\b/i,
}

/**
 * Enable criteria chips only when the prompt text meets each criterion.
 */
export function detectTalentPoolCriteria(
  prompt: string,
): TalentPoolPromptCriterionId[] {
  const text = prompt.trim()
  if (!text) return []

  return TALENT_POOL_PROMPT_CRITERIA.map((item) => item.id).filter((id) =>
    CRITERION_MATCHERS[id].test(text),
  )
}

export const TALENT_POOL_SUGGESTED_PROMPTS: TalentPoolSuggestedPrompt[] = [
  {
    id: 'tp-prompt-1',
    text: 'Senior React & Node.js developers in Riyadh with 5+ years of experience. Auto-update weekly from LinkedIn and ATS. Fintech background preferred.',
  },
  {
    id: 'tp-prompt-2',
    text: 'Finance analysts in Jeddah and Riyadh, 3 to 7 years banking experience, CFA preferred. Auto-refresh bi-weekly from ATS and job boards. Notify recruiter on each run.',
  },
  {
    id: 'tp-prompt-3',
    text: 'Executive talent pool for C-suite: CEO, CFO, COO. Minimum 15 years experience. Saudi nationals preferred. Manual update only. PDPL compliant with mandatory consent.',
  },
]

export type SimilarTalentPoolMatch = {
  id: string
  name: string
  matchPercent: number
}

/** Demo similar pools returned after Continue from the prompt step. */
export const AI_SIMILAR_TALENT_POOLS: SimilarTalentPoolMatch[] = [
  {
    id: 'similar-tp-1',
    name: 'Finance Analysts — Jeddah & Riyadh',
    matchPercent: 95,
  },
  {
    id: 'similar-tp-2',
    name: 'Junior Finance Analysts',
    matchPercent: 95,
  },
]

export type TalentPoolRefineCriteria = {
  jobTitle: string
  locationPrimary: string
  jobRadius: string
  experienceLevel: string
}

export const DEFAULT_TALENT_POOL_REFINE_CRITERIA: TalentPoolRefineCriteria = {
  jobTitle: 'Finance Analyst',
  locationPrimary: 'Riyadh, Saudi Arabia',
  jobRadius: '100 miles',
  experienceLevel: '3-7 Years',
}

export const TALENT_POOL_JOB_TITLE_OPTIONS = [
  'Finance Analyst',
  'Senior Finance Analyst',
  'Junior Finance Analyst',
  'Software Engineer',
  'Product Manager',
]

export const TALENT_POOL_LOCATION_OPTIONS = [
  'Riyadh, Saudi Arabia',
  'Jeddah, Saudi Arabia',
  'Dubai, UAE',
  'London, UK',
  'Remote',
]

export const TALENT_POOL_JOB_RADIUS_OPTIONS = [
  '25 miles',
  '50 miles',
  '100 miles',
  '200 miles',
  'Nationwide',
]

export const TALENT_POOL_EXPERIENCE_OPTIONS = [
  '0-2 Years',
  '3-7 Years',
  '5-10 Years',
  '10+ Years',
  '15+ Years',
]

type PromptRule = { test: (text: string) => boolean; value: string }

function pickFromPrompt(text: string, rules: PromptRule[]): string | undefined {
  for (const rule of rules) {
    if (rule.test(text)) return rule.value
  }
  return undefined
}

const JOB_TITLE_FROM_PROMPT: PromptRule[] = [
  { test: (t) => t.includes('finance analyst'), value: 'Finance Analyst' },
  {
    test: (t) => t.includes('react') || t.includes('software'),
    value: 'Software Engineer',
  },
  { test: (t) => t.includes('product'), value: 'Product Manager' },
  {
    test: (t) => t.includes('c-suite') || t.includes('ceo'),
    value: 'Finance Analyst',
  },
]

const LOCATION_FROM_PROMPT: PromptRule[] = [
  {
    test: (t) => t.includes('jeddah') && t.includes('riyadh'),
    value: 'Riyadh, Saudi Arabia',
  },
  { test: (t) => t.includes('jeddah'), value: 'Jeddah, Saudi Arabia' },
  {
    test: (t) => t.includes('riyadh') || t.includes('saudi'),
    value: 'Riyadh, Saudi Arabia',
  },
  { test: (t) => t.includes('dubai'), value: 'Dubai, UAE' },
  { test: (t) => t.includes('london'), value: 'London, UK' },
  { test: (t) => t.includes('remote'), value: 'Remote' },
]

const EXPERIENCE_FROM_PROMPT: PromptRule[] = [
  { test: (t) => /\b3\s*to\s*7\b|\b3-7\b/.test(t), value: '3-7 Years' },
  { test: (t) => /\b15\+?\b|\bminimum 15\b/.test(t), value: '15+ Years' },
  { test: (t) => /\b5\+?\b|\b5 years\b/.test(t), value: '5-10 Years' },
  { test: (t) => /\b10\+?\b/.test(t), value: '10+ Years' },
]

const JOB_RADIUS_FROM_PROMPT: PromptRule[] = [
  { test: (t) => /\b100\s*miles?\b|\b100\s*km\b/.test(t), value: '100 miles' },
  { test: (t) => /\b50\s*(miles?|km)\b/.test(t), value: '50 miles' },
]

/**
 * Seed refine fields from the prompt when possible; fall back to defaults.
 */
export function refineCriteriaFromPrompt(
  prompt: string,
): TalentPoolRefineCriteria {
  const text = prompt.toLowerCase()
  return {
    jobTitle:
      pickFromPrompt(text, JOB_TITLE_FROM_PROMPT) ??
      DEFAULT_TALENT_POOL_REFINE_CRITERIA.jobTitle,
    locationPrimary:
      pickFromPrompt(text, LOCATION_FROM_PROMPT) ??
      DEFAULT_TALENT_POOL_REFINE_CRITERIA.locationPrimary,
    jobRadius:
      pickFromPrompt(text, JOB_RADIUS_FROM_PROMPT) ??
      DEFAULT_TALENT_POOL_REFINE_CRITERIA.jobRadius,
    experienceLevel:
      pickFromPrompt(text, EXPERIENCE_FROM_PROMPT) ??
      DEFAULT_TALENT_POOL_REFINE_CRITERIA.experienceLevel,
  }
}

export const CREATE_TALENT_POOL_STEPS = [
  { id: 'details', label: 'Details' },
  { id: 'autoUpdate', label: 'Auto Update' },
  { id: 'review', label: 'Review' },
] as const

export type TalentPoolPrivacy = 'private' | 'public' | ''

export type CreateTalentPoolFormState = {
  name: string
  owners: string[]
  description: string
  privacy: TalentPoolPrivacy
  autoUpdate: boolean
  createdBy: string
  jobTitles: string[]
  skills: string[]
  experienceMin: number
  experienceMax: number
  location: string
  jobRadius: string
}

export const TALENT_POOL_JOB_TITLE_CRITERIA_OPTIONS = [
  'Data Analyst',
  'Finance Analyst',
  'Software Developer',
  'Software Engineer',
  'Product Manager',
  'Senior Finance Analyst',
  'Junior Finance Analyst',
]

export const TALENT_POOL_SKILL_OPTIONS = [
  'CFA',
  'React',
  'Node.js',
  'TypeScript',
  'Python',
  'SQL',
  'Java',
  'AWS',
]

export const TALENT_POOL_LOCATION_CITY_OPTIONS = [
  'Riyadh',
  'Jeddah',
  'Dubai',
  'Ahmedabad',
  'London',
  'Remote',
]

export const TALENT_POOL_RADIUS_OPTIONS = [
  'within 25 km',
  'within 50 km',
  'within 100 km',
  'within 200 km',
  'within 900 km',
]

export const emptyCreateTalentPoolForm: CreateTalentPoolFormState = {
  name: '',
  owners: [],
  description: '',
  privacy: '',
  autoUpdate: false,
  createdBy: 'Jonathan Mathew',
  jobTitles: [],
  skills: [],
  experienceMin: 0,
  experienceMax: 0,
  location: '',
  jobRadius: '',
}

export type CreateTalentPoolNavState = {
  /** Skip to Manual — open blank wizard */
  manualEntry?: boolean
  /** Skip & Create New — open wizard prefilled from prompt */
  aiContinue?: boolean
  aiPrompt?: string
  similarPoolId?: string
  similarPoolName?: string
  refineCriteria?: TalentPoolRefineCriteria
}

const DEFAULT_AI_OWNER = 'Sarah Johnson'

function blankCreateTalentPoolForm(): CreateTalentPoolFormState {
  return {
    ...emptyCreateTalentPoolForm,
    owners: [],
    jobTitles: [],
    skills: [],
  }
}

function poolNameFromAi(
  state: CreateTalentPoolNavState,
  prompt: string,
  refine: TalentPoolRefineCriteria,
): string {
  return (
    state.similarPoolName?.trim() ||
    prompt ||
    (refine.jobTitle ? `${refine.jobTitle} talent pool` : 'New Talent Pool')
  )
}

const EXPERIENCE_RANGE_BY_LEVEL: Record<
  string,
  { experienceMin: number; experienceMax: number }
> = {
  '0-2 Years': { experienceMin: 0, experienceMax: 2 },
  '3-7 Years': { experienceMin: 3, experienceMax: 7 },
  '5-10 Years': { experienceMin: 5, experienceMax: 10 },
  '10+ Years': { experienceMin: 10, experienceMax: 20 },
  '15+ Years': { experienceMin: 15, experienceMax: 25 },
}

function experienceRangeFromLevel(level: string): {
  experienceMin: number
  experienceMax: number
} {
  return (
    EXPERIENCE_RANGE_BY_LEVEL[level] ?? {
      experienceMin: 0,
      experienceMax: 7,
    }
  )
}

function locationCityFromRefine(locationPrimary: string): string {
  if (!locationPrimary) return ''
  return locationPrimary.split(',')[0]?.trim() ?? ''
}

const RADIUS_FROM_REFINE: Array<{ match: string; value: string }> = [
  { match: '50', value: 'within 50 km' },
  { match: '25', value: 'within 25 km' },
  { match: '100', value: 'within 100 km' },
  { match: '200', value: 'within 200 km' },
]

function radiusFromRefine(jobRadius: string): string {
  if (!jobRadius) return 'within 50 km'
  return (
    RADIUS_FROM_REFINE.find((entry) => jobRadius.includes(entry.match))
      ?.value ?? 'within 50 km'
  )
}

function skillsFromPrompt(prompt: string): string[] {
  const text = prompt.toLowerCase()
  const matched = TALENT_POOL_SKILL_OPTIONS.filter((skill) =>
    text.includes(skill.toLowerCase()),
  )
  if (matched.length > 0) return matched
  if (
    text.includes('finance') ||
    text.includes('cfa') ||
    text.includes('banking')
  ) {
    return ['CFA']
  }
  if (text.includes('react') || text.includes('node')) {
    return ['React', 'Node.js']
  }
  return []
}

/**
 * Build wizard form from AI prompt / similar pool, or blank for manual entry.
 */
export function createTalentPoolFormFromNavState(
  state: CreateTalentPoolNavState | null,
): CreateTalentPoolFormState {
  if (!state || state.manualEntry || !state.aiContinue) {
    return blankCreateTalentPoolForm()
  }

  const prompt = state.aiPrompt?.trim() ?? ''
  const refine = state.refineCriteria ?? refineCriteriaFromPrompt(prompt)
  const name = poolNameFromAi(state, prompt, refine)
  const experience = experienceRangeFromLevel(refine.experienceLevel)

  return {
    name,
    owners: [DEFAULT_AI_OWNER],
    description: prompt || name,
    privacy: 'public',
    autoUpdate: true,
    createdBy: 'Jonathan Mathew',
    jobTitles: refine.jobTitle ? [refine.jobTitle] : ['Data Analyst'],
    skills: skillsFromPrompt(prompt),
    experienceMin: experience.experienceMin,
    experienceMax: experience.experienceMax,
    location: locationCityFromRefine(refine.locationPrimary) || 'Riyadh',
    jobRadius: radiusFromRefine(refine.jobRadius),
  }
}

export function formatExperienceRange(min: number, max: number): string {
  if (min === 0 && max === 0) return '—'
  return `${min}-${max} Years`
}

export function estimateMatchingCandidates(
  form: CreateTalentPoolFormState,
): number {
  const hasCriteria =
    form.jobTitles.length > 0 || form.skills.length > 0 || Boolean(form.location)
  if (!hasCriteria) return 0

  let count = 1
  if (form.jobTitles.length > 1) count += form.jobTitles.length
  if (form.skills.length > 1) count += form.skills.length
  if (form.jobRadius.includes('900')) count += 12
  return count
}

/** Display helper: join non-empty lists, otherwise em dash. */
export function listOrDash(values: string[]): string {
  return values.length > 0 ? values.join(', ') : '—'
}

export function textOrDash(value: string): string {
  return value.trim() ? value : '—'
}
