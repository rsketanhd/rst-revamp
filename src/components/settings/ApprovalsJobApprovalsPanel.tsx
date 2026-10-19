import { useMemo, useState } from 'react'
import { CircleHelp, Pencil, Trash2 } from 'lucide-react'
import { Button, ConfirmDeleteModal, Switch, toast } from '../ui'
import { cn } from '../../lib/cn'
import { SettingsBlock, SettingsPanel } from './SettingsPanel'
import {
  appliesToLabel,
  chainLabel,
  emptyJobApprovalRuleForm,
  JobApprovalRulePanel,
  stepLabels,
  type JobApprovalRuleForm,
  type JobStepId,
} from './JobApprovalRulePanel'

type JobApprovalRule = {
  id: string
  enabled: boolean
  inUseCount: number
  form: JobApprovalRuleForm
}

const INITIAL_STEPS: Array<{
  id: JobStepId
  title: string
  description: string
  enabled: boolean
}> = [
  {
    id: 'draft-to-active',
    title: 'Draft → Active · Activating a draft',
    description:
      "When on, a job stays in Draft until it's approved. Active jobs are open to recruiters; whether they're on the careers page is the next step.",
    enabled: true,
  },
  {
    id: 'active-to-careers',
    title: 'Active → On careers page · Putting an active job on the careers page',
    description:
      "When on, switching 'Visible on Career Page' on for an Active job waits for approval; the job stays Active, off the careers page, meanwhile.",
    enabled: false,
  },
  {
    id: 'reactivate',
    title: 'Expired / Closed → Active · Re-activating a job',
    description:
      "When on, an Expired or Closed job stays as it is until it's approved, then becomes Active again. If it should be on the careers page, that follows as its own step.",
    enabled: true,
  },
]

function seedRule(
  id: string,
  name: string,
  formPatch: Partial<JobApprovalRuleForm>,
  inUseCount: number,
): JobApprovalRule {
  return {
    id,
    enabled: true,
    inUseCount,
    form: {
      ...emptyJobApprovalRuleForm(),
      name,
      ...formPatch,
    },
  }
}

const INITIAL_RULES: JobApprovalRule[] = [
  seedRule(
    'rule-1',
    'Rule 1',
    {
      stepIds: ['draft-to-active'],
      allJobs: false,
      appliesTo: 'Country is India',
      levels: [
        {
          id: 'level-1-rule-1',
          mode: 'any-one',
          roles: {
            collaborator: false,
            recruiter: false,
            superUser: true,
          },
          namedUsers: [],
          escalateAfterDays: '',
          escalateTo: 'none',
        },
      ],
    },
    1,
  ),
  seedRule(
    'rule-2',
    'Rule 2',
    {
      stepIds: ['draft-to-active'],
      allJobs: false,
      appliesTo: 'Country is United States',
      levels: [
        {
          id: 'level-1-rule-2',
          mode: 'any-one',
          roles: {
            collaborator: false,
            recruiter: false,
            superUser: false,
          },
          namedUsers: ['ketan'],
          escalateAfterDays: '',
          escalateTo: 'none',
        },
      ],
    },
    2,
  ),
]

type RecruiterRow = {
  action: string
  needsApproval: boolean
  untilApproved: string
}

type RuleEditor =
  | { mode: 'add' }
  | { mode: 'edit'; ruleId: string; form: JobApprovalRuleForm }

/**
 * Settings → Module Configuration → Approvals → Job Approvals.
 */
