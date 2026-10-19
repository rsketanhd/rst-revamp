import { useEffect, useState } from 'react'
import { ChevronRight, SquarePen } from 'lucide-react'
import { ApprovalDecisionSection } from '../approvals/ApprovalDecisionSection'
import type { ApprovalRecord } from '../../data/approvals'
import type { JobListing } from '../../data/jobs'
import { cn } from '../../lib/cn'
import { Button, Collapse, SidePanel, toast } from '../ui'
import { StepCreateJob } from './create/StepCreateJob'
import { StepJobDetails } from './create/StepJobDetails'
import { StepJobAnalyzer } from './create/StepJobAnalyzer'
import { StepClientDetails } from './create/StepClientDetails'
import { StepJobBoards } from './create/StepJobBoards'
import { StepReview } from './create/StepReview'
import { jobListingToCreateForm } from './create/jobListingToForm'
import {
  defaultCreateJobForm,
  type CreateJobFormState,
} from './create/types'

export type JobViewEditPanelProps = {
  open: boolean
  job: JobListing | null
  onClose: () => void
  /** Called when the user saves edits (demo: parent may log or refresh list). */
  onSave?: (job: JobListing, form: CreateJobFormState) => void
  /** Mode the panel opens in (default: view) */
  initialMode?: PanelMode
  /**
   * View-mode footer. `edit-only` shows Edit Job alone (e.g. Approvals → Submitted by me).
   */
  viewFooter?: 'default' | 'edit-only'
  /**
   * When set (Approvals → Waiting for me), show the decision card above job details.
   */
  approvalRecord?: ApprovalRecord | null
  onApprovalDecided?: (
    decision: 'approve' | 'request-changes' | 'reject',
  ) => void
}

type PanelMode = 'view' | 'edit'

/**
 * Jobs page View/Edit drawer — half screen, starts in view mode with step titles.
 */
