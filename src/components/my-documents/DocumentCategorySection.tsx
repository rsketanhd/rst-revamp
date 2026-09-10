import { ChevronDown, ChevronUp } from 'lucide-react'
import type { MyDocumentCategory, MyDocumentFile } from '../../data/myDocuments'
import { DocumentFileRow } from './DocumentFileRow'

export type DocumentCategorySectionProps = {
  category: MyDocumentCategory
  expanded: boolean
  onToggle: (categoryId: MyDocumentCategory['id']) => void
  onView: (file: MyDocumentFile) => void
  onDownload: (file: MyDocumentFile) => void
  onSign: (file: MyDocumentFile) => void
}

/**
 * Collapsible document group on My Documents.
 */
export function DocumentCategorySection({
  category,
  expanded,
  onToggle,
  onView,
  onDownload,
  onSign,
}: DocumentCategorySectionProps) {
  const count = category.documents.length
  const panelId = `${category.id}-panel`
  const headerId = `${category.id}-header`

  return (
    <section className="rounded-xl border border-[#E8E6F0] bg-white">
      <button
        type="button"
        id={headerId}
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => onToggle(category.id)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left"
      >
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#2D2061]">
          {category.label}
        </span>
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#EEF0F6] px-1.5 text-[11px] font-semibold text-[#6B6B80]">
          {count}
        </span>
        {expanded ? (
          <ChevronUp
            className="size-4 shrink-0 text-[#8B8B9E]"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        ) : (
          <ChevronDown
            className="size-4 shrink-0 text-[#8B8B9E]"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        )}
      </button>

      {expanded ? (
        <div id={panelId} role="region" aria-labelledby={headerId} className="px-2 pb-2">
          {count === 0 ? (
            <p className="rounded-xl bg-[#FAFAFC] px-4 py-6 text-center text-sm text-[#8B8B9E]">
              No documents in this category yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {category.documents.map((file) => (
                <li key={file.id}>
                  <DocumentFileRow
                    file={file}
                    onView={onView}
                    onDownload={onDownload}
                    onSign={onSign}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </section>
  )
}
