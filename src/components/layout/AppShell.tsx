import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { CopilotChatPanel } from '../copilot'
import { getUserRole } from '../../lib/auth'
import { getAuthEmail, hasCompletedCopilotSetup } from '../../lib/copilot'
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
  const [copilotOpen, setCopilotOpen] = useState(false)
  const collapsedBeforeMaximize = useRef<boolean | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const userRole = getUserRole()

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

  // Open chat after first-run setup navigates here with openCopilot state.
  useEffect(() => {
    const state = location.state as { openCopilot?: boolean } | null
    if (!state?.openCopilot) return
    setCopilotOpen(true)
    navigate(
      { pathname: location.pathname, search: location.search },
      { replace: true, state: {} },
    )
  }, [location.pathname, location.search, location.state, navigate])

  function handleCopilotMaximizedChange(maximized: boolean) {
    if (maximized) {
      collapsedBeforeMaximize.current = collapsed
      setCollapsed(true)
      return
    }
    if (collapsedBeforeMaximize.current != null) {
      setCollapsed(collapsedBeforeMaximize.current)
      collapsedBeforeMaximize.current = null
      return
    }
    if (!window.matchMedia(COMPACT_SHELL_MQ).matches) {
      setCollapsed(false)
    }
  }

  function handleCopilotClose() {
    handleCopilotMaximizedChange(false)
    setCopilotOpen(false)
  }

  const needsCopilotSetup =
    userRole === 'candidate' && !hasCompletedCopilotSetup(getAuthEmail())
  if (needsCopilotSetup) {
    return <Navigate to="/copilot-setup" replace />
  }

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
        onAiCopilotClick={() => setCopilotOpen(true)}
      />

      {/* Right content fills remaining width; pages control their own scroll */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white">
          <Outlet />
        </main>
      </div>

      <CopilotChatPanel
        open={copilotOpen}
        onClose={handleCopilotClose}
        onMaximizedChange={handleCopilotMaximizedChange}
      />
    </div>
  )
}

export type AppShellSlotProps = {
  children: ReactNode
}
