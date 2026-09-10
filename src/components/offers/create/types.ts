export const CREATE_OFFER_STEPS = [
  { id: 'details', label: 'Candidate & Job' },
  { id: 'compensation', label: 'Compensation' },
  { id: 'letter', label: 'Offer Letter' },
  { id: 'review', label: 'Review & Send' },
] as const

export type CreateOfferStepId = (typeof CREATE_OFFER_STEPS)[number]['id']

export type OfferLetterAttachment = {
  id: string
  name: string
}

export type CreateOfferForm = {
  candidateName: string
  email: string
  job: string
  joiningDate: string
  expiryDate: string
  compensationAed: string
  payFrequency: string
  notes: string
  letterContent: string
  attachments: OfferLetterAttachment[]
}

export type CreateOfferStepProps = {
  value: CreateOfferForm
  onChange: (patch: Partial<CreateOfferForm>) => void
}

export const OFFER_LETTER_TOKENS = [
  '{{Candidate Name}}',
  '{{Job Title}}',
  '{{Company Name}}',
  '{{Start Date}}',
  '{{Base Salary}}',
  '{{Bonus}}',
  '{{Location}}',
  '{{Hiring Manager}}',
  '{{Expiry Date}}',
] as const

export const DEFAULT_OFFER_LETTER_CONTENT = `Dear {{Candidate Name}},

We are thrilled to offer you the position of {{Job Title}} at {{Company Name}}. We were deeply impressed by your expertise and believe you will be a phenomenal addition to our team.

Position Details:
• Department: Engineering
• Location: {{Location}}
• Start Date: {{Start Date}}
• Base Salary: AED {{Base Salary}} per month
• Performance Bonus: AED {{Bonus}} annual target`

export const DEFAULT_OFFER_ATTACHMENTS: OfferLetterAttachment[] = [
  { id: 'doc-benefits', name: 'Benefits_Summary_2026.pdf' },
  { id: 'doc-conduct', name: 'Code_Of_Conduct_UAE.pdf' },
]

export const defaultCreateOfferForm: CreateOfferForm = {
  candidateName: '',
  email: '',
  job: '',
  joiningDate: '',
  expiryDate: '',
  compensationAed: '',
  payFrequency: 'Monthly',
  notes: '',
  letterContent: DEFAULT_OFFER_LETTER_CONTENT,
  attachments: DEFAULT_OFFER_ATTACHMENTS,
}

export const OFFER_JOB_OPTIONS = [
  'Data Platform Engineer',
  'Senior Software Engineer',
  'Product Manager',
  'UX Designer',
  'Data Analyst',
  'DevOps Engineer',
  'Marketing Lead',
]

export const PAY_FREQUENCY_OPTIONS = ['Monthly', 'Annual']
