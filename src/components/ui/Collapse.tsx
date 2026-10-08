import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type CollapseProps = {
  open: boolean
  children: ReactNode
  className?: string
}

/**
 * Animated expand / collapse (height + fade). Children stay mounted so the
 * closing animation can play; hidden content is removed from tab order.
 */
export function Collapse({ open, children, className }: CollapseProps) {
  return (
    <div
      className={cn(
        'grid transition-[grid-template-rows,opacity] duration-250 ease-[cubic-bezier(0.32,0.72,0,1)]',
        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
      )}
      aria-hidden={open ? undefined : true}
      inert={!open}
    >
      <div className={cn('min-h-0 overflow-hidden', className)}>{children}</div>
    </div>
  )
}
