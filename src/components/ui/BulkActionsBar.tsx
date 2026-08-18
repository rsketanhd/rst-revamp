import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

export type BulkActionItem = {
  id: string
  label: string
  icon?: ReactNode
  disabled?: boolean
  /** Optional destructive styling for delete/remove actions */
  destructive?: boolean
}

export type BulkActionsBarProps = {
  /** Number of currently selected items */
  selectedCount: number
  /**
   * Noun shown in the selection summary.
   * Example: `"Jobs"` → `Selected Jobs (3)`
   */
  entityLabel: string
  /** Actions rendered as outline buttons (icons + labels) */
  actions: BulkActionItem[]
  onAction?: (id: string) => void
  /** Called when the trailing X is pressed (typically clears selection) */
  onClear: () => void
  /**
   * Select-all control. When omitted, the checkbox row is hidden.
   */
  selectAll?: {
    checked: boolean
    indeterminate?: boolean
    label?: string
    onChange: (checked: boolean) => void
  }
  className?: string
}

/**
 * Shared bulk-actions strip for list/card screens.
 * Shows above the list when items are selected — pass different `actions` / `entityLabel` per screen.
 */
export function BulkActionsBar({
  selectedCount,
  entityLabel,
  actions,
  onAction,
  onClear,
  selectAll,
  className,
}: BulkActionsBarProps) {
  const selectAllId = useId()
  const checkboxRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!checkboxRef.current || !selectAll) return
    checkboxRef.current.indeterminate = Boolean(selectAll.indeterminate)
  }, [selectAll])

  if (selectedCount <= 0) return null

  return (
    <div
      role="region"
      aria-label="Bulk actions"
      className={cn(
        'flex flex-wrap items-center gap-3 rounded-lg border border-[#e4e1ee] bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(45,32,97,0.04)] sm:gap-4 sm:px-4',
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 sm:gap-4">
        {selectAll ? (
          <>
            <label
              htmlFor={selectAllId}
              className="inline-flex shrink-0 cursor-pointer items-center gap-2"
            >
              <input
                ref={checkboxRef}
                id={selectAllId}
                type="checkbox"
                checked={selectAll.checked}
                onChange={(event) => selectAll.onChange(event.target.checked)}
                className="size-4 shrink-0 rounded border-line accent-[#2D2061]"
              />
              <span className="text-sm font-medium text-[#2D2061]">
                {selectAll.label ?? 'Select All'}
              </span>
            </label>

            <span
              className="hidden h-5 w-px shrink-0 bg-[#e0ddea] sm:block"
              aria-hidden="true"
            />
          </>
        ) : null}

        <p className="text-sm text-[#6B6B80]">
          Selected {entityLabel}{' '}
          <span className="font-bold tabular-nums text-[#2D2061]">
            ({selectedCount})
          </span>
        </p>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              disabled={action.disabled}
              onClick={() => onAction?.(action.id)}
              className={cn(
                'inline-flex h-9 items-center gap-1.5 rounded-md border bg-white px-3 text-xs font-medium transition-colors sm:text-sm',
                action.destructive
                  ? 'border-[#e5b4b4] text-[#b42318] hover:bg-[#fef3f2] disabled:opacity-50'
                  : 'border-[#2D2061] text-[#2D2061] hover:bg-[#f7f6fb] disabled:opacity-50',
                'disabled:cursor-not-allowed',
              )}
            >
              {action.icon ? (
                <span className="inline-flex size-4 shrink-0 items-center justify-center [&>svg]:size-4">
                  {action.icon}
                </span>
              ) : null}
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onClear}
        aria-label="Clear selection"
        className="ml-auto inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[#6B6B80] transition-colors hover:bg-[#f5f4f9] hover:text-[#2D2061]"
      >
        <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
      </button>
    </div>
  )
}
