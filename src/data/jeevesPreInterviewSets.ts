/**
 * Mock data for Jeeves AI Pre-Interview Sets list.
 */

export type PreInterviewView = 'sets' | 'interviews'

export type PreInterviewLibraryTab = 'all' | 'prescreen' | 'assessment'

export type PreInterviewSetKind = 'prescreen' | 'assessment'

export type PreInterviewSet = {
  id: string
  name: string
  kind: PreInterviewSetKind
  isDefault: boolean
  savedAt: string
  savedBy?: string
  completed: number
  total: number
  questionCount: number
  enabledCount: number
  version: number
  /** Null when the set has no score (chat prescreen). */
  passMarkPercent: number | null
  bestScorePts: number | null
  sentCount: number
  updatedOn: string
  /** Jobs this set has been used with (detail subtitle). */
  usedInJobs: string[]
  /** Optional search tokens (question snippets). */
  questionHints: string[]
}

export type PreInterviewCandidateStatus =
  | 'invited'
  | 'completed'
  | 'incomplete'
  | 'expired'
  | 'cancelled'

export type PreInterviewCandidateStatusTab =
  | 'all'
  | PreInterviewCandidateStatus

export type PreInterviewSetVersionFilter = 'all' | 'current'

export type PreInterviewSetVersion = {
  id: string
  label: string
  filter: PreInterviewSetVersionFilter
  isCurrent: boolean
  savedAt?: string
  savedBy?: string
  candidateCount: number
  completedCount: number
}

export type PreInterviewStepOutcome = 'passed' | 'failed' | 'pending'

export type PreInterviewSetCandidate = {
  id: string
  setId: string
  name: string
  email: string
  job: string
  jobId: string
  stepLabel: string
  stepOutcomes: PreInterviewStepOutcome[]
  version: number
  sendsUsed: number
  sendsLimit: number
  invitedOn: string
  status: PreInterviewCandidateStatus
  result: 'passed' | 'failed' | 'none'
  expiringOn: string
  /** Shown under name when chat is done and assessment can be sent. */
  readyForAssessment: boolean
}

export type PreInterviewInstanceStatus =
  | 'sent-not-started'
  | 'completed-with-results'
  | 'left-incomplete'
  | 'expired'
  | 'cancelled'

export const PRE_INTERVIEW_INSTANCE_STATUS_OPTIONS: Array<{
  value: PreInterviewInstanceStatus
  label: string
}> = [
  { value: 'sent-not-started', label: 'Sent, not started' },
  { value: 'completed-with-results', label: 'Completed, with results' },
  { value: 'left-incomplete', label: 'Left incomplete' },
  { value: 'expired', label: 'Expired' },
  { value: 'cancelled', label: 'Cancelled' },
]

export type PreInterviewStoryCheck = 'safe' | 'flagged' | 'pending' | 'none'

export type PreInterviewKnockout = 'yes' | 'no' | 'pending'

export type PreInterviewChatStatus =
  | 'completed'
  | 'in-progress'
  | 'invited'
  | 'none'

export type PreInterviewAssessment =
  | {
      kind: 'scored'
      percent: number
      passed: boolean
      completedOn: string
      setName: string
      passMarkPercent: number
    }
  | {
      kind: 'send'
      hint: string
    }
  | {
      kind: 'none'
    }

/** One candidate × job row on All Pre-Interviews. */
export type PreInterviewInstance = {
  id: string
  name: string
  email: string
  jobTitle: string
  jobId: string
  recommended: boolean
  experience: string
  cvYears: string
  city: string
  region: string
  country: string
  knockout: PreInterviewKnockout
  storyCheck: PreInterviewStoryCheck
  chatStatus: PreInterviewChatStatus
  chatCompletedOn?: string
  chatSetName?: string
  assessment: PreInterviewAssessment
  status: PreInterviewInstanceStatus
  source: string
  jeevesSummary: string
}

