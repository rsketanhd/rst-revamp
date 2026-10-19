import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import {
  Button,
  Checkbox,
  Input,
  MultiSelect,
  Select,
  SidePanel,
} from '../ui'
import { cn } from '../../lib/cn'

export type JobStepId = 'draft-to-active' | 'active-to-careers' | 'reactivate'

export type ApprovalLevelMode = 'any-one' | 'all'

export type JobApprovalLevel = {
  id: string
  mode: ApprovalLevelMode
  roles: {
    collaborator: boolean
    recruiter: boolean
    superUser: boolean
  }
  namedUsers: string[]
  escalateAfterDays: string
  escalateTo: string
}

export type JobApprovalRuleForm = {
  name: string
  stepIds: JobStepId[]
  allJobs: boolean
  appliesTo: string
  levels: JobApprovalLevel[]
}

export type JobApprovalRulePanelProps = {
  open: boolean
  /** Null = add; otherwise edit that rule form snapshot. */
  initial: JobApprovalRuleForm | null
  onClose: () => void
  onSave: (form: JobApprovalRuleForm) => void
}

const STEP_OPTIONS: Array<{ id: JobStepId; label: string }> = [
  { id: 'draft-to-active', label: 'Draft → Active' },
  { id: 'active-to-careers', label: 'Active → On careers page' },
  { id: 'reactivate', label: 'Expired / Closed → Active' },
]

const MODE_OPTIONS = [
  { value: 'any-one', label: 'Any one approves' },
  { value: 'all', label: 'All must approve' },
]

const ESCALATE_OPTIONS = [
  { value: 'none', label: 'No escalation' },
  { value: 'super-user', label: 'Super User' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'heli-shah', label: 'Heli Shah' },
]

const NAMED_USER_OPTIONS = [
  { value: 'ketan', label: 'ketan' },
  { value: 'heli-shah', label: 'Heli Shah' },
  { value: 'ashik-patel', label: 'Ashik Patel' },
  { value: 'priya-nair', label: 'Priya Nair' },
]

function emptyLevel(index: number): JobApprovalLevel {
  return {
    id: `level-${index + 1}-${Math.random().toString(36).slice(2, 7)}`,
    mode: 'any-one',
    roles: { collaborator: false, recruiter: false, superUser: false },
    namedUsers: [],
    escalateAfterDays: '',
    escalateTo: 'none',
  }
}

export function emptyJobApprovalRuleForm(): JobApprovalRuleForm {
  return {
    name: '',
    stepIds: ['draft-to-active'],
    allJobs: true,
    appliesTo: '',
    levels: [emptyLevel(0)],
  }
}

export function stepLabels(stepIds: JobStepId[]): string {
  return STEP_OPTIONS.filter((step) => stepIds.includes(step.id))
    .map((step) => step.label)
    .join(', ')
}

export function appliesToLabel(form: JobApprovalRuleForm): string {
  if (form.allJobs) return 'All jobs'
  return form.appliesTo.trim() || 'Conditions not set'
}

export function chainLabel(form: JobApprovalRuleForm): string {
  return form.levels
    .map((level, index) => {
      const mode = level.mode === 'any-one' ? 'any one' : 'all'
      const parts = [
        ...roleLabels(level),
        ...level.namedUsers.map(namedUserLabel),
      ]
      const who = parts.length > 0 ? parts.join(', ') : '—'
      return `Level ${index + 1} (${mode}): ${who}`
    })
    .join(' · ')
}

function roleLabels(level: JobApprovalLevel): string[] {
  const labels: string[] = []
  if (level.roles.collaborator) labels.push('Collaborator')
  if (level.roles.recruiter) labels.push('Recruiter')
  if (level.roles.superUser) labels.push('Super User')
  return labels
}

function namedUserLabel(value: string): string {
  return (
    NAMED_USER_OPTIONS.find((option) => option.value === value)?.label ?? value
  )
}

function levelHasApprovers(level: JobApprovalLevel): boolean {
  return (
    level.roles.collaborator ||
    level.roles.recruiter ||
    level.roles.superUser ||
    level.namedUsers.length > 0
  )
}

/**
 * Side panel to add or edit a job approval rule.
 */
