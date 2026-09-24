import type { ReactNode } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/cn'

export function ProfileFold({
  title,
  open,
  onToggle,
  children,
  aside,
  className,
  headerClassName,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children?: ReactNode
  aside?: ReactNode
  className?: string
  headerClassName?: string
}) {
  return (
    <section className={cn('overflow-hidden rounded-xl border border-[#E8E6F0] bg-white', className)}>
      <div className={cn('flex items-center gap-2 px-4 py-3', headerClassName)}>
        <button
          type="button"
          onClick={onToggle}
          className="min-w-0 flex-1 text-left text-[15px] font-semibold text-[#1A1A2E]"
        >
          {title}
        </button>
        {aside}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
          className="inline-flex size-7 items-center justify-center text-[#6B6B80]"
        >
          {open ? (
            <ChevronDown className="size-4" strokeWidth={2} aria-hidden="true" />
          ) : (
            <ChevronRight className="size-4" strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>
      {open && children ? <div className="px-4 pb-4">{children}</div> : null}
    </section>
  )
}
