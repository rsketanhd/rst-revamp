import type { ReactNode } from 'react'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { SideNavigation } from './SideNavigation'
import { cn } from '../../lib/cn'

export type AppShellProps = {
  className?: string
}

export function AppShell({ className }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        'flex h-full min-h-screen w-full overflow-hidden bg-[#f7f7fa]',
        className,
      )}
    >
      <SideNavigation
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
      />

      {/* Right content automatically fills remaining width when sidebar expands/collapses */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export type AppShellSlotProps = {
  children: ReactNode
}
