import { useEffect, useState } from 'react'
import type {
  CompensationEntry,
  EducationEntry,
  JobInfoEntry,
  PersonalInfo,
} from '../../data/myProfile'
import {
  PROFILE_CITY_OPTIONS,
  PROFILE_COUNTRY_OPTIONS,
  PROFILE_DEGREE_OPTIONS,
  PROFILE_GENDER_OPTIONS,
  PROFILE_JOB_TYPE_OPTIONS,
  PROFILE_LOCATION_OPTIONS,
  PROFILE_MAJOR_OPTIONS,
  PROFILE_NATIONALITY_OPTIONS,
  PROFILE_SELECT_PLACEHOLDER,
  PROFILE_STATE_OPTIONS,
  PROFILE_WORK_PERMIT_OPTIONS,
} from '../../data/myProfileFormOptions'
import { Button, Checkbox, Input, PhoneInput, Select, SidePanel } from '../ui'

const PANEL_PROPS = {
  widthClassName: 'w-full max-w-[28rem]',
  headerClassName: 'border-b border-[#ECEAF3] bg-white',
  titleClassName: 'font-bold text-[#2D2061]',
  closeButtonClassName: 'text-[#6B6B80] hover:bg-[#F2F1F6] hover:text-[#2D2061]',
  bodyClassName: 'py-5',
} as const

function PanelPrimaryButton({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <Button
      type="button"
      fullWidth
      className="!h-11 !rounded-md bg-[#2D2061] text-sm font-semibold text-white hover:bg-[#241a52]"
      onClick={onClick}
    >
      {label}
    </Button>
  )
}

export type ProfileEditPersonalPanelProps = {
  open: boolean
  personalInfo: PersonalInfo
  onClose: () => void
  onSave: (info: PersonalInfo) => void
}

