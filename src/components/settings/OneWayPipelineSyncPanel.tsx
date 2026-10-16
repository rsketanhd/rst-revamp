import { useState, type ReactNode } from 'react'
import { Check, CircleHelp, X, Zap } from 'lucide-react'
import {
  Button,
  Checkbox,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableTd,
  DataTableTh,
  Select,
  Switch,
  toast,
} from '../ui'
import { cn } from '../../lib/cn'
import { OneWaySettingsShell } from './OneWaySettingsChrome'

type BadgeColor = 'green' | 'amber' | 'grey' | 'red'

type SyncRuleId =
  | 'invited'
  | 'started'
  | 'completed'
  | 'incomplete-or-expired'
  | 'cancelled'

type MoveTarget =
  | 'none'
  | 'assessment'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected'
  | 'declined'
  | 'previous'

type AnyoneElse = 'block' | 'allow-reason'

type SyncRule = {
  id: SyncRuleId
  code: string
  description: string
  badge: BadgeColor
  moveOn: boolean
  moveTo: MoveTarget
}

type PipelineSyncState = {
  rules: SyncRule[]
  neverMoveBackwards: boolean
  leaveClosedAlone: boolean
  allowedStages: string[]
  anyoneElse: AnyoneElse
}

const TOAST_TITLE = 'Pipeline Sync'

const SECTION_CLASS = 'rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6'

const TH =
  '!h-auto !py-2.5 !text-[11px] !font-bold !tracking-[0.04em] !text-[#6B6B80] uppercase'

const BADGE_TAG_CLASS: Record<BadgeColor, string> = {
  green: 'bg-[#DCFCE7] text-[#15803D]',
  amber: 'bg-[#FEF3C7] text-[#B45309]',
  grey: 'bg-[#F0EFF4] text-[#6B6B80]',
  red: 'bg-[#FEE2E2] text-[#B91C1C]',
}

const MOVE_TARGET_OPTIONS: Array<{ value: MoveTarget; label: string }> = [
  { value: 'assessment', label: 'Assessment - any status' },
  { value: 'interview', label: 'Interview - any status' },
  { value: 'offer', label: 'Offer - any status' },
  { value: 'hired', label: 'Hired (closed)' },
  { value: 'rejected', label: 'Rejected (closed)' },
  { value: 'declined', label: 'Declined (closed)' },
  { value: 'previous', label: 'Previous stage' },
]

const PIPELINE_STAGE_OPTIONS = [
  { value: 'pre-screening', label: 'Pre-Screening - any status' },
  { value: 'screening', label: 'Screening - any status' },
  { value: 'assessment', label: 'Assessment - any status' },
  { value: 'interview', label: 'Interview - any status' },
  { value: 'offer', label: 'Offer - any status' },
  { value: 'hired', label: 'Hired - any status' },
  { value: 'rejected', label: 'Rejected - any status' },
  { value: 'declined', label: 'Declined - any status' },
]

const ALL_STAGE_VALUES = PIPELINE_STAGE_OPTIONS.map((option) => option.value)

const EARLIER_STAGE_IDS = [
  'pre-screening',
  'screening',
  'assessment',
  'interview',
]

const INITIAL_SYNC_RULES: SyncRule[] = [
  {
    id: 'invited',
    code: 'INVITED',
    description: 'Invite sent to the candidate.',
    badge: 'green',
    moveOn: false,
    moveTo: 'none',
  },
  {
    id: 'started',
    code: 'STARTED',
    description: 'Candidate began answering.',
    badge: 'amber',
    moveOn: false,
    moveTo: 'none',
  },
  {
    id: 'completed',
    code: 'COMPLETED',
    description: 'All answers submitted.',
    badge: 'green',
    moveOn: false,
    moveTo: 'none',
  },
  {
    id: 'incomplete-or-expired',
    code: 'INCOMPLETE OR EXPIRED',
    description: 'Ended without a submission.',
    badge: 'grey',
    moveOn: false,
    moveTo: 'none',
  },
  {
    id: 'cancelled',
    code: 'CANCELLED',
    description: 'You cancelled the invite.',
    badge: 'red',
    moveOn: false,
    moveTo: 'none',
  },
]