export function JobApprovalRulePanel({
  open,
  initial,
  onClose,
  onSave,
}: JobApprovalRulePanelProps) {
  const [form, setForm] = useState<JobApprovalRuleForm>(emptyJobApprovalRuleForm)
  const [nameError, setNameError] = useState<string | undefined>()
  const [stepsError, setStepsError] = useState<string | undefined>()

  useEffect(() => {
    if (!open) return
    setForm(initial ?? emptyJobApprovalRuleForm())
    setNameError(undefined)
    setStepsError(undefined)
  }, [open, initial])

  const levelErrors = useMemo(
    () =>
      form.levels.map((level, index) =>
        levelHasApprovers(level)
          ? undefined
          : `Level ${index + 1} has no approvers.`,
      ),
    [form.levels],
  )

  function patchForm(patch: Partial<JobApprovalRuleForm>) {
    setForm((current) => ({ ...current, ...patch }))
  }

  function toggleStep(stepId: JobStepId) {
    setForm((current) => {
      const has = current.stepIds.includes(stepId)
      const stepIds = has
        ? current.stepIds.filter((id) => id !== stepId)
        : [...current.stepIds, stepId]
      return { ...current, stepIds }
    })
    if (stepsError) setStepsError(undefined)
  }

  function updateLevel(
    levelId: string,
    patch: Partial<JobApprovalLevel> | ((level: JobApprovalLevel) => JobApprovalLevel),
  ) {
    setForm((current) => ({
      ...current,
      levels: current.levels.map((level) => {
        if (level.id !== levelId) return level
        return typeof patch === 'function' ? patch(level) : { ...level, ...patch }
      }),
    }))
  }

  function addLevel() {
    setForm((current) => ({
      ...current,
      levels: [...current.levels, emptyLevel(current.levels.length)],
    }))
  }

  function handleSave() {
    let valid = true
    if (!form.name.trim()) {
      setNameError('Rule name is required')
      valid = false
    }
    if (form.stepIds.length === 0) {
      setStepsError('Select at least one step')
      valid = false
    }
    if (levelErrors.some(Boolean)) valid = false
    if (!valid) return
    onSave({
      ...form,
      name: form.name.trim(),
      appliesTo: form.allJobs ? '' : form.appliesTo.trim(),
    })
    onClose()
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={initial ? 'Edit job approval rule' : 'Add job approval rule'}
      widthClassName="w-full max-w-full sm:max-w-[min(100%,32rem)]"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save rule
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <Input
          id="job-approval-rule-name"
          label="Rule name"
          requiredMark
          value={form.name}
          error={nameError}
          placeholder="e.g. India draft activation"
          onChange={(event) => {
            patchForm({ name: event.target.value })
            if (nameError) setNameError(undefined)
          }}
        />

        <div>
          <p className="mb-2 text-xs font-medium text-[#2D2061]">
            Which steps does it cover?
          </p>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
            {STEP_OPTIONS.map((step) => (
              <Checkbox
                key={step.id}
                id={`job-rule-step-${step.id}`}
                label={step.label}
                checked={form.stepIds.includes(step.id)}
                onChange={() => toggleStep(step.id)}
              />
            ))}
          </div>
          {stepsError ? (
            <p className="mt-1.5 text-xs text-[#E53935]">{stepsError}</p>
          ) : null}
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-[#2D2061]">
            When does it apply?
          </p>
          <Checkbox
            id="job-rule-all-jobs"
            label="All jobs (fallback when no other rule matches)"
            checked={form.allJobs}
            onChange={(event) => patchForm({ allJobs: event.target.checked })}
          />
          {!form.allJobs ? (
            <div className="mt-3">
              <Input
                id="job-rule-applies-to"
                label="Applies to"
                placeholder="e.g. Country is India"
                value={form.appliesTo}
                onChange={(event) =>
                  patchForm({ appliesTo: event.target.value })
                }
              />
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-sm font-semibold text-[#2D2061]">Approval levels</p>
          <p className="mt-1 text-xs leading-relaxed text-[#8B8B9E]">
            Levels run in order. Approvers need permission to approve jobs.
            Whether they can approve their own submission is set in Settings →
            Approvals → General.
          </p>

          <div className="mt-3 flex flex-col gap-3">
            {form.levels.map((level, index) => (
              <div
                key={level.id}
                className="rounded-[8px] border border-[#E4E1EE] bg-[#F8F9FB] p-4"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#2D2061]">
                    Level {index + 1}
                  </p>
                  <div className="w-full max-w-[12rem]">
                    <Select
                      id={`job-rule-level-mode-${level.id}`}
                      aria-label={`Level ${index + 1} approval mode`}
                      options={MODE_OPTIONS}
                      value={level.mode}
                      onChange={(event) =>
                        updateLevel(level.id, {
                          mode: event.target.value as ApprovalLevelMode,
                        })
                      }
                      className="!h-9"
                    />
                  </div>
                </div>

                <p className="mb-2 text-xs font-medium text-[#2D2061]">Roles</p>
                <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2">
                  <Checkbox
                    id={`job-rule-role-collab-${level.id}`}
                    label="Collaborator"
                    checked={level.roles.collaborator}
                    onChange={(event) =>
                      updateLevel(level.id, {
                        roles: {
                          ...level.roles,
                          collaborator: event.target.checked,
                        },
                      })
                    }
                  />
                  <Checkbox
                    id={`job-rule-role-recruiter-${level.id}`}
                    label="Recruiter"
                    checked={level.roles.recruiter}
                    onChange={(event) =>
                      updateLevel(level.id, {
                        roles: {
                          ...level.roles,
                          recruiter: event.target.checked,
                        },
                      })
                    }
                  />
                  <Checkbox
                    id={`job-rule-role-super-${level.id}`}
                    label="Super User"
                    checked={level.roles.superUser}
                    onChange={(event) =>
                      updateLevel(level.id, {
                        roles: {
                          ...level.roles,
                          superUser: event.target.checked,
                        },
                      })
                    }
                  />
                </div>

                <MultiSelect
                  label="Named users"
                  placeholder="Add an approver..."
                  options={NAMED_USER_OPTIONS}
                  value={level.namedUsers}
                  onChange={(namedUsers) =>
                    updateLevel(level.id, { namedUsers })
                  }
                />

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <Input
                      id={`job-rule-escalate-days-${level.id}`}
                      label="Escalate after (days)"
                      type="number"
                      min={0}
                      value={level.escalateAfterDays}
                      onChange={(event) =>
                        updateLevel(level.id, {
                          escalateAfterDays: event.target.value,
                        })
                      }
                      helperText="Needs the background scheduler."
                    />
                  </div>
                  <Select
                    id={`job-rule-escalate-to-${level.id}`}
                    label="Escalate to"
                    options={ESCALATE_OPTIONS}
                    value={level.escalateTo}
                    onChange={(event) =>
                      updateLevel(level.id, {
                        escalateTo: event.target.value,
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={addLevel}
            className="mt-3 !h-9 !rounded-md !border-[#2D2061] !px-3.5 !text-[#2D2061] hover:!bg-white"
          >
            <Plus className="size-4" strokeWidth={2.25} aria-hidden="true" />
            Add level
          </Button>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-[#2D2061]">
            Resolved chain
          </p>
          <div className="rounded-[8px] border border-[#E4E1EE] bg-[#F5F2FC] px-4 py-3 text-sm leading-relaxed text-[#2D2061]">
            <p>{appliesToLabel(form)}</p>
            {form.levels.map((level, index) => {
              const mode = level.mode === 'any-one' ? 'any one' : 'all'
              const parts = [
                ...roleLabels(level),
                ...level.namedUsers.map(namedUserLabel),
              ]
              return (
                <p key={level.id} className="mt-1">
                  Level {index + 1} ({mode}):
                  {parts.length > 0 ? ` ${parts.join(', ')}` : ''}
                </p>
              )
            })}
          </div>
          {levelErrors.filter(Boolean).map((message) => (
            <p
              key={message}
              className={cn(
                'mt-2 rounded-[8px] border border-[#F5C2C2] bg-[#FFF5F5] px-3 py-2 text-xs font-medium text-[#C44B4B]',
              )}
            >
              {message}
            </p>
          ))}
        </div>
      </div>
    </SidePanel>
  )
}
