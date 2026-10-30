import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { CopilotChatPanel } from '../copilot'
import { getUserRole } from '../../lib/auth'
import { getAuthEmail, hasCompletedCopilotSetup } from '../../lib/copilot'
import { cn } from '../../lib/cn'
import { ShellNavProvider } from './ShellNavContext'
import { SideNavigation } from './SideNavigation'

export type AppShellProps = {
  className?: string
}

/** Matches Tailwind `lg` — desktop sidebar vs mobile drawer. */
const DESKTOP_SHELL_MQ = '(min-width: 1024px)'

function getInitialDesktop() {
  if (typeof window === 'undefined') return true
  return window.matchMedia(DESKTOP_SHELL_MQ).matches
}

export function AppShell({ className }: AppShellProps) {
  const [isDesktop, setIsDesktop] = useState(getInitialDesktop)
  const [collapsed, setCollapsed] = useState(() => !getInitialDesktop())
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [copilotOpen, setCopilotOpen] = useState(false)
  const collapsedBeforeMaximize = useRef<boolean | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const userRole = getUserRole()

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_SHELL_MQ)
    function sync() {
      const desktop = media.matches
      setIsDesktop(desktop)
      if (!desktop) {
        setCollapsed(true)
        setMobileNavOpen(false)
      }
    }
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  // Close the mobile drawer on navigation.
  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname])

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

  useEffect(() => {
    if (!mobileNavOpen) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMobileNavOpen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileNavOpen])

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
    if (window.matchMedia(DESKTOP_SHELL_MQ).matches) {
      setCollapsed(false)
    }
  }

  function handleCopilotClose() {
    handleCopilotMaximizedChange(false)
    setCopilotOpen(false)
  }

  const shellNav = useMemo(
    () => ({
      isCompact: !isDesktop,
      mobileNavOpen,
      openMobileNav: () => setMobileNavOpen(true),
      closeMobileNav: () => setMobileNavOpen(false),
      toggleMobileNav: () => setMobileNavOpen((open) => !open),
    }),
    [isDesktop, mobileNavOpen],
  )

  const needsCopilotSetup =
    userRole === 'candidate' && !hasCompletedCopilotSetup(getAuthEmail())
  if (needsCopilotSetup) {
    return <Navigate to="/copilot-setup" replace />
  }

  return (
    <ShellNavProvider value={shellNav}>
      <div
        className={cn(
          'flex h-full max-h-full w-full min-w-0 overflow-hidden bg-white',
          className,
        )}
      >
        {/*
          Desktop rail: CSS-hidden below lg so layout never depends on JS
          matchMedia (DevTools device mode can lag / mis-report).
        */}
        <div className="hidden h-full shrink-0 lg:flex">
          <SideNavigation
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            onAiCopilotClick={() => setCopilotOpen(true)}
          />
        </div>

        {/* Mobile / tablet overlay drawer — out of document flow */}
        <div
          className={cn(
            'fixed inset-0 z-[80] bg-black/45 transition-opacity duration-300 lg:hidden',
            mobileNavOpen
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-0',
          )}
          aria-hidden={!mobileNavOpen}
          onClick={() => setMobileNavOpen(false)}
        />
        <SideNavigation
          drawerMode
          drawerOpen={mobileNavOpen}
          collapsed={false}
          onCollapsedChange={() => {}}
          onAiCopilotClick={() => {
            setMobileNavOpen(false)
            setCopilotOpen(true)
          }}
          className={cn(
            'shadow-[8px_0_32px_rgba(26,22,56,0.18)] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] lg:hidden',
            mobileNavOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none',
          )}
        />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white">
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
    </ShellNavProvider>
  )
}

export type AppShellSlotProps = {
  children: ReactNode
}
