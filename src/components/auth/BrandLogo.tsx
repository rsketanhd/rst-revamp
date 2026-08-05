import logo from '../../assets/Logo.png'
import { cn } from '../../lib/cn'

export type BrandLogoProps = {
  className?: string
  /** Optional height classes; width stays auto to preserve logo aspect ratio */
  imgClassName?: string
}

export function BrandLogo({
  className,
  imgClassName,
}: BrandLogoProps) {
  return (
    <div className={cn('inline-flex items-center justify-center', className)}>
      <img
        src={logo}
        alt="Recruitment SMART"
        className={cn('h-12 w-auto object-contain', imgClassName)}
      />
    </div>
  )
}
