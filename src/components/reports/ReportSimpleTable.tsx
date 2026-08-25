import { cn } from '../../lib/cn'

export type ReportSimpleTableColumn = {
  key: string
  header: string
  align?: 'left' | 'right'
}

export type ReportSimpleTableProps = {
  columns: ReportSimpleTableColumn[]
  rows: Array<Record<string, string | number>>
  className?: string
}

/**
 * Compact table fallback when report "Display by" is set to Table.
 */
export function ReportSimpleTable({
  columns,
  rows,
  className,
}: ReportSimpleTableProps) {
  return (
    <div
      className={cn(
        'overflow-x-auto rounded-lg border border-[#E4E1EE]',
        className,
      )}
    >
      <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[#E8E6F0] bg-[#F7F6FA]">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-3.5 py-2.5 text-xs font-semibold text-[#6B6B80]',
                  column.align === 'right' && 'text-right',
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3.5 py-8 text-center text-sm text-[#8B8B9E]"
              >
                No rows for the selected filters.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr
                key={`row-${index}`}
                className="border-b border-[#F0EEF5] last:border-b-0"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'px-3.5 py-2.5 text-sm text-[#2D2061]',
                      column.align === 'right' &&
                        'text-right tabular-nums font-semibold',
                    )}
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
