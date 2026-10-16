import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BellRing, CalendarClock, Eye, Search, Send, XCircle } from 'lucide-react'
import { PageContainer, PageHeader } from '../components/layout'
import { RescheduleInterviewPanel } from '../components/interviews/two-way/RescheduleInterviewPanel'
import { ViewScheduledInterviewPanel } from '../components/interviews/two-way/ViewScheduledInterviewPanel'
import {
  Button,
  DataTable,
  DataTableBody,
  DataTableEmpty,
  DataTableHead,
  DataTablePaginationBar,
  DataTableRow,
  DataTableTd,
  DataTableTh,
  Modal,
  Pagination,
  SegmentedControl,
  StatusPillBadge,
  ThreeDotsMenu,
  toast,
  type StatusPillOption,
  type ThreeDotsMenuItem,
} from '../components/ui'
import { cn } from '../lib/cn'
import {
  getScheduledInterviews,
  INTERVIEW_PANEL,
  type ScheduledInterview,
  type ScheduledInterviewResult,
  type ScheduledInterviewStatus,
} from '../data/scheduledInterviews'

const STATUS_PILL: Record<ScheduledInterviewStatus, StatusPillOption> = {
  completed: { value: 'completed', label: 'Completed', className: 'bg-[#E6F6EC] text-[#15803D]', dotClassName: 'bg-[#15803D]' },
  scheduled: { value: 'scheduled', label: 'Scheduled', className: 'bg-[#FDE7EF] text-[#C2185B]', dotClassName: 'bg-[#C2185B]' },
  invited: { value: 'invited', label: 'Invited', className: 'bg-[#E8EEFC] text-[#2F5BD3]', dotClassName: 'bg-[#2F5BD3]' },
  cancelled: { value: 'cancelled', label: 'Cancelled', className: 'bg-[#FDECEC] text-[#D92D20]', dotClassName: 'bg-[#D92D20]' },
}

const RESULT_PILL: Record<ScheduledInterviewResult, StatusPillOption> = {
  selected: { value: 'selected', label: 'Selected', className: 'bg-[#E6F6EC] text-[#15803D]', dotClassName: 'bg-[#15803D]' },
  awaiting: { value: 'awaiting', label: 'Awaiting', className: 'bg-[#FDF3D7] text-[#B7791F]', dotClassName: 'bg-[#B7791F]' },
  rejected: { value: 'rejected', label: 'Rejected', className: 'bg-[#FDECEC] text-[#D92D20]', dotClassName: 'bg-[#D92D20]' },
}

type RowActionId = 'view' | 'reschedule' | 'remind' | 'cancel'
type LeadMode = 'all' | 'aiAssisted' | 'humanLed'

/**
 * E2E Interviews → Two-Way Interviews → Scheduled Interviews.
 */
