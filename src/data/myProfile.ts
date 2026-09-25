import { CANDIDATE_DEMO_CREDENTIALS } from '../lib/auth'

export type PersonalInfo = {
  fullName: string
  email: string
  gender: string
  countryCode: string
  contactNumber: string
  country: string
  provinceState: string
  city: string
  nationality: string
}

export type JobInfoEntry = {
  id: string
  jobType: string
  currentTitle: string
  currentJobLocation: string
  currentCompany: string
  workPermit: string
  preferredJobLocation: string
  startDate: string
  endDate: string
  currentlyWorking: boolean
}

export type CompensationEntry = {
  id: string
  experienceYears: string
  experienceMonths: string
  currentSalary: string
  expectedSalaryFrom: string
  expectedSalaryTo: string
  currentlyWorking: boolean
}

export type EducationEntry = {
  id: string
  institution: string
  degree: string
  major: string
  startYear: string
  endYear: string
}

export type MyProfileState = {
  personalInfo: PersonalInfo
  avatarDataUrl: string | null
  resumeFileName: string | null
  /** Display date of the latest upload, e.g. "16 Sep 2026" */
  resumeUploadedOn: string | null
  /** False until the candidate applies the new resume's details to their profile */
  resumeAppliedToProfile: boolean
  skills: string[]
  jobInformation: JobInfoEntry[]
  compensation: CompensationEntry[]
  education: EducationEntry[]
}

export type PendingItemId =
  | 'resume'
  | 'personal-info'
  | 'job-information'
  | 'compensation'
  | 'skills'
  | 'education'

export type PendingItem = {
  id: PendingItemId
  label: string
}

const STORAGE_KEY = 'rst_my_profile'
const MAX_SKILLS = 10

function normalizePersonalInfo(
  value: Partial<PersonalInfo> | undefined,
): PersonalInfo {
  return {
    ...EMPTY_PERSONAL_INFO,
    ...value,
    countryCode: value?.countryCode?.trim() || '+91',
  }
}

function normalizeJobEntry(
  value: Partial<JobInfoEntry> & { id: string },
): JobInfoEntry {
  const legacy = value as Partial<JobInfoEntry> & {
    jobTitle?: string
    company?: string
  }

  return {
    id: value.id,
    jobType: value.jobType ?? '',
    currentTitle: value.currentTitle ?? legacy.jobTitle ?? '',
    currentJobLocation: value.currentJobLocation ?? '',
    currentCompany: value.currentCompany ?? legacy.company ?? '',
    workPermit: value.workPermit ?? '',
    preferredJobLocation: value.preferredJobLocation ?? '',
    startDate: value.startDate ?? '',
    endDate: value.endDate ?? '',
    currentlyWorking: value.currentlyWorking ?? false,
  }
}

function normalizeCompensationEntry(
  value: Partial<CompensationEntry> & { id: string },
): CompensationEntry {
  const legacy = value as Partial<CompensationEntry> & {
    currency?: string
    amount?: string
    frequency?: string
  }

  return {
    id: value.id,
    experienceYears: value.experienceYears ?? '',
    experienceMonths: value.experienceMonths ?? '',
    currentSalary:
      value.currentSalary ??
      (legacy.amount
        ? [legacy.currency, legacy.amount, legacy.frequency]
            .filter(Boolean)
            .join(' ')
        : ''),
    expectedSalaryFrom: value.expectedSalaryFrom ?? '',
    expectedSalaryTo: value.expectedSalaryTo ?? '',
    currentlyWorking: value.currentlyWorking ?? false,
  }
}

function normalizeEducationEntry(
  value: Partial<EducationEntry> & { id: string },
): EducationEntry {
  const legacy = value as Partial<EducationEntry> & {
    institution?: string
    graduationYear?: string
  }

  return {
    id: value.id,
    institution: value.institution ?? legacy.institution ?? '',
    degree: value.degree ?? '',
    major: value.major ?? '',
    startYear: value.startYear ?? '',
    endYear: value.endYear ?? legacy.graduationYear ?? '',
  }
}

