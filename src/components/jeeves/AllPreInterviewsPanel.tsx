import { useMemo, useState } from 'react'
import { Search, Sparkles, Square } from 'lucide-react'
import {
  Button,
  DataTable,
  DataTableBody,
  DataTableEmpty,
  DataTableHead,
  DataTableRow,
  DataTableSortHeader,
  DataTableTd,
  DataTableTh,
  Select,
  StatusPillBadge,
  ThreeDotsMenu,
  toast,
  type StatusPillOption,
  type ThreeDotsMenuItem,
} from '../ui'
import { cn } from '../../lib/cn'
import {
  countInstancesByStatus,
  getPreInterviewInstances,
  getPreInterviewSets,
  matchesInstanceQuery,
  PRE_INTERVIEW_INSTANCE_STATUS_OPTIONS,
  type PreInterviewAssessment,
  type PreInterviewChatStatus,
  type PreInterviewInstance,
  type PreInterviewKnockout,
  type PreInterviewStoryCheck,
} from '../../data/jeevesPreInterviewSets'
import { JOBS } from '../../data/jobs'

const TOAST_TITLE = 'All Pre-Interviews'
const COL_SPAN = 9

const CHAT_STATUS_PILL: Record<
  Exclude<PreInterviewChatStatus, 'none'>,
  StatusPillOption
> = {
  completed: {
    value: 'completed',
    label: 'Completed',
    className: 'bg-[#E6F6EC] text-[#15803D]',
    dotClassName: 'bg-[#15803D]',
  },
  'in-progress': {
    value: 'in-progress',
    label: 'In progress',
    className: 'bg-[#FDF3D7] text-[#B7791F]',
    dotClassName: 'bg-[#B7791F]',
  },
  invited: {
    value: 'invited',
    label: 'Invited',
    className: 'bg-[#E8EEFC] text-[#2F5BD3]',
    dotClassName: 'bg-[#2F5BD3]',
  },
}

type SortKey =
  | 'name'
  | 'experience'
  | 'location'
  | 'knockout'
  | 'story'
  | 'chat'
  | 'assessment'

type SortDir = 'asc' | 'desc'

const COLUMNS: Array<{ id: SortKey; label: string }> = [
  { id: 'name', label: 'Candidate' },
  { id: 'experience', label: 'Experience' },
  { id: 'location', label: 'Location' },
  { id: 'knockout', label: 'Knockout' },
  { id: 'story', label: 'Story check' },
  { id: 'chat', label: 'Chat prescreen' },
  { id: 'assessment', label: 'Assessment' },
]

/**
 * All Pre-Interviews list — filters + DataTable with Jeeves summary rows.
 */
