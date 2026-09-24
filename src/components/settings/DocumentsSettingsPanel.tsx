import { useMemo, useState, type ReactNode } from 'react'
import {
  Check,
  CircleHelp,
  FileText,
  Lock,
  Pencil,
  Search,
  Trash2,
} from 'lucide-react'
import {
  Button,
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
  SegmentedControl,
  SidePanel,
  StatusPillBadge,
  Switch,
  Textarea,
  toast,
  type StatusPillOption,
} from '../ui'
import { cn } from '../../lib/cn'
import { SettingsPanel } from './SettingsPanel'

/* -------------------------------------------------------------------------- */
/* Data                                                                       */
/* -------------------------------------------------------------------------- */

const REASON_TAGS = ['Quality', 'Administrative', 'Compliance', 'General'] as const
type ReasonTag = (typeof REASON_TAGS)[number]

type RejectionReason = {
  id: string
  name: string
  tag: ReasonTag
  description: string
  commentRequired: boolean
  active: boolean
  /** System defaults can't be edited or deleted */
  system: boolean
  /** "Other" — permanent, comment always mandatory */
  fixed?: boolean
}

const INITIAL_REASONS: RejectionReason[] = [
  { id: 'unclear', name: 'Unclear / Illegible', tag: 'Quality', description: 'Document scan or photo is blurry, low resolution, or unreadable.', commentRequired: false, active: true, system: true },
  { id: 'wrong-type', name: 'Wrong Document Type', tag: 'Administrative', description: 'Uploaded file does not match the requested credential type.', commentRequired: false, active: true, system: true },
  { id: 'expired', name: 'Expired Document', tag: 'Compliance', description: 'Validity date has passed for passport, visa, or professional license.', commentRequired: false, active: true, system: true },
  { id: 'incomplete', name: 'Incomplete / Missing Pages', tag: 'Quality', description: 'Multi-page document lacks key pages or back side.', commentRequired: false, active: true, system: false },
  { id: 'mismatch', name: 'Name / Details Mismatch', tag: 'Compliance', description: 'Candidate name, DOB, or identifiers do not match application details.', commentRequired: false, active: true, system: false },
  { id: 'wrong-category', name: 'Wrong Category', tag: 'Administrative', description: 'Uploaded under an incorrect category slot (e.g. medical in identity).', commentRequired: false, active: true, system: false },
  { id: 'other', name: 'Other', tag: 'General', description: 'Custom reason specified by recruiter. Comment is strictly mandatory.', commentRequired: true, active: true, system: true, fixed: true },
]

const TAG_CLASS: Record<ReasonTag, string> = {
  Quality: 'bg-[#E8F1FE] text-[#2F6FD6]',
  Administrative: 'bg-[#F3EAFE] text-[#8A3FFC]',
  Compliance: 'bg-[#EEEEF2] text-[#4A4760]',
  General: 'bg-[#EEEEF2] text-[#4A4760]',
}

type DocumentCategory = {
  id: string
  name: string
  description: string
  system: boolean
}

const INITIAL_CATEGORIES: DocumentCategory[] = [
  { id: 'identity', name: 'Identity Proof', description: 'Passport, National Identity Card, Driver License', system: true },
  { id: 'onboarding', name: 'Onboarding & Offer Documents', description: 'Signed offer letter, employee NDA, direct deposit agreement', system: true },
  { id: 'education', name: 'Education Credentials', description: 'Graduation degree certificates, academic transcripts', system: true },
  { id: 'medical', name: 'Medical Reports', description: 'Occupational health clearance, fitness certificate', system: false },
  { id: 'experience', name: 'Experience & Relieving Letters', description: 'Previous employment certificates, pay stubs, reference letters', system: false },
]

const FILE_SIZE_OPTIONS = [
  { value: '10', label: '10 MB per file' },
  { value: '25', label: '25 MB per file (Default Recommended)' },
  { value: '50', label: '50 MB per file' },
  { value: '100', label: '100 MB per file' },
]

const EXTENSIONS = ['PDF', 'DOCX', 'PNG', 'JPG'] as const

const ACTIVE_PILL: StatusPillOption = {
  value: 'active',
  label: 'Active',
  className: 'bg-[#E6F6EC] text-[#15803D]',
  dotClassName: 'bg-[#15803D]',
}

