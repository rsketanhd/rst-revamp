import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Checkbox,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableTd,
  DataTableTh,
  Select,
  Switch,
  toast,
} from '../ui'
import { cn } from '../../lib/cn'
import { SettingsBlock, SettingsPanel } from './SettingsPanel'
import { getSettingsSectionPath } from './settingsNavConfig'

type FairnessDetail = {
  id: string
  label: string
  asFilter: boolean
  asColumn: boolean
}

type FairnessFlag = 'asFilter' | 'asColumn'

const CHAT_LINK_OPTIONS = [
  { value: '1', label: '1 day' },
  { value: '3', label: '3 days' },
  { value: '7', label: '7 days' },
  { value: '14', label: '14 days' },
  { value: '30', label: '30 days' },
]

const QUESTIONS_PER_SET_OPTIONS = [
  { value: '30', label: 'Up to 30 · set by Recruitment Smart' },
]

const PIPELINE_STATUS_OPTIONS = [
  { value: 'none', label: "Don't change the status" },
  { value: 'send-mail', label: 'Send Mail' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'screening', label: 'Screening' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'interview', label: 'Interview' },
]

const REMINDER_OPTIONS = [
  { value: 'none', label: 'No reminders' },
  { value: '1', label: '1 day after sending' },
  { value: '2', label: '2 days after sending' },
  { value: '3', label: '3 days after sending' },
  { value: '5', label: '5 days after sending' },
  { value: '7', label: '7 days after sending' },
]

const INITIAL_FAIRNESS: FairnessDetail[] = [
  { id: 'gender', label: 'Gender', asFilter: false, asColumn: false },
  { id: 'age', label: 'Age / date of birth', asFilter: false, asColumn: false },
  { id: 'nationality', label: 'Nationality', asFilter: false, asColumn: false },
]

const QUESTIONS_PER_SET = '30'

const TH =
  '!h-auto !py-2.5 !text-[11px] !font-bold !tracking-[0.04em] !text-[#6B6B80] uppercase'

/**
 * Settings → Module Configuration → Jeeves AI → General.
 */
