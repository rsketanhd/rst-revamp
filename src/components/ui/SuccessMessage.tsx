import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button } from './Button'

export type SuccessMessageProps = {
  title: string
  description?: string
  /** Primary CTA (solid brand button) */
  primaryAction: {
    label: string
    onClick: () => void
  }
  /** Secondary outlined CTA */
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  icon?: ReactNode
  className?: string
}

/**
 * Full-area success state used after completing wizards (e.g. Job Created).
 */
export function SuccessMessage({
  title,
  description,
  primaryAction,
  secondaryAction,
  icon,
  className,
}: SuccessMessageProps) {
  return (
    <div
      className={cn(
        'flex min-h-[min(60vh,28rem)] flex-col items-center justify-center px-6 py-16 text-center',
        className,
      )}
      role="status"
    >
      <div className="mb-6 inline-flex size-16 items-center justify-center rounded-full bg-[#22A45A] text-white shadow-[0_8px_24px_rgba(34,164,90,0.28)]">
        {icon ?? <Check className="size-8" strokeWidth={2.5} aria-hidden="true" />}
      </div>

      <h2 className="text-xl font-bold tracking-tight text-[#1a1a2e] sm:text-2xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-[#8B8B9E]">{description}</p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button
          type="button"
          onClick={primaryAction.onClick}
          className="min-w-[9.5rem] !bg-[#2D2061] hover:!bg-[#241a52]"
        >
          {primaryAction.label}
        </Button>
        {secondaryAction ? (
          <Button
            type="button"
            variant="outline"
            onClick={secondaryAction.onClick}
            className="min-w-[9.5rem] border-[#2D2061]/40 text-[#2D2061] hover:bg-[#f7f6fb]"
          >
            {secondaryAction.label}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
