import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleX,
  X,
} from 'lucide-react'
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
  toast,
} from '../ui'
import { cn } from '../../lib/cn'
import { SettingsPanel } from './SettingsPanel'
import { SettingsUnderlineTabs } from './SettingsUnderlineTabs'

/* -------------------------------------------------------------------------- */
/* Workflow model                                                             */
/* -------------------------------------------------------------------------- */

type WorkflowItem = {
  id: string
  name: string
  active: boolean
  /** Protected items (e.g. the "Open" status) can't be deleted */
  locked?: boolean
}

type Workflow = {
  stages: WorkflowItem[]
  statuses: WorkflowItem[]
  /** stageId → statuses a candidate can carry in that stage */
  statusesPerStage: Record<string, string[]>
  /** stageId → stages a candidate can move to */
  stageMoves: Record<string, string[]>
  /** Strict pipeline mode: candidates may only move forward (to later stages) */
  strictStageMoves: boolean
  /** statusId → statuses a candidate can move to */
  statusMoves: Record<string, string[]>
}

const item = (id: string, name: string, locked = false): WorkflowItem => ({
  id,
  name,
  active: true,
  locked,
})

const ALL_STATUSES = [
  'open',
  'shortlisted',
  'on-hold',
  'rejected',
  'withdrawn',
  'declined',
  'hired',
]

const ALL_STAGES = [
  'pre-screening',
  'screening',
  'assessment',
  'interview',
  'offer',
  'hired',
  'rejected',
  'declined',
]

/** Every other stage, minus the blocked ones. */
function movesExcept(stageId: string, blocked: string[] = []) {
  return ALL_STAGES.filter((id) => id !== stageId && !blocked.includes(id))
}

/** Every other status, minus the blocked ones. */
function statusMovesExcept(statusId: string, blocked: string[] = []) {
  return ALL_STATUSES.filter((id) => id !== statusId && !blocked.includes(id))
}

const INITIAL_WORKFLOW: Workflow = {
  stages: [
    item('pre-screening', 'Pre-Screening'),
    item('screening', 'Screening'),
    item('assessment', 'Assessment'),
    item('interview', 'Interview'),
    item('offer', 'Offer'),
    item('hired', 'Hired'),
    item('rejected', 'Rejected'),
    item('declined', 'Declined'),
  ],
  statuses: [
    item('open', 'Open', true),
    item('shortlisted', 'Shortlisted'),
    item('on-hold', 'On Hold'),
    item('rejected', 'Rejected'),
    item('withdrawn', 'Withdrawn'),
    item('declined', 'Declined'),
    item('hired', 'Hired'),
  ],
  statusesPerStage: {
    'pre-screening': ['open', 'shortlisted', 'on-hold'],
    screening: ALL_STATUSES,
    assessment: ALL_STATUSES,
    interview: ALL_STATUSES,
    offer: ALL_STATUSES,
    hired: ['hired'],
    rejected: ['rejected'],
    declined: ['declined'],
  },
  stageMoves: {
    'pre-screening': movesExcept('pre-screening'),
    screening: movesExcept('screening'),
    assessment: movesExcept('assessment'),
    interview: movesExcept('interview', ['pre-screening', 'screening', 'hired']),
    offer: movesExcept('offer'),
    hired: movesExcept('hired'),
    rejected: movesExcept('rejected'),
    declined: movesExcept('declined'),
  },
  strictStageMoves: false,
  statusMoves: {
    open: statusMovesExcept('open', ['declined', 'hired']),
    shortlisted: statusMovesExcept('shortlisted'),
    'on-hold': statusMovesExcept('on-hold'),
    rejected: statusMovesExcept('rejected'),
    withdrawn: statusMovesExcept('withdrawn'),
    declined: statusMovesExcept('declined'),
    hired: statusMovesExcept('hired'),
  },
}

