import { useState, type DragEvent } from 'react'
import { Copy, GripVertical, SquarePen, Trash2 } from 'lucide-react'
import {
  Button,
  ConfirmDeleteModal,
  Switch,
  ThreeDotsMenu,
  toast,
  type ThreeDotsMenuItem,
} from '../ui'
import { cn } from '../../lib/cn'
import {
  BLANK_VIEW_EDIT_ROUND_VALUES,
  DEFAULT_VIEW_EDIT_ROUND_VALUES,
  ViewEditRoundPanel,
  formatSlotsOpenAfter,
  type ViewEditRoundValues,
} from './ViewEditRoundPanel'
import { SettingsPanel } from './SettingsPanel'

type SettingsRound = ViewEditRoundValues & {
  id: string
}

type RoundPanelState =
  | { mode: 'create' }
  | { mode: 'edit'; id: string }
  | null

type RoundRowProps = {
  round: SettingsRound
  dragging: boolean
  onDragStart: () => void
  onDragOver: (event: DragEvent) => void
  onDragEnd: () => void
  onActiveChange: (active: boolean) => void
  onViewEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}

const TOAST_TITLE = '2 Way Interview'

const INITIAL_ROUNDS: SettingsRound[] = [
  { id: 'round-technical', ...DEFAULT_VIEW_EDIT_ROUND_VALUES, name: 'Technical' },
  { id: 'round-hr', ...DEFAULT_VIEW_EDIT_ROUND_VALUES, name: 'HR' },
  { id: 'round-1st', ...DEFAULT_VIEW_EDIT_ROUND_VALUES, name: '1st Interview' },
  { id: 'round-2nd', ...DEFAULT_VIEW_EDIT_ROUND_VALUES, name: '2nd Interview' },
]

const ROUND_MENU_ITEMS: ThreeDotsMenuItem[] = [
  {
    id: 'view-edit',
    label: 'View & Edit',
    icon: <SquarePen strokeWidth={1.75} aria-hidden="true" />,
  },
  {
    id: 'duplicate',
    label: 'Duplicate',
    icon: <Copy strokeWidth={1.75} aria-hidden="true" />,
  },
  {
    id: 'delete',
    label: 'Delete',
    destructive: true,
    icon: <Trash2 strokeWidth={1.75} aria-hidden="true" />,
  },
]

/**
 * Settings → Module Configuration → 2 Way Interview → Rounds.
 */
