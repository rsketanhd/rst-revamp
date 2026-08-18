import { useEffect, useState } from 'react'
import { Move } from 'lucide-react'
import { SidePanel } from './SidePanel'
import { Button } from './Button'
import { cn } from '../../lib/cn'

/**
 * Column definition for the configure-columns panel + consuming table.
 * IDs are stable keys used by parents to render the right cells.
 */
export type TableColumnConfig = {
  id: string
  label: string
  /** Whether the column is shown in the table */
  visible: boolean
  /**
   * Required columns stay checked and cannot be hidden
   * (still reorderable unless `locked` is set).
   */
  required?: boolean
  /** Locked columns cannot be dragged or reordered */
  locked?: boolean
}

export type ConfigureColumnsPanelProps = {
  open: boolean
  onClose: () => void
  /** Applied column order + visibility for the active table */
  columns: TableColumnConfig[]
  onApply: (columns: TableColumnConfig[]) => void
  title?: string
}

/**
 * Shared Configure Columns drawer — enable/disable + drag-to-reorder.
 * Reuse on any DataTable that exposes a settings gear on the Action column.
 */
export function ConfigureColumnsPanel({
  open,
  onClose,
  columns,
  onApply,
  title = 'Configure Columns',
}: ConfigureColumnsPanelProps) {
  const [draft, setDraft] = useState<TableColumnConfig[]>(columns)
  const [dragId, setDragId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setDraft(columns.map((col) => ({ ...col })))
    setDragId(null)
    setOverId(null)
  }, [open, columns])

  function handleCancel() {
    setDraft(columns.map((col) => ({ ...col })))
    onClose()
  }

  function handleApply() {
    onApply(draft.map((col) => ({ ...col })))
    onClose()
  }

  function toggleVisible(id: string) {
    setDraft((current) =>
      current.map((col) => {
        if (col.id !== id) return col
        if (col.required) return col
        return { ...col, visible: !col.visible }
      }),
    )
  }

  function moveColumn(fromId: string, toId: string) {
    if (fromId === toId) return
    setDraft((current) => {
      const fromIndex = current.findIndex((c) => c.id === fromId)
      const toIndex = current.findIndex((c) => c.id === toId)
      if (fromIndex < 0 || toIndex < 0) return current

      const from = current[fromIndex]
      const to = current[toIndex]
      if (!from || !to || from.locked || to.locked) return current

      const next = [...current]
      const [removed] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, removed)
      return next
    })
  }

  return (
    <SidePanel
      open={open}
      onClose={handleCancel}
      title={title}
      widthClassName="w-full max-w-[26rem]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleCancel}
            className="!h-10 !min-w-[5.5rem] !rounded-md border-[#2D2061] bg-white px-4 text-sm font-medium text-[#2D2061] hover:bg-[#f7f6fb]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleApply}
            className="!h-10 !min-w-[6.5rem] !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
          >
            Apply Now
          </Button>
        </>
      }
    >
      <ul className="flex flex-col gap-2.5" role="list">
        {draft.map((column) => {
          const isDragging = dragId === column.id
          const isOver = overId === column.id && dragId !== column.id

          return (
            <li
              key={column.id}
              draggable={!column.locked}
              onDragStart={(event) => {
                if (column.locked) {
                  event.preventDefault()
                  return
                }
                setDragId(column.id)
                event.dataTransfer.effectAllowed = 'move'
                event.dataTransfer.setData('text/plain', column.id)
              }}
              onDragEnd={() => {
                setDragId(null)
                setOverId(null)
              }}
              onDragOver={(event) => {
                if (column.locked) return
                event.preventDefault()
                event.dataTransfer.dropEffect = 'move'
                setOverId(column.id)
              }}
              onDragLeave={() => {
                if (overId === column.id) setOverId(null)
              }}
              onDrop={(event) => {
                event.preventDefault()
                const fromId =
                  event.dataTransfer.getData('text/plain') || dragId
                if (fromId) moveColumn(fromId, column.id)
                setDragId(null)
                setOverId(null)
              }}
              className={cn(
                'flex items-center gap-3 rounded-md border border-[#E4E1EE] bg-white px-3 py-2.5 transition-colors',
                !column.locked && 'cursor-grab active:cursor-grabbing',
                isDragging && 'opacity-50',
                isOver && 'border-[#2D2061] bg-[#f7f6fb]',
              )}
            >
              <span
                className={cn(
                  'inline-flex shrink-0 text-[#8B8B9E]',
                  column.locked && 'opacity-40',
                )}
                aria-hidden="true"
              >
                <Move className="size-4" strokeWidth={1.75} />
              </span>

              <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={column.visible}
                  disabled={column.required}
                  onChange={() => toggleVisible(column.id)}
                  className="size-4 shrink-0 rounded border-[#C8C5D6] accent-[#2D2061] disabled:cursor-not-allowed"
                  aria-label={`Show ${column.label} column`}
                />
                <span className="truncate text-sm font-medium text-[#2D2061]">
                  {column.label}
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </SidePanel>
  )
}

/** Visible columns in configured order (for table rendering). */
export function getVisibleTableColumns(
  columns: TableColumnConfig[],
): TableColumnConfig[] {
  return columns.filter((column) => column.visible)
}