type ListKey = 'stages' | 'statuses'
type MapKey = 'statusesPerStage' | 'stageMoves' | 'statusMoves'
type TabId = 'stages-statuses' | 'statuses-per-stage' | 'stage-moves' | 'status-moves'

const slug = (name: string) =>
  `${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`

/** Stage moves actually allowed from a stage, after strict mode is applied. */
function allowedStageMoves(w: Workflow, fromId: string): string[] {
  const moves = w.stageMoves[fromId] ?? []
  if (!w.strictStageMoves) return moves
  const order = w.stages.map((st) => st.id)
  const from = order.indexOf(fromId)
  return moves.filter((id) => order.indexOf(id) > from)
}

/** Removes an id from a rule map — both as a key and inside every list. */
function dropFromMap(map: Record<string, string[]>, id: string) {
  const next: Record<string, string[]> = {}
  for (const [key, ids] of Object.entries(map)) {
    if (key !== id) next[key] = ids.filter((x) => x !== id)
  }
  return next
}

/* -------------------------------------------------------------------------- */
/* Panel                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Settings → Module Configuration → Jobs → Pipeline.
 * Stages, statuses, and which moves recruiters are allowed to make.
 */
export function JobsPipelinePanel() {
  const [saved, setSaved] = useState<Workflow>(INITIAL_WORKFLOW)
  const [draft, setDraft] = useState<Workflow>(INITIAL_WORKFLOW)
  const [tab, setTab] = useState<TabId>('stages-statuses')
  const dirty = draft !== saved

  /* ----- list editing (stages / statuses) ----- */

  function patchItem(list: ListKey, id: string, patch: Partial<WorkflowItem>) {
    setDraft((w) => ({
      ...w,
      [list]: w[list].map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }))
  }

  function moveItem(list: ListKey, id: string, offset: -1 | 1) {
    setDraft((w) => {
      const items = [...w[list]]
      const from = items.findIndex((it) => it.id === id)
      const to = from + offset
      if (from < 0 || to < 0 || to >= items.length) return w
      ;[items[from], items[to]] = [items[to], items[from]]
      return { ...w, [list]: items }
    })
  }

  function deleteItem(list: ListKey, id: string) {
    setDraft((w) => {
      const next = { ...w, [list]: w[list].filter((it) => it.id !== id) }
      if (list === 'stages') {
        next.statusesPerStage = dropFromMap(w.statusesPerStage, id)
        next.stageMoves = dropFromMap(w.stageMoves, id)
      } else {
        next.statusMoves = dropFromMap(w.statusMoves, id)
        next.statusesPerStage = Object.fromEntries(
          Object.entries(w.statusesPerStage).map(([k, ids]) => [
            k,
            ids.filter((x) => x !== id),
          ]),
        )
      }
      return next
    })
  }

  function addItem(list: ListKey, name: string): boolean {
    const trimmed = name.trim()
    if (!trimmed) return false
    if (draft[list].some((it) => it.name.toLowerCase() === trimmed.toLowerCase())) {
      toast.error(`“${trimmed}” already exists.`, {
        title: list === 'stages' ? 'Stages' : 'Statuses',
      })
      return false
    }
    const id = slug(trimmed)
    setDraft((w) => {
      const next = { ...w, [list]: [...w[list], item(id, trimmed)] }
      if (list === 'stages') {
        next.statusesPerStage = { ...w.statusesPerStage, [id]: ['open'] }
        next.stageMoves = { ...w.stageMoves, [id]: [] }
      } else {
        next.statusMoves = { ...w.statusMoves, [id]: [] }
      }
      return next
    })
    return true
  }

  /* ----- rule maps (checkbox matrices) ----- */

  function toggleRule(map: MapKey, rowId: string, colId: string) {
    setDraft((w) => {
      const current = w[map][rowId] ?? []
      const nextIds = current.includes(colId)
        ? current.filter((x) => x !== colId)
        : [...current, colId]
      return { ...w, [map]: { ...w[map], [rowId]: nextIds } }
    })
  }

  function handleSave() {
    const blank = [...draft.stages, ...draft.statuses].find((it) => !it.name.trim())
    if (blank) {
      toast.error('Every stage and status needs a name.', { title: 'Pipeline' })
      return
    }
    setSaved(draft)
    toast.success('Pipeline workflow saved.', { title: 'Pipeline' })
  }

  function handleDiscard() {
    setDraft(saved)
    toast.success('Changes discarded.', { title: 'Pipeline' })
  }

  const activeStages = draft.stages.filter((s) => s.active)
  const activeStatuses = draft.statuses.filter((s) => s.active)

  return (
    <SettingsPanel
      eyebrow="Jobs"
      title="Pipeline"
      description="Manage your user registration credentials and customize active recruiter daily digest parameters."
    >
      <SettingsUnderlineTabs
        aria-label="Pipeline sections"
        value={tab}
        onChange={setTab}
        options={[
          { value: 'stages-statuses', label: 'Stages and Statuses' },
          { value: 'statuses-per-stage', label: 'Statuses per Stage' },
          { value: 'stage-moves', label: 'Stage Moves' },
          { value: 'status-moves', label: 'Status Moves' },
        ]}
      />

      {tab === 'stage-moves' ? (
        <StageMovesCard
          workflow={draft}
          stages={activeStages}
          onToggle={(fromId, toId) => toggleRule('stageMoves', fromId, toId)}
          onStrictChange={(strictStageMoves) =>
            setDraft((w) => ({ ...w, strictStageMoves }))
          }
        />
      ) : tab === 'statuses-per-stage' ? (
        <StatusesPerStageCard
          stages={activeStages}
          statuses={activeStatuses}
          allowed={draft.statusesPerStage}
          onToggle={(stageId, statusId) =>
            toggleRule('statusesPerStage', stageId, statusId)
          }
          onReset={(stageId) =>
            setDraft((w) => ({
              ...w,
              statusesPerStage: {
                ...w.statusesPerStage,
                [stageId]: w.statuses.map((st) => st.id),
              },
            }))
          }
        />
      ) : tab === 'status-moves' ? (
        <StatusMovesCard
          statuses={activeStatuses}
          moves={draft.statusMoves}
          onToggle={(fromId, toId) => toggleRule('statusMoves', fromId, toId)}
          onReset={(fromId) =>
            setDraft((w) => ({
              ...w,
              statusMoves: {
                ...w.statusMoves,
                [fromId]: w.statuses.map((st) => st.id).filter((id) => id !== fromId),
              },
            }))
          }
        />
      ) : (
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.75fr)]">
          <ItemListCard
            title="Stages"
            description="The columns of your pipeline, in order."
            addPlaceholder="New stage name"
            items={draft.stages}
            onRename={(id, name) => patchItem('stages', id, { name })}
            onToggleActive={(id, active) => patchItem('stages', id, { active })}
            onMove={(id, offset) => moveItem('stages', id, offset)}
            onDelete={(id) => deleteItem('stages', id)}
            onAdd={(name) => addItem('stages', name)}
          />
          <ItemListCard
            title="Statuses"
            description="Labels a candidate can carry."
            addPlaceholder="New status name"
            items={draft.statuses}
            onRename={(id, name) => patchItem('statuses', id, { name })}
            onToggleActive={(id, active) => patchItem('statuses', id, { active })}
            onMove={(id, offset) => moveItem('statuses', id, offset)}
            onDelete={(id) => deleteItem('statuses', id)}
            onAdd={(name) => addItem('statuses', name)}
          />
          <RecruiterDropdownPreview workflow={draft} />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleDiscard}
          disabled={!dirty}
          className="!h-10 !rounded-md border-[#2D2061] bg-white px-4 text-sm font-semibold text-[#2D2061] hover:bg-[#f7f6fb] disabled:opacity-50"
        >
          Discard changes
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          className="!h-10 !rounded-md !bg-[#2D2061] px-4 text-sm font-semibold text-white hover:!bg-[#241a52]"
        >
          Save Workflow
        </Button>
      </div>
    </SettingsPanel>
  )
}

