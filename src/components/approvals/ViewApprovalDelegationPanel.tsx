import { useEffect, useState } from 'react'
import { Button, Input, Select, SidePanel } from '../ui'
import {
  getDelegateLabel,
  type ApprovalDelegationForm,
} from './ApprovalDelegationPanel'

const DELEGATE_OPTIONS = [
  { value: 'heli-shah', label: 'Heli Shah' },
  { value: 'ashik-patel', label: 'Ashik Patel' },
  { value: 'ketan', label: 'ketan' },
  { value: 'priya-nair', label: 'Priya Nair' },
]

export type ViewApprovalDelegationPanelProps = {
  open: boolean
  delegation: ApprovalDelegationForm
  onClose: () => void
  onSave: (form: ApprovalDelegationForm) => void
  onEndDelegation: () => void
}

/**
 * View active delegation; Change delegate switches fields into edit mode.
 */
export function ViewApprovalDelegationPanel({
  open,
  delegation,
  onClose,
  onSave,
  onEndDelegation,
}: ViewApprovalDelegationPanelProps) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<ApprovalDelegationForm>(delegation)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return
    setEditing(false)
    setForm(delegation)
    setErrors({})
  }, [open, delegation])

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
    setEditing(false)
  }

  function handleCancelEdit() {
    setForm(delegation)
    setErrors({})
    setEditing(false)
  }

  function handleClose() {
    setEditing(false)
    setForm(delegation)
    setErrors({})
    onClose()
  }

  return (
    <SidePanel
      open={open}
      onClose={handleClose}
      title={editing ? 'Change delegate' : 'View delegate'}
      footer={
        editing ? (
          <>
            <Button type="button" variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              className="!border-[#F5C2C2] !text-[#C44B4B] hover:!bg-[#FFF5F5]"
              onClick={onEndDelegation}
            >
              End delegation
            </Button>
            <Button type="button" onClick={() => setEditing(true)}>
              Change delegate
            </Button>
          </>
        )
      }
    >
      <div className="flex flex-col gap-5">
        <p className="text-sm leading-relaxed text-[#6B6B80]">
          Your delegate sees the job and offer approvals meant for you in
          “Waiting for me” and decides on your behalf. The history shows both
          names.
        </p>

        {editing ? (
          <>
            <Select
              id="view-approval-delegate"
              label="Delegate"
              placeholder="Choose someone"
              options={DELEGATE_OPTIONS}
              value={form.delegateId}
              error={errors.delegateId}
              onChange={(event) =>
                updateField('delegateId', event.target.value)
              }
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                id="view-approval-delegate-from"
                label="From"
                type="date"
                value={form.from}
                error={errors.from}
                onChange={(event) => updateField('from', event.target.value)}
              />
              <Input
                id="view-approval-delegate-to"
                label="To"
                type="date"
                value={form.to}
                error={errors.to}
                onChange={(event) => updateField('to', event.target.value)}
              />
            </div>
          </>
        ) : (
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-[#8B8B9E]">Delegate</dt>
              <dd className="mt-1 text-sm font-semibold text-[#2D2061]">
                {getDelegateLabel(delegation.delegateId)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-[#8B8B9E]">From</dt>
              <dd className="mt-1 text-sm font-semibold text-[#2D2061]">
                {delegation.from}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-[#8B8B9E]">To</dt>
              <dd className="mt-1 text-sm font-semibold text-[#2D2061]">
                {delegation.to}
              </dd>
            </div>
          </dl>
        )}
      </div>
    </SidePanel>
  )
}
