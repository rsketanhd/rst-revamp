import type { PreInterviewSetKind } from '../../../data/jeevesPreInterviewSets'

export const CREATE_PRE_INTERVIEW_STEPS = [
  { id: 'details', label: 'Details' },
  { id: 'questions', label: 'Questions' },
  { id: 'review', label: 'Review' },
] as const

export type PreInterviewQuestionType =
  | 'yes-no'
  | 'multi-choice'
  | 'single-choice'
  | 'country'
  | 'city'
  | 'text'
  | 'number'

export type KnockoutAnswer = 'none' | 'yes' | 'no'

export type AssessmentQuestionKind =
  | 'knowledge'
  | 'situational'
  | 'info'
  | 'consent'

export type BelowPassAction = 'flag' | 'reject' | 'hold'

export type PreInterviewQuestion = {
  id: string
  text: string
  type: PreInterviewQuestionType
  knockout: KnockoutAnswer
  mandatory: boolean
  /** “Ask this question” */
  enabled: boolean
  /** Assessment scored points (prescreen unused). */
  points: number
  assessmentKind: AssessmentQuestionKind
}

export type CreatePreInterviewSetForm = {
  name: string
  kind: PreInterviewSetKind
  isDefault: boolean
  intro: string
  questions: PreInterviewQuestion[]
  closing: string
  requirePassMark: boolean
  passMarkPercent: number
  belowPassAction: BelowPassAction
}

export const QUESTION_LIMIT = 30
export const DEFAULT_ASSESSMENT_POINTS = 10

export const FIELD_TOKENS = [
  '[NAME]',
  '[COMPANY_NAME]',
  '[JOB_TITLE]',
  '[LOCATION]',
] as const

export const DEFAULT_ASSESSMENT_INTRO =
  'Hi [NAME]! This is a short skill check for [JOB_TITLE]. Answer on your own — there are no trick questions.'

export const DEFAULT_ASSESSMENT_CLOSING =
  'Thanks — your answers are in. The hiring team will review your results and get back to you.'

export const QUESTION_TYPE_OPTIONS: Array<{
  value: PreInterviewQuestionType
  label: string
}> = [
  { value: 'yes-no', label: 'Yes / No' },
  { value: 'multi-choice', label: 'Multi choice (buttons)' },
  { value: 'single-choice', label: 'Single choice (buttons)' },
  { value: 'country', label: 'Country (searchable)' },
  { value: 'city', label: 'City (searchable)' },
  { value: 'text', label: 'Free text' },
  { value: 'number', label: 'Number' },
]

export const QUESTION_TYPE_LABEL = Object.fromEntries(
  QUESTION_TYPE_OPTIONS.map(({ value, label }) => [value, label]),
) as Record<PreInterviewQuestionType, string>

export const ASSESSMENT_KIND_OPTIONS: Array<{
  value: AssessmentQuestionKind
  label: string
}> = [
  { value: 'knowledge', label: 'Knowledge check (scored)' },
  { value: 'situational', label: 'Situational (scored)' },
  { value: 'info', label: 'Info' },
  { value: 'consent', label: 'Consent' },
]

export const ASSESSMENT_KIND_LABEL = Object.fromEntries(
  ASSESSMENT_KIND_OPTIONS.map(({ value, label }) => [value, label]),
) as Record<AssessmentQuestionKind, string>

export const KNOCKOUT_OPTIONS: Array<{ value: KnockoutAnswer; label: string }> =
  [
    { value: 'none', label: 'None' },
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ]

export const BELOW_PASS_OPTIONS: Array<{
  value: BelowPassAction
  label: string
}> = [
  {
    value: 'flag',
    label: 'Flag only (shown in the Jeeves AI list)',
  },
  { value: 'reject', label: 'Auto-reject the candidate' },
  { value: 'hold', label: 'Hold for recruiter review' },
]

export function responseTypeHint(type: PreInterviewQuestionType): string | null {
  switch (type) {
    case 'yes-no':
      return 'Answers: Yes · No.'
    case 'multi-choice':
      return 'Candidate can select more than one option.'
    case 'single-choice':
      return 'Candidate selects one option.'
    case 'country':
    case 'city':
    case 'text':
    case 'number':
      return null
    default: {
      const exhaustive: never = type
      return exhaustive
    }
  }
}

function q(
  text: string,
  type: PreInterviewQuestionType,
  extras: Partial<
    Pick<
      PreInterviewQuestion,
      'knockout' | 'mandatory' | 'enabled' | 'points' | 'assessmentKind'
    >
  > = {},
): Omit<PreInterviewQuestion, 'id'> {
  return {
    text,
    type,
    knockout: extras.knockout ?? 'none',
    mandatory: extras.mandatory ?? false,
    enabled: extras.enabled ?? true,
    points: extras.points ?? DEFAULT_ASSESSMENT_POINTS,
    assessmentKind: extras.assessmentKind ?? 'knowledge',
  }
}

export const STANDARD_QUESTIONS: Array<Omit<PreInterviewQuestion, 'id'>> = [
  q('What is your highest education level?', 'single-choice'),
  q('Are you authorized to work in this country?', 'yes-no'),
  q('What is your expected annual compensation?', 'single-choice'),
]

/** Jobs shown in the “Suggest from a job” popover. */
export const SUGGEST_FROM_JOB_OPTIONS = [
  'Data Scientist',
  'Senior Frontend Engineer',
  'Product Manager',
  'Backend Engineer',
] as const

