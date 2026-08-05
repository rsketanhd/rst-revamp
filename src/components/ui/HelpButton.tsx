import { CircleHelp } from 'lucide-react'
import { Button } from './Button'

export type HelpButtonProps = {
  onClick?: () => void
  href?: string
  label?: string
}

export function HelpButton({
  onClick,
  href,
  label = 'Help',
}: HelpButtonProps) {
  const content = (
    <>
      <CircleHelp className="size-4" aria-hidden="true" />
      {label}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 text-sm font-medium text-ink transition-colors hover:bg-surface-soft"
      >
        {content}
      </a>
    )
  }

  return (
    <Button variant="outline" size="sm" onClick={onClick} aria-label={label}>
      {content}
    </Button>
  )
}
