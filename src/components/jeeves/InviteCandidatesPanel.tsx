import { useMemo, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Button, Select, SidePanel, toast } from '../ui'
import { FieldInput } from '../jobs/create/StepChrome'
import { JOBS } from '../../data/jobs'
import {
  getPreInterviewSets,
  kindLabel,
  type PreInterviewSet,
} from '../../data/jeevesPreInterviewSets'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LINK_EXPIRY_DAYS = 7
const TOAST_TITLE = 'Invite Candidates'

type CandidateRow = { id: string; name: string; email: string }

const newRow = (): CandidateRow => ({
  id: `row-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name: '',
  email: '',
})

export type InviteCandidatesPanelProps = {
  open: boolean
  onClose: () => void
  set: PreInterviewSet | null
}

/**
 * Pre-Interview Set → Invite Candidates. Choose job, optional follow-on
 * assessment, send channel, and one or more name/email rows.
 */
export function InviteCandidatesPanel({
  open,
  onClose,
  set,
}: InviteCandidatesPanelProps) {
  const [jobCode, setJobCode] = useState('')
  const [assessmentId, setAssessmentId] = useState('')
  const [sendBy, setSendBy] = useState('email')
  const [rows, setRows] = useState<CandidateRow[]>(() => [newRow()])
  const [showErrors, setShowErrors] = useState(false)
  const [openedFor, setOpenedFor] = useState<string | null>(null)

  const key = open && set ? set.id : null
  if (key !== openedFor) {
    setOpenedFor(key)
    if (key) {
      setJobCode('')
      setAssessmentId('')
      setSendBy('email')
      setRows([newRow()])
      setShowErrors(false)
    }
  }

  const jobOptions = useMemo(() => {
    const used = set?.usedInJobs ?? []
    const fromJobs = JOBS.filter((job) => job.status === 'active')
      .slice(0, 12)
      .map((job) => ({
        value: job.code,
        label: `${job.title} (${job.code})`,
      }))
    const usedOptions = used.map((title) => {
      const match = JOBS.find((job) => job.title === title)
      return {
        value: match?.code ?? title,
        label: match ? `${match.title} (${match.code})` : title,
      }
    })
    const seen = new Set<string>()
    return [...usedOptions, ...fromJobs].filter((option) => {
      if (!option.value || seen.has(option.value)) return false
      seen.add(option.value)
      return true
    })
  }, [set])

  const assessmentOptions = useMemo(
    () =>
      getPreInterviewSets()
        .filter((item) => item.kind === 'assessment')
        .map((item) => ({
          value: item.id,
          label: item.name,
        })),
    [],
  )

  const sendByOptions = [
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'whatsapp', label: 'WhatsApp' },
  ]

  const filledRows = rows.filter((row) => row.name.trim() || row.email.trim())

  function rowError(row: CandidateRow): string | undefined {
    if (!row.name.trim() && !row.email.trim()) return undefined
    if (!row.name.trim()) return 'Enter a name.'
    if (!EMAIL_PATTERN.test(row.email.trim())) return 'Enter a valid email.'
    return undefined
  }

  function patchRow(id: string, patch: Partial<CandidateRow>) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    )
  }

  function removeRow(id: string) {
    setRows((current) =>
      current.length === 1 ? [newRow()] : current.filter((row) => row.id !== id),
    )
  }

  function handleSend() {
    if (!set) return
    if (!jobCode) {
      setShowErrors(true)
      return
    }
    if (filledRows.length === 0 || filledRows.some(rowError)) {
      setShowErrors(true)
      return
    }
    toast.success(
      `${filledRows.length} ${filledRows.length === 1 ? 'invite' : 'invites'} sent for “${set.name}”.`,
      { title: TOAST_TITLE },
    )
    onClose()
  }

  const canSend = Boolean(set) && Boolean(jobCode) && filledRows.length > 0
  const showAssessment = set?.kind === 'prescreen'

  return (
    <SidePanel
      open={open && Boolean(set)}
      onClose={onClose}
      title="Invite Candidates"
      widthClassName="w-full max-w-[32rem]"
      footerClassName="justify-end gap-3 border-t border-[#ECEAF3]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="!h-10 !rounded-md border-[#d5d2e2] bg-white px-5 text-sm font-medium text-[#2D2061] hover:bg-[#f7f6fb]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="!h-10 !rounded-md !bg-[#2D2061] px-5 text-sm font-semibold text-white hover:!bg-[#241a52] disabled:opacity-50"
          >
            Send invites
          </Button>
        </>
      }
    >
      {set ? (
        <div className="flex flex-col gap-5">
          <Select
            label="Job"
            options={jobOptions}
            value={jobCode}
            onChange={(e) => setJobCode(e.target.value)}
            placeholder="Choose a job"
            error={showErrors && !jobCode ? 'Choose a job.' : undefined}
            className="w-full"
          />

          {showAssessment ? (
            <div className="flex flex-col gap-1.5">
              <Select
                label="Then an assessment"
                options={assessmentOptions}
                value={assessmentId}
                onChange={(e) => setAssessmentId(e.target.value)}
                placeholder="None"
                className="w-full"
              />
              <p className="text-xs leading-relaxed text-[#8B8B9E]">
                Optional. It starts straight after the chat, in the same link,
                for candidates who pass the chat.
              </p>
            </div>
          ) : null}

          <Select
            label="Send By"
            options={sendByOptions}
            value={sendBy}
            onChange={(e) => setSendBy(e.target.value)}
            className="w-full"
          />

          <p className="text-sm leading-relaxed text-[#6B6B80]">
            Candidates get{' '}
            <span className="font-semibold text-[#2D2061]">{set.name}</span> (
            {kindLabel(set.kind).toLowerCase()}, version {set.version}). Links
            expire {LINK_EXPIRY_DAYS} days after sending. Anyone who already has
            a pre-interview for this job is skipped, so nobody appears twice.
          </p>

          <section className="flex flex-col gap-3">
            <ul className="flex flex-col gap-3">
              {rows.map((row, index) => {
                const error = showErrors ? rowError(row) : undefined
                return (
                  <li key={row.id} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                        <FieldInput
                          aria-label={`Candidate ${index + 1} full name`}
                          placeholder="Full name"
                          value={row.name}
                          onChange={(e) =>
                            patchRow(row.id, { name: e.target.value })
                          }
                        />
                        <FieldInput
                          type="email"
                          aria-label={`Candidate ${index + 1} email address`}
                          placeholder="Email address"
                          value={row.email}
                          onChange={(e) =>
                            patchRow(row.id, { email: e.target.value })
                          }
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        aria-label={`Remove candidate ${index + 1}`}
                        className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-[#A0A0B2] transition-colors hover:bg-[#F5F4FA] hover:text-[#E53935]"
                      >
                        <Minus
                          className="size-4"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                    {error ? (
                      <p className="text-xs text-[#E53935]">{error}</p>
                    ) : null}
                  </li>
                )
              })}
            </ul>

            <button
              type="button"
              onClick={() => setRows((current) => [...current, newRow()])}
              className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[#2D2061] transition-colors hover:text-[#241a52]"
            >
              <Plus className="size-4" strokeWidth={2} aria-hidden="true" />
              Add another candidate
            </button>

            {showErrors && filledRows.length === 0 ? (
              <p className="text-xs text-[#E53935]">
                Add at least one candidate.
              </p>
            ) : null}
          </section>
        </div>
      ) : null}
    </SidePanel>
  )
}
