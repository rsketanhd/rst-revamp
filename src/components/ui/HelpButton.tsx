import { CircleHelp } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button } from './Button'

export type HelpButtonProps = {
  onClick?: () => void
  href?: string
  label?: string
  className?: string
}

export function HelpButton({
  onClick,
  href,
  label = 'Help',
  className,
}: HelpButtonProps) {
  const content = (
    <>
      <CircleHelp className="size-4 shrink-0" aria-hidden="true" />
      {label}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={cn(
          'inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 text-sm font-medium text-ink transition-colors hover:bg-surface-soft',
          className,
        )}
      >
        {content}
      </a>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      aria-label={label}
      className={className}
    >
      {content}
    </Button>
  )
}
