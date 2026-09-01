import type { ReactNode } from 'react'
import { Pencil, Plus } from 'lucide-react'
import { cn } from '../../lib/cn'

export const PROFILE_SECTION_CLASS =
  'rounded-xl border border-[#E8E6F0] bg-white px-4 py-4 sm:px-5 sm:py-5'

export type ProfileSectionHeaderProps = {
  title: string
  action?: 'edit' | 'add'
  onAction?: () => void
  actionLabel?: string
  className?: string
  children?: ReactNode
}

export function ProfileSectionHeader({
  title,
  action,
  onAction,
  actionLabel,
  className,
}: ProfileSectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3',
        className,
      )}
    >
      <h3 className="text-sm font-bold uppercase tracking-[0.04em] text-[#2D2061]">
        {title}
      </h3>
      {action && onAction ? (
        <button
          type="button"
          onClick={onAction}
          aria-label={actionLabel ?? (action === 'edit' ? 'Edit section' : 'Add new entry')}
          className="inline-flex size-8 items-center justify-center rounded-md text-[#2D2061] transition-colors hover:bg-[#F5F6FF]"
        >
          {action === 'edit' ? (
            <Pencil className="size-4" strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <Plus className="size-4" strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>
      ) : null}
    </div>
  )
}

export type ProfileEmptySectionProps = {
  message: string
  actionLabel?: string
  onAction?: () => void
}

export function ProfileEmptySection({
  message,
  actionLabel = 'Add New',
  onAction,
}: ProfileEmptySectionProps) {
  return (
    <div className="rounded-lg border border-[#E8E6F0] bg-[#FAFAFC] px-4 py-10 text-center">
      <p className="text-sm text-[#8B8B9E]">
        {message}.{' '}
        {onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="font-semibold text-[#2D2061] underline underline-offset-2 transition-colors hover:text-[#241a52]"
          >
            {actionLabel}
          </button>
        ) : null}
      </p>
    </div>
  )
}

export type ProfileFieldProps = {
  label: string
  value: string
}

export function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-[#8B8B9E]">{label}</dt>
      <dd className="mt-1 truncate text-sm font-semibold text-[#2D2061]">{value}</dd>
    </div>
  )
}
