import { useState, type ReactNode } from 'react'
import { Check, Download, Eye, FileText, Image, Search, Shield } from 'lucide-react'
import {
  DOCUMENT_FILTERS,
  VAULT_DOCUMENTS,
  type DocumentFilterId,
  type DocumentKind,
  type VaultDocument,
} from '../../data/candidateProfileTabs'
import { toast } from '../ui'
import { cn } from '../../lib/cn'

type DocumentDecision = 'pending' | 'accepted' | 'rejected' | 'verified'

const KIND_CLASS: Record<DocumentKind, string> = {
  pdf: 'bg-[#FDECEC] text-[#E25555]',
  image: 'bg-[#E8F1FE] text-[#3B82F6]',
}

export function CandidateDocumentsPanel() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<DocumentFilterId>('all')
  const [decisions, setDecisions] = useState<Record<string, DocumentDecision>>({})

  const documents = VAULT_DOCUMENTS.filter((document) => {
    const matchesFilter = filter === 'all' || document.category === filter
    const haystack = `${document.title} ${document.tag} ${document.fileName}`.toLowerCase()
    return matchesFilter && haystack.includes(query.trim().toLowerCase())
  })

  function decide(id: string, decision: DocumentDecision) {
    setDecisions((current) => ({ ...current, [id]: decision }))
  }

  return (
    <div className="flex flex-col gap-3">
      <section className="rounded-xl border border-[#E8E6F0] bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#F3EEFF] text-[#6D5BD0]">
              <Shield className="size-5" strokeWidth={2} aria-hidden="true" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[15px] font-semibold text-[#1A1A2E]">Candidate Document Vault</h3>
                <span className="rounded-full bg-[#E7F8EE] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#178A45]">
                  COMPLIANCE READY
                </span>
              </div>
              <p className="mt-1 text-[12px] text-[#8B8B9E]">
                All credentials uploaded by John Huber for recruitment onboarding and verification.
              </p>
            </div>
          </div>
          <dl className="flex gap-2">
            <Stat label="SUBMITTED" value="7" className="border-[#D8D5E2] text-[#1A1A2E]" />
            <Stat label="VERIFIED" value="5" className="border-[#2FBF73] text-[#178A45]" />
            <Stat label="IN REVIEW" value="2" className="border-[#F0A020] text-[#E89412]" />
          </dl>
        </div>
      </section>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative min-w-0 lg:max-w-xs lg:flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#A0A0B2]" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search candidate documents..."
            aria-label="Search candidate documents"
            className="h-10 w-full rounded-lg border border-[#E4E1EC] bg-white pr-3 pl-9 text-[13px] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061]"
          />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Document categories">
          {DOCUMENT_FILTERS.map((item) => {
            const selected = item.id === filter
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={cn(
                  'h-8 rounded-full px-3 text-[12px] font-semibold',
                  selected
                    ? 'bg-[#2D2061] text-white'
                    : 'bg-[#F4F2F8] text-[#5C5870] hover:text-[#2D2061]',
                )}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      {documents.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[#E6E3EF] bg-white px-4 py-10 text-center text-[13px] text-[#8B8B9E]">
          No documents in this category.
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {documents.map((document) => (
            <DocumentRow
              key={document.id}
              document={document}
              decision={decisions[document.id] ?? 'pending'}
              onAccept={() => decide(document.id, 'accepted')}
              onReject={() => decide(document.id, 'rejected')}
              onVerify={() => decide(document.id, 'verified')}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

function Stat({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className: string
}) {
  return (
    <div className={cn('min-w-[5.75rem] rounded-lg border bg-white px-3 py-2', className)}>
      <dt className="text-[10px] font-semibold tracking-[0.04em]">{label}</dt>
      <dd className="mt-1 text-[26px] leading-none font-bold">{value}</dd>
    </div>
  )
}

function DocumentRow({
  document,
  decision,
  onAccept,
  onReject,
  onVerify,
}: {
  document: VaultDocument
  decision: DocumentDecision
  onAccept: () => void
  onReject: () => void
  onVerify: () => void
}) {
  const rejected = decision === 'rejected'

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E8E6F0] bg-white px-3.5 py-3">
      <div className="flex min-w-0 gap-3">
        <span
          className={cn(
            'inline-flex size-10 shrink-0 items-center justify-center rounded-lg',
            KIND_CLASS[document.kind],
          )}
        >
          {document.kind === 'pdf' ? (
            <FileText className="size-5" strokeWidth={2} aria-hidden="true" />
          ) : (
            <Image className="size-5" strokeWidth={2} aria-hidden="true" />
          )}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[14px] font-semibold text-[#1A1A2E]">{document.title}</p>
            <span className="rounded-full bg-[#F4F2F8] px-2 py-0.5 text-[11px] font-medium text-[#6B6B80]">
              {document.tag}
            </span>
            {rejected ? (
              <span className="text-[12px] font-semibold text-[#D14343]">Rejected</span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1F9D55]">
                <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                Verified
              </span>
            )}
          </div>
          <p className="mt-1 text-[12px] text-[#8B8B9E]">
            File: {document.fileName} • Size: {document.size} • Uploaded: {document.uploaded}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <IconAction label={`View ${document.title}`} onClick={() => toast.success('Document preview opened')}>
          <Eye className="size-4" strokeWidth={2} aria-hidden="true" />
        </IconAction>
        <IconAction label={`Download ${document.title}`} onClick={() => toast.success('Download started')}>
          <Download className="size-4" strokeWidth={2} aria-hidden="true" />
        </IconAction>
        <PrimaryAction document={document} decision={decision} onAccept={onAccept} onVerify={onVerify} />
        <button
          type="button"
          onClick={onReject}
          className="h-8 rounded-md border border-[#D5D2E2] bg-white px-3 text-[12px] font-semibold text-[#2D2061] hover:bg-[#F7F6FB]"
        >
          {rejected ? 'Rejected' : 'Reject'}
        </button>
      </div>
    </li>
  )
}

function PrimaryAction({
  document,
  decision,
  onAccept,
  onVerify,
}: {
  document: VaultDocument
  decision: DocumentDecision
  onAccept: () => void
  onVerify: () => void
}) {
  switch (document.primary) {
    case 'accept':
      return (
        <button
          type="button"
          onClick={onAccept}
          className="h-8 rounded-md bg-[#2D2061] px-3 text-[12px] font-semibold text-white hover:bg-[#241a4e]"
        >
          {decision === 'accepted' ? 'Accepted' : 'Accept'}
        </button>
      )
    case 'mark-verified':
      return (
        <button
          type="button"
          onClick={onVerify}
          className="h-8 rounded-md bg-[#E8B931] px-3 text-[12px] font-semibold text-[#3D3208] hover:bg-[#D9AA22]"
        >
          {decision === 'verified' ? 'Verified' : 'Mark Verified'}
        </button>
      )
    default: {
      const unreachable: never = document.primary
      return unreachable
    }
  }
}

function IconAction({
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
      className="inline-flex size-8 items-center justify-center rounded-md bg-[#2D2061] text-white hover:bg-[#241a4e]"
    >
      {children}
    </button>
  )
}
