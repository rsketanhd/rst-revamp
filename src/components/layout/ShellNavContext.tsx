import { createContext, useContext, type ReactNode } from 'react'

export type ShellNavContextValue = {
  /** Viewport is below the desktop sidebar breakpoint (`max-width: 1023px`). */
  isCompact: boolean
  mobileNavOpen: boolean
  openMobileNav: () => void
  closeMobileNav: () => void
  toggleMobileNav: () => void
}

const ShellNavContext = createContext<ShellNavContextValue | null>(null)

export function ShellNavProvider({
  value,
  children,
}: {
  value: ShellNavContextValue
  children: ReactNode
}) {
  return (
    <ShellNavContext.Provider value={value}>{children}</ShellNavContext.Provider>
  )
}

export function useShellNav(): ShellNavContextValue {
  const value = useContext(ShellNavContext)
  if (!value) {
    return {
      isCompact: false,
      mobileNavOpen: false,
      openMobileNav: () => {},
      closeMobileNav: () => {},
      toggleMobileNav: () => {},
    }
  }
  return value
}
