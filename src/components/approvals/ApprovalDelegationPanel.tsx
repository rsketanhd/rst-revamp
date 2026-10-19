import { useEffect, useState } from 'react'
import { Button, Input, Select, SidePanel } from '../ui'

export type ApprovalDelegationForm = {
  delegateId: string
  from: string
  to: string
}

export type ApprovalDelegationPanelProps = {
  open: boolean
  /** When editing an existing delegation */
  initial?: ApprovalDelegationForm | null
  onClose: () => void
  onSave: (form: ApprovalDelegationForm) => void
}

const DELEGATE_OPTIONS = [
  { value: 'heli-shah', label: 'Heli Shah' },
  { value: 'ashik-patel', label: 'Ashik Patel' },
  { value: 'ketan', label: 'ketan' },
  { value: 'priya-nair', label: 'Priya Nair' },
]

function todayIso(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

function emptyForm(): ApprovalDelegationForm {
  const today = todayIso()
  return { delegateId: '', from: today, to: today }
}

/**
 * Side panel to nominate someone to approve jobs and offers on your behalf.
 */
export function ApprovalDelegationPanel({
  open,
  initial = null,
  onClose,
  onSave,
}: ApprovalDelegationPanelProps) {
  const [form, setForm] = useState<ApprovalDelegationForm>(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return
    setForm(initial ?? emptyForm())
    setErrors({})
  }, [open, initial])

  function updateField<K extends keyof ApprovalDelegationForm>(
    key: K,
    value: ApprovalDelegationForm[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!form.delegateId) next.delegateId = 'Choose a delegate'
    if (!form.from) next.from = 'From date is required'
    if (!form.to) next.to = 'To date is required'
    if (form.from && form.to && form.to < form.from) {
      next.to = 'To date must be on or after From'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSave() {
    if (!validate()) return
    onSave(form)
    onClose()
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Approval delegation"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <p className="text-sm leading-relaxed text-[#6B6B80]">
          Your delegate sees the job and offer approvals meant for you in
          “Waiting for me” and decides on your behalf. The history shows both
          names.
        </p>

        <Select
          id="approval-delegate"
          label="Delegate"
          placeholder="Choose someone"
          options={DELEGATE_OPTIONS}
          value={form.delegateId}
          error={errors.delegateId}
          onChange={(event) => updateField('delegateId', event.target.value)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="approval-delegate-from"
            label="From"
            type="date"
            value={form.from}
            error={errors.from}
            onChange={(event) => updateField('from', event.target.value)}
          />
          <Input
            id="approval-delegate-to"
            label="To"
            type="date"
            value={form.to}
            error={errors.to}
            onChange={(event) => updateField('to', event.target.value)}
          />
        </div>
      </div>
    </SidePanel>
  )
}

export function getDelegateLabel(delegateId: string): string {
  return (
    DELEGATE_OPTIONS.find((option) => option.value === delegateId)?.label ??
    delegateId
  )
}

export function formatDelegationDisplayDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  if (!year || !month || !day) return iso
  return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`
}
