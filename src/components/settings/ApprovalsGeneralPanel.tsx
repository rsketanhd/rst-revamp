import { useState } from 'react'
import { Button, Select, Switch, toast } from '../ui'
import { cn } from '../../lib/cn'
import { SettingsBlock, SettingsPanel } from './SettingsPanel'

type CommentRule = 'required' | 'optional' | 'off'
type SelfApprovalMode = 'refuse' | 'skip'

type DecisionId = 'approve' | 'request-changes' | 'reject'

type CommentRow = {
  id: DecisionId
  label: string
  description: string
  jobs: CommentRule
  offers: CommentRule
}

const COMMENT_OPTIONS = [
  { value: 'required', label: 'Required' },
  { value: 'optional', label: 'Optional' },
  { value: 'off', label: 'Off' },
]

const DEFAULT_COMMENT_ROWS: CommentRow[] = [
  {
    id: 'approve',
    label: 'Approve',
    description: 'Moves it to the next level, or approves it after the last one',
    jobs: 'required',
    offers: 'required',
  },
  {
    id: 'request-changes',
    label: 'Request changes',
    description: 'Sends it back to the submitter to update and resubmit',
    jobs: 'required',
    offers: 'required',
  },
  {
    id: 'reject',
    label: 'Reject',
    description: 'A firm no; it has to be edited before it\'s submitted again',
    jobs: 'required',
    offers: 'required',
  },
]

const SELF_APPROVAL_OPTIONS: Array<{
  value: SelfApprovalMode
  title: string
  description: string
}> = [
  {
    value: 'refuse',
    title: 'Refuse the submission (recommended)',
    description:
      'The submitter is told the level has no approver other than them; an administrator adds another approver to the rule.',
  },
  {
    value: 'skip',
    title: 'Skip that level',
    description:
      'The level is left out of the chain for this submission; when every level is skipped, the job or offer goes through at once.',
  },
]

/**
 * Settings → Module Configuration → Approvals → General.
 */
export function ApprovalsGeneralPanel() {
  const [commentRows, setCommentRows] = useState(DEFAULT_COMMENT_ROWS)
  const [selfApproval, setSelfApproval] =
    useState<SelfApprovalMode>('refuse')
  const [emailRequested, setEmailRequested] = useState(true)
  const [emailDecision, setEmailDecision] = useState(true)

  function updateComment(
    id: DecisionId,
    field: 'jobs' | 'offers',
    value: CommentRule,
  ) {
    setCommentRows((current) =>
      current.map((row) =>
        row.id === id ? { ...row, [field]: value } : row,
      ),
    )
  }

  function handleSave() {
    toast.success('General settings saved.', { title: 'Approvals' })
  }

  return (
    <SettingsPanel
      eyebrow="Approvals"
      title="General"
      description="How comments, self-approval, and job approval emails work across jobs and offers."
    >
      <SettingsBlock
        title="Comments on decisions"
        description="Choose when an approver must add a comment. Comments are shown to the submitter and the other approvers, and kept in the request history."
      >
        <div className="overflow-x-auto">
          <div className="min-w-[28rem]">
            <div className="grid grid-cols-[minmax(0,1.4fr)_6.5rem_6.5rem] gap-3 border-b border-[#E4E1EE] pb-2 sm:grid-cols-[minmax(0,1fr)_7.5rem_7.5rem]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8B8B9E]">
                Decision
              </p>
              <p className="text-center text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8B8B9E]">
                Jobs
              </p>
              <p className="text-center text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8B8B9E]">
                Offers
              </p>
            </div>

            <ul className="flex flex-col">
              {commentRows.map((row) => (
                <li
                  key={row.id}
                  className="grid grid-cols-[minmax(0,1.4fr)_6.5rem_6.5rem] items-center gap-3 border-b border-dashed border-[#E4E1EE] py-3.5 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_7.5rem_7.5rem]"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-sm font-semibold text-[#2D2061]">
                      {row.label}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
                      {row.description}
                    </p>
                  </div>
                  <Select
                    id={`approvals-comment-jobs-${row.id}`}
                    aria-label={`${row.label} comment rule for jobs`}
                    options={COMMENT_OPTIONS}
                    value={row.jobs}
                    onChange={(event) =>
                      updateComment(
                        row.id,
                        'jobs',
                        event.target.value as CommentRule,
                      )
                    }
                    className="!h-9"
                  />
                  <Select
                    id={`approvals-comment-offers-${row.id}`}
                    aria-label={`${row.label} comment rule for offers`}
                    options={COMMENT_OPTIONS}
                    value={row.offers}
                    onChange={(event) =>
                      updateComment(
                        row.id,
                        'offers',
                        event.target.value as CommentRule,
                      )
                    }
                    className="!h-9"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-[#8B8B9E]">
          Approvers see this in View Job and View Offer, for example:{' '}
          <span className="font-medium text-[#6B6B80]">
            &quot;Your decision · a comment is required for every decision&quot;
          </span>
          .
        </p>
      </SettingsBlock>

      <SettingsBlock
        title="Approving your own job or offer"
        description="Nobody approves a job or offer they submitted themselves. Choose what happens when the submitter is the only approver at a level. Applies to jobs and offers alike."
      >
        <div
          role="radiogroup"
          aria-label="Self-approval behaviour"
          className="flex flex-col gap-3"
        >
          {SELF_APPROVAL_OPTIONS.map((option) => {
            const selected = selfApproval === option.value
            return (
              <label
                key={option.value}
                className="flex cursor-pointer items-start gap-3"
              >
                <input
                  type="radio"
                  name="approvals-self-approval"
                  value={option.value}
                  checked={selected}
                  onChange={() => setSelfApproval(option.value)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border',
                    selected
                      ? 'border-[#2D2061] bg-[#2D2061]'
                      : 'border-[#C8C5D6] bg-white',
                  )}
                  aria-hidden="true"
                >
                  {selected ? (
                    <span className="size-1.5 rounded-full bg-white" />
                  ) : null}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-[#2D2061]">
                    {option.title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-[#8B8B9E]">
                    {option.description}
                  </span>
                </span>
              </label>
            )
          })}
        </div>
      </SettingsBlock>

      <SettingsBlock
        title="Job approval emails"
        description="Approvers and submitters always get a bell notification. Emails use the templates in Settings → Messaging → Email Templates → Approvals. Offer approval emails are set in Offer Settings → Team Notifications."
      >
        <ul className="flex flex-col">
          <li className="flex items-start justify-between gap-4 border-b border-dashed border-[#E4E1EE] py-3.5 first:pt-0 last:border-b-0 last:pb-0">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#2D2061]">
                Approval requested
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
                To each approver when a job waits for their decision, and to the
                escalation approver.
              </p>
            </div>
            <Switch
              checked={emailRequested}
              onCheckedChange={setEmailRequested}
              aria-label="Approval requested email"
              className="!gap-0 shrink-0"
            />
          </li>
          <li className="flex items-start justify-between gap-4 border-b border-dashed border-[#E4E1EE] py-3.5 first:pt-0 last:border-b-0 last:pb-0">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#2D2061]">
                Approval decision
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
                To the person who submitted the job when it&apos;s approved,
                sent back for changes or rejected.
              </p>
            </div>
            <Switch
              checked={emailDecision}
              onCheckedChange={setEmailDecision}
              aria-label="Approval decision email"
              className="!gap-0 shrink-0"
            />
          </li>
        </ul>
      </SettingsBlock>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button
          type="button"
          onClick={handleSave}
          className="!h-10 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
        >
          Save
        </Button>
      </div>
    </SettingsPanel>
  )
}