/** Question type labels shown on View Questions panel. */
export type PreInterviewViewQuestionType =
  | 'yes-no'
  | 'multi-choice'
  | 'single-choice'
  | 'country'
  | 'city'
  | 'text'
  | 'number'

export type PreInterviewViewQuestion = {
  id: string
  text: string
  type: PreInterviewViewQuestionType
  /** Choice options shown after the type label (e.g. 0-2 · 3-5). */
  options?: string[]
  enabled: boolean
}

export type PreInterviewSetQuestions = {
  setId: string
  intro: string
  closing: string
  closingMessageCount: number
  questions: PreInterviewViewQuestion[]
}

const SETS: PreInterviewSet[] = [
  {
    id: 'rule-1',
    name: 'Rule 1',
    kind: 'prescreen',
    isDefault: true,
    savedAt: '19 Oct 2026, 13:06',
    savedBy: 'ketan',
    completed: 0,
    total: 0,
    questionCount: 4,
    enabledCount: 4,
    version: 1,
    passMarkPercent: null,
    bestScorePts: null,
    sentCount: 0,
    updatedOn: '19 Oct 2026',
    usedInJobs: [],
    questionHints: ['experience', 'location', 'notice period'],
  },
  {
    id: 'data-science-tech',
    name: 'data science Tech',
    kind: 'prescreen',
    isDefault: false,
    savedAt: '10 Oct 2026, 11:40',
    savedBy: 'Chiranjeev Parsoya',
    completed: 1,
    total: 1,
    questionCount: 3,
    enabledCount: 3,
    version: 1,
    passMarkPercent: null,
    bestScorePts: null,
    sentCount: 1,
    updatedOn: '10 Oct 2026',
    usedInJobs: ['Data Scientist'],
    questionHints: ['ML frameworks', 'hybrid work'],
  },
  {
    id: 'default-prescreen',
    name: 'Default prescreen',
    kind: 'prescreen',
    isDefault: false,
    savedAt: '10 Oct 2026, 11:30',
    completed: 3,
    total: 3,
    questionCount: 6,
    enabledCount: 6,
    version: 1,
    passMarkPercent: null,
    bestScorePts: null,
    sentCount: 3,
    updatedOn: '10 Oct 2026',
    usedInJobs: ['Product Manager', 'UX Designer'],
    questionHints: ['experience', 'country', 'city', 'relocation'],
  },
  {
    id: 'assesment-1',
    name: 'assesment-1',
    kind: 'assessment',
    isDefault: false,
    savedAt: '10 Oct 2026, 15:04',
    savedBy: 'Chiranjeev Parsoya',
    completed: 2,
    total: 2,
    questionCount: 1,
    enabledCount: 1,
    version: 1,
    passMarkPercent: 60,
    bestScorePts: 10,
    sentCount: 2,
    updatedOn: '10 Oct 2026',
    usedInJobs: ['Backend Engineer'],
    questionHints: ['algorithms', 'sorting'],
  },
]

