import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type SettingsPanelProps = {
  title: string
  description?: string
  /** Optional header trailing actions (e.g. Import / Invite buttons). */
  actions?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * White bordered content panel used on Settings pages.
 */
export function SettingsPanel({
  title,
  description,
  actions,
  children,
  className,
}: SettingsPanelProps) {
  return (
    <section
      className={cn(
        'rounded-xl border border-[#E4E1EE] bg-white p-5 sm:p-6',
        className,
      )}
    >
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-[#ECEAF3] pb-4">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-[#2D2061]">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm leading-relaxed text-[#8B8B9E]">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            {actions}
          </div>
        ) : null}
      </header>
      <div className="flex flex-col gap-4 sm:gap-5">{children}</div>
    </section>
  )
}

export type SettingsBlockProps = {
  title: string
  description?: string
  trailing?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
}

/**
 * Sub-section inside a settings panel.
 * Soft gray card surface (`#F8F9FB`) matching Recruiter Credentials design.
 */
export function SettingsBlock({
  title,
  description,
  trailing,
  children,
  footer,
  className,
}: SettingsBlockProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-[#F8F9FB] p-5 sm:p-6',
        className,
      )}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[#1F1F2E]">{title}</h3>
          {description ? (
            <p className="mt-0.5 text-xs text-[#8B8B9E]">{description}</p>
          ) : null}
        </div>
        {trailing}
      </div>
      {children}
      {footer ? (
        <div className="mt-5 flex w-full flex-wrap items-center justify-end gap-3">
          {footer}
        </div>
      ) : null}
    </div>
  )
}
