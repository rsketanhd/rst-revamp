import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { SideNavigation } from './SideNavigation'
import { cn } from '../../lib/cn'

export type AppShellProps = {
  className?: string
}

const COMPACT_SHELL_MQ = '(max-width: 1023px)'

function getInitialCollapsed() {
  if (typeof window === 'undefined') return false
  return window.matchMedia(COMPACT_SHELL_MQ).matches
}

export function AppShell({ className }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(getInitialCollapsed)

  // Auto-collapse sidebar on mobile/tablet so main content has usable width.
  useEffect(() => {
    const media = window.matchMedia(COMPACT_SHELL_MQ)
    function syncCollapsed() {
      if (media.matches) setCollapsed(true)
    }
    syncCollapsed()
    media.addEventListener('change', syncCollapsed)
    return () => media.removeEventListener('change', syncCollapsed)
  }, [])

  return (
    <div
      className={cn(
        'flex h-full max-h-full w-full overflow-hidden bg-white',
        className,
      )}
    >
      <SideNavigation
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
      />

      {/* Right content fills remaining width; pages control their own scroll */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export type AppShellSlotProps = {
  children: ReactNode
}
