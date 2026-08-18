import type { ReactNode } from 'react'
import { ChevronDown, ChevronsUpDown, Settings } from 'lucide-react'
import { cn } from '../../lib/cn'

/**
 * Shared light data-table theme (Applications + future list pages).
 * Exact design: white surface, title-case grey headers with dual carets,
 * no vertical rules, only a line under the header, open row spacing.
 */

/** Fixed width so header + body checkboxes stay vertically aligned */
export const DATA_TABLE_CHECKBOX_CELL =
  'w-12 min-w-12 max-w-12 px-0 text-center align-middle'

export type DataTableProps = {
  children: ReactNode
  className?: string
  footer?: ReactNode
  minWidthClassName?: string
}

export function DataTable({
  children,
  className,
  footer,
  minWidthClassName = 'min-w-[62rem] sm:min-w-[72rem] lg:min-w-[78rem]',
}: DataTableProps) {
  return (
    <div className={cn('w-full min-w-0 bg-white', className)}>
      <div className="-mx-1 overflow-x-auto overscroll-x-contain px-1 sm:mx-0 sm:px-0">
        <table
          className={cn(
            'w-full border-collapse text-left text-[13px]',
            minWidthClassName,
          )}
        >
          {children}
        </table>
      </div>
      {footer ? (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {footer}
        </div>
      ) : null}
    </div>
  )
}

export function DataTableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-[#E8E6F0]">{children}</tr>
    </thead>
  )
}

export function DataTableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>
}

export function DataTableRow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <tr
      className={cn(
        'bg-white transition-colors hover:bg-[#FAFAFC]',
        className,
      )}
    >
      {children}
    </tr>
  )
}

export function DataTableTh({
  children,
  className,
  checkbox,
}: {
  children?: ReactNode
  className?: string
  checkbox?: boolean
}) {
  return (
    <th
      className={cn(
        'whitespace-nowrap text-left align-middle text-[12px] font-medium text-[#6B6B80]',
        checkbox
          ? DATA_TABLE_CHECKBOX_CELL
          : 'px-3 pb-3 pt-1',
        checkbox && 'pb-3 pt-1',
        className,
      )}
    >
      {checkbox ? (
        <span className="inline-flex w-full items-center justify-center">
          {children}
        </span>
      ) : (
        children
      )}
    </th>
  )
}

export type SortDirection = 'asc' | 'desc' | null

export type DataTableSortHeaderProps = {
  label: string
  sortable?: boolean
  direction?: SortDirection
  onSort?: () => void
  className?: string
}

export function DataTableSortHeader({
  label,
  sortable = true,
  direction = null,
  onSort,
  className,
}: DataTableSortHeaderProps) {
  if (!sortable) {
    return (
      <DataTableTh className={className}>
        <span>{label}</span>
      </DataTableTh>
    )
  }

  return (
    <DataTableTh className={className}>
      <button
        type="button"
        onClick={onSort}
        className="inline-flex items-center gap-1 text-[12px] font-medium text-[#6B6B80] transition-colors hover:text-[#2D2061]"
      >
        {label}
        <ChevronsUpDown
          className={cn(
            'size-3.5 shrink-0',
            direction ? 'text-[#2D2061]' : 'text-[#B0ACC4]',
          )}
          strokeWidth={2}
          aria-hidden="true"
        />
      </button>
    </DataTableTh>
  )
}

export function DataTableActionsHeader({
  label = 'Action',
  'aria-label': ariaLabel = 'Configure columns',
  onSettingsClick,
}: {
  label?: string
  'aria-label'?: string
  /** Opens column configuration (gear icon). */
  onSettingsClick?: () => void
}) {
  return (
    <DataTableTh className="pr-1">
      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#6B6B80]">
        {label}
        {onSettingsClick ? (
          <button
            type="button"
            onClick={onSettingsClick}
            aria-label={ariaLabel}
            className="inline-flex size-7 items-center justify-center rounded-md text-[#6B6B80] transition-colors hover:bg-[#F2F1F6] hover:text-[#2D2061] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D2061]/25"
          >
            <Settings className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        ) : (
          <Settings
            className="size-3.5 text-[#6B6B80]"
            strokeWidth={1.75}
            aria-label={ariaLabel}
          />
        )}
      </span>
    </DataTableTh>
  )
}

export function DataTableTd({
  children,
  className,
  muted,
  strong,
  checkbox,
}: {
  children?: ReactNode
  className?: string
  muted?: boolean
  strong?: boolean
  /** Use for the select column so boxes match the header control */
  checkbox?: boolean
}) {
  return (
    <td
      className={cn(
        'whitespace-nowrap align-middle text-[13px] text-[#2A2740]',
        checkbox
          ? DATA_TABLE_CHECKBOX_CELL
          : 'px-3 py-4',
        checkbox && 'py-4',
        muted && 'font-normal text-[#3D3A52]',
        strong && 'font-semibold text-[#1A1A2E]',
        className,
      )}
    >
      {checkbox ? (
        <span className="inline-flex w-full items-center justify-center">
          {children}
        </span>
      ) : (
        children
      )}
    </td>
  )
}

export function DataTableEmpty({
  colSpan,
  children = 'No results found.',
}: {
  colSpan: number
  children?: ReactNode
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="bg-white px-4 py-12 text-center text-sm text-[#8B8B9E]"
      >
        {children}
      </td>
    </tr>
  )
}

export type DataTablePaginationProps = {
  rowsPerPage: number
  rowsPerPageOptions?: number[]
  onRowsPerPageChange: (rows: number) => void
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  totalLabel?: string
  pagination: ReactNode
}

export function DataTablePaginationBar({
  rowsPerPage,
  rowsPerPageOptions = [5, 10, 20, 50],
  onRowsPerPageChange,
  pagination,
}: Omit<DataTablePaginationProps, 'page' | 'totalPages' | 'onPageChange' | 'totalLabel'> & {
  pagination: ReactNode
  totalLabel?: string
}) {
  return (
    <>
      <div className="flex items-center gap-2.5">
        <span className="text-[13px] font-normal text-[#6B6B80]">
          Items per page
        </span>
        <div className="relative">
          <select
            value={String(rowsPerPage)}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="h-9 appearance-none rounded-md border border-[#D5D2E2] bg-white py-0 pl-3 pr-8 text-[13px] font-medium text-[#2A2740] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
          >
            {rowsPerPageOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-[#6B6B80]"
            aria-hidden="true"
          />
        </div>
      </div>
      {pagination}
    </>
  )
}

