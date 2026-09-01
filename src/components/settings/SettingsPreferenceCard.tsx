import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type SettingsPreferenceCardProps = {
  title: string
  description?: string
  action: ReactNode
  className?: string
}

/**
 * Single settings row card — title/description left, control right.
 */
export function SettingsPreferenceCard({
  title,
  description,
  action,
  className,
}: SettingsPreferenceCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-lg border border-[#E8E6F0] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(45,32,97,0.04)] sm:flex-row sm:items-center sm:justify-between sm:px-5',
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-[#2D2061]">{title}</h3>
        {description ? (
          <p className="mt-0.5 text-sm leading-relaxed text-[#8B8B9E]">
            {description}
          </p>
        ) : null}
      </div>
      <div className="shrink-0 sm:pl-4">{action}</div>
    </div>
  )
}
