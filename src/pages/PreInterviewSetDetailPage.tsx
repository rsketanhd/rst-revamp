import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  ClipboardList,
  Info,
  Pencil,
  Search,
  UserPlus,
} from 'lucide-react'
import { PageContainer, PageHeader } from '../components/layout'
import { InviteCandidatesPanel } from '../components/jeeves/InviteCandidatesPanel'
import { ViewQuestionsPanel } from '../components/jeeves/ViewQuestionsPanel'
import { SettingsUnderlineTabs } from '../components/settings/SettingsUnderlineTabs'
import {
  Button,
  DataTable,
  DataTableBody,
  DataTableEmpty,
  DataTableHead,
  DataTablePaginationBar,
  DataTableRow,
  DataTableSortHeader,
  DataTableTd,
  DataTableTh,
  Pagination,
  Select,
  StatusPillBadge,
  ThreeDotsMenu,
  toast,
  type StatusPillOption,
  type ThreeDotsMenuItem,
} from '../components/ui'
import { cn } from '../lib/cn'
import {
  countCandidatesByStatus,
  getPreInterviewSetById,
  getSetCandidates,
  getSetVersions,
  kindLabel,
  setDetailSubtitle,
  type PreInterviewCandidateStatus,
  type PreInterviewCandidateStatusTab,
  type PreInterviewSet,
  type PreInterviewSetCandidate,
  type PreInterviewSetKind,
  type PreInterviewSetVersionFilter,
  type PreInterviewStepOutcome,
} from '../data/jeevesPreInterviewSets'

const LIST_PATH = '/jeeves-ai'
const TOAST_TITLE = 'Pre-Interview Set'
const COL_SPAN = 11

const STATUS_TABS: Array<{
  value: PreInterviewCandidateStatusTab
  label: string
}> = [
  { value: 'all', label: 'All' },
  { value: 'invited', label: 'Invited' },
  { value: 'completed', label: 'Completed' },
  { value: 'incomplete', label: 'Incomplete' },
  { value: 'expired', label: 'Expired' },
  { value: 'cancelled', label: 'Cancelled' },
]

const STATUS_PILL: Record<PreInterviewCandidateStatus, StatusPillOption> = {
  invited: {
    value: 'invited',
    label: 'Invited',
    className: 'bg-[#E8EEFC] text-[#2F5BD3]',
    dotClassName: 'bg-[#2F5BD3]',
  },
  completed: {
    value: 'completed',
    label: 'Completed',
    className: 'bg-[#E6F6EC] text-[#15803D]',
    dotClassName: 'bg-[#15803D]',
  },
  incomplete: {
    value: 'incomplete',
    label: 'Incomplete',
    className: 'bg-[#FDF3D7] text-[#B7791F]',
    dotClassName: 'bg-[#B7791F]',
  },
  expired: {
    value: 'expired',
    label: 'Expired',
    className: 'bg-[#F3F2F7] text-[#626889]',
    dotClassName: 'bg-[#8B8B9E]',
  },
  cancelled: {
    value: 'cancelled',
    label: 'Cancelled',
    className: 'bg-[#FDECEC] text-[#D92D20]',
    dotClassName: 'bg-[#D92D20]',
  },
}

const RESULT_PILL: Record<'passed' | 'failed', StatusPillOption> = {
  passed: {
    value: 'passed',
    label: 'Passed',
    className: 'bg-[#E6F6EC] text-[#15803D]',
    dotClassName: 'bg-[#15803D]',
  },
  failed: {
    value: 'failed',
    label: 'Failed',
    className: 'bg-[#FDECEC] text-[#D92D20]',
    dotClassName: 'bg-[#D92D20]',
  },
}

type SortKey =
  | 'name'
  | 'job'
  | 'step'
  | 'version'
  | 'sends'
  | 'invitedOn'
  | 'status'
  | 'result'
  | 'expiringOn'

type SortDir = 'asc' | 'desc'

const TABLE_COLUMNS: Array<{ id: SortKey; label: string }> = [
  { id: 'name', label: 'Name' },
  { id: 'job', label: 'Job' },
  { id: 'step', label: 'Step' },
  { id: 'version', label: 'Version' },
  { id: 'sends', label: 'Sends' },
  { id: 'invitedOn', label: 'Invited on' },
  { id: 'status', label: 'Status' },
  { id: 'result', label: 'Result' },
  { id: 'expiringOn', label: 'Expiring on' },
]