export function ScheduledInterviewsPage() {
  const [searchParams] = useSearchParams()
  const jobFromQuery = searchParams.get('job')?.trim() ?? ''
  const [rows, setRows] = useState(() => getScheduledInterviews())
  const [query, setQuery] = useState(jobFromQuery)
  const [leadMode, setLeadMode] = useState<LeadMode>('all')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [viewing, setViewing] = useState<ScheduledInterview | null>(null)
  const [rescheduling, setRescheduling] = useState<ScheduledInterview | null>(null)
  const [pendingCancel, setPendingCancel] = useState<ScheduledInterview | null>(null)

  // Keep the search box in sync when ?job= changes (e.g. from Interview Sets)
  const [appliedJobQuery, setAppliedJobQuery] = useState(jobFromQuery)
  if (jobFromQuery !== appliedJobQuery) {
    setAppliedJobQuery(jobFromQuery)
    if (jobFromQuery) {
      setQuery(jobFromQuery)
      setPage(1)
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (leadMode === 'aiAssisted' && row.type !== 'twoWayAi') return false
      if (leadMode === 'humanLed' && row.type !== 'standard') return false
      if (!q) return true
      return [row.candidate, row.email, row.job].join(' ').toLowerCase().includes(q)
    })
  }, [rows, query, leadMode])

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  function patchRow(id: string, patch: Partial<ScheduledInterview>) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)))
  }

  function handleAction(actionId: string, row: ScheduledInterview) {
    const id = actionId as RowActionId
    switch (id) {
      case 'view':
        setViewing(row)
        return
      case 'reschedule':
        setRescheduling(row)
        return
      case 'remind':
        toast.success(`Reminder sent to ${row.candidate} (${row.email}).`, {
          title: 'Send reminder',
        })
        return
      case 'cancel':
        setPendingCancel(row)
        return
      default: {
        const unreachable: never = id
        return unreachable
      }
    }
  }

  function confirmCancel() {
    if (!pendingCancel) return
    patchRow(pendingCancel.id, {
      status: 'cancelled',
      statusNote: 'Cancelled by recruiter',
      cancelledBy: 'You',
      rescheduleRequested: false,
      result: null,
    })
    toast.success(`Interview with ${pendingCancel.candidate} cancelled.`, {
      title: 'Cancel interview',
    })
    setPendingCancel(null)
  }

  function actionsFor(row: ScheduledInterview): ThreeDotsMenuItem[] {
    const cancelled = row.status === 'cancelled'
    const completed = row.status === 'completed'
    return [
      { id: 'view', label: 'View details', icon: <Eye strokeWidth={1.75} aria-hidden="true" /> },
      {
        id: 'reschedule',
        label: 'Reschedule',
        icon: <CalendarClock strokeWidth={1.75} aria-hidden="true" />,
        disabled: cancelled || completed,
      },
      {
        id: 'remind',
        label: 'Send reminder',
        icon: <BellRing strokeWidth={1.75} aria-hidden="true" />,
        disabled: cancelled || completed,
      },
      {
        id: 'cancel',
        label: 'Cancel interview',
        destructive: true,
        icon: <XCircle strokeWidth={1.75} aria-hidden="true" />,
        disabled: cancelled || completed,
      },
    ]
  }

  return (
    <PageContainer contentClassName="gap-5">
      <PageHeader
        title="Scheduled Interviews"
        subtitle="Every interview booked through your interview sets — Two-Way AI and standard panel interviews together."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
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
            className="h-11 w-full rounded-[5px] border border-[#E0DDEA] bg-white py-2 pr-12 pl-11 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
          />
          <span
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[#5B8DEF]"
            aria-hidden="true"
          >
            <Send className="size-4" strokeWidth={1.75} />
          </span>
        </div>
        <SegmentedControl
          value={leadMode}
          aria-label="Interview lead mode"
          options={[
            { value: 'all', label: 'All' },
            { value: 'aiAssisted', label: 'AI Assisted' },
            { value: 'humanLed', label: 'Human Led' },
          ]}
          onChange={(next) => {
            setLeadMode(next)
            setPage(1)
          }}
          className="w-full sm:w-auto"
        />
      </div>

      <DataTable
        minWidthClassName="min-w-[68rem]"
        footer={
          <DataTablePaginationBar
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(n) => {
              setRowsPerPage(n)
              setPage(1)
            }}
            pagination={
              <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
            }
          />
        }
      >
        <DataTableHead>
          <DataTableTh>Candidate</DataTableTh>
          <DataTableTh>Job · Round</DataTableTh>
          <DataTableTh>Type</DataTableTh>
          <DataTableTh>Slot</DataTableTh>
          <DataTableTh>Status</DataTableTh>
          <DataTableTh>Result</DataTableTh>
          <DataTableTh className="w-14">
            <span className="sr-only">Actions</span>
          </DataTableTh>
        </DataTableHead>
        <DataTableBody>
          {pageRows.length === 0 ? (
            <DataTableEmpty colSpan={7}>No interviews match your search.</DataTableEmpty>
          ) : (
            pageRows.map((row) => (
              <DataTableRow key={row.id} className="border-b border-[#F0EEF5] align-top">
                <DataTableTd className="!align-top">
                  <p className="font-semibold text-[#1A1A2E]">{row.candidate}</p>
                  <p className="mt-0.5 text-xs text-[#8B8B9E]">{row.email}</p>
                </DataTableTd>
                <DataTableTd className="!align-top">
                  <p className="font-medium text-[#1A1A2E]">{row.job}</p>
                  <p className="mt-0.5 text-xs text-[#6B6B80]">
                    Round {row.round} of {row.totalRounds}: {row.roundName}
                  </p>
                  <RoundChips row={row} />
                </DataTableTd>
                <DataTableTd className="!align-top">
                  <span
                    className={cn(
                      'inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold',
                      row.type === 'twoWayAi'
                        ? 'bg-[#FDE7EF] text-[#C2185B]'
                        : 'bg-[#EEEDF5] text-[#4A4760]',
                    )}
                  >
                    {row.type === 'twoWayAi' ? 'AI Assisted' : 'Human Led'}
                  </span>
                  <p className="mt-1 text-xs text-[#6B6B80]">{row.platform}</p>
                </DataTableTd>
                <DataTableTd className="!align-top">
                  {row.slot ? (
                    <p className="text-[#1A1A2E]">{row.slot}</p>
                  ) : (
                    <p className="text-[#8B8B9E]">Not booked</p>
                  )}
                  {row.rescheduleRequested ? (
                    <p className="mt-0.5 text-xs font-medium text-[#C2610C]">Reschedule requested</p>
                  ) : null}
                </DataTableTd>
                <DataTableTd className="!align-top">
                  <StatusPillBadge option={STATUS_PILL[row.status]} />
                  {row.statusNote ? (
                    <p className="mt-1 text-xs text-[#6B6B80]">{row.statusNote}</p>
                  ) : null}
                </DataTableTd>
                <DataTableTd className="!align-top">
                  {row.result ? (
                    <>
                      <StatusPillBadge option={RESULT_PILL[row.result]} />
                      <p className="mt-1 text-xs text-[#6B6B80]">
                        {[row.ratedSummary, row.aiFit != null ? `AI fit ${row.aiFit}%` : null]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    </>
                  ) : (
                    <span className="text-[#8B8B9E]">—</span>
                  )}
                </DataTableTd>
                <DataTableTd className="!align-top text-center">
                  <ThreeDotsMenu
                    triggerLabel={`Actions for ${row.candidate}`}
                    side="left"
                    items={actionsFor(row)}
                    onItemSelect={(id) => handleAction(id, row)}
                  />
                </DataTableTd>
              </DataTableRow>
            ))
          )}
        </DataTableBody>
      </DataTable>

      <ViewScheduledInterviewPanel
        open={viewing !== null}
        interview={viewing}
        onClose={() => setViewing(null)}
      />

      <RescheduleInterviewPanel
        open={rescheduling !== null}
        interview={rescheduling}
        panel={INTERVIEW_PANEL}
        onClose={() => setRescheduling(null)}
        onConfirm={(result) => {
          if (!rescheduling) return
          if (result.mode === 'pick') {
            patchRow(rescheduling.id, {
              slot: result.slot,
              status: 'scheduled',
              rescheduleRequested: false,
            })
            toast.success(`${rescheduling.candidate} moved to ${result.slot}.`, {
              title: 'Reschedule',
            })
          } else {
            toast.success(`Booking link sent to ${rescheduling.candidate}.`, {
              title: 'Reschedule',
            })
          }
          setRescheduling(null)
        }}
      />

      <Modal
        open={Boolean(pendingCancel)}
        onClose={() => setPendingCancel(null)}
        title="Cancel Interview"
        className="max-w-md"
        zClassName="z-[70]"
      >
        <p className="text-sm leading-relaxed text-[#4A4A5A]">
          Cancel the interview with{' '}
          <span className="font-semibold text-[#2D2061]">{pendingCancel?.candidate}</span>
          {pendingCancel?.slot ? (
            <>
              {' '}
              on {pendingCancel.slot}
            </>
          ) : null}
          ? The candidate and panel will be notified.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPendingCancel(null)}
            className="!h-10 !rounded-md !border-[#2D2061] !px-5 !text-[#2D2061] hover:!bg-[#F7F6FA]"
          >
            Keep interview
          </Button>
          <Button
            type="button"
            onClick={confirmCancel}
            className="!h-10 !rounded-md !bg-[#E53935] !px-5 text-sm font-semibold text-white hover:!bg-[#C62828]"
          >
            Cancel interview
          </Button>
        </div>
      </Modal>
    </PageContainer>
  )
}

/** R1…Rn: earlier rounds green, current round blue (green once completed), later grey. */
function RoundChips({ row }: { row: ScheduledInterview }) {
  return (
    <ul className="mt-1.5 flex gap-1" aria-label={`Round ${row.round} of ${row.totalRounds}`}>
      {Array.from({ length: row.totalRounds }, (_, i) => {
        const n = i + 1
        const done = n < row.round || (n === row.round && row.status === 'completed')
        const current = n === row.round && !done
        return (
          <li
            key={n}
            className={cn(
              'inline-flex h-5 min-w-7 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold',
              done
                ? 'bg-[#E6F6EC] text-[#15803D]'
                : current
                  ? 'bg-[#E8EEFC] text-[#2F5BD3]'
                  : 'bg-[#F0EFF4] text-[#8B8B9E]',
            )}
          >
            R{n}
          </li>
        )
      })}
    </ul>
  )
}
