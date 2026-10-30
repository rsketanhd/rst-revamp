import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ClipboardList,
  Copy,
  Play,
  QrCode,
  Search,
  SlidersHorizontal,
  SquarePen,
  Trash2,
  UserPlus,
} from 'lucide-react'
import { PageContainer, PageHeader } from '../components/layout'
import { AllPreInterviewsPanel } from '../components/jeeves/AllPreInterviewsPanel'
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
  SegmentedControl,
  ThreeDotsMenu,
  toast,
  type ThreeDotsMenuItem,
} from '../components/ui'
import { cn } from '../lib/cn'
import {
  countSetsByLibrary,
  filterSetsByLibrary,
  getPreInterviewInstances,
  getPreInterviewSets,
  matchesSetQuery,
  type PreInterviewLibraryTab,
  type PreInterviewSet,
  type PreInterviewView,
} from '../data/jeevesPreInterviewSets'

const TOAST_TITLE = 'Jeeves AI'
const COL_SPAN = 7

const VIEW_TABS: Array<{ value: PreInterviewView; label: string }> = [
  { value: 'sets', label: 'Pre-Interview Sets' },
  { value: 'interviews', label: 'All Pre-Interviews' },
]

const LIBRARY_TABS: Array<{ value: PreInterviewLibraryTab; label: string }> = [
  { value: 'all', label: 'All sets' },
  { value: 'prescreen', label: 'Chat Prescreens' },
  { value: 'assessment', label: 'Assessments' },
]

const BADGE_CLASS = 'rounded-full px-2 py-0.5 text-[10px] font-semibold'

const SEARCH_INPUT_CLASS =
  'h-10 w-full rounded-md border border-[#E0DDEA] bg-white py-2 pl-10 pr-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10'

type SortKey = 'name' | 'questions' | 'passMark' | 'sent' | 'updatedOn'
type SortDir = 'asc' | 'desc'

const TABLE_COLUMNS: Array<{ id: SortKey; label: string }> = [
  { id: 'name', label: 'Set' },
  { id: 'questions', label: 'Questions' },
  { id: 'passMark', label: 'Pass mark' },
  { id: 'sent', label: 'Sent' },
  { id: 'updatedOn', label: 'Updated on' },
]

/**
 * Jeeves AI (Chatbot) — Pre-Interview Sets library and sent interviews.
 */
