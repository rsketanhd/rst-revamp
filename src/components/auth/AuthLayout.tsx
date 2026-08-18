import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type AuthLayoutProps = {
  marketing: ReactNode
  children: ReactNode
  className?: string
}

export function AuthLayout({ marketing, children, className }: AuthLayoutProps) {
  return (
    <div
      className={cn(
        'grid h-full min-h-0 w-full grid-cols-1 overflow-y-auto lg:grid-cols-2',
        className,
      )}
    >
      <aside className="relative hidden overflow-hidden lg:block">
        {marketing}
      </aside>
      <main className="relative flex min-h-full flex-col bg-surface">
        {children}
      </main>
    </div>
  )
}
