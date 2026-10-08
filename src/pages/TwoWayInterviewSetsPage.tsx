import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarClock, EyeOff, FolderOpen, Search, SquarePen } from 'lucide-react'
import { PageContainer, PageHeader } from '../components/layout'
import {
  Button,
  SegmentedControl,
  ThreeDotsMenu,
  toast,
  type ThreeDotsMenuItem,
} from '../components/ui'
import { cn } from '../lib/cn'
import {
  SETUP_STATUS_META,
  getTwoWayInterviewSets,
  type TwoWayInterviewSet,
} from '../data/twoWayInterviewSets'

type SetStatus = 'active' | 'inactive'

/**
 * E2E Interviews → Two-Way Interviews → Interview Sets.
 * Same layout as One-Way Interviews: cards, Active/Inactive switch, ⋮ menu.
 */
export function TwoWayInterviewSetsPage() {
  const navigate = useNavigate()
  const [sets, setSets] = useState(() => getTwoWayInterviewSets())
  const [status, setStatus] = useState<SetStatus>('active')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return sets.filter(
      (set) =>
        set.active === (status === 'active') &&
        (!q ||
          set.jobTitle.toLowerCase().includes(q) ||
          set.jobReqId.toLowerCase().includes(q)),
    )
  }, [sets, status, query])

  function setActive(set: TwoWayInterviewSet, active: boolean) {
    setSets((current) => current.map((s) => (s.id === set.id ? { ...s, active } : s)))
    toast.success(`“${set.jobTitle}” marked as ${active ? 'active' : 'inactive'}.`, {
      title: 'Interview Set',
    })
  }

  function handleAction(actionId: string, set: TwoWayInterviewSet) {
    switch (actionId) {
      case 'open':
        toast.success(`Opening the interview set for “${set.jobTitle}”.`, {
          title: 'Open interview set',
        })
        return
      case 'edit':
        toast.success(`Configuring “${set.jobTitle}” will open here.`, {
          title: 'Edit Interview Set',
        })
        return
      case 'schedule':
        toast.success(`Scheduling for “${set.jobTitle}” will open here.`, {
          title: 'Schedule Interviews',
        })
        return
      case 'toggleActive':
        setActive(set, !set.active)
        return
    }
  }

  return (
    <PageContainer contentClassName="gap-5">
      <PageHeader
        title="Interview Sets"
        subtitle="One set per job: its rounds, panel members, booking slots and status mapping — and, per round, whether Two-Way AI joins. Covers AI and non-AI interviews."
        actions={
          <Button
            type="button"
            onClick={() => navigate('/e2e-interviews/two-way/interview-sets/new')}
            className="!h-10 !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
          >
            Configure Interview Set
          </Button>
        }
      />

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
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by job title or requisition ID"
            aria-label="Search by job title or requisition ID"
            className="h-10 w-full rounded-md border border-[#E0DDEA] bg-white py-2 pl-10 pr-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
          />
        </div>
        <SegmentedControl
          value={status}
          aria-label="Interview set status"
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
          onChange={setStatus}
          className="w-full sm:w-auto"
        />
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((set) => (
          <InterviewSetCard
            key={set.id}
            set={set}
            onAction={(id) => handleAction(id, set)}
          />
        ))}

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E0DDEA] bg-white px-6 py-12 text-center">
            <p className="text-sm font-semibold text-[#2D2061]">
              No {status} interview sets found
            </p>
            <p className="mt-1 text-sm text-[#8B8B9E]">
              Adjust your search or configure a new interview set.
            </p>
          </div>
        ) : null}
      </div>
    </PageContainer>
  )
}

function InterviewSetCard({
  set,
  onAction,
}: {
  set: TwoWayInterviewSet
  onAction: (id: string) => void
}) {
  const statusMeta = SETUP_STATUS_META[set.setupStatus]
  const menuItems: ThreeDotsMenuItem[] = [
    {
      id: 'open',
      label: 'Open interview set',
      icon: <FolderOpen strokeWidth={1.75} aria-hidden="true" />,
    },
    {
      id: 'edit',
      label: 'Edit Interview Set',
      icon: <SquarePen strokeWidth={1.75} aria-hidden="true" />,
    },
    {
      id: 'schedule',
      label: 'Schedule Interviews',
      icon: <CalendarClock strokeWidth={1.75} aria-hidden="true" />,
    },
    {
      id: 'toggleActive',
      label: set.active ? 'Mark as inactive' : 'Mark as active',
      icon: <EyeOff strokeWidth={1.75} aria-hidden="true" />,
    },
  ]

  return (
    <article className="rounded-xl border border-line bg-surface p-4 shadow-[0_1px_2px_rgba(45,32,97,0.04)] sm:px-5 sm:py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h3 className="text-sm font-bold text-[#2D2061] sm:text-base">{set.jobTitle}</h3>
          <span
            className={cn(
              'inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-semibold uppercase',
              statusMeta.className,
            )}
          >
            {statusMeta.label}
          </span>
          {set.aiRounds > 0 ? (
            <span className="inline-flex h-6 items-center rounded-full bg-[#FDE7EF] px-2.5 text-[11px] font-semibold text-[#C2185B]">
              Two-way on {set.aiRounds} {set.aiRounds === 1 ? 'round' : 'rounds'}
            </span>
          ) : null}
          <span className="text-xs text-[#8B8B9E]">
            {set.jobReqId}, {set.location}, updated {set.updatedOn}
          </span>
        </div>

        <ThreeDotsMenu
          triggerLabel={`Actions for ${set.jobTitle}`}
          side="left"
          items={menuItems}
          onItemSelect={onAction}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        <MetaField label="Rounds" value={String(set.rounds)} />
        <MetaField label="Ready" value={`${set.readyRounds} of ${set.rounds}`} />
        <MetaField label="Scheduled" value={String(set.scheduled)} />
        <MetaField label="Organiser" value={set.organiser} />
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
