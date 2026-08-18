import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { SidePanel } from './SidePanel'
import { SearchSelect } from './SearchSelect'
import { cn } from '../../lib/cn'

export type FilterSortPanelProps = {
  open: boolean
  onClose: () => void
  /** Currently applied values (shown when the panel reopens) */
  value?: FilterSortValues
  onApply?: (values: FilterSortValues) => void
}

export type SortOption = 'createdOn' | 'updatedOn' | 'jobReqId' | 'jobTitle'

export type FilterSortValues = {
  sortBy: SortOption
  jobReqId: string[]
  jobTitle: string[]
  leadRecruiter: string[]
  location: string[]
  client: string[]
  jobType: string
  jobCategory: string
  jobSubCategory: string
  brand: string
  project: string
}

const SORT_OPTIONS: Array<{ id: SortOption; label: string }> = [
  { id: 'createdOn', label: 'Created On' },
  { id: 'updatedOn', label: 'Updated On' },
  { id: 'jobReqId', label: 'Job Req ID' },
  { id: 'jobTitle', label: 'Job Title' },
]

const MULTI_FILTER_KEYS = [
  'jobReqId',
  'jobTitle',
  'leadRecruiter',
  'location',
  'client',
] as const

const SELECT_FILTER_KEYS = [
  'jobType',
  'jobCategory',
  'jobSubCategory',
  'brand',
  'project',
] as const

const SEARCH_FIELDS: Array<{
  key: (typeof MULTI_FILTER_KEYS)[number]
  label: string
  options: string[]
}> = [
  {
    key: 'jobReqId',
    label: 'Job Req ID',
    options: ['RST1345', 'RST1346', 'RST1347', 'RST1348', 'RST1401', 'RST1402'],
  },
  {
    key: 'jobTitle',
    label: 'Job Title',
    options: [
      'UI/UX Designer',
      'Frontend Developer',
      'Product Manager',
      'Data Analyst',
      'Backend Engineer',
      'HR Specialist',
    ],
  },
  {
    key: 'leadRecruiter',
    label: 'Lead Recruiter',
    options: [
      'Sarah Johnson',
      'Michael Chen',
      'Priya Shah',
      'David Park',
      'Aisha Khan',
      'James Wilson',
    ],
  },
  {
    key: 'location',
    label: 'Location (Primary)',
    options: [
      'San Francisco, CA',
      'New York, NY',
      'Austin, TX',
      'Remote',
      'London, UK',
      'Bangalore, IN',
    ],
  },
  {
    key: 'client',
    label: 'Client',
    options: [
      'Acme Corp',
      'Globex',
      'Initech',
      'Umbrella Health',
      'Stark Industries',
      'Wayne Enterprises',
    ],
  },
]

const SELECT_FIELDS: Array<{
  key: (typeof SELECT_FILTER_KEYS)[number]
  label: string
  options: string[]
}> = [
  {
    key: 'jobType',
    label: 'Job Type',
    options: ['Full-time', 'Part-time', 'Contract', 'Internship'],
  },
  {
    key: 'jobCategory',
    label: 'Job Category',
    options: ['Engineering', 'Design', 'Product', 'Sales', 'Marketing'],
  },
  {
    key: 'jobSubCategory',
    label: 'Job Sub Category',
    options: ['Frontend', 'Backend', 'UI/UX', 'Research'],
  },
  {
    key: 'brand',
    label: 'Brand',
    options: ['Recruitment SMART', 'RS Talent', 'RS Plus'],
  },
  {
    key: 'project',
    label: 'Project',
    options: ['Project Alpha', 'Project Beta', 'Project Gamma'],
  },
]

export const emptyFilterSortValues: FilterSortValues = {
  sortBy: 'createdOn',
  jobReqId: [],
  jobTitle: [],
  leadRecruiter: [],
  location: [],
  client: [],
  jobType: '',
  jobCategory: '',
  jobSubCategory: '',
  brand: '',
  project: '',
}

/** Count of applied Filter By criteria (multi tags + filled selects). */
export function countActiveFilters(values: FilterSortValues): number {
  let count = 0
  for (const key of MULTI_FILTER_KEYS) {
    count += values[key].length
  }
  for (const key of SELECT_FILTER_KEYS) {
    if (values[key]) count += 1
  }
  return count
}