/**
 * Pre-Interview Set detail — versions, candidate status tabs, candidates table.
 */
export function PreInterviewSetDetailPage() {
  const navigate = useNavigate()
  const { setId = '' } = useParams()
  const set = useMemo(() => getPreInterviewSetById(setId), [setId])
  const versions = useMemo(() => (set ? getSetVersions(set) : []), [set])
  const allCandidates = useMemo(() => getSetCandidates(setId), [setId])

  const [versionFilter, setVersionFilter] =
    useState<PreInterviewSetVersionFilter>('all')
  const [statusTab, setStatusTab] =
    useState<PreInterviewCandidateStatusTab>('all')
  const [query, setQuery] = useState('')
  const [jobFilter, setJobFilter] = useState('')
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [questionsOpen, setQuestionsOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)

  const counts = useMemo(
    () => countCandidatesByStatus(allCandidates),
    [allCandidates],
  )

  const jobOptions = useMemo(() => {
    const jobs = [...new Set(allCandidates.map((c) => c.job))].sort()
    return [
      { value: '', label: `All jobs (${allCandidates.length})` },
      ...jobs.map((job) => ({ value: job, label: job })),
    ]
  }, [allCandidates])

  const statusOptions = useMemo(
    () =>
      STATUS_TABS.map((tab) => ({
        value: tab.value,
        label: `${tab.label} (${counts[tab.value]})`,
      })),
    [counts],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allCandidates.filter((candidate) => {
      if (statusTab !== 'all' && candidate.status !== statusTab) return false
      if (jobFilter && candidate.job !== jobFilter) return false
      if (
        q &&
        !candidate.name.toLowerCase().includes(q) &&
        !candidate.email.toLowerCase().includes(q) &&
        !candidate.job.toLowerCase().includes(q) &&
        !candidate.jobId.toLowerCase().includes(q)
      ) {
        return false
      }
      return true
    })
  }, [allCandidates, statusTab, jobFilter, query])

  const sorted = useMemo(() => {
    const rows = [...filtered]
    rows.sort((a, b) => {
      const av = sortValue(a, sortKey)
      const bv = sortValue(b, sortKey)
      const cmp = av.localeCompare(bv, undefined, { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
    return rows
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage))
  const currentPage = Math.min(page, totalPages)
  const pageRows = sorted.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  const allPageSelected =
    pageRows.length > 0 && pageRows.every((row) => selected[row.id])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function sortDirectionFor(key: SortKey) {
    return sortKey === key ? sortDir : null
  }

  function toggleAll(checked: boolean) {
    if (!checked) {
      setSelected((current) => {
        const next = { ...current }
        pageRows.forEach((row) => {
          delete next[row.id]
        })
        return next
      })
      return
    }
    setSelected((current) => ({
      ...current,
      ...Object.fromEntries(pageRows.map((row) => [row.id, true])),
    }))
  }

  function toggleOne(id: string) {
    setSelected((current) => ({
      ...current,
      [id]: !current[id],
    }))
  }

  if (!set) {
    return (
      <PageContainer contentClassName="gap-4">
        <button
          type="button"
          onClick={() => navigate(LIST_PATH)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D2061] hover:underline"
        >
          <ArrowLeft className="size-4" strokeWidth={2} aria-hidden="true" />
          Back to Pre-Interview Sets
        </button>
        <div className="rounded-xl border border-dashed border-[#E0DDEA] bg-white px-6 py-12 text-center">
          <p className="text-sm font-semibold text-[#2D2061]">Set not found</p>
          <p className="mt-1 text-sm text-[#8B8B9E]">
            This Pre-Interview Set may have been removed.
          </p>
        </div>
      </PageContainer>
    )
  }

  function inviteCandidates() {
    setInviteOpen(true)
  }

  return (
    <PageContainer contentClassName="gap-5">
      <button
        type="button"
        onClick={() => navigate(LIST_PATH)}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[#2D2061] transition-colors hover:text-[#241a52]"
      >
        <ArrowLeft className="size-4" strokeWidth={2} aria-hidden="true" />
        Back to Pre-Interview Sets
      </button>

      <PageHeader
        title={
          <span className="inline-flex flex-wrap items-center gap-2">
            <span>{`Pre-Interview Set: ${set.name}`}</span>
            {set.isDefault ? (
              <span className="rounded-full bg-[#E8F1FE] px-2 py-0.5 text-[10px] font-semibold text-[#2F6FD6]">
                Default
              </span>
            ) : null}
            <KindBadge kind={set.kind} />
          </span>
        }
        subtitle={setDetailSubtitle(set)}
        actions={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setQuestionsOpen(true)}
              className="!h-10 !rounded-md border-[#2D2061] bg-white px-4 text-sm font-semibold text-[#2D2061] hover:bg-[#f7f6fb]"
            >
              <ClipboardList
                className="size-4"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              View Questions
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate(`${LIST_PATH}/pre-interview-sets/${set.id}/edit`)
              }
              className="!h-10 !rounded-md border-[#2D2061] bg-white px-4 text-sm font-semibold text-[#2D2061] hover:bg-[#f7f6fb]"
            >
              <Pencil className="size-4" strokeWidth={1.75} aria-hidden="true" />
              Edit Set
            </Button>
            <Button
              type="button"
              onClick={inviteCandidates}
              className="!h-10 !rounded-md !bg-[#2D2061] px-4 text-sm font-semibold text-white hover:!bg-[#241a52]"
            >
              <UserPlus
                className="size-4"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              Invite Candidates
            </Button>
          </div>
        }
      />

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8B8B9E]">
            Versions
          </p>
          <Info
            className="size-3.5 text-[#8B8B9E]"
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {versions.map((version) => {
            const active = version.filter === versionFilter
            return (
              <button
                key={version.id}
                type="button"
                onClick={() => setVersionFilter(version.filter)}
                className={cn(
                  'rounded-[10px] border bg-white px-4 py-3.5 text-left transition-colors',
                  active
                    ? 'border-[#2D2061] ring-2 ring-[#2D2061]/15'
                    : 'border-[#E4E1EE] hover:border-[#C9C6D6]',
                )}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#8B8B9E]">
                  {version.label}
                </p>
                {version.savedAt ? (
                  <p className="mt-1 text-xs text-[#6B6B80]">{version.savedAt}</p>
                ) : null}
                <p className="mt-1 text-sm font-semibold text-[#2D2061]">
                  {version.candidateCount} candidate
                  {version.candidateCount === 1 ? '' : 's'}
                </p>
                <p className="text-xs text-[#8B8B9E]">
                  {version.completedCount} completed
                  {version.savedBy ? ` by ${version.savedBy}` : ''}
                </p>
              </button>
            )
          })}
        </div>
      </section>

      <SettingsUnderlineTabs
        aria-label="Candidate status"
        value={statusTab}
        options={statusOptions}
        onChange={(next) => {
          setStatusTab(next)
          setSelected({})
          setPage(1)
        }}
      />

      <div className="flex items-start gap-2.5 rounded-lg border border-[#D4DCF0] bg-[#EEF2FA] px-3.5 py-3">
        <Info
          className="mt-0.5 size-4 shrink-0 text-[#3B6BC4]"
          strokeWidth={2}
          aria-hidden="true"
        />
        <p className="text-sm leading-relaxed text-[#3A4A6B]">
          {statusBannerCopy(set, statusTab)}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Search by candidate or job"
            aria-label="Search by candidate or job"
            className="h-11 w-full rounded-md border border-[#ddd9e8] bg-white py-2 pl-10 pr-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
          />
        </div>
        <Select
          options={jobOptions}
          value={jobFilter}
          onChange={(e) => {
            setJobFilter(e.target.value)
            setPage(1)
          }}
          className="w-full sm:w-48"
        />
        <p className="shrink-0 text-sm text-[#6B6B80]">
          {filtered.length} candidate{filtered.length === 1 ? '' : 's'}
        </p>
      </div>

      <DataTable
        minWidthClassName="min-w-[32rem] sm:min-w-[56rem] lg:min-w-[72rem]"
        footer={
          <DataTablePaginationBar
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(next) => {
              setRowsPerPage(next)
              setPage(1)
            }}
            pagination={
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            }
          />
        }
      >
        <DataTableHead>
          <DataTableTh checkbox>
            <input
              type="checkbox"
              checked={allPageSelected}
              onChange={(e) => toggleAll(e.target.checked)}
              aria-label="Select all on this page"
              className="size-4 shrink-0 rounded border-[#C8C5D6] accent-[#2D2061]"
            />
          </DataTableTh>
          {TABLE_COLUMNS.map((column) => (
            <DataTableSortHeader
              key={column.id}
              label={column.label}
              direction={sortDirectionFor(column.id)}
              onSort={() => toggleSort(column.id)}
            />
          ))}
          <DataTableTh className="w-12 text-center">
            <span className="sr-only">Actions</span>
          </DataTableTh>
        </DataTableHead>
        <DataTableBody>
          {pageRows.length === 0 ? (
            <DataTableEmpty colSpan={COL_SPAN}>
              {allCandidates.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-2">
                  <p className="text-sm font-semibold text-[#2D2061]">
                    No candidates here yet
                  </p>
                  <Button
                    type="button"
                    onClick={inviteCandidates}
                    className="!h-10 !rounded-md !bg-[#2D2061] px-4 text-sm font-semibold text-white hover:!bg-[#241a52]"
                  >
                    Invite Candidates
                  </Button>
                </div>
              ) : (
                'No candidates match the current filters.'
              )}
            </DataTableEmpty>
          ) : (
            pageRows.map((row, index) => (
              <CandidateRow
                key={row.id}
                row={row}
                zebra={index % 2 === 1}
                checked={Boolean(selected[row.id])}
                onCheckedChange={() => toggleOne(row.id)}
              />
            ))
          )}
        </DataTableBody>
      </DataTable>

      <ViewQuestionsPanel
        open={questionsOpen}
        set={set}
        onClose={() => setQuestionsOpen(false)}
      />
      <InviteCandidatesPanel
        open={inviteOpen}
        set={set}
        onClose={() => setInviteOpen(false)}
      />
    </PageContainer>
  )
}

