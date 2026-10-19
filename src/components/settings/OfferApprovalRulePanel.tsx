import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  Button,
  Checkbox,
  Input,
  MultiSelect,
  SegmentedControl,
  Select,
  SidePanel,
} from '../ui'
import { cn } from '../../lib/cn'
import type {
  ApprovalLevelMode,
  ConditionMatchMode,
  JobApprovalCondition,
  JobApprovalLevel,
} from './JobApprovalRulePanel'

export type OfferApprovalCondition = JobApprovalCondition

export type OfferApprovalRuleForm = {
  name: string
  allOffers: boolean
  /** Legacy free-text summary; preferred source is `conditions`. */
  appliesTo: string
  matchMode: ConditionMatchMode
  conditions: OfferApprovalCondition[]
  levels: JobApprovalLevel[]
}

export type OfferApprovalRulePanelProps = {
  open: boolean
  /** Null = add; otherwise edit that rule form snapshot. */
  initial: OfferApprovalRuleForm | null
  onClose: () => void
  onSave: (form: OfferApprovalRuleForm) => void
}

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

const MATCH_MODE_OPTIONS: Array<{ value: ConditionMatchMode; label: string }> =
  [
    { value: 'and', label: 'All conditions (AND)' },
    { value: 'or', label: 'Any condition (OR)' },
  ]