export function JeevesAiGeneralPanel() {
  const [autoSendApplicants, setAutoSendApplicants] = useState(false)
  const [chatLinkDays, setChatLinkDays] = useState('7')
  const [statusOnSent, setStatusOnSent] = useState('none')
  const [statusOnFinished, setStatusOnFinished] = useState('none')
  const [statusOnKnockout, setStatusOnKnockout] = useState('none')
  const [remindIfNotFinished, setRemindIfNotFinished] = useState('none')
  const [thankYouEmail, setThankYouEmail] = useState(true)
  const [alsoTextLink, setAlsoTextLink] = useState(false)
  const [askJeeves, setAskJeeves] = useState(false)
  const [fairness, setFairness] = useState(INITIAL_FAIRNESS)

  const fairnessUnset = fairness.every(
    (row) => !row.asFilter && !row.asColumn,
  )

  function patchFairness(
    id: string,
    patch: Partial<Pick<FairnessDetail, FairnessFlag>>,
  ) {
    setFairness((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    )
  }

  function handleSave() {
    toast.success('Jeeves AI general settings saved.', {
      title: 'Jeeves AI',
    })
  }

  return (
    <SettingsPanel
      eyebrow="Jeeves AI"
      title="General"
      description="When Jeeves sends a chat, how long the link works, and what it does to the pipeline status."
    >
      <SettingsBlock title="Sending">
        <div className="flex flex-col gap-4">
          <Checkbox
            id="jeeves-auto-send-applicants"
            checked={autoSendApplicants}
            onChange={(event) => setAutoSendApplicants(event.target.checked)}
            label="Send the Applicants chat automatically when someone applies on the careers page or the candidate portal"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              id="jeeves-chat-link-days"
              label="Chat link works for"
              options={CHAT_LINK_OPTIONS}
              value={chatLinkDays}
              onChange={(event) => setChatLinkDays(event.target.value)}
            />
            <Select
              id="jeeves-questions-per-set"
              label="Questions per set"
              options={QUESTIONS_PER_SET_OPTIONS}
              value={QUESTIONS_PER_SET}
              onChange={() => undefined}
              disabled
              aria-label="Questions per set"
            />
          </div>
        </div>
      </SettingsBlock>

      <SettingsBlock
        title="Pipeline status"
        description="Only applied while the candidate isn't rejected, withdrawn, declined or hired, and only to a status the candidate's stage allows."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            id="jeeves-status-sent"
            label="When the chat is sent"
            options={PIPELINE_STATUS_OPTIONS}
            value={statusOnSent}
            onChange={(event) => setStatusOnSent(event.target.value)}
            helperText="e.g. Send Mail"
          />
          <Select
            id="jeeves-status-finished"
            label="When the chat is finished"
            options={PIPELINE_STATUS_OPTIONS}
            value={statusOnFinished}
            onChange={(event) => setStatusOnFinished(event.target.value)}
            helperText="With no knockout answer"
          />
          <div className="sm:col-span-2 sm:max-w-[calc(50%-0.5rem)]">
            <Select
              id="jeeves-status-knockout"
              label="When a knockout answer is given"
              options={PIPELINE_STATUS_OPTIONS}
              value={statusOnKnockout}
              onChange={(event) => setStatusOnKnockout(event.target.value)}
              helperText="Leave empty to only flag the candidate."
            />
          </div>
        </div>
      </SettingsBlock>

      <SettingsBlock
        title="Reminders, thank-you and SMS"
        description="For chats sent by hand or after applying. Triggers have their own reminder settings."
      >
        <div className="flex flex-col gap-4">
          <div className="max-w-sm">
            <Select
              id="jeeves-remind-if-not-finished"
              label="Remind if not finished"
              options={REMINDER_OPTIONS}
              value={remindIfNotFinished}
              onChange={(event) => setRemindIfNotFinished(event.target.value)}
            />
          </div>
          <Checkbox
            id="jeeves-thank-you-email"
            checked={thankYouEmail}
            onChange={(event) => setThankYouEmail(event.target.checked)}
            label="Send a thank-you email when the candidate finishes"
          />
          <Checkbox
            id="jeeves-also-text-link"
            checked={alsoTextLink}
            onChange={(event) => setAlsoTextLink(event.target.checked)}
            label="Also text the chat link (uses the 'Jeeves AI chat link' template in SMS templates; needs SMS set up)"
          />
        </div>
      </SettingsBlock>

      <SettingsBlock
        title="Ask Jeeves"
        description="After the questions, the candidate can ask about the role. Jeeves answers only from the job description, the job details and this FAQ; anything else is passed to the recruiter and flagged in the Jeeves AI list."
      >
        <Checkbox
          id="jeeves-let-ask-questions"
          checked={askJeeves}
          onChange={(event) => setAskJeeves(event.target.checked)}
          label="Let candidates ask questions"
        />
      </SettingsBlock>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          className="!h-10 !rounded-[8px] !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
        >
          Save
        </Button>
      </div>

      <SettingsBlock title="Emails">
        <p className="text-sm leading-relaxed text-[#6B6B80]">
          Two emails carry the chat link:{' '}
          <span className="font-semibold text-[#2D2061]">Applicants</span>{' '}
          (already on the job) and{' '}
          <span className="font-semibold text-[#2D2061]">Recommendations</span>{' '}
          (not on the job yet). Edit their wording in{' '}
          <Link
            to={getSettingsSectionPath('templates')}
            className="font-semibold text-[#2F5AA8] underline underline-offset-2 hover:text-[#1E3F85]"
          >
            Email Templates — Jeeves AI
          </Link>
          .
        </p>
      </SettingsBlock>

      <SettingsBlock
        title="Fairness & compliance"
        description="Which sensitive details can be filters or columns in Jeeves AI. Set by Recruitment Smart for your country during onboarding; contact your account manager to change it."
      >
        <div className="overflow-hidden rounded-[8px] border border-[#E4E1EE] bg-white">
          <DataTable minWidthClassName="min-w-[28rem]">
            <DataTableHead className="!border-[#C9C6D6]">
              <DataTableTh className={cn(TH, 'pl-4')}>Detail</DataTableTh>
              <DataTableTh className={cn(TH, 'w-36 text-center')}>
                As a filter
              </DataTableTh>
              <DataTableTh className={cn(TH, 'w-36 pr-4 text-center')}>
                As a column
              </DataTableTh>
            </DataTableHead>
            <DataTableBody>
              {fairness.map((row) => (
                <DataTableRow
                  key={row.id}
                  className="border-b border-[#EEEDF3]"
                >
                  <DataTableTd className="!py-3.5 pl-4 text-sm font-medium text-[#2D2061]">
                    {row.label}
                  </DataTableTd>
                  <DataTableTd className="!py-3.5 text-center">
                    <FairnessToggle
                      checked={row.asFilter}
                      ariaLabel={`${row.label} as a filter`}
                      onCheckedChange={(checked) =>
                        patchFairness(row.id, { asFilter: checked })
                      }
                    />
                  </DataTableTd>
                  <DataTableTd className="!py-3.5 pr-4 text-center">
                    <FairnessToggle
                      checked={row.asColumn}
                      ariaLabel={`${row.label} as a column`}
                      onCheckedChange={(checked) =>
                        patchFairness(row.id, { asColumn: checked })
                      }
                    />
                  </DataTableTd>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTable>

          {fairnessUnset ? (
            <div
              role="note"
              className="border-t border-[#D6E4F7] bg-[#EEF5FC] px-4 py-3 text-xs leading-relaxed text-[#2F5AA8]"
            >
              Not set up yet: all three stay off.
            </div>
          ) : null}
        </div>
      </SettingsBlock>
    </SettingsPanel>
  )
}

function FairnessToggle({
  checked,
  ariaLabel,
  onCheckedChange,
}: {
  checked: boolean
  ariaLabel: string
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="inline-flex items-center justify-center gap-2">
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={ariaLabel}
        className="!gap-0"
      />
      <span className="text-xs font-medium text-[#8B8B9E]">
        {checked ? 'On' : 'Off'}
      </span>
    </div>
  )
}