const INACTIVE_PILL: StatusPillOption = {
  value: 'inactive',
  label: 'Deactivated',
  className: 'bg-[#F0EFF4] text-[#6B6B80]',
  dotClassName: 'bg-[#A0A0B2]',
}

const TH =
  'bg-[#F7F7FA] !pt-3 !pb-3 !text-[10px] !font-bold uppercase tracking-[0.04em] !text-[#1A1A2E]'

type StatusFilter = 'all' | 'active' | 'deactivated'

/* -------------------------------------------------------------------------- */
/* Panel                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Settings → Module Configuration → Candidates → Documents.
 */
export function DocumentsSettingsPanel() {
  return (
    <SettingsPanel
      title="Documents"
      description="Manage your user registration credentials and customize active recruiter daily digest parameters."
    >
      <RejectionReasonsSection />
      <UploadPoliciesSection />
      <CategoryMatrixSection />
    </SettingsPanel>
  )
}

function SectionCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-[#E4E1EE] bg-white p-5 sm:p-7">
      <h3 className="mb-6 text-base font-semibold text-[#1A1A2E]">{title}</h3>
      {children}
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Document Rejection / Revision Reasons                                      */
/* -------------------------------------------------------------------------- */

function RejectionReasonsSection() {
  const [reasons, setReasons] = useState(INITIAL_REASONS)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [editing, setEditing] = useState<RejectionReason | 'new' | null>(null)
  const [pendingDelete, setPendingDelete] = useState<RejectionReason | null>(
    null,
  )

  const activeCount = reasons.filter((r) => r.active).length
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return reasons.filter((r) => {
      if (filter === 'active' && !r.active) return false
      if (filter === 'deactivated' && r.active) return false
      if (!q) return true
      return (
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      )
    })
  }, [reasons, query, filter])

  function saveReason(values: ReasonFormValues) {
    if (editing === 'new') {
      const reason: RejectionReason = {
        id: `reason-${Date.now()}`,
        system: false,
        ...values,
      }
      // Keep "Other" last
      setReasons((current) => {
        const other = current.filter((r) => r.fixed)
        return [...current.filter((r) => !r.fixed), reason, ...other]
      })
      toast.success(`“${values.name}” added.`, { title: 'New Reason' })
    } else if (editing) {
      setReasons((current) =>
        current.map((r) => (r.id === editing.id ? { ...r, ...values } : r)),
      )
      toast.success(`“${values.name}” updated.`, { title: 'Reason updated' })
    }
    setEditing(null)
  }

  function confirmDelete() {
    if (!pendingDelete) return
    setReasons((current) => current.filter((r) => r.id !== pendingDelete.id))
    toast.success(`Removed “${pendingDelete.name}”.`, { title: 'Reason removed' })
    setPendingDelete(null)
  }

  return (
    <SectionCard title="Document Rejection / Revision Reasons">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
            strokeWidth={2}
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reasons or descriptions..."
            aria-label="Search reasons or descriptions"
            className="h-10 w-full rounded-md border border-[#ddd9e8] bg-white py-2 pl-10 pr-3 text-sm text-[#2D2061] outline-none transition-colors placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
          />
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <SegmentedControl
            aria-label="Filter reasons by status"
            value={filter}
            onChange={setFilter}
            className="border-transparent bg-[#F0EFF4]"
            options={[
              { value: 'all', label: `All (${reasons.length})` },
              { value: 'active', label: `Active (${activeCount})` },
              {
                value: 'deactivated',
                label: `Deactivated (${reasons.length - activeCount})`,
              },
            ]}
          />
          <Button
            type="button"
            onClick={() => setEditing('new')}
            className="!h-10 !rounded-md !bg-[#2D2061] px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            New Reason
          </Button>
        </div>
      </div>

      <DataTable minWidthClassName="min-w-[52rem]">
        <DataTableHead className="!border-[#C9C6D6]">
          <DataTableTh className={cn(TH, 'w-16 text-center')}>#</DataTableTh>
          <DataTableTh className={TH}>Reason</DataTableTh>
          <DataTableTh className={cn(TH, 'text-center')}>Comment Required</DataTableTh>
          <DataTableTh className={cn(TH, 'text-center')}>Status</DataTableTh>
          <DataTableTh className={cn(TH, 'pr-8 text-right')}>Actions</DataTableTh>
        </DataTableHead>
        <DataTableBody>
          {filtered.length === 0 ? (
            <DataTableEmpty colSpan={5}>
              No reasons match your search.
            </DataTableEmpty>
          ) : (
            filtered.map((reason) => (
              <DataTableRow
                key={reason.id}
                className="border-b border-[#EEEDF3]"
              >
                <DataTableTd className="!py-5 text-center font-semibold text-[#1A1A2E]">
                  {reasons.indexOf(reason) + 1}
                </DataTableTd>
                <DataTableTd className="!py-5 !whitespace-normal">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[15px] font-bold text-[#1F1B4D]">
                      {reason.name}
                    </span>
                    {reason.fixed ? (
                      <Chip className="bg-[#EEEEF2] text-[#4A4760]">
                        <Lock className="size-2.5" strokeWidth={2.5} aria-hidden="true" />
                        Fixed Default
                      </Chip>
                    ) : null}
                    <Chip className={TAG_CLASS[reason.tag]}>{reason.tag}</Chip>
                  </div>
                  <p className="mt-1 text-[13px] text-[#8B8B9E]">
                    {reason.description}
                  </p>
                </DataTableTd>
                <DataTableTd className="!py-5 text-center">
                  {reason.commentRequired ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#FDE8E8] px-3 py-1.5 text-xs font-medium text-[#C81E1E]">
                      <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                      Yes{reason.fixed ? ' (Mandatory)' : ''}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#F0EFF4] px-3 py-1.5 text-xs font-medium text-[#2A2740]">
                      — No
                    </span>
                  )}
                </DataTableTd>
                <DataTableTd className="!py-5 text-center">
                  {reason.fixed ? (
                    <span className="text-sm text-[#1A1A2E]">
                      Active (Permanent)
                    </span>
                  ) : (
                    <StatusPillBadge
                      option={reason.active ? ACTIVE_PILL : INACTIVE_PILL}
                    />
                  )}
                </DataTableTd>
                <DataTableTd className="!py-5 pr-8 text-right">
                  {reason.system ? (
                    <span className="text-xs text-[#8B8B9E]">System Default</span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <IconButton
                        label={`Edit ${reason.name}`}
                        onClick={() => setEditing(reason)}
                      >
                        <Pencil className="size-4" strokeWidth={1.75} />
                      </IconButton>
                      <IconButton
                        label={`Delete ${reason.name}`}
                        onClick={() => setPendingDelete(reason)}
                      >
                        <Trash2 className="size-4" strokeWidth={1.75} />
                      </IconButton>
                    </span>
                  )}
                </DataTableTd>
              </DataTableRow>
            ))
          )}
        </DataTableBody>
      </DataTable>

      <ReasonFormPanel
        open={editing !== null}
        reason={editing === 'new' ? null : editing}
        onClose={() => setEditing(null)}
        onSave={saveReason}
      />

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title="Delete Reason"
        itemName={pendingDelete?.name}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </SectionCard>
  )
}

