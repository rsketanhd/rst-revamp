import {
  getMyProfile,
  updateMyProfile,
  type CompensationEntry,
  type EducationEntry,
  type JobInfoEntry,
  type MyProfileState,
} from './myProfile'

/**
 * Resume → profile review. Compares the parsed resume with the current
 * profile field by field so the candidate chooses what to apply.
 * Parsing is mocked: RESUME_PARSE stands in for the parser output.
 */

export type ResumeFieldKey =
  | 'fullName'
  | 'email'
  | 'contactNumber'
  | 'nationality'
  | 'country'
  | 'provinceState'
  | 'city'
  | 'currentTitle'
  | 'currentCompany'
  | 'experience'
  | 'currentSalary'
  | 'expectedSalary'
  | 'highestEducation'

export type ResumeFieldSection = 'identity' | 'resume'

export type ResumeFieldStatus = 'same' | 'empty' | 'conflict'

export type ResumeReviewField = {
  key: ResumeFieldKey
  label: string
  section: ResumeFieldSection
  current: string
  resume: string
  status: ResumeFieldStatus
  /** Parser confidence — confident conflicts default to the resume value */
  confident: boolean
}

type ParsedValue = { value: string; confident: boolean }

const RESUME_PARSE: Record<ResumeFieldKey, ParsedValue> = {
  fullName: { value: 'Sarah Johnson', confident: true },
  email: { value: 'sarah.johnson@gmail.com', confident: true },
  contactNumber: { value: '+1 (310) 555-0142', confident: false },
  nationality: { value: 'American', confident: true },
  country: { value: 'United States', confident: true },
  provinceState: { value: 'CA', confident: true },
  city: { value: 'Los Angeles', confident: true },
  currentTitle: { value: 'Senior Data Scientist', confident: false },
  currentCompany: { value: 'Netflix', confident: true },
  experience: { value: '6 years', confident: true },
  currentSalary: { value: '$145,000', confident: false },
  expectedSalary: { value: '$165,000 – $180,000', confident: true },
  highestEducation: { value: 'M.S. Data Science', confident: true },
}

const RESUME_SKILLS = [
  'Python',
  'SQL',
  'Machine Learning',
  'TensorFlow',
  'Apache Spark',
  'Tableau',
]

const FIELD_META: Array<{
  key: ResumeFieldKey
  label: string
  section: ResumeFieldSection
}> = [
  { key: 'fullName', label: 'Full Name', section: 'identity' },
  { key: 'email', label: 'Email', section: 'identity' },
  { key: 'contactNumber', label: 'Contact Number', section: 'identity' },
  { key: 'nationality', label: 'Nationality', section: 'identity' },
  { key: 'country', label: 'Country', section: 'resume' },
  { key: 'provinceState', label: 'Province/State', section: 'resume' },
  { key: 'city', label: 'City', section: 'resume' },
  { key: 'currentTitle', label: 'Current Title', section: 'resume' },
  { key: 'currentCompany', label: 'Current Company', section: 'resume' },
  { key: 'experience', label: 'Total Experience', section: 'resume' },
  { key: 'currentSalary', label: 'Current Salary', section: 'resume' },
  { key: 'expectedSalary', label: 'Expected Salary', section: 'resume' },
  { key: 'highestEducation', label: 'Highest Education', section: 'resume' },
]

function currentValues(state: MyProfileState): Record<ResumeFieldKey, string> {
  const info = state.personalInfo
  const job = state.jobInformation[0]
  const comp = state.compensation[0]
  const edu = state.education[0]
  const phone = info.contactNumber.trim()
  const years = comp?.experienceYears.trim()
  const from = comp?.expectedSalaryFrom.trim() ?? ''
  const to = comp?.expectedSalaryTo.trim() ?? ''
  return {
    fullName: info.fullName,
    email: info.email,
    contactNumber: phone ? `${info.countryCode.trim()} ${phone}`.trim() : '',
    nationality: info.nationality,
    country: info.country,
    provinceState: info.provinceState,
    city: info.city,
    currentTitle: job?.currentTitle ?? '',
    currentCompany: job?.currentCompany ?? '',
    experience: years ? `${years} years` : '',
    currentSalary: comp?.currentSalary ?? '',
    expectedSalary: from && to ? `${from} – ${to}` : from || to,
    highestEducation: edu?.degree ?? '',
  }
}

const normalize = (value: string) => value.trim().toLowerCase()