export function suggestedQuestionsForJob(
  jobTitle: string,
): Array<Omit<PreInterviewQuestion, 'id'>> {
  switch (jobTitle) {
    case 'Senior Frontend Engineer':
      return [
        q(
          'Do you have 3 to 12 years of experience in frontend development?',
          'yes-no',
          { mandatory: true },
        ),
        q(
          'Which JavaScript frameworks are you proficient in? (Select all that apply)',
          'multi-choice',
        ),
        q('Have you worked with TypeScript in production?', 'yes-no'),
        q('Are you comfortable with CSS-in-JS or utility-first CSS?', 'yes-no'),
      ]
    case 'Data Scientist':
      return [
        q(
          'Do you have 3+ years of experience in data science or ML?',
          'yes-no',
          { mandatory: true },
        ),
        q(
          'Which ML frameworks are you proficient in? (Select all that apply)',
          'multi-choice',
        ),
        q('Have you deployed a model to production?', 'yes-no'),
        q('Are you familiar with SQL for analytics workloads?', 'yes-no'),
      ]
    case 'Product Manager':
      return [
        q(
          'Do you have 4+ years of product management experience?',
          'yes-no',
          { mandatory: true },
        ),
        q(
          'Which product areas have you owned? (Select all that apply)',
          'multi-choice',
        ),
        q('Have you worked closely with engineering and design?', 'yes-no'),
      ]
    case 'Backend Engineer':
      return [
        q(
          'Do you have 3 to 10 years of backend engineering experience?',
          'yes-no',
          { mandatory: true },
        ),
        q(
          'Which backend languages are you proficient in? (Select all that apply)',
          'multi-choice',
        ),
        q('Have you designed REST or GraphQL APIs at scale?', 'yes-no'),
      ]
    default:
      return [
        q(
          `How many years of experience do you have relevant to ${jobTitle}?`,
          'single-choice',
        ),
        q(
          `What tools have you used most for a ${jobTitle} role?`,
          'multi-choice',
        ),
        q('Are you open to the work arrangement for this role?', 'yes-no'),
      ]
  }
}

export function createBlankQuestion(
  kind: PreInterviewSetKind,
): PreInterviewQuestion {
  return {
    id: `q-${Date.now()}`,
    text: '',
    type: 'yes-no',
    knockout: 'none',
    mandatory: false,
    enabled: true,
    points: DEFAULT_ASSESSMENT_POINTS,
    assessmentKind: kind === 'assessment' ? 'knowledge' : 'info',
  }
}

export function bestPossibleScore(questions: PreInterviewQuestion[]): number {
  return questions
    .filter((q) => q.enabled && isScoredAssessmentKind(q.assessmentKind))
    .reduce((sum, q) => sum + q.points, 0)
}

export function isScoredAssessmentKind(kind: AssessmentQuestionKind): boolean {
  switch (kind) {
    case 'knowledge':
    case 'situational':
      return true
    case 'info':
    case 'consent':
      return false
    default: {
      const exhaustive: never = kind
      return exhaustive
    }
  }
}

export function defaultsForKind(
  kind: PreInterviewSetKind,
): Partial<CreatePreInterviewSetForm> {
  switch (kind) {
    case 'assessment':
      return {
        kind,
        intro: DEFAULT_ASSESSMENT_INTRO,
        closing: DEFAULT_ASSESSMENT_CLOSING,
        questions: [],
        requirePassMark: true,
        passMarkPercent: 60,
        belowPassAction: 'flag',
      }
    case 'prescreen':
      return {
        kind,
        intro: '',
        closing: '',
        questions: [],
        requirePassMark: false,
        passMarkPercent: 60,
        belowPassAction: 'flag',
      }
    default: {
      const exhaustive: never = kind
      return exhaustive
    }
  }
}

export const defaultCreatePreInterviewSetForm: CreatePreInterviewSetForm = {
  name: '',
  kind: 'prescreen',
  isDefault: false,
  intro: '',
  questions: [],
  closing: '',
  requirePassMark: false,
  passMarkPercent: 60,
  belowPassAction: 'flag',
}

/** Shown in the Details step default-set hint. */
export const CURRENT_DEFAULT_SET_NAME = 'Rule 1'

export const SET_TYPE_OPTIONS: Array<{
  value: PreInterviewSetKind
  label: string
  description: string
}> = [
  {
    value: 'prescreen',
    label: 'Chat Prescreens',
    description: 'Conversational screening — collects details, no scores.',
  },
  {
    value: 'assessment',
    label: 'Assessments',
    description:
      'Scored skill check — knowledge and situational questions with a pass mark.',
  },
]

export function setTypeLabel(kind: PreInterviewSetKind): string {
  switch (kind) {
    case 'prescreen':
      return 'Chat Prescreens'
    case 'assessment':
      return 'Assessments'
    default: {
      const exhaustive: never = kind
      return exhaustive
    }
  }
}

export const QUESTIONS_STEP_DESCRIPTION =
  'The questions Jeeves asks candidates, in order, with the intro and closing messages.'

export function kindBannerCopy(kind: PreInterviewSetKind): {
  tag: string
  text: string
  tone: 'prescreen' | 'assessment'
} {
  switch (kind) {
    case 'prescreen':
      return {
        tag: 'Chat prescreen',
        text: "Scored questions aren't available here — create an assessment for skill checks.",
        tone: 'prescreen',
      }
    case 'assessment':
      return {
        tag: 'Assessment',
        text: 'Only scored questions (plus info and consent) can be added here. Screening questions belong in a chat prescreen.',
        tone: 'assessment',
      }
    default: {
      const exhaustive: never = kind
      return exhaustive
    }
  }
}