export function ProfileEditPersonalPanel({
  open,
  personalInfo,
  onClose,
  onSave,
}: ProfileEditPersonalPanelProps) {
  const [draft, setDraft] = useState(personalInfo)
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalInfo, string>>>({})

  useEffect(() => {
    if (!open) return
    setDraft(personalInfo)
    setErrors({})
  }, [open, personalInfo])

  function updateField<K extends keyof PersonalInfo>(key: K, value: PersonalInfo[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function handleSave() {
    const nextErrors: Partial<Record<keyof PersonalInfo, string>> = {}
    const requiredFields: Array<keyof PersonalInfo> = [
      'fullName',
      'email',
      'gender',
      'contactNumber',
      'country',
      'provinceState',
      'city',
      'nationality',
    ]

    for (const field of requiredFields) {
      if (!String(draft[field]).trim()) {
        nextErrors[field] = 'This field is required.'
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    onSave({
      ...draft,
      fullName: draft.fullName.trim(),
      email: draft.email.trim(),
      gender: draft.gender.trim(),
      countryCode: draft.countryCode.trim() || '+91',
      contactNumber: draft.contactNumber.trim(),
      country: draft.country.trim(),
      provinceState: draft.provinceState.trim(),
      city: draft.city.trim(),
      nationality: draft.nationality.trim(),
    })
    onClose()
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Edit Personal Information"
      {...PANEL_PROPS}
    >
      <div className="flex flex-col gap-5">
        <Input
          name="fullName"
          label="Full Name"
          requiredMark
          value={draft.fullName}
          error={errors.fullName}
          onChange={(event) => updateField('fullName', event.target.value)}
        />
        <Input
          name="email"
          label="Email"
          requiredMark
          type="email"
          value={draft.email}
          error={errors.email}
          onChange={(event) => updateField('email', event.target.value)}
        />
        <Select
          name="gender"
          label="Gender"
          requiredMark
          value={draft.gender}
          error={errors.gender}
          placeholder={PROFILE_SELECT_PLACEHOLDER}
          options={PROFILE_GENDER_OPTIONS}
          onChange={(event) => updateField('gender', event.target.value)}
        />
        <PhoneInput
          label="Contact Number"
          requiredMark
          value={draft.contactNumber}
          countryCode={draft.countryCode}
          error={errors.contactNumber}
          onValueChange={(value) => updateField('contactNumber', value)}
          onCountryCodeChange={(value) => updateField('countryCode', value)}
        />
        <Select
          name="country"
          label="Country"
          requiredMark
          value={draft.country}
          error={errors.country}
          placeholder={PROFILE_SELECT_PLACEHOLDER}
          options={PROFILE_COUNTRY_OPTIONS}
          onChange={(event) => updateField('country', event.target.value)}
        />
        <Select
          name="provinceState"
          label="Province/State"
          requiredMark
          value={draft.provinceState}
          error={errors.provinceState}
          placeholder={PROFILE_SELECT_PLACEHOLDER}
          options={PROFILE_STATE_OPTIONS}
          onChange={(event) => updateField('provinceState', event.target.value)}
        />
        <Select
          name="city"
          label="City"
          requiredMark
          value={draft.city}
          error={errors.city}
          placeholder={PROFILE_SELECT_PLACEHOLDER}
          options={PROFILE_CITY_OPTIONS}
          onChange={(event) => updateField('city', event.target.value)}
        />
        <Select
          name="nationality"
          label="Nationality"
          requiredMark
          value={draft.nationality}
          error={errors.nationality}
          placeholder={PROFILE_SELECT_PLACEHOLDER}
          options={PROFILE_NATIONALITY_OPTIONS}
          onChange={(event) => updateField('nationality', event.target.value)}
        />

        <PanelPrimaryButton label="Save" onClick={handleSave} />
      </div>
    </SidePanel>
  )
}

export type ProfileAddJobPanelProps = {
  open: boolean
  onClose: () => void
  onSave: (entry: Omit<JobInfoEntry, 'id'>) => void
}

export function ProfileAddJobPanel({ open, onClose, onSave }: ProfileAddJobPanelProps) {
  const [jobType, setJobType] = useState('')
  const [currentTitle, setCurrentTitle] = useState('')
  const [currentJobLocation, setCurrentJobLocation] = useState('')
  const [currentCompany, setCurrentCompany] = useState('')
  const [workPermit, setWorkPermit] = useState('')
  const [preferredJobLocation, setPreferredJobLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentlyWorking, setCurrentlyWorking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setJobType('')
    setCurrentTitle('')
    setCurrentJobLocation('')
    setCurrentCompany('')
    setWorkPermit('')
    setPreferredJobLocation('')
    setStartDate('')
    setEndDate('')
    setCurrentlyWorking(false)
    setError(null)
  }, [open])

  function handleSave() {
    if (
      !currentTitle.trim() ||
      !currentJobLocation.trim() ||
      !currentCompany.trim() ||
      !workPermit.trim() ||
      !preferredJobLocation.trim()
    ) {
      setError('Please complete all required fields.')
      return
    }

    onSave({
      jobType: jobType.trim(),
      currentTitle: currentTitle.trim(),
      currentJobLocation: currentJobLocation.trim(),
      currentCompany: currentCompany.trim(),
      workPermit: workPermit.trim(),
      preferredJobLocation: preferredJobLocation.trim(),
      startDate: startDate.trim(),
      endDate: currentlyWorking ? '' : endDate.trim(),
      currentlyWorking,
    })
    onClose()
  }

  return (
    <SidePanel open={open} onClose={onClose} title="Add New Job" {...PANEL_PROPS}>
      <div className="flex flex-col gap-5">
        <Select
          name="jobType"
          label="Job Type"
          value={jobType}
          placeholder={PROFILE_SELECT_PLACEHOLDER}
          options={PROFILE_JOB_TYPE_OPTIONS}
          onChange={(event) => setJobType(event.target.value)}
        />
        <Input
          name="currentTitle"
          label="Current Title"
          requiredMark
          placeholder="Enter Current Title"
          value={currentTitle}
          onChange={(event) => setCurrentTitle(event.target.value)}
        />
        <Select
          name="currentJobLocation"
          label="Current Job Location"
          requiredMark
          value={currentJobLocation}
          placeholder={PROFILE_SELECT_PLACEHOLDER}
          options={PROFILE_LOCATION_OPTIONS}
          onChange={(event) => setCurrentJobLocation(event.target.value)}
        />
        <Input
          name="currentCompany"
          label="Current Company"
          requiredMark
          placeholder="Enter Current Company"
          value={currentCompany}
          onChange={(event) => setCurrentCompany(event.target.value)}
        />
        <Select
          name="workPermit"
          label="Work Permit"
          requiredMark
          value={workPermit}
          placeholder={PROFILE_SELECT_PLACEHOLDER}
          options={PROFILE_WORK_PERMIT_OPTIONS}
          onChange={(event) => setWorkPermit(event.target.value)}
        />
        <Select
          name="preferredJobLocation"
          label="Preferred Job Location"
          requiredMark
          value={preferredJobLocation}
          placeholder={PROFILE_SELECT_PLACEHOLDER}
          options={PROFILE_LOCATION_OPTIONS}
          onChange={(event) => setPreferredJobLocation(event.target.value)}
        />
        <Input
          name="startDate"
          label="Start Date"
          placeholder="Sep 2019"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
        />
        {!currentlyWorking ? (
          <Input
            name="endDate"
            label="End Date"
            placeholder="Dec 2021"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
        ) : null}
        <Checkbox
          name="currentlyWorking"
          label="I am currently working in this company"
          checked={currentlyWorking}
          onChange={(event) => {
            setCurrentlyWorking(event.target.checked)
            if (event.target.checked) setEndDate('')
          }}
        />
        {error ? <p className="text-xs text-[#E53935]">{error}</p> : null}
        <PanelPrimaryButton label="Add" onClick={handleSave} />
      </div>
    </SidePanel>
  )
}

export type ProfileAddCompensationPanelProps = {
  open: boolean
  onClose: () => void
  onSave: (entry: Omit<CompensationEntry, 'id'>) => void
}

export function ProfileAddCompensationPanel({
  open,
  onClose,
  onSave,
}: ProfileAddCompensationPanelProps) {
  const [experienceYears, setExperienceYears] = useState('')
  const [experienceMonths, setExperienceMonths] = useState('')
  const [currentSalary, setCurrentSalary] = useState('')
  const [expectedSalaryFrom, setExpectedSalaryFrom] = useState('')
  const [expectedSalaryTo, setExpectedSalaryTo] = useState('')
  const [currentlyWorking, setCurrentlyWorking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setExperienceYears('')
    setExperienceMonths('')
    setCurrentSalary('')
    setExpectedSalaryFrom('')
    setExpectedSalaryTo('')
    setCurrentlyWorking(false)
    setError(null)
  }, [open])

  function handleSave() {
    if (
      !experienceYears.trim() ||
      !experienceMonths.trim() ||
      !currentSalary.trim() ||
      !expectedSalaryFrom.trim() ||
      !expectedSalaryTo.trim()
    ) {
      setError('Please complete all required fields.')
      return
    }

    onSave({
      experienceYears: experienceYears.trim(),
      experienceMonths: experienceMonths.trim(),
      currentSalary: currentSalary.trim(),
      expectedSalaryFrom: expectedSalaryFrom.trim(),
      expectedSalaryTo: expectedSalaryTo.trim(),
      currentlyWorking,
    })
    onClose()
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Add New Compensation"
      {...PANEL_PROPS}
    >
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-xs font-medium text-[#2D2061]">
            Total Experience
            <span className="ml-0.5 text-[#E53935]" aria-hidden="true">
              *
            </span>
          </p>
          <div className="mt-1.5 grid grid-cols-2 gap-3">
            <Input
              name="experienceYears"
              label=""
              placeholder="Years"
              value={experienceYears}
              onChange={(event) => setExperienceYears(event.target.value)}
            />
            <Input
              name="experienceMonths"
              label=""
              placeholder="Months"
              value={experienceMonths}
              onChange={(event) => setExperienceMonths(event.target.value)}
            />
          </div>
        </div>

        <Input
          name="currentSalary"
          label="Current Salary (Per Year)"
          requiredMark
          placeholder="Enter Current Salary"
          value={currentSalary}
          onChange={(event) => setCurrentSalary(event.target.value)}
        />

        <div>
          <p className="text-xs font-medium text-[#2D2061]">
            Expected Salary Range
            <span className="ml-0.5 text-[#E53935]" aria-hidden="true">
              *
            </span>
          </p>
          <div className="mt-1.5 grid grid-cols-2 gap-3">
            <Input
              name="expectedSalaryFrom"
              label=""
              placeholder="$ From"
              value={expectedSalaryFrom}
              onChange={(event) => setExpectedSalaryFrom(event.target.value)}
            />
            <Input
              name="expectedSalaryTo"
              label=""
              placeholder="$ To"
              value={expectedSalaryTo}
              onChange={(event) => setExpectedSalaryTo(event.target.value)}
            />
          </div>
        </div>

        <Checkbox
          name="compensationCurrentlyWorking"
          label="I am currently working in this company"
          checked={currentlyWorking}
          onChange={(event) => setCurrentlyWorking(event.target.checked)}
        />

        {error ? <p className="text-xs text-[#E53935]">{error}</p> : null}
        <PanelPrimaryButton label="Add" onClick={handleSave} />
      </div>
    </SidePanel>
  )
}

export type ProfileAddEducationPanelProps = {
  open: boolean
  onClose: () => void
  onSave: (entry: Omit<EducationEntry, 'id'>) => void
}

export function ProfileAddEducationPanel({
  open,
  onClose,
  onSave,
}: ProfileAddEducationPanelProps) {
  const [degree, setDegree] = useState('')
  const [major, setMajor] = useState('')
  const [institution, setInstitution] = useState('')
  const [startYear, setStartYear] = useState('')
  const [endYear, setEndYear] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setDegree('')
    setMajor('')
    setInstitution('')
    setStartYear('')
    setEndYear('')
    setError(null)
  }, [open])

  function handleSave() {
    if (!institution.trim()) {
      setError('Institution is required.')
      return
    }

    if (!major.trim()) {
      setError('Education major is required.')
      return
    }

    onSave({
      institution: institution.trim(),
      degree: degree.trim(),
      major: major.trim(),
      startYear: startYear.trim(),
      endYear: endYear.trim(),
    })
    onClose()
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Add New Education"
      {...PANEL_PROPS}
    >
      <div className="flex flex-col gap-5">
        <Input
          name="institution"
          label="Institution"
          requiredMark
          placeholder="Enter Institution Name"
          value={institution}
          error={error && !institution.trim() ? error : undefined}
          onChange={(event) => {
            setInstitution(event.target.value)
            setError(null)
          }}
        />
        <Select
          name="degree"
          label="Education Degree (Attainment)"
          value={degree}
          placeholder={PROFILE_SELECT_PLACEHOLDER}
          options={PROFILE_DEGREE_OPTIONS}
          onChange={(event) => setDegree(event.target.value)}
        />
        <Select
          name="major"
          label="Education Major"
          requiredMark
          value={major}
          error={error && institution.trim() && !major.trim() ? error : undefined}
          placeholder={PROFILE_SELECT_PLACEHOLDER}
          options={PROFILE_MAJOR_OPTIONS}
          onChange={(event) => {
            setMajor(event.target.value)
            setError(null)
          }}
        />
        <div>
          <p className="text-xs font-medium text-[#2D2061]">Years Attended</p>
          <div className="mt-1.5 grid grid-cols-2 gap-3">
            <Input
              name="startYear"
              label=""
              placeholder="2015"
              value={startYear}
              onChange={(event) => setStartYear(event.target.value)}
            />
            <Input
              name="endYear"
              label=""
              placeholder="2018"
              value={endYear}
              onChange={(event) => setEndYear(event.target.value)}
            />
          </div>
        </div>
        <PanelPrimaryButton label="Add" onClick={handleSave} />
      </div>
    </SidePanel>
  )
}
