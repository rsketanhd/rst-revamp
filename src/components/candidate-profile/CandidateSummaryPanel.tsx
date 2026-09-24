import { useState, type ReactNode } from 'react'
import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { Button, ConfirmDeleteModal } from '../ui'
import {
  employmentDateLabel,
  PROFILE_EDUCATION,
  PROFILE_EMPLOYMENT,
  PROFILE_SKILLS,
  type ProfileEmployment,
} from '../../data/candidateProfile'
import {
  EducationFormPanel,
  EmploymentFormPanel,
  EMPTY_EMPLOYMENT,
  PersonalInfoPanel,
  employmentToDraft,
  type EducationDraft,
  type PersonalInfo,
} from './ProfileEditPanels'
import { ProfileSection } from './ProfileSection'

type EducationItem = (typeof PROFILE_EDUCATION)[number]

const INITIAL_PERSONAL: PersonalInfo = {
  fullName: 'Harsh D. Mistry',
  email: 'harshald.mistry@gmail.com',
  location: 'Ahmedabad, Gujarat, India',
  preferredLocation: 'Ahmedabad, Gujarat, India',
  workAuthorisation: 'Require Sponsorship',
  rightToWorkStatus: 'Immediate',
}

const EMPTY_EDUCATION: EducationDraft = { school: '', degree: '', dates: '' }

const PORTAL_ROWS = [
  {
    id: 'not-registered',
    label: 'Not Registered/Not Invited',
    pillClass: 'bg-[#FFF4D6] text-[#B45309]',
    action: 'Invite' as const,
    note: '',
    borderClass: 'border-[#E6E3EF]',
  },
  {
    id: 'invited',
    label: 'Invited (15 Sep 2026)',
    pillClass: 'bg-[#F3EEFF] text-[#6941C6]',
    action: 'Resend' as const,
    note: '',
    borderClass: 'border-[#E6E3EF]',
  },
  {
    id: 'registered',
    label: 'Registered & Active',
    pillClass: 'bg-[#E7F8EF] text-[#027A48]',
    action: null,
    note: 'Last Login Activity : Today, 8:30 AM',
    borderClass: 'border-[#86D7A8]',
  },
]

