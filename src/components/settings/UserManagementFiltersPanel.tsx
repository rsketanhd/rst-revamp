import { useEffect, useState } from 'react'
import {
  emptyUserManagementFilters,
  PLATFORM_USER_ROLE_OPTIONS,
  PLATFORM_USER_STATUS_META,
  PLATFORM_USER_STATUS_OPTIONS,
  PLATFORM_USER_TYPE_OPTIONS,
  type UserManagementFilters,
} from '../../data/users'
import { Button, Select, SidePanel } from '../ui'

export type UserManagementFiltersPanelProps = {
  open: boolean
  onClose: () => void
  value?: UserManagementFilters
  onApply?: (values: UserManagementFilters) => void
}

/**
 * User Management "Filter" side panel — Role, Status, User Type.
 */
export function UserManagementFiltersPanel({
  open,
  onClose,
  value,
  onApply,
}: UserManagementFiltersPanelProps) {
  const [draft, setDraft] = useState<UserManagementFilters>(
    value ?? emptyUserManagementFilters,
  )

  useEffect(() => {
    if (!open) return
    setDraft(value ?? emptyUserManagementFilters)
  }, [open, value])

  function updateField<K extends keyof UserManagementFilters>(
    key: K,
    next: UserManagementFilters[K],
  ) {
    setDraft((current) => ({ ...current, [key]: next }))
  }

  function handleCancel() {
    setDraft(value ?? emptyUserManagementFilters)
    onClose()
  }

  function handleClearFilters() {
    setDraft(emptyUserManagementFilters)
  }

  function handleApply() {
    onApply?.(draft)
    onClose()
  }

  const hasDraftFilters =
    Boolean(draft.role) || Boolean(draft.status) || Boolean(draft.userType)

  const statusOptions = PLATFORM_USER_STATUS_OPTIONS.map((id) => ({
    value: id,
    label: PLATFORM_USER_STATUS_META[id].label,
  }))

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Filter By"
      widthClassName="w-full max-w-[28rem]"
      footerClassName="justify-between"
      footer={
        <>
          <button
            type="button"
            onClick={handleClearFilters}
            disabled={!hasDraftFilters}
            className="inline-flex h-10 min-w-[5.5rem] items-center justify-center rounded-md px-3 text-sm font-medium text-[#2D2061] transition-colors hover:bg-[#f7f6fb] disabled:cursor-not-allowed disabled:text-[#A0A0B2] disabled:hover:bg-transparent"
          >
            Clear filters
          </button>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleCancel}
              className="!h-10 !min-w-[5.5rem] !rounded-md border-[#d5d2e2] bg-white px-4 text-sm font-medium text-[#2D2061] hover:bg-[#f7f6fb]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleApply}
              className="!h-10 !min-w-[6.5rem] !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
            >
              Apply Now
            </Button>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <Select
          id="user-filter-role"
          label="Role"
          options={PLATFORM_USER_ROLE_OPTIONS}
          value={draft.role}
          placeholder="Select"
          onChange={(e) => updateField('role', e.target.value)}
        />
        <Select
          id="user-filter-status"
          label="Status"
          options={statusOptions}
          value={draft.status}
          placeholder="Select"
          onChange={(e) => updateField('status', e.target.value)}
        />
        <Select
          id="user-filter-type"
          label="User Type"
          options={PLATFORM_USER_TYPE_OPTIONS}
          value={draft.userType}
          placeholder="Select"
          onChange={(e) => updateField('userType', e.target.value)}
        />
      </div>
    </SidePanel>
  )
}