function CandidateRow({
  row,
  zebra,
  checked,
  onCheckedChange,
}: {
  row: PreInterviewSetCandidate
  zebra: boolean
  checked: boolean
  onCheckedChange: () => void
}) {
  const passedRow = row.result === 'passed'
  const menuItems: ThreeDotsMenuItem[] = [
    {
      id: 'view',
      label: 'View responses',
      onSelect: () =>
        toast.success(`Opening responses for ${row.name}.`, {
          title: TOAST_TITLE,
        }),
    },
    {
      id: 'resend',
      label: 'Resend link',
      onSelect: () =>
        toast.success(`Link resent to ${row.email}.`, { title: TOAST_TITLE }),
    },
  ]

  return (
    <DataTableRow
      className={cn(
        zebra && !passedRow ? 'bg-[#FAFAFC]' : undefined,
        passedRow ? '!bg-[#F3FBF6] hover:!bg-[#EAF8F0]' : undefined,
      )}
    >
      <DataTableTd checkbox>
        <input
          type="checkbox"
          checked={checked}
          onChange={onCheckedChange}
          aria-label={`Select ${row.name}`}
          className="size-4 shrink-0 rounded border-[#C8C5D6] accent-[#2D2061]"
        />
      </DataTableTd>
      <DataTableTd className="!whitespace-normal">
        <p className="font-semibold text-[#1A1A2E]">{row.name}</p>
        <p className="mt-0.5 text-xs text-[#8B8B9E]">{row.email}</p>
        {row.readyForAssessment ? (
          <button
            type="button"
            onClick={() =>
              toast.success(`Send assessment for ${row.name}.`, {
                title: TOAST_TITLE,
              })
            }
            className="mt-1.5 text-xs font-semibold text-[#1F7A54] hover:underline"
          >
            Ready: send an assessment →
          </button>
        ) : null}
      </DataTableTd>
      <DataTableTd className="!whitespace-normal">
        <p className="font-medium text-[#1A1A2E]">{row.job}</p>
        <p className="mt-0.5 text-xs text-[#8B8B9E]">{row.jobId}</p>
      </DataTableTd>
      <DataTableTd className="!whitespace-normal">
        <p className="text-[#1A1A2E]">{row.stepLabel}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {row.stepOutcomes.map((outcome, index) => (
            <StepChip key={`${row.id}-step-${index}`} outcome={outcome} />
          ))}
        </div>
      </DataTableTd>
      <DataTableTd>
        <button
          type="button"
          onClick={() =>
            toast.success(`Opening version v${row.version}.`, {
              title: TOAST_TITLE,
            })
          }
          className="text-[13px] font-semibold text-[#5B4B9E] transition-colors hover:text-[#2D2061] hover:underline"
        >
          v{row.version}
        </button>
      </DataTableTd>
      <DataTableTd className="!whitespace-normal">
        <span className="inline-flex rounded-md bg-[#2D2061] px-2 py-0.5 text-[10px] font-semibold text-white">
          v{row.version}
        </span>
        <p className="mt-1 text-xs text-[#8B8B9E]">
          {row.sendsUsed} of {row.sendsLimit} sends used
        </p>
      </DataTableTd>
      <DataTableTd muted>{row.invitedOn}</DataTableTd>
      <DataTableTd>
        <StatusPillBadge option={STATUS_PILL[row.status]} />
      </DataTableTd>
      <DataTableTd>
        {row.result === 'none' ? (
          <span className="text-[#8B8B9E]">—</span>
        ) : (
          <StatusPillBadge option={RESULT_PILL[row.result]} />
        )}
      </DataTableTd>
      <DataTableTd muted>{row.expiringOn}</DataTableTd>
      <DataTableTd className="text-center">
        <ThreeDotsMenu
          triggerLabel={`Actions for ${row.name}`}
          side="left"
          items={menuItems}
        />
      </DataTableTd>
    </DataTableRow>
  )
}