export function AllPreInterviewsPanel() {
  const allRows = useMemo(() => getPreInterviewInstances(), [])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [jobFilter, setJobFilter] = useState('')
  const [setFilter, setSetFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [storyFilter, setStoryFilter] = useState('')
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const statusCounts = useMemo(() => countInstancesByStatus(allRows), [allRows])

  const statusOptions = useMemo(
    () =>
      PRE_INTERVIEW_INSTANCE_STATUS_OPTIONS.map(({ value, label }) => ({
        value,
        label: `${label} (${statusCounts[value]})`,
      })),
    [statusCounts],
  )

  const jobOptions = useMemo(() => {
    const jobs = [...new Set(allRows.map((row) => row.jobTitle))].sort()
    const fromJobs = JOBS.filter((job) => job.status === 'active')
      .slice(0, 8)
      .map((job) => job.title)
    return [...new Set([...jobs, ...fromJobs])].map((job) => ({
      value: job,
      label: job,
    }))
  }, [allRows])

  const setOptions = useMemo(() => {
    const fromRows = allRows.flatMap((row) => {
      const names: string[] = []
      if (row.chatSetName) names.push(row.chatSetName)
      if (row.assessment.kind === 'scored') names.push(row.assessment.setName)
      return names
    })
    const fromLibrary = getPreInterviewSets().map((set) => set.name)
    return [...new Set([...fromRows, ...fromLibrary])]
      .sort()
      .map((name) => ({ value: name, label: name }))
  }, [allRows])

  const sourceOptions = useMemo(() => {
    const sources = [...new Set(allRows.map((row) => row.source))].sort()
    return sources.map((source) => ({ value: source, label: source }))
  }, [allRows])

  const storyOptions = [
    { value: 'safe', label: 'Safe' },
    { value: 'flagged', label: 'Flagged' },
    { value: 'pending', label: 'Pending' },
    { value: 'none', label: 'None' },
  ]

  const filtered = useMemo(() => {
    return allRows.filter((row) => {
      if (!matchesInstanceQuery(row, query)) return false
      if (statusFilter && row.status !== statusFilter) return false
      if (jobFilter && row.jobTitle !== jobFilter) return false
      if (sourceFilter && row.source !== sourceFilter) return false
      if (storyFilter && row.storyCheck !== storyFilter) return false
      if (setFilter) {
        const inChat = row.chatSetName === setFilter
        const inAssessment =
          row.assessment.kind === 'scored' &&
          row.assessment.setName === setFilter
        if (!inChat && !inAssessment) return false
      }
      return true
    })
  }, [
    allRows,
    query,
    statusFilter,
    jobFilter,
    setFilter,
    sourceFilter,
    storyFilter,
  ])

  const sorted = useMemo(() => {
    const rows = [...filtered]
    rows.sort((a, b) => {
      const cmp = sortValue(a, sortKey).localeCompare(sortValue(b, sortKey), undefined, {
        numeric: true,
      })
      return sortDir === 'asc' ? cmp : -cmp
    })
    return rows
  }, [filtered, sortKey, sortDir])

  const allSelected =
    sorted.length > 0 && sorted.every((row) => selected[row.id])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function toggleAll(checked: boolean) {
    if (!checked) {
      setSelected({})
      return
    }
    setSelected(Object.fromEntries(sorted.map((row) => [row.id, true])))
  }

  function toggleOne(id: string) {
    setSelected((current) => ({
      ...current,
      [id]: !current[id],
    }))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, email, job or ID"
            aria-label="Name, email, job or ID"
            className="h-10 w-full rounded-md border border-[#E0DDEA] bg-white py-2 pl-10 pr-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
          />
        </div>
        <div className="flex min-w-0 flex-wrap gap-2 xl:flex-nowrap">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            placeholder={`Any status (${statusCounts.all})`}
            className="w-full min-w-[12rem] sm:w-52"
          />
          <Select
            options={jobOptions}
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            placeholder="All jobs"
            className="w-full sm:w-36"
          />
          <Select
            options={setOptions}
            value={setFilter}
            onChange={(e) => setSetFilter(e.target.value)}
            placeholder="All pre-interview sets"
            className="w-full sm:w-48"
          />
          <Select
            options={sourceOptions}
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            placeholder="All sources"
            className="w-full sm:w-36"
          />
          <Select
            options={storyOptions}
            value={storyFilter}
            onChange={(e) => setStoryFilter(e.target.value)}
            placeholder="Any story check"
            className="w-full sm:w-40"
          />
        </div>
      </div>

      <DataTable
        minWidthClassName="min-w-[78rem] lg:min-w-[88rem]"
        footer={
          <p className="text-xs leading-relaxed text-[#8B8B9E]">
            {sorted.length} of {allRows.length} candidate
            {allRows.length === 1 ? '' : 's'} shown. Each candidate appears once
            per job; sending an assessment after the chat adds to the same row.
          </p>
        }
      >
        <DataTableHead>
          <DataTableTh checkbox>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => toggleAll(e.target.checked)}
              aria-label="Select all candidates"
              className="size-4 shrink-0 rounded border-[#C8C5D6] accent-[#2D2061]"
            />
          </DataTableTh>
          {COLUMNS.map((column) => (
            <DataTableSortHeader
              key={column.id}
              label={column.label}
              direction={sortKey === column.id ? sortDir : null}
              onSort={() => toggleSort(column.id)}
            />
          ))}
          <DataTableTh className="w-40 text-right">
            <span className="sr-only">Actions</span>
          </DataTableTh>
        </DataTableHead>
        <DataTableBody>
          {sorted.length === 0 ? (
            <DataTableEmpty colSpan={COL_SPAN}>
              No Pre-Interviews match the current filters.
            </DataTableEmpty>
          ) : (
            sorted.map((row) => (
              <CandidateBlock
                key={row.id}
                row={row}
                checked={Boolean(selected[row.id])}
                onCheckedChange={() => toggleOne(row.id)}
              />
            ))
          )}
        </DataTableBody>
      </DataTable>
    </div>
  )
}