type ReasonFormValues = Pick<
  RejectionReason,
  'name' | 'tag' | 'description' | 'commentRequired' | 'active'
>

const EMPTY_REASON: ReasonFormValues = {
  name: '',
  tag: 'Quality',
  description: '',
  commentRequired: false,
  active: true,
}

function ReasonFormPanel({
  open,
  reason,
  onClose,
  onSave,
}: {
  open: boolean
  /** null = create */
  reason: RejectionReason | null
  onClose: () => void
  onSave: (values: ReasonFormValues) => void
}) {
  const [values, setValues] = useState<ReasonFormValues>(EMPTY_REASON)
  const [nameError, setNameError] = useState('')
  const [lastOpenKey, setLastOpenKey] = useState<string | null>(null)

  // Reset the form each time the panel opens (for create or a different reason)
  const openKey = open ? (reason?.id ?? 'new') : null
  if (openKey !== lastOpenKey) {
    setLastOpenKey(openKey)
    if (openKey) {
      setValues(reason ? { ...reason } : EMPTY_REASON)
      setNameError('')
    }
  }

  function handleSave() {
    if (!values.name.trim()) {
      setNameError('Reason name is required.')
      return
    }
    onSave({
      ...values,
      name: values.name.trim(),
      description: values.description.trim(),
    })
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={reason ? 'Edit Reason' : 'New Reason'}
      widthClassName="w-full max-w-[30rem]"
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
            onClick={handleSave}
            className="!h-10 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            {reason ? 'Save' : 'Create'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <Input
          label="Reason Name"
          requiredMark
          placeholder="ex. Unsigned Document"
          value={values.name}
          onChange={(e) => {
            setValues((v) => ({ ...v, name: e.target.value }))
            if (nameError) setNameError('')
          }}
          error={nameError || undefined}
        />
        <Select
          id="reason-tag"
          label="Category"
          options={[...REASON_TAGS]}
          value={values.tag}
          onChange={(e) =>
            setValues((v) => ({ ...v, tag: e.target.value as ReasonTag }))
          }
        />
        <Textarea
          label="Description"
          placeholder="Explain when recruiters should use this reason"
          value={values.description}
          onChange={(e) =>
            setValues((v) => ({ ...v, description: e.target.value }))
          }
          rows={3}
        />
        <div className="rounded-lg border border-[#E4E1EE] px-4 py-3">
          <Switch
            label="Comment Required"
            description="Recruiter must add a comment when using this reason."
            checked={values.commentRequired}
            onCheckedChange={(commentRequired) =>
              setValues((v) => ({ ...v, commentRequired }))
            }
          />
        </div>
        <div className="rounded-lg border border-[#E4E1EE] px-4 py-3">
          <Switch
            label="Active"
            description="Only active reasons are offered when rejecting a document."
            checked={values.active}
            onCheckedChange={(active) => setValues((v) => ({ ...v, active }))}
          />
        </div>
      </div>
    </SidePanel>
  )
}