function StepChip({ outcome }: { outcome: PreInterviewStepOutcome }) {
  switch (outcome) {
    case 'passed':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#E7F6EF] px-2 py-0.5 text-[10px] font-semibold text-[#1F7A54]">
          <Check className="size-3" strokeWidth={2.5} aria-hidden="true" />
          Passed
        </span>
      )
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#FDECEC] px-2 py-0.5 text-[10px] font-semibold text-[#C0392B]">
          Failed
        </span>
      )
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#F0EFF4] px-2 py-0.5 text-[10px] font-semibold text-[#8B8B9E]">
          Pending
        </span>
      )
    default: {
      const exhaustive: never = outcome
      return exhaustive
    }
  }
}

function KindBadge({ kind }: { kind: PreInterviewSetKind }) {
  switch (kind) {
    case 'prescreen':
      return (
        <span className="rounded-full bg-[#F0EDF8] px-2 py-0.5 text-[10px] font-semibold text-[#5B4A9A]">
          Chat prescreen
        </span>
      )
    case 'assessment':
      return (
        <span className="rounded-full bg-[#FCE8F0] px-2 py-0.5 text-[10px] font-semibold text-[#B5476A]">
          Assessment
        </span>
      )
    default: {
      const exhaustive: never = kind
      return exhaustive
    }
  }
}