function cloneRules(rules: SyncRule[]): SyncRule[] {
  return rules.map((rule) => ({ ...rule }))
}

function createInitialState(): PipelineSyncState {
  return {
    rules: cloneRules(INITIAL_SYNC_RULES),
    neverMoveBackwards: true,
    leaveClosedAlone: true,
    allowedStages: [...ALL_STAGE_VALUES],
    anyoneElse: 'block',
  }
}

function cloneState(state: PipelineSyncState): PipelineSyncState {
  return {
    ...state,
    rules: cloneRules(state.rules),
    allowedStages: [...state.allowedStages],
  }
}

function defaultMoveTarget(id: SyncRuleId): MoveTarget {
  switch (id) {
    case 'completed':
      return 'interview'
    case 'incomplete-or-expired':
    case 'cancelled':
      return 'previous'
    case 'invited':
    case 'started':
      return 'assessment'
    default: {
      const _exhaustive: never = id
      return _exhaustive
    }
  }
}

function buildPipelineChecks(
  rules: SyncRule[],
  allowedStages: string[],
): string[] {
  const checks: string[] = []

  if (allowedStages.length === 0) {
    checks.push('Add at least one allowed stage for who can be invited.')
  }

  const onWithoutTarget = rules.filter(
    (rule) => rule.moveOn && (rule.moveTo === 'none' || !rule.moveTo),
  )
  if (onWithoutTarget.length > 0) {
    checks.push(
      `${onWithoutTarget.map((rule) => rule.code).join(', ')} need a pipeline destination.`,
    )
  }

  return checks
}

/**
 * Settings → Module Configuration → 1 Way Interview → Pipeline Sync.
 */