/* -------------------------------------------------------------------------- */
/* Upload Format & Integrity Policies                                         */
/* -------------------------------------------------------------------------- */

function UploadPoliciesSection() {
  const [maxFiles, setMaxFiles] = useState('20')
  const [fileSize, setFileSize] = useState('25')
  const [extensions, setExtensions] = useState<string[]>([...EXTENSIONS])
  const configured = Number(maxFiles) || 0

  function toggleExtension(ext: string) {
    setExtensions((current) => {
      if (current.includes(ext)) {
        if (current.length === 1) {
          toast.error('Keep at least one approved extension.', {
            title: 'Approved Extensions',
          })
          return current
        }
        return current.filter((e) => e !== ext)
      }
      return [...current, ext]
    })
  }

  return (
    <SectionCard title="Upload Format & Integrity Policies">
      <div className="flex flex-col gap-7">
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <label
              htmlFor="max-files"
              className="text-xs font-semibold uppercase tracking-[0.02em] text-[#6B6B80]"
            >
              Max Files Allowed
            </label>
            <span className="rounded-md bg-[#F3EEFE] px-3 py-1.5 text-xs font-bold text-[#6D28D9]">
              Configured: {configured} files
            </span>
          </div>
          <div className="relative">
            <input
              id="max-files"
              type="number"
              min={1}
              value={maxFiles}
              onChange={(e) => setMaxFiles(e.target.value)}
              className="h-14 w-full rounded-lg border border-[#E4E1EE] bg-white pl-5 pr-24 text-base font-bold text-[#1A1A2E] outline-none transition-colors focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
            />
            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-sm text-[#6B6B80]">
              files max
            </span>
          </div>
          <p className="mt-3 text-xs text-[#6B6B80]">
            Maximum total credential and verification files a candidate is
            permitted to upload. Configured as {configured}.
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.02em] text-[#6B6B80]">
            Max File Size
          </p>
          <Select
            id="max-file-size"
            aria-label="Max file size"
            options={FILE_SIZE_OPTIONS}
            value={fileSize}
            onChange={(e) => setFileSize(e.target.value)}
            className="!h-14 !rounded-lg !border-[#E4E1EE] !pl-5 !text-sm !font-semibold !text-[#1A1A2E]"
          />
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.02em] text-[#6B6B80]">
            Approved Document Extensions
          </p>
          <div className="flex flex-wrap gap-2">
            {EXTENSIONS.map((ext) => {
              const on = extensions.includes(ext)
              return (
                <button
                  key={ext}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleExtension(ext)}
                  className={cn(
                    'inline-flex h-9 items-center gap-2 rounded-md border px-4 text-sm font-bold transition-colors',
                    on
                      ? 'border-[#E6E3F0] bg-[#F3F2F8] text-[#4C2AC7]'
                      : 'border-[#E4E1EE] bg-white text-[#A0A0B2] hover:text-[#6B6B80]',
                  )}
                >
                  {on ? (
                    <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                  ) : null}
                  {ext}
                </button>
              )
            })}
          </div>
          <p className="mt-5 text-xs italic text-[#6B6B80]">
            Files are encrypted at rest using AES-256 and scanned for malware
            prior to recruiter inspection.
          </p>
        </div>
      </div>
    </SectionCard>
  )
}

