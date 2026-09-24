import { useEffect, useState } from 'react'
import { Button, Checkbox, Input, Select, SidePanel } from '../ui'
import {
  EMPLOYMENT_COMPANY_OPTIONS,
  EMPLOYMENT_DATE_OPTIONS,
  EMPLOYMENT_TITLE_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  type ProfileEmployment,
} from '../../data/candidateProfile'

export type PersonalInfo = {
  fullName: string
  email: string
  location: string
  preferredLocation: string
  workAuthorisation: string
  rightToWorkStatus: string
}

export type EducationDraft = {
  school: string
  degree: string
  dates: string
}

export type EmploymentDraft = {
  title: string
  employmentType: string
  company: string
  startDate: string
  endDate: string
  current: boolean
}

const EMPTY_EMPLOYMENT: EmploymentDraft = {
  title: '',
  employmentType: '',
  company: '',
  startDate: '',
  endDate: '',
  current: false,
}

type FieldErrors = Partial<Record<string, string>>

function withCurrent(options: string[], value: string): string[] {
  if (!value || options.includes(value)) return options
  return [value, ...options]
}

function panelFooter(onCancel: () => void, submitLabel: string, onSubmit: () => void) {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="md"
        onClick={onCancel}
        className="!h-10 !min-w-[5.5rem] !rounded-md border-[#2D2061] bg-white px-4 text-sm font-medium text-[#2D2061] hover:bg-[#f7f6fb]"
      >
        Cancel
      </Button>
      <Button
        type="button"
        variant="primary"
        size="md"
        onClick={onSubmit}
        className="!h-10 !min-w-[6.5rem] !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
      >
        {submitLabel}
      </Button>
    </>
  )
}

export function PersonalInfoPanel({
  open,
  value,
  onClose,
  onSave,
}: {
  open: boolean
  value: PersonalInfo
  onClose: () => void
  onSave: (next: PersonalInfo) => void
}) {
  const [draft, setDraft] = useState(value)
  const [errors, setErrors] = useState<FieldErrors>({})

  const personalKey = [
    value.fullName,
    value.email,
    value.location,
    value.preferredLocation,
    value.workAuthorisation,
    value.rightToWorkStatus,
  ].join('|')

  useEffect(() => {
    if (!open) return
    setDraft(value)
    setErrors({})
  }, [open, personalKey, value])

  function save() {
    const nextErrors: FieldErrors = {}
    if (!draft.fullName.trim()) nextErrors.fullName = 'Full name is required.'
    if (!draft.email.trim()) nextErrors.email = 'Email is required.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSave({
      fullName: draft.fullName.trim(),
      email: draft.email.trim(),
      location: draft.location.trim(),
      preferredLocation: draft.preferredLocation.trim(),
      workAuthorisation: draft.workAuthorisation.trim(),
      rightToWorkStatus: draft.rightToWorkStatus.trim(),
    })
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Edit Personal Information"
      widthClassName="w-full max-w-[28rem]"
      footer={panelFooter(onClose, 'Save', save)}
    >
      <div className="flex flex-col gap-4">
        <Input
          id="profile-full-name"
          label="Full Name"
          requiredMark
          value={draft.fullName}
          error={errors.fullName}
          onChange={(event) =>
            setDraft((current) => ({ ...current, fullName: event.target.value }))
          }
        />
        <Input
          id="profile-email"
          label="Email"
          requiredMark
          value={draft.email}
          error={errors.email}
          onChange={(event) =>
            setDraft((current) => ({ ...current, email: event.target.value }))
          }
        />
        <Input
          id="profile-location"
          label="Location"
          value={draft.location}
          onChange={(event) =>
            setDraft((current) => ({ ...current, location: event.target.value }))
          }
        />
        <Input
          id="profile-preferred-location"
          label="Preferred Location"
          value={draft.preferredLocation}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              preferredLocation: event.target.value,
            }))
          }
        />
        <Input
          id="profile-work-authorisation"
          label="Work Authorisation"
          value={draft.workAuthorisation}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              workAuthorisation: event.target.value,
            }))
          }
        />
        <Input
          id="profile-right-to-work"
          label="Right to Work Status"
          value={draft.rightToWorkStatus}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              rightToWorkStatus: event.target.value,
            }))
          }
        />
      </div>
    </SidePanel>
  )
}