/** Candidate rows for set detail — Rule 1 is empty per design. */
const CANDIDATES: PreInterviewSetCandidate[] = [
  {
    id: 'cand-1',
    setId: 'data-science-tech',
    name: 'Nirali Khoda',
    email: 'nirali.khoda@email.com',
    job: 'Data Scientist',
    jobId: '1267-0001',
    stepLabel: 'Step 1 of 2',
    stepOutcomes: ['passed', 'passed'],
    version: 1,
    sendsUsed: 1,
    sendsLimit: 3,
    invitedOn: '10 Oct 2026',
    status: 'completed',
    result: 'passed',
    expiringOn: '17 Oct 2026',
    readyForAssessment: true,
  },
  {
    id: 'cand-2',
    setId: 'default-prescreen',
    name: 'Rahul Mehta',
    email: 'rahul.mehta@email.com',
    job: 'Product Manager',
    jobId: '1267-0002',
    stepLabel: 'Step 1 of 2',
    stepOutcomes: ['pending', 'pending'],
    version: 1,
    sendsUsed: 1,
    sendsLimit: 3,
    invitedOn: '11 Oct 2026',
    status: 'invited',
    result: 'none',
    expiringOn: '18 Oct 2026',
    readyForAssessment: false,
  },
  {
    id: 'cand-3',
    setId: 'default-prescreen',
    name: 'Priya Singh',
    email: 'priya.singh@email.com',
    job: 'UX Designer',
    jobId: '1267-0003',
    stepLabel: 'Step 2 of 2',
    stepOutcomes: ['passed', 'passed'],
    version: 1,
    sendsUsed: 2,
    sendsLimit: 3,
    invitedOn: '09 Oct 2026',
    status: 'completed',
    result: 'passed',
    expiringOn: '16 Oct 2026',
    readyForAssessment: false,
  },
  {
    id: 'cand-4',
    setId: 'default-prescreen',
    name: 'Sara Alami',
    email: 'sara.alami@email.com',
    job: 'Product Manager',
    jobId: '1267-0004',
    stepLabel: 'Step 1 of 2',
    stepOutcomes: ['failed', 'pending'],
    version: 1,
    sendsUsed: 1,
    sendsLimit: 3,
    invitedOn: '08 Oct 2026',
    status: 'incomplete',
    result: 'failed',
    expiringOn: '15 Oct 2026',
    readyForAssessment: false,
  },
  {
    id: 'cand-5',
    setId: 'assesment-1',
    name: 'Omar Khalid',
    email: 'omar.khalid@email.com',
    job: 'Backend Engineer',
    jobId: '1267-0005',
    stepLabel: 'Step 1 of 1',
    stepOutcomes: ['passed'],
    version: 1,
    sendsUsed: 1,
    sendsLimit: 3,
    invitedOn: '12 Oct 2026',
    status: 'completed',
    result: 'passed',
    expiringOn: '19 Oct 2026',
    readyForAssessment: false,
  },
  {
    id: 'cand-6',
    setId: 'assesment-1',
    name: 'Maya Chen',
    email: 'maya.chen@email.com',
    job: 'Backend Engineer',
    jobId: '1267-0006',
    stepLabel: 'Step 1 of 1',
    stepOutcomes: ['failed'],
    version: 1,
    sendsUsed: 2,
    sendsLimit: 3,
    invitedOn: '13 Oct 2026',
    status: 'completed',
    result: 'failed',
    expiringOn: '20 Oct 2026',
    readyForAssessment: false,
  },
]

