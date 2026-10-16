import { useMemo, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button, SearchSelect, Select, SidePanel, toast } from '../../ui'
import { FieldInput } from '../../jobs/create/StepChrome'
import { getCandidates } from '../../../data/candidates'
import {
  defaultScheduleRoundId,
  getTwoWayInterviewSetRounds,
  type TwoWayInterviewSet,
} from '../../../data/twoWayInterviewSets'

const MAX_INVITES = 50
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type EmailInvite = { id: string; name: string; email: string }

const newRow = (): EmailInvite => ({
  id: `row-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name: '',
  email: '',
})

export type ScheduleInterviewsPanelProps = {
  open: boolean
  onClose: () => void
  set: TwoWayInterviewSet | null
}

/**
 * Interview Sets → Schedule Interviews. Pick candidates and a round; sends
 * booking invites (demo toast).
 */
export function ScheduleInterviewsPanel({
  open,
  onClose,
  set,
}: ScheduleInterviewsPanelProps) {
  const candidateOptions = useMemo(
    () => getCandidates().map((c) => ({ value: c.id, label: `${c.name} (${c.email})` })),
    [],
  )
  const rounds = useMemo(
    () => (set ? getTwoWayInterviewSetRounds(set.id) : []),
    [set],
  )
  const roundOptions = useMemo(
    () =>
      rounds.map((r, i) => ({
        value: r.id,
        label: `${i + 1}. ${r.name}${r.ready ? '' : ' (pending)'}`,
      })),
    [rounds],
  )

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [rows, setRows] = useState<EmailInvite[]>(() => [newRow()])
  const [roundId, setRoundId] = useState('')
  const [showErrors, setShowErrors] = useState(false)
  const [openedFor, setOpenedFor] = useState<string | null>(null)

  const key = open && set ? set.id : null
  if (key !== openedFor) {
    setOpenedFor(key)
    if (key) {
      setSelectedIds([])
      setRows([newRow()])
      setRoundId(defaultScheduleRoundId(rounds))
      setShowErrors(false)
    }
  }

  const filledRows = rows.filter((r) => r.name.trim() || r.email.trim())
  const rowError = (row: EmailInvite): string | undefined => {
    if (!row.name.trim() && !row.email.trim()) return undefined
    if (!row.name.trim()) return 'Enter a name.'
    if (!EMAIL_PATTERN.test(row.email.trim())) return 'Enter a valid email.'
    return undefined
  }
  const total = selectedIds.length + filledRows.length
  const overLimit = total > MAX_INVITES
  const selectedRound = rounds.find((r) => r.id === roundId)
  const noRounds = rounds.length === 0

  function patchRow(id: string, patch: Partial<EmailInvite>) {
    setRows((current) => current.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  function removeRow(id: string) {
    setRows((current) => (current.length === 1 ? [newRow()] : current.filter((r) => r.id !== id)))
  }

  function handleSend() {
    if (noRounds || !set) return
    if (!roundId) {
      setShowErrors(true)
      return
    }
    if (filledRows.some(rowError)) {
      setShowErrors(true)
      return
    }
    if (total === 0 || overLimit) return
    const roundLabel = selectedRound?.name ?? 'selected round'
    toast.success(
      `${total} ${total === 1 ? 'invite' : 'invites'} sent for “${set.jobTitle}” · ${roundLabel}.`,
      { title: 'Schedule Interviews' },
    )
    onClose()
  }

  return (
    <SidePanel
      open={open && Boolean(set)}
      onClose={onClose}
      title={set ? `Schedule Interviews · ${set.jobTitle}` : 'Schedule Interviews'}
      widthClassName="w-full max-w-[36rem]"
      footerClassName="justify-end gap-3 border-t border-[#ECEAF3]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="!h-10 !rounded-md !border-[#2D2061] !px-5 !text-[#2D2061] hover:!bg-[#F7F6FA]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSend}
            disabled={total === 0 || overLimit || noRounds}
            className="!h-10 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52] disabled:opacity-50"
          >
            {total > 0
              ? `Send ${total} ${total === 1 ? 'Invite' : 'Invites'}`
              : 'Send Invites'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        {!set ? null : noRounds ? (
          <p className="rounded-xl border border-dashed border-[#E0DDEA] bg-[#FAFAFC] px-4 py-6 text-center text-sm text-[#8B8B9E]">
            This interview set has no rounds yet. Edit the set to add rounds before scheduling.
          </p>
        ) : (
          <>
            <p className="text-[13px] leading-relaxed text-[#6B6B80]">
              Candidates receive a booking link for the selected round. Panel availability and
              slot rules come from that round&apos;s configuration. Up to {MAX_INVITES} at a
              time.
            </p>

            <Select
              id="schedule-round"
              label="Round"
              requiredMark
              options={roundOptions}
              value={roundId}
              onChange={(e) => setRoundId(e.target.value)}
              placeholder="Select round"
              error={showErrors && !roundId ? 'Select a round.' : undefined}
            />

            {selectedRound ? (
              <p className="text-xs text-[#6B6B80]">
                {selectedRound.meetingPlatform} · {selectedRound.durationMins} minutes
                {selectedRound.aiJoins ? ' · Two-Way AI joins' : ''}
              </p>
            ) : null}

            <section className="flex flex-col gap-2">
              <h3 className="text-[13px] font-medium text-[#2D2061]">Candidates on file</h3>
              <SearchSelect
                value={selectedIds}
                onChange={setSelectedIds}
                options={candidateOptions}
                placeholder="Search candidates by name or email"
              />
            </section>

            <section className="flex flex-col gap-3">
              <h3 className="text-[13px] font-medium text-[#2D2061]">Or invite by email</h3>
              <ul className="flex flex-col gap-3">
                {rows.map((row, index) => {
                  const error = showErrors ? rowError(row) : undefined
                  return (
                    <li key={row.id} className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                          <FieldInput
                            aria-label={`Candidate ${index + 1} full name`}
                            placeholder="Full name"
                            value={row.name}
                            onChange={(e) => patchRow(row.id, { name: e.target.value })}
                          />
                          <FieldInput
                            type="email"
                            aria-label={`Candidate ${index + 1} email address`}
                            placeholder="Email address"
                            value={row.email}
                            onChange={(e) => patchRow(row.id, { email: e.target.value })}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeRow(row.id)}
                          aria-label={`Remove candidate ${index + 1}`}
                          className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-[#A0A0B2] transition-colors hover:bg-[#F5F4FA] hover:text-[#E53935]"
                        >
                          <X className="size-4" strokeWidth={2} aria-hidden="true" />
                        </button>
                      </div>
                      {error ? <p className="text-xs text-[#E53935]">{error}</p> : null}
                    </li>
                  )
                })}
              </ul>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRows((current) => [...current, newRow()])}
                disabled={total >= MAX_INVITES}
                className="!h-10 w-fit !rounded-md border-[#E4E1EE] bg-white px-4 text-sm font-medium text-[#1A1A2E] hover:bg-[#f7f6fb]"
              >
                <Plus className="size-4" strokeWidth={2} aria-hidden="true" />
                Add another candidate
              </Button>
              {overLimit ? (
                <p className="text-xs font-medium text-[#E53935]">
                  You can invite up to {MAX_INVITES} candidates at a time.
                </p>
              ) : null}
            </section>
          </>
        )}
      </div>
    </SidePanel>
  )
}
