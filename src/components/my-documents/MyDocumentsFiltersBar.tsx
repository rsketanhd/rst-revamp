import { cn } from '../../lib/cn'
import {
  DOCUMENT_TYPE_OPTIONS,
  parseDocumentTypeFilter,
  type MyDocumentCategoryId,
} from '../../data/myDocuments'
import { Select } from '../ui'

export type MyDocumentsFiltersBarProps = {
  typeId: MyDocumentCategoryId | ''
  onTypeChange: (typeId: MyDocumentCategoryId | '') => void
  className?: string
}

/**
 * My Documents — filter the flat list by document type.
 */
export function MyDocumentsFiltersBar({
  typeId,
  onTypeChange,
  className,
}: MyDocumentsFiltersBarProps) {
  const hasFilter = typeId !== ''

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <div className="w-full sm:w-64">
        <Select
          name="documentType"
          aria-label="Document type"
          placeholder="Document Type"
          value={typeId}
          options={DOCUMENT_TYPE_OPTIONS.map((option) => ({
            value: option.id,
            label: option.label,
          }))}
          onChange={(event) =>
            onTypeChange(parseDocumentTypeFilter(event.target.value))
          }
          className="!h-9"
        />
      </div>
      <button
        type="button"
        disabled={!hasFilter}
        onClick={() => onTypeChange('')}
        className="px-1 text-sm font-medium text-[#2D2061] transition-colors hover:text-[#241a52] disabled:cursor-default disabled:text-[#A0A0B2]"
      >
        Clear
      </button>
    </div>
  )
}
