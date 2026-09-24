export const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'] as const
export type InterviewDifficulty = (typeof DIFFICULTY_OPTIONS)[number]

export const CREATE_ONE_WAY_STEPS = [
  { id: 'details', label: 'Details' },
  { id: 'template', label: 'Rounds & Templates' },
  { id: 'review', label: 'Review' },
] as const

/** One interview round: a default template plus an ordered resend list. */
export type InterviewRound = {
  id: string
  name: string
  interviewType: string
  /** Level AI uses when generating template questions ('' when unset) */
  difficulty: InterviewDifficulty | ''
  /** AI avatar hosts this round */
  avatarEnabled: boolean
  /** Sent with every first invite ('' when none yet) */
  defaultTemplateId: string
  /** Used, in order, when a candidate is invited to this round again */
  resendTemplateIds: string[]
}

/** New, empty round "Round N" — templates are added from the Template field. */
export function createRound(
  number: number,
  id = `round-${Date.now()}`,
): InterviewRound {
  return {
    id,
    name: `Round ${number}`,
    interviewType: '',
    difficulty: '',
    avatarEnabled: true,
    defaultTemplateId: '',
    resendTemplateIds: [],
  }
}

export type CreateOneWayInterviewForm = {
  linkExpiration: string
  /** Selected job code (single) */
  jobCode: string
  description: string
  rounds: InterviewRound[]
  notes: string
}

export const defaultCreateOneWayForm: CreateOneWayInterviewForm = {
  linkExpiration: '2 Days',
  jobCode: '',
  description: '',
  rounds: [createRound(1, 'round-1')],
  notes: '',
}

export const INTERVIEW_TYPE_OPTIONS = [
  'Technical Interview',
  'Competency Interview',
  'Skill Interview',
  'Telephonic Interview',
  'AI Coding Interview',
]

/** Link validity in days: 1 to 60, applies to every round. */
export const LINK_VALID_DAYS_OPTIONS = Array.from({ length: 60 }, (_, i) =>
  i === 0 ? '1 Day' : `${i + 1} Days`,
)

export function isTelephonicInterview(interviewType?: string) {
  return (interviewType ?? '').toLowerCase().includes('telephonic')
}