export function JobViewEditPanel({
  open,
  job,
  onClose,
  onSave,
  initialMode = 'view',
  viewFooter = 'default',
  approvalRecord = null,
  onApprovalDecided,
}: JobViewEditPanelProps) {
  const [mode, setMode] = useState<PanelMode>('view')
  const [form, setForm] = useState<CreateJobFormState>(defaultCreateJobForm)
  const [baseline, setBaseline] = useState<CreateJobFormState>(
    defaultCreateJobForm,
  )
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false)
  const [approvalComment, setApprovalComment] = useState('')
  const [approvalCommentError, setApprovalCommentError] = useState<
    string | undefined
  >()

  useEffect(() => {
    if (!open || !job) return
    const seeded = jobListingToCreateForm(job)
    setForm(seeded)
    setBaseline(seeded)
    setMode(initialMode)
    setJobDetailsOpen(false)
    setApprovalComment('')
    setApprovalCommentError(undefined)
    // Seed once per open job; keep in-panel edits if parent refreshes the same record.
  }, [open, job?.id, initialMode])

  function patchForm(patch: Partial<CreateJobFormState>) {
    setForm((current) => ({ ...current, ...patch }))
  }

  function handleClose() {
    setMode('view')
    onClose()
  }

  function handleCancelEdit() {
    setForm(baseline)
    setMode('view')
  }

  function handleSave() {
    if (!job) return
    onSave?.(job, form)
    setBaseline(form)
    setMode('view')
  }

  function handleDecision(decision: 'approve' | 'request-changes' | 'reject') {
    if (!approvalComment.trim()) {
      setApprovalCommentError('A comment is required for every decision')
      return
    }
    setApprovalCommentError(undefined)
    const labels = {
      approve: 'Approved',
      'request-changes': 'Changes requested',
      reject: 'Rejected',
    } as const
    toast.success(labels[decision], { title: 'Approvals' })
    onApprovalDecided?.(decision)
  }

  const title = job ? `${job.code} · ${job.title}` : 'Job Details'
  const showApprovalFooter = mode === 'view' && Boolean(approvalRecord)

  const editJobButton = (
    <Button
      type="button"
      variant={showApprovalFooter ? 'outline' : 'primary'}
      size="md"
      onClick={() => setMode('edit')}
      className={cn(
        '!h-10 !min-w-[6.5rem] !rounded-md px-4 text-sm',
        showApprovalFooter
          ? '!border-[#d5d2e2] bg-white font-medium text-[#2D2061] hover:bg-[#f7f6fb]'
          : 'bg-[#2D2061] font-semibold text-white hover:bg-[#241a52]',
      )}
    >
      <SquarePen className="size-3.5" aria-hidden="true" />
      Edit Job
    </Button>
  )

  return (
    <SidePanel
      open={open && Boolean(job)}
      onClose={handleClose}
      title={title}
      widthClassName="w-full max-w-full sm:max-w-[min(100%,40rem)] lg:max-w-[50vw]"
      bodyClassName="bg-white"
      footerClassName={
        showApprovalFooter || mode === 'edit' || viewFooter === 'default'
          ? 'justify-between'
          : 'justify-end'
      }
      footer={
        mode === 'view' ? (
          showApprovalFooter ? (
            <>
              {editJobButton}
              <div className="flex flex-wrap items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDecision('request-changes')}
                  className="!h-10 !rounded-md !border-[#D5D2E2] !text-[#2D2061]"
                >
                  Request changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDecision('reject')}
                  className="!h-10 !rounded-md !border-[#F5C2C2] !text-[#C44B4B] hover:!bg-[#FFF5F5]"
                >
                  Reject
                </Button>
                <Button
                  type="button"
                  onClick={() => handleDecision('approve')}
                  className="!h-10 !rounded-md"
                >
                  Approve
                </Button>
              </div>
            </>
          ) : (
            <>
              {viewFooter === 'default' ? (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleClose}
                  className="!h-10 !min-w-[5.5rem] !rounded-md border-[#d5d2e2] bg-white px-4 text-sm font-medium text-[#2D2061] hover:bg-[#f7f6fb]"
                >
                  Close
                </Button>
              ) : null}
              {editJobButton}
            </>
          )
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleCancelEdit}
              className="!h-10 !min-w-[5.5rem] !rounded-md border-[#d5d2e2] bg-white px-4 text-sm font-medium text-[#2D2061] hover:bg-[#f7f6fb]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleSave}
              className="!h-10 !min-w-[6.5rem] !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
            >
              Save Changes
            </Button>
          </>
        )
      }
    >
      {mode === 'view' ? (
        <div className="flex flex-col gap-5">
          {approvalRecord ? (
            <>
              <ApprovalDecisionSection
                record={approvalRecord}
                comment={approvalComment}
                commentError={approvalCommentError}
                onCommentChange={(value) => {
                  setApprovalComment(value)
                  if (approvalCommentError) setApprovalCommentError(undefined)
                }}
              />
              <section className="overflow-hidden rounded-[10px] border border-[#E4E1EE] bg-white">
                <button
                  type="button"
                  onClick={() => setJobDetailsOpen((prev) => !prev)}
                  aria-expanded={jobDetailsOpen}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left sm:px-5"
                >
                  <span className="text-sm font-semibold text-[#2D2061]">
                    Job Details
                  </span>
                  <ChevronRight
                    className={cn(
                      'size-4 shrink-0 text-[#6B6B80] transition-transform duration-200',
                      jobDetailsOpen && 'rotate-90',
                    )}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </button>
                <Collapse open={jobDetailsOpen}>
                  <div className="border-t border-[#E4E1EE] px-4 pb-5 pt-4 sm:px-5">
                    <StepReview
                      value={form}
                      onChange={patchForm}
                      readOnly
                      hideHeader
                    />
                  </div>
                </Collapse>
              </section>
            </>
          ) : (
            <StepReview
              value={form}
              onChange={patchForm}
              readOnly
              hideHeader
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <StepCreateJob value={form} onChange={patchForm} />
          <StepJobDetails value={form} onChange={patchForm} />
          <StepJobAnalyzer value={form} onChange={patchForm} />
          <StepClientDetails value={form} onChange={patchForm} />
          <StepJobBoards value={form} onChange={patchForm} />
          <StepReview value={form} onChange={patchForm} hideHeader />
        </div>
      )}
    </SidePanel>
  )
}
