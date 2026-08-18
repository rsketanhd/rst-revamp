import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { AppTopBar } from '../ui/AppTopBar'

export type PageContainerProps = {
  children: ReactNode
  /** Extra classes on the outer page shell (always white). */
  className?: string
  /**
   * Classes for the scrollable content area under the top bar.
   * Default provides standard page padding.
   */
  contentClassName?: string
  /** When false, only the white shell is rendered (no AppTopBar). */
  showTopBar?: boolean
}

/**
 * Standard authenticated page shell.
 *
 * Always uses a **white** page background so every screen (and future pages)
 * stays consistent with Dashboard / Create Job. Prefer this wrapper for all
 * new routes under `AppShell`.
 *
 * Sole primary scroll region for main content (document shell stays non-scrolling).
 */
export function PageContainer({
  children,
  className,
  contentClassName,
  showTopBar = true,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        'flex h-full min-h-0 w-full min-w-0 flex-col overflow-x-hidden overflow-y-auto bg-white',
        className,
      )}
    >
      {showTopBar ? <AppTopBar /> : null}
      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col bg-white p-4 sm:p-6 lg:p-8',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}