/* -------------------------------------------------------------------------- */
/* Document Category Retention & Verification Matrix                          */
/* -------------------------------------------------------------------------- */

function CategoryMatrixSection() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES)
  const [pendingDelete, setPendingDelete] = useState<DocumentCategory | null>(
    null,
  )

  function confirmDelete() {
    if (!pendingDelete) return
    setCategories((current) => current.filter((c) => c.id !== pendingDelete.id))
    toast.success(`Removed “${pendingDelete.name}”.`, {
      title: 'Category removed',
    })
    setPendingDelete(null)
  }

  return (
    <SectionCard title="Document Category Retention & Verification Matrix">
      <DataTable minWidthClassName="min-w-[40rem]">
        <DataTableHead className="!border-[#C9C6D6]">
          <DataTableTh className={cn(TH, 'pl-6')}>Category</DataTableTh>
          <DataTableTh className={cn(TH, 'w-40')}>Status</DataTableTh>
          <DataTableTh className={cn(TH, 'w-40 pr-6 text-right')}>Actions</DataTableTh>
        </DataTableHead>
        <DataTableBody>
          {categories.map((category) => (
            <DataTableRow
              key={category.id}
              className="border-b border-[#EEEDF3]"
            >
              <DataTableTd className="!py-3.5 pl-6 !whitespace-normal">
                <div className="flex items-center gap-4">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#E4E1EE] bg-[#F3F2F8] text-[#4C5FD5]">
                    <FileText className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1A1A2E]">
                      {category.name}
                    </p>
                    <p className="mt-0.5 text-[13px] text-[#6B6B80]">
                      {category.description}
                    </p>
                  </div>
                </div>
              </DataTableTd>
              <DataTableTd className="!py-3.5">
                <StatusPillBadge option={ACTIVE_PILL} />
              </DataTableTd>
              <DataTableTd className="!py-3.5 pr-6 text-right">
                {category.system ? (
                  <span className="text-xs text-[#8B8B9E]">System Default</span>
                ) : (
                  <IconButton
                    label={`Delete ${category.name}`}
                    onClick={() => setPendingDelete(category)}
                  >
                    <Trash2 className="size-4" strokeWidth={1.75} />
                  </IconButton>
                )}
              </DataTableTd>
            </DataTableRow>
          ))}
        </DataTableBody>
      </DataTable>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F7F7FA] px-6 py-4">
        <p className="inline-flex items-center gap-2 text-xs text-[#4A4760]">
          <CircleHelp
            className="size-4 shrink-0 text-[#4C5FD5]"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          Categories with Active status appear as upload targets and filter tabs
          for candidate onboarding credentials.
        </p>
        <p className="text-xs font-semibold text-[#1A1A2E]">
          Total: {categories.length} ({categories.length} Active)
        </p>
      </div>

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title="Delete Category"
        itemName={pendingDelete?.name}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </SectionCard>
  )
}

/* -------------------------------------------------------------------------- */
/* Small bits                                                                 */
/* -------------------------------------------------------------------------- */

function Chip({
  className,
  children,
}: {
  className: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.04em]',
        className,
      )}
    >
      {children}
    </span>
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
      className="inline-flex size-8 items-center justify-center rounded-md text-[#6B6B80] transition-colors hover:bg-[#F5F4FA] hover:text-[#2D2061]"
    >
      {children}
    </button>
  )
}