function CandidateBlock({
  row,
  checked,
  onCheckedChange,
}: {
  row: PreInterviewInstance
  checked: boolean
  onCheckedChange: () => void
}) {
  const menuItems: ThreeDotsMenuItem[] = [
    {
      id: 'view-responses',
      label: 'View Responses',
      onSelect: () =>
        toast.success(`Opening responses for ${row.name}.`, {
          title: TOAST_TITLE,
        }),
    },
    {
      id: 'view-cv',
      label: 'View CV',
      onSelect: () =>
        toast.success(`Opening CV for ${row.name}.`, { title: TOAST_TITLE }),
    },
  ]

  return (
    <>
      <DataTableRow className="align-top hover:!bg-white">
        <DataTableTd checkbox className="!align-top">
          <input
            type="checkbox"
            checked={checked}
            onChange={onCheckedChange}
            aria-label={`Select ${row.name}`}
            className="size-4 shrink-0 rounded border-[#C8C5D6] accent-[#2D2061]"
          />
        </DataTableTd>
        <DataTableTd className="!whitespace-normal !align-top">
          <p className="font-semibold text-[#1A1A2E]">{row.name}</p>
          <p className="mt-0.5 text-xs text-[#8B8B9E]">{row.email}</p>
          <p className="mt-0.5 text-xs text-[#8B8B9E]">
            {row.jobTitle} {row.jobId}
          </p>
          {row.recommended ? (
            <span className="mt-1.5 inline-flex rounded-full bg-[#FCE9DC] px-2 py-0.5 text-[10px] font-semibold text-[#C05621]">
              Recommended
            </span>
          ) : null}
        </DataTableTd>
        <DataTableTd className="!whitespace-normal !align-top">
          <p className="text-[#1A1A2E]">{row.experience}</p>
          <span className="mt-1.5 inline-flex rounded-md bg-[#FDF3D7] px-2 py-0.5 text-[10px] font-semibold text-[#B7791F]">
            CV: {row.cvYears}
          </span>
        </DataTableTd>
        <DataTableTd className="!whitespace-normal !align-top">
          <p className="text-[#1A1A2E]">
            {row.city}, {row.region}
          </p>
          <p className="mt-0.5 text-xs text-[#8B8B9E]">{row.country}</p>
        </DataTableTd>
        <DataTableTd className="!align-top">
          <KnockoutBadge value={row.knockout} />
        </DataTableTd>
        <DataTableTd className="!align-top">
          <StoryCheckBadge value={row.storyCheck} />
        </DataTableTd>
        <DataTableTd className="!whitespace-normal !align-top">
          <ChatPrescreenCell row={row} />
        </DataTableTd>
        <DataTableTd className="!whitespace-normal !align-top">
          <AssessmentCell assessment={row.assessment} />
        </DataTableTd>
        <DataTableTd className="!align-top">
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                toast.success(`Opening history for ${row.name}.`, {
                  title: TOAST_TITLE,
                })
              }
              className="!h-8 !rounded-md border-[#D5D2E2] bg-white px-3 text-xs font-semibold text-[#2D2061] hover:bg-[#f7f6fb]"
            >
              View history
            </Button>
            <ThreeDotsMenu
              triggerLabel={`Actions for ${row.name}`}
              side="left"
              items={menuItems}
            />
          </div>
        </DataTableTd>
      </DataTableRow>
      <tr className="border-b border-[#E8E6F0] bg-white">
        <td colSpan={COL_SPAN} className="px-3 pb-4 pt-0">
          <div className="ml-12 flex items-start gap-2 rounded-md bg-[#F7F6FB] px-3 py-2.5">
            <Sparkles
              className="mt-0.5 size-3.5 shrink-0 text-[#5B4B9E]"
              strokeWidth={2}
              aria-hidden="true"
            />
            <p className="text-xs leading-relaxed text-[#4A4760]">
              <span className="font-semibold uppercase tracking-[0.04em] text-[#5B4B9E]">
                Jeeves summary
              </span>{' '}
              <span className="text-[#6B6B80]">{row.jeevesSummary}</span>
            </p>
          </div>
        </td>
      </tr>
    </>
  )
}

function ChatPrescreenCell({ row }: { row: PreInterviewInstance }) {
  if (row.chatStatus === 'none') {
    return <span className="text-[#8B8B9E]">—</span>
  }
  return (
    <div className="flex flex-col gap-1">
      <StatusPillBadge option={CHAT_STATUS_PILL[row.chatStatus]} />
      {row.chatCompletedOn ? (
        <p className="text-xs text-[#8B8B9E]">
          Completed {row.chatCompletedOn}
        </p>
      ) : null}
      {row.chatSetName ? (
        <button
          type="button"
          onClick={() =>
            toast.success(`Opening “${row.chatSetName}”.`, {
              title: TOAST_TITLE,
            })
          }
          className="w-fit text-left text-xs font-semibold text-[#5B4B9E] hover:text-[#2D2061] hover:underline"
        >
          {row.chatSetName}
        </button>
      ) : null}
    </div>
  )
}

