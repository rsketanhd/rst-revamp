import { useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Check,
  CircleHelp,
  Lock,
  Pencil,
  Plus,
  Star,
  Trash2,
  Upload,
  X,
  Zap,
} from 'lucide-react'
import {
  Button,
  Checkbox,
  ConfirmDeleteModal,
  DataTable,
  DataTableBody,
  DataTableEmpty,
  DataTableHead,
  DataTableRow,
  DataTableTd,
  DataTableTh,
  Input,
  Select,
  SidePanel,
  Switch,
  Textarea,
  toast,
  Tooltip,
} from '../ui'
import { cn } from '../../lib/cn'
import {
  getSettingsSectionLabel,
  getSettingsSectionPath,
  type SettingsSectionId,
} from './settingsNavConfig'
import { SettingsPanel } from './SettingsPanel'
import { SettingsUnderlineTabs } from './SettingsUnderlineTabs'

type OfferTab =
  | 'offer-management-stages-status'
  | 'offer-management-pipeline-sync'
  | 'offer-management-reasons'
  | 'offer-management-approval-rules'
  | 'offer-management-templates-emails'
  | 'offer-management-team-notifications'
  | 'offer-management-entities-compensation'
  | 'offer-management-lifecycle-signing'
  | 'offer-management-audit-log'

const OFFER_TABS: Array<{ value: OfferTab; label: string }> = [
  { value: 'offer-management-stages-status', label: 'Statuses & Stages' },
  { value: 'offer-management-pipeline-sync', label: 'Pipeline Sync' },
  { value: 'offer-management-reasons', label: 'Reasons' },
  { value: 'offer-management-approval-rules', label: 'Approval Rules' },
  { value: 'offer-management-templates-emails', label: 'Templates & Emails' },
  {
    value: 'offer-management-team-notifications',
    label: 'Team Notifications',
  },
  {
    value: 'offer-management-entities-compensation',
    label: 'Entities & Compensation',
  },
  {
    value: 'offer-management-lifecycle-signing',
    label: 'Lifecycle & Signing',
  },
  { value: 'offer-management-audit-log', label: 'Audit Log' },
]

type BadgeColor = 'blue' | 'amber' | 'red' | 'purple' | 'green' | 'grey'

type SystemStatus = {
  id: string
  code: string
  internalLabel: string
  candidateSees: string
  badge: BadgeColor
}

type StagePlacement = 'after-approved' | 'after-sent'

type CustomStage = {
  id: string
  code: string
  name: string
  candidateLabel: string
  placement: StagePlacement
  pipelineNote: string
  offerCount: number
}

const BADGE_OPTIONS: Array<{ value: BadgeColor; label: string }> = [
  { value: 'blue', label: 'blue' },
  { value: 'amber', label: 'amber' },
  { value: 'red', label: 'red' },
  { value: 'purple', label: 'purple' },
  { value: 'green', label: 'green' },
  { value: 'grey', label: 'grey' },
]

const BADGE_TAG_CLASS: Record<BadgeColor, string> = {
  blue: 'bg-[#E8F1FE] text-[#2F6FD6]',
  amber: 'bg-[#FEF3C7] text-[#B45309]',
  red: 'bg-[#FEE2E2] text-[#B91C1C]',
  purple: 'bg-[#EDE9FE] text-[#6D28D9]',
  green: 'bg-[#DCFCE7] text-[#15803D]',
  grey: 'bg-[#F0EFF4] text-[#6B6B80]',
}

const INITIAL_STATUSES: SystemStatus[] = [
  {
    id: 'draft',
    code: 'DRAFT',
    internalLabel: 'Draft',
    candidateSees: 'Not visible to candidates',
    badge: 'blue',
  },
  {
    id: 'pending-approval',
    code: 'PENDING APPROVAL',
    internalLabel: 'Pending Approval',
    candidateSees: 'Not visible to candidates',
    badge: 'amber',
  },
  {
    id: 'approval-rejected',
    code: 'APPROVAL REJECTED',
    internalLabel: 'Approval Rejected',
    candidateSees: 'Not visible to candidates',
    badge: 'red',
  },
  {
    id: 'approved',
    code: 'APPROVED',
    internalLabel: 'Approved',
    candidateSees: 'Not visible to candidates',
    badge: 'blue',
  },
  {
    id: 'sent',
    code: 'SENT',
    internalLabel: 'Sent',
    candidateSees: 'Offer Received',
    badge: 'purple',
  },
  {
    id: 'change-requested',
    code: 'CHANGE REQUESTED',
    internalLabel: 'Change Requested',
    candidateSees: 'Change Requested',
    badge: 'amber',
  },
  {
    id: 'accepted',
    code: 'ACCEPTED',
    internalLabel: 'Accepted',
    candidateSees: 'Offer Accepted',
    badge: 'green',
  },
  {
    id: 'declined',
    code: 'DECLINED',
    internalLabel: 'Declined',
    candidateSees: 'Offer Declined',
    badge: 'red',
  },
  {
    id: 'withdrawn',
    code: 'WITHDRAWN',
    internalLabel: 'Withdrawn',
    candidateSees: 'Offer Withdrawn',
    badge: 'amber',
  },
  {
    id: 'expired',
    code: 'EXPIRED',
    internalLabel: 'Expired',
    candidateSees: 'Offer Lapsed',
    badge: 'grey',
  },
]

const INITIAL_STAGES: CustomStage[] = [
  {
    id: 'stage-01',
    code: 'STAGE 01',
    name: 'Stage 01',
    candidateLabel: 'Label',
    placement: 'after-approved',
    pipelineNote: 'Pipeline: no change',
    offerCount: 0,
  },
  {
    id: 'stage-02',
    code: 'STAGE 02',
    name: 'Stage 02',
    candidateLabel: 'Label 02',
    placement: 'after-sent',
    pipelineNote: 'Pipeline: no change',
    offerCount: 0,
  },
]

const TH =
  'bg-[#F7F7FA] !pt-3 !pb-3 !text-[10px] !font-bold uppercase tracking-[0.04em] !text-[#1A1A2E]'

const INPUT =
  'h-9 w-full rounded-[8px] border border-[#D5D2E2] bg-white px-3 text-sm text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10'

function isOfferTab(id: SettingsSectionId): id is OfferTab {
  return OFFER_TABS.some((tab) => tab.value === id)
}

/**
 * Settings → Module Configuration → Offer Management.
 */
export function OfferManagementPanel({
  sectionId,
}: {
  sectionId: SettingsSectionId
}) {
  const navigate = useNavigate()
  const activeTab: OfferTab = isOfferTab(sectionId)
    ? sectionId
    : 'offer-management-stages-status'

  return (
    <SettingsPanel
      title="Offer Settings"
      description="Statuses, approvals, templates, legal entities and signing for Offer Management."
    >
      <SettingsUnderlineTabs
        aria-label="Offer settings sections"
        value={activeTab}
        onChange={(value) => navigate(getSettingsSectionPath(value))}
        options={OFFER_TABS}
      />

      {activeTab === 'offer-management-stages-status' ? (
        <StatusesStagesTab />
      ) : activeTab === 'offer-management-pipeline-sync' ? (
        <PipelineSyncTab />
      ) : activeTab === 'offer-management-reasons' ? (
        <ReasonsTab />
      ) : activeTab === 'offer-management-approval-rules' ? (
        <ApprovalRulesTab />
      ) : activeTab === 'offer-management-templates-emails' ? (
        <TemplatesEmailsTab />
      ) : activeTab === 'offer-management-team-notifications' ? (
        <TeamNotificationsTab />
      ) : activeTab === 'offer-management-entities-compensation' ? (
        <EntitiesCompensationTab />
      ) : activeTab === 'offer-management-lifecycle-signing' ? (
        <LifecycleSigningTab />
      ) : activeTab === 'offer-management-audit-log' ? (
        <AuditLogTab />
      ) : (
        <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
          <h3 className="text-sm font-bold text-[#2D2061]">
            {getSettingsSectionLabel(activeTab)}
          </h3>
          <p className="mt-1 text-sm text-[#6B6B80]">
            Configure {getSettingsSectionLabel(activeTab).toLowerCase()} options
            here. Details will be added in a future iteration.
          </p>
        </div>
      )}
    </SettingsPanel>
  )
}

function InfoTip({ content }: { content: string }) {
  return (
    <Tooltip content={content}>
      <span className="inline-flex text-[#8B8B9E] hover:text-[#2D2061]">
        <CircleHelp className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
        <span className="sr-only">{content}</span>
      </span>
    </Tooltip>
  )
}

function ChangesBanner() {
  return (
    <div
      role="status"
      className="flex items-start gap-2.5 rounded-[8px] border border-[#C9D8F5] bg-[#EAF1FE] px-4 py-3 text-xs leading-relaxed text-[#2F5AA8]"
    >
      <CircleHelp
        className="mt-0.5 size-3.5 shrink-0"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <p>
        Changes apply to draft and future offers only. Every offer that has been
        sent keeps the document it was issued with; signed offers are never
        re-rendered.
      </p>
    </div>
  )
}

/** Primary Save (and optional Discard) aligned to the bottom-right of a section. */
function SectionSaveFooter({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
      {children}
    </div>
  )
}

function SectionSaveButton({
  onClick,
  children = 'Save',
  className,
}: {
  onClick: () => void
  children?: ReactNode
  className?: string
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className={cn(
        '!h-9 !rounded-[8px] !bg-[#2D2061] !px-4 text-sm font-semibold text-white hover:!bg-[#241a52]',
        className,
      )}
    >
      {children}
    </Button>
  )
}

/* -------------------------------------------------------------------------- */
/* Templates & Emails                                                         */
/* -------------------------------------------------------------------------- */

type OfferLetterTemplate = {
  id: string
  tag: string
  name: string
  scope: string
  blocks: number
  used: number
  isDefault: boolean
  enabled: boolean
}

type OfferEmail = {
  id: string
  title: string
  description: string
  subject: string
  send: boolean
}

type NewTemplateFormValues = {
  name: string
  tag: string
  scope: string
}

const EMPTY_NEW_TEMPLATE: NewTemplateFormValues = {
  name: '',
  tag: '',
  scope: 'All offers',
}

const TEMPLATE_SCOPE_OPTIONS = [
  { value: 'All offers', label: 'All offers' },
  { value: 'Permanent', label: 'Permanent' },
  { value: 'Contract', label: 'Contract' },
]

const INITIAL_LETTER_TEMPLATES: OfferLetterTemplate[] = [
  {
    id: 'general',
    tag: 'GENERAL',
    name: 'Standard Offer of Employment',
    scope: 'All offers',
    blocks: 8,
    used: 0,
    isDefault: true,
    enabled: true,
  },
  {
    id: 'permanent',
    tag: 'PERMANENT',
    name: 'Permanent Hire with Benefits',
    scope: 'Permanent',
    blocks: 10,
    used: 0,
    isDefault: false,
    enabled: true,
  },
  {
    id: 'executive',
    tag: 'EXECUTIVE',
    name: 'Executive & Leadership Offer',
    scope: 'All offers',
    blocks: 8,
    used: 0,
    isDefault: false,
    enabled: true,
  },
  {
    id: 'contract',
    tag: 'CONTRACT',
    name: 'Contract Engagement Offer',
    scope: 'Contract',
    blocks: 8,
    used: 0,
    isDefault: false,
    enabled: true,
  },
  {
    id: 'arabic',
    tag: 'ARABIC',
    name: 'عرض عمل (Arabic) · RTL',
    scope: 'All offers',
    blocks: 8,
    used: 0,
    isDefault: false,
    enabled: true,
  },
]

const INITIAL_OFFER_EMAILS: OfferEmail[] = [
  {
    id: 'issued',
    title: 'Offer Issued',
    description:
      'Sent to the candidate when an offer is issued (Offer Management)',
    subject: 'Your offer from {{Company_Name}} — {{Job_Title}}',
    send: true,
  },
  {
    id: 'reminder',
    title: 'Offer Reminder',
    description:
      'Sent to the candidate when a recruiter sends a reminder on an open offer',
    subject: 'Reminder: your {{Company_Name}} offer expires on {{Expiry_Date}}',
    send: true,
  },
  {
    id: 'revised',
    title: 'Offer Revised',
    description:
      'Sent to the candidate when a revised version of their offer is issued',
    subject: 'Your updated offer — {{Job_Title}}',
    send: true,
  },
  {
    id: 'expiry-extended',
    title: 'Offer Expiry Extended',
    description:
      'Sent to the candidate when the offer expiry date is extended',
    subject: 'More time to respond to your {{Company_Name}} offer',
    send: true,
  },
  {
    id: 'withdrawn',
    title: 'Offer Withdrawn / Rescinded',
    description:
      'Sent to the candidate when their offer is withdrawn or rescinded',
    subject: 'Update on your offer — {{Job_Title}}',
    send: true,
  },
  {
    id: 'joining-amended',
    title: 'Joining Date Amended',
    description:
      'Sent to the candidate when the start date of an accepted offer changes',
    subject: 'Your start date has changed: {{Job_Title}}',
    send: true,
  },
  {
    id: 'accepted',
    title: 'Offer Accepted — Confirmation',
    description:
      'Sent to the candidate after they sign and accept their offer',
    subject: 'Welcome to {{Company_Name}}!',
    send: true,
  },
  {
    id: 'signing-code',
    title: 'Offer Signing Code',
    description:
      'Sent to the candidate when signing requires a verification code',
    subject: 'Your {{Company_Name}} offer signing code',
    send: false,
  },
  {
    id: 'expired',
    title: 'Offer Expired (Candidate)',
    description:
      'Sent to the candidate when their offer lapses without a response',
    subject: 'Your offer for {{Job_Title}} has expired',
    send: true,
  },
  {
    id: 'declined',
    title: 'Offer Declined (Candidate)',
    description:
      'Sent to the candidate to confirm that they declined their offer',
    subject: "We've received your response to our offer",
    send: true,
  },
]

function TemplatesEmailsTab() {
  const [templates, setTemplates] = useState(INITIAL_LETTER_TEMPLATES)
  const [emails, setEmails] = useState(INITIAL_OFFER_EMAILS)
  const [newTemplateOpen, setNewTemplateOpen] = useState(false)

  function makeDefault(template: OfferLetterTemplate) {
    setTemplates((current) =>
      current.map((row) => ({
        ...row,
        isDefault: row.id === template.id,
        enabled: row.id === template.id ? true : row.enabled,
      })),
    )
    toast.success(`“${template.name}” is now the default.`, {
      title: 'Offer letter templates',
    })
  }

  function openInBuilder(template: OfferLetterTemplate) {
    toast.success(`Opening “${template.name}” in the template builder.`, {
      title: 'Template builder',
    })
  }

  function createTemplate(values: NewTemplateFormValues) {
    const name = values.name.trim()
    const tag = (values.tag.trim() || name.slice(0, 8)).toUpperCase()
    setTemplates((current) => [
      ...current,
      {
        id: `template-${Date.now()}`,
        tag,
        name,
        scope: values.scope,
        blocks: 8,
        used: 0,
        isDefault: current.length === 0,
        enabled: true,
      },
    ])
    setNewTemplateOpen(false)
    toast.success(`“${name}” added.`, { title: 'Template added' })
  }

  function patchEmail(id: string, send: boolean) {
    setEmails((current) =>
      current.map((email) => (email.id === id ? { ...email, send } : email)),
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <ChangesBanner />

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 max-w-3xl">
            <h3 className="text-sm font-bold text-[#2D2061]">
              Offer letter templates
            </h3>
            <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
              Auto-selected by department, employment type and legal entity; the
              default applies when nothing more specific matches.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setNewTemplateOpen(true)}
            className="!h-9 !rounded-[8px] !border-[#2D2061] !px-3.5 !text-[#2D2061] hover:!bg-white"
          >
            <Plus className="size-4" strokeWidth={2.25} aria-hidden="true" />
            New template
          </Button>
        </div>

        <div className="overflow-hidden rounded-[8px] border border-[#E4E1EE] bg-white">
          <DataTable minWidthClassName="min-w-[56rem]">
            <DataTableHead className="!border-[#C9C6D6]">
              <DataTableTh className={cn(TH, 'pl-4')}>Template</DataTableTh>
              <DataTableTh className={cn(TH, 'w-36')}>Scope</DataTableTh>
              <DataTableTh className={cn(TH, 'w-24 text-center')}>
                Blocks
              </DataTableTh>
              <DataTableTh className={cn(TH, 'w-24 text-center')}>
                Used
              </DataTableTh>
              <DataTableTh className={cn(TH, 'w-28')}>Status</DataTableTh>
              <DataTableTh className={cn(TH, 'pr-4 text-right')}>
                <span className="sr-only">Actions</span>
              </DataTableTh>
            </DataTableHead>
            <DataTableBody>
              {templates.map((template) => (
                <LetterTemplateRow
                  key={template.id}
                  template={template}
                  onOpenInBuilder={() => openInBuilder(template)}
                  onMakeDefault={() => makeDefault(template)}
                />
              ))}
            </DataTableBody>
          </DataTable>
        </div>
      </div>

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="mb-4 min-w-0 max-w-3xl">
          <h3 className="text-sm font-bold text-[#2D2061]">Offer e-mails</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
            Choose which e-mails the candidate receives. Edit their wording in{' '}
            <Link
              to={getSettingsSectionPath('templates')}
              className="font-semibold text-[#2F5AA8] hover:underline"
            >
              Settings → Messaging → Email Templates
            </Link>
            . Who in your company is told about offers is set under{' '}
            <Link
              to={getSettingsSectionPath(
                'offer-management-team-notifications',
              )}
              className="font-semibold text-[#2F5AA8] hover:underline"
            >
              Team notifications
            </Link>
            .
          </p>
        </div>

        <div className="overflow-hidden rounded-[8px] border border-[#E4E1EE] bg-white">
          <DataTable minWidthClassName="min-w-[52rem]">
            <DataTableHead className="!border-[#C9C6D6]">
              <DataTableTh className={cn(TH, 'pl-4')}>E-mail</DataTableTh>
              <DataTableTh className={TH}>Subject</DataTableTh>
              <DataTableTh className={cn(TH, 'w-28 pr-4 text-center')}>
                Send
              </DataTableTh>
            </DataTableHead>
            <DataTableBody>
              {emails.map((email) => (
                <OfferEmailRow
                  key={email.id}
                  email={email}
                  onSendChange={(send) => patchEmail(email.id, send)}
                />
              ))}
            </DataTableBody>
          </DataTable>
        </div>

        <SectionSaveFooter>
          <SectionSaveButton
            onClick={() =>
              toast.success('Offer e-mail settings saved.', {
                title: 'Templates & Emails',
              })
            }
          />
        </SectionSaveFooter>
      </div>

      <NewTemplatePanel
        open={newTemplateOpen}
        onClose={() => setNewTemplateOpen(false)}
        onSave={createTemplate}
      />
    </div>
  )
}

