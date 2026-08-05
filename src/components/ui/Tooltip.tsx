import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type TooltipProps = {
  /** Hover / focus label */
  content: string
  children: ReactNode
  /** Preferred placement of the tooltip relative to the trigger */
  side?: 'top' | 'bottom'
  className?: string
}

/**
 * Lightweight hover tooltip used across the app (e.g. job card meta icons).
 */
export function Tooltip({
  content,
  children,
  side = 'top',
  className,
}: TooltipProps) {
  return (
    <span className={cn('group relative inline-flex', className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute left-1/2 z-30 -translate-x-1/2 whitespace-nowrap',
          'rounded-md bg-[#2D2061] px-2.5 py-1 text-[11px] font-medium text-white shadow-md',
          'opacity-0 transition-opacity duration-150',
          'group-hover:opacity-100 group-focus-within:opacity-100',
          side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
        )}
      >
        {content}
        <span
          aria-hidden="true"
          className={cn(
            'absolute left-1/2 size-0 -translate-x-1/2 border-x-4 border-x-transparent',
            side === 'top'
              ? 'top-full border-t-4 border-t-[#2D2061]'
              : 'bottom-full border-b-4 border-b-[#2D2061]',
          )}
        />
      </span>
    </span>
  )
}