function sortValue(row: PreInterviewSetCandidate, key: SortKey): string {
  switch (key) {
    case 'name':
      return row.name
    case 'job':
      return row.job
    case 'step':
      return row.stepLabel
    case 'version':
      return String(row.version)
    case 'sends':
      return String(row.sendsUsed)
    case 'invitedOn':
      return row.invitedOn
    case 'status':
      return STATUS_PILL[row.status].label
    case 'result':
      return row.result
    case 'expiringOn':
      return row.expiringOn
    default: {
      const exhaustive: never = key
      return exhaustive
    }
  }
}

function statusBannerCopy(
  set: PreInterviewSet,
  tab: PreInterviewCandidateStatusTab,
): string {
  const kind = kindLabel(set.kind).toLowerCase()
  switch (tab) {
    case 'all':
      return `All: Every candidate sent this ${kind}, one row per candidate per job. Step shows whether an assessment followed in the same link.`
    case 'invited':
      return `Invited: Candidates who were sent this ${kind} and have not finished yet.`
    case 'completed':
      return `Completed: Candidates who finished this ${kind}.`
    case 'incomplete':
      return `Incomplete: Candidates who started but did not finish.`
    case 'expired':
      return `Expired: Invites that passed the expiry date without completion.`
    case 'cancelled':
      return `Cancelled: Invites that were withdrawn.`
    default: {
      const exhaustive: never = tab
      return exhaustive
    }
  }
}