const CONDITION_FIELD_OPTIONS = [
  { value: 'legal-entity', label: 'Legal entity' },
  { value: 'total-package', label: 'Total package' },
  { value: 'department', label: 'Department' },
  { value: 'employment-type', label: 'Employment type' },
  { value: 'job-category', label: 'Job category' },
  { value: 'job-sub-category', label: 'Job sub category' },
  { value: 'job-type', label: 'Job type' },
  { value: 'hiring-manager', label: 'Hiring manager' },
  { value: 'recruiter', label: 'Recruiter' },
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

export function emptyOfferApprovalRuleForm(): OfferApprovalRuleForm {
  return {
    name: '',
    allOffers: true,
    appliesTo: '',
    matchMode: 'and',
    conditions: [],
    levels: [emptyLevel(0)],
  }
}

function normalizeOfferApprovalRuleForm(
  form: OfferApprovalRuleForm,
): OfferApprovalRuleForm {
  return {
    ...emptyOfferApprovalRuleForm(),
    ...form,
    matchMode: form.matchMode ?? 'and',
    conditions: form.conditions ?? [],
    levels: form.levels.length > 0 ? form.levels : [emptyLevel(0)],
  }
}

export function offerAppliesToLabel(form: OfferApprovalRuleForm): string {
  if (form.allOffers) return 'All offers'
  if (form.conditions.length > 0) {
    return form.conditions
      .map((condition) => condition.label)
      .join(form.matchMode === 'and' ? ' AND ' : ' OR ')
  }
  return form.appliesTo.trim() || 'Conditions not set'
}

export function offerChainLabel(form: OfferApprovalRuleForm): string {
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
 * Side panel to add or edit an offer approval rule (mirrors Job Approvals rule panel).
 */
export function OfferApprovalRulePanel({
  open,
  initial,
  onClose,
  onSave,
}: OfferApprovalRulePanelProps) {
  const [form, setForm] = useState<OfferApprovalRuleForm>(
    emptyOfferApprovalRuleForm,
  )
  const [nameError, setNameError] = useState<string | undefined>()
  const [conditionMenuOpen, setConditionMenuOpen] = useState(false)
  const conditionMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    setForm(
      normalizeOfferApprovalRuleForm(initial ?? emptyOfferApprovalRuleForm()),
    )
    setNameError(undefined)
    setConditionMenuOpen(false)
  }, [open, initial])

  useEffect(() => {
    if (!conditionMenuOpen) return
    function handlePointerDown(event: MouseEvent) {
      if (
        conditionMenuRef.current &&
        !conditionMenuRef.current.contains(event.target as Node)
      ) {
        setConditionMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [conditionMenuOpen])

  const levelErrors = useMemo(
    () =>
      form.levels.map((level, index) =>
        levelHasApprovers(level)
          ? undefined
          : `Level ${index + 1} has no approvers.`,
      ),
    [form.levels],
  )

  function patchForm(patch: Partial<OfferApprovalRuleForm>) {
    setForm((current) => ({ ...current, ...patch }))
  }

  function updateLevel(
    levelId: string,
    patch:
      | Partial<JobApprovalLevel>
      | ((level: JobApprovalLevel) => JobApprovalLevel),
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
    if (levelErrors.some(Boolean)) valid = false
    if (!valid) return
    onSave({
      ...form,
      name: form.name.trim(),
      appliesTo: form.allOffers
        ? ''
        : form.conditions.length > 0
          ? offerAppliesToLabel({ ...form, allOffers: false })
          : form.appliesTo.trim(),
      conditions: form.allOffers ? [] : form.conditions,
    })
    onClose()
  }

  function addCondition(field: string, label: string) {
    setForm((current) => ({
      ...current,
      conditions: [
        ...current.conditions,
        {
          id: `condition-${Math.random().toString(36).slice(2, 8)}`,
          field,
          label,
        },
      ],
    }))
    setConditionMenuOpen(false)
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={initial ? 'Edit offer approval rule' : 'Add offer approval rule'}
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
          id="offer-approval-rule-name"
          label="Rule name"
          requiredMark
          value={form.name}
          error={nameError}
          placeholder="e.g. Senior roles over 100k"
          onChange={(event) => {
            patchForm({ name: event.target.value })
            if (nameError) setNameError(undefined)
          }}
        />

        <div>
          <p className="mb-2 text-xs font-medium text-[#2D2061]">
            When does it apply?
          </p>
          <Checkbox
            id="offer-rule-all-offers"
            label="All offers (fallback when no other rule matches)"
            checked={form.allOffers}
            onChange={(event) =>
              patchForm({ allOffers: event.target.checked })
            }
          />
          {!form.allOffers ? (
            <div className="mt-3 rounded-[8px] border border-[#E4E1EE] bg-white p-4">
              <p className="text-xs leading-relaxed text-[#8B8B9E]">
                Conditions use the offer&apos;s legal entity, total package,
                department and employment type, and the job&apos;s fields. Within
                a condition, any of its values will do.
              </p>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <p className="text-sm font-semibold text-[#2D2061]">Match</p>
                <SegmentedControl
                  aria-label="Condition match mode"
                  value={form.matchMode}
                  options={MATCH_MODE_OPTIONS}
                  onChange={(matchMode) => patchForm({ matchMode })}
                  className="w-fit"
                />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#8B8B9E]">
                {form.matchMode === 'and'
                  ? "The rule applies only when every condition holds. It's one setting for the whole rule; AND and OR can't be mixed."
                  : "The rule applies when any condition holds. It's one setting for the whole rule; AND and OR can't be mixed."}
              </p>

              {form.conditions.length === 0 ? (
                <p className="mt-4 text-sm text-[#8B8B9E]">No conditions yet.</p>
              ) : (
                <ul className="mt-4 flex flex-col gap-2">
                  {form.conditions.map((condition) => (
                    <li
                      key={condition.id}
                      className="flex items-center justify-between gap-3 rounded-[8px] border border-[#E4E1EE] bg-[#F8F9FB] px-3 py-2"
                    >
                      <p className="text-sm font-medium text-[#2D2061]">
                        {condition.label}
                      </p>
                      <button
                        type="button"
                        aria-label={`Remove ${condition.label} condition`}
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            conditions: current.conditions.filter(
                              (item) => item.id !== condition.id,
                            ),
                          }))
                        }
                        className="text-xs font-semibold text-[#8B8B9E] transition-colors hover:text-[#C44B4B]"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div ref={conditionMenuRef} className="relative mt-3">
                <button
                  type="button"
                  aria-expanded={conditionMenuOpen}
                  aria-haspopup="listbox"
                  onClick={() => setConditionMenuOpen((prev) => !prev)}
                  className="flex h-10 w-full items-center justify-between gap-2 rounded-[8px] border border-[#D5D2E2] bg-white px-3 text-left text-sm text-[#6B6B80] transition-colors hover:border-[#2D2061] hover:text-[#2D2061]"
                >
                  <span>Add a condition...</span>
                  <ChevronDown
                    className={cn(
                      'size-4 shrink-0 transition-transform',
                      conditionMenuOpen && 'rotate-180',
                    )}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </button>
                {conditionMenuOpen ? (
                  <ul
                    role="listbox"
                    aria-label="Condition fields"
                    className="absolute left-0 right-0 z-10 mt-1 max-h-48 overflow-auto rounded-[8px] border border-[#E4E1EE] bg-white py-1 shadow-[0_8px_24px_rgba(45,32,97,0.12)]"
                  >
                    {CONDITION_FIELD_OPTIONS.map((option) => (
                      <li key={option.value} role="option">
                        <button
                          type="button"
                          onClick={() =>
                            addCondition(option.value, option.label)
                          }
                          className="flex w-full px-3 py-2 text-left text-sm text-[#2D2061] transition-colors hover:bg-[#F5F4FA]"
                        >
                          {option.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-sm font-semibold text-[#2D2061]">Approval levels</p>
          <p className="mt-1 text-xs leading-relaxed text-[#8B8B9E]">
            Levels run in order. Approvers need permission to approve offers.
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
                      id={`offer-rule-level-mode-${level.id}`}
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
                    id={`offer-rule-role-collab-${level.id}`}
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
                    id={`offer-rule-role-recruiter-${level.id}`}
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
                    id={`offer-rule-role-super-${level.id}`}
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
                      id={`offer-rule-escalate-days-${level.id}`}
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
                    id={`offer-rule-escalate-to-${level.id}`}
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
            Add level
          </Button>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-[#2D2061]">
            Resolved chain
          </p>
          <div className="rounded-[8px] border border-[#E4E1EE] bg-[#F5F2FC] px-4 py-3 text-sm leading-relaxed text-[#2D2061]">
            <p>{offerAppliesToLabel(form)}</p>
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