export function buildResumeReview(state: MyProfileState = getMyProfile()): {
  fields: ResumeReviewField[]
  newSkills: string[]
} {
  const current = currentValues(state)
  const fields = FIELD_META.map((meta) => {
    const parsed = RESUME_PARSE[meta.key]
    const mine = current[meta.key].trim()
    const status: ResumeFieldStatus = !mine
      ? 'empty'
      : normalize(mine) === normalize(parsed.value)
        ? 'same'
        : 'conflict'
    return {
      ...meta,
      current: mine,
      resume: parsed.value,
      status,
      confident: parsed.confident,
    }
  })
  const owned = new Set(state.skills.map(normalize))
  const newSkills = RESUME_SKILLS.filter((s) => !owned.has(normalize(s)))
  return { fields, newSkills }
}

/** Default choice: identity fields are never applied unless chosen. */
export function defaultUseResume(field: ResumeReviewField): boolean {
  if (field.status === 'same') return false
  if (field.section === 'identity') return false
  if (field.status === 'empty') return true
  return field.confident
}

function splitPhone(value: string): { countryCode: string; contactNumber: string } {
  const match = value.trim().match(/^(\+\d+)\s*(.*)$/)
  return match
    ? { countryCode: match[1], contactNumber: match[2] }
    : { countryCode: '', contactNumber: value.trim() }
}

function splitRange(value: string): [string, string] {
  const [from = '', to = ''] = value.split(/\s*[–-]\s*/)
  return [from.trim(), to.trim()]
}

const EMPTY_JOB: Omit<JobInfoEntry, 'id'> = {
  jobType: '',
  currentTitle: '',
  currentJobLocation: '',
  currentCompany: '',
  workPermit: '',
  preferredJobLocation: '',
  startDate: '',
  endDate: '',
  currentlyWorking: true,
}

const EMPTY_COMP: Omit<CompensationEntry, 'id'> = {
  experienceYears: '',
  experienceMonths: '',
  currentSalary: '',
  expectedSalaryFrom: '',
  expectedSalaryTo: '',
  currentlyWorking: true,
}

const EMPTY_EDU: Omit<EducationEntry, 'id'> = {
  institution: '',
  degree: '',
  major: '',
  startYear: '',
  endYear: '',
}

const newId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

/**
 * Writes the chosen resume values and skills to the profile and marks the
 * resume as applied.
 */
export function applyResumeReview(
  values: Partial<Record<ResumeFieldKey, string>>,
  skills: string[],
): MyProfileState {
  const state = getMyProfile()
  const info = { ...state.personalInfo }
  const has = (key: ResumeFieldKey) => values[key] !== undefined
  const val = (key: ResumeFieldKey) => (values[key] ?? '').trim()

  if (has('fullName')) info.fullName = val('fullName')
  if (has('email')) info.email = val('email')
  if (has('contactNumber')) {
    const phone = splitPhone(val('contactNumber'))
    info.contactNumber = phone.contactNumber
    if (phone.countryCode) info.countryCode = phone.countryCode
  }
  if (has('nationality')) info.nationality = val('nationality')
  if (has('country')) info.country = val('country')
  if (has('provinceState')) info.provinceState = val('provinceState')
  if (has('city')) info.city = val('city')

  let jobInformation = state.jobInformation
  if (has('currentTitle') || has('currentCompany')) {
    const [first, ...rest] = jobInformation
    const job = first ?? { ...EMPTY_JOB, id: newId('job') }
    jobInformation = [
      {
        ...job,
        ...(has('currentTitle') ? { currentTitle: val('currentTitle') } : {}),
        ...(has('currentCompany') ? { currentCompany: val('currentCompany') } : {}),
      },
      ...rest,
    ]
  }

  let compensation = state.compensation
  if (has('experience') || has('currentSalary') || has('expectedSalary')) {
    const [first, ...rest] = compensation
    const comp = { ...(first ?? { ...EMPTY_COMP, id: newId('comp') }) }
    if (has('experience')) {
      comp.experienceYears = val('experience').match(/\d+/)?.[0] ?? ''
      comp.experienceMonths = comp.experienceMonths || '0'
    }
    if (has('currentSalary')) comp.currentSalary = val('currentSalary')
    if (has('expectedSalary')) {
      const [from, to] = splitRange(val('expectedSalary'))
      comp.expectedSalaryFrom = from
      comp.expectedSalaryTo = to
    }
    compensation = [comp, ...rest]
  }

  let education = state.education
  if (has('highestEducation')) {
    const [first, ...rest] = education
    const edu = first ?? { ...EMPTY_EDU, id: newId('edu') }
    education = [{ ...edu, degree: val('highestEducation') }, ...rest]
  }

  return updateMyProfile({
    personalInfo: info,
    jobInformation,
    compensation,
    education,
    skills: [...state.skills, ...skills],
    resumeAppliedToProfile: true,
  })
}
