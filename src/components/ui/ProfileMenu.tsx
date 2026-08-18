import { useEffect, useId, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import {
  KeyRound,
  LogOut,
  Settings,
  UserRound,
} from 'lucide-react'
import { cn } from '../../lib/cn'

export type ProfileMenuItemId =
  | 'myProfile'
  | 'changePassword'
  | 'settings'
  | 'logout'

export type ProfileMenuProps = {
  open: boolean
  onClose: () => void
  anchorRef: RefObject<HTMLElement | null>
  onItemSelect: (id: ProfileMenuItemId) => void
  className?: string
}

type Coords = { top: number; left: number }

const PANEL_GAP = 8
const VIEWPORT_PAD = 8

const ITEMS: Array<{
  id: ProfileMenuItemId
  label: string
  icon: typeof UserRound
  destructive?: boolean
}> = [
  { id: 'myProfile', label: 'My Profile', icon: UserRound },
  { id: 'changePassword', label: 'Change Password', icon: KeyRound },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'logout', label: 'Logout', icon: LogOut, destructive: true },
]

/**
 * Top-bar profile avatar dropdown — My Profile, Change Password, Settings, Logout.
 */
export function ProfileMenu({
  open,
  onClose,
  anchorRef,
  onItemSelect,
  className,
}: ProfileMenuProps) {
  const panelId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState<Coords | null>(null)

  function updatePosition() {
    const anchor = anchorRef.current
    const panel = panelRef.current
    if (!anchor || !panel) return

    const rect = anchor.getBoundingClientRect()
    const panelW = panel.offsetWidth || 220
    const panelH = panel.offsetHeight || 180

    let left = rect.right - panelW
    left = Math.min(
      Math.max(VIEWPORT_PAD, left),
      window.innerWidth - panelW - VIEWPORT_PAD,
    )

    let top = rect.bottom + PANEL_GAP
    if (top + panelH > window.innerHeight - VIEWPORT_PAD) {
      top = Math.max(VIEWPORT_PAD, rect.top - panelH - PANEL_GAP)
    }

    setCoords({ top, left })
  }

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null)
      return
    }
    updatePosition()
    const onReposition = () => updatePosition()
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)
    return () => {
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (panelRef.current?.contains(target)) return
      if (anchorRef.current?.contains(target)) return
      onClose()
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose, anchorRef])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div
      ref={panelRef}
      id={panelId}
      role="menu"
      aria-label="Account menu"
      style={
        coords
          ? { top: coords.top, left: coords.left }
          : { top: -9999, left: -9999, visibility: 'hidden' as const }
      }
      className={cn(
        'fixed z-[110] min-w-[13.5rem] overflow-hidden rounded-lg border border-[#E4E1EE] bg-white py-1.5',
        'shadow-[0_8px_28px_rgba(26,22,56,0.14)]',
        className,
      )}
    >
      {ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            onClick={() => {
              onItemSelect(item.id)
              onClose()
            }}
            className={cn(
              'flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium transition-colors',
              item.destructive
                ? 'text-[#DC2626] hover:bg-[#FEF2F2]'
                : 'text-[#2D2061] hover:bg-[#F7F6FB]',
            )}
          >
            <Icon
              className="size-4 shrink-0 opacity-80"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            {item.label}
          </button>
        )
      })}
    </div>,
    document.body,
  )
}
