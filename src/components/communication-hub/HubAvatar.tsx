import { hubAvatarTone, hubInitials } from '../../data/communicationHub'
import { cn } from '../../lib/cn'

export type HubAvatarProps = {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASS = {
  sm: 'size-7 text-[10px]',
  md: 'size-10 text-[12px]',
  lg: 'size-11 text-[13px]',
} as const

export function HubAvatar({ name, size = 'md', className }: HubAvatarProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold',
        SIZE_CLASS[size],
        hubAvatarTone(name),
        className,
      )}
      aria-hidden="true"
    >
      {hubInitials(name)}
    </span>
  )
}