export function TwoWayRoundsPanel() {
  const [rounds, setRounds] = useState(INITIAL_ROUNDS)
  const [dragId, setDragId] = useState<string | null>(null)
  const [panel, setPanel] = useState<RoundPanelState>(null)
  const [pendingDelete, setPendingDelete] = useState<SettingsRound | null>(null)

  const editingIndex =
    panel?.mode === 'edit'
      ? rounds.findIndex((round) => round.id === panel.id)
      : -1
  const editingRound = editingIndex >= 0 ? rounds[editingIndex] : null

  function setActive(id: string, active: boolean) {
    setRounds((current) =>
      current.map((round) => (round.id === id ? { ...round, active } : round)),
    )
  }

  function handleDragStart(id: string) {
    setDragId(id)
  }

  function handleDragOver(event: DragEvent, overId: string) {
    event.preventDefault()
    if (!dragId || dragId === overId) return

    setRounds((current) => {
      const from = current.findIndex((round) => round.id === dragId)
      const to = current.findIndex((round) => round.id === overId)
      if (from < 0 || to < 0 || from === to) return current

      const next = [...current]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }

  function handleDragEnd() {
    setDragId(null)
  }

  function confirmDelete() {
    if (!pendingDelete) return
    const id = pendingDelete.id
    setRounds((current) => current.filter((round) => round.id !== id))
    if (panel?.mode === 'edit' && panel.id === id) setPanel(null)
    setPendingDelete(null)
    toast.success('Round removed.', { title: TOAST_TITLE })
  }

  function handleDuplicate(round: SettingsRound) {
    const copy: SettingsRound = {
      ...round,
      id: `round-${Date.now()}`,
      name: uniqueCopyName(round.name, rounds.map((item) => item.name)),
    }
    setRounds((current) => {
      const index = current.findIndex((item) => item.id === round.id)
      const next = [...current]
      next.splice(index + 1, 0, copy)
      return next
    })
    toast.success('Round duplicated.', { title: TOAST_TITLE })
  }

  function saveRound(values: ViewEditRoundValues) {
    if (panel?.mode === 'create') {
      setRounds((current) => [
        ...current,
        {
          id: `round-${Date.now()}`,
          ...values,
        },
      ])
      toast.success('Round added.', { title: TOAST_TITLE })
    } else if (panel?.mode === 'edit') {
      setRounds((current) =>
        current.map((round) =>
          round.id === panel.id ? { ...round, ...values } : round,
        ),
      )
      toast.success('Round saved.', { title: TOAST_TITLE })
    }
    setPanel(null)
  }

  const panelOpen = panel !== null
  const panelRoundId =
    panel?.mode === 'edit' ? panel.id : panel?.mode === 'create' ? 'new' : ''
  const panelTitle =
    panel?.mode === 'create'
      ? 'Add Round'
      : `View & Edit ${editingRound?.name.trim() || 'Round'}`
  const panelValues =
    panel?.mode === 'create'
      ? BLANK_VIEW_EDIT_ROUND_VALUES
      : editingRound
        ? toViewEditValues(editingRound)
        : BLANK_VIEW_EDIT_ROUND_VALUES
  const panelTakenNames =
    panel?.mode === 'edit' && editingRound
      ? rounds
          .filter((round) => round.id !== editingRound.id)
          .map((round) => round.name)
      : rounds.map((round) => round.name)

  return (
    <>
      <SettingsPanel
        eyebrow="2 WAY INTERVIEW"
        title="Rounds"
        description="Hide candidate details inside jobs. Only Super Users can change these settings."
        actions={
          <Button
            type="button"
            onClick={() => setPanel({ mode: 'create' })}
            className="!h-10 !rounded-md !bg-[#2D2061] !px-4 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            Add Round
          </Button>
        }
      >
        <ul className="flex flex-col gap-3">
          {rounds.map((round) => (
            <RoundRow
              key={round.id}
              round={round}
              dragging={dragId === round.id}
              onDragStart={() => handleDragStart(round.id)}
              onDragOver={(event) => handleDragOver(event, round.id)}
              onDragEnd={handleDragEnd}
              onActiveChange={(active) => setActive(round.id, active)}
              onViewEdit={() => setPanel({ mode: 'edit', id: round.id })}
              onDuplicate={() => handleDuplicate(round)}
              onDelete={() => setPendingDelete(round)}
            />
          ))}
        </ul>
      </SettingsPanel>

      <ViewEditRoundPanel
        open={panelOpen}
        roundId={panelRoundId}
        title={panelTitle}
        saveLabel={panel?.mode === 'create' ? 'Add' : 'Save Round'}
        values={panelValues}
        takenNames={panelTakenNames}
        onClose={() => setPanel(null)}
        onSave={saveRound}
      />

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title="Delete Round"
        itemName={pendingDelete?.name}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}

function RoundRow({
  round,
  dragging,
  onDragStart,
  onDragOver,
  onDragEnd,
  onActiveChange,
  onViewEdit,
  onDuplicate,
  onDelete,
}: RoundRowProps) {
  function handleMenuSelect(id: string) {
    switch (id) {
      case 'view-edit':
        onViewEdit()
        return
      case 'duplicate':
        onDuplicate()
        return
      case 'delete':
        onDelete()
        return
      default:
        return
    }
  }

  return (
    <li
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move'
        onDragStart()
      }}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={cn(
        'rounded-[8px] border border-[#E4E1EE] bg-white px-4 py-4 sm:px-5',
        dragging && 'opacity-70 ring-2 ring-[#2D2061]/20',
      )}
    >
      <div className="flex items-start gap-3 sm:items-center">
        <span
          className="mt-0.5 inline-flex size-7 shrink-0 cursor-grab items-center justify-center text-[#C5C2D3] active:cursor-grabbing sm:mt-0"
          aria-hidden="true"
          title="Drag to reorder"
        >
          <GripVertical className="size-4" strokeWidth={2} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-[#2D2061] sm:text-[15px]">
              {round.name}
            </h3>
            <span
              className={cn(
                'inline-flex h-5 items-center rounded-full px-2 text-[11px] font-semibold',
                round.active
                  ? 'bg-[#E6F6EC] text-[#15803D]'
                  : 'bg-[#EEEEF2] text-[#6B6B80]',
              )}
            >
              {round.active ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
            <MetaField
              label="Slot Duration"
              value={
                round.defaultDurationMins
                  ? `${round.defaultDurationMins} min`
                  : '—'
              }
            />
            <MetaField
              label="Gap between slot start times"
              value={round.gapMins ? `${round.gapMins} min` : '—'}
            />
            <MetaField
              label="Slots open after"
              value={
                round.slotsOpenAfter
                  ? formatSlotsOpenAfter(round.slotsOpenAfter)
                  : '—'
              }
            />
            <MetaField
              label="Look ahead"
              value={round.lookAheadDays ? `${round.lookAheadDays} days` : '—'}
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-center">
          <Switch
            checked={round.active}
            onCheckedChange={onActiveChange}
            aria-label={`${round.active ? 'Deactivate' : 'Activate'} ${round.name}`}
            className="!gap-0"
          />
          <ThreeDotsMenu
            triggerLabel={`Actions for ${round.name}`}
            side="left"
            items={ROUND_MENU_ITEMS}
            onItemSelect={handleMenuSelect}
          />
        </div>
      </div>
    </li>
  )
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium text-[#8B8B9E]">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-[#2D2061]">{value}</p>
    </div>
  )
}

function toViewEditValues(round: SettingsRound): ViewEditRoundValues {
  const { id: _id, ...values } = round
  return values
}

function nameTaken(name: string, taken: string[]): boolean {
  const needle = name.toLowerCase()
  return taken.some((item) => item.toLowerCase() === needle)
}

function uniqueCopyName(name: string, taken: string[]): string {
  const base = `${name} (copy)`
  if (!nameTaken(base, taken)) return base

  let index = 2
  while (nameTaken(`${name} (copy ${index})`, taken)) {
    index += 1
  }
  return `${name} (copy ${index})`
}
