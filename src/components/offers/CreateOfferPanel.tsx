import { useEffect, useState } from 'react'
import type { OfferRecord } from '../../data/offers'
import { Button, SidePanel, StatusStepper } from '../ui'
import {
  DESIGN_CREATE_OFFER_FORM,
  cloneCreateOfferForm,
  formToOfferRecord,
  offerRecordToForm,
} from './create/offerForm'
import { OfferWizardStep } from './create/OfferWizardStep'
import {
  CREATE_OFFER_STEPS,
  type CreateOfferForm,
} from './create/types'

export type CreateOfferPanelProps = {
  open: boolean
  offer?: OfferRecord | null
  onClose: () => void
  onSave: (offer: OfferRecord) => void
}

const LAST_STEP = CREATE_OFFER_STEPS.length - 1

const SECONDARY_FOOTER_CLASS =
  '!h-10 !rounded-md border-[#d5d2e2] bg-white px-4 text-sm font-medium text-[#2D2061] hover:bg-[#f7f6fb]'
const PRIMARY_FOOTER_CLASS =
  '!h-10 !min-w-[6.5rem] !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]'

function primaryFooterLabel(isLastStep: boolean, isEdit: boolean): string {
  if (!isLastStep) return 'Next'
  return isEdit ? 'Save Offer' : 'Create Offer'
}

/**
 * Create / edit offer drawer — Candidate & Job → Compensation → Offer Letter → Review & Send.
 */
export function CreateOfferPanel({
  open,
  offer = null,
  onClose,
  onSave,
}: CreateOfferPanelProps) {
  const isEdit = Boolean(offer)
  const [step, setStep] = useState(0)
  const [maxReached, setMaxReached] = useState(0)
  const [form, setForm] = useState<CreateOfferForm>(DESIGN_CREATE_OFFER_FORM)

  useEffect(() => {
    if (!open) return
    setForm(
      cloneCreateOfferForm(offer ? offerRecordToForm(offer) : DESIGN_CREATE_OFFER_FORM),
    )
    setStep(0)
    setMaxReached(0)
  }, [open, offer?.id])

  function patchForm(patch: Partial<CreateOfferForm>) {
    setForm((current) => ({ ...current, ...patch }))
  }

  function goTo(next: number) {
    setStep(next)
    setMaxReached((max) => Math.max(max, next))
  }

  function handlePrevious() {
    setStep((current) => Math.max(0, current - 1))
  }

  function handleContinue() {
    if (step >= LAST_STEP) {
      onSave(formToOfferRecord(form, offer))
      onClose()
      return
    }
    goTo(step + 1)
  }

  const isFirstStep = step === 0
  const isLastStep = step >= LAST_STEP

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Offer' : 'Create Offer'}
      widthClassName="w-full max-w-[44rem]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={isFirstStep ? onClose : handlePrevious}
            className={`${SECONDARY_FOOTER_CLASS} ${isFirstStep ? '!min-w-[5.5rem]' : '!min-w-[6.5rem]'}`}
          >
            {isFirstStep ? 'Cancel' : 'Previous'}
          </Button>
          <Button
            type="button"
            onClick={handleContinue}
            className={PRIMARY_FOOTER_CLASS}
          >
            {primaryFooterLabel(isLastStep, isEdit)}
          </Button>
        </>
      }
    >
      <StatusStepper
        className="mb-6"
        steps={CREATE_OFFER_STEPS}
        currentStep={step}
        completedThrough={maxReached}
        onStepClick={(index) => {
          if (index <= maxReached) goTo(index)
        }}
      />
      <OfferWizardStep
        stepId={CREATE_OFFER_STEPS[step].id}
        value={form}
        onChange={patchForm}
        onEdit={goTo}
      />
    </SidePanel>
  )
}
