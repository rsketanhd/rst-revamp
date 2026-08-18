import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, SlidersHorizontal, SquarePen, EyeOff, Copy } from 'lucide-react'
import { PageContainer, PageHeader } from '../components/layout'
import { OneWayFilterSortPanel } from '../components/interviews/OneWayFilterSortPanel'
import { OneWaySettingsPanel } from '../components/interviews/OneWaySettingsPanel'
import {
  BulkActionsBar,
  Button,
  SegmentedControl,
  ThreeDotsMenu,
  toast,
  type ThreeDotsMenuItem,
} from '../components/ui'
import { cn } from '../lib/cn'
import {
  ONE_WAY_TYPE_META,
  countOneWayFilters,
  emptyOneWayFilters,
  getOneWayInterviews,
  type OneWayFilterValues,
  type OneWayInterview,
  type OneWayStatus,
} from '../data/oneWayInterviews'

const ROW_ACTIONS: Array<{ id: string; label: string; icon: ThreeDotsMenuItem['icon'] }> = [
  {
    id: 'viewEdit',
    label: 'View / Edit',
    icon: <SquarePen strokeWidth={1.75} aria-hidden="true" />,
  },
  {
    id: 'duplicate',
    label: 'Duplicate',
    icon: <Copy strokeWidth={1.75} aria-hidden="true" />,
  },
  {
    id: 'deactivate',
    label: 'Deactivate',
    icon: <EyeOff strokeWidth={1.75} aria-hidden="true" />,
  },
]

/**
 * One-Way Interviews list — matches design cards + Active/Inactive switcher.
 */
export function OneWayInterviewsPage() {
  const navigate = useNavigate()
  const all = useMemo(() => getOneWayInterviews(), [])

  const [status, setStatus] = useState<OneWayStatus>('active')
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [filters, setFilters] = useState<OneWayFilterValues>(emptyOneWayFilters)

  const jobReqIdOptions = useMemo(
    () => [...new Set(all.map((i) => i.jobReqId))].sort(),
    [all],
  )
  const recruiterOptions = useMemo(
    () => [...new Set(all.map((i) => i.recruiter))].sort(),
    [all],
  )

  const filtered = useMemo(() => {
    let rows = all.filter((item) => item.status === status)
    if (filters.type) {
      rows = rows.filter((item) => item.type === filters.type)
    }
    if (filters.jobReqId) {
      rows = rows.filter((item) => item.jobReqId === filters.jobReqId)
    }
    if (filters.recruiter) {
      rows = rows.filter((item) => item.recruiter === filters.recruiter)
    }

    rows = [...rows].sort((a, b) => {
      switch (filters.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'createdOn':
          return a.createdOn.localeCompare(b.createdOn)
        case 'updatedOn':
          return a.updatedOn.localeCompare(b.updatedOn)
        default: {
          const _exhaustive: never = filters.sortBy
          return _exhaustive
        }
      }
    })
    return rows
  }, [all, status, filters])

  const totalFound = filtered.length
  const selectedCount = Object.values(selected).filter(Boolean).length
  const filterCount = countOneWayFilters(filters)

  function toggleSelect(id: string) {
    setSelected((current) => ({ ...current, [id]: !current[id] }))
  }

  function toggleSelectAll(checked: boolean) {
    if (!checked) {
      setSelected({})
      return
    }
    setSelected(Object.fromEntries(filtered.map((r) => [r.id, true])))
  }

  function handleRowAction(id: string, interview: OneWayInterview) {
    if (id === 'viewEdit') {
      navigate(`/e2e-interviews/one-way/${interview.id}`)
      return
    }
    if (id === 'duplicate') {
      toast.success(`Duplicated “${interview.title}”.`, { title: 'Duplicate' })
      return
    }
    if (id === 'deactivate') {
      toast.success(`“${interview.title}” set inactive.`, {
        title: 'Deactivate',
      })
    }
  }

  return (
    <PageContainer contentClassName="gap-5">
      <PageHeader
        title="One-Way Interviews"
        subtitle="Manage and track all one-way interviews"
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSettingsOpen(true)}
              className="!h-10 !rounded-md border-[#2D2061] bg-white px-4 text-sm font-semibold text-[#2D2061] hover:bg-[#f7f6fb]"
            >
              <Settings className="size-4" strokeWidth={2} aria-hidden="true" />
              1 Way Settings
            </Button>
            <Button
              type="button"
              onClick={() => navigate('/e2e-interviews/one-way/new')}
              className="!h-10 !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
            >
              Create Interview
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="text-sm text-[#2D2061]/80">
          <span className="font-semibold tabular-nums">
            &quot;{String(totalFound).padStart(2, '0')} Interviews found&quot;
          </span>
        </p>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          <SegmentedControl
            value={status}
            aria-label="Interview status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            onChange={(next) => {
              setStatus(next)
              setSelected({})
            }}
            className="w-full sm:w-auto"
          />
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="relative inline-flex h-9 items-center justify-center gap-2 rounded-full border border-[#E0DDEA] bg-white px-3.5 text-xs font-semibold text-[#2D2061] transition-colors hover:bg-[#f7f6fb] sm:h-8"
          >
            <SlidersHorizontal className="size-3.5" strokeWidth={2} aria-hidden="true" />
            Filter &amp; Sort By
            {filterCount > 0 ? (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#2D2061] px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white">
                {filterCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {selectedCount > 0 ? (
        <BulkActionsBar
          selectedCount={selectedCount}
          entityLabel="Interviews"
          actions={ROW_ACTIONS.map(({ id, label, icon }) => ({
            id,
            label,
            icon,
          }))}
          onAction={(id) => {
            toast.success(`Bulk action “${id}” applied to ${selectedCount} interview(s).`, {
              title: 'Bulk action',
            })
          }}
          onClear={() => setSelected({})}
          selectAll={{
            checked:
              filtered.length > 0 && filtered.every((r) => selected[r.id]),
            indeterminate:
              selectedCount > 0 && selectedCount < filtered.length,
            onChange: toggleSelectAll,
          }}
        />
      ) : null}

      <div className="flex flex-col gap-3">
        {filtered.map((interview) => (
          <InterviewCard
            key={interview.id}
            interview={interview}
            selected={Boolean(selected[interview.id])}
            onSelectChange={() => toggleSelect(interview.id)}
            onAction={(actionId) => handleRowAction(actionId, interview)}
            onOpen={() => navigate(`/e2e-interviews/one-way/${interview.id}`)}
          />
        ))}

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E0DDEA] bg-white px-6 py-12 text-center">
            <p className="text-sm font-semibold text-[#2D2061]">
              No {status} interviews found
            </p>
            <p className="mt-1 text-sm text-[#8B8B9E]">
              Adjust filters or create a new one-way interview.
            </p>
          </div>
        ) : null}
      </div>

      <OneWayFilterSortPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={filters}
        jobReqIdOptions={jobReqIdOptions}
        recruiterOptions={recruiterOptions}
        onApply={setFilters}
      />

      <OneWaySettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </PageContainer>
  )
}

