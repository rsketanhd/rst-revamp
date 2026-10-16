import { useState, type ReactNode } from 'react'
import {
  ArrowDown,
  ArrowUp,
  CircleHelp,
  Plus,
  Trash2,
} from 'lucide-react'
import {
  Button,
  Checkbox,
  ConfirmDeleteModal,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableTd,
  DataTableTh,
  Select,
  Switch,
  toast,
  Tooltip,
} from '../ui'
import { cn } from '../../lib/cn'
import { SettingsBlock, SettingsPanel } from './SettingsPanel'
import { SettingsUnderlineTabs } from './SettingsUnderlineTabs'

/* -------------------------------------------------------------------------- */
/* Data                                                                       */
/* -------------------------------------------------------------------------- */

type DocumentsTab = 'documents' | 'categories' | 'rejection-reasons'

const DOCUMENT_TABS: Array<{ value: DocumentsTab; label: string }> = [
  { value: 'documents', label: 'Documents' },
  { value: 'categories', label: 'Document Categories' },
  { value: 'rejection-reasons', label: 'Rejection Reasons' },
]

const FILE_TYPE_OPTIONS = [
  'PDF',
  'DOC',
  'DOCX',
  'JPG',
  'PNG',
  'TXT',
  'RTF',
  'XLS',
  'XLSX',
] as const

const DEFAULT_FILE_TYPES: string[] = ['PDF', 'DOC', 'DOCX', 'JPG', 'PNG']

const OFFER_DESTINATION_OPTIONS = [
  { value: 'others', label: 'Others' },
  { value: 'onboarding', label: 'Onboarding & Offer Documents' },
  { value: 'identity', label: 'Identity Proof' },
  { value: 'education', label: 'Education Credentials' },
]

type CategoryKind = 'default' | 'custom' | 'fixed'

type RejectionReason = {
  id: string
  name: string
  kind: CategoryKind
  commentRequired: boolean
  active: boolean
  timesUsed: number
}

const INITIAL_REASONS: RejectionReason[] = [
  {
    id: 'unclear',
    name: 'Unclear / Illegible',
    kind: 'default',
    commentRequired: false,
    active: true,
    timesUsed: 0,
  },
  {
    id: 'wrong-type',
    name: 'Wrong Document Type',
    kind: 'default',
    commentRequired: false,
    active: true,
    timesUsed: 0,
  },
  {
    id: 'expired',
    name: 'Expired Document',
    kind: 'default',
    commentRequired: false,
    active: true,
    timesUsed: 0,
  },
  {
    id: 'incomplete',
    name: 'Incomplete / Missing Pages',
    kind: 'default',
    commentRequired: false,
    active: true,
    timesUsed: 0,
  },
  {
    id: 'mismatch',
    name: 'Name / Details Mismatch',
    kind: 'default',
    commentRequired: false,
    active: true,
    timesUsed: 0,
  },
  {
    id: 'wrong-category',
    name: 'Wrong Category',
    kind: 'default',
    commentRequired: false,
    active: true,
    timesUsed: 0,
  },
  {
    id: 'other',
    name: 'Other',
    kind: 'fixed',
    commentRequired: true,
    active: true,
    timesUsed: 0,
  },
]

type DocumentCategory = {
  id: string
  name: string
  kind: CategoryKind
  active: boolean
  documentCount: number
  lastUpdated: string
}

const INITIAL_CATEGORIES: DocumentCategory[] = [
  {
    id: 'identity',
    name: 'Identity Documents',
    kind: 'default',
    active: true,
    documentCount: 1,
    lastUpdated: 'Oct 10, 2026',
  },
  {
    id: 'right-to-represent',
    name: 'Right to Represent',
    kind: 'default',
    active: true,
    documentCount: 1,
    lastUpdated: 'Oct 10, 2026',
  },
  {
    id: 'educational',
    name: 'Educational Records',
    kind: 'default',
    active: true,
    documentCount: 0,
    lastUpdated: 'Oct 10, 2026',
  },
  {
    id: 'employment',
    name: 'Employment History',
    kind: 'default',
    active: true,
    documentCount: 0,
    lastUpdated: 'Oct 10, 2026',
  },
  {
    id: 'achievements',
    name: 'Achievements',
    kind: 'default',
    active: true,
    documentCount: 0,
    lastUpdated: 'Oct 10, 2026',
  },
  {
    id: 'certifications',
    name: 'Certifications',
    kind: 'default',
    active: true,
    documentCount: 0,
    lastUpdated: 'Oct 10, 2026',
  },
  {
    id: 'others',
    name: 'Others',
    kind: 'fixed',
    active: true,
    documentCount: 0,
    lastUpdated: 'Oct 10, 2026',
  },
]