export function FilterSortPanel({
  open,
  onClose,
  value = emptyFilterSortValues,
  onApply,
}: FilterSortPanelProps) {
  const [draft, setDraft] = useState<FilterSortValues>(value)

  useEffect(() => {
    if (open) {
      setDraft(value)
    }
  }, [open, value])

  function updateField<K extends keyof FilterSortValues>(
    key: K,
    next: FilterSortValues[K],
  ) {
    setDraft((current) => ({ ...current, [key]: next }))
  }

  function handleCancel() {
    setDraft(value)
    onClose()
  }

  function handleClearFilters() {
    setDraft((current) => ({
      ...emptyFilterSortValues,
      sortBy: current.sortBy,
    }))
  }

  function handleApply() {
    onApply?.(draft)
    onClose()
  }

  const hasDraftFilters = countActiveFilters(draft) > 0

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Filter & Sort"
      widthClassName="w-full max-w-[34rem]"
      footerClassName="justify-between"
      footer={
        <>
          <button
            type="button"
            onClick={handleClearFilters}
            disabled={!hasDraftFilters}
            className="inline-flex h-10 min-w-[5.5rem] items-center justify-center rounded-md px-3 text-sm font-medium text-[#2D2061] transition-colors hover:bg-[#f7f6fb] disabled:cursor-not-allowed disabled:text-[#A0A0B2] disabled:hover:bg-transparent"
          >
            Clear filters
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex h-10 min-w-[5.5rem] items-center justify-center rounded-md border border-[#d5d2e2] bg-white px-4 text-sm font-medium text-[#2D2061] transition-colors hover:bg-[#f7f6fb]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex h-10 min-w-[6.5rem] items-center justify-center rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#241a52]"
            >
              Apply Now
            </button>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-7">
        <section>
          <h3 className="mb-3 text-sm font-bold text-[#2D2061]">Sort By</h3>
          <div
            className={cn(
              'overflow-x-auto overflow-y-hidden pb-2',
              '[-ms-overflow-style:auto]',
              '[scrollbar-width:thin]',
              '[scrollbar-color:#2D2061_#e4e1ee]',
              '[&::-webkit-scrollbar]:h-1.5',
              '[&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#e4e1ee]',
              '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#2D2061]',
            )}
          >
            <div className="flex w-max flex-nowrap gap-2">
              {SORT_OPTIONS.map((option) => {
                const active = draft.sortBy === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => updateField('sortBy', option.id)}
                    className={cn(
                      'inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-full border px-3.5 text-xs font-medium transition-colors',
                      active
                        ? 'border-[#2D2061] bg-[#2D2061] text-white'
                        : 'border-[#ddd9e8] bg-white text-[#5c5878] hover:border-[#2D2061]/40 hover:text-[#2D2061]',
                    )}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-bold text-[#2D2061]">Filter By</h3>
          <div className="flex flex-col gap-4">
            {SEARCH_FIELDS.map((field) => (
              <FieldLabel key={field.key} label={field.label}>
                <SearchSelect
                  value={draft[field.key]}
                  onChange={(next) => updateField(field.key, next)}
                  options={field.options}
                  placeholder="Search and select multiple"
                />
              </FieldLabel>
            ))}

            {SELECT_FIELDS.map((field) => (
              <FieldLabel key={field.key} label={field.label}>
                <div className="relative">
                  <select
                    value={draft[field.key]}
                    onChange={(event) =>
                      updateField(field.key, event.target.value)
                    }
                    className={cn(
                      panelInputClass,
                      'appearance-none pr-9',
                      !draft[field.key] && 'text-[#A0A0B2]',
                    )}
                  >
                    <option value="">Select</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#A0A0B2]"
                    aria-hidden="true"
                  />
                </div>
              </FieldLabel>
            ))}
          </div>
        </section>
      </div>
    </SidePanel>
  )
}

function FieldLabel({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-[#2D2061]">{label}</span>
      {children}
    </div>
  )
}

const panelInputClass =
  'h-11 w-full rounded-md border border-[#ddd9e8] bg-white px-3 text-sm text-[#2D2061] outline-none transition-colors placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10'