function InterviewCard({
  interview,
  selected,
  onSelectChange,
  onAction,
  onOpen,
}: {
  interview: OneWayInterview
  selected: boolean
  onSelectChange: () => void
  onAction: (id: string) => void
  onOpen: () => void
}) {
  const typeMeta = ONE_WAY_TYPE_META[interview.type]
  const menuItems: ThreeDotsMenuItem[] = ROW_ACTIONS.map((item) => ({
    id: item.id,
    label: item.label,
    icon: item.icon,
  }))

  return (
    <article className="rounded-xl border border-line bg-surface p-4 shadow-[0_1px_2px_rgba(45,32,97,0.04)] sm:px-5 sm:py-4">
      <div className="flex gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelectChange}
          className="mt-1 size-4 shrink-0 rounded border-line accent-[#2D2061]"
          aria-label={`Select ${interview.title}`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onOpen}
                className="text-left text-sm font-bold text-[#2D2061] transition-colors hover:text-[#241a52] hover:underline sm:text-base"
              >
                {interview.title}
              </button>
              <span
                className={cn(
                  'inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-semibold',
                  typeMeta.className,
                )}
              >
                {typeMeta.label}
              </span>
            </div>

            <ThreeDotsMenu
              triggerLabel={`Actions for ${interview.title}`}
              side="left"
              items={menuItems}
              onItemSelect={onAction}
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
            <MetaField label="Created On" value={interview.createdOn} />
            <MetaField label="Updated On" value={interview.updatedOn} />
            <MetaField
              label="Link Expiration Duration"
              value={interview.linkExpiration}
            />
            <MetaField
              label="Templates Created"
              value={interview.templatesCreated}
            />
          </div>
        </div>
      </div>
    </article>
  )
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium text-[#8B8B9E]">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-[#2D2061]">{value}</p>
    </div>
  )
}
