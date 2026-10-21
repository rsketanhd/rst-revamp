import {
  AlertTriangle,
  Check,
  ChevronDown,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { useMemo, useState, type KeyboardEvent } from 'react'
import {
  Button,
  ConfirmDeleteModal,
  PercentSlider,
  SegmentedToggle,
  Tooltip,
  toast,
} from '../../ui'
import { FieldInput } from './StepChrome'
import {
  jobTitleAnalyzerTags,
  type AnalyzerCriteria,
  type CreateJobFormState,
} from './types'
import { cn } from '../../../lib/cn'

type Props = {
  value: CreateJobFormState
  onChange: (patch: Partial<CreateJobFormState>) => void
}

type PendingDelete = {
  kind: 'general' | 'penalty'
  row: AnalyzerCriteria
}

export function StepJobAnalyzer({ value, onChange }: Props) {
  const [generalOpen, setGeneralOpen] = useState(true)
  const [penaltyOpen, setPenaltyOpen] = useState(true)
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)
  const [draftValueInput, setDraftValueInput] = useState<Record<string, string>>(
    {},
  )

  const totalWeight = useMemo(
    () => value.criteria.reduce((sum, row) => sum + row.weight, 0),
    [value.criteria],
  )

  function updateCriteria(id: string, patch: Partial<AnalyzerCriteria>) {
    onChange({
      criteria: value.criteria.map((row) =>
        row.id === id ? { ...row, ...patch } : row,
      ),
    })
  }

  function updatePenalty(id: string, patch: Partial<AnalyzerCriteria>) {
    onChange({
      penaltyCriteria: value.penaltyCriteria.map((row) =>
        row.id === id ? { ...row, ...patch } : row,
      ),
    })
  }

  function removeCriteria(kind: 'general' | 'penalty', id: string) {
    if (kind === 'general') {
      onChange({
        criteria: value.criteria.filter((row) => row.id !== id),
      })
      return
    }
    onChange({
      penaltyCriteria: value.penaltyCriteria.filter((row) => row.id !== id),
    })
    setDraftValueInput((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
  }

  function addCriteria() {
    const next: AnalyzerCriteria = {
      id: `custom-${Date.now()}`,
      label: 'New Criteria',
      source: 'new',
      value: '',
      weight: 10,
    }
    onChange({ criteria: [...value.criteria, next] })
  }

  function addPenalty() {
    const next: AnalyzerCriteria = {
      id: `penalty-${Date.now()}`,
      label: 'Penalty Criterion',
      source: 'new',
      value: '',
      tags: [],
      weight: 10,
    }
    onChange({ penaltyCriteria: [...value.penaltyCriteria, next] })
    setPenaltyOpen(true)
  }

  function addPenaltyValue(id: string, raw: string) {
    const pieces = raw
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
    if (pieces.length === 0) return
    const row = value.penaltyCriteria.find((item) => item.id === id)
    if (!row) return
    const existing = row.tags ?? []
    const merged = [...existing]
    for (const piece of pieces) {
      if (
        !merged.some((tag) => tag.toLowerCase() === piece.toLowerCase())
      ) {
        merged.push(piece)
      }
    }
    updatePenalty(id, { tags: merged, value: merged.join(', ') })
    setDraftValueInput((current) => ({ ...current, [id]: '' }))
  }

  function removePenaltyValue(id: string, tag: string) {
    const row = value.penaltyCriteria.find((item) => item.id === id)
    if (!row) return
    const nextTags = (row.tags ?? []).filter((item) => item !== tag)
    updatePenalty(id, { tags: nextTags, value: nextTags.join(', ') })
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#2D2061]">Job Analyzer</h2>
          <p className="mt-0.5 text-sm text-[#8B8B9E]">
            Market benchmark and standard analysis.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 border-[#2D2061]/30 text-[#2D2061]"
          >
            Check New Job Analyzer
          </Button>
          <Button
            type="button"
            onClick={addCriteria}
            className="h-9 !bg-[#2D2061] hover:!bg-[#241a52]"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add New
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-[#E4E3EC] bg-[#F5F5F5]">
        <button
          type="button"
          onClick={() => setGeneralOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left"
        >
          <span className="text-[15px] font-bold text-[#2D2061]">
            General Criteria
          </span>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-[11px] font-semibold',
                totalWeight === 100
                  ? 'bg-[#E6F6EC] text-[#15803D]'
                  : 'bg-[#FDF3D7] text-[#B7791F]',
              )}
            >
              Total weight: {totalWeight}%
            </span>
            <ChevronDown
              className={cn(
                'size-5 text-[#8B8FA3] transition-transform',
                !generalOpen && '-rotate-90',
              )}
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </div>
        </button>

        {generalOpen ? (
          <div className="flex flex-col gap-3 border-t border-[#EEEDF3] px-5 pb-5 pt-4">
            {value.criteria.map((row) => (
              <CriteriaRow
                key={row.id}
                row={row}
                onChange={(patch) => updateCriteria(row.id, patch)}
                onRemove={() => setPendingDelete({ kind: 'general', row })}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-[#F0C7C3] bg-[#FDF2F2]">
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-3.5">
          <button
            type="button"
            onClick={() => setPenaltyOpen((v) => !v)}
            className="flex min-w-0 flex-1 items-start gap-3 text-left"
          >
            <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#FDECEC]">
              <AlertTriangle
                className="size-4 text-[#D92D20]"
                strokeWidth={2}
                aria-hidden="true"
              />
            </span>
            <span className="min-w-0">
              <span className="inline-flex flex-wrap items-center gap-2">
                <span className="text-[15px] font-bold text-[#D92D20]">
                  Penalty Criteria
                </span>
                {value.penaltyCriteria.length > 0 ? (
                  <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#D92D20] text-[11px] font-bold text-white">
                    {value.penaltyCriteria.length}
                  </span>
                ) : null}
              </span>
              <span className="mt-0.5 block text-sm text-[#8B8B9E]">
                Criteria that count against a candidate.
              </span>
            </span>
          </button>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={addPenalty}
              className="!h-9 !rounded-md !border-[#D92D20] !bg-white !px-3 !text-[#D92D20] hover:!bg-[#FDECEC]"
            >
              <Plus className="size-4" strokeWidth={2} aria-hidden="true" />
              Add Penalty
            </Button>
            <button
              type="button"
              onClick={() => setPenaltyOpen((v) => !v)}
              aria-label={penaltyOpen ? 'Collapse penalty criteria' : 'Expand penalty criteria'}
              className="inline-flex size-8 items-center justify-center rounded-md text-[#D92D20] transition-colors hover:bg-[#FDECEC]"
            >
              <ChevronDown
                className={cn(
                  'size-5 transition-transform',
                  !penaltyOpen && '-rotate-90',
                )}
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {penaltyOpen ? (
          <div className="border-t border-[#F0C7C3] bg-white px-5 py-4">
            {value.penaltyCriteria.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#F0C7C3] bg-[#FFF8F8] px-4 py-8 text-center">
                <p className="text-sm text-[#8B8B9E]">
                  No penalty criteria yet — add one for anything that should
                  lower a candidate&apos;s score.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPenalty}
                  className="mt-4 !h-9 !border-[#D92D20] !text-[#D92D20] hover:!bg-[#FDECEC]"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  Add Penalty
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {value.penaltyCriteria.map((row) => (
                  <PenaltyCriteriaForm
                    key={row.id}
                    row={row}
                    valueDraft={draftValueInput[row.id] ?? ''}
                    onValueDraftChange={(next) =>
                      setDraftValueInput((current) => ({
                        ...current,
                        [row.id]: next,
                      }))
                    }
                    onCommitValue={(raw) => addPenaltyValue(row.id, raw)}
                    onRemoveValue={(tag) => removePenaltyValue(row.id, tag)}
                    onChange={(patch) => updatePenalty(row.id, patch)}
                    onSave={() =>
                      toast.success(`“${row.label.trim() || 'Penalty'}” saved.`, {
                        title: 'Job Analyzer',
                      })
                    }
                    onRemove={() =>
                      setPendingDelete({ kind: 'penalty', row })
                    }
                  />
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title={
          pendingDelete?.kind === 'penalty'
            ? 'Delete Penalty Criteria'
            : 'Delete Criteria'
        }
        itemName={pendingDelete?.row.label}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return
          removeCriteria(pendingDelete.kind, pendingDelete.row.id)
          setPendingDelete(null)
        }}
      />
    </div>
  )
}

function PenaltyCriteriaForm({
  row,
  valueDraft,
  onValueDraftChange,
  onCommitValue,
  onRemoveValue,
  onChange,
  onSave,
  onRemove,
}: {
  row: AnalyzerCriteria
  valueDraft: string
  onValueDraftChange: (value: string) => void
  onCommitValue: (raw: string) => void
  onRemoveValue: (tag: string) => void
  onChange: (patch: Partial<AnalyzerCriteria>) => void
  onSave: () => void
  onRemove: () => void
}) {
  function handleValueKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      onCommitValue(valueDraft)
    }
  }

  return (
    <div className="rounded-xl border border-[#F0C7C3] border-l-4 border-l-[#D92D20] bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:gap-5">
        <div className="min-w-0 flex-1 space-y-3">
          <FieldInput
            label="Criterion name"
            value={row.label}
            onChange={(e) => onChange({ label: e.target.value })}
            placeholder="Penalty Criterion"
          />

          <div className="flex min-w-0 flex-col gap-1.5">
            <label className="text-xs font-medium text-[#2D2061]">Value</label>
            <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-md border border-[#ddd9e8] bg-white px-2.5 py-1.5 focus-within:border-[#D92D20] focus-within:ring-2 focus-within:ring-[#D92D20]/10">
              {(row.tags ?? []).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-md bg-[#FDECEC] px-2 py-1 text-xs font-medium text-[#D92D20]"
                >
                  {tag}
                  <button
                    type="button"
                    aria-label={`Remove ${tag}`}
                    onClick={() => onRemoveValue(tag)}
                    className="inline-flex text-[#D92D20]/80 hover:text-[#B42318]"
                  >
                    <X className="size-3" strokeWidth={2.25} aria-hidden="true" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={valueDraft}
                onChange={(e) => onValueDraftChange(e.target.value)}
                onKeyDown={handleValueKeyDown}
                onBlur={() => {
                  if (valueDraft.trim()) onCommitValue(valueDraft)
                }}
                placeholder={
                  (row.tags?.length ?? 0) > 0
                    ? 'Add another value'
                    : 'Add what to look for — e.g. “No work permit for the UK”'
                }
                className="min-w-[12rem] flex-1 border-0 bg-transparent py-1 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2]"
              />
            </div>
            <p className="text-xs text-[#8B8B9E]">
              Press Enter or a comma to add each value
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-end sm:gap-4">
          <div className="w-full sm:w-[11rem]">
            <p className="mb-1 text-xs font-medium text-[#2D2061]">Weight</p>
            <PercentSlider
              value={row.weight}
              onChange={(weight) => onChange({ weight })}
              tone="danger"
              aria-label={`${row.label} weight`}
              className="max-w-none"
            />
          </div>

          <div className="flex items-center gap-2 pb-1">
            <Button
              type="button"
              onClick={onSave}
              className="!h-10 !rounded-full !bg-[#D92D20] !px-5 text-sm font-semibold text-white hover:!bg-[#B42318]"
            >
              <Check className="size-4" strokeWidth={2.25} aria-hidden="true" />
              Save
            </Button>
            <button
              type="button"
              aria-label={`Delete ${row.label}`}
              onClick={onRemove}
              className="inline-flex size-9 items-center justify-center rounded-full border border-[#F0C7C3] bg-white text-[#D92D20] transition-colors hover:bg-[#FDECEC]"
            >
              <Trash2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CriteriaInfoIcon({ content }: { content: string }) {
  return (
    <Tooltip content={content} side="top" align="start" maxWidth={288}>
      <button
        type="button"
        aria-label="More information"
        className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-[#E8E6F0] text-[10px] font-bold leading-none text-[#8B8B9E] outline-none transition-colors hover:bg-[#DCD9E8] hover:text-[#2D2061] focus-visible:ring-2 focus-visible:ring-[#2D2061]/25"
      >
        <span aria-hidden="true" className="translate-y-px">
          i
        </span>
      </button>
    </Tooltip>
  )
}

function CriteriaRow({
  row,
  onChange,
  onRemove,
}: {
  row: AnalyzerCriteria
  onChange: (patch: Partial<AnalyzerCriteria>) => void
  onRemove: () => void
}) {
  const tags =
    row.tags && row.tags.length > 0
      ? row.tags
      : row.id === 'jobTitle'
        ? jobTitleAnalyzerTags(row.value)
        : []

  return (
    <div className="rounded-xl border border-[#E4E3EC] bg-white px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
        <div className="min-w-0 flex-1">
          <SegmentedToggle
            aria-label={`${row.label} source`}
            value={row.source}
            options={[
              { value: 'old', label: 'Keep Existing' },
              { value: 'new', label: 'Accept New' },
            ]}
            onChange={(source) => onChange({ source })}
          />

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[13px] font-semibold text-[#8B8B9E]">
              {row.label}
            </span>
            <CriteriaInfoIcon
              content={
                row.info ??
                `Additional information about ${row.label.toLowerCase()}.`
              }
            />
            {row.badge ? (
              <span className="inline-flex items-center rounded-full bg-[#2D2061] px-2 py-0.5 text-[10px] font-semibold leading-none text-white">
                {row.badge}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-start gap-3 sm:gap-4">
          <div className="w-full min-w-[9rem] sm:w-[12rem] lg:w-[13.5rem]">
            <PercentSlider
              value={row.weight}
              onChange={(weight) => onChange({ weight })}
              aria-label={`${row.label} weight`}
              className="max-w-none"
            />
          </div>
          <div className="flex shrink-0 items-center gap-2 pt-5">
            <button
              type="button"
              aria-label={`Edit ${row.label}`}
              className="inline-flex size-9 items-center justify-center rounded-full bg-[#FDECEC] text-[#E04B4B] transition-colors hover:bg-[#fadada]"
            >
              <Pencil className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={`Delete ${row.label}`}
              onClick={onRemove}
              className="inline-flex size-9 items-center justify-center rounded-full bg-[#FDECEC] text-[#E04B4B] transition-colors hover:bg-[#fadada]"
            >
              <Trash2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex rounded-md bg-[#F0EFF4] px-2.5 py-1.5 text-xs font-medium text-[#4A4A60]"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm leading-snug text-[#2A2A3A]">
          {row.value || '—'}
        </p>
      )}
    </div>
  )
}