export function JeevesAiPage() {
  const navigate = useNavigate()
  const allSets = useMemo(() => getPreInterviewSets(), [])
  const allInterviews = useMemo(() => getPreInterviewInstances(), [])

  const [view, setView] = useState<PreInterviewView>('sets')
  const [libraryTab, setLibraryTab] = useState<PreInterviewLibraryTab>('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [questionsSet, setQuestionsSet] = useState<PreInterviewSet | null>(null)
  const [inviteSet, setInviteSet] = useState<PreInterviewSet | null>(null)
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const filteredSets = useMemo(
    () =>
      filterSetsByLibrary(allSets, libraryTab).filter((set) =>
        matchesSetQuery(set, query),
      ),
    [allSets, libraryTab, query],
  )

  const sortedSets = useMemo(() => {
    const rows = [...filteredSets]
    rows.sort((a, b) => {
      const cmp = sortValue(a, sortKey).localeCompare(
        sortValue(b, sortKey),
        undefined,
        { numeric: true },
      )
      return sortDir === 'asc' ? cmp : -cmp
    })
    return rows
  }, [filteredSets, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sortedSets.length / rowsPerPage))
  const currentPage = Math.min(page, totalPages)
  const pageRows = sortedSets.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  const viewOptions = VIEW_TABS.map((tab) => ({
    value: tab.value,
    label: `${tab.label} (${tab.value === 'sets' ? allSets.length : allInterviews.length})`,
  }))

  const libraryOptions = LIBRARY_TABS.map((tab) => ({
    value: tab.value,
    label: `${tab.label} (${countSetsByLibrary(allSets, tab.value)})`,
  }))

  const allPageSelected =
    pageRows.length > 0 && pageRows.every((set) => selected[set.id])

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
      setSelected((current) => {
        const next = { ...current }
        pageRows.forEach((set) => {
          delete next[set.id]
        })
        return next
      })
      return
    }
    setSelected((current) => ({
      ...current,
      ...Object.fromEntries(pageRows.map((set) => [set.id, true])),
    }))
  }

  function toggleOne(id: string) {
    setSelected((current) => ({
      ...current,
      [id]: !current[id],
    }))
  }

  function handleCreate() {
    navigate('/jeeves-ai/pre-interview-sets/new')
  }

  function handleFilter() {
    toast.success('Filter panel opened.', { title: TOAST_TITLE })
  }

  return (
    <PageContainer contentClassName="gap-5">
      <PageHeader
        title="Jeeves AI (Chatbot)"
        subtitle="Track application rates, click-through metrics, and candidate quality in real time to continuously improve your listings."
        actions={
          <Button
            type="button"
            onClick={handleCreate}
            className="!h-10 !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
          >
            Create Pre-Interview Set
          </Button>
        }
      />

      <SettingsUnderlineTabs
        aria-label="Pre-interview views"
        value={view}
        options={viewOptions}
        onChange={(next) => {
          setView(next)
          setQuery('')
          setSelected({})
          setPage(1)
        }}
      />

      {view === 'sets' ? (
        <>
          <SegmentedControl
            aria-label="Question library"
            value={libraryTab}
            options={libraryOptions}
            onChange={(next) => {
              setLibraryTab(next)
              setSelected({})
              setPage(1)
            }}
            className="w-auto shrink-0 self-start"
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchField
              value={query}
              onChange={(next) => {
                setQuery(next)
                setPage(1)
              }}
              placeholder="Search by set name or question"
              aria-label="Search by set name or question"
              className="min-w-0 flex-1"
            />
            <button
              type="button"
              onClick={handleFilter}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-[#2D2061]/25 bg-white px-4 text-sm font-medium text-[#2D2061] transition-colors hover:bg-[#faf9fd]"
            >
              <SlidersHorizontal
                className="size-4 shrink-0"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              Filter
            </button>
            <p className="shrink-0 text-sm text-[#6B6B80] sm:ml-1">
              {filteredSets.length}{' '}
              {filteredSets.length === 1
                ? 'Pre-Interview Set'
                : 'Pre-Interview Sets'}{' '}
              found
            </p>
          </div>

          <DataTable
            minWidthClassName="min-w-[32rem] sm:min-w-[52rem] lg:min-w-[64rem]"
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
                  direction={sortKey === column.id ? sortDir : null}
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
                  No Pre-Interview Sets match this view.
                </DataTableEmpty>
              ) : (
                pageRows.map((set, index) => (
                  <PreInterviewSetRow
                    key={set.id}
                    set={set}
                    zebra={index % 2 === 1}
                    checked={Boolean(selected[set.id])}
                    onCheckedChange={() => toggleOne(set.id)}
                    onOpen={() =>
                      navigate(`/jeeves-ai/pre-interview-sets/${set.id}`)
                    }
                    onViewQuestions={() => setQuestionsSet(set)}
                    onInvite={() => setInviteSet(set)}
                    onEdit={() =>
                      navigate(
                        `/jeeves-ai/pre-interview-sets/${set.id}/edit`,
                      )
                    }
                  />
                ))
              )}
            </DataTableBody>
          </DataTable>
        </>
      ) : (
        <AllPreInterviewsPanel />
      )}

      <ViewQuestionsPanel
        open={Boolean(questionsSet)}
        set={questionsSet}
        onClose={() => setQuestionsSet(null)}
      />
      <InviteCandidatesPanel
        open={Boolean(inviteSet)}
        set={inviteSet}
        onClose={() => setInviteSet(null)}
      />
    </PageContainer>
  )
}

function SearchField({
  value,
  onChange,
  placeholder,
  'aria-label': ariaLabel,
  className,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  'aria-label': string
  className?: string
}) {
  return (
    <div className={cn('relative', className)}>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={SEARCH_INPUT_CLASS}
      />
    </div>
  )
}

