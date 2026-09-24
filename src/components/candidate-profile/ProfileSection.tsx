import { useState, type ReactNode } from 'react'
import { ChevronDown, Pencil, Plus } from 'lucide-react'
import { cn } from '../../lib/cn'

export type ProfileSectionProps = {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  onAdd?: () => void
  addLabel?: string
  /** Shown only while the section is expanded. */
  onEdit?: () => void
  editLabel?: string
}

export function ProfileSection({
  title,
  children,
  defaultOpen = false,
  onAdd,
  addLabel = 'Add',
  onEdit,
  editLabel = `Edit ${title}`,
}: ProfileSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  function toggle() {
    setOpen((current) => !current)
  }

  return (
    <section className="overflow-hidden rounded-lg border border-[#E6E3EF] bg-white">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <h3 className="min-w-0 flex-1">
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            className="w-full text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8E8AA3] transition-colors hover:text-[#2D2061]"
          >
            {title}
          </button>
        </h3>
        <div className="flex items-center gap-0.5">
          {onAdd ? (
            <button
              type="button"
              onClick={onAdd}
              aria-label={addLabel}
              className="inline-flex size-7 items-center justify-center rounded-md text-[#6B6B80] transition-colors hover:bg-[#F4F2F8] hover:text-[#2D2061]"
            >
              <Plus className="size-4" strokeWidth={2} aria-hidden="true" />
            </button>
          ) : null}
          {open && onEdit ? (
            <button
              type="button"
              onClick={onEdit}
              aria-label={editLabel}
              className="inline-flex size-7 items-center justify-center rounded-md text-[#6B6B80] transition-colors hover:bg-[#F4F2F8] hover:text-[#2D2061]"
            >
              <Pencil className="size-3.5" strokeWidth={2} aria-hidden="true" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
            className="inline-flex size-7 items-center justify-center rounded-md text-[#6B6B80] transition-colors hover:bg-[#F4F2F8] hover:text-[#2D2061]"
          >
            <ChevronDown
              className={cn(
                'size-4 transition-transform',
                open ? 'rotate-0' : '-rotate-90',
              )}
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-[#F0EEF5] px-4 py-4">{children}</div>
      ) : null}
    </section>
  )
}