const INTERVIEWS: PreInterviewInstance[] = [
  {
    id: 'pi-1',
    name: 'Nicholas Tondee',
    email: 'nicholas.tondee@email.com',
    jobTitle: 'Data Scientist',
    jobId: '1267-0001',
    recommended: true,
    experience: '9.1 to 12 years',
    cvYears: '23 years',
    city: 'Tebessa',
    region: 'Tebessa',
    country: 'Algeria',
    knockout: 'no',
    storyCheck: 'safe',
    chatStatus: 'completed',
    chatCompletedOn: '10 Oct',
    chatSetName: 'Default prescreen',
    assessment: {
      kind: 'scored',
      percent: 0,
      passed: false,
      completedOn: '10 Oct',
      setName: 'assesment-1',
      passMarkPercent: 60,
    },
    status: 'completed-with-results',
    source: 'Invite',
    jeevesSummary:
      '9.1 to 12 years experience, Jaipur, Rajasthan, India, open to relocating, notice 16 to 30 days. Chat completed; assessment scored 0% (below 60% pass mark). Story check safe.',
  },
  {
    id: 'pi-2',
    name: 'Aisha Rahman',
    email: 'aisha.rahman@email.com',
    jobTitle: 'Data Scientist',
    jobId: '1267-0001',
    recommended: false,
    experience: '5 to 8 years',
    cvYears: '7 years',
    city: 'Bengaluru',
    region: 'Karnataka',
    country: 'India',
    knockout: 'no',
    storyCheck: 'safe',
    chatStatus: 'completed',
    chatCompletedOn: '11 Oct',
    chatSetName: 'Default prescreen',
    assessment: {
      kind: 'scored',
      percent: 100,
      passed: true,
      completedOn: '11 Oct',
      setName: 'assesment-1',
      passMarkPercent: 60,
    },
    status: 'completed-with-results',
    source: 'Walk-in',
    jeevesSummary:
      '5 to 8 years experience, Bengaluru, Karnataka, India, not open to relocating, notice 30 days. Chat completed; assessment scored 100% (passed). Story check safe.',
  },
  {
    id: 'pi-3',
    name: 'Rahul Mehta',
    email: 'rahul.mehta@email.com',
    jobTitle: 'Product Manager',
    jobId: '1267-0002',
    recommended: true,
    experience: '3 to 5 years',
    cvYears: '4 years',
    city: 'Mumbai',
    region: 'Maharashtra',
    country: 'India',
    knockout: 'no',
    storyCheck: 'safe',
    chatStatus: 'completed',
    chatCompletedOn: '12 Oct',
    chatSetName: 'data science Tech',
    assessment: {
      kind: 'send',
      hint: 'Chat prescreen passed',
    },
    status: 'completed-with-results',
    source: 'Invite',
    jeevesSummary:
      '3 to 5 years experience, Mumbai, Maharashtra, India, open to relocating, notice 15 days. Chat completed on data science Tech; ready for assessment. Story check safe.',
  },
]

export function countInstancesByStatus(
  instances: PreInterviewInstance[],
): Record<'all' | PreInterviewInstanceStatus, number> {
  const counts: Record<'all' | PreInterviewInstanceStatus, number> = {
    all: instances.length,
    'sent-not-started': 0,
    'completed-with-results': 0,
    'left-incomplete': 0,
    expired: 0,
    cancelled: 0,
  }
  for (const instance of instances) {
    counts[instance.status] += 1
  }
  return counts
}

export function instanceStatusLabel(
  status: PreInterviewInstanceStatus,
): string {
  switch (status) {
    case 'sent-not-started':
      return 'Sent, not started'
    case 'completed-with-results':
      return 'Completed, with results'
    case 'left-incomplete':
      return 'Left incomplete'
    case 'expired':
      return 'Expired'
    case 'cancelled':
      return 'Cancelled'
    default: {
      const exhaustive: never = status
      return exhaustive
    }
  }
}

export function getPreInterviewSets(): PreInterviewSet[] {
  return SETS.map((set) => ({
    ...set,
    questionHints: [...set.questionHints],
  }))
}

export function getPreInterviewSetById(
  id: string,
): PreInterviewSet | undefined {
  const set = SETS.find((item) => item.id === id)
  return set
    ? { ...set, questionHints: [...set.questionHints] }
    : undefined
}

export function getPreInterviewInstances(): PreInterviewInstance[] {
  return INTERVIEWS.map((item) => ({ ...item }))
}

export function kindLabel(kind: PreInterviewSetKind): string {
  switch (kind) {
    case 'prescreen':
      return 'Chat prescreen'
    case 'assessment':
      return 'Assessment'
    default: {
      const exhaustive: never = kind
      return exhaustive
    }
  }
}

export function setDetailSubtitle(set: PreInterviewSet): string {
  const kind = kindLabel(set.kind)
  const by = set.savedBy ? ` by ${set.savedBy}` : ''
  const usage =
    set.usedInJobs.length === 0
      ? 'Not sent yet.'
      : set.usedInJobs.length === 1
        ? `Used in 1 job: ${set.usedInJobs[0]}.`
        : `Used in ${set.usedInJobs.length} jobs: ${set.usedInJobs.join(', ')}.`
  return `${kind}, ${set.questionCount} questions, ${set.enabledCount} switched on. Version ${set.version}, saved ${set.savedAt}${by}. ${usage}`
}

