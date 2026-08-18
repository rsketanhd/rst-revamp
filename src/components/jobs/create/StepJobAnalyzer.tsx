import { ChevronDown, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button, PercentSlider, SegmentedToggle, Tooltip } from '../../ui'
import type { AnalyzerCriteria, CreateJobFormState } from './types'
import { cn } from '../../../lib/cn'

type Props = {
  value: CreateJobFormState
  onChange: (patch: Partial<CreateJobFormState>) => void
}

export function StepJobAnalyzer({ value, onChange }: Props) {
  const [open, setOpen] = useState(true)

  function updateCriteria(id: string, patch: Partial<AnalyzerCriteria>) {
    onChange({
      criteria: value.criteria.map((row) =>
        row.id === id ? { ...row, ...patch } : row,
      ),
    })
  }

  function removeCriteria(id: string) {
    onChange({
      criteria: value.criteria.filter((row) => row.id !== id),
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

      {/* General Criteria card — matches design mock */}
      <div className="rounded-xl border border-[#E4E3EC] bg-[#F5F5F5]">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-3.5 text-left"
        >
          <span className="text-[15px] font-bold text-[#2D2061]">
            General Criteria
          </span>
          <ChevronDown
            className={cn(
              'size-5 text-[#8B8FA3] transition-transform',
              !open && '-rotate-90',
            )}
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </button>

        {open ? (
          <div className="flex flex-col gap-3 border-t border-[#EEEDF3] px-5 pb-5 pt-4">
            {value.criteria.map((row) => (
              <CriteriaRow
                key={row.id}
                row={row}
                onChange={(patch) => updateCriteria(row.id, patch)}
                onRemove={() => removeCriteria(row.id)}
              />
            ))}
          </div>
        ) : null}
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
        className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-[#C9C7D6] text-[10px] font-bold leading-none text-[#1a1638] outline-none transition-colors hover:bg-[#B8B5C9] focus-visible:ring-2 focus-visible:ring-[#2D2061]/25"
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
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-[#E8E7EF] bg-white p-4 sm:flex-row sm:items-center sm:gap-5">
      {/* Left: toggle + label + value */}
      <div className="min-w-0 flex-1">
        <SegmentedToggle
          aria-label={`${row.label} source`}
          value={row.source}
          options={[
            { value: 'old', label: 'Old' },
            { value: 'new', label: 'New' },
          ]}
          onChange={(source) => onChange({ source })}
        />

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[13px] font-semibold text-[#5B548A]">
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

        {row.tags && row.tags.length > 0 ? (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {row.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex rounded-md border border-[#E0DFE8] bg-[#F6F5FA] px-2.5 py-1 text-xs font-medium text-[#4A4A60]"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-1 text-sm leading-snug text-[#2A2A3A]">
            {row.value || '—'}
          </p>
        )}
      </div>

      {/* Center: weight slider */}
      <div className="flex w-full shrink-0 items-center sm:w-[12rem] lg:w-[13.5rem]">
        <PercentSlider
          value={row.weight}
          onChange={(weight) => onChange({ weight })}
          aria-label={`${row.label} weight`}
          className="max-w-none"
        />
      </div>

      {/* Right: circular edit / delete */}
      <div className="flex shrink-0 items-center gap-2 sm:self-center">
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
  )
}
