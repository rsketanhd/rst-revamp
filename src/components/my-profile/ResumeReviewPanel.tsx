import { useState } from 'react'
import { ArrowRight, Check, CircleCheck } from 'lucide-react'
import { Button, Modal, SidePanel } from '../ui'
import { cn } from '../../lib/cn'
import {
  buildResumeReview,
  defaultUseResume,
  type ResumeFieldKey,
  type ResumeReviewField,
} from '../../data/resumeReview'

export type ResumeReviewPanelProps = {
  open: boolean
  onClose: () => void
  onApply: (
    values: Partial<Record<ResumeFieldKey, string>>,
    skills: string[],
  ) => void
}

type Choice = { useResume: boolean; value: string }

const GRID =
  'grid grid-cols-[13rem_minmax(0,1fr)_minmax(0,1fr)_max-content] items-center gap-4'

/**
 * "Review changes from your new resume" — per-field Keep mine / Use resume.
 */
export function ResumeReviewPanel({ open, onClose, onApply }: ResumeReviewPanelProps) {
  const [fields, setFields] = useState<ResumeReviewField[]>([])
  const [newSkills, setNewSkills] = useState<string[]>([])
  const [choices, setChoices] = useState<Partial<Record<ResumeFieldKey, Choice>>>({})
  const [skillPicks, setSkillPicks] = useState<string[]>([])
  const [wasOpen, setWasOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  // Rebuild the comparison from the latest profile each time the panel opens
  if (open !== wasOpen) {
    setWasOpen(open)
    setConfirmOpen(false)
    if (open) {
      const review = buildResumeReview()
      setFields(review.fields)
      setNewSkills(review.newSkills)
      setSkillPicks(review.newSkills)
      setChoices(
        Object.fromEntries(
          review.fields
            .filter((f) => f.status !== 'same')
            .map((f) => [f.key, { useResume: defaultUseResume(f), value: f.resume }]),
        ),
      )
    }
  }

  const emptyCount = fields.filter((f) => f.status === 'empty').length
  const conflictCount = fields.filter((f) => f.status === 'conflict').length
  const sameCount = fields.filter((f) => f.status === 'same').length
  const selectedKeys = (Object.keys(choices) as ResumeFieldKey[]).filter(
    (key) => choices[key]?.useResume,
  )

  function setChoice(key: ResumeFieldKey, patch: Partial<Choice>) {
    setChoices((current) => {
      const existing = current[key]
      if (!existing) return current
      return { ...current, [key]: { ...existing, ...patch } }
    })
  }

  function setAll(useResume: boolean) {
    setChoices((current) =>
      Object.fromEntries(
        Object.entries(current).map(([key, choice]) => [key, { ...choice, useResume }]),
      ),
    )
    setSkillPicks(useResume ? newSkills : [])
  }

  function toggleSkill(skill: string) {
    setSkillPicks((current) =>
      current.includes(skill) ? current.filter((s) => s !== skill) : [...current, skill],
    )
  }

  const pickedSkills = newSkills.filter((s) => skillPicks.includes(s))
  const nothingSelected = selectedKeys.length === 0 && pickedSkills.length === 0

  function handleApply() {
    setConfirmOpen(false)
    const values = Object.fromEntries(
      selectedKeys.map((key) => [key, choices[key]?.value ?? '']),
    ) as Partial<Record<ResumeFieldKey, string>>
    onApply(values, pickedSkills)
  }

  const identity = fields.filter((f) => f.section === 'identity')
  const fromResume = fields.filter((f) => f.section === 'resume')

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Review changes from your new resume"
      widthClassName="w-full max-w-[62.5rem]"
      headerClassName="!h-16 bg-[#454A75]"
      titleClassName="text-xl font-semibold text-white"
      bodyClassName="!px-6 sm:!px-8 !py-8"
      footerClassName="flex-wrap items-center justify-between !px-6 sm:!px-8 !py-5"
      footer={
        <>
          <p className="text-[15px] text-[#1F1B4D]">
            <span className="font-bold">
              {selectedKeys.length} {selectedKeys.length === 1 ? 'field' : 'fields'}
            </span>{' '}
            and{' '}
            <span className="font-bold">
              {skillPicks.length} {skillPicks.length === 1 ? 'skill' : 'skills'}
            </span>{' '}
            will be updated
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center justify-center rounded-md border border-[#2D2061] bg-white px-4 text-[15px] font-semibold text-[#2D2061] transition-colors hover:bg-[#F7F6FA]"
            >
              Cancel - Keep resume as document only
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={nothingSelected}
              className="inline-flex h-10 items-center justify-center rounded-md bg-[#2D2061] px-4 text-[15px] font-semibold text-white transition-colors hover:bg-[#241a52] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Apply Selected to Profile
            </button>
          </div>
        </>
      }
    >
      <div className="overflow-x-auto">
        <div className="min-w-[52rem]">
          {/* Summary + bulk actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E6F0] bg-[#F5F6FA] px-4 py-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#E3F5EA] px-3 py-1.5 text-[13px] font-medium text-[#15803D]">
                {emptyCount} empty fields to fill
              </span>
              <span className="rounded-full bg-[#FDEFDF] px-3 py-1.5 text-[13px] font-medium text-[#E0752B]">
                {conflictCount} conflicts
              </span>
              <span className="rounded-full bg-[#EFEFF3] px-3 py-1.5 text-[13px] font-medium text-[#8B8B9E]">
                {sameCount} unchanged
              </span>
            </div>
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setAll(true)}
                className="text-sm font-semibold text-[#1F1B4D] hover:underline"
              >
                Use resume for all
              </button>
              <button
                type="button"
                onClick={() => setAll(false)}
                className="text-sm font-semibold text-[#1F1B4D] hover:underline"
              >
                Keep all mine
              </button>
            </div>
          </div>

          {/* Column headers */}
          <div
            className={cn(
              GRID,
              'border-b border-[#E8E6F0] py-4 text-xs font-semibold uppercase tracking-[0.02em] text-[#8B8B9E]',
            )}
          >
            <span>Field</span>
            <span>Current Profile</span>
            <span>From New Resume</span>
            <span aria-hidden="true" />
          </div>

          <FieldSection
            title="Identity & Contact"
            note="Shown for review — never applied unless you choose to"
            fields={identity}
            hint="identity field"
            choices={choices}
            onChoice={setChoice}
          />
          <FieldSection
            title="From your resume"
            note="Empty fields are pre-selected; conflicts default to keeping your value where the parser wasn't sure"
            fields={fromResume}
            choices={choices}
            onChoice={setChoice}
          />

          {newSkills.length > 0 ? (
            <section className="mt-6">
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-base font-semibold text-[#2D2061]">Skills</h3>
                <p className="text-[13px] text-[#6B6B80]">
                  New skills found in your resume — click to include or skip
                </p>
              </div>
              <div className="flex flex-wrap gap-2 rounded-xl bg-[#F7F7FA] p-4">
                {newSkills.map((skill) => {
                  const on = skillPicks.includes(skill)
                  return (
                    <button
                      key={skill}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleSkill(skill)}
                      className={cn(
                        'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition-colors',
                        on
                          ? 'border-[#2D2061] bg-white text-[#2D2061]'
                          : 'border-[#E4E3EA] bg-[#EFEFF3] text-[#8B8B9E] hover:text-[#6B6B80]',
                      )}
                    >
                      {on ? (
                        <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                      ) : null}
                      {skill}
                    </button>
                  )
                })}
              </div>
            </section>
          ) : null}
        </div>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Apply changes to your profile?"
        className="max-w-lg"
        zClassName="z-[70]"
      >
        <p className="text-sm leading-relaxed text-[#4A4A5A]">
          These values from your resume will replace what&apos;s on your
          profile. Everything else stays as it is.
        </p>
        <ul className="mt-4 flex max-h-64 flex-col gap-2 overflow-y-auto">
          {selectedKeys.map((key) => {
            const field = fields.find((f) => f.key === key)
            if (!field) return null
            return (
              <li
                key={key}
                className="rounded-lg bg-[#F7F7FA] px-3 py-2 text-sm"
              >
                <p className="font-semibold text-[#1F1B4D]">{field.label}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[13px]">
                  <span className="text-[#8B8B9E] line-through">
                    {field.current || 'Not set'}
                  </span>
                  <ArrowRight className="size-3.5 text-[#A0A0B2]" aria-hidden="true" />
                  <span className="font-medium text-[#2D2061]">
                    {choices[key]?.value.trim() || '—'}
                  </span>
                </p>
              </li>
            )
          })}
          {pickedSkills.length > 0 ? (
            <li className="rounded-lg bg-[#F7F7FA] px-3 py-2 text-sm">
              <p className="font-semibold text-[#1F1B4D]">
                Add {pickedSkills.length}{' '}
                {pickedSkills.length === 1 ? 'skill' : 'skills'}
              </p>
              <p className="mt-0.5 text-[13px] text-[#2D2061]">
                {pickedSkills.join(', ')}
              </p>
            </li>
          ) : null}
        </ul>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setConfirmOpen(false)}
            className="!h-10 !rounded-md !border-[#2D2061] !px-5 !text-[#2D2061] hover:!bg-[#F7F6FA]"
          >
            Go Back
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            className="!h-10 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            Yes, Apply Changes
          </Button>
        </div>
      </Modal>
    </SidePanel>
  )
}

