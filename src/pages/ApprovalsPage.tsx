import { useMemo, useState } from 'react'
import {
  ApprovalDelegationPanel,
  getDelegateLabel,
  type ApprovalDelegationForm,
} from '../components/approvals/ApprovalDelegationPanel'
import { ViewApprovalDelegationPanel } from '../components/approvals/ViewApprovalDelegationPanel'
import { JobViewEditPanel } from '../components/jobs/JobViewEditPanel'
import { PageContainer, PageHeader } from '../components/layout'
import { Button, SegmentedControl, toast } from '../components/ui'
import { SettingsUnderlineTabs } from '../components/settings/SettingsUnderlineTabs'
import {
  countApprovalsByInbox,
  countApprovalsByKind,
  filterApprovals,
  INITIAL_APPROVALS,
  jobListingFromApproval,
  type ApprovalInbox,
  type ApprovalKindFilter,
  type ApprovalRecord,
} from '../data/approvals'
import type { JobListing } from '../data/jobs'
import { cn } from '../lib/cn'

const INITIAL_DELEGATION: ApprovalDelegationForm = {
  delegateId: 'heli-shah',
  from: '2026-10-19',
  to: '2026-10-22',
}

type InboxTab = ApprovalInbox

const INBOX_TABS: Array<{ value: InboxTab; label: string }> = [
  { value: 'waiting-for-me', label: 'Waiting for me' },
  { value: 'submitted-by-me', label: 'Submitted by me' },
  { value: 'all-pending', label: 'All pending' },
  { value: 'completed', label: 'Completed' },
]

const KIND_FILTERS: Array<{ value: ApprovalKindFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'job', label: 'Jobs' },
  { value: 'offer', label: 'Offers' },
]

/**
 * Approvals inbox — jobs and offers waiting for a decision.
 */
export function ApprovalsPage() {
  const [approvals] = useState(INITIAL_APPROVALS)
  const [inbox, setInbox] = useState<InboxTab>('waiting-for-me')
  const [kindFilter, setKindFilter] = useState<ApprovalKindFilter>('all')
  const [delegation, setDelegation] = useState<ApprovalDelegationForm | null>(
    INITIAL_DELEGATION,
  )
  const [delegationPanelOpen, setDelegationPanelOpen] = useState(false)
  const [viewDelegationOpen, setViewDelegationOpen] = useState(false)
  const [detailJob, setDetailJob] = useState<JobListing | null>(null)
  const [jobViewFooter, setJobViewFooter] = useState<'default' | 'edit-only'>(
    'default',
  )
  const [approvalDetail, setApprovalDetail] = useState<ApprovalRecord | null>(
    null,
  )

  const visible = useMemo(
    () => filterApprovals(approvals, inbox, kindFilter),
    [approvals, inbox, kindFilter],
  )

  const inboxCounts = useMemo(
    () =>
      Object.fromEntries(
        INBOX_TABS.map((tab) => [
          tab.value,
          countApprovalsByInbox(approvals, tab.value),
        ]),
      ) as Record<InboxTab, number>,
    [approvals],
  )

  const kindCounts = useMemo(
    () =>
      Object.fromEntries(
        KIND_FILTERS.map((filter) => [
          filter.value,
          countApprovalsByKind(approvals, inbox, filter.value),
        ]),
      ) as Record<ApprovalKindFilter, number>,
    [approvals, inbox],
  )

  const tabOptions = INBOX_TABS.map((tab) => ({
    value: tab.value,
    label:
      tab.value === 'completed'
        ? tab.label
        : `${tab.label} (${inboxCounts[tab.value]})`,
  }))

  const kindSwitchOptions = KIND_FILTERS.map((filter) => ({
    value: filter.value,
    label: `${filter.label} (${kindCounts[filter.value]})`,
  }))

  return (
    <PageContainer contentClassName="gap-5">
      <PageHeader
        className="sm:items-center"
        title="Approvals"
        subtitle="Jobs and offers waiting for a decision, in one place. Open one to approve, request changes or reject."
        actions={
          delegation ? (
            <div
              className={cn(
                'flex max-w-full flex-wrap items-center gap-2.5 rounded-[8px] border border-[#D8D2EF] bg-[#F8F7FC] px-3 py-1.5',
              )}
            >
              <p className="min-w-0 truncate whitespace-nowrap text-sm text-[#4A4A60]">
                <span className="font-semibold text-[#2D2061]">
                  {getDelegateLabel(delegation.delegateId)}
                </span>
                <span className="text-[#8B8B9E]">
                  {' '}
                  · {delegation.from} – {delegation.to}
                </span>
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 !h-8 !rounded-md !px-3 !text-xs"
                onClick={() => setViewDelegationOpen(true)}
              >
                View Delegate
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 !h-8 !rounded-md !px-3 !text-xs"
              onClick={() => setDelegationPanelOpen(true)}
            >
              Set delegate
            </Button>
          )
        }
      />

      <div className="flex flex-col gap-4">
        <SettingsUnderlineTabs
          aria-label="Approval inbox"
          value={inbox}
          options={tabOptions}
          onChange={(value) => {
            setInbox(value)
            setKindFilter('all')
          }}
        />

        <SegmentedControl
          aria-label="Filter by type"
          value={kindFilter}
          options={kindSwitchOptions}
          onChange={setKindFilter}
          className="w-auto shrink-0 self-end"
        />
      </div>

      {visible.length === 0 ? (
        <div className="rounded-[10px] border border-[#E8E6F0] bg-white px-5 py-10 text-center shadow-[0_4px_18px_rgba(45,32,97,0.04)]">
          <p className="text-sm text-[#6B6B80]">
            No approvals in this view. Try another tab or filter.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((record) => (
            <li key={record.id}>
              <ApprovalCard
                record={record}
                onView={() => {
                  if (record.kind === 'job') {
                    setDetailJob(jobListingFromApproval(record))
                    if (inbox === 'submitted-by-me') {
                      setJobViewFooter('edit-only')
                      setApprovalDetail(null)
                    } else if (inbox === 'waiting-for-me') {
                      setJobViewFooter('edit-only')
                      setApprovalDetail(record)
                    } else {
                      setJobViewFooter('default')
                      setApprovalDetail(null)
                    }
                    return
                  }
                  toast.success(`Opening offer ${record.code}.`, {
                    title: 'Approvals',
                  })
                }}
              />
            </li>
          ))}
        </ul>
      )}

      {delegation ? (
        <ViewApprovalDelegationPanel
          open={viewDelegationOpen}
          delegation={delegation}
          onClose={() => setViewDelegationOpen(false)}
          onSave={(next) => {
            setDelegation(next)
            toast.success('Delegate saved.', { title: 'Approvals' })
          }}
          onEndDelegation={() => {
            setDelegation(null)
            setViewDelegationOpen(false)
            toast.success('Delegation ended.', { title: 'Approvals' })
          }}
        />
      ) : null}

      <ApprovalDelegationPanel
        open={delegationPanelOpen}
        onClose={() => setDelegationPanelOpen(false)}
        initial={null}
        onSave={(next) => {
          setDelegation(next)
          toast.success('Delegate saved.', { title: 'Approvals' })
        }}
      />

      <JobViewEditPanel
        open={Boolean(detailJob)}
        job={detailJob}
        viewFooter={jobViewFooter}
        approvalRecord={approvalDetail}
        onClose={() => {
          setDetailJob(null)
          setApprovalDetail(null)
        }}
        onApprovalDecided={() => {
          setDetailJob(null)
          setApprovalDetail(null)
        }}
        onSave={(job) => {
          toast.success(`“${job.title}” was saved.`, { title: 'Job updated' })
        }}
      />
    </PageContainer>
  )
}