/* -------------------------------------------------------------------------- */
/* Stages / Statuses list                                                     */
/* -------------------------------------------------------------------------- */

const INPUT =
  'h-10 w-full min-w-0 rounded-md border border-[#ddd9e8] bg-white px-3.5 text-sm text-[#1A1A2E] outline-none transition-colors placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10'

function ItemListCard({
  title,
  description,
  addPlaceholder,
  items,
  onRename,
  onToggleActive,
  onMove,
  onDelete,
  onAdd,
}: {
  title: string
  description: string
  addPlaceholder: string
  items: WorkflowItem[]
  onRename: (id: string, name: string) => void
  onToggleActive: (id: string, active: boolean) => void
  onMove: (id: string, offset: -1 | 1) => void
  onDelete: (id: string) => void
  onAdd: (name: string) => boolean
}) {
  const [newName, setNewName] = useState('')

  function submit() {
    if (onAdd(newName)) setNewName('')
  }

  return (
    <section className="rounded-xl border border-[#E4E1EE] bg-white p-5 sm:p-6">
      <h3 className="text-base font-semibold text-[#1A1A2E]">{title}</h3>
      <p className="mt-0.5 text-[13px] text-[#6B6B80]">{description}</p>

      <ol className="mt-5 flex flex-col gap-3">
        {items.map((it, index) => (
          <li key={it.id} className="flex items-center gap-3">
            <input
              value={it.name}
              onChange={(e) => onRename(it.id, e.target.value)}
              aria-label={`${title.slice(0, -1)} ${index + 1} name`}
              className={cn(INPUT, 'flex-1', !it.active && 'text-[#A0A0B2]')}
            />
            <Checkbox
              id={`${title}-${it.id}-active`}
              label={<span className="text-sm text-[#6B6B80]">Active</span>}
              checked={it.active}
              onChange={(e) => onToggleActive(it.id, e.target.checked)}
              className="shrink-0 [&>label]:items-center [&_input]:mt-0"
            />
            <OrderButton
              label={`Move ${it.name} up`}
              disabled={index === 0}
              onClick={() => onMove(it.id, -1)}
            >
              <ArrowUp className="size-3.5" strokeWidth={2.25} />
            </OrderButton>
            <OrderButton
              label={`Move ${it.name} down`}
              disabled={index === items.length - 1}
              onClick={() => onMove(it.id, 1)}
            >
              <ArrowDown className="size-3.5" strokeWidth={2.25} />
            </OrderButton>
            <span className="w-16 shrink-0">
              {it.locked ? null : (
                <button
                  type="button"
                  onClick={() => onDelete(it.id)}
                  className="inline-flex h-8 w-full items-center justify-center rounded-md border border-[#ECEAF3] bg-white text-xs font-semibold text-[#E53935] transition-colors hover:bg-[#FEF3F2]"
                >
                  Delete
                </button>
              )}
            </span>
          </li>
        ))}
      </ol>

      <form
        className="mt-6 flex items-center gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={addPlaceholder}
          aria-label={addPlaceholder}
          className={cn(INPUT, 'flex-1')}
        />
        <Button
          type="submit"
          variant="outline"
          disabled={!newName.trim()}
          className="!h-10 !rounded-md border-[#ECEAF3] bg-white px-4 text-sm font-semibold text-[#1A1A2E] hover:bg-[#f7f6fb] disabled:opacity-60"
        >
          Add
        </Button>
      </form>
    </section>
  )
}

function OrderButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-[#ECEAF3] bg-white text-[#1A1A2E] transition-colors hover:bg-[#F5F4FA] disabled:cursor-default disabled:text-[#D5D2E2] disabled:hover:bg-white"
    >
      {children}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* Shared allow/block cell                                                    */
/* -------------------------------------------------------------------------- */

function RuleCell({
  on,
  label,
  disabled = false,
  compact = false,
  onToggle,
}: {
  on: boolean
  label: string
  disabled?: boolean
  /** Small square cell (Status moves) instead of full-width */
  compact?: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        'flex items-center justify-center rounded-md border text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        compact ? 'mx-auto h-7 w-9' : 'h-8 w-full min-w-16',
        on
          ? 'border-[#E3F5EA] bg-[#E3F5EA] text-[#15803D] hover:bg-[#D6F0DF]'
          : 'border-[#E4E3EA] bg-white text-[#A0A0B2] hover:bg-[#F7F7FA]',
      )}
    >
      {on ? (
        <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
      ) : compact ? (
        <CircleX className="size-3.5" strokeWidth={2} aria-hidden="true" />
      ) : (
        <X className="size-3" strokeWidth={2} aria-hidden="true" />
      )}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* Stage moves                                                                */
/* -------------------------------------------------------------------------- */

function StageMovesCard({
  workflow,
  stages,
  onToggle,
  onStrictChange,
}: {
  workflow: Workflow
  stages: WorkflowItem[]
  onToggle: (fromId: string, toId: string) => void
  onStrictChange: (strict: boolean) => void
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [scroll, setScroll] = useState({ start: 0, size: 1, canLeft: false, canRight: false })
  const order = workflow.stages.map((st) => st.id)

  // DataTable owns the scroll container; find it to drive the arrow controls
  const scroller = () =>
    hostRef.current?.querySelector<HTMLDivElement>('.overflow-x-auto') ?? null

  useEffect(() => {
    const el = scroller()
    if (!el) return
    const update = () => {
      const max = el.scrollWidth - el.clientWidth
      setScroll({
        start: el.scrollWidth ? el.scrollLeft / el.scrollWidth : 0,
        size: el.scrollWidth ? el.clientWidth / el.scrollWidth : 1,
        canLeft: el.scrollLeft > 0,
        canRight: el.scrollLeft < max - 1,
      })
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [stages.length])

  function scrollBy(direction: -1 | 1) {
    const el = scroller()
    el?.scrollBy({ left: direction * el.clientWidth * 0.6, behavior: 'smooth' })
  }

  return (
    <section className="rounded-xl border border-[#E4E1EE] bg-white p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-[#1A1A2E]">Stage moves</h3>
          <p className="mt-0.5 text-[13px] text-[#6B6B80]">
            Read across. A candidate in the row stage can move to the green
            stages. Click to block a move.
          </p>
        </div>
        <Checkbox
          id="strict-pipeline-mode"
          label={<span className="text-[13px] text-[#4A4760]">Strict pipeline mode</span>}
          checked={workflow.strictStageMoves}
          onChange={(e) => onStrictChange(e.target.checked)}
          title="Only allow moves forward to later stages"
          className="shrink-0 [&>label]:items-center [&_input]:mt-0"
        />
      </div>
      {workflow.strictStageMoves ? (
        <p className="-mt-2 mb-4 text-xs text-[#6B6B80]">
          Strict pipeline mode is on: candidates can only move forward to later
          stages. Backward moves are blocked.
        </p>
      ) : null}

      <div ref={hostRef}>
        <DataTable minWidthClassName="min-w-[68rem]" className="[&>div]:scrollbar-none">
          <DataTableHead className="!border-b-0">
            <DataTableTh className="sticky left-0 z-10 w-40 bg-white">
              <span className="sr-only">From stage</span>
            </DataTableTh>
            {stages.map((st) => (
              <DataTableTh key={st.id} className="text-center !text-[11px]">
                {st.name}
              </DataTableTh>
            ))}
          </DataTableHead>
          <DataTableBody>
            {stages.map((from) => {
              const allowed = allowedStageMoves(workflow, from.id)
              const others = stages.filter((st) => st.id !== from.id)
              const count = others.filter((st) => allowed.includes(st.id)).length
              const fromIndex = order.indexOf(from.id)
              return (
                <DataTableRow
                  key={from.id}
                  className="border-b border-[#F0EEF5] hover:!bg-white"
                >
                  <DataTableTd className="sticky left-0 z-10 bg-white !py-2.5">
                    <p className="text-sm font-semibold text-[#1A1A2E]">{from.name}</p>
                    <p className="text-[11px] text-[#8B8B9E]">
                      {count} of {others.length} allowed
                    </p>
                  </DataTableTd>
                  {stages.map((to) => (
                    <DataTableTd key={to.id} className="!px-1.5 !py-2.5 text-center">
                      {to.id === from.id ? (
                        <span className="text-[#C5C2D3]" aria-hidden="true">
                          —
                        </span>
                      ) : (
                        <RuleCell
                          on={allowed.includes(to.id)}
                          disabled={
                            workflow.strictStageMoves &&
                            order.indexOf(to.id) < fromIndex
                          }
                          label={`${from.name} to ${to.name}: ${
                            allowed.includes(to.id) ? 'allowed' : 'blocked'
                          }`}
                          onToggle={() => onToggle(from.id, to.id)}
                        />
                      )}
                    </DataTableTd>
                  ))}
                </DataTableRow>
              )
            })}
          </DataTableBody>
        </DataTable>
      </div>

      {/* Scroll controls */}
      {scroll.size < 1 ? (
        <div className="mt-4 flex items-center gap-3">
          <ScrollArrow label="Scroll left" disabled={!scroll.canLeft} onClick={() => scrollBy(-1)}>
            <ChevronLeft className="size-3.5" strokeWidth={2.25} />
          </ScrollArrow>
          <div className="relative h-1.5 flex-1 rounded-full bg-[#EEEDF3]" aria-hidden="true">
            <div
              className="absolute top-0 h-full rounded-full bg-[#B8B5C9] transition-[left]"
              style={{ left: `${scroll.start * 100}%`, width: `${scroll.size * 100}%` }}
            />
          </div>
          <ScrollArrow label="Scroll right" disabled={!scroll.canRight} onClick={() => scrollBy(1)}>
            <ChevronRight className="size-3.5" strokeWidth={2.25} />
          </ScrollArrow>
        </div>
      ) : null}
    </section>
  )
}

function ScrollArrow({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-[#E4E1EE] bg-white text-[#2D2061] transition-colors hover:bg-[#F5F4FA] disabled:text-[#D5D2E2] disabled:hover:bg-white"
    >
      {children}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* Statuses per stage                                                         */
/* -------------------------------------------------------------------------- */

function StatusesPerStageCard({
  stages,
  statuses,
  allowed,
  onToggle,
  onReset,
}: {
  stages: WorkflowItem[]
  statuses: WorkflowItem[]
  allowed: Record<string, string[]>
  onToggle: (stageId: string, statusId: string) => void
  /** Allow every status again */
  onReset: (stageId: string) => void
}) {
  return (
    <section className="rounded-xl border border-[#E4E1EE] bg-white p-5 sm:p-6">
      <h3 className="text-base font-semibold text-[#1A1A2E]">Statuses per stage</h3>
      <p className="mt-0.5 mb-5 text-[13px] text-[#6B6B80]">
        Green: the status can be used in that stage. Click to hide it there.
      </p>
      <DataTable minWidthClassName="min-w-[52rem]">
        <DataTableHead className="!border-b-0">
          <DataTableTh className="w-44">
            <span className="sr-only">Stage</span>
          </DataTableTh>
          {statuses.map((st) => (
            <DataTableTh key={st.id} className="text-center !text-[11px]">
              {st.name}
            </DataTableTh>
          ))}
          <DataTableTh className="w-20">
            <span className="sr-only">Reset</span>
          </DataTableTh>
        </DataTableHead>
        <DataTableBody>
          {stages.map((stage) => {
            const ids = allowed[stage.id] ?? []
            const count = statuses.filter((st) => ids.includes(st.id)).length
            const allAllowed = count === statuses.length
            return (
              <DataTableRow
                key={stage.id}
                className="border-b border-[#F0EEF5] hover:!bg-white"
              >
                <DataTableTd className="!py-2.5">
                  <p className="text-sm font-semibold text-[#1A1A2E]">{stage.name}</p>
                  <p className="text-[11px] text-[#8B8B9E]">
                    {count} of {statuses.length} allowed
                  </p>
                </DataTableTd>
                {statuses.map((st) => {
                  const on = ids.includes(st.id)
                  return (
                    <DataTableTd key={st.id} className="!px-1.5 !py-2.5">
                      <RuleCell
                        on={on}
                        label={`${st.name} in ${stage.name}: ${on ? 'allowed' : 'hidden'}`}
                        onToggle={() => onToggle(stage.id, st.id)}
                      />
                    </DataTableTd>
                  )
                })}
                <DataTableTd className="!py-2.5 text-right">
                  {allAllowed ? null : (
                    <button
                      type="button"
                      onClick={() => onReset(stage.id)}
                      className="inline-flex h-8 items-center justify-center rounded-md border border-[#2D2061] bg-white px-3 text-xs font-medium text-[#2D2061] transition-colors hover:bg-[#F7F6FA]"
                    >
                      Reset
                    </button>
                  )}
                </DataTableTd>
              </DataTableRow>
            )
          })}
        </DataTableBody>
      </DataTable>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Status moves                                                               */
/* -------------------------------------------------------------------------- */

function StatusMovesCard({
  statuses,
  moves,
  onToggle,
  onReset,
}: {
  statuses: WorkflowItem[]
  moves: Record<string, string[]>
  onToggle: (fromId: string, toId: string) => void
  /** Allow every move again */
  onReset: (fromId: string) => void
}) {
  return (
    <section className="rounded-xl border border-[#E4E1EE] bg-white p-5 sm:p-6">
      <h3 className="text-base font-semibold text-[#1A1A2E]">Status moves</h3>
      <p className="mt-0.5 mb-5 text-[13px] text-[#6B6B80]">
        Read across. A candidate with the row status can change to the green
        statuses.
      </p>
      <DataTable minWidthClassName="min-w-[52rem]">
        <DataTableHead className="!border-b-0">
          <DataTableTh className="w-40">
            <span className="sr-only">From status</span>
          </DataTableTh>
          {statuses.map((st) => (
            <DataTableTh key={st.id} className="text-center !text-[11px]">
              {st.name}
            </DataTableTh>
          ))}
          <DataTableTh className="w-20">
            <span className="sr-only">Reset</span>
          </DataTableTh>
        </DataTableHead>
        <DataTableBody>
          {statuses.map((from) => {
            const allowed = moves[from.id] ?? []
            const others = statuses.filter((st) => st.id !== from.id)
            const count = others.filter((st) => allowed.includes(st.id)).length
            return (
              <DataTableRow
                key={from.id}
                className="border-b border-[#F0EEF5] hover:!bg-white"
              >
                <DataTableTd className="!py-2.5">
                  <p className="text-sm font-semibold text-[#1A1A2E]">{from.name}</p>
                  <p className="text-[11px] text-[#8B8B9E]">
                    {count} of {others.length} allowed
                  </p>
                </DataTableTd>
                {statuses.map((to) => (
                  <DataTableTd key={to.id} className="!px-1.5 !py-2.5 text-center">
                    {to.id === from.id ? (
                      <span className="text-[#C5C2D3]" aria-hidden="true">
                        —
                      </span>
                    ) : (
                      <RuleCell
                        compact
                        on={allowed.includes(to.id)}
                        label={`${from.name} to ${to.name}: ${
                          allowed.includes(to.id) ? 'allowed' : 'blocked'
                        }`}
                        onToggle={() => onToggle(from.id, to.id)}
                      />
                    )}
                  </DataTableTd>
                ))}
                <DataTableTd className="!py-2.5 text-right">
                  {count === others.length ? null : (
                    <button
                      type="button"
                      onClick={() => onReset(from.id)}
                      className="inline-flex h-8 items-center justify-center rounded-md border border-[#2D2061] bg-white px-3 text-xs font-medium text-[#2D2061] transition-colors hover:bg-[#F7F6FA]"
                    >
                      Reset
                    </button>
                  )}
                </DataTableTd>
              </DataTableRow>
            )
          })}
        </DataTableBody>
      </DataTable>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Recruiter dropdown preview                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Live preview of the single stage+status dropdown recruiters see.
 * Only lists statuses allowed in the current stage (and reachable from the
 * current status) plus the stage moves allowed from the current stage.
 */
function RecruiterDropdownPreview({ workflow }: { workflow: Workflow }) {
  const activeStages = workflow.stages.filter((s) => s.active)
  const activeStatuses = workflow.statuses.filter((s) => s.active)
  const [position, setPosition] = useState({ stageId: 'interview', statusId: 'open' })

  // Fall back to the first active stage/status if the preview position was removed
  const stage =
    activeStages.find((s) => s.id === position.stageId) ?? activeStages[0]
  const allowedInStage = activeStatuses.filter((s) =>
    stage ? workflow.statusesPerStage[stage.id]?.includes(s.id) : false,
  )
  const status =
    allowedInStage.find((s) => s.id === position.statusId) ?? allowedInStage[0]

  const options = useMemo(() => {
    if (!stage) return []
    const reachable = new Set(status ? workflow.statusMoves[status.id] ?? [] : [])
    const statusOptions = allowedInStage
      .filter((s) => s.id === status?.id || reachable.has(s.id))
      .map((s) => ({ value: `status:${s.id}`, label: s.name }))
    const stageOptions = activeStages
      .filter((s) => allowedStageMoves(workflow, stage.id).includes(s.id))
      .map((s) => ({ value: `stage:${s.id}`, label: `Move to ${s.name}` }))
    return [...statusOptions, ...stageOptions]
  }, [stage, status, allowedInStage, activeStages, workflow])

  function handleChange(value: string) {
    const [kind, id] = value.split(':')
    if (kind === 'status') {
      setPosition((p) => ({ ...p, statusId: id }))
      return
    }
    const firstStatus =
      activeStatuses.find((s) => workflow.statusesPerStage[id]?.includes(s.id))?.id ?? ''
    setPosition({ stageId: id, statusId: firstStatus })
  }

  return (
    <section className="rounded-xl border border-[#E4E1EE] bg-white p-5 shadow-[0_2px_8px_rgba(45,32,97,0.06)] sm:p-6">
      <h3 className="text-base font-semibold text-[#1A1A2E]">Recruiter dropdown</h3>
      <p className="mt-1 text-[13px] leading-relaxed text-[#6B6B80]">
        One list sets stage and status together. Try it: it only shows the moves
        you allow.
      </p>
      <div className="mt-4">
        <Select
          id="recruiter-dropdown-preview"
          aria-label="Recruiter stage and status"
          options={options}
          value={status ? `status:${status.id}` : ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="No moves available"
        />
      </div>
      <p className="mt-4 rounded-md bg-[#F1F0F8] px-3.5 py-2.5 text-xs text-[#2D2061]">
        <span className="font-medium">Stage:</span> {stage?.name ?? '—'},{' '}
        <span className="font-medium">Status:</span> {status?.name ?? '—'}
      </p>
    </section>
  )
}