function PreInterviewSetRow({
  set,
  zebra,
  checked,
  onCheckedChange,
  onOpen,
  onViewQuestions,
  onInvite,
  onEdit,
}: {
  set: PreInterviewSet
  zebra: boolean
  checked: boolean
  onCheckedChange: () => void
  onOpen: () => void
  onViewQuestions: () => void
  onInvite: () => void
  onEdit: () => void
}) {
  const nextVersion = set.version + 1
  const progressPct =
    set.total === 0 ? 0 : Math.round((set.completed / set.total) * 100)

  const menuItems: ThreeDotsMenuItem[] = [
    {
      id: 'preview',
      label: 'Preview chat',
      icon: <Play strokeWidth={1.75} aria-hidden="true" />,
      onSelect: () =>
        toast.success(`Preview opened for “${set.name}”.`, {
          title: TOAST_TITLE,
        }),
    },
    {
      id: 'view-questions',
      label: 'View Questions',
      icon: <ClipboardList strokeWidth={1.75} aria-hidden="true" />,
      onSelect: onViewQuestions,
    },
    {
      id: 'edit',
      label: `Edit Set (saves as version ${nextVersion})`,
      icon: <SquarePen strokeWidth={1.75} aria-hidden="true" />,
      onSelect: onEdit,
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: <Copy strokeWidth={1.75} aria-hidden="true" />,
      onSelect: () =>
        toast.success(`“${set.name}” duplicated.`, { title: TOAST_TITLE }),
    },
    {
      id: 'invite',
      label: 'Invite Candidates',
      icon: <UserPlus strokeWidth={1.75} aria-hidden="true" />,
      onSelect: onInvite,
    },
    {
      id: 'walk-in',
      label: 'Walk-in apply link',
      icon: <QrCode strokeWidth={1.75} aria-hidden="true" />,
      onSelect: () =>
        toast.success(`Walk-in link copied for “${set.name}”.`, {
          title: TOAST_TITLE,
        }),
    },
    {
      id: 'delete',
      label: 'Delete set',
      destructive: true,
      icon: <Trash2 strokeWidth={1.75} aria-hidden="true" />,
      onSelect: () =>
        toast.success(`“${set.name}” deleted.`, { title: TOAST_TITLE }),
    },
  ]

  return (
    <DataTableRow className={zebra ? 'bg-[#FAFAFC]' : undefined}>
      <DataTableTd checkbox>
        <input
          type="checkbox"
          checked={checked}
          onChange={onCheckedChange}
          aria-label={`Select ${set.name}`}
          className="size-4 shrink-0 rounded border-[#C8C5D6] accent-[#2D2061]"
        />
      </DataTableTd>
      <DataTableTd className="!whitespace-normal">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpen}
            className="text-left text-[13px] font-semibold text-[#1A1A2E] hover:text-[#2D2061] hover:underline"
          >
            {set.name}
          </button>
          {set.isDefault ? (
            <span className={cn(BADGE_CLASS, 'bg-[#E8F1FE] text-[#2F6FD6]')}>
              Default
            </span>
          ) : null}
          <KindBadge kind={set.kind} />
        </div>
        <p className="mt-1 text-[11px] text-[#8B8B9E]">
          Saved {set.savedAt}
          {set.savedBy ? ` by ${set.savedBy}` : ''}
        </p>
        <div className="mt-2 flex max-w-xs items-center gap-2">
          <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#E8E6F0]">
            <div
              className={cn(
                'h-full rounded-full transition-[width]',
                progressPct === 100 ? 'bg-[#2F9E6B]' : 'bg-[#2D2061]',
              )}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="shrink-0 text-[11px] tabular-nums text-[#6B6B80]">
            {set.completed} of {set.total} completed
          </span>
        </div>
      </DataTableTd>
      <DataTableTd className="text-center tabular-nums">
        {set.questionCount}
      </DataTableTd>
      <DataTableTd className="!whitespace-normal">
        <PassMarkCell set={set} />
      </DataTableTd>
      <DataTableTd className="text-center tabular-nums">
        {set.sentCount}
      </DataTableTd>
      <DataTableTd muted>{set.updatedOn}</DataTableTd>
      <DataTableTd className="text-center">
        <ThreeDotsMenu
          triggerLabel={`Actions for ${set.name}`}
          side="left"
          items={menuItems}
        />
      </DataTableTd>
    </DataTableRow>
  )
}

function KindBadge({ kind }: { kind: PreInterviewSet['kind'] }) {
  switch (kind) {
    case 'prescreen':
      return (
        <span className={cn(BADGE_CLASS, 'bg-[#F0EDF8] text-[#5B4A9A]')}>
          Chat prescreen
        </span>
      )
    case 'assessment':
      return (
        <span className={cn(BADGE_CLASS, 'bg-[#FCE8F0] text-[#B5476A]')}>
          Assessment
        </span>
      )
    default: {
      const exhaustive: never = kind
      return exhaustive
    }
  }
}

function PassMarkCell({ set }: { set: PreInterviewSet }) {
  if (set.passMarkPercent == null) {
    return <span className="text-[#8B8B9E]">— No score</span>
  }
  return (
    <span>
      <span className="font-semibold">{set.passMarkPercent}%</span>
      {set.bestScorePts != null ? (
        <span className="text-[#8B8B9E]">
          {' '}
          Best score {set.bestScorePts} pts
        </span>
      ) : null}
    </span>
  )
}

function sortValue(set: PreInterviewSet, key: SortKey): string {
  switch (key) {
    case 'name':
      return set.name
    case 'questions':
      return String(set.questionCount)
    case 'passMark':
      return set.passMarkPercent == null ? '' : String(set.passMarkPercent)
    case 'sent':
      return String(set.sentCount)
    case 'updatedOn':
      return set.updatedOn
    default: {
      const exhaustive: never = key
      return exhaustive
    }
  }
}