function AssessmentCell({ assessment }: { assessment: PreInterviewAssessment }) {
  switch (assessment.kind) {
    case 'none':
      return <span className="text-[#8B8B9E]">—</span>
    case 'send':
      return (
        <div className="flex flex-col gap-1.5">
          <Button
            type="button"
            onClick={() =>
              toast.success('Send assessment opened.', { title: TOAST_TITLE })
            }
            className="!h-8 w-fit !rounded-md !bg-[#2D2061] px-3 text-xs font-semibold text-white hover:!bg-[#241a52]"
          >
            Send assessment
          </Button>
          <p className="text-xs text-[#8B8B9E]">{assessment.hint}</p>
        </div>
      )
    case 'scored': {
      const passed = assessment.passed
      return (
        <div className="flex flex-col gap-1">
          <span
            className={cn(
              'inline-flex w-fit rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none',
              passed
                ? 'bg-[#E6F6EC] text-[#15803D]'
                : 'bg-[#FDECEC] text-[#D92D20]',
            )}
          >
            {assessment.percent}%
          </span>
          <p className="text-xs text-[#6B6B80]">
            {passed
              ? 'Passed'
              : `Below ${assessment.passMarkPercent}% pass mark`}
          </p>
          <p className="text-xs text-[#8B8B9E]">
            Completed {assessment.completedOn}
          </p>
          <button
            type="button"
            onClick={() =>
              toast.success(`Opening “${assessment.setName}”.`, {
                title: TOAST_TITLE,
              })
            }
            className={cn(
              'w-fit text-left text-xs font-semibold hover:underline',
              passed ? 'text-[#5B4B9E]' : 'text-[#D92D20]',
            )}
          >
            {assessment.setName}
          </button>
        </div>
      )
    }
    default: {
      const exhaustive: never = assessment
      return exhaustive
    }
  }
}

function KnockoutBadge({ value }: { value: PreInterviewKnockout }) {
  switch (value) {
    case 'no':
      return (
        <span className="inline-flex rounded-full border border-[#A7E0C2] bg-[#E6F6EC] px-2.5 py-1 text-[12px] font-semibold text-[#15803D]">
          No
        </span>
      )
    case 'yes':
      return (
        <span className="inline-flex rounded-full border border-[#F5B5B0] bg-[#FDECEC] px-2.5 py-1 text-[12px] font-semibold text-[#D92D20]">
          Yes
        </span>
      )
    case 'pending':
      return (
        <span className="inline-flex rounded-full border border-[#E4E1EE] bg-[#F5F4FA] px-2.5 py-1 text-[12px] font-semibold text-[#8B8B9E]">
          Pending
        </span>
      )
    default: {
      const exhaustive: never = value
      return exhaustive
    }
  }
}

function StoryCheckBadge({ value }: { value: PreInterviewStoryCheck }) {
  switch (value) {
    case 'safe':
      return (
        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#15803D]">
          <Square
            className="size-3 fill-[#15803D] text-[#15803D]"
            strokeWidth={0}
            aria-hidden="true"
          />
          Safe
        </span>
      )
    case 'flagged':
      return (
        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#D92D20]">
          <Square
            className="size-3 fill-[#D92D20] text-[#D92D20]"
            strokeWidth={0}
            aria-hidden="true"
          />
          Flagged
        </span>
      )
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#B7791F]">
          <Square
            className="size-3 fill-[#B7791F] text-[#B7791F]"
            strokeWidth={0}
            aria-hidden="true"
          />
          Pending
        </span>
      )
    case 'none':
      return <span className="text-[#8B8B9E]">—</span>
    default: {
      const exhaustive: never = value
      return exhaustive
    }
  }
}

function sortValue(row: PreInterviewInstance, key: SortKey): string {
  switch (key) {
    case 'name':
      return row.name
    case 'experience':
      return row.experience
    case 'location':
      return `${row.city} ${row.country}`
    case 'knockout':
      return row.knockout
    case 'story':
      return row.storyCheck
    case 'chat':
      return row.chatStatus
    case 'assessment':
      if (row.assessment.kind === 'scored') return String(row.assessment.percent)
      if (row.assessment.kind === 'send') return 'send'
      return 'none'
    default: {
      const exhaustive: never = key
      return exhaustive
    }
  }
}
