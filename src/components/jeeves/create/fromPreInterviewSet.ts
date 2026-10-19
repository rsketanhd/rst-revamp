import {
  getSetQuestions,
  type PreInterviewSet,
  type PreInterviewViewQuestion,
  type PreInterviewViewQuestionType,
} from '../../../data/jeevesPreInterviewSets'
import {
  DEFAULT_ASSESSMENT_POINTS,
  type CreatePreInterviewSetForm,
  type PreInterviewQuestion,
  type PreInterviewQuestionType,
} from './types'

/**
 * Maps a saved Pre-Interview Set into create/edit wizard form state.
 */
export function preInterviewSetToWizardForm(
  set: PreInterviewSet,
): CreatePreInterviewSetForm {
  const content = getSetQuestions(set.id)
  const isAssessment = set.kind === 'assessment'

  return {
    name: set.name,
    kind: set.kind,
    isDefault: set.isDefault,
    intro: content?.intro ?? '',
    closing: content?.closing ?? '',
    questions: (content?.questions ?? []).map(viewQuestionToFormQuestion),
    requirePassMark: isAssessment && set.passMarkPercent != null,
    passMarkPercent: set.passMarkPercent ?? 60,
    belowPassAction: 'flag',
  }
}

function viewQuestionToFormQuestion(
  question: PreInterviewViewQuestion,
): PreInterviewQuestion {
  return {
    id: question.id,
    text: question.text,
    type: toFormQuestionType(question.type),
    knockout: 'none',
    mandatory: false,
    enabled: question.enabled,
    points: DEFAULT_ASSESSMENT_POINTS,
    assessmentKind: 'knowledge',
  }
}

function toFormQuestionType(
  type: PreInterviewViewQuestionType,
): PreInterviewQuestionType {
  switch (type) {
    case 'yes-no':
    case 'multi-choice':
    case 'single-choice':
    case 'country':
    case 'city':
    case 'text':
    case 'number':
      return type
    default: {
      const exhaustive: never = type
      return exhaustive
    }
  }
}
