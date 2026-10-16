import { JOBS } from '../../../data/jobs'
import {
  getTwoWayInterviewSetRounds,
  type TwoWayInterviewSet,
} from '../../../data/twoWayInterviewSets'
import type { PanelRound } from './CreateRoundPanel'

/**
 * Loads an existing two-way interview set into the Configure Panel wizard.
 */
function jobCodeForSet(set: TwoWayInterviewSet): string {
  const job =
    JOBS.find((j) => j.title === set.jobTitle && j.status === 'active') ??
    JOBS.find((j) => j.title === set.jobTitle)
  return job?.code ?? set.jobReqId
}

export function twoWayInterviewSetToWizardState(set: TwoWayInterviewSet): {
  jobCode: string
  organiser: string
  rounds: PanelRound[]
} {
  const rounds = getTwoWayInterviewSetRounds(set.id).map(
    ({ ready: _ready, ...round }) => round,
  )

  return {
    jobCode: jobCodeForSet(set),
    organiser: set.organiser,
    rounds,
  }
}
