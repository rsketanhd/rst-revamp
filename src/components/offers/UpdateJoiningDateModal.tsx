import { useEffect, useId, useState, type FormEvent } from 'react'
import { CalendarDays } from 'lucide-react'
import { Button, Modal } from '../ui'
import type { OfferRecord } from '../../data/offers'

export type UpdateJoiningDateModalProps = {
  open: boolean
  offer: OfferRecord | null
  onClose: () => void
  onSave: (offer: OfferRecord, joiningDateIso: string) => void
}

/**
 * Modal to update the joining date on an existing offer.
 */
export function UpdateJoiningDateModal({
  open,
  offer,
  onClose,
  onSave,
}: UpdateJoiningDateModalProps) {
  const fieldId = useId()
  const errorId = `${fieldId}-error`
  const [joiningDate, setJoiningDate] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open || !offer) return
    setJoiningDate(offer.joiningDateIso)
    setError('')
  }, [open, offer])

  function handleClose() {
    setError('')
    onClose()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!offer) return
    if (!joiningDate) {
      setError('Select a joining date.')
      return
    }
    onSave(offer, joiningDate)
  }

  const candidateName = offer?.candidateName ?? ''

  return (
    <Modal
      open={open && Boolean(offer)}
      onClose={handleClose}
      title={candidateName}
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit}>
        <p className="text-sm leading-relaxed text-[#4A4A5A]">
          Modify the agreed onboarding / start date for{' '}
          <span className="font-bold text-[#2D2061]">{candidateName}</span>.
          This will notify HR and update internal records.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <label
            htmlFor={fieldId}
            className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8B8B9E]"
          >
            New Proposed Joining Date
            <span className="ml-0.5 text-[#E53935]" aria-hidden="true">
              *
            </span>
          </label>
          <div className="relative">
            <input
              id={fieldId}
              type="date"
              required
              value={joiningDate}
              onChange={(event) => {
                setJoiningDate(event.target.value)
                setError('')
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              className="h-12 w-full rounded-lg border border-[#E4E1EE] bg-white px-3.5 pr-11 text-sm text-[#2D2061] outline-none transition-colors focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
            />
            <CalendarDays
              className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
              aria-hidden="true"
            />
          </div>
          {error ? (
            <p id={errorId} className="text-xs text-accent-500">
              {error}
            </p>
          ) : null}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="!h-10 !rounded-md !border-[#2D2061] !px-5 !text-[#2D2061] hover:!bg-[#F7F6FA]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="!h-10 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            Save New Date
          </Button>
        </div>
      </form>
    </Modal>
  )
}