export function OneWayPipelineSyncPanel() {
  const [draft, setDraft] = useState(createInitialState)
  const [saved, setSaved] = useState(createInitialState)
  const [stageToAdd, setStageToAdd] = useState('')

  const {
    rules,
    neverMoveBackwards,
    leaveClosedAlone,
    allowedStages,
    anyoneElse,
  } = draft

  const movingCount = rules.filter((rule) => rule.moveOn).length
  const availableToAdd = PIPELINE_STAGE_OPTIONS.filter(
    (option) => !allowedStages.includes(option.value),
  )
  const checks = buildPipelineChecks(rules, allowedStages)

  function updateRules(updater: (rules: SyncRule[]) => SyncRule[]) {
    setDraft((current) => ({ ...current, rules: updater(current.rules) }))
  }

  function handleToggleMove(id: SyncRuleId, moveOn: boolean) {
    updateRules((current) =>
      current.map((rule) => {
        if (rule.id !== id) return rule
        if (!moveOn) return { ...rule, moveOn: false, moveTo: 'none' }
        const moveTo =
          rule.moveTo !== 'none' ? rule.moveTo : defaultMoveTarget(rule.id)
        return { ...rule, moveOn: true, moveTo }
      }),
    )
  }

  function handleMoveTo(id: SyncRuleId, moveTo: MoveTarget) {
    updateRules((current) =>
      current.map((rule) => (rule.id === id ? { ...rule, moveTo } : rule)),
    )
  }

  function handleDiscard() {
    setDraft(cloneState(saved))
    setStageToAdd('')
    toast.success('Unsaved pipeline sync changes discarded.', {
      title: TOAST_TITLE,
    })
  }

  function handleSave() {
    if (checks.length > 0) {
      toast.error('Fix Checks before saving.', { title: TOAST_TITLE })
      return
    }
    setSaved(cloneState(draft))
    toast.success('Pipeline sync rules saved.', { title: TOAST_TITLE })
  }

  function removeAllowedStage(id: string) {
    setDraft((current) => ({
      ...current,
      allowedStages: current.allowedStages.filter((item) => item !== id),
    }))
  }

  function addAllowedStage() {
    if (!stageToAdd) {
      toast.error('Choose a stage to add.', { title: TOAST_TITLE })
      return
    }
    setDraft((current) => ({
      ...current,
      allowedStages: current.allowedStages.includes(stageToAdd)
        ? current.allowedStages
        : [...current.allowedStages, stageToAdd],
    }))
    setStageToAdd('')
  }

  function addEarlierStages() {
    setDraft((current) => {
      const next = [...current.allowedStages]
      for (const id of EARLIER_STAGE_IDS) {
        if (!next.includes(id)) next.push(id)
      }
      return { ...current, allowedStages: next }
    })
    toast.success('Earlier stages added to Allowed stages.', {
      title: TOAST_TITLE,
    })
  }

  return (
    <OneWaySettingsShell
      title="Pipeline Sync"
      description="Where candidates move in the job pipeline as their one-way interview progresses, and who can be invited."
    >
      <section className={SECTION_CLASS}>
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <p className="max-w-2xl text-sm leading-relaxed text-[#6B6B80]">
            Move the candidate in the job pipeline when a one-way interview
            changes status, and choose which candidates can be invited.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[#E6F6EC] px-2.5 py-1 text-[11px] font-semibold text-[#15803D]">
              Built-in rules
            </span>
            <Button
              type="button"
              variant="outline"
              onClick={handleDiscard}
              className="!h-9 !rounded-[8px] !border-[#D5D2E2] !px-3.5 !text-[#2D2061] hover:!bg-white"
            >
              Discard
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="!h-9 !rounded-[8px] !bg-[#2D2061] !px-4 text-sm font-semibold text-white hover:!bg-[#241a52]"
            >
              Save
            </Button>
          </div>
        </div>

        <ul className="space-y-2 text-xs leading-relaxed text-[#2F5AA8]">
          <HelpNote>
            These are the rules that apply today. They change only when you save
            this page.
          </HelpNote>
          <HelpNote>
            Stages and statuses come from your pipeline workflow in{' '}
            <span className="font-semibold">Settings → Pipeline Workflows</span>
            . If a stage used here is removed there, the rule is flagged under
            Checks.
          </HelpNote>
        </ul>
      </section>

      <section className={SECTION_CLASS}>
        <SectionHeading
          title="Move the candidate"
          trailing={`${movingCount} of ${rules.length} statuses move the candidate`}
          className="mb-3"
        />

        <div
          role="note"
          className="mb-4 flex flex-wrap items-start gap-2 rounded-[8px] border border-[#E4DDF5] bg-[#F3F0FF] px-3.5 py-3 text-xs leading-relaxed text-[#4C3D8A]"
        >
          <Zap
            className="mt-0.5 size-3.5 shrink-0"
            strokeWidth={2}
            aria-hidden="true"
          />
          <p className="min-w-0 flex-1">
            When a rule is <span className="font-semibold">On</span>, the
            candidate moves automatically as soon as the status changes.{' '}
            <span className="font-semibold">Off</span> means no pipeline change.{' '}
            <button
              type="button"
              className="font-semibold underline underline-offset-2"
              onClick={() =>
                toast.success(
                  'Recruiters see automatic moves in the candidate Journey when a one-way interview status changes.',
                  { title: 'What recruiters see' },
                )
              }
            >
              See what recruiters see
            </button>
            .
          </p>
        </div>

        <div className="overflow-hidden rounded-[8px] border border-[#E4E1EE] bg-white">
          <DataTable minWidthClassName="min-w-[48rem]">
            <DataTableHead className="!border-[#C9C6D6]">
              <DataTableTh className={cn(TH, 'pl-4')}>
                When interview status becomes
              </DataTableTh>
              <DataTableTh className={cn(TH, 'w-44 text-center')}>
                Move automatically
              </DataTableTh>
              <DataTableTh className={cn(TH, 'pr-4')}>
                Move candidate to
              </DataTableTh>
            </DataTableHead>
            <DataTableBody>
              {rules.map((rule) => (
                <SyncRuleRow
                  key={rule.id}
                  rule={rule}
                  onToggle={(moveOn) => handleToggleMove(rule.id, moveOn)}
                  onMoveTo={(moveTo) => handleMoveTo(rule.id, moveTo)}
                />
              ))}
            </DataTableBody>
          </DataTable>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <PolicyCheckbox
            id="one-way-never-move-backwards"
            checked={neverMoveBackwards}
            onChange={(checked) =>
              setDraft((current) => ({
                ...current,
                neverMoveBackwards: checked,
              }))
            }
            title="Never move a candidate backwards"
            description="Skips a move to an earlier stage. Rules set to Previous stage still apply."
          />
          <PolicyCheckbox
            id="one-way-leave-closed-alone"
            checked={leaveClosedAlone}
            onChange={(checked) =>
              setDraft((current) => ({
                ...current,
                leaveClosedAlone: checked,
              }))
            }
            title="Leave closed candidates alone"
            description="Candidates in a closed stage (Hired, Rejected, Declined) are not moved."
          />
        </div>
      </section>

      <section className={SECTION_CLASS}>
        <SectionHeading
          title="Who can be invited"
          trailing="Checked for single and bulk invites"
          className="mb-4"
        />

        <div>
          <p className="mb-1 text-sm font-semibold text-[#2D2061]">
            Allowed stages
          </p>
          <p className="mb-2 text-xs text-[#8B8B9E]">
            The candidate must be in one of these
          </p>
          <div className="flex flex-wrap gap-2">
            {allowedStages.map((stageId) => {
              const option = PIPELINE_STAGE_OPTIONS.find(
                (item) => item.value === stageId,
              )
              if (!option) return null
              return (
                <span
                  key={stageId}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#DDD6F3] bg-[#F3F0FF] px-2.5 py-1 text-xs font-medium text-[#4C3D8A]"
                >
                  {option.label}
                  <button
                    type="button"
                    aria-label={`Remove ${option.label}`}
                    onClick={() => removeAllowedStage(stageId)}
                    className="text-[#8B8B9E] hover:text-[#2D2061]"
                  >
                    <X className="size-3" strokeWidth={2.5} />
                  </button>
                </span>
              )
            })}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="min-w-[14rem] flex-1 sm:max-w-xs">
              <Select
                id="one-way-add-allowed-stage"
                label=""
                options={[
                  { value: '', label: 'Add a stage and status...' },
                  ...availableToAdd,
                ]}
                value={stageToAdd}
                onChange={(event) => setStageToAdd(event.target.value)}
                aria-label="Add a stage and status"
                disabled={availableToAdd.length === 0}
              />
            </div>
            <Button
              type="button"
              onClick={addAllowedStage}
              disabled={availableToAdd.length === 0}
              className="!h-10 !rounded-[8px] !bg-[#2D2061] !px-4 text-sm font-semibold text-white hover:!bg-[#241a52] disabled:!opacity-50"
            >
              Add
            </Button>
            <button
              type="button"
              onClick={addEarlierStages}
              className="text-sm font-semibold text-[#2D2061] underline underline-offset-2"
            >
              All earlier stages
            </button>
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-[#2D2061]">Anyone else</p>
          <div
            className="flex flex-wrap items-center gap-5"
            role="radiogroup"
            aria-label="Anyone else"
          >
            <RadioOption
              name="one-way-anyone-else"
              checked={anyoneElse === 'block'}
              onChange={() =>
                setDraft((current) => ({ ...current, anyoneElse: 'block' }))
              }
              label="Block"
            />
            <RadioOption
              name="one-way-anyone-else"
              checked={anyoneElse === 'allow-reason'}
              onChange={() =>
                setDraft((current) => ({
                  ...current,
                  anyoneElse: 'allow-reason',
                }))
              }
              label="Allow with a reason"
            />
          </div>
          <p className="mt-1.5 text-xs text-[#8B8B9E]">
            {anyoneElse === 'block'
              ? 'The button is disabled and says which stages qualify.'
              : 'Recruiters can continue after entering a reason.'}
          </p>
        </div>

        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-[#2F5AA8]">
          <CircleHelp
            className="mt-0.5 size-3.5 shrink-0"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <span>
            Bulk invites skip candidates who don&apos;t qualify and list them
            before sending.
          </span>
        </p>
      </section>

      <section className={SECTION_CLASS}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-[#2D2061]">Checks</h3>
          <span
            className={cn(
              'inline-flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-bold',
              checks.length === 0
                ? 'bg-[#E8E7EE] text-[#6B6B80]'
                : 'bg-[#FEE2E2] text-[#B91C1C]',
            )}
          >
            {checks.length}
          </span>
        </div>
        {checks.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-[#15803D]">
            <Check className="size-4" strokeWidth={2.5} aria-hidden="true" />
            No problems found with these rules.
          </div>
        ) : (
          <ul className="space-y-1.5 text-sm text-[#B91C1C]">
            {checks.map((check) => (
              <li key={check}>{check}</li>
            ))}
          </ul>
        )}

        <ul className="mt-5 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-[#8B8B9E]">
          <li>
            Saving applies to new interview events only. Candidates already in
            the pipeline stay where they are.
          </li>
          <li>
            Every move is recorded in the candidate&apos;s Journey as an
            automatic move by the one-way interview.
          </li>
          <li>
            Reminders, re-sends and next-round invites don&apos;t move the
            candidate and aren&apos;t checked against Who can be invited.
          </li>
        </ul>
      </section>
    </OneWaySettingsShell>
  )
}

function SectionHeading({
  title,
  trailing,
  className = 'mb-3',
}: {
  title: string
  trailing: string
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-2', className)}>
      <h3 className="text-sm font-bold text-[#2D2061]">{title}</h3>
      <p className="text-xs font-medium text-[#8B8B9E]">{trailing}</p>
    </div>
  )
}

function HelpNote({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <CircleHelp
        className="mt-0.5 size-3.5 shrink-0"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <span>{children}</span>
    </li>
  )
}

function PolicyCheckbox({
  id,
  checked,
  onChange,
  title,
  description,
}: {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  title: string
  description: string
}) {
  return (
    <Checkbox
      id={id}
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      label={
        <span>
          <span className="font-semibold text-[#2D2061]">{title}</span>
          <span className="mt-0.5 block text-xs font-normal text-[#8B8B9E]">
            {description}
          </span>
        </span>
      }
    />
  )
}

function SyncRuleRow({
  rule,
  onToggle,
  onMoveTo,
}: {
  rule: SyncRule
  onToggle: (moveOn: boolean) => void
  onMoveTo: (moveTo: MoveTarget) => void
}) {
  return (
    <DataTableRow className="border-b border-[#EEEDF3]">
      <DataTableTd className="!py-3.5 pl-4 !whitespace-normal">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              'mt-0.5 inline-flex shrink-0 rounded-md px-2 py-1 text-[10px] font-bold tracking-[0.04em] uppercase',
              BADGE_TAG_CLASS[rule.badge],
            )}
          >
            {rule.code}
          </span>
          <p className="text-sm text-[#6B6B80]">{rule.description}</p>
        </div>
      </DataTableTd>
      <DataTableTd className="!py-3.5 text-center">
        <div className="inline-flex items-center justify-center gap-2">
          <Switch
            checked={rule.moveOn}
            onCheckedChange={onToggle}
            aria-label={`Move automatically for ${rule.code}`}
            className="!gap-0"
          />
          <span className="text-xs font-medium text-[#8B8B9E]">
            {rule.moveOn ? 'On' : 'Off'}
          </span>
        </div>
      </DataTableTd>
      <DataTableTd className="!py-3.5 pr-4">
        {rule.moveOn ? (
          <div className="w-full max-w-xs">
            <Select
              id={`one-way-move-to-${rule.id}`}
              label=""
              options={MOVE_TARGET_OPTIONS}
              value={rule.moveTo === 'none' ? 'assessment' : rule.moveTo}
              onChange={(event) =>
                onMoveTo(event.target.value as MoveTarget)
              }
              aria-label={`Move candidate to for ${rule.code}`}
              className="!h-9 !rounded-[8px]"
            />
          </div>
        ) : (
          <span className="text-sm text-[#8B8B9E]">No pipeline change</span>
        )}
      </DataTableTd>
    </DataTableRow>
  )
}

function RadioOption({
  name,
  checked,
  onChange,
  label,
}: {
  name: string
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-[#2D2061]">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={cn(
          'flex size-4 shrink-0 items-center justify-center rounded-full border',
          checked
            ? 'border-[#2D2061] bg-[#2D2061]'
            : 'border-[#C8C5D6] bg-white',
        )}
        aria-hidden="true"
      >
        {checked ? <span className="size-1.5 rounded-full bg-white" /> : null}
      </span>
      {label}
    </label>
  )
}