function LetterTemplateRow({
  template,
  onOpenInBuilder,
  onMakeDefault,
}: {
  template: OfferLetterTemplate
  onOpenInBuilder: () => void
  onMakeDefault: () => void
}) {
  return (
    <DataTableRow className="border-b border-[#EEEDF3]">
      <DataTableTd className="!py-3.5 pl-4 !whitespace-normal">
        <span className="inline-flex rounded-md bg-[#EDE9FE] px-2 py-0.5 text-[10px] font-bold tracking-[0.04em] text-[#6D28D9] uppercase">
          {template.tag}
        </span>
        <p className="mt-1 text-sm font-semibold text-[#2D2061]">
          {template.name}
        </p>
      </DataTableTd>
      <DataTableTd className="!py-3.5 text-sm text-[#6B6B80]">
        {template.scope}
      </DataTableTd>
      <DataTableTd className="!py-3.5 text-center text-sm text-[#2D2061]">
        {template.blocks}
      </DataTableTd>
      <DataTableTd className="!py-3.5 text-center text-sm text-[#2D2061]">
        {template.used}
      </DataTableTd>
      <DataTableTd className="!py-3.5">
        {template.isDefault ? (
          <span className="inline-flex rounded-full bg-[#E8E4F8] px-2.5 py-1 text-[11px] font-semibold text-[#4C3A8A]">
            Default
          </span>
        ) : (
          <span className="text-sm font-medium text-[#15803D]">On</span>
        )}
      </DataTableTd>
      <DataTableTd className="!py-3.5 pr-4 text-right">
        <div className="inline-flex flex-wrap items-center justify-end gap-x-2 gap-y-1 text-xs font-semibold text-[#2D2061]">
          <button
            type="button"
            className="hover:underline"
            onClick={onOpenInBuilder}
          >
            Open in Builder
          </button>
          {!template.isDefault ? (
            <>
              <span className="text-[#C8C5D6]" aria-hidden="true">
                ·
              </span>
              <button
                type="button"
                className="hover:underline"
                onClick={onMakeDefault}
              >
                Make default
              </button>
            </>
          ) : null}
        </div>
      </DataTableTd>
    </DataTableRow>
  )
}