export function getSetVersions(set: PreInterviewSet): PreInterviewSetVersion[] {
  const candidates = getSetCandidates(set.id)
  const completedCount = candidates.filter((c) => c.status === 'completed').length
  return [
    {
      id: 'all',
      label: 'All Versions',
      filter: 'all',
      isCurrent: false,
      candidateCount: candidates.length,
      completedCount,
    },
    {
      id: `v-${set.version}`,
      label: `Version ${set.version} - Current`,
      filter: 'current',
      isCurrent: true,
      savedAt: set.savedAt,
      savedBy: set.savedBy,
      candidateCount: candidates.length,
      completedCount,
    },
  ]
}

export function getSetCandidates(setId: string): PreInterviewSetCandidate[] {
  return CANDIDATES.filter((item) => item.setId === setId).map((item) => ({
    ...item,
  }))
}

const SET_QUESTIONS: PreInterviewSetQuestions[] = [
  {
    setId: 'data-science-tech',
    intro:
      'Hi [NAME], a few quick questions about the [JOB_TITLE] role at [COMPANY_NAME].',
    closing: 'Thank you for your time. Our team will be in touch shortly.',
    closingMessageCount: 1,
    questions: [
      {
        id: 'dst-q1',
        text: 'how many years of experienece with python',
        type: 'multi-choice',
        options: ['0-2', '3-5', '5-10', '10+'],
        enabled: true,
      },
      {
        id: 'dst-q2',
        text: 'do you have Production deployment experience',
        type: 'multi-choice',
        options: ['yes', 'No'],
        enabled: true,
      },
      {
        id: 'dst-q3',
        text: 'do you have Gen AI experinece',
        type: 'yes-no',
        enabled: true,
      },
    ],
  },
  {
    setId: 'rule-1',
    intro:
      'Hi [NAME], thanks for your interest in [JOB_TITLE] at [COMPANY_NAME].',
    closing: 'Thanks — we will review your answers shortly.',
    closingMessageCount: 1,
    questions: [
      {
        id: 'r1-q1',
        text: 'How many years of relevant experience do you have?',
        type: 'multi-choice',
        options: ['0-2', '3-5', '5-10', '10+'],
        enabled: true,
      },
      {
        id: 'r1-q2',
        text: 'Are you currently based in this country?',
        type: 'yes-no',
        enabled: true,
      },
      {
        id: 'r1-q3',
        text: 'What is your notice period?',
        type: 'single-choice',
        options: ['Immediate', '15 days', '30 days', '60+ days'],
        enabled: true,
      },
      {
        id: 'r1-q4',
        text: 'Are you open to hybrid or onsite work?',
        type: 'yes-no',
        enabled: true,
      },
    ],
  },
  {
    setId: 'default-prescreen',
    intro:
      'Hi [NAME], a few quick questions about the [JOB_TITLE] role at [COMPANY_NAME].',
    closing: 'Thank you for your time. Our team will be in touch shortly.',
    closingMessageCount: 1,
    questions: [
      {
        id: 'dp-q1',
        text: 'How many years of experience do you have?',
        type: 'multi-choice',
        options: ['0-2', '3-5', '5-10', '10+'],
        enabled: true,
      },
      {
        id: 'dp-q2',
        text: 'Which country are you currently based in?',
        type: 'country',
        enabled: true,
      },
      {
        id: 'dp-q3',
        text: 'Which city are you based in?',
        type: 'city',
        enabled: true,
      },
      {
        id: 'dp-q4',
        text: 'Are you open to relocation?',
        type: 'yes-no',
        enabled: true,
      },
      {
        id: 'dp-q5',
        text: 'What is your expected notice period?',
        type: 'single-choice',
        options: ['Immediate', '15 days', '30 days', '60+ days'],
        enabled: true,
      },
      {
        id: 'dp-q6',
        text: 'Anything else we should know?',
        type: 'text',
        enabled: true,
      },
    ],
  },
  {
    setId: 'assesment-1',
    intro:
      'Hi [NAME]! This is a short skill check for [JOB_TITLE]. Answer on your own — there are no trick questions.',
    closing:
      'Thanks — your answers are in. The hiring team will review your results and get back to you.',
    closingMessageCount: 1,
    questions: [
      {
        id: 'a1-q1',
        text: 'Which sorting algorithm has average O(n log n) time complexity?',
        type: 'single-choice',
        options: ['Bubble sort', 'Merge sort', 'Insertion sort', 'Linear search'],
        enabled: true,
      },
    ],
  },
]

