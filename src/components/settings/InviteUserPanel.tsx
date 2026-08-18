import { useEffect, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import {
  PLATFORM_USER_ROLE_OPTIONS,
  PLATFORM_USER_TYPE_OPTIONS,
} from '../../data/users'
import { Button, Input, Select, SidePanel, toast } from '../ui'

export type InviteUserPanelProps = {
  open: boolean
  onClose: () => void
  onInviteSent?: (payload: InviteUserFormValues) => void
}

export type InviteUserFormValues = {
  firstName: string
  lastName: string
  email: string
  joiningDate: string
  userType: string
  role: string
}

const EMPTY_FORM: InviteUserFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  joiningDate: '',
  userType: '',
  role: '',
}

/**
 * Invite User right drawer — form fields and "Send Invitee" CTA per design.
 */
export function InviteUserPanel({
  open,
  onClose,
  onInviteSent,
}: InviteUserPanelProps) {
  const [form, setForm] = useState<InviteUserFormValues>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof InviteUserFormValues, string>>>(
    {},
  )

  useEffect(() => {
    if (!open) return
    setForm(EMPTY_FORM)
    setErrors({})
  }, [open])

  function updateField<K extends keyof InviteUserFormValues>(
    key: K,
    value: InviteUserFormValues[K],
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
    const next: Partial<Record<keyof InviteUserFormValues, string>> = {}
    if (!form.firstName.trim()) next.firstName = 'First name is required'
    if (!form.lastName.trim()) next.lastName = 'Last name is required'
    if (!form.email.trim()) {
      next.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address'
    }
    if (!form.role) next.role = 'Role is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    onInviteSent?.(form)
    toast.success('Invitation sent successfully.', {
      title: 'Success',
      description: `${form.firstName} ${form.lastName} has been invited.`,
    })
    onClose()
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Invite User"
      widthClassName="w-full max-w-[26rem]"
      footerClassName="justify-stretch border-t-0 pt-2"
      footer={
        <Button
          type="button"
          fullWidth
          onClick={handleSubmit}
          className="!h-11 !rounded-md bg-[#2D2061] text-sm font-semibold text-white hover:bg-[#241a52]"
        >
          Send Invitee
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        <Input
          id="invite-first-name"
          label="First Name"
          requiredMark
          placeholder="Enter First Name"
          value={form.firstName}
          error={errors.firstName}
          onChange={(e) => updateField('firstName', e.target.value)}
        />
        <Input
          id="invite-last-name"
          label="Last Name"
          requiredMark
          placeholder="Enter Last Name"
          value={form.lastName}
          error={errors.lastName}
          onChange={(e) => updateField('lastName', e.target.value)}
        />
        <Input
          id="invite-email"
          label="Email Address"
          requiredMark
          type="email"
          placeholder="Enter Email Address"
          value={form.email}
          error={errors.email}
          onChange={(e) => updateField('email', e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="invite-joining-date"
            className="text-sm font-medium text-ink"
          >
            Joining Date
          </label>
          <div className="relative">
            <input
              id="invite-joining-date"
              type={form.joiningDate ? 'date' : 'text'}
              value={form.joiningDate}
              placeholder="Select"
              onFocus={(e) => {
                e.currentTarget.type = 'date'
              }}
              onBlur={(e) => {
                if (!e.currentTarget.value) e.currentTarget.type = 'text'
              }}
              onChange={(e) => updateField('joiningDate', e.target.value)}
              className="h-11 w-full rounded-md border border-[#ddd9e8] bg-white px-3.5 pr-10 text-sm text-[#2D2061] outline-none transition-colors placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
            />
            <CalendarDays
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
              aria-hidden="true"
            />
          </div>
        </div>

        <Select
          id="invite-user-type"
          label="User Type"
          options={PLATFORM_USER_TYPE_OPTIONS}
          value={form.userType}
          placeholder="Select"
          onChange={(e) => updateField('userType', e.target.value)}
        />

        <Select
          id="invite-role"
          label="Role"
          requiredMark
          options={PLATFORM_USER_ROLE_OPTIONS}
          value={form.role}
          placeholder="Select Role"
          error={errors.role}
          onChange={(e) => updateField('role', e.target.value)}
        />
      </div>
    </SidePanel>
  )
}