function OfferEmailRow({
  email,
  onSendChange,
}: {
  email: OfferEmail
  onSendChange: (send: boolean) => void
}) {
  return (
    <DataTableRow className="border-b border-[#EEEDF3]">
      <DataTableTd className="!py-3.5 pl-4 !whitespace-normal">
        <p className="text-sm font-semibold text-[#2D2061]">{email.title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
          {email.description}
        </p>
      </DataTableTd>
      <DataTableTd className="!py-3.5 !whitespace-normal text-sm text-[#6B6B80]">
        {email.subject}
      </DataTableTd>
      <DataTableTd className="!py-3.5 pr-4 text-center">
        <div className="inline-flex justify-center">
          <Switch
            checked={email.send}
            onCheckedChange={onSendChange}
            aria-label={`Send ${email.title}`}
            className="!gap-0"
          />
        </div>
      </DataTableTd>
    </DataTableRow>
  )
}

function NewTemplatePanel({
  open,
  onClose,
  onSave,
}: {
  open: boolean
  onClose: () => void
  onSave: (values: NewTemplateFormValues) => void
}) {
  const [values, setValues] = useState(EMPTY_NEW_TEMPLATE)
  const [nameError, setNameError] = useState('')
  const [lastOpenKey, setLastOpenKey] = useState<string | null>(null)

  const openKey = open ? 'new' : null
  if (openKey !== lastOpenKey) {
    setLastOpenKey(openKey)
    if (openKey) {
      setValues(EMPTY_NEW_TEMPLATE)
      setNameError('')
    }
  }

  function handleSave() {
    if (!values.name.trim()) {
      setNameError('Template name is required.')
      return
    }
    onSave(values)
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="New template"
      widthClassName="w-full max-w-[30rem]"
      footerClassName="justify-end gap-3 border-t border-[#ECEAF3]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="!h-10 !rounded-[8px] !border-[#2D2061] !px-5 !text-[#2D2061] hover:!bg-[#F7F6FA]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="!h-10 !rounded-[8px] !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            Create template
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <Input
          label="Template name"
          requiredMark
          placeholder="e.g. Internship Offer"
          value={values.name}
          onChange={(event) => {
            setValues((current) => ({ ...current, name: event.target.value }))
            if (nameError) setNameError('')
          }}
          error={nameError || undefined}
        />
        <Input
          label="Tag"
          placeholder="e.g. INTERN"
          value={values.tag}
          onChange={(event) =>
            setValues((current) => ({ ...current, tag: event.target.value }))
          }
        />
        <Select
          id="new-template-scope"
          label="Scope"
          options={TEMPLATE_SCOPE_OPTIONS}
          value={values.scope}
          onChange={(event) =>
            setValues((current) => ({ ...current, scope: event.target.value }))
          }
        />
      </div>
    </SidePanel>
  )
}

/* -------------------------------------------------------------------------- */
/* Team Notifications                                                         */
/* -------------------------------------------------------------------------- */

type TeamAudienceKey =
  | 'offer-creator'
  | 'hiring-manager'
  | 'approvers'
  | 'job-lead'
  | 'job-team'

type TeamRoleKey = 'collaborator' | 'recruiter' | 'super-user'

type TeamNotificationEvent = {
  id: string
  title: string
  description?: string
  emailChannel: boolean
  audience: Record<TeamAudienceKey, boolean>
  roles: Record<TeamRoleKey, boolean>
  people: string[]
}

const TEAM_AUDIENCE_OPTIONS: Array<{ key: TeamAudienceKey; label: string }> = [
  { key: 'offer-creator', label: 'Offer creator' },
  { key: 'hiring-manager', label: 'Hiring manager' },
  { key: 'approvers', label: 'Approvers of this offer' },
  { key: 'job-lead', label: 'Job lead recruiter' },
  { key: 'job-team', label: 'Job team' },
]

const TEAM_ROLE_OPTIONS: Array<{ key: TeamRoleKey; label: string }> = [
  { key: 'collaborator', label: 'Collaborator' },
  { key: 'recruiter', label: 'Recruiter' },
  { key: 'super-user', label: 'Super User' },
]

const TEAM_PEOPLE_OPTIONS = [
  { value: 'priya-sharma', label: 'Priya Sharma' },
  { value: 'james-wilson', label: 'James Wilson' },
  { value: 'aisha-khan', label: 'Aisha Khan' },
  { value: 'marcus-lee', label: 'Marcus Lee' },
  { value: 'sofia-martinez', label: 'Sofia Martinez' },
]

const EMPTY_AUDIENCE: Record<TeamAudienceKey, boolean> = {
  'offer-creator': false,
  'hiring-manager': false,
  approvers: false,
  'job-lead': false,
  'job-team': false,
}

const EMPTY_ROLES: Record<TeamRoleKey, boolean> = {
  collaborator: false,
  recruiter: false,
  'super-user': false,
}

const INITIAL_TEAM_NOTIFICATIONS: TeamNotificationEvent[] = [
  {
    id: 'approval-needed',
    title: 'Approval needed',
    description:
      'The approver whose turn it is (or their delegate) is always included.',
    emailChannel: false,
    audience: { ...EMPTY_AUDIENCE },
    roles: { ...EMPTY_ROLES },
    people: [],
  },
  {
    id: 'approval-decision',
    title: 'Approval decision',
    description:
      'The person who submitted the offer or request is always included.',
    emailChannel: false,
    audience: { ...EMPTY_AUDIENCE },
    roles: { ...EMPTY_ROLES },
    people: [],
  },
  {
    id: 'offer-accepted',
    title: 'Offer accepted',
    emailChannel: true,
    audience: {
      ...EMPTY_AUDIENCE,
      'offer-creator': true,
      'hiring-manager': true,
    },
    roles: { ...EMPTY_ROLES },
    people: [],
  },
  {
    id: 'offer-declined',
    title: 'Offer declined',
    emailChannel: true,
    audience: {
      ...EMPTY_AUDIENCE,
      'offer-creator': true,
      'hiring-manager': true,
    },
    roles: { ...EMPTY_ROLES },
    people: [],
  },
  {
    id: 'change-requested',
    title: 'Change requested by the candidate',
    emailChannel: true,
    audience: { ...EMPTY_AUDIENCE, 'offer-creator': true },
    roles: { ...EMPTY_ROLES },
    people: [],
  },
  {
    id: 'offer-expired',
    title: 'Offer expired',
    emailChannel: true,
    audience: { ...EMPTY_AUDIENCE, 'offer-creator': true },
    roles: { ...EMPTY_ROLES },
    people: [],
  },
]

function TeamNotificationsTab() {
  const [events, setEvents] = useState(INITIAL_TEAM_NOTIFICATIONS)

  function patchEvent(
    id: string,
    patch: Partial<Omit<TeamNotificationEvent, 'id' | 'title'>>,
  ) {
    setEvents((current) =>
      current.map((event) =>
        event.id === id ? { ...event, ...patch } : event,
      ),
    )
  }

  function toggleAudience(id: string, key: TeamAudienceKey) {
    setEvents((current) =>
      current.map((event) =>
        event.id === id
          ? {
              ...event,
              audience: {
                ...event.audience,
                [key]: !event.audience[key],
              },
            }
          : event,
      ),
    )
  }

  function toggleRole(id: string, key: TeamRoleKey) {
    setEvents((current) =>
      current.map((event) =>
        event.id === id
          ? {
              ...event,
              roles: {
                ...event.roles,
                [key]: !event.roles[key],
              },
            }
          : event,
      ),
    )
  }

  function addPerson(id: string, personId: string) {
    if (!personId) return
    setEvents((current) =>
      current.map((event) => {
        if (event.id !== id || event.people.includes(personId)) return event
        return { ...event, people: [...event.people, personId] }
      }),
    )
  }

  function removePerson(id: string, personId: string) {
    setEvents((current) =>
      current.map((event) =>
        event.id === id
          ? {
              ...event,
              people: event.people.filter((person) => person !== personId),
            }
          : event,
      ),
    )
  }

  function handleSave() {
    toast.success('Team notification settings saved.', {
      title: 'Team Notifications',
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <ChangesBanner />

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="mb-4 max-w-3xl">
          <h3 className="text-sm font-bold text-[#2D2061]">
            Team notifications
          </h3>
          <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
            Choose who in your company is told about each offer event, and
            whether by e-mail as well as the in-app bell. Candidate e-mails are
            under{' '}
            <Link
              to={getSettingsSectionPath('offer-management-templates-emails')}
              className="font-semibold text-[#2F5AA8] hover:underline"
            >
              Templates & emails
            </Link>
            . Anyone chosen here who cannot open the offer is skipped
            automatically.
          </p>
        </div>

        <div className="overflow-hidden rounded-[8px] border border-[#E4E1EE] bg-white">
          <ul className="divide-y divide-[#EEEDF3]">
            {events.map((event) => {
              const availablePeople = TEAM_PEOPLE_OPTIONS.filter(
                (person) => !event.people.includes(person.value),
              )
              return (
                <li
                  key={event.id}
                  className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(12rem,18rem)_minmax(0,1fr)]"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#2D2061]">
                      {event.title}
                    </p>
                    {event.description ? (
                      <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
                        {event.description}
                      </p>
                    ) : null}
                    <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-[#6B6B80]">
                      <span>Bell</span>
                      <span className="text-[#C8C5D6]" aria-hidden="true">
                        +
                      </span>
                      <Switch
                        checked={event.emailChannel}
                        onCheckedChange={(emailChannel) =>
                          patchEvent(event.id, { emailChannel })
                        }
                        aria-label={`Also e-mail for ${event.title}`}
                        className="!gap-0"
                      />
                      <span>E-mail</span>
                    </div>
                  </div>

                  <div className="min-w-0 space-y-3">
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {TEAM_AUDIENCE_OPTIONS.map((option) => (
                        <Checkbox
                          key={option.key}
                          id={`${event.id}-${option.key}`}
                          label={option.label}
                          checked={event.audience[option.key]}
                          onChange={() =>
                            toggleAudience(event.id, option.key)
                          }
                          className="!gap-0 [&_span]:text-xs [&_span]:text-[#2D2061]"
                        />
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="text-xs font-semibold text-[#6B6B80]">
                        Roles:
                      </span>
                      {TEAM_ROLE_OPTIONS.map((option) => (
                        <Checkbox
                          key={option.key}
                          id={`${event.id}-role-${option.key}`}
                          label={option.label}
                          checked={event.roles[option.key]}
                          onChange={() => toggleRole(event.id, option.key)}
                          className="!gap-0 [&_span]:text-xs [&_span]:text-[#2D2061]"
                        />
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-[#6B6B80]">
                        People:
                      </span>
                      <div className="min-w-[12rem] flex-1 sm:max-w-xs">
                        <Select
                          id={`${event.id}-people`}
                          aria-label={`Add a person for ${event.title}`}
                          options={availablePeople}
                          placeholder="+ Add a person..."
                          value=""
                          onChange={(changeEvent) => {
                            addPerson(event.id, changeEvent.target.value)
                          }}
                          disabled={availablePeople.length === 0}
                          className="!h-9 !rounded-[8px] !text-xs"
                        />
                      </div>
                      {event.people.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {event.people.map((personId) => {
                            const person = TEAM_PEOPLE_OPTIONS.find(
                              (option) => option.value === personId,
                            )
                            return (
                              <span
                                key={personId}
                                className="inline-flex items-center gap-1 rounded-full bg-[#EDE9FE] px-2 py-0.5 text-[11px] font-semibold text-[#4C3A8A]"
                              >
                                {person?.label ?? personId}
                                <button
                                  type="button"
                                  aria-label={`Remove ${person?.label ?? personId}`}
                                  className="rounded-full p-0.5 hover:bg-white/70"
                                  onClick={() =>
                                    removePerson(event.id, personId)
                                  }
                                >
                                  <X
                                    className="size-3"
                                    strokeWidth={2.25}
                                    aria-hidden="true"
                                  />
                                </button>
                              </span>
                            )
                          })}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <SectionSaveFooter>
          <SectionSaveButton onClick={handleSave} />
        </SectionSaveFooter>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Entities & Compensation                                                    */
/* -------------------------------------------------------------------------- */

type CompType = 'Fixed' | 'Allowance' | 'Variable'
type CompFrequency = 'Monthly' | 'Annual' | 'One-time'
type NumberReset = 'never' | 'every-year' | 'every-month'
type HeaderStyle =
  | 'logo-left-ref-right'
  | 'logo-centre'
  | 'logo-right-ref-left'

type LegalEntity = {
  id: string
  brandName: string
  legalName: string
  address: string
  country: string
  email: string
  phone: string
  website: string
  currency: string
  logoName: string
  primaryColour: string
  accentColour: string
  font: string
  headerStyle: HeaderStyle
  footerDisclaimer: string
  refPrefix: string
  sequenceLength: number
  reset: NumberReset
  includeYear: boolean
  offerCount: number
  isDefault: boolean
}

type CompensationComponent = {
  id: string
  name: string
  type: CompType
  frequency: CompFrequency
  mandatory: boolean
  inTotal: boolean
  active: boolean
}

type Signatory = {
  id: string
  name: string
  title: string
  signatureName: string
  sealName: string
  isDefault: boolean
}

type NewCompFormValues = {
  name: string
  type: CompType
  frequency: CompFrequency
  mandatory: boolean
  inTotal: boolean
}

type NewSignatoryFormValues = {
  name: string
  title: string
}

const EMPTY_NEW_COMP: NewCompFormValues = {
  name: '',
  type: 'Fixed',
  frequency: 'Monthly',
  mandatory: false,
  inTotal: true,
}

const EMPTY_NEW_SIGNATORY: NewSignatoryFormValues = {
  name: '',
  title: '',
}

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'INR', label: 'INR — Indian Rupee' },
  { value: 'AED', label: 'AED — UAE Dirham' },
]

const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Source Sans 3', label: 'Source Sans 3' },
  { value: 'Georgia', label: 'Georgia' },
]

const HEADER_STYLE_OPTIONS: Array<{ value: HeaderStyle; label: string }> = [
  { value: 'logo-left-ref-right', label: 'Logo left, reference right' },
  { value: 'logo-centre', label: 'Logo centred' },
  { value: 'logo-right-ref-left', label: 'Logo right, reference left' },
]

const HEADER_LAYOUT_CLASS: Record<HeaderStyle, string> = {
  'logo-left-ref-right': '',
  'logo-centre': 'flex-col items-center text-center',
  'logo-right-ref-left': 'flex-row-reverse',
}

const HEADER_REF_ALIGN_CLASS: Record<HeaderStyle, string> = {
  'logo-left-ref-right': 'text-right',
  'logo-centre': 'text-center',
  'logo-right-ref-left': 'text-left',
}

const RESET_OPTIONS: Array<{ value: NumberReset; label: string }> = [
  { value: 'never', label: 'Never' },
  { value: 'every-year', label: 'Every year' },
  { value: 'every-month', label: 'Every month' },
]

const COMP_TYPE_OPTIONS: Array<{ value: CompType; label: string }> = [
  { value: 'Fixed', label: 'Fixed' },
  { value: 'Allowance', label: 'Allowance' },
  { value: 'Variable', label: 'Variable' },
]

const COMP_FREQUENCY_OPTIONS: Array<{ value: CompFrequency; label: string }> = [
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Annual', label: 'Annual' },
  { value: 'One-time', label: 'One-time' },
]

const DEFAULT_FOOTER =
  'This offer is confidential and intended solely for the named candidate. Terms are subject to background checks and signed acceptance.'

function toCompToken(name: string): string {
  const token = name
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
  return `{{${token || 'Component'}}}`
}

function formatRefNumber(
  prefix: string,
  sequenceLength: number,
  includeYear: boolean,
  sequence = 1,
): string {
  const year = new Date().getFullYear()
  const padded = String(sequence).padStart(Math.max(1, sequenceLength), '0')
  const safePrefix = prefix.trim() || 'OFR'
  return includeYear
    ? `${safePrefix}-${year}-${padded}`
    : `${safePrefix}-${padded}`
}

function entityRefNumber(entity: LegalEntity, sequence = 1): string {
  return formatRefNumber(
    entity.refPrefix,
    entity.sequenceLength,
    entity.includeYear,
    sequence,
  )
}

function createEmptyEntity(overrides: Partial<LegalEntity> = {}): LegalEntity {
  return {
    id: `entity-${Date.now()}`,
    brandName: '',
    legalName: '',
    address: '',
    country: '',
    email: '',
    phone: '',
    website: '',
    currency: 'USD',
    logoName: '',
    primaryColour: '#25225E',
    accentColour: '#5B55C9',
    font: 'Inter',
    headerStyle: 'logo-left-ref-right',
    footerDisclaimer: DEFAULT_FOOTER,
    refPrefix: 'OFR',
    sequenceLength: 4,
    reset: 'every-year',
    includeYear: true,
    offerCount: 0,
    isDefault: false,
    ...overrides,
  }
}

const INITIAL_ENTITIES: LegalEntity[] = [
  createEmptyEntity({
    id: 'rst10',
    brandName: 'rst10',
    legalName: 'rst10',
    isDefault: true,
  }),
]

const INITIAL_COMPONENTS: CompensationComponent[] = [
  {
    id: 'basic-salary',
    name: 'Basic Salary',
    type: 'Fixed',
    frequency: 'Monthly',
    mandatory: true,
    inTotal: true,
    active: true,
  },
  {
    id: 'housing',
    name: 'Housing Allowance',
    type: 'Allowance',
    frequency: 'Monthly',
    mandatory: false,
    inTotal: true,
    active: true,
  },
  {
    id: 'transport',
    name: 'Transport Allowance',
    type: 'Allowance',
    frequency: 'Monthly',
    mandatory: false,
    inTotal: true,
    active: true,
  },
  {
    id: 'bonus',
    name: 'Annual Target Bonus',
    type: 'Variable',
    frequency: 'Annual',
    mandatory: false,
    inTotal: false,
    active: true,
  },
]

const INITIAL_SIGNATORIES: Signatory[] = [
  {
    id: 'signatory-1',
    name: 'Chiranjeev Parsoya',
    title: 'Authorised Signatory',
    signatureName: '',
    sealName: '',
    isDefault: true,
  },
]

function ColourField({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-[#2D2061]">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <span
          className="size-9 shrink-0 overflow-hidden rounded-[8px] border border-[#D5D2E2]"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="size-full cursor-pointer opacity-0"
            aria-label={`${label} picker`}
          />
        </span>
        <input
          id={id}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn(INPUT, 'uppercase')}
          aria-label={`${label} hex`}
        />
      </div>
    </div>
  )
}

function LetterheadPreview({
  entity,
  currentRef,
  previewDate,
}: {
  entity: LegalEntity
  currentRef: string
  previewDate: string
}) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-[#E4E1EE] bg-white shadow-sm">
      <div
        className={cn(
          'flex gap-3 p-4 text-white',
          HEADER_LAYOUT_CLASS[entity.headerStyle],
        )}
        style={{
          backgroundColor: entity.primaryColour,
          fontFamily: entity.font,
        }}
      >
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-white/15 text-sm font-bold">
            {(entity.brandName || 'R').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {entity.brandName || 'Brand name'}
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-white/80">
              {entity.address.trim() || 'Registered address appears here'}
            </p>
          </div>
        </div>
        <div
          className={cn(
            'shrink-0 text-[11px] leading-relaxed text-white/90',
            HEADER_REF_ALIGN_CLASS[entity.headerStyle],
          )}
        >
          <p>Ref: {currentRef}</p>
          <p>{previewDate}</p>
        </div>
      </div>
      <div className="space-y-3 p-4" style={{ fontFamily: entity.font }}>
        <p className="text-sm font-bold text-[#2D2061]">Offer of Employment</p>
        <div
          className="rounded-[8px] px-3 py-2 text-xs leading-relaxed text-[#2D2061]"
          style={{
            backgroundColor: `${entity.accentColour}22`,
            borderLeft: `3px solid ${entity.accentColour}`,
          }}
        >
          Policy notes use the accent colour.
        </div>
        <p className="text-[11px] leading-relaxed text-[#8B8B9E]">
          {entity.footerDisclaimer || 'Footer disclaimer appears here.'}
        </p>
      </div>
    </div>
  )
}

function EntitiesCompensationTab() {
  const logoInputRef = useRef<HTMLInputElement>(null)
  const [entities, setEntities] = useState(INITIAL_ENTITIES)
  const [activeEntityId, setActiveEntityId] = useState(INITIAL_ENTITIES[0].id)
  const [components, setComponents] = useState(INITIAL_COMPONENTS)
  const [signatories, setSignatories] = useState(INITIAL_SIGNATORIES)
  const [editingComponent, setEditingComponent] =
    useState<CompensationComponent | null>(null)
  const [pendingDeleteComponent, setPendingDeleteComponent] =
    useState<CompensationComponent | null>(null)
  const [pendingDeleteSignatory, setPendingDeleteSignatory] =
    useState<Signatory | null>(null)
  const [newComp, setNewComp] = useState(EMPTY_NEW_COMP)
  const [newSignatory, setNewSignatory] = useState(EMPTY_NEW_SIGNATORY)
  const [addEntityOpen, setAddEntityOpen] = useState(false)
  const [newEntityName, setNewEntityName] = useState('')
  const [newEntityError, setNewEntityError] = useState('')

  const activeEntity =
    entities.find((entity) => entity.id === activeEntityId) ?? entities[0]
  const currentRef = entityRefNumber(activeEntity, 1)
  const nextRef = entityRefNumber(activeEntity, 2)
  const previewDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  function patchActiveEntity(patch: Partial<LegalEntity>) {
    setEntities((current) =>
      current.map((entity) =>
        entity.id === activeEntity.id ? { ...entity, ...patch } : entity,
      ),
    )
  }

  function patchComponent(id: string, patch: Partial<CompensationComponent>) {
    setComponents((current) =>
      current.map((component) =>
        component.id === id ? { ...component, ...patch } : component,
      ),
    )
  }

  function patchSignatory(id: string, patch: Partial<Signatory>) {
    setSignatories((current) =>
      current.map((signatory) =>
        signatory.id === id ? { ...signatory, ...patch } : signatory,
      ),
    )
  }

  function patchEditingComponent(patch: Partial<CompensationComponent>) {
    setEditingComponent((current) =>
      current ? { ...current, ...patch } : current,
    )
  }

  function closeAddEntityPanel() {
    setAddEntityOpen(false)
    setNewEntityError('')
  }

  function makeDefaultEntity(entity: LegalEntity) {
    setEntities((current) =>
      current.map((row) => ({
        ...row,
        isDefault: row.id === entity.id,
      })),
    )
    toast.success(`“${entity.brandName}” is now the default entity.`, {
      title: 'Legal entity',
    })
  }

  function handleAddEntity() {
    const name = newEntityName.trim()
    if (!name) {
      setNewEntityError('Entity name is required.')
      return
    }
    const entity = createEmptyEntity({
      brandName: name,
      legalName: name,
      isDefault: entities.length === 0,
    })
    setEntities((current) => [...current, entity])
    setActiveEntityId(entity.id)
    closeAddEntityPanel()
    setNewEntityName('')
    toast.success(`“${name}” added.`, { title: 'Legal entity' })
  }

  function handleSaveEntity() {
    if (!activeEntity.brandName.trim() || !activeEntity.legalName.trim()) {
      toast.error('Brand public name and registered legal name are required.', {
        title: 'Save entity',
      })
      return
    }
    toast.success(`“${activeEntity.brandName}” saved.`, {
      title: 'Legal entity',
    })
  }

  function handleLogoUpload(file: File | undefined) {
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo must be 2 MB or smaller.', { title: 'Brand logo' })
      return
    }
    patchActiveEntity({ logoName: file.name })
    toast.success(`“${file.name}” selected.`, { title: 'Brand logo' })
  }

  function moveComponent(id: string, direction: -1 | 1) {
    setComponents((current) => {
      const index = current.findIndex((component) => component.id === id)
      const nextIndex = index + direction
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current
      }
      const next = [...current]
      const [item] = next.splice(index, 1)
      next.splice(nextIndex, 0, item)
      return next
    })
  }

  function handleAddComponent() {
    const name = newComp.name.trim()
    if (!name) {
      toast.error('Component name is required.', {
        title: 'Compensation components',
      })
      return
    }
    setComponents((current) => [
      ...current,
      {
        id: `comp-${Date.now()}`,
        name,
        type: newComp.type,
        frequency: newComp.frequency,
        mandatory: newComp.mandatory,
        inTotal: newComp.inTotal,
        active: true,
      },
    ])
    setNewComp(EMPTY_NEW_COMP)
    toast.success(`“${name}” added.`, { title: 'Compensation components' })
  }

  function handleSaveComponent(values: CompensationComponent) {
    const name = values.name.trim()
    if (!name) {
      toast.error('Component name is required.', {
        title: 'Compensation components',
      })
      return
    }
    patchComponent(values.id, { ...values, name })
    setEditingComponent(null)
    toast.success(`“${name}” updated.`, { title: 'Compensation components' })
  }

  function confirmDeleteComponent() {
    if (!pendingDeleteComponent) return
    setComponents((current) =>
      current.filter((component) => component.id !== pendingDeleteComponent.id),
    )
    setPendingDeleteComponent(null)
    toast.success('Component deleted.', {
      title: 'Compensation components',
    })
  }

  function handleAddSignatory() {
    const name = newSignatory.name.trim()
    const title = newSignatory.title.trim() || 'Authorised Signatory'
    if (!name) {
      toast.error('Signatory name is required.', {
        title: 'Authorised signatories',
      })
      return
    }
    setSignatories((current) => [
      ...current,
      {
        id: `signatory-${Date.now()}`,
        name,
        title,
        signatureName: '',
        sealName: '',
        isDefault: current.length === 0,
      },
    ])
    setNewSignatory(EMPTY_NEW_SIGNATORY)
    toast.success(`“${name}” added.`, { title: 'Authorised signatories' })
  }

  function makeDefaultSignatory(id: string) {
    const selected = signatories.find((signatory) => signatory.id === id)
    setSignatories((current) =>
      current.map((signatory) => ({
        ...signatory,
        isDefault: signatory.id === id,
      })),
    )
    toast.success(`“${selected?.name ?? 'Signatory'}” is now the default.`, {
      title: 'Authorised signatories',
    })
  }

  function confirmDeleteSignatory() {
    if (!pendingDeleteSignatory) return
    setSignatories((current) => {
      const next = current.filter(
        (signatory) => signatory.id !== pendingDeleteSignatory.id,
      )
      if (
        pendingDeleteSignatory.isDefault &&
        next.length > 0 &&
        !next.some((signatory) => signatory.isDefault)
      ) {
        next[0] = { ...next[0], isDefault: true }
      }
      return next
    })
    setPendingDeleteSignatory(null)
    toast.success('Signatory deleted.', {
      title: 'Authorised signatories',
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <ChangesBanner />

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {entities.map((entity) => (
            <button
              key={entity.id}
              type="button"
              onClick={() => setActiveEntityId(entity.id)}
              className={cn(
                'inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-colors',
                entity.id === activeEntity.id
                  ? 'border-[#2D2061] bg-[#2D2061] text-white'
                  : 'border-[#D5D2E2] bg-white text-[#2D2061] hover:bg-[#F7F6FA]',
              )}
            >
              {entity.isDefault ? (
                <Star
                  className="size-3.5 fill-current"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              ) : null}
              {entity.brandName || 'Untitled'}
            </button>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => setAddEntityOpen(true)}
            className="!h-9 !rounded-full !border-[#2D2061] !px-3.5 !text-[#2D2061] hover:!bg-white"
          >
            <Plus className="size-4" strokeWidth={2.25} aria-hidden="true" />
            Add legal entity
          </Button>
        </div>

        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#2D2061]">
              {activeEntity.brandName || 'Untitled entity'}
            </h3>
            <p className="mt-0.5 text-xs text-[#8B8B9E]">
              {activeEntity.offerCount} offers use this entity.
            </p>
          </div>
          {activeEntity.isDefault ? (
            <span className="inline-flex rounded-full bg-[#E8E4F8] px-2.5 py-1 text-[11px] font-semibold text-[#4C3A8A]">
              Default entity
            </span>
          ) : (
            <button
              type="button"
              className="text-xs font-semibold text-[#2D2061] hover:underline"
              onClick={() => makeDefaultEntity(activeEntity)}
            >
              Make default
            </button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Brand public name"
            requiredMark
            value={activeEntity.brandName}
            onChange={(event) =>
              patchActiveEntity({ brandName: event.target.value })
            }
          />
          <Input
            label="Registered legal entity name"
            requiredMark
            value={activeEntity.legalName}
            onChange={(event) =>
              patchActiveEntity({ legalName: event.target.value })
            }
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Registered address"
              rows={3}
              value={activeEntity.address}
              onChange={(event) =>
                patchActiveEntity({ address: event.target.value })
              }
            />
          </div>
          <Input
            label="Country"
            value={activeEntity.country}
            onChange={(event) =>
              patchActiveEntity({ country: event.target.value })
            }
          />
          <Input
            label="Contact e-mail"
            type="email"
            value={activeEntity.email}
            onChange={(event) =>
              patchActiveEntity({ email: event.target.value })
            }
          />
          <Input
            label="Contact phone"
            value={activeEntity.phone}
            onChange={(event) =>
              patchActiveEntity({ phone: event.target.value })
            }
          />
          <Input
            label="Website"
            value={activeEntity.website}
            onChange={(event) =>
              patchActiveEntity({ website: event.target.value })
            }
          />
          <Select
            id="entity-currency"
            label="Default currency"
            requiredMark
            options={CURRENCY_OPTIONS}
            value={activeEntity.currency}
            onChange={(event) =>
              patchActiveEntity({ currency: event.target.value })
            }
          />
        </div>
      </div>

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-[#2D2061]">
            Brand & letterhead
          </h3>
          <p className="mt-0.5 text-xs text-[#8B8B9E]">
            The preview updates as you type.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="mb-1.5 text-xs font-medium text-[#2D2061]">
                Brand logo
              </p>
              <input
                ref={logoInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml"
                className="sr-only"
                onChange={(event) => {
                  handleLogoUpload(event.target.files?.[0])
                  event.target.value = ''
                }}
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="inline-flex h-10 items-center gap-1.5 rounded-[8px] border border-dashed border-[#C8C5D6] bg-white px-4 text-sm font-semibold text-[#2D2061] transition-colors hover:border-[#2D2061] hover:bg-[#F7F6FA]"
              >
                <Upload className="size-4" strokeWidth={1.75} aria-hidden="true" />
                Upload logo
              </button>
              <p className="mt-1.5 text-[11px] text-[#8B8B9E]">
                {activeEntity.logoName
                  ? activeEntity.logoName
                  : 'PNG, JPG or SVG, up to 2 MB.'}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ColourField
                id="entity-primary-colour"
                label="Primary colour"
                value={activeEntity.primaryColour}
                onChange={(primaryColour) =>
                  patchActiveEntity({ primaryColour })
                }
              />
              <ColourField
                id="entity-accent-colour"
                label="Accent colour"
                value={activeEntity.accentColour}
                onChange={(accentColour) =>
                  patchActiveEntity({ accentColour })
                }
              />
            </div>

            <Select
              id="entity-font"
              label="Font"
              options={FONT_OPTIONS}
              value={activeEntity.font}
              onChange={(event) =>
                patchActiveEntity({ font: event.target.value })
              }
            />
            <Select
              id="entity-header-style"
              label="Header style"
              options={HEADER_STYLE_OPTIONS}
              value={activeEntity.headerStyle}
              onChange={(event) =>
                patchActiveEntity({
                  headerStyle: event.target.value as HeaderStyle,
                })
              }
            />
            <Textarea
              label="Footer disclaimer"
              rows={4}
              value={activeEntity.footerDisclaimer}
              onChange={(event) =>
                patchActiveEntity({ footerDisclaimer: event.target.value })
              }
              helperText="**bold** and *italic* markdown works."
            />
          </div>

          <LetterheadPreview
            entity={activeEntity}
            currentRef={currentRef}
            previewDate={previewDate}
          />
        </div>
      </div>

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-[#2D2061]">
            Reference numbering
          </h3>
          <p className="mt-0.5 text-xs text-[#8B8B9E]">
            Generated when an offer is created and never changes, even if you
            revise the offer later.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Prefix"
            value={activeEntity.refPrefix}
            onChange={(event) =>
              patchActiveEntity({ refPrefix: event.target.value })
            }
          />
          <Input
            label="Sequence length"
            type="number"
            min={1}
            max={8}
            value={String(activeEntity.sequenceLength)}
            onChange={(event) =>
              patchActiveEntity({
                sequenceLength: Math.max(
                  1,
                  Math.min(8, Number(event.target.value) || 1),
                ),
              })
            }
          />
          <Select
            id="entity-ref-reset"
            label="Reset"
            options={RESET_OPTIONS}
            value={activeEntity.reset}
            onChange={(event) =>
              patchActiveEntity({
                reset: event.target.value as NumberReset,
              })
            }
          />
        </div>

        <div className="mt-3">
          <Checkbox
            id="entity-include-year"
            label="Include the year"
            checked={activeEntity.includeYear}
            onChange={(event) =>
              patchActiveEntity({ includeYear: event.target.checked })
            }
          />
        </div>

        <p className="mt-3 text-xs text-[#6B6B80]">
          Format:{' '}
          <span className="font-semibold text-[#2D2061]">{currentRef}</span>
          {' · '}
          next number:{' '}
          <span className="font-semibold text-[#2D2061]">{nextRef}</span>
        </p>

        <SectionSaveFooter>
          <SectionSaveButton
            onClick={handleSaveEntity}
            className="!h-10 !px-5"
          >
            Save entity
          </SectionSaveButton>
        </SectionSaveFooter>
      </div>

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-[#2D2061]">
            Compensation components
          </h3>
          <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
            These become the fields of wizard step 2 and the rows of the
            compensation table on the offer letter.
          </p>
        </div>

        <div className="overflow-hidden rounded-[8px] border border-[#E4E1EE] bg-white">
          <DataTable minWidthClassName="min-w-[64rem]">
            <DataTableHead className="!border-[#C9C6D6]">
              <DataTableTh className={cn(TH, 'w-20 pl-4')}>Order</DataTableTh>
              <DataTableTh className={TH}>Component</DataTableTh>
              <DataTableTh className={TH}>Token</DataTableTh>
              <DataTableTh className={cn(TH, 'w-28')}>Type</DataTableTh>
              <DataTableTh className={cn(TH, 'w-28')}>Frequency</DataTableTh>
              <DataTableTh className={cn(TH, 'w-24')}>Mandatory</DataTableTh>
              <DataTableTh className={cn(TH, 'w-24')}>In total</DataTableTh>
              <DataTableTh className={cn(TH, 'w-24')}>Active</DataTableTh>
              <DataTableTh className={cn(TH, 'pr-4 text-right')}>
                <span className="sr-only">Actions</span>
              </DataTableTh>
            </DataTableHead>
            <DataTableBody>
              {components.map((component, index) => (
                <DataTableRow
                  key={component.id}
                  className="border-b border-[#EEEDF3]"
                >
                  <DataTableTd className="!py-3 pl-4">
                    <div className="inline-flex items-center gap-0.5">
                      <button
                        type="button"
                        aria-label={`Move ${component.name} up`}
                        disabled={index === 0}
                        onClick={() => moveComponent(component.id, -1)}
                        className="inline-flex size-7 items-center justify-center rounded-md text-[#6B6B80] hover:bg-[#F5F4FA] hover:text-[#2D2061] disabled:cursor-default disabled:text-[#D5D2E2] disabled:hover:bg-transparent"
                      >
                        <ArrowUp className="size-3.5" strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Move ${component.name} down`}
                        disabled={index === components.length - 1}
                        onClick={() => moveComponent(component.id, 1)}
                        className="inline-flex size-7 items-center justify-center rounded-md text-[#6B6B80] hover:bg-[#F5F4FA] hover:text-[#2D2061] disabled:cursor-default disabled:text-[#D5D2E2] disabled:hover:bg-transparent"
                      >
                        <ArrowDown className="size-3.5" strokeWidth={2} />
                      </button>
                    </div>
                  </DataTableTd>
                  <DataTableTd className="!py-3 text-sm font-semibold text-[#2D2061]">
                    {component.name}
                  </DataTableTd>
                  <DataTableTd className="!py-3 font-mono text-xs text-[#6B6B80]">
                    {toCompToken(component.name)}
                  </DataTableTd>
                  <DataTableTd className="!py-3 text-sm text-[#6B6B80]">
                    {component.type}
                  </DataTableTd>
                  <DataTableTd className="!py-3 text-sm text-[#6B6B80]">
                    {component.frequency}
                  </DataTableTd>
                  <DataTableTd className="!py-3 text-sm text-[#6B6B80]">
                    {component.mandatory ? 'Yes' : 'No'}
                  </DataTableTd>
                  <DataTableTd className="!py-3 text-sm text-[#6B6B80]">
                    {component.inTotal ? 'Yes' : 'No'}
                  </DataTableTd>
                  <DataTableTd className="!py-3">
                    <Switch
                      checked={component.active}
                      onCheckedChange={(active) =>
                        patchComponent(component.id, { active })
                      }
                      aria-label={`Active ${component.name}`}
                      className="!gap-0"
                    />
                  </DataTableTd>
                  <DataTableTd className="!py-3 pr-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        className="text-xs font-semibold text-[#2D2061] hover:underline"
                        onClick={() => setEditingComponent(component)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${component.name}`}
                        className="inline-flex size-8 items-center justify-center rounded-md text-[#8B8B9E] hover:bg-[#FDF2F2] hover:text-[#E53935]"
                        onClick={() => setPendingDeleteComponent(component)}
                      >
                        <Trash2 className="size-3.5" strokeWidth={1.75} />
                      </button>
                    </div>
                  </DataTableTd>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTable>

          <div className="flex flex-wrap items-end gap-3 border-t border-[#EEEDF3] bg-[#FAFAFC] p-3.5">
            <div className="min-w-[12rem] flex-1">
              <Input
                placeholder="New component, e.g. Housing"
                value={newComp.name}
                onChange={(event) =>
                  setNewComp((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </div>
            <div className="w-32">
              <Select
                id="new-comp-type"
                options={COMP_TYPE_OPTIONS}
                value={newComp.type}
                onChange={(event) =>
                  setNewComp((current) => ({
                    ...current,
                    type: event.target.value as CompType,
                  }))
                }
                className="!h-11"
              />
            </div>
            <div className="w-32">
              <Select
                id="new-comp-frequency"
                options={COMP_FREQUENCY_OPTIONS}
                value={newComp.frequency}
                onChange={(event) =>
                  setNewComp((current) => ({
                    ...current,
                    frequency: event.target.value as CompFrequency,
                  }))
                }
                className="!h-11"
              />
            </div>
            <Checkbox
              id="new-comp-mandatory"
              label="Mandatory"
              checked={newComp.mandatory}
              onChange={(event) =>
                setNewComp((current) => ({
                  ...current,
                  mandatory: event.target.checked,
                }))
              }
              className="!gap-0 pb-2.5 [&_span]:text-xs"
            />
            <Checkbox
              id="new-comp-in-total"
              label="In total package"
              checked={newComp.inTotal}
              onChange={(event) =>
                setNewComp((current) => ({
                  ...current,
                  inTotal: event.target.checked,
                }))
              }
              className="!gap-0 pb-2.5 [&_span]:text-xs"
            />
            <Button
              type="button"
              onClick={handleAddComponent}
              className="!h-10 !rounded-[8px] !bg-[#2D2061] !px-3.5 text-sm font-semibold text-white hover:!bg-[#241a52]"
            >
              <Plus className="size-4" strokeWidth={2.25} aria-hidden="true" />
              Add
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-[#2D2061]">
            Authorised signatories
          </h3>
          <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
            The signature image and seal are applied automatically when an offer
            is sent. If none is uploaded, the signatory name is printed in
            script.
          </p>
        </div>

        <div className="space-y-3">
          {signatories.map((signatory) => (
            <div
              key={signatory.id}
              className="rounded-[8px] border border-[#E4E1EE] bg-white p-4"
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[#2D2061]">
                    {signatory.name}
                    <span className="font-normal text-[#6B6B80]">
                      {' '}
                      — {signatory.title}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {signatory.isDefault ? (
                    <span className="inline-flex rounded-full bg-[#E8E4F8] px-2.5 py-1 text-[11px] font-semibold text-[#4C3A8A]">
                      Default
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="text-xs font-semibold text-[#2D2061] hover:underline"
                      onClick={() => makeDefaultSignatory(signatory.id)}
                    >
                      Make default
                    </button>
                  )}
                  <button
                    type="button"
                    aria-label={`Delete ${signatory.name}`}
                    className="inline-flex size-8 items-center justify-center rounded-md text-[#8B8B9E] hover:bg-[#FDF2F2] hover:text-[#E53935]"
                    onClick={() => setPendingDeleteSignatory(signatory)}
                  >
                    <Trash2 className="size-3.5" strokeWidth={1.75} />
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <SignatoryUploadField
                  label="Signature"
                  emptyLabel="None — the name is printed in script"
                  fileName={signatory.signatureName}
                  onUpload={(fileName) =>
                    patchSignatory(signatory.id, { signatureName: fileName })
                  }
                />
                <SignatoryUploadField
                  label="Seal / stamp"
                  emptyLabel="Optional"
                  fileName={signatory.sealName}
                  onUpload={(fileName) =>
                    patchSignatory(signatory.id, { sealName: fileName })
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-3 rounded-[8px] border border-[#E4E1EE] bg-white p-3.5">
          <div className="min-w-[12rem] flex-1">
            <Input
              label="Signatory name"
              placeholder="e.g. Jane Doe"
              value={newSignatory.name}
              onChange={(event) =>
                setNewSignatory((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
            />
          </div>
          <div className="min-w-[12rem] flex-1">
            <Input
              label="Official title"
              placeholder="e.g. Authorised Signatory"
              value={newSignatory.title}
              onChange={(event) =>
                setNewSignatory((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
            />
          </div>
          <Button
            type="button"
            onClick={handleAddSignatory}
            className="!h-10 !rounded-[8px] !bg-[#2D2061] !px-3.5 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            <Plus className="size-4" strokeWidth={2.25} aria-hidden="true" />
            Add
          </Button>
        </div>
      </div>

      <SidePanel
        open={addEntityOpen}
        onClose={closeAddEntityPanel}
        title="Add legal entity"
        widthClassName="w-full max-w-[28rem]"
        footerClassName="justify-end gap-3 border-t border-[#ECEAF3]"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={closeAddEntityPanel}
              className="!h-10 !rounded-[8px] !border-[#2D2061] !px-5 !text-[#2D2061] hover:!bg-[#F7F6FA]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddEntity}
              className="!h-10 !rounded-[8px] !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
            >
              Create entity
            </Button>
          </>
        }
      >
        <Input
          label="Brand public name"
          requiredMark
          placeholder="e.g. Acme UK"
          value={newEntityName}
          onChange={(event) => {
            setNewEntityName(event.target.value)
            if (newEntityError) setNewEntityError('')
          }}
          error={newEntityError || undefined}
        />
      </SidePanel>

      <SidePanel
        open={editingComponent !== null}
        onClose={() => setEditingComponent(null)}
        title="Edit component"
        widthClassName="w-full max-w-[28rem]"
        footerClassName="justify-end gap-3 border-t border-[#ECEAF3]"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingComponent(null)}
              className="!h-10 !rounded-[8px] !border-[#2D2061] !px-5 !text-[#2D2061] hover:!bg-[#F7F6FA]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (editingComponent) handleSaveComponent(editingComponent)
              }}
              className="!h-10 !rounded-[8px] !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
            >
              Save
            </Button>
          </>
        }
      >
        {editingComponent ? (
          <div className="flex flex-col gap-4">
            <Input
              label="Component"
              requiredMark
              value={editingComponent.name}
              onChange={(event) =>
                patchEditingComponent({ name: event.target.value })
              }
            />
            <Select
              id="edit-comp-type"
              label="Type"
              options={COMP_TYPE_OPTIONS}
              value={editingComponent.type}
              onChange={(event) =>
                patchEditingComponent({
                  type: event.target.value as CompType,
                })
              }
            />
            <Select
              id="edit-comp-frequency"
              label="Frequency"
              options={COMP_FREQUENCY_OPTIONS}
              value={editingComponent.frequency}
              onChange={(event) =>
                patchEditingComponent({
                  frequency: event.target.value as CompFrequency,
                })
              }
            />
            <Checkbox
              id="edit-comp-mandatory"
              label="Mandatory"
              checked={editingComponent.mandatory}
              onChange={(event) =>
                patchEditingComponent({ mandatory: event.target.checked })
              }
            />
            <Checkbox
              id="edit-comp-in-total"
              label="In total package"
              checked={editingComponent.inTotal}
              onChange={(event) =>
                patchEditingComponent({ inTotal: event.target.checked })
              }
            />
            <p className="text-xs text-[#8B8B9E]">
              Token:{' '}
              <span className="font-mono text-[#2D2061]">
                {toCompToken(editingComponent.name)}
              </span>
            </p>
          </div>
        ) : null}
      </SidePanel>

      <ConfirmDeleteModal
        open={pendingDeleteComponent !== null}
        onClose={() => setPendingDeleteComponent(null)}
        title="Delete Component"
        itemName={pendingDeleteComponent?.name}
        onConfirm={confirmDeleteComponent}
      />

      <ConfirmDeleteModal
        open={pendingDeleteSignatory !== null}
        onClose={() => setPendingDeleteSignatory(null)}
        title="Delete Signatory"
        itemName={pendingDeleteSignatory?.name}
        onConfirm={confirmDeleteSignatory}
      />
    </div>
  )
}

function SignatoryUploadField({
  label,
  emptyLabel,
  fileName,
  onUpload,
}: {
  label: string
  emptyLabel: string
  fileName: string
  onUpload: (fileName: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      onUpload(file.name)
      toast.success(`“${file.name}” selected.`, { title: label })
    }
    event.target.value = ''
  }

  return (
    <div className="rounded-[8px] border border-[#EEEDF3] bg-[#FAFAFC] p-3">
      <p className="text-xs font-semibold text-[#2D2061]">{label}</p>
      <p className="mt-1 text-xs text-[#8B8B9E]">{fileName || emptyLabel}</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,.png,.jpg,.jpeg,.svg"
        className="sr-only"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        className="mt-2 !h-8 !rounded-[8px] !border-[#D5D2E2] !px-3 !text-xs !text-[#2D2061] hover:!bg-white"
      >
        Upload
      </Button>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Lifecycle & Signing                                                        */
/* -------------------------------------------------------------------------- */

type SignatureMethod = 'draw-or-type' | 'type-only' | 'draw-only'
type SignatureProvider = 'built-in' | 'docusign'

const SIGNATURE_METHOD_OPTIONS: Array<{
  value: SignatureMethod
  label: string
}> = [
  { value: 'draw-or-type', label: 'Draw or type' },
  { value: 'type-only', label: 'Type only' },
  { value: 'draw-only', label: 'Draw only' },
]

function LifecycleSettingRow({
  label,
  description,
  children,
}: {
  label: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-dashed border-[#E4E1EE] py-3.5 last:border-b-0 last:pb-0 first:pt-0">
      <div className="min-w-0 max-w-xl flex-1">
        <p className="text-sm font-semibold text-[#2D2061]">{label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
          {description}
        </p>
      </div>
      <div className="flex shrink-0 items-center justify-end sm:min-w-[7.5rem]">
        {children}
      </div>
    </div>
  )
}

function LifecycleNumberInput({
  id,
  value,
  onChange,
  min = 0,
  max = 99,
  'aria-label': ariaLabel,
}: {
  id: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  'aria-label': string
}) {
  return (
    <input
      id={id}
      type="number"
      min={min}
      max={max}
      value={value}
      aria-label={ariaLabel}
      onChange={(event) => {
        const next = Number(event.target.value)
        if (Number.isNaN(next)) return
        onChange(Math.max(min, Math.min(max, next)))
      }}
      className={cn(INPUT, 'w-20 text-center')}
    />
  )
}

function LifecycleSigningTab() {
  const [validityDays, setValidityDays] = useState(7)
  const [allowExtendExpiry, setAllowExtendExpiry] = useState(true)
  const [maxReminders, setMaxReminders] = useState(3)
  const [maxRevisions, setMaxRevisions] = useState(1)
  const [unopenedAfterDays, setUnopenedAfterDays] = useState(3)
  const [retentionYears, setRetentionYears] = useState(7)

  const [rescindRequiresApproval, setRescindRequiresApproval] = useState(false)
  const [joiningDateRequiresApproval, setJoiningDateRequiresApproval] =
    useState(false)

  const [signatureMethod, setSignatureMethod] =
    useState<SignatureMethod>('draw-or-type')
  const [verificationCode, setVerificationCode] = useState(false)

  const [signatureProvider, setSignatureProvider] =
    useState<SignatureProvider>('built-in')

  function saveSection(title: string) {
    toast.success(`${title} settings saved.`, { title })
  }

  return (
    <div className="flex flex-col gap-4">
      <ChangesBanner />

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <h3 className="text-sm font-bold text-[#2D2061]">
          Expiry, reminders & revisions
        </h3>

        <div className="mt-2">
          <LifecycleSettingRow
            label="Default offer validity (days)"
            description="Pre-fills the expiry date; each offer can change it. Offers lapse at the end of the expiry day in the company timezone. The background scheduler is off on this deployment: a lapsed offer can no longer be signed, but it is marked Expired (and the expiry notices go out) only when the offer list, the offer or the candidate's portal is next opened."
          >
            <LifecycleNumberInput
              id="lifecycle-validity-days"
              value={validityDays}
              onChange={setValidityDays}
              min={1}
              max={365}
              aria-label="Default offer validity in days"
            />
          </LifecycleSettingRow>

          <LifecycleSettingRow
            label="Allow Extend Expiry"
            description="Recruiters can move the expiry date of a sent offer without reissuing it."
          >
            <Switch
              checked={allowExtendExpiry}
              onCheckedChange={setAllowExtendExpiry}
              aria-label="Allow extend expiry"
              className="!gap-0"
            />
          </LifecycleSettingRow>

          <LifecycleSettingRow
            label="Maximum reminders per offer"
            description="Reminders are sent by hand from the offer (automatic reminders come with Workflows)."
          >
            <LifecycleNumberInput
              id="lifecycle-max-reminders"
              value={maxReminders}
              onChange={setMaxReminders}
              min={0}
              max={20}
              aria-label="Maximum reminders per offer"
            />
          </LifecycleSettingRow>

          <LifecycleSettingRow
            label="Maximum revisions per offer"
            description="After this many revisions, withdraw the offer and create a new one."
          >
            <LifecycleNumberInput
              id="lifecycle-max-revisions"
              value={maxRevisions}
              onChange={setMaxRevisions}
              min={0}
              max={20}
              aria-label="Maximum revisions per offer"
            />
          </LifecycleSettingRow>

          <LifecycleSettingRow
            label="“Sent but unopened” after (days)"
            description="Used by the Reports tab."
          >
            <LifecycleNumberInput
              id="lifecycle-unopened-days"
              value={unopenedAfterDays}
              onChange={setUnopenedAfterDays}
              min={1}
              max={90}
              aria-label="Sent but unopened after days"
            />
          </LifecycleSettingRow>

          <LifecycleSettingRow
            label="Signed offer retention (years)"
            description="Signed offers are kept for this long and are not removed by candidate deletion requests during that time."
          >
            <LifecycleNumberInput
              id="lifecycle-retention-years"
              value={retentionYears}
              onChange={setRetentionYears}
              min={1}
              max={50}
              aria-label="Signed offer retention in years"
            />
          </LifecycleSettingRow>
        </div>

        <SectionSaveFooter>
          <SectionSaveButton
            onClick={() => saveSection('Expiry, reminders & revisions')}
          />
        </SectionSaveFooter>
      </div>

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="min-w-0 max-w-2xl">
          <h3 className="text-sm font-bold text-[#2D2061]">
            Post-acceptance approvals
          </h3>
          <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
            When on, the action goes through the matching approval rule before
            it takes effect.
          </p>
        </div>

        <div className="mt-2">
          <LifecycleSettingRow
            label="Rescinding requires approval"
            description="Rescinding an accepted offer waits for the approval chain."
          >
            <Switch
              checked={rescindRequiresApproval}
              onCheckedChange={setRescindRequiresApproval}
              aria-label="Rescinding requires approval"
              className="!gap-0"
            />
          </LifecycleSettingRow>

          <LifecycleSettingRow
            label="Updating the joining date requires approval"
            description="The amended letter is issued only after approval."
          >
            <Switch
              checked={joiningDateRequiresApproval}
              onCheckedChange={setJoiningDateRequiresApproval}
              aria-label="Updating joining date requires approval"
              className="!gap-0"
            />
          </LifecycleSettingRow>
        </div>

        <SectionSaveFooter>
          <SectionSaveButton
            onClick={() => saveSection('Post-acceptance approvals')}
          />
        </SectionSaveFooter>
      </div>

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <h3 className="text-sm font-bold text-[#2D2061]">Candidate signing</h3>

        <div className="mt-2">
          <LifecycleSettingRow
            label="Signature method"
            description="Built-in signer only. Every method offers type-to-sign for accessibility where drawing is allowed."
          >
            <div className="w-44">
              <Select
                id="lifecycle-signature-method"
                options={SIGNATURE_METHOD_OPTIONS}
                value={signatureMethod}
                onChange={(event) =>
                  setSignatureMethod(event.target.value as SignatureMethod)
                }
                aria-label="Signature method"
                className="!h-10"
              />
            </div>
          </LifecycleSettingRow>

          <LifecycleSettingRow
            label="Verification code at signing"
            description="The candidate enters a 6-digit code e-mailed to them before signing."
          >
            <Switch
              checked={verificationCode}
              onCheckedChange={setVerificationCode}
              aria-label="Verification code at signing"
              className="!gap-0"
            />
          </LifecycleSettingRow>
        </div>

        <SectionSaveFooter>
          <SectionSaveButton
            onClick={() => saveSection('Candidate signing')}
          />
        </SectionSaveFooter>
      </div>

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <h3 className="text-sm font-bold text-[#2D2061]">
          Electronic signature provider
        </h3>
        <p className="mt-0.5 max-w-3xl text-xs leading-relaxed text-[#8B8B9E]">
          Without a provider, the built-in signer captures a drawn or typed
          signature with a full audit record. Configure your own DocuSign
          account for signatures backed by DocuSign&apos;s certificate of
          completion; candidates still sign inside your candidate portal.
        </p>

        <div
          className="mt-4 inline-flex rounded-[8px] border border-[#E4E1EE] bg-white p-1"
          role="radiogroup"
          aria-label="Electronic signature provider"
        >
          <button
            type="button"
            role="radio"
            aria-checked={signatureProvider === 'built-in'}
            onClick={() => setSignatureProvider('built-in')}
            className={cn(
              'rounded-[6px] px-4 py-2 text-sm font-semibold transition-colors',
              signatureProvider === 'built-in'
                ? 'bg-[#F0EFF5] text-[#2D2061]'
                : 'text-[#6B6B80] hover:text-[#2D2061]',
            )}
          >
            Built-in signer
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={signatureProvider === 'docusign'}
            onClick={() => setSignatureProvider('docusign')}
            className={cn(
              'rounded-[6px] px-4 py-2 text-sm font-semibold transition-colors',
              signatureProvider === 'docusign'
                ? 'bg-[#F0EFF5] text-[#2D2061]'
                : 'text-[#6B6B80] hover:text-[#2D2061]',
            )}
          >
            DocuSign
          </button>
        </div>

        {signatureProvider === 'docusign' ? (
          <p className="mt-3 text-xs leading-relaxed text-[#8B8B9E]">
            Connect DocuSign under integrations to activate certificate-backed
            signing. Until then, offers continue to use the built-in signer
            after save.
          </p>
        ) : null}

        <SectionSaveFooter>
          <SectionSaveButton
            onClick={() =>
              saveSection(
                signatureProvider === 'docusign'
                  ? 'DocuSign provider'
                  : 'Built-in signer',
              )
            }
          />
        </SectionSaveFooter>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Audit Log                                                                  */
/* -------------------------------------------------------------------------- */

type AuditLogEntry = {
  id: string
  when: string
  who: string
  change: string
}

const INITIAL_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 'audit-1',
    when: '16 Oct 2026, 11:36',
    who: 'Heli Shah',
    change: 'Approval framework updated',
  },
  {
    id: 'audit-2',
    when: '16 Oct 2026, 11:36',
    who: 'Heli Shah',
    change: 'Approval framework updated',
  },
  {
    id: 'audit-3',
    when: '16 Oct 2026, 11:21',
    who: 'ketan',
    change: 'Custom stage "Stage 02" added after Sent',
  },
  {
    id: 'audit-4',
    when: '16 Oct 2026, 11:21',
    who: 'ketan',
    change: 'Custom stage "Stage 01" added after Approved',
  },
  {
    id: 'audit-5',
    when: '15 Oct 2026, 17:28',
    who: 'Heli Shah',
    change: 'Approval framework updated',
  },
  {
    id: 'audit-6',
    when: '15 Oct 2026, 17:26',
    who: 'Heli Shah',
    change: 'Approval framework updated',
  },
  {
    id: 'audit-7',
    when: '14 Oct 2026, 12:25',
    who: 'Heli Shah',
    change: 'Heli Shah ended their approval delegation',
  },
  {
    id: 'audit-8',
    when: '14 Oct 2026, 12:25',
    who: 'Heli Shah',
    change:
      'Heli Shah delegated offer approvals to Ashik Patel from 2026-10-14 to 2026-10-21',
  },
  {
    id: 'audit-9',
    when: '10 Oct 2026, 20:41',
    who: 'Chiranjeev Parsoya',
    change: 'Status labels updated',
  },
]

function AuditLogTab() {
  const [query, setQuery] = useState('')
  const [entries] = useState(INITIAL_AUDIT_LOG)

  const filtered = entries.filter((entry) => {
    const needle = query.trim().toLowerCase()
    if (!needle) return true
    return (
      entry.when.toLowerCase().includes(needle) ||
      entry.who.toLowerCase().includes(needle) ||
      entry.change.toLowerCase().includes(needle)
    )
  })

  return (
    <div className="flex flex-col gap-4">
      <ChangesBanner />

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 max-w-2xl">
            <h3 className="text-sm font-bold text-[#2D2061]">
              Settings changes
            </h3>
            <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
              Every Offer Settings change, with who made it and when. The latest
              60 entries.
            </p>
          </div>
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search changes…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search audit log"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-[8px] border border-[#E4E1EE] bg-white">
          <DataTable minWidthClassName="min-w-[40rem]">
            <DataTableHead className="!border-[#C9C6D6]">
              <DataTableTh className={cn(TH, 'w-44 pl-4')}>When</DataTableTh>
              <DataTableTh className={cn(TH, 'w-44')}>Who</DataTableTh>
              <DataTableTh className={cn(TH, 'pr-4')}>Change</DataTableTh>
            </DataTableHead>
            <DataTableBody>
              {filtered.length === 0 ? (
                <DataTableEmpty colSpan={3}>
                  No matching settings changes.
                </DataTableEmpty>
              ) : (
                filtered.map((entry) => (
                  <DataTableRow
                    key={entry.id}
                    className="border-b border-[#EEEDF3]"
                  >
                    <DataTableTd className="!py-3.5 pl-4 text-sm text-[#6B6B80]">
                      {entry.when}
                    </DataTableTd>
                    <DataTableTd className="!py-3.5 text-sm font-medium text-[#2D2061]">
                      {entry.who}
                    </DataTableTd>
                    <DataTableTd className="!py-3.5 pr-4 !whitespace-normal text-sm text-[#2D2061]">
                      <button
                        type="button"
                        className="text-left hover:underline"
                        onClick={() =>
                          toast.success(entry.change, {
                            title: `${entry.who} · ${entry.when}`,
                          })
                        }
                      >
                        {entry.change}
                      </button>
                    </DataTableTd>
                  </DataTableRow>
                ))
              )}
            </DataTableBody>
          </DataTable>
        </div>

        <p className="mt-3 text-xs text-[#8B8B9E]">
          {`Showing ${filtered.length} of ${entries.length} ${
            entries.length === 1 ? 'entry' : 'entries'
          }${query.trim() ? ' matching your search' : ''}.`}
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Approval Rules                                                             */
/* -------------------------------------------------------------------------- */

type ApprovalRuleScope = 'all-offers' | 'conditions'

type ApprovalRule = {
  id: string
  name: string
  scope: ApprovalRuleScope
  conditionSummary: string
  approvers: string
  updatedAt: string
}

type ApprovalRuleFormValues = {
  name: string
  scope: ApprovalRuleScope
  conditionSummary: string
  approvers: string
}

const EMPTY_APPROVAL_RULE: ApprovalRuleFormValues = {
  name: '',
  scope: 'all-offers',
  conditionSummary: '',
  approvers: '',
}

function formatRuleDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function ApprovalRulesTab() {
  const [useApprovals, setUseApprovals] = useState(true)
  const [rules, setRules] = useState<ApprovalRule[]>([])
  const [editing, setEditing] = useState<ApprovalRule | 'new' | null>(null)
  const [pendingDelete, setPendingDelete] = useState<ApprovalRule | null>(null)

  function saveRule(values: ApprovalRuleFormValues) {
    const name = values.name.trim()
    const conditionSummary =
      values.scope === 'all-offers'
        ? 'All offers'
        : values.conditionSummary.trim() || 'Custom conditions'
    const approvers = values.approvers.trim() || 'No approvers set'

    if (editing === 'new') {
      const rule: ApprovalRule = {
        id: `rule-${Date.now()}`,
        name,
        scope: values.scope,
        conditionSummary,
        approvers,
        updatedAt: formatRuleDate(),
      }
      setRules((current) => [rule, ...current])
      toast.success(`“${name}” added.`, { title: 'Approval rule' })
    } else if (editing) {
      setRules((current) =>
        current.map((rule) =>
          rule.id === editing.id
            ? {
                ...rule,
                name,
                scope: values.scope,
                conditionSummary,
                approvers,
                updatedAt: formatRuleDate(),
              }
            : rule,
        ),
      )
      toast.success(`“${name}” updated.`, { title: 'Approval rule' })
    }
    setEditing(null)
  }

  function confirmDelete() {
    if (!pendingDelete) return
    setRules((current) =>
      current.filter((rule) => rule.id !== pendingDelete.id),
    )
    toast.success(`Removed “${pendingDelete.name}”.`, {
      title: 'Rule removed',
    })
    setPendingDelete(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <ChangesBanner />

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 max-w-3xl">
            <h3 className="text-sm font-bold text-[#2D2061]">Use approvals</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
              When off, or when no rule matches, submitting an offer approves it
              straight away and the main action becomes &apos;Send Offer&apos;.
            </p>
          </div>
          <Switch
            checked={useApprovals}
            onCheckedChange={setUseApprovals}
            aria-label="Use approvals"
            className="!gap-0"
          />
        </div>
      </div>

      <div
        className={cn(
          'rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6',
          !useApprovals && 'opacity-60',
        )}
      >
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 max-w-3xl">
            <h3 className="text-sm font-bold text-[#2D2061]">Approval rules</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
              The most specific matching rule applies (most satisfied
              conditions); ties go to the most recently updated. &apos;All
              offers&apos; is the fallback.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={!useApprovals}
            onClick={() => setEditing('new')}
            className="!h-9 !rounded-[8px] !border-[#2D2061] !px-3.5 !text-[#2D2061] hover:!bg-white disabled:!opacity-50"
          >
            <Plus className="size-4" strokeWidth={2.25} aria-hidden="true" />
            Add rule
          </Button>
        </div>

        <div className="overflow-hidden rounded-[8px] border border-[#E4E1EE] bg-white">
          {rules.length === 0 ? (
            <p className="px-4 py-8 text-sm text-[#8B8B9E]">
              No rules yet — every submitted offer is approved automatically.
            </p>
          ) : (
            <ul className="divide-y divide-[#EEEDF3]">
              {rules.map((rule) => (
                <li
                  key={rule.id}
                  className="flex flex-wrap items-start gap-3 px-4 py-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#2D2061]">
                      {rule.name}
                    </p>
                    <p className="mt-0.5 text-xs text-[#8B8B9E]">
                      {rule.conditionSummary} · Approvers: {rule.approvers}
                    </p>
                    <p className="mt-1 text-[11px] text-[#A0A0B2]">
                      Updated {rule.updatedAt}
                    </p>
                  </div>
                  <IconButton
                    label={`Edit ${rule.name}`}
                    onClick={() => setEditing(rule)}
                  >
                    <Pencil className="size-4" strokeWidth={1.75} />
                  </IconButton>
                  <IconButton
                    label={`Delete ${rule.name}`}
                    onClick={() => setPendingDelete(rule)}
                  >
                    <Trash2 className="size-4" strokeWidth={1.75} />
                  </IconButton>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ApprovalRuleFormPanel
        open={editing !== null}
        rule={editing === 'new' ? null : editing}
        onClose={() => setEditing(null)}
        onSave={saveRule}
      />

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title="Delete Rule"
        itemName={pendingDelete?.name}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

function ApprovalRuleFormPanel({
  open,
  rule,
  onClose,
  onSave,
}: {
  open: boolean
  rule: ApprovalRule | null
  onClose: () => void
  onSave: (values: ApprovalRuleFormValues) => void
}) {
  const [values, setValues] = useState<ApprovalRuleFormValues>(EMPTY_APPROVAL_RULE)
  const [nameError, setNameError] = useState('')
  const [lastOpenKey, setLastOpenKey] = useState<string | null>(null)

  const openKey = open ? (rule?.id ?? 'new') : null
  if (openKey !== lastOpenKey) {
    setLastOpenKey(openKey)
    if (openKey) {
      setValues(
        rule
          ? {
              name: rule.name,
              scope: rule.scope,
              conditionSummary:
                rule.scope === 'all-offers' ? '' : rule.conditionSummary,
              approvers: rule.approvers === 'No approvers set' ? '' : rule.approvers,
            }
          : EMPTY_APPROVAL_RULE,
      )
      setNameError('')
    }
  }

  function handleSave() {
    if (!values.name.trim()) {
      setNameError('Rule name is required.')
      return
    }
    onSave(values)
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={rule ? 'Edit Rule' : 'Add Rule'}
      widthClassName="w-full max-w-[30rem]"
      footerClassName="justify-end gap-3 border-t border-[#ECEAF3]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="!h-10 !rounded-[8px] !border-[#2D2061] !px-5 !text-[#2D2061] hover:!bg-[#F7F6FA]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="!h-10 !rounded-[8px] !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            {rule ? 'Save' : 'Add rule'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <Input
          label="Rule name"
          requiredMark
          placeholder="e.g. Senior roles over 100k"
          value={values.name}
          onChange={(event) => {
            setValues((current) => ({ ...current, name: event.target.value }))
            if (nameError) setNameError('')
          }}
          error={nameError || undefined}
        />

        <div>
          <p className="mb-2 text-xs font-medium text-[#2D2061]">Applies to</p>
          <div
            className="flex flex-col gap-2"
            role="radiogroup"
            aria-label="Applies to"
          >
            <RadioOption
              name="approval-rule-scope"
              checked={values.scope === 'all-offers'}
              onChange={() =>
                setValues((current) => ({ ...current, scope: 'all-offers' }))
              }
              label="All offers (fallback)"
            />
            <RadioOption
              name="approval-rule-scope"
              checked={values.scope === 'conditions'}
              onChange={() =>
                setValues((current) => ({ ...current, scope: 'conditions' }))
              }
              label="Offers matching conditions"
            />
          </div>
        </div>

        {values.scope === 'conditions' ? (
          <Input
            label="Conditions summary"
            placeholder="e.g. Base salary ≥ 100,000 and level ≥ L5"
            value={values.conditionSummary}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                conditionSummary: event.target.value,
              }))
            }
          />
        ) : null}

        <Input
          label="Approvers"
          placeholder="e.g. Hiring manager, Finance"
          value={values.approvers}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              approvers: event.target.value,
            }))
          }
        />
      </div>
    </SidePanel>
  )
}

/* -------------------------------------------------------------------------- */
/* Reasons                                                                    */
/* -------------------------------------------------------------------------- */

type OfferReason = {
  id: string
  label: string
  enabled: boolean
  needsComment: boolean
  /** Fixed "Other" row — always on, not deletable */
  fixed?: boolean
}

const INITIAL_DECLINE_REASONS: OfferReason[] = [
  {
    id: 'decline-1',
    label: 'Accepted another offer',
    enabled: true,
    needsComment: false,
  },
  {
    id: 'decline-2',
    label: 'Compensation',
    enabled: true,
    needsComment: false,
  },
  {
    id: 'decline-3',
    label: 'Location or commute',
    enabled: true,
    needsComment: false,
  },
  {
    id: 'decline-4',
    label: 'Role or responsibilities',
    enabled: true,
    needsComment: false,
  },
  {
    id: 'decline-5',
    label: 'Notice period or start date',
    enabled: true,
    needsComment: false,
  },
  {
    id: 'decline-6',
    label: 'Personal reasons',
    enabled: true,
    needsComment: false,
  },
  {
    id: 'decline-other',
    label: 'Other',
    enabled: true,
    needsComment: true,
    fixed: true,
  },
]

const INITIAL_WITHDRAW_REASONS: OfferReason[] = [
  {
    id: 'withdraw-1',
    label: 'Position closed or cancelled',
    enabled: true,
    needsComment: false,
  },
  {
    id: 'withdraw-2',
    label: 'Budget change',
    enabled: true,
    needsComment: false,
  },
  {
    id: 'withdraw-3',
    label: 'Background or reference check failed',
    enabled: true,
    needsComment: true,
  },
  {
    id: 'withdraw-4',
    label: 'Offer issued in error',
    enabled: true,
    needsComment: true,
  },
  {
    id: 'withdraw-5',
    label: 'Candidate unresponsive',
    enabled: true,
    needsComment: false,
  },
  {
    id: 'withdraw-other',
    label: 'Other',
    enabled: true,
    needsComment: true,
    fixed: true,
  },
]

const INITIAL_JOINING_REASONS: OfferReason[] = [
  {
    id: 'joining-1',
    label: 'Candidate request',
    enabled: true,
    needsComment: false,
  },
  {
    id: 'joining-2',
    label: 'Visa or relocation delay',
    enabled: true,
    needsComment: false,
  },
  {
    id: 'joining-3',
    label: 'Business need',
    enabled: true,
    needsComment: false,
  },
  {
    id: 'joining-other',
    label: 'Other',
    enabled: true,
    needsComment: true,
    fixed: true,
  },
]

function ReasonsTab() {
  const [declineReasons, setDeclineReasons] = useState(INITIAL_DECLINE_REASONS)
  const [withdrawReasons, setWithdrawReasons] = useState(
    INITIAL_WITHDRAW_REASONS,
  )
  const [joiningReasons, setJoiningReasons] = useState(INITIAL_JOINING_REASONS)
  const [pendingDelete, setPendingDelete] = useState<{
    group: 'decline' | 'withdraw' | 'joining'
    reason: OfferReason
  } | null>(null)

  function handleSave() {
    const groups = [declineReasons, withdrawReasons, joiningReasons]
    for (const group of groups) {
      const blank = group.find((reason) => !reason.label.trim())
      if (blank) {
        toast.error('Every reason needs a name.', { title: 'Reasons' })
        return
      }
    }
    toast.success('Offer reasons saved.', { title: 'Reasons' })
  }

  function confirmDelete() {
    if (!pendingDelete) return
    const { group, reason } = pendingDelete
    if (group === 'decline') {
      setDeclineReasons((current) =>
        current.filter((item) => item.id !== reason.id),
      )
    } else if (group === 'withdraw') {
      setWithdrawReasons((current) =>
        current.filter((item) => item.id !== reason.id),
      )
    } else {
      setJoiningReasons((current) =>
        current.filter((item) => item.id !== reason.id),
      )
    }
    toast.success(`Removed “${reason.label}”.`, { title: 'Reason removed' })
    setPendingDelete(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <ChangesBanner />

      <ReasonGroupSection
        title="Decline reasons"
        description="Shown to the candidate when they decline (required, with optional free text)."
        reasons={declineReasons}
        onChange={setDeclineReasons}
        onDelete={(reason) => setPendingDelete({ group: 'decline', reason })}
        addIdPrefix="decline"
      />

      <ReasonGroupSection
        title="Withdraw / rescind reasons"
        description="Required when a recruiter withdraws or rescinds an offer."
        reasons={withdrawReasons}
        onChange={setWithdrawReasons}
        onDelete={(reason) => setPendingDelete({ group: 'withdraw', reason })}
        addIdPrefix="withdraw"
      />

      <ReasonGroupSection
        title="Joining-date change reasons"
        description="Required when the start date of an accepted offer changes."
        reasons={joiningReasons}
        onChange={setJoiningReasons}
        onDelete={(reason) => setPendingDelete({ group: 'joining', reason })}
        addIdPrefix="joining"
      />

      <SectionSaveFooter>
        <SectionSaveButton onClick={handleSave} className="!h-10 !px-5">
          Save reasons
        </SectionSaveButton>
      </SectionSaveFooter>

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title="Delete Reason"
        itemName={pendingDelete?.reason.label}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

function ReasonGroupSection({
  title,
  description,
  reasons,
  onChange,
  onDelete,
  addIdPrefix,
}: {
  title: string
  description: string
  reasons: OfferReason[]
  onChange: (reasons: OfferReason[]) => void
  onDelete: (reason: OfferReason) => void
  addIdPrefix: string
}) {
  const [newReason, setNewReason] = useState('')

  function patchReason(id: string, patch: Partial<OfferReason>) {
    onChange(
      reasons.map((reason) =>
        reason.id === id && !reason.fixed ? { ...reason, ...patch } : reason,
      ),
    )
  }

  function handleAdd() {
    const label = newReason.trim()
    if (!label) {
      toast.error('Enter a reason name.', { title: title })
      return
    }
    if (
      reasons.some((reason) => reason.label.toLowerCase() === label.toLowerCase())
    ) {
      toast.error('A reason with that name already exists.', { title })
      return
    }

    const fixed = reasons.find((reason) => reason.fixed)
    const withoutFixed = reasons.filter((reason) => !reason.fixed)
    const reason: OfferReason = {
      id: `${addIdPrefix}-${Date.now()}`,
      label,
      enabled: true,
      needsComment: false,
    }
    onChange([...withoutFixed, reason, ...(fixed ? [fixed] : [])])
    setNewReason('')
    toast.success(`“${label}” added.`, { title: 'Reason added' })
  }

  return (
    <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-[#2D2061]">{title}</h3>
        <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
          {description}
        </p>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={newReason}
          onChange={(event) => setNewReason(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              handleAdd()
            }
          }}
          placeholder="New reason"
          aria-label={`New ${title}`}
          className={cn(INPUT, 'min-w-0 flex-1')}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleAdd}
          className="!h-9 !rounded-[8px] !border-[#2D2061] !px-3.5 !text-[#2D2061] hover:!bg-[#F7F6FA]"
        >
          <Plus className="size-4" strokeWidth={2.25} aria-hidden="true" />
          Add
        </Button>
      </div>

      <div className="overflow-hidden rounded-[8px] border border-[#E4E1EE] bg-white">
        <DataTable minWidthClassName="min-w-[40rem]">
          <DataTableHead className="!border-[#C9C6D6]">
            <DataTableTh className={cn(TH, 'pl-4')}>Reason</DataTableTh>
            <DataTableTh className={cn(TH, 'w-24 text-center')}>On</DataTableTh>
            <DataTableTh className={cn(TH, 'w-40')}>Needs a comment</DataTableTh>
            <DataTableTh className={cn(TH, 'w-24 pr-4 text-right')}>
              <span className="sr-only">Actions</span>
            </DataTableTh>
          </DataTableHead>
          <DataTableBody>
            {reasons.map((reason) => (
              <DataTableRow
                key={reason.id}
                className="border-b border-dashed border-[#EEEDF3]"
              >
                <DataTableTd className="!py-3 pl-4 !whitespace-normal">
                  {reason.fixed ? (
                    <span className="text-sm font-semibold text-[#2D2061]">
                      {reason.label}
                    </span>
                  ) : (
                    <input
                      type="text"
                      value={reason.label}
                      onChange={(event) =>
                        patchReason(reason.id, { label: event.target.value })
                      }
                      aria-label={`${title} reason name`}
                      className={cn(INPUT, 'max-w-md')}
                    />
                  )}
                </DataTableTd>
                <DataTableTd className="!py-3 text-center">
                  <div className="inline-flex justify-center">
                    <Switch
                      checked={reason.enabled}
                      disabled={reason.fixed}
                      onCheckedChange={(enabled) =>
                        patchReason(reason.id, { enabled })
                      }
                      aria-label={`${reason.label} on`}
                      className="!gap-0"
                    />
                  </div>
                </DataTableTd>
                <DataTableTd className="!py-3">
                  <Checkbox
                    id={`${reason.id}-comment`}
                    checked={reason.needsComment}
                    disabled={reason.fixed}
                    onChange={(event) =>
                      patchReason(reason.id, {
                        needsComment: event.target.checked,
                      })
                    }
                    label={
                      <span className="sr-only">
                        {reason.label} needs a comment
                      </span>
                    }
                    className={cn(reason.fixed && 'opacity-60')}
                  />
                </DataTableTd>
                <DataTableTd className="!py-3 pr-4 text-right">
                  {reason.fixed ? (
                    <span className="text-xs font-medium text-[#8B8B9E]">
                      Always on
                    </span>
                  ) : (
                    <IconButton
                      label={`Delete ${reason.label}`}
                      onClick={() => onDelete(reason)}
                    >
                      <Trash2 className="size-4" strokeWidth={1.75} />
                    </IconButton>
                  )}
                </DataTableTd>
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Pipeline Sync                                                              */
/* -------------------------------------------------------------------------- */

type MoveTarget =
  | 'none'
  | 'offer-unchanged'
  | 'hired'
  | 'declined'
  | 'previous-before-offer'

type SyncRule = {
  id: string
  code: string
  description: string
  badge: BadgeColor
  kind: 'system' | 'custom'
  moveOn: boolean
  moveTo: MoveTarget
}

const MOVE_TARGET_OPTIONS: Array<{ value: MoveTarget; label: string }> = [
  { value: 'offer-unchanged', label: 'Offer - status unchanged' },
  { value: 'hired', label: 'Hired (closed)' },
  { value: 'declined', label: 'Declined (closed)' },
  { value: 'previous-before-offer', label: 'Previous stage (before Offer)' },
]

const PIPELINE_STAGE_OPTIONS = [
  { value: 'pre-screening', label: 'Pre-Screening - any status' },
  { value: 'screening', label: 'Screening - any status' },
  { value: 'assessment', label: 'Assessment - any status' },
  { value: 'interview', label: 'Interview - any status' },
  { value: 'offer', label: 'Offer - any status' },
  { value: 'hired', label: 'Hired - any status' },
  { value: 'rejected', label: 'Rejected - any status' },
  { value: 'declined', label: 'Declined - any status' },
]

const INITIAL_SYNC_RULES: SyncRule[] = [
  {
    id: 'draft',
    code: 'DRAFT',
    description: 'Offer created and saved.',
    badge: 'blue',
    kind: 'system',
    moveOn: true,
    moveTo: 'offer-unchanged',
  },
  {
    id: 'pending-approval',
    code: 'PENDING APPROVAL',
    description: 'Waiting for approvers.',
    badge: 'amber',
    kind: 'system',
    moveOn: false,
    moveTo: 'none',
  },
  {
    id: 'approval-rejected',
    code: 'APPROVAL REJECTED',
    description: 'An approver rejected it.',
    badge: 'red',
    kind: 'system',
    moveOn: false,
    moveTo: 'none',
  },
  {
    id: 'approved',
    code: 'APPROVED',
    description: 'All approvals given.',
    badge: 'blue',
    kind: 'system',
    moveOn: false,
    moveTo: 'none',
  },
  {
    id: 'sent',
    code: 'SENT',
    description: 'Offer issued to the candidate.',
    badge: 'purple',
    kind: 'system',
    moveOn: false,
    moveTo: 'none',
  },
  {
    id: 'change-requested',
    code: 'CHANGE REQUESTED',
    description: 'Candidate asked for changes.',
    badge: 'amber',
    kind: 'system',
    moveOn: false,
    moveTo: 'none',
  },
  {
    id: 'accepted',
    code: 'ACCEPTED',
    description: 'Candidate signed the offer.',
    badge: 'green',
    kind: 'system',
    moveOn: true,
    moveTo: 'hired',
  },
  {
    id: 'declined',
    code: 'DECLINED',
    description: 'Candidate declined.',
    badge: 'red',
    kind: 'system',
    moveOn: true,
    moveTo: 'declined',
  },
  {
    id: 'withdrawn',
    code: 'WITHDRAWN',
    description: 'You withdrew or rescinded it.',
    badge: 'amber',
    kind: 'system',
    moveOn: true,
    moveTo: 'previous-before-offer',
  },
  {
    id: 'expired',
    code: 'EXPIRED',
    description: 'No response before the deadline.',
    badge: 'grey',
    kind: 'system',
    moveOn: true,
    moveTo: 'previous-before-offer',
  },
  {
    id: 'stage-01',
    code: 'STAGE 01',
    description: 'Custom stage after Approved.',
    badge: 'blue',
    kind: 'custom',
    moveOn: false,
    moveTo: 'none',
  },
  {
    id: 'stage-02',
    code: 'STAGE 02',
    description: 'Custom stage after Sent.',
    badge: 'amber',
    kind: 'custom',
    moveOn: false,
    moveTo: 'none',
  },
]

function cloneSyncRules(rules: SyncRule[]): SyncRule[] {
  return rules.map((rule) => ({ ...rule }))
}

function PipelineSyncTab() {
  const [rules, setRules] = useState(() => cloneSyncRules(INITIAL_SYNC_RULES))
  const [savedRules, setSavedRules] = useState(() =>
    cloneSyncRules(INITIAL_SYNC_RULES),
  )
  const [neverMoveBackwards, setNeverMoveBackwards] = useState(true)
  const [leaveClosedAlone, setLeaveClosedAlone] = useState(true)
  const [savedNeverMoveBackwards, setSavedNeverMoveBackwards] = useState(true)
  const [savedLeaveClosedAlone, setSavedLeaveClosedAlone] = useState(true)
  const [allowedStages, setAllowedStages] = useState(
    PIPELINE_STAGE_OPTIONS.map((option) => option.value),
  )
  const [savedAllowedStages, setSavedAllowedStages] = useState(
    PIPELINE_STAGE_OPTIONS.map((option) => option.value),
  )
  const [stageToAdd, setStageToAdd] = useState('')
  const [checkWhen, setCheckWhen] = useState<'sending' | 'creating'>('sending')
  const [savedCheckWhen, setSavedCheckWhen] = useState<'sending' | 'creating'>(
    'sending',
  )
  const [anyoneElse, setAnyoneElse] = useState<'block' | 'allow-reason'>('block')
  const [savedAnyoneElse, setSavedAnyoneElse] = useState<'block' | 'allow-reason'>(
    'block',
  )

  const movingCount = rules.filter((rule) => rule.moveOn).length
  const systemRules = rules.filter((rule) => rule.kind === 'system')
  const customRules = rules.filter((rule) => rule.kind === 'custom')
  const availableToAdd = PIPELINE_STAGE_OPTIONS.filter(
    (option) => !allowedStages.includes(option.value),
  )

  const checks = buildPipelineChecks(rules, allowedStages)

  function patchRule(id: string, patch: Partial<SyncRule>) {
    setRules((current) =>
      current.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)),
    )
  }

  function handleToggleMove(id: string, moveOn: boolean) {
    setRules((current) =>
      current.map((rule) => {
        if (rule.id !== id) return rule
        if (!moveOn) return { ...rule, moveOn: false, moveTo: 'none' }
        const fallback: MoveTarget =
          rule.moveTo !== 'none'
            ? rule.moveTo
            : rule.id === 'draft'
              ? 'offer-unchanged'
              : rule.id === 'accepted'
                ? 'hired'
                : rule.id === 'declined'
                  ? 'declined'
                  : 'previous-before-offer'
        return { ...rule, moveOn: true, moveTo: fallback }
      }),
    )
  }

  function handleDiscard() {
    setRules(cloneSyncRules(savedRules))
    setNeverMoveBackwards(savedNeverMoveBackwards)
    setLeaveClosedAlone(savedLeaveClosedAlone)
    setAllowedStages([...savedAllowedStages])
    setCheckWhen(savedCheckWhen)
    setAnyoneElse(savedAnyoneElse)
    setStageToAdd('')
    toast.success('Unsaved pipeline sync changes discarded.', {
      title: 'Pipeline Sync',
    })
  }

  function handleSave() {
    if (checks.length > 0) {
      toast.error('Fix Checks before saving.', { title: 'Pipeline Sync' })
      return
    }
    setSavedRules(cloneSyncRules(rules))
    setSavedNeverMoveBackwards(neverMoveBackwards)
    setSavedLeaveClosedAlone(leaveClosedAlone)
    setSavedAllowedStages([...allowedStages])
    setSavedCheckWhen(checkWhen)
    setSavedAnyoneElse(anyoneElse)
    toast.success('Pipeline sync rules saved.', { title: 'Pipeline Sync' })
  }

  function removeAllowedStage(id: string) {
    setAllowedStages((current) => current.filter((item) => item !== id))
  }

  function addAllowedStage() {
    if (!stageToAdd) {
      toast.error('Choose a stage to add.', { title: 'Pipeline Sync' })
      return
    }
    setAllowedStages((current) =>
      current.includes(stageToAdd) ? current : [...current, stageToAdd],
    )
    setStageToAdd('')
  }

  return (
    <div className="flex flex-col gap-4">
      <ChangesBanner />

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <p className="max-w-2xl text-sm leading-relaxed text-[#6B6B80]">
            Move the candidate in the job pipeline when an offer changes status,
            and choose which candidates can receive an offer.
          </p>
          <span className="inline-flex items-center rounded-full bg-[#E6F6EC] px-2.5 py-1 text-[11px] font-semibold text-[#15803D]">
            Built-in rules
          </span>
        </div>

        <ul className="mb-5 space-y-2 text-xs leading-relaxed text-[#2F5AA8]">
          <li className="flex items-start gap-2">
            <CircleHelp
              className="mt-0.5 size-3.5 shrink-0"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span>
              These are the rules that apply today. They change only when you
              save this page.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CircleHelp
              className="mt-0.5 size-3.5 shrink-0"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span>
              Stages and statuses come from your pipeline workflow in{' '}
              <span className="font-semibold">Settings → Pipeline</span>. If a
              stage used here is removed there, the rule is flagged under
              Checks.
            </span>
          </li>
        </ul>

        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <h3 className="text-sm font-bold text-[#2D2061]">Move the candidate</h3>
          <p className="text-xs font-medium text-[#8B8B9E]">
            {movingCount} of {rules.length} statuses move the candidate.
          </p>
        </div>

        <div
          role="note"
          className="mb-4 flex flex-wrap items-start gap-2 rounded-[8px] border border-[#F5E6B8] bg-[#FFFBEB] px-3.5 py-3 text-xs leading-relaxed text-[#92400E]"
        >
          <Zap className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
          <p className="min-w-0 flex-1">
            When a rule is <span className="font-semibold">On</span>, the
            candidate moves automatically as soon as the status changes.{' '}
            <span className="font-semibold">Off</span> means no pipeline change.{' '}
            <button
              type="button"
              className="font-semibold underline underline-offset-2"
              onClick={() =>
                toast.success(
                  'Recruiters see automatic moves in the candidate Journey when an offer status changes.',
                  { title: 'What recruiters see' },
                )
              }
            >
              See what recruiters see
            </button>
            .
          </p>
        </div>

        <div className="overflow-hidden rounded-[8px] border border-[#E4E1EE] bg-white">
          <DataTable minWidthClassName="min-w-[48rem]">
            <DataTableHead className="!border-[#C9C6D6]">
              <DataTableTh className={cn(TH, 'pl-4')}>
                When offer status becomes
              </DataTableTh>
              <DataTableTh className={cn(TH, 'w-40 text-center')}>
                Move automatically
              </DataTableTh>
              <DataTableTh className={cn(TH, 'pr-4')}>
                Move candidate to
              </DataTableTh>
            </DataTableHead>
            <DataTableBody>
              {systemRules.map((rule) => (
                <SyncRuleRow
                  key={rule.id}
                  rule={rule}
                  onToggle={(moveOn) => handleToggleMove(rule.id, moveOn)}
                  onMoveTo={(moveTo) => patchRule(rule.id, { moveTo })}
                />
              ))}
            </DataTableBody>
          </DataTable>

          <div className="border-t border-[#EEEDF3] bg-[#F7F7FA] px-4 py-2.5">
            <p className="text-[11px] font-bold tracking-[0.06em] text-[#6B6B80] uppercase">
              Custom stages
            </p>
          </div>
          <DataTable minWidthClassName="min-w-[48rem]">
            <DataTableBody>
              {customRules.map((rule) => (
                <SyncRuleRow
                  key={rule.id}
                  rule={rule}
                  onToggle={(moveOn) => handleToggleMove(rule.id, moveOn)}
                  onMoveTo={(moveTo) => patchRule(rule.id, { moveTo })}
                />
              ))}
            </DataTableBody>
          </DataTable>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <Checkbox
            id="never-move-backwards"
            checked={neverMoveBackwards}
            onChange={(event) => setNeverMoveBackwards(event.target.checked)}
            label={
              <span>
                <span className="font-semibold text-[#2D2061]">
                  Never move a candidate backwards
                </span>
                <span className="mt-0.5 block text-xs font-normal text-[#8B8B9E]">
                  Skips a move to an earlier stage. Rules set to Previous stage
                  still apply.
                </span>
              </span>
            }
          />
          <Checkbox
            id="leave-closed-alone"
            checked={leaveClosedAlone}
            onChange={(event) => setLeaveClosedAlone(event.target.checked)}
            label={
              <span>
                <span className="font-semibold text-[#2D2061]">
                  Leave closed candidates alone
                </span>
                <span className="mt-0.5 block text-xs font-normal text-[#8B8B9E]">
                  Candidates in a closed stage (Hired, Rejected, Declined) are
                  not moved.
                </span>
              </span>
            }
          />
        </div>

        <SectionSaveFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleDiscard}
            className="!h-9 !rounded-[8px] !border-[#D5D2E2] !px-3.5 !text-[#2D2061] hover:!bg-white"
          >
            Discard
          </Button>
          <SectionSaveButton onClick={handleSave} />
        </SectionSaveFooter>
      </div>

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <h3 className="text-sm font-bold text-[#2D2061]">
          Who can receive an offer
        </h3>

        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-[#2D2061]">
            Allowed stages
          </p>
          <div className="flex flex-wrap gap-2">
            {allowedStages.map((stageId) => {
              const option = PIPELINE_STAGE_OPTIONS.find(
                (item) => item.value === stageId,
              )
              if (!option) return null
              return (
                <span
                  key={stageId}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E1EE] bg-white px-2.5 py-1 text-xs font-medium text-[#2D2061]"
                >
                  {option.label}
                  <button
                    type="button"
                    aria-label={`Remove ${option.label}`}
                    onClick={() => removeAllowedStage(stageId)}
                    className="text-[#8B8B9E] hover:text-[#2D2061]"
                  >
                    <X className="size-3" strokeWidth={2.5} />
                  </button>
                </span>
              )
            })}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="min-w-[14rem] flex-1 sm:max-w-xs">
              <Select
                id="add-allowed-stage"
                label=""
                options={[
                  { value: '', label: 'Add a stage and status...' },
                  ...availableToAdd,
                ]}
                value={stageToAdd}
                onChange={(event) => setStageToAdd(event.target.value)}
                aria-label="Add a stage and status"
                disabled={availableToAdd.length === 0}
              />
            </div>
            <Button
              type="button"
              onClick={addAllowedStage}
              disabled={availableToAdd.length === 0}
              className="!h-10 !rounded-[8px] !bg-[#2D2061] !px-4 text-sm font-semibold text-white hover:!bg-[#241a52] disabled:!opacity-50"
            >
              Add
            </Button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#2D2061]">
              Check when
            </p>
            <div
              className="flex flex-col gap-2"
              role="radiogroup"
              aria-label="Check when"
            >
              <RadioOption
                name="check-when"
                checked={checkWhen === 'sending'}
                onChange={() => setCheckWhen('sending')}
                label="Sending the offer"
              />
              <RadioOption
                name="check-when"
                checked={checkWhen === 'creating'}
                onChange={() => setCheckWhen('creating')}
                label="Creating the offer"
              />
            </div>
            <p className="mt-1.5 text-xs text-[#8B8B9E]">
              Drafts and approvals can start early; sending waits until the
              candidate qualifies.
            </p>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-[#2D2061]">
              Anyone else
            </p>
            <div
              className="flex flex-col gap-2"
              role="radiogroup"
              aria-label="Anyone else"
            >
              <RadioOption
                name="anyone-else"
                checked={anyoneElse === 'block'}
                onChange={() => setAnyoneElse('block')}
                label="Block"
              />
              <RadioOption
                name="anyone-else"
                checked={anyoneElse === 'allow-reason'}
                onChange={() => setAnyoneElse('allow-reason')}
                label="Allow with a reason"
              />
            </div>
            <p className="mt-1.5 text-xs text-[#8B8B9E]">
              {anyoneElse === 'block'
                ? 'The button is disabled and says which stages qualify.'
                : 'Recruiters can continue after entering a reason.'}
            </p>
          </div>
        </div>

        <SectionSaveFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleDiscard}
            className="!h-9 !rounded-[8px] !border-[#D5D2E2] !px-3.5 !text-[#2D2061] hover:!bg-white"
          >
            Discard
          </Button>
          <SectionSaveButton onClick={handleSave} />
        </SectionSaveFooter>
      </div>

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-[#2D2061]">Checks</h3>
          <span
            className={cn(
              'inline-flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-bold',
              checks.length === 0
                ? 'bg-[#E6F6EC] text-[#15803D]'
                : 'bg-[#FEE2E2] text-[#B91C1C]',
            )}
          >
            {checks.length}
          </span>
        </div>
        {checks.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-[#15803D]">
            <Check className="size-4" strokeWidth={2.5} aria-hidden="true" />
            No problems found with these rules.
          </div>
        ) : (
          <ul className="space-y-1.5 text-sm text-[#B91C1C]">
            {checks.map((check) => (
              <li key={check}>{check}</li>
            ))}
          </ul>
        )}

        <ul className="mt-5 space-y-1.5 text-xs leading-relaxed text-[#8B8B9E]">
          <li>
            Saving applies to new offer events only. Candidates already in the
            pipeline stay where they are.
          </li>
          <li>
            Every move is recorded in the candidate&apos;s Journey as an
            automatic move by the offer.
          </li>
          <li>
            If a candidate has more than one offer for the same job, the most
            recent offer drives the pipeline.
          </li>
        </ul>

        <SectionSaveFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleDiscard}
            className="!h-9 !rounded-[8px] !border-[#D5D2E2] !px-3.5 !text-[#2D2061] hover:!bg-white"
          >
            Discard
          </Button>
          <SectionSaveButton onClick={handleSave} />
        </SectionSaveFooter>
      </div>
    </div>
  )
}

function SyncRuleRow({
  rule,
  onToggle,
  onMoveTo,
}: {
  rule: SyncRule
  onToggle: (moveOn: boolean) => void
  onMoveTo: (moveTo: MoveTarget) => void
}) {
  return (
    <DataTableRow className="border-b border-[#EEEDF3]">
      <DataTableTd className="!py-3.5 pl-4 !whitespace-normal">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              'mt-0.5 inline-flex shrink-0 rounded-md px-2 py-1 text-[10px] font-bold tracking-[0.04em] uppercase',
              BADGE_TAG_CLASS[rule.badge],
            )}
          >
            {rule.code}
          </span>
          <p className="text-sm text-[#6B6B80]">{rule.description}</p>
        </div>
      </DataTableTd>
      <DataTableTd className="!py-3.5 text-center">
        <div className="inline-flex justify-center">
          <Switch
            checked={rule.moveOn}
            onCheckedChange={onToggle}
            aria-label={`Move automatically for ${rule.code}`}
            className="!gap-0"
          />
        </div>
      </DataTableTd>
      <DataTableTd className="!py-3.5 pr-4">
        {rule.moveOn ? (
          <div className="w-full max-w-xs">
            <Select
              id={`move-to-${rule.id}`}
              label=""
              options={MOVE_TARGET_OPTIONS}
              value={rule.moveTo === 'none' ? 'offer-unchanged' : rule.moveTo}
              onChange={(event) =>
                onMoveTo(event.target.value as MoveTarget)
              }
              aria-label={`Move candidate to for ${rule.code}`}
              className="!h-9 !rounded-[8px]"
            />
          </div>
        ) : (
          <span className="text-sm text-[#8B8B9E]">No pipeline change</span>
        )}
      </DataTableTd>
    </DataTableRow>
  )
}

function RadioOption({
  name,
  checked,
  onChange,
  label,
}: {
  name: string
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-[#2D2061]">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={cn(
          'flex size-4 shrink-0 items-center justify-center rounded-full border',
          checked
            ? 'border-[#2D2061] bg-[#2D2061]'
            : 'border-[#C8C5D6] bg-white',
        )}
        aria-hidden="true"
      >
        {checked ? <span className="size-1.5 rounded-full bg-white" /> : null}
      </span>
      {label}
    </label>
  )
}

function buildPipelineChecks(
  rules: SyncRule[],
  allowedStages: string[],
): string[] {
  const checks: string[] = []
  if (allowedStages.length === 0) {
    checks.push('Add at least one allowed stage for who can receive an offer.')
  }
  const onWithoutTarget = rules.filter(
    (rule) => rule.moveOn && (rule.moveTo === 'none' || !rule.moveTo),
  )
  if (onWithoutTarget.length > 0) {
    checks.push(
      `${onWithoutTarget.map((rule) => rule.code).join(', ')} need a pipeline destination.`,
    )
  }
  return checks
}

function StatusesStagesTab() {
  const [statuses, setStatuses] = useState(INITIAL_STATUSES)
  const [stages, setStages] = useState(INITIAL_STAGES)
  const [editingStage, setEditingStage] = useState<CustomStage | 'new' | null>(
    null,
  )
  const [pendingDelete, setPendingDelete] = useState<CustomStage | null>(null)

  const afterApproved = stages.filter((s) => s.placement === 'after-approved')
  const afterSent = stages.filter((s) => s.placement === 'after-sent')

  function patchStatus(id: string, patch: Partial<SystemStatus>) {
    setStatuses((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    )
  }

  function handleSaveStatuses() {
    toast.success('System statuses saved.', { title: 'Offer Settings' })
  }

  function saveStage(values: StageFormValues) {
    if (editingStage === 'new') {
      const nextIndex = stages.length + 1
      const stage: CustomStage = {
        id: `stage-${Date.now()}`,
        code: `STAGE ${String(nextIndex).padStart(2, '0')}`,
        name: values.name.trim(),
        candidateLabel: values.candidateLabel.trim() || values.name.trim(),
        placement: values.placement,
        pipelineNote: values.pipelineNote.trim() || 'Pipeline: no change',
        offerCount: 0,
      }
      setStages((current) => [...current, stage])
      toast.success(`“${stage.name}” added.`, { title: 'Stage added' })
    } else if (editingStage) {
      setStages((current) =>
        current.map((stage) =>
          stage.id === editingStage.id
            ? {
                ...stage,
                name: values.name.trim(),
                candidateLabel:
                  values.candidateLabel.trim() || values.name.trim(),
                placement: values.placement,
                pipelineNote:
                  values.pipelineNote.trim() || 'Pipeline: no change',
              }
            : stage,
        ),
      )
      toast.success(`“${values.name.trim()}” updated.`, {
        title: 'Stage updated',
      })
    }
    setEditingStage(null)
  }

  function confirmDelete() {
    if (!pendingDelete) return
    setStages((current) =>
      current.filter((stage) => stage.id !== pendingDelete.id),
    )
    toast.success(`Removed “${pendingDelete.name}”.`, {
      title: 'Stage removed',
    })
    setPendingDelete(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <ChangesBanner />

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="mb-4 min-w-0">
          <h3 className="text-sm font-bold text-[#2D2061]">System statuses</h3>
          <p className="mt-0.5 max-w-2xl text-xs leading-relaxed text-[#8B8B9E]">
            Rename statuses and choose the label candidates see. Statuses
            can&apos;t be deleted or reordered.
          </p>
        </div>

        <div className="overflow-hidden rounded-[8px] border border-[#E4E1EE] bg-white">
          <DataTable minWidthClassName="min-w-[52rem]">
            <DataTableHead className="!border-[#C9C6D6]">
              <DataTableTh className={cn(TH, 'pl-4')}>Status</DataTableTh>
              <DataTableTh className={TH}>Internal label</DataTableTh>
              <DataTableTh className={TH}>
                <span className="inline-flex items-center gap-1.5">
                  Candidate sees
                  <InfoTip content="What candidates see for this status in their portal. Use “Not visible to candidates” when the status is internal only." />
                </span>
              </DataTableTh>
              <DataTableTh className={cn(TH, 'w-36')}>Badge</DataTableTh>
              <DataTableTh className={cn(TH, 'w-12 pr-4')}>
                <span className="sr-only">Locked</span>
              </DataTableTh>
            </DataTableHead>
            <DataTableBody>
              {statuses.map((status) => (
                <DataTableRow
                  key={status.id}
                  className="border-b border-[#EEEDF3]"
                >
                  <DataTableTd className="!py-3 pl-4">
                    <span
                      className={cn(
                        'inline-flex rounded-md px-2 py-1 text-[10px] font-bold tracking-[0.04em] uppercase',
                        BADGE_TAG_CLASS[status.badge],
                      )}
                    >
                      {status.code}
                    </span>
                  </DataTableTd>
                  <DataTableTd className="!py-3">
                    <input
                      type="text"
                      value={status.internalLabel}
                      onChange={(event) =>
                        patchStatus(status.id, {
                          internalLabel: event.target.value,
                        })
                      }
                      aria-label={`${status.code} internal label`}
                      className={cn(INPUT, 'max-w-xs')}
                    />
                  </DataTableTd>
                  <DataTableTd className="!py-3">
                    <input
                      type="text"
                      value={status.candidateSees}
                      onChange={(event) =>
                        patchStatus(status.id, {
                          candidateSees: event.target.value,
                        })
                      }
                      aria-label={`${status.code} candidate label`}
                      className={cn(INPUT, 'max-w-sm')}
                    />
                  </DataTableTd>
                  <DataTableTd className="!py-3">
                    <Select
                      id={`badge-${status.id}`}
                      label=""
                      options={BADGE_OPTIONS}
                      value={status.badge}
                      onChange={(event) =>
                        patchStatus(status.id, {
                          badge: event.target.value as BadgeColor,
                        })
                      }
                      aria-label={`${status.code} badge colour`}
                      className="!h-9 !rounded-[8px]"
                    />
                  </DataTableTd>
                  <DataTableTd className="!py-3 pr-4 text-right">
                    <span
                      className="inline-flex text-[#C8C5D6]"
                      title="System status — cannot be deleted"
                    >
                      <Lock className="size-3.5" strokeWidth={2} aria-hidden="true" />
                      <span className="sr-only">Locked</span>
                    </span>
                  </DataTableTd>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTable>
        </div>

        <SectionSaveFooter>
          <SectionSaveButton onClick={handleSaveStatuses} />
        </SectionSaveFooter>
      </div>

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[#2D2061]">Custom stages</h3>
            <p className="mt-0.5 max-w-3xl text-xs leading-relaxed text-[#8B8B9E]">
              Optional stages between Approved and Sent, or between Sent and the
              candidate&apos;s response. Entered and left by hand only; hidden
              from candidates unless you give them a label.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setEditingStage('new')}
            className="!h-9 !rounded-[8px] !border-[#2D2061] !px-3.5 !text-[#2D2061] hover:!bg-white"
          >
            <Plus className="size-4" strokeWidth={2.25} aria-hidden="true" />
            Add stage
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <StageGroup
            title="After Approved"
            stages={afterApproved}
            emptyLabel="No stages between Approved and Sent."
            onEdit={setEditingStage}
            onDelete={setPendingDelete}
          />
          <StageGroup
            title="After Sent"
            stages={afterSent}
            emptyLabel="No stages between Sent and the candidate response."
            onEdit={setEditingStage}
            onDelete={setPendingDelete}
          />
        </div>
      </div>

      <StageFormPanel
        open={editingStage !== null}
        stage={editingStage === 'new' ? null : editingStage}
        onClose={() => setEditingStage(null)}
        onSave={saveStage}
      />

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title="Delete Stage"
        itemName={pendingDelete?.name}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

function StageGroup({
  title,
  stages,
  emptyLabel,
  onEdit,
  onDelete,
}: {
  title: string
  stages: CustomStage[]
  emptyLabel: string
  onEdit: (stage: CustomStage) => void
  onDelete: (stage: CustomStage) => void
}) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-[#E4E1EE] bg-white">
      <div className="border-b border-[#EEEDF3] bg-[#F7F7FA] px-4 py-2.5">
        <p className="text-[11px] font-bold tracking-[0.06em] text-[#6B6B80] uppercase">
          {title}
        </p>
      </div>
      {stages.length === 0 ? (
        <p className="px-4 py-5 text-sm text-[#8B8B9E]">{emptyLabel}</p>
      ) : (
        <ul className="divide-y divide-[#EEEDF3]">
          {stages.map((stage) => (
            <li
              key={stage.id}
              className="flex flex-wrap items-center gap-3 px-4 py-3.5"
            >
              <span
                className={cn(
                  'inline-flex rounded-md px-2 py-1 text-[10px] font-bold tracking-[0.04em] uppercase',
                  stage.placement === 'after-approved'
                    ? BADGE_TAG_CLASS.blue
                    : BADGE_TAG_CLASS.amber,
                )}
              >
                {stage.code}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#2D2061]">
                  {stage.name}
                </p>
                <p className="mt-0.5 text-xs text-[#8B8B9E]">
                  Candidate sees &apos;{stage.candidateLabel}&apos; ·{' '}
                  {stage.offerCount} offers
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D2061] hover:underline"
                onClick={() =>
                  toast.success('Pipeline mapping opens with Pipeline Sync.', {
                    title: stage.pipelineNote,
                  })
                }
              >
                {stage.pipelineNote}
                <ArrowUpRight className="size-3.5" strokeWidth={2} />
              </button>
              <IconButton
                label={`Edit ${stage.name}`}
                onClick={() => onEdit(stage)}
              >
                <Pencil className="size-4" strokeWidth={1.75} />
              </IconButton>
              <IconButton
                label={`Delete ${stage.name}`}
                onClick={() => onDelete(stage)}
              >
                <Trash2 className="size-4" strokeWidth={1.75} />
              </IconButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

type StageFormValues = {
  name: string
  candidateLabel: string
  placement: StagePlacement
  pipelineNote: string
}

const EMPTY_STAGE: StageFormValues = {
  name: '',
  candidateLabel: '',
  placement: 'after-approved',
  pipelineNote: 'Pipeline: no change',
}

function StageFormPanel({
  open,
  stage,
  onClose,
  onSave,
}: {
  open: boolean
  stage: CustomStage | null
  onClose: () => void
  onSave: (values: StageFormValues) => void
}) {
  const [values, setValues] = useState<StageFormValues>(EMPTY_STAGE)
  const [nameError, setNameError] = useState('')
  const [lastOpenKey, setLastOpenKey] = useState<string | null>(null)

  const openKey = open ? (stage?.id ?? 'new') : null
  if (openKey !== lastOpenKey) {
    setLastOpenKey(openKey)
    if (openKey) {
      setValues(
        stage
          ? {
              name: stage.name,
              candidateLabel: stage.candidateLabel,
              placement: stage.placement,
              pipelineNote: stage.pipelineNote,
            }
          : EMPTY_STAGE,
      )
      setNameError('')
    }
  }

  function handleSave() {
    if (!values.name.trim()) {
      setNameError('Stage name is required.')
      return
    }
    onSave(values)
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={stage ? 'Edit Stage' : 'Add Stage'}
      widthClassName="w-full max-w-[30rem]"
      footerClassName="justify-end gap-3 border-t border-[#ECEAF3]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="!h-10 !rounded-[8px] !border-[#2D2061] !px-5 !text-[#2D2061] hover:!bg-[#F7F6FA]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="!h-10 !rounded-[8px] !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            {stage ? 'Save' : 'Add stage'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <Input
          label="Stage name"
          requiredMark
          placeholder="e.g. Compensation review"
          value={values.name}
          onChange={(event) => {
            setValues((current) => ({ ...current, name: event.target.value }))
            if (nameError) setNameError('')
          }}
          error={nameError || undefined}
        />
        <Input
          label="Candidate sees"
          placeholder="Leave blank to hide from candidates"
          value={values.candidateLabel}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              candidateLabel: event.target.value,
            }))
          }
        />
        <Select
          id="stage-placement"
          label="Placement"
          options={[
            { value: 'after-approved', label: 'After Approved' },
            { value: 'after-sent', label: 'After Sent' },
          ]}
          value={values.placement}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              placement: event.target.value as StagePlacement,
            }))
          }
        />
        <Input
          label="Pipeline note"
          placeholder="Pipeline: no change"
          value={values.pipelineNote}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              pipelineNote: event.target.value,
            }))
          }
        />
      </div>
    </SidePanel>
  )
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex size-8 items-center justify-center rounded-[8px] text-[#6B6B80] transition-colors hover:bg-[#F5F4FA] hover:text-[#2D2061]"
    >
      {children}
    </button>
  )
}