function ApprovalCard({
  record,
  onView,
}: {
  record: ApprovalRecord
  onView: () => void
}) {
  const kindLabel = record.kind === 'job' ? 'JOB' : 'OFFER'
  const actionLabel = record.kind === 'job' ? 'View Job' : 'View Offer'
  const statusLabel = record.completed
    ? 'APPROVED'
    : `PENDING APPROVAL · ${record.levelLabel}`

  return (
    <article className="rounded-[10px] border border-[#E8E6F0] bg-white px-4 py-4 shadow-[0_2px_10px_rgba(45,32,97,0.04)] sm:px-5">
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(10rem,0.85fr)_minmax(12rem,1fr)_auto] lg:items-center lg:gap-5">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8B8B9E]">
            {kindLabel}
          </p>
          <h3 className="mt-1 truncate text-[15px] font-bold text-[#2D2061]">
            {record.title}
          </h3>
          <p className="mt-0.5 truncate text-xs text-[#8B8B9E]">
            {record.code} · {record.fromStatus} → {record.toStatus}
          </p>
        </div>

        <div className="min-w-0">
          <span
            className={cn(
              'inline-flex max-w-full items-center truncate rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none tracking-[0.04em]',
              record.completed
                ? 'bg-[#E6F6EC] text-[#15803D]'
                : 'bg-[#FFF1E6] text-[#C2410C]',
            )}
          >
            {statusLabel}
          </span>
          <p className="mt-1.5 truncate text-xs text-[#8B8B9E]">
            Rule &quot;{record.ruleName}&quot;
          </p>
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[#4A4A60]">
            {record.completed
              ? 'Completed'
              : `Waiting for ${record.waitingFor}`}
          </p>
          <p className="mt-0.5 truncate text-xs text-[#8B8B9E]">
            Submitted {record.submittedAt} by {record.submittedBy}
          </p>
        </div>

        <div className="flex shrink-0 lg:justify-end">
          <Button type="button" onClick={onView}>
            {actionLabel}
          </Button>
        </div>
      </div>
    </article>
  )
}
