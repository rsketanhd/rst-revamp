import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { MoreVertical } from 'lucide-react'
import { cn } from '../../lib/cn'

export type ThreeDotsMenuItem = {
  id: string
  label: string
  /** Lucide icon node or any custom icon */
  icon?: ReactNode
  onSelect?: () => void
  disabled?: boolean
  /** Optional destructive styling for delete/remove actions */
  destructive?: boolean
}

export type ThreeDotsMenuProps = {
  items: ThreeDotsMenuItem[]
  /**
   * Accessible name for the ⋮ trigger (required for a11y).
   * Example: `"More actions for RST1345"`
   */
  triggerLabel: string
  /**
   * Called when an item is chosen (after item-level `onSelect`).
   * Useful when you map by `id` on the parent screen.
   */
  onItemSelect?: (id: string) => void
  /**
   * Overlay opens on this side of the trigger.
   * Jobs design: menu left of ⋮ with caret pointing right.
   */
  side?: 'left' | 'right'
  /** Vertical alignment relative to the trigger */
  align?: 'center' | 'start' | 'end'
  /** Show the caret pointing at the trigger (design default: true) */
  showCaret?: boolean
  /** Override default vertical ⋮ trigger (custom button content) */
  children?: ReactNode
  className?: string
  triggerClassName?: string
  menuClassName?: string
  /** Controlled open state (optional) */
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

type MenuCoords = {
  top: number
  left: number
  caretTop: number
}

const MENU_GAP = 12
const VIEWPORT_PAD = 8

/**
 * App-wide 3-dots (⋮) menu overlay.
 *
 * Menu is portaled to `document.body` with fixed positioning so it is never
 * clipped by table overflow/scroll containers (first rows, sticky parents, etc.).
 */
export function ThreeDotsMenu({
  items,
  triggerLabel,
  onItemSelect,
  side = 'left',
  align = 'center',
  showCaret = true,
  children,
  className,
  triggerClassName,
  menuClassName,
  open: openProp,
  onOpenChange,
}: ThreeDotsMenuProps) {
  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const [coords, setCoords] = useState<MenuCoords | null>(null)

  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : uncontrolledOpen

  function setOpen(next: boolean) {
    if (!isControlled) setUncontrolledOpen(next)
    onOpenChange?.(next)
    if (!next) setCoords(null)
  }

  function updatePosition() {
    const trigger = triggerRef.current
    const menu = menuRef.current
    if (!trigger || !menu) return

    const rect = trigger.getBoundingClientRect()
    const menuRect = menu.getBoundingClientRect()
    const menuW = menuRect.width || menu.offsetWidth
    const menuH = menuRect.height || menu.offsetHeight

    let left =
      side === 'left'
        ? rect.left - menuW - MENU_GAP
        : rect.right + MENU_GAP

    // Prefer the preferred side; flip if it would leave the viewport
    if (side === 'left' && left < VIEWPORT_PAD) {
      left = rect.right + MENU_GAP
    } else if (
      side === 'right' &&
      left + menuW > window.innerWidth - VIEWPORT_PAD
    ) {
      left = rect.left - menuW - MENU_GAP
    }

    left = Math.min(
      Math.max(VIEWPORT_PAD, left),
      window.innerWidth - menuW - VIEWPORT_PAD,
    )

    let top: number
    if (align === 'start') {
      top = rect.top
    } else if (align === 'end') {
      top = rect.bottom - menuH
    } else {
      top = rect.top + rect.height / 2 - menuH / 2
    }

    // Keep full menu (including first items) inside the viewport
    top = Math.min(
      Math.max(VIEWPORT_PAD, top),
      window.innerHeight - menuH - VIEWPORT_PAD,
    )

    const caretTop = Math.min(
      Math.max(16, rect.top + rect.height / 2 - top),
      menuH - 16,
    )

    setCoords({ top, left, caretTop })
  }

  useLayoutEffect(() => {
    if (!open) return
    updatePosition()
    // Second pass after fonts/layout settle if height changed
    const id = window.requestAnimationFrame(updatePosition)
    return () => window.cancelAnimationFrame(id)
  }, [open, items, side, align])

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (rootRef.current?.contains(target)) return
      if (menuRef.current?.contains(target)) return
      setOpen(false)
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    function handleReposition() {
      updatePosition()
    }

    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleReposition)
    window.addEventListener('scroll', handleReposition, true)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleReposition)
      window.removeEventListener('scroll', handleReposition, true)
    }
  }, [open])

  function handleItemClick(item: ThreeDotsMenuItem) {
    if (item.disabled) return
    item.onSelect?.()
    onItemSelect?.(item.id)
    setOpen(false)
  }

  const menu =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label={triggerLabel}
            style={
              coords
                ? { top: coords.top, left: coords.left }
                : { top: -9999, left: -9999, visibility: 'hidden' as const }
            }
            className={cn(
              'fixed z-[100] min-w-[15.5rem] rounded-xl bg-white py-2.5',
              'shadow-[0_10px_32px_rgba(26,22,56,0.16)] ring-1 ring-black/5',
              menuClassName,
            )}
          >
            {showCaret && coords ? (
              <span
                aria-hidden="true"
                /* Arrow sits on the right edge of the menu, pointing toward the ⋮ */
                className="pointer-events-none absolute left-full -translate-y-1/2 border-y-[7px] border-l-[8px] border-y-transparent border-l-white drop-shadow-sm"
                style={{ top: coords.caretTop }}
              />
            ) : null}

            <ul className="flex max-h-[min(24rem,calc(100vh-1rem))] flex-col overflow-y-auto">
              {items.map((item) => (
                <li key={item.id} role="none">
                  <button
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors',
                      item.destructive
                        ? 'text-[#c62828] hover:bg-[#fdecea]'
                        : 'text-[#3d3a4f] hover:bg-[#f6f5fa] hover:text-[#2D2061]',
                      'disabled:cursor-not-allowed disabled:opacity-45',
                    )}
                    onClick={() => handleItemClick(item)}
                  >
                    {item.icon ? (
                      <span
                        className={cn(
                          'inline-flex size-5 shrink-0 items-center justify-center [&>svg]:size-[1.125rem]',
                          item.destructive
                            ? 'text-[#c62828]'
                            : 'text-[#4a4760]',
                        )}
                      >
                        {item.icon}
                      </span>
                    ) : null}
                    <span className="min-w-0 leading-snug">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>,
          document.body,
        )
      : null

  return (
    <div ref={rootRef} className={cn('relative inline-flex', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={triggerLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        className={cn(
          'inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-[#2D2061] transition-colors hover:bg-[#f4f3f9]',
          triggerClassName,
        )}
        onClick={() => setOpen(!open)}
      >
        {children ?? (
          <MoreVertical
            className="size-5"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        )}
      </button>
      {menu}
    </div>
  )
}

/** @deprecated Prefer `ThreeDotsMenu` — same component, kept for older imports. */
export const ActionMenu = ThreeDotsMenu
export type ActionMenuItem = ThreeDotsMenuItem
export type ActionMenuProps = ThreeDotsMenuProps