const TH =
  'bg-[#F7F7FA] !pt-3 !pb-3 !text-[10px] !font-bold uppercase tracking-[0.04em] !text-[#1A1A2E]'

/* -------------------------------------------------------------------------- */
/* Panel                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Settings → Module Configuration → Candidates → Documents.
 */
export function DocumentsSettingsPanel() {
  const [tab, setTab] = useState<DocumentsTab>('documents')

  return (
    <SettingsPanel
      eyebrow="Candidates"
      title="Documents"
      description="Configure verification, candidate uploads, categories, and rejection reasons."
    >
      <SettingsUnderlineTabs
        aria-label="Documents settings sections"
        value={tab}
        onChange={setTab}
        options={DOCUMENT_TABS}
      />

      {tab === 'documents' ? <DocumentsTab /> : null}
      {tab === 'categories' ? <CategoryMatrixSection /> : null}
      {tab === 'rejection-reasons' ? <RejectionReasonsSection /> : null}
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

function SettingRow({
  label,
  tip,
  children,
}: {
  label: string
  tip?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-dashed border-[#E4E1EE] py-3.5 last:border-b-0 last:pb-0 first:pt-0">
      <div className="flex min-w-0 items-center gap-1.5">
        <p className="text-sm font-semibold text-[#2D2061]">{label}</p>
        {tip ? <InfoTip content={tip} /> : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2 sm:max-w-md">
        {children}
      </div>
    </div>
  )
}

function DocumentsTab() {
  const [verificationOn, setVerificationOn] = useState(true)
  const [rejectVerifiedOn, setRejectVerifiedOn] = useState(true)
  const [recruitersToo, setRecruitersToo] = useState(false)
  const [myDocumentsUpload, setMyDocumentsUpload] = useState(true)
  const [fileTypes, setFileTypes] = useState(DEFAULT_FILE_TYPES)
  const [maxFileSize, setMaxFileSize] = useState('10')
  const [maxDocuments, setMaxDocuments] = useState('20')
  const [offerDestination, setOfferDestination] = useState('others')

  function toggleFileType(ext: string) {
    setFileTypes((current) => {
      if (current.includes(ext)) {
        if (current.length === 1) {
          toast.error('Keep at least one allowed file type.', {
            title: 'Allowed file types',
          })
          return current
        }
        return current.filter((item) => item !== ext)
      }
      return [...current, ext]
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="mb-3.5 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-[#2D2061]">
                Document verification
              </h3>
              <InfoTip content="When on, recruiters review each upload before it is treated as verified." />
            </div>
            <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
              Should recruiters verify documents candidates upload?
            </p>
          </div>
          <Switch
            checked={verificationOn}
            onCheckedChange={setVerificationOn}
            aria-label="Document verification"
            className="!gap-0"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <VerificationModeCard
            title="On — review every upload"
            selected={verificationOn}
            onSelect={() => setVerificationOn(true)}
            points={[
              'Uploads start as In Review',
              'Recruiters Mark Verified or Reject with a reason',
              'Candidates see the status and re-upload rejected files',
              'Vault shows compliance badge and status tiles',
            ]}
          />
          <VerificationModeCard
            title="Off — just collect"
            selected={!verificationOn}
            onSelect={() => setVerificationOn(false)}
            points={[
              'Uploads are submitted straight away',
              'No statuses, badges or review buttons anywhere',
              'Vault shows only the number submitted',
              "Rejection reasons aren't used",
            ]}
          />
        </div>
      </div>

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="mb-3.5 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-[#2D2061]">
                Rejecting a verified document
              </h3>
              <InfoTip content="Lets a verified document be moved back to rejected when needed." />
            </div>
            <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
              Allow a document to be rejected after it was verified.
            </p>
          </div>
          <Switch
            checked={rejectVerifiedOn}
            onCheckedChange={setRejectVerifiedOn}
            aria-label="Rejecting a verified document"
            className="!gap-0"
          />
        </div>

        <div
          className={cn(
            'rounded-[8px] border border-[#E4E1EE] bg-white px-4 py-3.5',
            !rejectVerifiedOn && 'pointer-events-none opacity-50',
          )}
          aria-disabled={!rejectVerifiedOn}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-[#2D2061]">Who can do it</p>
              <InfoTip content="Super Users can always reject a verified document. Turn on Recruiters too to allow recruiters as well." />
            </div>
            <Checkbox
              id="recruiters-too"
              checked={recruitersToo}
              disabled={!rejectVerifiedOn}
              onChange={(event) => setRecruitersToo(event.target.checked)}
              label="Recruiters too"
            />
          </div>
        </div>
      </div>

      <SettingsBlock title="Candidate uploads">
        <SettingRow
          label="Candidates can upload from My Documents"
          tip="Lets candidates add files from their My Documents area on the candidate portal."
        >
          <Switch
            checked={myDocumentsUpload}
            onCheckedChange={setMyDocumentsUpload}
            aria-label="Candidates can upload from My Documents"
            className="!gap-0"
          />
        </SettingRow>

        <div className="border-b border-dashed border-[#E4E1EE] py-3.5">
          <p className="mb-3 text-sm font-semibold text-[#2D2061]">
            Allowed file types
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {FILE_TYPE_OPTIONS.map((ext) => (
              <Checkbox
                key={ext}
                id={`file-type-${ext}`}
                checked={fileTypes.includes(ext)}
                onChange={() => toggleFileType(ext)}
                label={ext}
              />
            ))}
          </div>
        </div>

        <SettingRow label="Maximum file size">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={maxFileSize}
              onChange={(event) => setMaxFileSize(event.target.value)}
              aria-label="Maximum file size in MB"
              className="h-10 w-20 rounded-lg border border-[#D5D2E2] bg-white px-3 text-center text-sm text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
            />
            <span className="text-sm text-[#8B8B9E]">MB</span>
          </div>
        </SettingRow>

        <SettingRow
          label="Maximum documents per candidate"
          tip="Total documents a candidate may keep across all categories."
        >
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={maxDocuments}
              onChange={(event) => setMaxDocuments(event.target.value)}
              aria-label="Maximum documents per candidate"
              className="h-10 w-20 rounded-lg border border-[#D5D2E2] bg-white px-3 text-center text-sm text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
            />
            <span className="text-sm text-[#8B8B9E]">documents</span>
          </div>
        </SettingRow>

        <SettingRow
          label="Offer documents go to"
          tip="Default category for documents attached to an offer."
        >
          <div className="w-full max-w-xs">
            <Select
              id="offer-documents-destination"
              label=""
              options={OFFER_DESTINATION_OPTIONS}
              value={offerDestination}
              onChange={(event) => setOfferDestination(event.target.value)}
              aria-label="Offer documents go to"
            />
          </div>
        </SettingRow>
      </SettingsBlock>
    </div>
  )
}

function VerificationModeCard({
  title,
  selected,
  onSelect,
  points,
}: {
  title: string
  selected: boolean
  onSelect: () => void
  points: string[]
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'rounded-[8px] border bg-white px-4 py-3.5 text-left transition-colors',
        selected
          ? 'border-[#2D2061]'
          : 'border-[#E4E1EE] hover:border-[#2D2061]/40',
      )}
    >
      <p className="text-sm font-semibold text-[#2D2061]">{title}</p>
      <ul className="mt-2.5 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-[#6B6B80]">
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* Rejection Reasons                                                          */
/* -------------------------------------------------------------------------- */

function RejectionReasonsSection() {
  const [reasons, setReasons] = useState(INITIAL_REASONS)
  const [newName, setNewName] = useState('')
  const [newCommentRequired, setNewCommentRequired] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<RejectionReason | null>(
    null,
  )

  function renameReason(id: string, name: string) {
    setReasons((current) =>
      current.map((item) => (item.id === id ? { ...item, name } : item)),
    )
  }

  function setCommentRequired(id: string, commentRequired: boolean) {
    setReasons((current) =>
      current.map((item) =>
        item.id === id && item.kind !== 'fixed'
          ? { ...item, commentRequired }
          : item,
      ),
    )
  }

  function setActive(id: string, active: boolean) {
    setReasons((current) =>
      current.map((item) =>
        item.id === id && item.kind !== 'fixed' ? { ...item, active } : item,
      ),
    )
  }

  function handleAddReason() {
    const name = newName.trim()
    if (!name) {
      toast.error('Enter a rejection reason.', { title: 'Rejection reasons' })
      return
    }
    if (reasons.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
      toast.error('A reason with that name already exists.', {
        title: 'Rejection reasons',
      })
      return
    }

    const fixed = reasons.find((item) => item.kind === 'fixed')
    const withoutFixed = reasons.filter((item) => item.kind !== 'fixed')
    const reason: RejectionReason = {
      id: `custom-${Date.now()}`,
      name,
      kind: 'custom',
      commentRequired: newCommentRequired,
      active: true,
      timesUsed: 0,
    }
    setReasons([...withoutFixed, reason, ...(fixed ? [fixed] : [])])
    setNewName('')
    setNewCommentRequired(false)
    toast.success(`“${name}” added.`, { title: 'Reason added' })
  }

  function confirmDelete() {
    if (!pendingDelete || pendingDelete.kind !== 'custom') return
    setReasons((current) =>
      current.filter((item) => item.id !== pendingDelete.id),
    )
    toast.success(`Removed “${pendingDelete.name}”.`, {
      title: 'Reason removed',
    })
    setPendingDelete(null)
  }

  return (
    <div className="flex flex-col gap-4">
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
          Rejection reasons are visible to candidates in their My Documents
          view. Use clear, professional, candidate-friendly wording.
        </p>
      </div>

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="mb-4">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-[#2D2061]">
              Rejection reasons
            </h3>
            <InfoTip content="Reasons shown when a recruiter rejects a candidate document." />
          </div>
          <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
            Default reasons can be renamed and turned off, but not deleted.
          </p>
        </div>

        <div className="overflow-hidden rounded-[8px] border border-[#E4E1EE] bg-white">
          <DataTable minWidthClassName="min-w-[56rem]">
            <DataTableHead className="!border-[#C9C6D6]">
              <DataTableTh className={cn(TH, 'pl-4')}>Reason</DataTableTh>
              <DataTableTh className={cn(TH, 'w-28')}>Type</DataTableTh>
              <DataTableTh className={cn(TH, 'w-44')}>
                Comment required
              </DataTableTh>
              <DataTableTh className={cn(TH, 'w-28')}>Active</DataTableTh>
              <DataTableTh className={cn(TH, 'w-28 text-center')}>
                Times used
              </DataTableTh>
              <DataTableTh className={cn(TH, 'w-16 pr-4 text-right')}>
                <span className="sr-only">Actions</span>
              </DataTableTh>
            </DataTableHead>
            <DataTableBody>
              {reasons.map((reason) => {
                const isFixed = reason.kind === 'fixed'
                const canDelete = reason.kind === 'custom'

                return (
                  <DataTableRow
                    key={reason.id}
                    className="border-b border-[#EEEDF3]"
                  >
                    <DataTableTd className="!py-3 pl-4 !whitespace-normal">
                      {isFixed ? (
                        <span className="text-sm font-bold text-[#1A1A2E]">
                          {reason.name}
                        </span>
                      ) : (
                        <input
                          type="text"
                          value={reason.name}
                          onChange={(event) =>
                            renameReason(reason.id, event.target.value)
                          }
                          aria-label={`${reason.name} reason name`}
                          className="h-9 w-full max-w-sm rounded-lg border border-[#D5D2E2] bg-white px-3 text-sm text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
                        />
                      )}
                    </DataTableTd>
                    <DataTableTd className="!py-3">
                      {reason.kind === 'default' ? (
                        <span className="inline-flex rounded-full bg-[#E8E4F8] px-2.5 py-1 text-[11px] font-semibold text-[#4C3A8A]">
                          Default
                        </span>
                      ) : null}
                      {reason.kind === 'custom' ? (
                        <span className="inline-flex rounded-full bg-[#EAF1FE] px-2.5 py-1 text-[11px] font-semibold text-[#2F5AA8]">
                          Custom
                        </span>
                      ) : null}
                      {reason.kind === 'fixed' ? (
                        <span className="inline-flex rounded-full bg-[#2D2061] px-2.5 py-1 text-[11px] font-semibold text-white">
                          Fixed
                        </span>
                      ) : null}
                    </DataTableTd>
                    <DataTableTd className="!py-3">
                      <Checkbox
                        id={`reason-comment-${reason.id}`}
                        checked={reason.commentRequired}
                        disabled={isFixed}
                        onChange={(event) =>
                          setCommentRequired(reason.id, event.target.checked)
                        }
                        label={
                          isFixed || reason.commentRequired
                            ? 'Required'
                            : 'Optional'
                        }
                        className={cn(isFixed && 'opacity-70')}
                      />
                    </DataTableTd>
                    <DataTableTd className="!py-3">
                      {isFixed ? (
                        <span className="text-sm font-medium text-[#6B6B80]">
                          Always
                        </span>
                      ) : (
                        <Switch
                          checked={reason.active}
                          onCheckedChange={(active) =>
                            setActive(reason.id, active)
                          }
                          aria-label={`${reason.name} active`}
                          className="!gap-0"
                        />
                      )}
                    </DataTableTd>
                    <DataTableTd className="!py-3 text-center text-sm text-[#2D2061]">
                      {reason.timesUsed}
                    </DataTableTd>
                    <DataTableTd className="!py-3 pr-4 text-right">
                      <IconButton
                        label={
                          canDelete
                            ? `Delete ${reason.name}`
                            : `${reason.name} cannot be deleted`
                        }
                        disabled={!canDelete}
                        onClick={() => setPendingDelete(reason)}
                      >
                        <Trash2 className="size-4" strokeWidth={1.75} />
                      </IconButton>
                    </DataTableTd>
                  </DataTableRow>
                )
              })}
            </DataTableBody>
          </DataTable>

          <div className="flex flex-wrap items-center gap-3 border-t border-[#EEEDF3] bg-white px-4 py-3.5">
            <input
              type="text"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  handleAddReason()
                }
              }}
              placeholder="New reason, e.g. Document not translated"
              aria-label="New rejection reason"
              className="h-10 min-w-0 flex-1 rounded-lg border border-[#D5D2E2] bg-white px-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
            />
            <Checkbox
              id="new-reason-comment-required"
              checked={newCommentRequired}
              onChange={(event) => setNewCommentRequired(event.target.checked)}
              label="Comment required"
              className="shrink-0"
            />
            <Button
              type="button"
              onClick={handleAddReason}
              className="!h-10 !rounded-md !bg-[#2D2061] !px-4 text-sm font-semibold text-white hover:!bg-[#241a52]"
            >
              <Plus className="size-4" strokeWidth={2.25} aria-hidden="true" />
              Add reason
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title="Delete Reason"
        itemName={pendingDelete?.name}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Document Categories                                                        */
/* -------------------------------------------------------------------------- */

function formatCategoryDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function CategoryMatrixSection() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES)
  const [newName, setNewName] = useState('')
  const [pendingDelete, setPendingDelete] = useState<DocumentCategory | null>(
    null,
  )

  const defaultCount = categories.filter((c) => c.kind === 'default').length
  const customCount = categories.filter((c) => c.kind === 'custom').length
  const movable = categories.filter((c) => c.kind !== 'fixed')

  function moveCategory(id: string, direction: -1 | 1) {
    setCategories((current) => {
      const movableIds = current
        .filter((item) => item.kind !== 'fixed')
        .map((item) => item.id)
      const index = movableIds.indexOf(id)
      if (index < 0) return current
      const nextIndex = index + direction
      if (nextIndex < 0 || nextIndex >= movableIds.length) return current

      const next = [...current]
      const fromIndex = next.findIndex((item) => item.id === id)
      const toId = movableIds[nextIndex]
      const toIndex = next.findIndex((item) => item.id === toId)
      if (fromIndex < 0 || toIndex < 0) return current
      const [item] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, item)
      return next
    })
  }

  function renameCategory(id: string, name: string) {
    setCategories((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, name, lastUpdated: formatCategoryDate() }
          : item,
      ),
    )
  }

  function setActive(id: string, active: boolean) {
    setCategories((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, active, lastUpdated: formatCategoryDate() }
          : item,
      ),
    )
  }

  function handleAddCategory() {
    const name = newName.trim()
    if (!name) {
      toast.error('Enter a category name.', { title: 'Document categories' })
      return
    }
    if (categories.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
      toast.error('A category with that name already exists.', {
        title: 'Document categories',
      })
      return
    }

    const fixed = categories.find((item) => item.kind === 'fixed')
    const withoutFixed = categories.filter((item) => item.kind !== 'fixed')
    const category: DocumentCategory = {
      id: `custom-${Date.now()}`,
      name,
      kind: 'custom',
      active: true,
      documentCount: 0,
      lastUpdated: formatCategoryDate(),
    }
    setCategories([
      ...withoutFixed,
      category,
      ...(fixed ? [fixed] : []),
    ])
    setNewName('')
    toast.success(`“${name}” added.`, { title: 'Category added' })
  }

  function confirmDelete() {
    if (!pendingDelete || pendingDelete.kind !== 'custom') return
    setCategories((current) =>
      current.filter((item) => item.id !== pendingDelete.id),
    )
    toast.success(`Removed “${pendingDelete.name}”.`, {
      title: 'Category removed',
    })
    setPendingDelete(null)
  }

  return (
    <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
      <div className="mb-4">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-bold text-[#2D2061]">Document categories</h3>
          <InfoTip content="Categories appear as upload targets and filters for candidate documents." />
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
          {defaultCount} default, {customCount} custom. Default categories can
          be renamed and turned off, but not deleted.
        </p>
      </div>

      <div className="overflow-hidden rounded-[8px] border border-[#E4E1EE] bg-white">
        <DataTable minWidthClassName="min-w-[56rem]">
          <DataTableHead className="!border-[#C9C6D6]">
            <DataTableTh className={cn(TH, 'w-20 pl-4')}>Order</DataTableTh>
            <DataTableTh className={TH}>Category name</DataTableTh>
            <DataTableTh className={cn(TH, 'w-28')}>Type</DataTableTh>
            <DataTableTh className={cn(TH, 'w-28')}>Active</DataTableTh>
            <DataTableTh className={cn(TH, 'w-28 text-center')}>
              Documents
            </DataTableTh>
            <DataTableTh className={cn(TH, 'w-36')}>Last updated</DataTableTh>
            <DataTableTh className={cn(TH, 'w-16 pr-4 text-right')}>
              <span className="sr-only">Actions</span>
            </DataTableTh>
          </DataTableHead>
          <DataTableBody>
            {categories.map((category) => {
              const isFixed = category.kind === 'fixed'
              const canDelete = category.kind === 'custom'
              const movableIndex = movable.findIndex(
                (item) => item.id === category.id,
              )

              return (
                <DataTableRow
                  key={category.id}
                  className="border-b border-[#EEEDF3]"
                >
                  <DataTableTd className="!py-3 pl-4">
                    {isFixed ? (
                      <div className="flex items-center gap-0.5 text-[#D5D2E2]">
                        <ArrowUp className="size-3.5" strokeWidth={2.25} />
                        <ArrowDown className="size-3.5" strokeWidth={2.25} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-0.5">
                        <OrderButton
                          label={`Move ${category.name} up`}
                          disabled={movableIndex <= 0}
                          onClick={() => moveCategory(category.id, -1)}
                        >
                          <ArrowUp className="size-3.5" strokeWidth={2.25} />
                        </OrderButton>
                        <OrderButton
                          label={`Move ${category.name} down`}
                          disabled={movableIndex >= movable.length - 1}
                          onClick={() => moveCategory(category.id, 1)}
                        >
                          <ArrowDown className="size-3.5" strokeWidth={2.25} />
                        </OrderButton>
                      </div>
                    )}
                  </DataTableTd>
                  <DataTableTd className="!py-3 !whitespace-normal">
                    {isFixed ? (
                      <span className="text-sm font-bold text-[#1A1A2E]">
                        {category.name}
                      </span>
                    ) : (
                      <input
                        type="text"
                        value={category.name}
                        onChange={(event) =>
                          renameCategory(category.id, event.target.value)
                        }
                        aria-label={`${category.name} category name`}
                        className="h-9 w-full max-w-xs rounded-lg border border-[#D5D2E2] bg-white px-3 text-sm text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
                      />
                    )}
                  </DataTableTd>
                  <DataTableTd className="!py-3">
                    {category.kind === 'default' ? (
                      <span className="inline-flex rounded-full bg-[#E8E4F8] px-2.5 py-1 text-[11px] font-semibold text-[#4C3A8A]">
                        Default
                      </span>
                    ) : null}
                    {category.kind === 'custom' ? (
                      <span className="inline-flex rounded-full bg-[#EAF1FE] px-2.5 py-1 text-[11px] font-semibold text-[#2F5AA8]">
                        Custom
                      </span>
                    ) : null}
                    {category.kind === 'fixed' ? (
                      <span className="inline-flex rounded-full bg-[#2D2061] px-2.5 py-1 text-[11px] font-semibold text-white">
                        Fixed
                      </span>
                    ) : null}
                  </DataTableTd>
                  <DataTableTd className="!py-3">
                    {isFixed ? (
                      <span className="text-sm font-medium text-[#6B6B80]">
                        Always
                      </span>
                    ) : (
                      <Switch
                        checked={category.active}
                        onCheckedChange={(active) =>
                          setActive(category.id, active)
                        }
                        aria-label={`${category.name} active`}
                        className="!gap-0"
                      />
                    )}
                  </DataTableTd>
                  <DataTableTd className="!py-3 text-center text-sm text-[#2D2061]">
                    {category.documentCount}
                  </DataTableTd>
                  <DataTableTd className="!py-3 text-sm text-[#6B6B80]">
                    {category.lastUpdated}
                  </DataTableTd>
                  <DataTableTd className="!py-3 pr-4 text-right">
                    <IconButton
                      label={
                        canDelete
                          ? `Delete ${category.name}`
                          : `${category.name} cannot be deleted`
                      }
                      disabled={!canDelete}
                      onClick={() => setPendingDelete(category)}
                    >
                      <Trash2 className="size-4" strokeWidth={1.75} />
                    </IconButton>
                  </DataTableTd>
                </DataTableRow>
              )
            })}
          </DataTableBody>
        </DataTable>

        <div className="flex flex-wrap items-center gap-3 border-t border-[#EEEDF3] bg-white px-4 py-3.5">
          <input
            type="text"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleAddCategory()
              }
            }}
            placeholder="New category name, e.g. Medical"
            aria-label="New category name"
            className="h-10 min-w-0 flex-1 rounded-lg border border-[#D5D2E2] bg-white px-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
          />
          <Button
            type="button"
            onClick={handleAddCategory}
            className="!h-10 !rounded-md !bg-[#2D2061] !px-4 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            <Plus className="size-4" strokeWidth={2.25} aria-hidden="true" />
            Add category
          </Button>
        </div>
      </div>

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title="Delete Category"
        itemName={pendingDelete?.name}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

function OrderButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-[#6B6B80] transition-colors hover:bg-[#F5F4FA] hover:text-[#2D2061] disabled:cursor-default disabled:text-[#D5D2E2] disabled:hover:bg-transparent"
    >
      {children}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* Small bits                                                                 */
/* -------------------------------------------------------------------------- */

function IconButton({
  label,
  onClick,
  disabled = false,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-md text-[#6B6B80] transition-colors hover:bg-[#F5F4FA] hover:text-[#2D2061]',
        disabled &&
          'cursor-default text-[#D5D2E2] hover:bg-transparent hover:text-[#D5D2E2]',
      )}
    >
      {children}
    </button>
  )
}