export function CandidateSummaryPanel() {
  const [personal, setPersonal] = useState<PersonalInfo>(INITIAL_PERSONAL)
  const [personalOpen, setPersonalOpen] = useState(false)
  const [employment, setEmployment] = useState<ProfileEmployment[]>(PROFILE_EMPLOYMENT)
  const [employmentPanel, setEmploymentPanel] = useState<
    { mode: 'create' } | { mode: 'edit'; id: string } | null
  >(null)
  const [education, setEducation] = useState<EducationItem[]>(PROFILE_EDUCATION)
  const [educationPanel, setEducationPanel] = useState<
    { mode: 'create' } | { mode: 'edit'; id: string } | null
  >(null)
  const [skills, setSkills] = useState<string[]>(PROFILE_SKILLS)
  const [skillDraft, setSkillDraft] = useState('')
  const [pendingEmployment, setPendingEmployment] = useState<ProfileEmployment | null>(null)

  const editingEmployment =
    employmentPanel?.mode === 'edit'
      ? employment.find((job) => job.id === employmentPanel.id)
      : undefined
  const editingEducation =
    educationPanel?.mode === 'edit'
      ? education.find((item) => item.id === educationPanel.id)
      : undefined

  function addSkill() {
    const next = skillDraft.trim()
    if (!next) return
    setSkills((current) =>
      current.some((skill) => skill.toLowerCase() === next.toLowerCase())
        ? current
        : [...current, next],
    )
    setSkillDraft('')
  }

  return (
    <div className="flex flex-col gap-3">
      {PORTAL_ROWS.map((row) => (
        <article
          key={row.id}
          className={`flex flex-col gap-3 rounded-lg border bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${row.borderClass}`}
        >
          <div className="min-w-0">
            <p className="text-[13px] font-semibold leading-5 text-[#1A1A2E]">
              Candidate Portal
              <br />
              Login Access & Management
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium ${row.pillClass}`}
            >
              {row.label}
            </span>
            {row.note ? (
              <span className="rounded-md bg-[#F4F4F6] px-2.5 py-1 text-[12px] text-[#6B6B80]">
                {row.note}
              </span>
            ) : null}
            {row.action ? (
              <Button
                type="button"
                size="sm"
                className="!h-8 !rounded-md bg-[#2D2061] px-4 text-[12px] font-semibold hover:bg-[#241a52]"
              >
                {row.action}
              </Button>
            ) : null}
          </div>
        </article>
      ))}

      <ProfileSection
        title="Personal Information"
        onEdit={() => setPersonalOpen(true)}
        editLabel="Edit personal information"
      >
        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
          <InfoField label="Full Name" value={personal.fullName} />
          <InfoField label="Email" value={personal.email} />
          <InfoField label="Location" value={personal.location} />
          <InfoField label="Preferred Location" value={personal.preferredLocation} />
          <InfoField label="Work Authorisation" value={personal.workAuthorisation} />
          <InfoField label="Right to Work Status" value={personal.rightToWorkStatus} />
        </dl>
      </ProfileSection>

      <ProfileSection title="Employment & Skill">
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-[13px] font-semibold text-[#3D3A52]">
                Employment History
              </h4>
              <button
                type="button"
                aria-label="Add employment"
                onClick={() => setEmploymentPanel({ mode: 'create' })}
                className="inline-flex size-7 items-center justify-center rounded-md text-[#6B6B80] transition-colors hover:bg-[#F4F2F8] hover:text-[#2D2061]"
              >
                <Plus className="size-4" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
            <div className="mt-3 flex flex-col gap-2.5">
              {employment.map((job) => (
                <article
                  key={job.id}
                  className="rounded-lg border border-[#E8E6F0] bg-white px-3.5 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-[#1A1A2E]">
                        {job.title}
                      </p>
                      <p className="text-[13px] text-[#5C5870]">{job.company}</p>
                      <p className="mt-0.5 text-[12px] text-[#8B8B9E]">
                        {employmentDateLabel(job)}
                        {job.duration ? ` · ${job.duration}` : ''}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      {job.current ? (
                        <span className="rounded-full bg-[#F3EEFF] px-2 py-0.5 text-[11px] font-medium text-[#6941C6]">
                          Currently Working
                        </span>
                      ) : null}
                      <IconButton
                        label={`Edit ${job.title}`}
                        onClick={() =>
                          setEmploymentPanel({ mode: 'edit', id: job.id })
                        }
                      >
                        <Pencil className="size-3.5" strokeWidth={2} />
                      </IconButton>
                      {job.current || job.id === 'emp-2' ? null : (
                        <IconButton
                          label={`Remove ${job.title}`}
                          onClick={() => setPendingEmployment(job)}
                        >
                          <Trash2 className="size-3.5" strokeWidth={2} />
                        </IconButton>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-[#F0EEF5] pt-4 sm:grid-cols-2">
            <InfoField label="Notice Period (In Days)" value="90" />
            <InfoField label="Employment Preference" value="Remote" />
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-[#3D3A52]">Skills</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded-md border border-[#E4E1EC] bg-[#F7F6FB] px-2 py-1 text-[12px] font-medium text-[#3D3A52]"
                >
                  {skill}
                  <button
                    type="button"
                    aria-label={`Remove ${skill}`}
                    onClick={() =>
                      setSkills((current) => current.filter((item) => item !== skill))
                    }
                    className="text-[#8B8B9E] hover:text-[#2D2061]"
                  >
                    <X className="size-3" strokeWidth={2} aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                addSkill()
              }}
            >
              <input
                value={skillDraft}
                onChange={(event) => setSkillDraft(event.target.value)}
                placeholder="Add Skills"
                aria-label="Add Skills"
                className="h-9 min-w-0 flex-1 rounded-md border border-[#E4E1EC] px-3 text-[13px] text-[#2A2740] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061]"
              />
              <Button
                type="submit"
                size="sm"
                className="!h-9 !rounded-md bg-[#2D2061] px-4 text-[13px] font-semibold hover:bg-[#241a52]"
              >
                Add
              </Button>
            </form>
          </div>
        </div>
      </ProfileSection>

      <ProfileSection title="Education">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-[13px] font-semibold text-[#3D3A52]">
            Education History
          </h4>
          <button
            type="button"
            aria-label="Add education"
            onClick={() => setEducationPanel({ mode: 'create' })}
            className="inline-flex size-7 items-center justify-center rounded-md text-[#6B6B80] transition-colors hover:bg-[#F4F2F8] hover:text-[#2D2061]"
          >
            <Plus className="size-4" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
        <div className="mt-3 flex flex-col gap-2.5">
          {education.map((item) => (
            <article
              key={item.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-[#E8E6F0] bg-white px-3.5 py-3"
            >
              <div>
                <p className="text-[14px] font-semibold text-[#1A1A2E]">
                  {item.school}
                </p>
                <p className="text-[13px] text-[#5C5870]">{item.degree}</p>
                <p className="mt-0.5 text-[12px] text-[#8B8B9E]">{item.dates}</p>
              </div>
              <IconButton
                label={`Edit ${item.school}`}
                onClick={() => setEducationPanel({ mode: 'edit', id: item.id })}
              >
                <Pencil className="size-3.5" strokeWidth={2} />
              </IconButton>
            </article>
          ))}
        </div>
      </ProfileSection>

      <PersonalInfoPanel
        open={personalOpen}
        value={personal}
        onClose={() => setPersonalOpen(false)}
        onSave={(next) => {
          setPersonal(next)
          setPersonalOpen(false)
        }}
      />
      <EmploymentFormPanel
        open={employmentPanel !== null}
        mode={employmentPanel?.mode ?? 'create'}
        value={
          editingEmployment ? employmentToDraft(editingEmployment) : EMPTY_EMPLOYMENT
        }
        onClose={() => setEmploymentPanel(null)}
        onSubmit={(next) => {
          if (employmentPanel?.mode === 'edit' && editingEmployment) {
            setEmployment((current) =>
              current.map((job) =>
                job.id === editingEmployment.id
                  ? { ...job, ...next, duration: job.duration }
                  : job,
              ),
            )
          } else {
            setEmployment((current) => [
              ...current,
              {
                id: `emp-${Date.now()}`,
                ...next,
                duration: '',
              },
            ])
          }
          setEmploymentPanel(null)
        }}
      />
      <EducationFormPanel
        open={educationPanel !== null}
        mode={educationPanel?.mode ?? 'create'}
        value={
          editingEducation
            ? {
                school: editingEducation.school,
                degree: editingEducation.degree,
                dates: editingEducation.dates,
              }
            : EMPTY_EDUCATION
        }
        onClose={() => setEducationPanel(null)}
        onSubmit={(next) => {
          if (educationPanel?.mode === 'edit' && editingEducation) {
            setEducation((current) =>
              current.map((item) =>
                item.id === editingEducation.id ? { ...item, ...next } : item,
              ),
            )
          } else {
            setEducation((current) => [
              ...current,
              { id: `edu-${Date.now()}`, ...next },
            ])
          }
          setEducationPanel(null)
        }}
      />
      <ConfirmDeleteModal
        open={Boolean(pendingEmployment)}
        title="Delete Employment"
        itemName={pendingEmployment?.title}
        onClose={() => setPendingEmployment(null)}
        onConfirm={() => {
          if (!pendingEmployment) return
          setEmployment((current) =>
            current.filter((item) => item.id !== pendingEmployment.id),
          )
          setPendingEmployment(null)
        }}
      />
    </div>
  )
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[12px] text-[#8B8B9E]">{label}</dt>
      <dd className="mt-0.5 text-[13px] font-medium text-[#1A1A2E]">{value}</dd>
    </div>
  )
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex size-7 items-center justify-center rounded-md text-[#8B8B9E] transition-colors hover:bg-[#F4F2F8] hover:text-[#2D2061]"
    >
      {children}
    </button>
  )
}

