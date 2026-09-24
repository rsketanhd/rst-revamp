import type { ReactNode } from 'react'
import { Tooltip } from '../ui'
import { cn } from '../../lib/cn'

export function OneWaySettingsShell({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-[#E4E1EE] bg-white p-5 sm:p-6">
      <header className="mb-5 border-b border-[#ECEAF3] pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9A98A8]">
          1 Way Interview
        </p>
        <h2 className="mt-1 text-lg font-bold text-[#1A1A2E]">{title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-[#8B8B9E]">
          {description}
        </p>
      </header>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

export function OneWayCard({
  title,
  description,
  trailing,
  children,
  className,
}: {
  title: ReactNode
  description?: string
  trailing?: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('rounded-xl bg-[#F7F8FB] px-4 py-4 sm:px-5', className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-[#1A1A2E]">{title}</h3>
          {description ? (
            <p className="mt-0.5 max-w-3xl text-xs leading-relaxed text-[#8B8B9E]">
              {description}
            </p>
          ) : null}
        </div>
        {trailing ? <div className="shrink-0">{trailing}</div> : null}
      </div>
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  )
}

export function InfoHint({ label }: { label: string }) {
  return (
    <Tooltip content={label} side="top" align="start" maxWidth={240}>
      <button
        type="button"
        aria-label={label}
        className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-[#E6E4EE] text-[10px] font-bold leading-none text-[#6B6B80]"
      >
        i
      </button>
    </Tooltip>
  )
}

export function FieldLabel({
  label,
  hint,
}: {
  label: string
  hint: string
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2A2740]">
      {label}
      <InfoHint label={hint} />
    </span>
  )
}