export function ApprovalsJobApprovalsPanel() {
  const [steps, setSteps] = useState(INITIAL_STEPS)
  const [rules, setRules] = useState(INITIAL_RULES)
  const [pendingDelete, setPendingDelete] = useState<JobApprovalRule | null>(
    null,
  )
  const [editor, setEditor] = useState<RuleEditor | null>(null)

  const stepEnabled = useMemo(() => {
    const map = Object.fromEntries(
      steps.map((step) => [step.id, step.enabled]),
    ) as Record<JobStepId, boolean>
    return map
  }, [steps])

  const ruleCountByStep = useMemo(() => {
    const counts: Record<JobStepId, number> = {
      'draft-to-active': 0,
      'active-to-careers': 0,
      reactivate: 0,
    }
    for (const rule of rules) {
      if (!rule.enabled) continue
      for (const stepId of rule.form.stepIds) {
        counts[stepId] += 1
      }
    }
    return counts
  }, [rules])

  const recruiterRows = useMemo((): RecruiterRow[] => {
    const draft = stepEnabled['draft-to-active']
    const careers = stepEnabled['active-to-careers']
    const reactivate = stepEnabled.reactivate

    return [
      {
        action: 'Activate a draft',
        needsApproval: draft,
        untilApproved: draft
          ? 'Stays Draft until approved, then Active'
          : 'Becomes Active at once',
      },
      {
        action: 'Put an active job on the careers page',
        needsApproval: careers,
        untilApproved: careers
          ? 'Stays Active, off the careers page, until approved'
          : 'On the careers page at once',
      },
      {
        action: 'Activate a draft with “Visible on Career Page” on',
        needsApproval: draft || careers,
        untilApproved: draft
          ? careers
            ? 'Stays Draft until approved, then Active; careers page waits as its own step'
            : 'Stays Draft until approved, then Active and on the careers page'
          : careers
            ? 'Becomes Active at once; careers page waits for approval'
            : 'Becomes Active and on the careers page at once',
      },
      {
        action: 'Re-activate an Expired or Closed job',
        needsApproval: reactivate,
        untilApproved: reactivate
          ? 'Stays Expired / Closed until approved, then Active (the careers page follows as its own step)'
          : 'Becomes Active at once (the careers page follows as its own step)',
      },
    ]
  }, [stepEnabled])

  function setStepEnabled(id: JobStepId, enabled: boolean) {
    setSteps((current) =>
      current.map((step) => (step.id === id ? { ...step, enabled } : step)),
    )
  }

  function setRuleEnabled(id: string, enabled: boolean) {
    setRules((current) =>
      current.map((rule) => (rule.id === id ? { ...rule, enabled } : rule)),
    )
  }

  function confirmDelete() {
    if (!pendingDelete) return
    setRules((current) =>
      current.filter((rule) => rule.id !== pendingDelete.id),
    )
    toast.success(`“${pendingDelete.form.name}” was deleted.`, {
      title: 'Job Approvals',
    })
    setPendingDelete(null)
  }

  function handleSaveRule(form: JobApprovalRuleForm) {
    if (editor?.mode === 'edit') {
      setRules((current) =>
        current.map((rule) =>
          rule.id === editor.ruleId ? { ...rule, form } : rule,
        ),
      )
      toast.success(`“${form.name}” was updated.`, { title: 'Job Approvals' })
      return
    }

    const next: JobApprovalRule = {
      id: `rule-${Date.now()}`,
      enabled: true,
      inUseCount: 0,
      form,
    }
    setRules((current) => [...current, next])
    toast.success(`“${form.name}” was added.`, { title: 'Job Approvals' })
  }

  return (
    <SettingsPanel
      eyebrow="Approvals"
      title="Job Approvals"
      description="Which job status changes need approval, what recruiters see, and the rules that pick the approvers."
    >
      <div
        role="status"
        className="flex items-start gap-2.5 rounded-[8px] border border-[#C9D8F5] bg-[#EAF1FE] px-4 py-3 text-xs leading-relaxed text-[#2F5AA8]"
      >
        <CircleHelp
          className="mt-0.5 size-3.5 shrink-0"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <p>
          Changes apply to jobs submitted from now on. Jobs already waiting for
          approval keep the rule and approvers they were submitted with.
        </p>
      </div>

      <SettingsBlock
        title="Which steps need approval"
        description="Switch each step on or off. A job waiting for approval keeps its status until every level approves. Approvers decide in View Job: approve, request changes or reject."
      >
        <ul className="flex flex-col">
          {steps.map((step) => {
            const ruleCount = ruleCountByStep[step.id]
            return (
              <li
                key={step.id}
                className="flex items-start justify-between gap-4 border-b border-dashed border-[#E4E1EE] py-3.5 first:pt-0 last:border-b-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#2D2061]">
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
                    {step.description}{' '}
                    <span className="font-medium text-[#6B6B80]">
                      {ruleCount} rule(s) apply.
                    </span>
                  </p>
                </div>
                <Switch
                  checked={step.enabled}
                  onCheckedChange={(checked) =>
                    setStepEnabled(step.id, checked)
                  }
                  aria-label={step.title}
                  className="!gap-0 shrink-0"
                />
              </li>
            )
          })}
        </ul>
      </SettingsBlock>

      <SettingsBlock
        title="What recruiters see"
        description={
          <>
            On Review, Create &amp; Activate and Activate Job turn into
            &quot;Submit for approval&quot; when a rule applies, and the
            approvers are shown before anything is sent.
          </>
        }
      >
        <div className="overflow-x-auto">
          <div className="min-w-[32rem]">
            <div className="grid grid-cols-[minmax(0,1.2fr)_6.5rem_minmax(0,1.4fr)] gap-3 border-b border-[#E4E1EE] pb-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8B8B9E]">
                Recruiter action
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8B8B9E]">
                Approval
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8B8B9E]">
                Until it&apos;s approved
              </p>
            </div>
            <ul className="flex flex-col">
              {recruiterRows.map((row) => (
                <li
                  key={row.action}
                  className="grid grid-cols-[minmax(0,1.2fr)_6.5rem_minmax(0,1.4fr)] gap-3 border-b border-dashed border-[#E4E1EE] py-3 last:border-b-0 last:pb-0"
                >
                  <p className="text-sm text-[#2D2061]">{row.action}</p>
                  <p
                    className={cn(
                      'text-sm font-semibold',
                      row.needsApproval
                        ? 'text-[#2D2061]'
                        : 'text-[#8B8B9E]',
                    )}
                  >
                    {row.needsApproval ? 'APPROVAL' : '—'}
                  </p>
                  <p className="text-sm leading-relaxed text-[#6B6B80]">
                    {row.untilApproved}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SettingsBlock>

      <SettingsBlock
        title="Approval rules"
        description={
          <>
            Conditions use the fields from Create New Job. The most specific
            matching rule applies (most satisfied conditions); ties go to the
            most recently updated. &quot;All jobs&quot; is the fallback. When no
            rule matches, the job changes status straight away.
          </>
        }
        trailing={
          <Button
            type="button"
            variant="outline"
            onClick={() => setEditor({ mode: 'add' })}
            className="shrink-0 !h-9 !rounded-md !border-[#2D2061] !px-3.5 !text-[#2D2061] hover:!bg-white"
          >
            Add rule
          </Button>
        }
      >
        {rules.length === 0 ? (
          <p className="rounded-[8px] border border-[#E4E1EE] bg-white px-4 py-8 text-center text-sm text-[#8B8B9E]">
            No rules yet — when a step is on and no rule matches, the job
            changes status straight away.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {rules.map((rule) => (
              <li
                key={rule.id}
                className="rounded-[8px] border border-[#E4E1EE] bg-white px-4 py-3.5 sm:px-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#2D2061]">
                    {rule.form.name}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label={`Edit ${rule.form.name}`}
                      onClick={() =>
                        setEditor({
                          mode: 'edit',
                          ruleId: rule.id,
                          form: rule.form,
                        })
                      }
                      className="inline-flex size-8 items-center justify-center rounded-[8px] text-[#6B6B80] transition-colors hover:bg-[#F5F4FA] hover:text-[#2D2061]"
                    >
                      <Pencil
                        className="size-4"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${rule.form.name}`}
                      onClick={() => setPendingDelete(rule)}
                      className="inline-flex size-8 items-center justify-center rounded-[8px] text-[#6B6B80] transition-colors hover:bg-[#F5F4FA] hover:text-[#C44B4B]"
                    >
                      <Trash2
                        className="size-4"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </button>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={(checked) =>
                        setRuleEnabled(rule.id, checked)
                      }
                      aria-label={`${rule.form.name} enabled`}
                      className="!gap-0"
                    />
                  </div>
                </div>

                <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-x-3 sm:gap-y-1.5">
                  <RuleField
                    label="Steps"
                    value={stepLabels(rule.form.stepIds) || '—'}
                  />
                  <RuleField
                    label="Applies to"
                    value={appliesToLabel(rule.form)}
                  />
                  <RuleField label="Chain" value={chainLabel(rule.form)} />
                  <RuleField
                    label="In use"
                    value={
                      rule.inUseCount === 1
                        ? '1 job waiting for approval under this rule'
                        : `${rule.inUseCount} jobs waiting for approval under this rule`
                    }
                  />
                </dl>
              </li>
            ))}
          </ul>
        )}
      </SettingsBlock>

      <JobApprovalRulePanel
        open={Boolean(editor)}
        initial={editor?.mode === 'edit' ? editor.form : null}
        onClose={() => setEditor(null)}
        onSave={handleSaveRule}
      />

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title="Delete Rule"
        itemName={pendingDelete?.form.name}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </SettingsPanel>
  )
}

function RuleField({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-xs font-medium text-[#8B8B9E]">{label}</dt>
      <dd className="text-sm text-[#2D2061]">{value}</dd>
    </>
  )
}