const EMPTY_PERSONAL_INFO: PersonalInfo = {
  fullName: '',
  email: CANDIDATE_DEMO_CREDENTIALS.email,
  gender: '',
  countryCode: '+91',
  contactNumber: '',
  country: '',
  provinceState: '',
  city: '',
  nationality: '',
}

const DEFAULT_STATE: MyProfileState = {
  personalInfo: { ...EMPTY_PERSONAL_INFO },
  avatarDataUrl: null,
  resumeFileName: null,
  resumeUploadedOn: null,
  resumeAppliedToProfile: false,
  skills: [],
  jobInformation: [],
  compensation: [],
  education: [],
}

function readState(): MyProfileState {
  if (typeof sessionStorage === 'undefined') {
    return structuredClone(DEFAULT_STATE)
  }

  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return structuredClone(DEFAULT_STATE)
  }

  try {
    const parsed = JSON.parse(raw) as Partial<MyProfileState>
    return {
      ...DEFAULT_STATE,
      ...parsed,
      personalInfo: normalizePersonalInfo(parsed.personalInfo),
      skills: parsed.skills ?? [],
      jobInformation: (parsed.jobInformation ?? []).map(normalizeJobEntry),
      compensation: (parsed.compensation ?? []).map(normalizeCompensationEntry),
      education: (parsed.education ?? []).map(normalizeEducationEntry),
    }
  } catch {
    return structuredClone(DEFAULT_STATE)
  }
}

function writeState(state: MyProfileState) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function getMyProfile(): MyProfileState {
  return readState()
}

export function updateMyProfile(patch: Partial<MyProfileState>): MyProfileState {
  const next = { ...readState(), ...patch }
  writeState(next)
  return next
}

