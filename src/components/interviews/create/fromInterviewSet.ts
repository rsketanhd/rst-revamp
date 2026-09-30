import {
  getInterviewSetRounds,
  type InterviewSetTemplate,
  type OneWayInterview,
} from '../../../data/oneWayInterviews'
import type { InterviewTemplateOption } from './templates'
import {
  defaultCreateOneWayForm,
  type CreateOneWayInterviewForm,
  type InterviewRound,
} from './types'

const minutes = (mins: number) => `${String(mins).padStart(2, '0')}:00`

/** Interview-set round labels → the wizard's Interview Type options. */
const INTERVIEW_TYPE_BY_LABEL: Record<string, string> = {
  'Skill-based': 'Skill Interview',
  Technical: 'Technical Interview',
  'Competency-based': 'Competency Interview',
  'Culture fit': 'Culture Fit Interview',
}

/** "1 day" / "3 days" → the wizard's "1 Day" / "3 Days" option labels. */
function toLinkValidOption(value: string): string {
  const days = Number(value.match(/\d+/)?.[0] ?? 0)
  if (!days) return defaultCreateOneWayForm.linkExpiration
  return days === 1 ? '1 Day' : `${days} Days`
}

function toTemplateOption(
  template: InterviewSetTemplate,
  updatedOn: string,
  isDefault: boolean,
): InterviewTemplateOption {
  return {
    id: template.id,
    name: template.name,
    language: template.language,
    type: isDefault ? 'Default' : 'Resend',
    updatedOn,
    isDefault,
    isResend: !isDefault,
    questions: template.questions.map((q) => ({
      id: q.id,
      text: q.text,
      prep: minutes(q.prepMins),
      answer: minutes(q.answerMins),
    })),
  }
}

/**
 * Loads an existing interview set into the Create Interview wizard's state
 * (Edit Interview Set).
 */
export function interviewSetToWizardState(interview: OneWayInterview): {
  form: CreateOneWayInterviewForm
  templates: InterviewTemplateOption[]
} {
  const setRounds = getInterviewSetRounds(interview.id)
  const templates: InterviewTemplateOption[] = []

  const rounds: InterviewRound[] = setRounds.map((round) => {
    templates.push(toTemplateOption(round.defaultTemplate, interview.updatedOn, true))
    for (const resend of round.resendTemplates) {
      templates.push(toTemplateOption(resend, interview.updatedOn, false))
    }
    return {
      id: round.id,
      name: round.name,
      interviewType:
        INTERVIEW_TYPE_BY_LABEL[round.interviewType] ?? round.interviewType,
      difficulty: round.difficulty,
      avatarEnabled: round.avatarEnabled,
      defaultTemplateId: round.defaultTemplate.id,
      resendTemplateIds: round.resendTemplates.map((t) => t.id),
    }
  })

  return {
    form: {
      ...defaultCreateOneWayForm,
      jobCode: interview.jobReqId,
      linkExpiration: toLinkValidOption(interview.linkExpiration),
      rounds,
    },
    templates,
  }
}