function FieldSection({
  title,
  note,
  fields,
  hint,
  choices,
  onChoice,
}: {
  title: string
  note: string
  fields: ResumeReviewField[]
  hint?: string
  choices: Partial<Record<ResumeFieldKey, Choice>>
  onChoice: (key: ResumeFieldKey, patch: Partial<Choice>) => void
}) {
  return (
    <section className="mt-6">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-base font-semibold text-[#2D2061]">{title}</h3>
        <p className="text-[13px] text-[#6B6B80]">{note}</p>
      </div>
      <div className="rounded-xl bg-[#F7F7FA] px-4">
        {fields.map((field) => {
          const choice = choices[field.key]
          const editable = field.status !== 'same'
          return (
            <div
              key={field.key}
              className={cn(GRID, 'border-b border-[#E8E6F0] py-4 last:border-b-0')}
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1F1B4D]">{field.label}</p>
                {hint ? <p className="text-xs text-[#8B8B9E]">{hint}</p> : null}
                {field.status === 'empty' ? (
                  <FieldStatus className="bg-[#E3F5EA] text-[#15803D]">
                    Empty field to fill
                  </FieldStatus>
                ) : field.status === 'conflict' ? (
                  <FieldStatus className="bg-[#FDEFDF] text-[#E0752B]">
                    Conflict
                  </FieldStatus>
                ) : (
                  <FieldStatus className="bg-[#EFEFF3] text-[#8B8B9E]">
                    No change
                  </FieldStatus>
                )}
              </div>
              <ValueBox value={field.current} placeholder="Not set" />
              {editable && choice ? (
                <input
                  value={choice.value}
                  onChange={(e) => onChoice(field.key, { value: e.target.value })}
                  aria-label={`${field.label} from new resume`}
                  className="h-10 w-full rounded-md border border-[#D5D2E2] bg-white px-3 text-sm text-[#2A2740] outline-none transition-colors focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
                />
              ) : (
                <ValueBox value={field.resume} />
              )}
              <div className="flex justify-start">
                {editable && choice ? (
                  <ChoiceToggle
                    label={field.label}
                    useResume={choice.useResume}
                    onChange={(useResume) => onChoice(field.key, { useResume })}
                  />
                ) : (
                  <span className="inline-flex items-center gap-2 text-[13px] text-[#A0A0B2]">
                    <CircleCheck
                      className="size-4 fill-[#22A45A] text-white"
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                    No change
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function FieldStatus({
  className,
  children,
}: {
  className: string
  children: string
}) {
  return (
    <span
      className={cn(
        'mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium',
        className,
      )}
    >
      {children}
    </span>
  )
}

function ValueBox({ value, placeholder = '—' }: { value: string; placeholder?: string }) {
  return (
    <div
      className={cn(
        'flex h-10 min-w-0 items-center truncate rounded-md border border-[#E4E3EA] bg-[#EDEDF0] px-3 text-sm',
        value ? 'text-[#6B6B80]' : 'italic text-[#A0A0B2]',
      )}
    >
      {value || placeholder}
    </div>
  )
}

function ChoiceToggle({
  label,
  useResume,
  onChange,
}: {
  label: string
  useResume: boolean
  onChange: (useResume: boolean) => void
}) {
  const option = (active: boolean, text: string, next: boolean) => (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onChange(next)}
      className={cn(
        'inline-flex h-7 items-center whitespace-nowrap rounded px-2 text-xs font-medium transition-colors',
        active
          ? 'bg-white text-[#1F1B4D] shadow-[0_1px_2px_rgba(26,22,56,0.12)]'
          : 'text-[#4A4760] hover:text-[#1F1B4D]',
      )}
    >
      {text}
    </button>
  )
  return (
    <div
      role="group"
      aria-label={`${label}: keep mine or use resume`}
      className="inline-flex shrink-0 flex-nowrap rounded-md bg-[#E4E3EA] p-1"
    >
      {option(!useResume, 'Keep mine', false)}
      {option(useResume, 'Use resume', true)}
    </div>
  )
}
