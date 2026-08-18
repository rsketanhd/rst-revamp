import { Button, Select, SidePanel } from '../ui'
import {
  DISCOVERY_SOURCE_OPTIONS,
  type DiscoveryListFilters,
} from '../../data/discovery'

export type DiscoveryFiltersPanelProps = {
  open: boolean
  onClose: () => void
  filters: DiscoveryListFilters
  onChange: (next: DiscoveryListFilters) => void
  onApply: () => void
  onReset: () => void
}

const NOTICE_OPTIONS = [
  'Immediate',
  '2 Weeks Notice',
  '1 Month Notice',
  '2 Months Notice',
]

/**
 * Structured filters for refining Candidate Discovery results.
 */
export function DiscoveryFiltersPanel({
  open,
  onClose,
  filters,
  onChange,
  onApply,
  onReset,
}: DiscoveryFiltersPanelProps) {
  function patch(partial: Partial<DiscoveryListFilters>) {
    onChange({ ...filters, ...partial })
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Discovery Filters"
      widthClassName="w-full max-w-[28rem]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className="!h-10 !rounded-md border-[#d5d2e2] px-4 text-sm font-medium text-[#2D2061]"
          >
            Reset
          </Button>
          <Button
            type="button"
            onClick={() => {
              onApply()
              onClose()
            }}
            className="!h-10 !rounded-md bg-[#2D2061] px-5 text-sm font-semibold text-white hover:bg-[#241a52]"
          >
            Apply Filters
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <p className="text-sm leading-relaxed text-[#8B8B9E]">
          Refine the candidate list. Changes apply when you click Apply Filters.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#6B6B80]">
              Min Experience (yrs)
            </span>
            <input
              type="number"
              min={0}
              max={40}
              value={filters.minExperience}
              onChange={(e) =>
                patch({ minExperience: Number(e.target.value) || 0 })
              }
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#6B6B80]">
              Max Experience (yrs)
            </span>
            <input
              type="number"
              min={0}
              max={40}
              value={filters.maxExperience}
              onChange={(e) =>
                patch({ maxExperience: Number(e.target.value) || 0 })
              }
              className={inputClass}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#6B6B80]">
            Location
          </span>
          <input
            type="text"
            value={filters.locationQuery}
            onChange={(e) => patch({ locationQuery: e.target.value })}
            placeholder="e.g. Riyadh, Dubai"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#6B6B80]">
            Skills
          </span>
          <input
            type="text"
            value={filters.skillsQuery}
            onChange={(e) => patch({ skillsQuery: e.target.value })}
            placeholder="e.g. Java, React"
            className={inputClass}
          />
        </label>

        <Select
          label="Notice Period"
          options={NOTICE_OPTIONS}
          value={filters.noticePeriod}
          placeholder="Any"
          onChange={(e) => patch({ noticePeriod: e.target.value })}
        />

        <Select
          label="Source"
          options={DISCOVERY_SOURCE_OPTIONS}
          value={filters.source}
          placeholder="Any source"
          onChange={(e) =>
            patch({
              source: e.target.value as DiscoveryListFilters['source'],
            })
          }
        />

        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#6B6B80]">
            Min Match Score ({filters.minScore})
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={filters.minScore}
            onChange={(e) => patch({ minScore: Number(e.target.value) })}
            className="w-full accent-[#2D2061]"
          />
        </label>
      </div>
    </SidePanel>
  )
}

const inputClass =
  'h-11 w-full rounded-md border border-[#ddd9e8] bg-white px-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10'