export function EmploymentFormPanel({
  open,
  mode,
  value,
  onClose,
  onSubmit,
}: {
  open: boolean
  mode: 'create' | 'edit'
  value: EmploymentDraft
  onClose: () => void
  onSubmit: (next: EmploymentDraft) => void
}) {
  const [draft, setDraft] = useState(value)
  const [errors, setErrors] = useState<FieldErrors>({})

  const employmentKey = [
    value.title,
    value.employmentType,
    value.company,
    value.startDate,
    value.endDate,
    String(value.current),
  ].join('|')

  useEffect(() => {
    if (!open) return
    setDraft(value)
    setErrors({})
  }, [open, employmentKey, value])

  function submit() {
    const nextErrors: FieldErrors = {}
    if (!draft.title) nextErrors.title = 'Title is required.'
    if (!draft.company) nextErrors.company = 'Company is required.'
    if (!draft.startDate) nextErrors.startDate = 'Start date is required.'
    if (!draft.current && !draft.endDate) nextErrors.endDate = 'End date is required.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit({
      ...draft,
      endDate: draft.current ? '' : draft.endDate,
    })
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Add Employment' : 'Edit Employment'}
      widthClassName="w-full max-w-[28rem]"
      footer={panelFooter(onClose, mode === 'create' ? 'Create New' : 'Save', submit)}
    >
      <div className="flex flex-col gap-4">
        <Select
          id="employment-title"
          label="Title"
          requiredMark
          placeholder="Select any"
          options={withCurrent(EMPLOYMENT_TITLE_OPTIONS, draft.title)}
          value={draft.title}
          error={errors.title}
          onChange={(event) =>
            setDraft((current) => ({ ...current, title: event.target.value }))
          }
        />
        <Select
          id="employment-type"
          label="Employment Type"
          placeholder="Select any"
          options={withCurrent(EMPLOYMENT_TYPE_OPTIONS, draft.employmentType)}
          value={draft.employmentType}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              employmentType: event.target.value,
            }))
          }
        />
        <Select
          id="employment-company"
          label="Company/Organization"
          requiredMark
          placeholder="Select any"
          options={withCurrent(EMPLOYMENT_COMPANY_OPTIONS, draft.company)}
          value={draft.company}
          error={errors.company}
          onChange={(event) =>
            setDraft((current) => ({ ...current, company: event.target.value }))
          }
        />
        <Select
          id="employment-start"
          label="Start Date"
          requiredMark
          placeholder="Select any"
          options={withCurrent(EMPLOYMENT_DATE_OPTIONS, draft.startDate)}
          value={draft.startDate}
          error={errors.startDate}
          onChange={(event) =>
            setDraft((current) => ({ ...current, startDate: event.target.value }))
          }
        />
        <Select
          id="employment-end"
          label="End Date"
          requiredMark={!draft.current}
          placeholder="Select any"
          options={withCurrent(EMPLOYMENT_DATE_OPTIONS, draft.endDate)}
          value={draft.current ? '' : draft.endDate}
          error={errors.endDate}
          disabled={draft.current}
          onChange={(event) =>
            setDraft((current) => ({ ...current, endDate: event.target.value }))
          }
        />
        <Checkbox
          id="employment-current"
          label="I am currently working in this role"
          checked={draft.current}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              current: event.target.checked,
              endDate: event.target.checked ? '' : current.endDate,
            }))
          }
        />
      </div>
    </SidePanel>
  )
}

export function EducationFormPanel({
  open,
  mode,
  value,
  onClose,
  onSubmit,
}: {
  open: boolean
  mode: 'create' | 'edit'
  value: EducationDraft
  onClose: () => void
  onSubmit: (next: EducationDraft) => void
}) {
  const [draft, setDraft] = useState(value)
  const [errors, setErrors] = useState<FieldErrors>({})

  const educationKey = [value.school, value.degree, value.dates].join('|')

  useEffect(() => {
    if (!open) return
    setDraft(value)
    setErrors({})
  }, [open, educationKey, value])

  function submit() {
    const nextErrors: FieldErrors = {}
    if (!draft.school.trim()) nextErrors.school = 'School is required.'
    if (!draft.degree.trim()) nextErrors.degree = 'Degree is required.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit({
      school: draft.school.trim(),
      degree: draft.degree.trim(),
      dates: draft.dates.trim(),
    })
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Add Education' : 'Edit Education'}
      widthClassName="w-full max-w-[28rem]"
      footer={panelFooter(onClose, mode === 'create' ? 'Create New' : 'Save', submit)}
    >
      <div className="flex flex-col gap-4">
        <Input
          id="education-school"
          label="School"
          requiredMark
          value={draft.school}
          error={errors.school}
          onChange={(event) =>
            setDraft((current) => ({ ...current, school: event.target.value }))
          }
        />
        <Input
          id="education-degree"
          label="Degree"
          requiredMark
          value={draft.degree}
          error={errors.degree}
          onChange={(event) =>
            setDraft((current) => ({ ...current, degree: event.target.value }))
          }
        />
        <Input
          id="education-dates"
          label="Years"
          value={draft.dates}
          onChange={(event) =>
            setDraft((current) => ({ ...current, dates: event.target.value }))
          }
        />
      </div>
    </SidePanel>
  )
}

export function employmentToDraft(job: ProfileEmployment): EmploymentDraft {
  return {
    title: job.title,
    employmentType: job.employmentType,
    company: job.company,
    startDate: job.startDate,
    endDate: job.endDate,
    current: job.current,
  }
}

export { EMPTY_EMPLOYMENT }