export function getSetQuestions(
  setId: string,
): PreInterviewSetQuestions | undefined {
  const found = SET_QUESTIONS.find((item) => item.setId === setId)
  if (!found) return undefined
  return {
    ...found,
    questions: found.questions.map((question) => ({ ...question })),
  }
}

export function viewQuestionTypeLabel(
  type: PreInterviewViewQuestionType,
): string {
  switch (type) {
    case 'yes-no':
      return 'Yes / No'
    case 'multi-choice':
      return 'Multi choice (buttons)'
    case 'single-choice':
      return 'Single choice (buttons)'
    case 'country':
      return 'Country (searchable)'
    case 'city':
      return 'City (searchable)'
    case 'text':
      return 'Free text'
    case 'number':
      return 'Number'
    default: {
      const exhaustive: never = type
      return exhaustive
    }
  }
}

export function viewQuestionSummary(
  question: PreInterviewViewQuestion,
): string {
  const typeLabel = viewQuestionTypeLabel(question.type)
  if (question.options && question.options.length > 0) {
    return `${typeLabel}: ${question.options.join(' · ')}`
  }
  return typeLabel
}

export function countCandidatesByStatus(
  candidates: PreInterviewSetCandidate[],
): Record<PreInterviewCandidateStatusTab, number> {
  const counts: Record<PreInterviewCandidateStatusTab, number> = {
    all: candidates.length,
    invited: 0,
    completed: 0,
    incomplete: 0,
    expired: 0,
    cancelled: 0,
  }
  for (const candidate of candidates) {
    counts[candidate.status] += 1
  }
  return counts
}

export function filterSetsByLibrary(
  sets: PreInterviewSet[],
  tab: PreInterviewLibraryTab,
): PreInterviewSet[] {
  switch (tab) {
    case 'all':
      return sets
    case 'prescreen':
      return sets.filter((set) => set.kind === 'prescreen')
    case 'assessment':
      return sets.filter((set) => set.kind === 'assessment')
    default: {
      const _exhaustive: never = tab
      return _exhaustive
    }
  }
}

export function countSetsByLibrary(
  sets: PreInterviewSet[],
  tab: PreInterviewLibraryTab,
): number {
  return filterSetsByLibrary(sets, tab).length
}

export function matchesSetQuery(set: PreInterviewSet, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    set.name.toLowerCase().includes(q) ||
    set.questionHints.some((hint) => hint.toLowerCase().includes(q)) ||
    (set.savedBy?.toLowerCase().includes(q) ?? false)
  )
}

export function matchesInstanceQuery(
  item: PreInterviewInstance,
  query: string,
): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    item.name.toLowerCase().includes(q) ||
    item.email.toLowerCase().includes(q) ||
    item.jobTitle.toLowerCase().includes(q) ||
    item.jobId.toLowerCase().includes(q) ||
    (item.chatSetName?.toLowerCase().includes(q) ?? false) ||
    (item.assessment.kind === 'scored' &&
      item.assessment.setName.toLowerCase().includes(q))
  )
}
