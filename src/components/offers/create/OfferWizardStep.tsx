import {
  CREATE_OFFER_STEPS,
  type CreateOfferStepId,
  type CreateOfferStepProps,
} from './types'
import { StepOfferDetails } from './StepOfferDetails'
import { StepCompensation } from './StepCompensation'
import { StepOfferLetter } from './StepOfferLetter'
import { StepOfferReview } from './StepOfferReview'

type OfferWizardStepProps = CreateOfferStepProps & {
  stepId: CreateOfferStepId
  onEdit: (index: number) => void
}

function stepIndex(id: CreateOfferStepId): number {
  return CREATE_OFFER_STEPS.findIndex((step) => step.id === id)
}

/**
 * Renders the active Create Offer wizard step.
 */
export function OfferWizardStep({
  stepId,
  value,
  onChange,
  onEdit,
}: OfferWizardStepProps) {
  switch (stepId) {
    case 'details':
      return <StepOfferDetails value={value} onChange={onChange} />
    case 'compensation':
      return <StepCompensation value={value} onChange={onChange} />
    case 'letter':
      return <StepOfferLetter value={value} onChange={onChange} />
    case 'review':
      return (
        <StepOfferReview
          value={value}
          onEditDetails={() => onEdit(stepIndex('details'))}
          onEditCompensation={() => onEdit(stepIndex('compensation'))}
          onEditLetter={() => onEdit(stepIndex('letter'))}
        />
      )
    default: {
      const _exhaustive: never = stepId
      return _exhaustive
    }
  }
}
