import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ClipboardList,
  Copy,
  Info,
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

const VIEW_TABS: Array<{ value: PreInterviewView; label: string }> = [
  { value: 'sets', label: 'Pre-Interview Sets' },
  { value: 'interviews', label: 'All Pre-Interviews' },
]

const LIBRARY_TABS: Array<{ value: PreInterviewLibraryTab; label: string }> = [
  { value: 'all', label: 'All sets' },
  { value: 'prescreen', label: 'Chat Prescreens' },
  { value: 'assessment', label: 'Assessments' },
]

const BADGE_CLASS =
  'rounded-full px-2 py-0.5 text-[10px] font-semibold'

const LIST_PANEL_CLASS =
  'overflow-hidden rounded-[10px] border border-[#E8E6F0] bg-white shadow-[0_4px_18px_rgba(45,32,97,0.04)]'

const SEARCH_INPUT_CLASS =
  'h-10 w-full rounded-md border border-[#E0DDEA] bg-white py-2 pl-10 pr-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10'

const SET_HEADER_CLASS =
  'hidden grid-cols-[auto_minmax(0,1.6fr)_4.5rem_8.5rem_3.5rem_7rem_2.5rem] gap-3 border-b border-[#E8E6F0] bg-[#FAFAFC] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8B8B9E] lg:grid'

const SET_ROW_CLASS =
  'grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 px-4 py-3.5 lg:grid-cols-[auto_minmax(0,1.6fr)_4.5rem_8.5rem_3.5rem_7rem_2.5rem] lg:items-center'

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

  const filteredSets = useMemo(
    () =>
      filterSetsByLibrary(allSets, libraryTab).filter((set) =>
        matchesSetQuery(set, query),
      ),
    [allSets, libraryTab, query],
  )

  const viewOptions = VIEW_TABS.map((tab) => ({
    value: tab.value,
    label: `${tab.label} (${tab.value === 'sets' ? allSets.length : allInterviews.length})`,
  }))

  const libraryOptions = LIBRARY_TABS.map((tab) => ({
    value: tab.value,
    label: `${tab.label} (${countSetsByLibrary(allSets, tab.value)})`,
  }))

  const allVisibleSelected =
    filteredSets.length > 0 && filteredSets.every((set) => selected[set.id])
  const someVisibleSelected =
    filteredSets.some((set) => selected[set.id]) && !allVisibleSelected
  const selectAllRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someVisibleSelected
    }
  }, [someVisibleSelected])

  function toggleAll(checked: boolean) {
    setSelected((current) => {
      const next = { ...current }
      for (const set of filteredSets) {
        if (checked) next[set.id] = true
        else delete next[set.id]
      }
      return next
    })
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
            }}
            className="w-auto shrink-0 self-start"
          />

          <div className="flex items-start gap-2.5 rounded-lg border border-[#D4DCF0] bg-[#EEF2FA] px-3.5 py-3">
            <Info
              className="mt-0.5 size-4 shrink-0 text-[#3B6BC4]"
              strokeWidth={2}
              aria-hidden="true"
            />
            <p className="text-sm leading-relaxed text-[#3A4A6B]">
              The Default set is used for every chat unless a recruiter or a
              trigger picks another one. Send an assessment on its own, or
              straight after a chat in the same link (choose it when sending, or
              in a trigger).
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchField
              value={query}
              onChange={setQuery}
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

          <div className={LIST_PANEL_CLASS}>
            <div className={SET_HEADER_CLASS}>
              <div className="flex items-center">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={(e) => toggleAll(e.target.checked)}
                  className="size-4 shrink-0 rounded border-line accent-[#2D2061]"
                  aria-label="Select all sets"
                />
              </div>
              <span>Set</span>
              <span className="text-center">Questions</span>
              <span>Pass mark</span>
              <span className="text-center">Sent</span>
              <span>Updated on</span>
              <span className="sr-only">Actions</span>
            </div>

            {filteredSets.length === 0 ? (
              <EmptyState message="No Pre-Interview Sets match this view." />
            ) : (
              <ul className="divide-y divide-[#E8E6F0]">
                {filteredSets.map((set) => (
                  <PreInterviewSetRow
                    key={set.id}
                    set={set}
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
                ))}
              </ul>
            )}
          </div>
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

function EmptyState({ message }: { message: string }) {
  return (
    <div className="px-5 py-10 text-center text-sm text-[#6B6B80]">
      {message}
    </div>
  )
}

function PreInterviewSetRow({
  set,
  checked,
  onCheckedChange,
  onOpen,
  onViewQuestions,
  onInvite,
  onEdit,
}: {
  set: PreInterviewSet
  checked: boolean
  onCheckedChange: () => void
  onOpen: () => void
  onViewQuestions: () => void
  onInvite: () => void
  onEdit: () => void
}) {
  const nextVersion = set.version + 1
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

  const progressPct =
    set.total === 0 ? 0 : Math.round((set.completed / set.total) * 100)

  return (
    <li className={SET_ROW_CLASS}>
      <div className="flex items-center pt-0.5 lg:pt-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onCheckedChange}
          className="size-4 shrink-0 rounded border-line accent-[#2D2061]"
          aria-label={`Select ${set.name}`}
        />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpen}
            className="text-left text-sm font-bold text-[#1A1A2E] hover:text-[#2D2061] hover:underline"
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

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[#6B6B80] lg:hidden">
          <MetaCell label="Questions" value={String(set.questionCount)} />
          <div>
            <span className="font-semibold text-[#8B8B9E]">Pass mark</span>
            <p className="mt-0.5 font-medium text-[#2D2061]">
              <PassMarkCell set={set} />
            </p>
          </div>
          <MetaCell label="Sent" value={String(set.sentCount)} />
          <MetaCell label="Updated on" value={set.updatedOn} />
        </div>
      </div>

      <p className="hidden text-center text-sm font-medium tabular-nums text-[#2D2061] lg:block">
        {set.questionCount}
      </p>
      <div className="hidden text-sm text-[#2D2061] lg:block">
        <PassMarkCell set={set} />
      </div>
      <p className="hidden text-center text-sm font-medium tabular-nums text-[#2D2061] lg:block">
        {set.sentCount}
      </p>
      <p className="hidden text-sm text-[#6B6B80] lg:block">{set.updatedOn}</p>

      <div className="flex justify-end">
        <ThreeDotsMenu
          triggerLabel={`Actions for ${set.name}`}
          items={menuItems}
        />
      </div>
    </li>
  )
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-semibold text-[#8B8B9E]">{label}</span>
      <p className="mt-0.5 font-medium text-[#2D2061]">{value}</p>
    </div>
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
      const _exhaustive: never = kind
      return _exhaustive
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
        <span className="text-[#8B8B9E]"> Best score {set.bestScorePts} pts</span>
      ) : null}
    </span>
  )
}
