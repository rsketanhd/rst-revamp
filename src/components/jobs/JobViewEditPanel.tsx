import { useEffect, useState } from 'react'
import { SquarePen } from 'lucide-react'
import type { JobListing } from '../../data/jobs'
import { Button, SidePanel } from '../ui'
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
}: JobViewEditPanelProps) {
  const [mode, setMode] = useState<PanelMode>('view')
  const [form, setForm] = useState<CreateJobFormState>(defaultCreateJobForm)
  const [baseline, setBaseline] = useState<CreateJobFormState>(
    defaultCreateJobForm,
  )

  useEffect(() => {
    if (!open || !job) return
    const seeded = jobListingToCreateForm(job)
    setForm(seeded)
    setBaseline(seeded)
    setMode('view')
  }, [open, job])

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

  const title = job
    ? `${job.code} · ${job.title}`
    : 'Job Details'

  return (
    <SidePanel
      open={open && Boolean(job)}
      onClose={handleClose}
      title={title}
      widthClassName="w-full max-w-full sm:max-w-[min(100%,40rem)] lg:max-w-[50vw]"
      bodyClassName="bg-white"
      footerClassName="justify-between"
      footer={
        mode === 'view' ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleClose}
              className="!h-10 !min-w-[5.5rem] !rounded-md border-[#d5d2e2] bg-white px-4 text-sm font-medium text-[#2D2061] hover:bg-[#f7f6fb]"
            >
              Close
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => setMode('edit')}
              className="!h-10 !min-w-[6.5rem] !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
            >
              <SquarePen className="size-3.5" aria-hidden="true" />
              Edit Job
            </Button>
          </>
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
        <StepReview
          value={form}
          onChange={patchForm}
          readOnly
          hideHeader
        />
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