export function updatePersonalInfo(info: PersonalInfo): MyProfileState {
  return updateMyProfile({ personalInfo: info })
}

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatShortDate(date: Date): string {
  return `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

/** Saves a newly uploaded resume; its details are not applied to the profile yet. */
export function setProfileResume(fileName: string | null): MyProfileState {
  return updateMyProfile({
    resumeFileName: fileName,
    resumeUploadedOn: fileName ? formatShortDate(new Date()) : null,
    resumeAppliedToProfile: false,
  })
}

export function setProfileAvatar(dataUrl: string | null): MyProfileState {
  return updateMyProfile({ avatarDataUrl: dataUrl })
}

export function addProfileSkill(skill: string): {
  ok: boolean
  error?: string
  state?: MyProfileState
} {
  const trimmed = skill.trim()
  if (!trimmed) {
    return { ok: false, error: 'Enter a skill before adding.' }
  }

  const state = readState()
  const normalized = trimmed.toLowerCase()

  if (state.skills.some((item) => item.toLowerCase() === normalized)) {
    return { ok: false, error: 'This skill is already added.' }
  }

  if (state.skills.length >= MAX_SKILLS) {
    return { ok: false, error: `You can add up to ${MAX_SKILLS} skills.` }
  }

  const next = updateMyProfile({ skills: [...state.skills, trimmed] })
  return { ok: true, state: next }
}

export function removeProfileSkill(skill: string): MyProfileState {
  const state = readState()
  return updateMyProfile({
    skills: state.skills.filter((item) => item !== skill),
  })
}

export function addJobInformation(
  entry: Omit<JobInfoEntry, 'id'>,
): MyProfileState {
  const state = readState()
  return updateMyProfile({
    jobInformation: [...state.jobInformation, { ...entry, id: createId('job') }],
  })
}

export function addCompensation(
  entry: Omit<CompensationEntry, 'id'>,
): MyProfileState {
  const state = readState()
  return updateMyProfile({
    compensation: [...state.compensation, { ...entry, id: createId('comp') }],
  })
}

export function addEducation(entry: Omit<EducationEntry, 'id'>): MyProfileState {
  const state = readState()
  return updateMyProfile({
    education: [...state.education, { ...entry, id: createId('edu') }],
  })
}

export function getProfileDesignation(state: MyProfileState): string {
  const latestJob = state.jobInformation.find(
    (entry) => entry.currentTitle.trim().length > 0,
  )

  if (latestJob?.currentTitle.trim()) {
    return latestJob.currentTitle.trim()
  }

  return 'Candidate'
}

export function getProfileDisplayName(state: MyProfileState): string {
  return state.personalInfo.fullName.trim() || 'Your Name'
}

export function getProfileLocationLabel(state: MyProfileState): string {
  const { city, provinceState, country } = state.personalInfo
  const parts = [city, provinceState, country].map((part) => part.trim()).filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : 'Add your location'
}

export function getProfileContactLabel(state: MyProfileState): string {
  const { countryCode, contactNumber } = state.personalInfo
  const phone = contactNumber.trim()
  if (!phone) return 'Add your phone'
  return `${countryCode.trim()} ${phone}`.trim()
}

export function getProfileInitials(state: MyProfileState): string {
  const name = state.personalInfo.fullName.trim()
  if (!name) return 'YP'

  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function getProfileCompletionPercent(state: MyProfileState): number {
  let score = 0

  if (state.resumeFileName) score += 15

  const personalFields = Object.values(state.personalInfo)
  const filledPersonal = personalFields.filter((value) => value.trim()).length
  score += Math.round((filledPersonal / personalFields.length) * 30)

  if (state.skills.length > 0) {
    score += Math.min(15, Math.round((state.skills.length / 3) * 15))
  }

  if (state.jobInformation.length > 0) score += 10
  if (state.compensation.length > 0) score += 10
  if (state.education.length > 0) score += 20

  return Math.min(100, score)
}

export function isPersonalInfoComplete(info: PersonalInfo): boolean {
  return (
    info.fullName.trim() !== '' &&
    info.email.trim() !== '' &&
    info.gender.trim() !== '' &&
    info.contactNumber.trim() !== '' &&
    info.country.trim() !== '' &&
    info.provinceState.trim() !== '' &&
    info.city.trim() !== '' &&
    info.nationality.trim() !== ''
  )
}

export function getPendingItems(state: MyProfileState): PendingItem[] {
  const items: PendingItem[] = []

  if (!state.resumeFileName) {
    items.push({ id: 'resume', label: 'Resume' })
  }

  if (!isPersonalInfoComplete(state.personalInfo)) {
    items.push({ id: 'personal-info', label: 'Personal Information' })
  }

  if (state.jobInformation.length === 0) {
    items.push({ id: 'job-information', label: 'Job Information' })
  }

  if (state.compensation.length === 0) {
    items.push({ id: 'compensation', label: 'Compensation' })
  }

  if (state.education.length === 0) {
    items.push({ id: 'education', label: 'Education' })
  }

  if (state.skills.length === 0) {
    items.push({ id: 'skills', label: 'Key Skills' })
  }

  return items
}

export function formatProfileField(value: string): string {
  return value.trim() || '-'
}

export function formatJobTimeline(entry: JobInfoEntry): string {
  const start = entry.startDate.trim()
  const end = entry.endDate.trim()

  if (entry.currentlyWorking) {
    return start ? `${start} - Present` : 'Present'
  }

  if (start && end) return `${start} - ${end}`
  return start || end || '-'
}

export function formatExperienceLabel(entry: CompensationEntry): string {
  const years = entry.experienceYears.trim() || '0'
  const months = entry.experienceMonths.trim() || '0'
  return `${years}yrs ${months} mos`
}

export function formatCompensationSummary(entry: CompensationEntry): string {
  const current = entry.currentSalary.trim()
  const from = entry.expectedSalaryFrom.trim()
  const to = entry.expectedSalaryTo.trim()
  const expected =
    from && to ? `$${from}-$${to}` : from ? `$${from}` : to ? `$${to}` : '-'

  return `Current Salary : $${current || '-'}  •  Expected Salary : ${expected}`
}

export function formatEducationDegreeLine(entry: EducationEntry): string {
  const degree = entry.degree.trim()
  const major = entry.major.trim()

  if (degree && major) return `${degree} - ${major}`
  return degree || major || '-'
}

export function formatEducationYears(entry: EducationEntry): string {
  const start = entry.startYear.trim()
  const end = entry.endYear.trim()

  if (start && end) return `${start} - ${end}`
  return start || end || '-'
}

export const PROFILE_MAX_SKILLS = MAX_SKILLS
