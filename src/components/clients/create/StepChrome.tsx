import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../../lib/cn'

export function StepHeader({ title }: { title: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-[#2D2061]">{title}</h2>
    </div>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 border-b border-[#eceaf3] pb-2">
      <h3 className="text-sm font-bold text-[#2D2061]">{children}</h3>
    </div>
  )
}

export function FormGrid({
  children,
  cols = 3,
  className,
}: {
  children: ReactNode
  cols?: 1 | 2 | 3 | 4
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4',
        cols === 2 && 'md:grid-cols-2',
        cols === 3 && 'md:grid-cols-2 xl:grid-cols-3',
        cols === 4 && 'md:grid-cols-2 xl:grid-cols-4',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function FieldInput({
  label,
  requiredMark,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  requiredMark?: boolean
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      {label ? (
        <label className="text-xs font-medium text-[#2D2061]">
          {label}
          {requiredMark ? (
            <span className="ml-0.5 text-[#E53935]" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <input
        className={cn(
          'h-11 w-full rounded-md border border-[#ddd9e8] bg-white px-3 text-sm text-[#2D2061]',
          'placeholder:text-[#A0A0B2] outline-none transition-colors',
          'focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10',
          className,
        )}
        {...props}
      />
    </div>
  )
}
