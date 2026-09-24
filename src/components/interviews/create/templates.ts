import type { TemplateQuestion } from './CreateTemplatePanel'

export type InterviewTemplateOption = {
  id: string
  name: string
  language: string
  type: string
  /** Display string e.g. "07 Dec 2024" */
  updatedOn: string
  isDefault: boolean
  isResend: boolean
  questions: TemplateQuestion[]
  /** Telephonic screening section enabled when created */
  screeningEnabled?: boolean
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
]

export function formatTemplateDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  return `${day} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

/** Parses "mm:ss" or whole minutes into seconds; anything else counts as 0. */
function toSeconds(raw: string): number {
  const value = raw.trim()
  if (/^\d{1,2}:\d{2}$/.test(value)) {
    const [m, s] = value.split(':').map(Number)
    return m * 60 + s
  }
  if (/^\d+$/.test(value)) return Number(value) * 60
  return 0
}

/** Total prep + answer time across questions, in minutes (may be fractional). */
export function questionsDurationMins(questions: TemplateQuestion[]): number {
  const seconds = questions.reduce(
    (sum, q) => sum + toSeconds(q.prep) + toSeconds(q.answer),
    0,
  )
  return seconds / 60
}

export function templateDurationMins(template: InterviewTemplateOption): number {
  return questionsDurationMins(template.questions)
}

/** "English, 2 questions, 8 mins. Updated 23 Sept 2026" */
export function templateSummary(template: InterviewTemplateOption): string {
  const count = template.questions.length
  const mins = Math.round(templateDurationMins(template) * 10) / 10
  return `${template.language}, ${count} ${count === 1 ? 'question' : 'questions'}, ${mins} mins. Updated ${template.updatedOn}`
}
