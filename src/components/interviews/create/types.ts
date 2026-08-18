export const CREATE_ONE_WAY_STEPS = [
  { id: 'details', label: 'Details' },
  { id: 'template', label: 'Template' },
  { id: 'review', label: 'Review' },
] as const

export type CreateOneWayInterviewForm = {
  interviewType: string
  linkExpiration: string
  /** Selected job codes (multi) */
  jobCodes: string[]
  description: string
  /** Placeholder fields for later steps */
  templateId: string
  notes: string
}

export const defaultCreateOneWayForm: CreateOneWayInterviewForm = {
  interviewType: 'Skill Interview',
  linkExpiration: '1 Day',
  jobCodes: [],
  description: '',
  templateId: '',
  notes: '',
}

export const INTERVIEW_TYPE_OPTIONS = [
  'Competency Interview',
  'Skill Interview',
  'Telephonic Interview',
  'AI Coding Interview',
]

export const LINK_EXPIRATION_OPTIONS = [
  '1 Day',
  '3 Days',
  '7 Days',
  '14 Days',
  '30 Days',
]
